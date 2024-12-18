---
title: "Building True Infrastructure Trust: A Guide to Decentralized Systems"
pubDate: "2024-12-16"
description: "Diving deep into observing and scaling trust within horizontal scaling infrastructure."
ttr: "12 min"
author: "Cooper Wallace"
authorImage: "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg"
authorImageAlt: "Cooper Wallace"
image: "https://blog-photo-bucket.s3.us-east-1.amazonaws.com/trustpost.webp"
imageAlt: "Trust Infra image"
tags: trust, infrastructure, certificates, kubernetes, scale, rust
---

# Building True Infrastructure Trust: A Security Engineer's Guide to Decentralized Systems

- _This post is inspired by Kelsey Hightowers' [Kubernetes the hard way](https://github.com/kelseyhightower/kubernetes-the-hard-way)._

- *As security engineers, we face a growing challenge: how do we maintain trust and transparency in increasingly distributed infrastructures? The rise of managed services has created a paradox—while making deployment easier, they've obscured our view into the fundamental security architecture of our systems.*

__To get started, lets spin up our own kubernetes cluster to understand infrastructure trust.__

Our stack:
1. Terraform + Azure: Spin up our own required infrastructure.
2. OpenSSL: We will generate our own self signed TLS certificates for secure communication.
3. Cilium: Cluster Networking
4. containerd: Container runtime.
5. CoreDNS: DNS resolution inside the kubernetes cluster.

Our tooling:
1. K9s
2. Starquill
3. good ol' command line


## The Real Problem: Trust Verification at Scale

When you're running multiple Kubernetes clusters across different networks or geographic boundaries, trust becomes exponentially complex. Each node addition introduces new certificates, new trust relationships, and new potential points of failure. The critical questions become:

- How do we verify trust relationships are maintained correctly?
- How can we quickly validate certificate distribution?
- What's our real-time view of our security posture?
- How do we maintain this at scale without sacrificing visibility?

These aren't abstract concerns. They represent real vulnerabilities in our security architecture that need pragmatic solutions.

## Understanding Our Trust Infrastructure

The foundation of Kubernetes security relies on a certificate hierarchy that ensures secure communication between components. However, understanding and maintaining this hierarchy is no trivial task:

```
Root CA
└── Kubernetes CA
    ├── API Server Certificates
    ├── Component Certificates
    └── Node Certificates
```

Each level represents a critical trust relationship that must be maintained and verified. Problems such as expired certificates, misconfigured nodes, or rogue certificate authorities can compromise the entire system.

### Why Trust Chains Are Fragile
A misconfigured or expired certificate can lead to cascading failures across services. Worse, a rogue or compromised Certificate Authority (CA) could undermine the entire trust infrastructure. For example, consider an expired node certificate:
- It disrupts communication between the node and API server.
- It leads to application downtime, triggering alerts and potential SLA violations.
- Without proper monitoring, the issue can go undetected until it affects production systems.

