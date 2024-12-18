---
title: "Architecting a Secure Pipeline: A Cloud Guide"
pubDate: "2024-12-17"
description: "Exploring the capabilities of cloud-native security in first party codebases."
ttr: "20 min"
author: "Cooper Wallace"
authorImage: "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg"
authorImageAlt: "Cooper Wallace"
image: "/dalle_pipes.webp"
imageAlt: "Secure pipeline image"
tags: CI/CD, infrastructure, containers, devsecops, automation, security, AWS
---

# Building a Secure Container Pipeline with AWS and GitHub Actions: A Comprehensive Guide

## Introduction

In this guide, you'll learn how to build a secure container deployment pipeline that automates security scanning and implements the principle of least privilege. We'll create a system that not only deploys containers but enforces security best practices at every step.

- This guide assumes familiarity with AWS services, basic Docker containerization, and GitHub Actions. Experience with Infrastructure as Code (particularly Terraform) and basic security concepts will be helpful.

## Architecture Overview

Let's first understand what we're building. Below is a diagram outlining a high level view of our pipeline construction. Notice that code originates from a fixed point, and implements into various cloud solutions and infrastructures:

![alttext](/mmc_blog_1.png)

This architecture provides:
- Secure authentication using OIDC
- Automated security scanning
- Centralized security findings
- Containerized application deployment

## Prerequisites

Before starting, ensure you have:
- An AWS account with administrative access
- A GitHub repository
- Terraform installed locally
- AWS CLI configured
- Docker installed locally

## Step 1: Setting Up Secure Authentication

First, let's implement OIDC authentication for secure, temporary credentials. We need these credentials to authenticate against our cloud services. Credentials can be setup and used with terraform.

### 1a- Implementation

```hcl
#~ Configure the OIDC Provider
data "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"
}

#~ GitHub Actions Role
resource "aws_iam_role" "github_actions" {
  name = "${var.project_name}-github-actions-role-${var.environment}"
  path = "/github-actions/"

  #~ Force MFA
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github_actions.arn # data source
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
          }
        }
      }
    ]
  })

  #~ Permission boundary
  permissions_boundary = aws_iam_policy.permission_boundary.arn

  tags = merge(local.common_tags, {
    Role = "GitHubActions"
  })
}
```

Sequence diagram showcasing the AWS OIDC credential with trusted github identity provider:

![alt](/mmc_step_1.png)

## Step 2: Implementing Least Privilege Access

Your policies should be set to provide only the minimum requirements for the respective role to perform its function. This is important because in the event of an STS token compromise, that specific role for an app(s) service can only affect those resources delegated in the federation.

This is a great article that goes over stolen stale tokens and the damage they can cause:

### Internet Archive breach article