**Visual Representation**
(Screenshot: *A diagram showing a trust chain in Kubernetes and potential failure points..*)
![alttext](https://blog-photo-bucket.s3.us-east-1.amazonaws.com/k8s_vector_mermaid.png)

## Practical Approaches to Trust Management

### Working with Existing Infrastructure
Security engineers rarely start from scratch. More often, we inherit:
- Existing certificate infrastructure
- Established node relationships
- Legacy trust chains
- Mixed deployment patterns

Understanding what exists before adding complexity is crucial. Begin by mapping out your current trust relationships and identifying potential gaps.

### Validation Requirements
Effective trust management hinges on meeting these requirements:
1. **Real-Time Certificate Status Monitoring:** Stay informed about certificate expiration or invalidation.
2. **Cross-Node Trust Verification:** Ensure nodes trust each other as intended.
3. **Distribution Tracking:** Monitor certificate propagation to all nodes.
4. **Expiration Management:** Set alerts for certificates nearing expiration.
5. **Permission Validation:** Confirm certificates match their intended purposes.

## Tools in Our Arsenal

Several tools can simplify trust management, each with strengths and limitations:

1. **Cert-Manager**
   - Automates certificate issuance and renewal in Kubernetes.
   - **Limitation:** Lacks deep cross-node trust validation.

2. **Venafi**
   - Enterprise-grade solution for certificate lifecycle management.
   - **Limitation:** High cost and complexity for small-to-medium environments.

3. **HashiCorp Vault**
   - Offers dynamic secrets and certificate issuance.
   - **Limitation:** Requires significant configuration for distributed systems.

4. **Cloud Provider Tools (AWS, Azure, GCP)**
   - Vendor-specific solutions for certificate management.
   - **Limitation:** Limited visibility and vendor lock-in.

5. **Custom Monitoring with Prometheus**
   - Can track certificate metrics with exporters.
   - **Limitation:** Requires custom development and maintenance.

### A New Approach: Starquill
[Starquill](https://github.com/coopdloop/starquill-k8s-pki-manager) is a Rust-based Kubernetes certificate management and trust validation tool designed to solve the complex challenges of modern distributed infrastructure. Built with a focus on transparency, real-time monitoring, and comprehensive trust chain verification, Starquill provides security engineers with unprecedented visibility into their cluster's certificate ecosystem.

### Key Features
- **Comprehensive Certificate Discovery**: Automatically scan and catalog certificates across Kubernetes clusters
- **Trust Chain Validation**: Verify certificate hierarchies and trust relationships in real-time
- **Distributed Certificate Management**: Track certificate generation, distribution, and expiration
- **Cross-Node Trust Monitoring**: Provide a holistic view of certificate status across infrastructure
- **Certification Generation**: Create new certificates for new cluster setups

(Screenshot: *Starquill dashboard highlighting an expired certificate and its trust impact.*)

Ratatui TUI

![alt](/starquill_primary.png)

React ui interface
![cilium](/starquill_web_ui.png)

[Github Project](https://github.com/coopdloop/starquill-k8s-pki-manager)



## Beyond Traditional Approaches

**1. Manual Certificate Inspection**
- Valuable for deep inspection but impractical for regular monitoring.

**2. Cloud Provider Tools**
- Good for standard deployments but limited by vendor-specific constraints.

**3. Enterprise Platforms**
- Comprehensive but often overkill for focused use cases.

**Emerging Techniques**
Technologies like Distributed Ledger Technology (DLT) or Confidential Computing could redefine how we validate trust in complex environments. For example, DLT could provide immutable trust logs, ensuring transparency in certificate issuance and validation.


## Lets create our infrastructure

Please visit one of my other posts or a future post to see a more in depth cluster creation

1. Create Infrastructure

2. Deploy certs to infrastructure with [Starquill](https://github.com/coopdloop/starquill-k8s-pki-manager)

3. Setup each infrastructure with services

4. Generate kubeconfig with [Starquill](https://github.com/coopdloop/starquill-k8s-pki-manager)

5. k9s

6. Cilium


Please setup the cluster as you see fit, I've used starquill to provision certs, and have manually setup each scheduled service for demo purposes. Starquill or traditional kubernetes setups (minikube, kind) will present you with a kubeconfig to set environmentally.

Below is the general kubernetes cluster components that should be configured.

![alt](/components-of-kubernetes.svg)

After we have configured and setup the control plane and worker nodes,

control:

1. Install ETCD
2. Download k8s binaries
3. Configure and start the kube-api-server
4. Configure and start the kube-controller-manager
5. Configure and start the kube-scheduler

nodes:

1. Download k8s binaries
2. Setup containerd https://github.com/containerd/containerd/blob/main/docs/getting-started.md
3. Configure and start the kubelet



Let's configure the CNI, in which we use Cilium with helm

```bash
helm upgrade -i cilium cilium/cilium --version 1.16.1 \
  --set ipam.mode=kubernetes \
  --set k8sServiceHost=10.0.0.4 \
  --set k8sServicePort=6443 \
  --reuse-values \
  --namespace kube-system
```

![cilium](/cilium_status.png)


We can now network to our nodes.

![cilium](/k9s_nodes.png)

Because our certificates are generated and in place, configured correctly, our control plane can reach our nodes successfully.


## Practical Implementation

1. **Start with Visibility**
   - Map existing trust relationships.
   - Identify critical paths and dependencies.

2. **Establish Validation Processes**
   - Regularly validate trust chains.
   - Monitor certificate distribution and expiration.

3. **Automate Where Sensible**
   - Automate recurring validation tasks.
   - Set up alerts for anomalies.

4. **Prepare for Failures**
   - Implement certificate revocation and recovery plans.
   - Use tools to distribute CRLs (Certificate Revocation Lists) quickly.

Please follow the github repo for upcoming implementations into the codebase for some of these.

## Moving Forward

The challenge of infrastructure trust isn't going away—it's becoming more complex. To stay ahead, security engineers must:
- Build tools tailored to trust verification.
- Maintain visibility into security architecture.
- Adapt to hybrid and multi-cloud complexities.
- Balance automation with human oversight.

Whether using utilities like Starquill, Cert-Manager, or a combination of custom tools, the goal is clear: maintaining genuine trust in distributed systems.

Keep following my posts and I will do a deep dive into building infrastructure at scale with terraform, and using starquill to validate all the nodes + distribute certs.


## Resources and links

- https://github.com/kelseyhightower/kubernetes-the-hard-way
- https://github.com/niwoerner/k8s-the-hard-way-2024
- https://kubernetes.io/docs/concepts/overview/components/