credit: [Internet Archive breach](https://www.bleepingcomputer.com/news/security/internet-archive-breached-again-through-stolen-access-tokens/) @bleepingcomputer.com
![Internet Archive breach](/bleep_example.png)

Partial Implementation of granular permissions:

[Github repo with all perms](https://github.com/coopdloop/aqua-sec-hub-aws/blob/main/tf/main.tf)
```hcl
#~ Security Hub Access - Granular permissions
resource "aws_iam_role_policy" "security_hub_access" {
  name = "${var.project_name}-security-hub-access-${var.environment}"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "SecurityHubFindings"
        Effect = "Allow"
        Action = [
          "securityhub:BatchImportFindings",
          "securityhub:GetFindings"
        ]
        Resource = [
          "arn:aws:securityhub:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:hub/default",
          "arn:aws:securityhub:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:finding/*",
          "arn:aws:securityhub:${data.aws_region.current.name}::product/aquasecurity/aquasecurity",
          "arn:aws:securityhub:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:security-product/aquasecurity/aquasecurity"
        ]
      },
      {
        Sid    = "SecurityHubRead"
        Effect = "Allow"
        Action = [
          "securityhub:GetInsights",
          "securityhub:GetInsightResults"
        ]
        Resource = "arn:aws:securityhub:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:hub/default"
      }
    ]
  })
}

#~ Make sure Security Hub is enabled
resource "aws_securityhub_account" "main" {}

#~ Enable Aqua Security integration
resource "aws_securityhub_product_subscription" "aqua" {
  depends_on  = [aws_securityhub_account.main]
  product_arn = "arn:aws:securityhub:${data.aws_region.current.name}::product/aquasecurity/aquasecurity"
}

#~ Enable some Compliance Standards
resource "aws_securityhub_standards_subscription" "aws_foundation" {
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/aws-foundational-security-best-practices/v/1.0.0"
}

```

## Step 3: Setting Up Security Scanning

Security scanning should always result in some actionable information for the security professional, or your developer up-front. This is important because actionable information can be interpreted by automated security processes we will later implement. Your security scanning workflow should follow this pattern:


![alt](/mmc_step_3.png)

This is a minimal implementation of scanning, using aquasecurity trivy.

### 3a- Implementation in GitHub Actions, Trivy

We will be using a toolset from aquasecurity, trivy.

Trivy performs multiple security scans:

- **Vulnerability scanning:** Checks for known CVEs in dependencies and base images
- **IaC scanning:** Identifies misconfigurations in infrastructure code
- **Secret scanning:** Detects exposed credentials and secrets
- **SBOM analysis:** Catalogs all software components for supply chain security

A chunk of what the workflow probably looks like:

```yaml
#~ .github/workflows/deploy.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:

permissions:
  contents: read
  security-events: write # Github Security
  id-token: write # AWS OIDC

jobs:
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      #~ Download ASFF template
      - name: Download ASFF template
        run: |
          mkdir -p .github/templates
          curl -o .github/templates/asff.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/asff.tpl

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        run: |
          docker build -t ${{ steps.login-ecr.outputs.registry }}/demo-app:${{ github.sha }} .
          docker push ${{ steps.login-ecr.outputs.registry }}/demo-app:${{ github.sha }}

      #~ Generate SBOM
      - name: Generate SBOM
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'image'
          image-ref: '${{ steps.login-ecr.outputs.registry }}/demo-app:${{ github.sha }}'
          format: 'cyclonedx'
          output: 'sbom.cdx.json'

      #~ Upload SBOM as artifact
      - name: Upload SBOM
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.cdx.json
          retention-days: 90

      #~ Vulnerability Scanning
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'image'
          image-ref: '${{ steps.login-ecr.outputs.registry }}/demo-app:${{ github.sha }}'
          format: 'template'
          template: '@.github/templates/asff.tpl'
          output: 'report.asff'
          severity: 'CRITICAL,HIGH,MEDIUM'
          scanners: 'vuln'  # Disable secret scanning for speed
        env:
          AWS_REGION: us-east-1
          AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}

      #~ IaC Security Scanning
      - name: Run Trivy IaC scanner
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'config'
          scan-ref: '.'
          format: 'json'
          output: 'iac-report.json'
          severity: 'CRITICAL,HIGH,MEDIUM'
          scanners: 'config'


##~ More can be seen in repo
```

[Github repo with workflow](https://github.com/coopdloop/aqua-sec-hub-aws/blob/main/.github/workflows/deploy.yml)


## Step 4: Container Security Configuration

Your network architecture should look like this:


![alt](/mmc_step_4.png)

### 4a- Implementation

```hcl
resource "aws_ecs_task_definition" "app" {
  family                   = "app"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = 256
  memory                  = 512
  execution_role_arn      = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${aws_ecr_repository.app.repository_url}:latest"
      readonlyRootFilesystem = true
      privileged             = false
      user                   = "1000:1000"
    }
  ])
}
```

## Step 5: Security Hub Integration

The security findings flow should follow this pattern:

Scans from github runners on checked out code trigger and generate report outputs.

![alt](/mmc_step_5.png)

### 5a- Implementation

```hcl
#~ Enable Security Hub
resource "aws_securityhub_account" "main" {}

#~ Enable Security Standards
resource "aws_securityhub_standards_subscription" "aws_foundation" {
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:${data.aws_region.current.name}::standards/aws-foundational-security-best-practices/v/1.0.0"
}

#~ Enable Aqua Security integration
resource "aws_securityhub_product_subscription" "aqua" {
  depends_on  = [aws_securityhub_account.main]
  product_arn = "arn:aws:securityhub:${data.aws_region.current.name}::product/aquasecurity/aquasecurity"
}

#~ Set up finding aggregation
resource "aws_securityhub_finding_aggregator" "example" {
  linking_mode = "ALL_REGIONS"
  depends_on   = [aws_securityhub_account.main]
}
```

## Step 6: SBOM Generation and Management

A Software Bill of Materials (SBOM) is a list of all the components, dependencies, and metadata that make up a software application. SBOMs are important for software security and supply chain risk management.

### Set up automated SBOM generation

```yaml
      #~ SBOM workflow (fs)
      - name: Generate SBOM
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'fs'
          format: 'cyclonedx'
          output: 'sbom.json'

      #~---------OR-----------

      #~ Generate SBOM (container)
      - name: Generate SBOM
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'image'
          image-ref: '${{ steps.login-ecr.outputs.registry }}/demo-app:${{ github.sha }}'
          format: 'cyclonedx'
          output: 'sbom.cdx.json'


      #~ This step is optional, reach out to me for this integration ;)
      - name: Process SBOM
        run: |
          #~ Convert to Security Hub format
          jq -f .github/templates/sbom-to-findings.jq sbom.json > sbom-findings.json

          #~ Import to Security Hub
          aws securityhub batch-import-findings --findings file://sbom-findings.json
```

## Step 7: Monitoring and Alerting

Prioritize alerts based on severity:

- **CRITICAL:** Immediate team notification and automated resource isolation
- **HIGH:** Team notification within 1 hour, manual review required
- **MEDIUM:** Daily review and tracking
- **LOW:** Weekly security review cycle

Set up CloudWatch alerts for security findings, this terraform is a minimal example of this:

```hcl
#~ CloudWatch Alert for Critical Findings
resource "aws_cloudwatch_metric_alarm" "critical_findings" {
  alarm_name          = "critical-security-findings"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name        = "SecurityHubFindingCount"
  namespace          = "AWS/SecurityHub"
  period             = "300"
  statistic          = "Sum"
  threshold          = "0"
  alarm_description  = "Critical security findings detected"
  alarm_actions      = [aws_sns_topic.security_alerts.arn]

  dimensions = {
    Severity = "CRITICAL"
  }
}

#~ SNS Topic for Alerts
resource "aws_sns_topic" "security_alerts" {
  name = "security-findings-alerts"
}

#~ SNS Topic Policy
resource "aws_sns_topic_policy" "security_alerts" {
  arn = aws_sns_topic.security_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action = "SNS:Publish"
        Resource = aws_sns_topic.security_alerts.arn
      }
    ]
  })
}
```

## Step 8: Implementing Security Controls

The ECS task definition implements essential security measures to protect your containerized application.

It makes the root filesystem read-only through **readonlyRootFilesystem = true**,

runs containers without privileges using **privileged = false**

and as a non-root user with **user = "1000:1000"**,

and drops all Linux capabilities via **capabilities = { drop = ["ALL"] }**

to prevent system-level attacks. The configuration disables swap usage with **maxSwap = 0** and **swappiness = 0** to prevent memory-based vulnerabilities,

while directing logs to CloudWatch through **logConfiguration**

for security monitoring. Regular **healthCheck** ensures quick detection and recovery from potential security incidents.

These settings work together to minimize the attack surface and implement the principle of least privilege while maintaining robust monitoring capabilities.

Referenced configuration can be found on my github project terraform code

[Github repo with all definitions](https://github.com/coopdloop/aqua-sec-hub-aws/blob/main/tf/main.tf)

### Set up ECS task security


```hcl
resource "aws_ecs_task_definition" "app" {
  #~ ... previous configuration ...

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${aws_ecr_repository.app.repository_url}:latest"

      # Security Settings
      readonlyRootFilesystem = true
      privileged             = false
      user                   = "1000:1000"

      linuxParameters = {
        capabilities = {
          drop = ["ALL"]
        }
        maxSwap = 0
        swappiness = 0
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "app"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost/ || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])
}
```

## Step 9: Compliance and Audit


Set up continuous compliance monitoring with AWS Config.

AWS Config is a service provided by Amazon Web Services (AWS) that helps customers assess, audit, and monitor their AWS resources for compliance and security.

Best use cases:

**Resource Inventory:** AWS Config provides an inventory of all AWS resources in your account, helping you keep track of the services, instances, and other resources deployed in your environment.

**Change Management:** It tracks and records changes made to AWS resources, including the details of who made the changes and when they were made. This assists in change management and troubleshooting.

**Security and Compliance:** AWS Config helps enforce security and compliance policies by continuously assessing the configurations of resources against predefined rules and policies. It can help identify non-compliance and security vulnerabilities.

**Auditing and Governance:** It enables auditing and governance by providing historical records of resource configurations and changes, which can be useful for audit trails and compliance reporting.

### 9a. Implementation


```hcl
#~ Enable AWS Config
resource "aws_config_configuration_recorder" "config" {
  name     = "config-recorder"
  role_arn = aws_iam_role.config_role.arn

  recording_group {
    all_supported = true
    include_global_resources = true
  }
}

#~ AWS Config Rules
resource "aws_config_config_rule" "ecs_task_definition_user_for_host_mode_check" {
  name = "ecs-task-definition-user-for-host-mode-check"

  source {
    owner             = "AWS"
    source_identifier = "ECS_TASK_DEFINITION_USER_FOR_HOST_MODE_CHECK"
  }

  depends_on = [aws_config_configuration_recorder.config]
}

#~ Create an AWS Config Rule for ECS Task Definition Memory Limit Check
resource "aws_config_config_rule" "ecs_task_definition_memory_hard_limit_check" {
  name = "ecs-task-definition-memory-hard-limit-check"

  source {
    owner             = "AWS"
    source_identifier = "ECS_TASK_DEFINITION_MEMORY_HARD_LIMIT_CHECK"
  }

  depends_on = [aws_config_configuration_recorder.config]
}
```


## Step 10: Testing and Validation

Lets introduce testing early on as part of our _shift-left_ SDLC pipeline.

- Shift left is a DevOps practice that involves moving testing and security practices earlier in the software development lifecycle.

### Pipeline Testing Flow

![alt](/mmc_step_10.png)

#### Test Each Component

For each component _n_, have one test _t_ for each _n_.

##### Test OIDC Authentication
```bash
#~ Test role assumption
aws sts assume-role-with-web-identity \
  --role-arn $ROLE_ARN \
  --web-identity-token $TOKEN \
  --role-session-name "TestSession"
```

##### Test Security Scanning
```yaml
#~ Add this job to your workflow for testing
  test-security-scans:
    runs-on: ubuntu-latest # or private runner // chainguard linux
    steps:
      - name: Test Vulnerability Scan
        uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: 'image'
          image-ref: 'test-image:latest'
          format: 'template'
          template: '@contrib/sarif.tpl'
          output: 'test-results.sarif'

      - name: Validate Results
        run: |
          if jq -e '.runs[0].results' test-results.sarif >/dev/null; then
            echo "Valid SARIF output generated"
          else
            echo "Invalid SARIF output"
            exit 1
          fi
```

##### Test Security Hub Integration
```bash
#!/bin/bash
#~ test-security-hub.sh

#~ Test finding import
cat << EOF > test-finding.json
{
  "Findings": [{
    "SchemaVersion": "2018-10-08",
    "Id": "test-finding-$(date +%s)",
    "ProductArn": "arn:aws:securityhub:${AWS_REGION}:${AWS_ACCOUNT_ID}:product/aquasecurity/aquasecurity",
    "GeneratorId": "Trivy",
    "AwsAccountId": "${AWS_ACCOUNT_ID}",
    "Types": ["Software and Configuration Checks/Test"],
    "CreatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
    "UpdatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
    "Severity": {"Label": "INFORMATIONAL"},
    "Title": "Test Finding",
    "Description": "Test Security Hub Integration",
    "Resources": [{
      "Type": "Test",
      "Id": "test-resource",
      "Partition": "aws",
      "Region": "${AWS_REGION}"
    }]
  }]
}
EOF

aws securityhub batch-import-findings --findings file://test-finding.json
```

Create more tests for each component.

## Step 11: Troubleshooting Guide

### Common Issues and Solutions

This is a simple troubleshooting guide. These are some basic troubleshooting commands that can be ran from a cluster or aws organization administrator.

#### OIDC Authentication Failures

![alt](/mmc_step_11.png)

##### Debug script for OIDC
```bash
#!/bin/bash
#~ oidc-debug.sh

echo "Checking OIDC provider..."
aws iam list-open-id-connect-providers

echo "Checking role trust relationship..."
aws iam get-role --role-name github-actions-role

echo "Checking role policies..."
aws iam list-role-policies --role-name github-actions-role
aws iam list-attached-role-policies --role-name github-actions-role
```

#### Security Hub Integration Issues
```bash
#!/bin/bash
#~ security-hub-debug.sh

echo "Checking Security Hub status..."
aws securityhub get-enabled-standards

echo "Checking Aqua integration..."
aws securityhub list-enabled-products-for-import

echo "Checking recent findings..."
aws securityhub get-findings --filters '{"RecordState": [{"Value": "ACTIVE","Comparison": "EQUALS"}]}'
```

#### Container Deployment Issues
```bash
#!/bin/bash
#~ container-debug.sh

echo "Checking ECS service status..."
aws ecs describe-services \
  --cluster your-cluster \
  --services your-service

echo "Checking container logs..."
aws logs get-log-events \
  --log-group-name /ecs/your-service \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /ecs/your-service \
    --order-by LastEventTime \
    --descending \
    --max-items 1 \
    --query 'logStreams[0].logStreamName' \
    --output text)
```

## Step 12: Monitoring and Alerting Setup

Effective security monitoring requires both visualization and automated response capabilities. This implementation creates a comprehensive monitoring solution that combines real-time dashboards with automated incident response.

### CloudWatch Dashboard

The dashboard provides two critical views:

- **Security Findings:** Tracks CRITICAL and HIGH severity issues from SecurityHub
- **Container Health:** Monitors resource utilization to detect potential security anomalies

![alt](/mmc_step_12.png)

#### 12a Implementation

```hcl
#~ Create centralized security monitoring dashboard
resource "aws_cloudwatch_dashboard" "security" {
  dashboard_name = "security-monitoring"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            #~ Track critical security findings for immediate response
            ["AWS/SecurityHub", "SecurityHubFindingCount", "Severity", "CRITICAL"],
            ["AWS/SecurityHub", "SecurityHubFindingCount", "Severity", "HIGH"]
          ]
          period = 300 # 5-minute intervals for rapid detection
          stat = "Sum"
          region = data.aws_region.current.name
          title = "Security Findings"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            #~ Monitor container resource usage for anomaly detection
            ["AWS/ECS", "CPUUtilization", "ServiceName", aws_ecs_service.main.name],
            ["AWS/ECS", "MemoryUtilization", "ServiceName", aws_ecs_service.main.name]
          ]
          period = 300
          stat = "Average"
          region = data.aws_region.current.name
          title = "Container Metrics"
        }
      }
    ]
  })
}
```

### Automated Response

This Lambda function acts as your automated security responder, taking immediate action on critical findings:

```hcl
#~ Example dummy Lambda function for automated response
resource "aws_lambda_function" "security_response" {
  filename         = "security_response.zip"
  function_name    = "security-finding-response"
  role            = aws_iam_role.lambda_exec.arn
  handler         = "index.handler"
  runtime         = "python3.10"

  environment {
    variables = {
      SNS_TOPIC_ARN = aws_sns_topic.security_alerts.arn
    }
  }
}

#~ EventBridge rule for Security Hub findings
resource "aws_cloudwatch_event_rule" "security_findings" {
  name        = "capture-security-findings"
  description = "Capture all Security Hub findings"

  event_pattern = jsonencode({
    source      = ["aws.securityhub"]
    detail-type = ["Security Hub Findings - Imported"]
    detail = {
      findings = {
        Severity = {
          Label = ["CRITICAL", "HIGH"]
        }
      }
    }
  })
}
```
This setup ensures:

Real-time visibility into security events
Automated response to critical findings
Resource utilization monitoring for anomaly detection
Immediate team notification for high-priority issues

## Step 13: Scaling and Maintenance

### Scaling Architecture

Below shows the scale factor in using AWS managed clusters -> ECS. This is a solid tool for quick application environments needing highly configurable scalable infrastructure, without subjecting to EKS or self-managed kubernetes.

![alt](/mmc_step_13.png)

#### Implementation
```hcl
#~ Auto Scaling for ECS Service Example
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 10
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  name               = "cpu-auto-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 80
  }
}

#~ Multi-region Security Hub
resource "aws_securityhub_finding_aggregator" "multi_region" {
  linking_mode = "ALL_REGIONS"
}
```

## Step 14: Advanced Security Features

### Minimal Trust Implementation

Now comes looking at more layers of our vpc configuration defense, specifically network policy automation and configuration based on heuristics and analysis of apps customer expected states. Simply put, lets put in some simple rules to detect bad actors at the door, and block them! :)

### Btw what is this marketing term 🤡 Zero trust

A good translation of the marketing term is this: Zero Trust architecture treats every request as potentially malicious, requiring continuous validation regardless of source. This means every container, service, and user must be authenticated and authorized for each action - even within our 'trusted' network.

![alt](/mmc_step_14.png)

#### 14a Implementation

```hcl
#~ Critical security note: These permissions follow least-privilege principle
#~ Each role is limited to specific actions on specific resources
#~ Regular audit of these permissions is recommended

#~ AWS IAM Identity Center Integration
resource "aws_iam_role" "sso_role" {
  name = "sso-enhanced-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub": "repo:${var.github_org}/${var.github_repo}:*"
          }
        }
      }
    ]
  })
}

#~ WAF Integration
resource "aws_wafv2_web_acl" "main" {
  name        = "security-monitoring"
  description = "Security monitoring WAF ACL"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWSManagedRulesCommonRuleSetMetric"
      sampled_requests_enabled  = true
    }
  }
}
```

Please follow to Step 15 below for more custom automation.

## Step 15: Response Automation

### Automated Response Flow

This is an ongoing problem in the age of the dead internet. Bots, and malicious actors are abundant. We face an issue in detection and resource control at scale.

Because of this, response automation is crucial to a scaling application, one in which security practitioners can be confident that efforts in mitigating are measurable.

An architect can start with a diagram like this, outlining the sequence of events per finding detected by tooling.

![alt](/mmc_step_15.png)

#### 15a Implementation
```python
#~ Example Lambda function for automated response
import boto3
import json
import os

def handler(event, context):
    finding = json.loads(event['detail']['findings'][0])
    severity = finding['Severity']['Label']

    if severity == 'CRITICAL':
        #~ Block resource
        resource_id = finding['Resources'][0]['Id']
        block_resource(resource_id)

        #~ Create ticket
        create_ticket(finding)

        #~ Alert team
        alert_team(finding)

def block_resource(resource_id):
    #~ Implement resource blocking logic
    pass

def create_ticket(finding):
    #~ Implement ticket creation logic
    pass

def alert_team(finding):
    sns = boto3.client('sns')
    sns.publish(
        TopicArn=os.environ['SNS_TOPIC_ARN'],
        Message=json.dumps(finding),
        Subject='CRITICAL Security Finding'
    )
```

## Step 16: Cost Optimization and Best Practices

### Cost Optimization Strategies

This implementation showcases critical cost optimization strategies for cloud infrastructure while maintaining security best practices. The code establishes essential resource tagging for cost allocation and tracking, ensuring that all resources are properly labeled with environment, project, and cost center information. It implements automated budget monitoring with alerts set to trigger when spending reaches 80% of the monthly $1,000 threshold, providing early warning for potential cost overruns. Additionally, the configuration includes automated cleanup policies for container images, keeping only the most recent 30 images in the ECR repository to prevent unnecessary storage costs. This approach demonstrates a balanced consideration of both security and fiscal responsibility, allowing organizations to maintain control over cloud spending while ensuring proper resource governance through systematic tagging and lifecycle management.

![alt](/mmc_step_16.png)

#### 16a Implementation
```hcl
#~ Cost optimization tagging
locals {
  required_tags = {
    Environment = var.environment
    Project     = var.project_name
    CostCenter  = var.cost_center
    Terraform   = "true"
  }
}

#~ Budget alerts
resource "aws_budgets_budget" "cost" {
  name         = "monthly-budget"
  budget_type  = "COST"
  limit_amount = "1000"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator = "GREATER_THAN"
    threshold          = 80
    threshold_type     = "PERCENTAGE"
    notification_type  = "ACTUAL"
    subscriber_email_addresses = ["team@example.com"]
  }
}

#~ Resource cleanup
resource "aws_ecr_lifecycle_policy" "cleanup" {
  repository = aws_ecr_repository.demo_app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 30 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
```

## Conclusion

And there you have it – a secure pipeline that would make Fort Knox jealous! Remember, in the world of cloud security, paranoia isn't just a state of mind – it's a best practice. Now go forth and deploy with confidence, knowing your containers are locked down tighter than a submarine hatch. Just remember: the best security is like a good referee – if you're doing it right, nobody notices it's there!
P.S. If you found this guide helpful, your containers probably did too – they're just too secure to tell you. 😉
