---
title: "Agentic AI in Security Automation and Compliance: A demonstration"
pubDate: "2025-01-09"
description: "AI safety, non-human identities in narrow AI agentic systems."
ttr: "20 min"
author: "Cooper Wallace"
authorImage: "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg"
authorImageAlt: "Cooper Wallace"
image: "/ai-friend.jpg"
imageAlt: "AI Friendly"
tags: Security, Automation, Compliance, Agentic, AI, AI Safety
---

# Revolutionizing Security Compliance with Agentic AI: A Technical Deep Dive

Thank you for reading this article, let me start with some thoughts:

Tech is more and more dependent on large complex distributed systems, Agentic AI systems, or narrow AI systems,
which are indeed themselves tools with increasing capabilities into [Agents](https://github.blog/ai-and-ml/generative-ai/what-are-ai-agents-and-why-do-they-matter/). Engineers have delegated access to non-human identities the authorization to call endpoints and
synthesize endpoint data on their own, unsupervised to an extent.

## My intuition
As compute gets cheaper by the day, tooling will comprise fully of Agentic
solutions to fulfill requests, and fulfill tasks on a
distributed services systems demand architecture. Think of a system of sufficient complexity that
can analyze an input, strategize and discover near perfect solutions, and mass deploy series of compensating controls to match
varying heightening demands on systems and services, unsupervised to an extent.

The market is expected to grow from USD 29.02 billion in 2024 to an impressive USD 487.7 billion by 2034, registering a robust CAGR of 32.60% during the forecast period from 2025 to 2034.

Although I am skeptical of these market report sites and would advice to seek analysts on the top stocks of each industry for reports, I have to mention the growth in AI is crazy first-hand.

Source: [https://scoop.market.us/democratization-of-ai-market-news/](https://scoop.market.us/democratization-of-ai-market-news/)

![external image agentic ai rise](https://market.us/wp-content/uploads/2024/12/Democratization-of-AI-Market-size-1024x593.jpg)

### Excellent Engineers
_Therefore_, we need brilliant engineers that can create such systems with AI safety in
mind, allowing validators to confirm such systems to ensure alignment with human needs, and contain limits in their models.
This in essence would  make AI ecosystems predicatable.

_AI Predictability is the extent to which key validity indicators of present and future AI ecosystems can be anticipated._

_(My pitch is that) achieving predictability is crucial for fostering trust, liability, control, alignment and safety of AI ecosystems, and thus should be prioritised over performance._

(excellent) source:
[Predictable Artificial Intelligence. (2025, January 7). Arxiv. Retrieved January 9, 2025, from https://arxiv.org/html/2310.06167v3](https://arxiv.org/html/2310.06167v3)

## Let's Build!: The core architecture

Let's talk about Security Compliance Automation, and the forms of systems we can build to automate our security, whilst being able to validate Agentic workflows ourselves.

Compliance requirements grow increasingly complex, organizations struggle to maintain security standards while managing rapid development cycles. This will only be accelerated when AI solutions with delegated access are pursued by companies for their systems of novel software in replacement of humans. This is already on display with [Devin](https://devin.ai/), [Cursor](https://www.cursor.com/), [Copilot](https://github.com/features/copilot), [Apple intelligence](https://www.apple.com/apple-intelligence/), and more.

In this blog, I will go over my simple app that implements concepts such as:
- service_accounts (JIT compensating controls)
- function_calls
- code verification mapping to Agentic AI systems design
- and prompt engineering

Here is a high level of how the app works:


![app_diagram](/agentic_app_overview.png)

[My github project](https://github.com/coopdloop/compliance-ragops)

The essential idea is we want to incorporate an LLM (Large Language Model) to perform data synthesis for us. However, we take this a step further by giving the AI access to our systems with a level of JIT (just-in-time) and JEA (just-enough-access) permissions so that it can perform a certain endpoint request, and synthesize that in a response for us, then lose all access afterwards.

### Function Calls

[What is Function calling?](https://platform.openai.com/docs/guides/function-calling)

The route I have taken is to use OpenAI's Function calling, which is a specialization trained into a model's billion parameters. This allows advanced functions such as interacting with an API spec, as well as requesting against external REST endpoints. Subsequently, our implementation should perform function calls based off it's own analysis and thoughts.

Here is an example JSON of function definition, just declarative:

```json
{
    "name": "assess_vulnerability",
    "description": "Get detailed assessment of a vulnerability",
    "parameters": {
        "type": "object",
        "properties": {
            "vulnerability_id": {"type": "string"},
            "severity": {"type": "string"},
            "package_name": {"type": "string"},
            "description": {"type": "string"},
        },
        "required": ["vulnerability_id"],
    },
},
{
    "name": "get_vulnerability_info",
    "description": "Get vulnerability information from NVD database",
    "parameters": {
        "type": "object",
        "properties": {"cve_id": {"type": "string"}},
        "required": ["cve_id"],
    },
},
...
```

### Safety through Control Mechanisms

An implementation should consist of at least these controls:

1. Bounded Agency:
    1. Predefined function space
    2. Strict parameter validation
    3. Maximum step limits (5 steps)
    4. Controlled API access


2. Authentication & Authorization:
    1. Service account management
    2. JIT permissions
    3. Token-based authentication


3. Monitoring & Logging:
    1. Centralized error handling
    2. Function call tracking
    3. Response validation



## JIT and JEA Token Authorization in Agentic AI Security Analysis

One of the key architectural decisions revolves around secure API access management. The system needs to interact with both internal vulnerability assessment endpoints and external services like the NIST's [National Vulnerability Database (NVD)](https://nvd.nist.gov/vuln). Let's dive into how we implement Just-In-Time (JIT) and Just-Enough-Access (JEA) token authorization to maintain security while allowing the AI agent to make autonomous decisions.

### Understanding the Access Patterns

The AI agent makes decisions about which APIs to call based on its analysis strategy. There are two main types of API calls:

1. Internal vulnerability assessment endpoints (requiring authenticated access)
2. External NVD API calls (public access)

The agent determines which API to use through its reasoning process, as shown in this system prompt:

```python
{
    "role": "system",
    "content": """You are an expert security analyst AI.
    For EVERY vulnerability, you MUST:
    1. Check the NVD database for comprehensive vulnerability details
    2. Use the get_vulnerability_info function to retrieve NVD information
    3. Explain your reasoning for each vulnerability lookup"""
}
```

### JIT Token Generation

When the AI decides to access internal endpoints, we implement Just-In-Time token generation. This means tokens are only created when needed and have a very short lifespan. Here's how we handle this in the `_call_external_api` method:

```python
async def _call_external_api(
    self,
    endpoint: VulnerabilityEndpoint,
    function_args: Dict[str, Any],
    headers: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """Make calls to external vulnerability assessment APIs."""
    async with httpx.AsyncClient() as client:
        try:
            headers = headers or {}
            headers.update(endpoint.headers)

            # Add authentication for assess_vulnerability endpoint

            if endpoint.name == "vulnerability_assessment" and self.service_account:
                token, _ = create_service_token(
                    service_account_id=self.service_account.id,
                    service_name=self.service_account.name,
                )
                headers["Authorization"] = f"Bearer {token}"

                # ... rest of code
```

### Just-Enough-Access Implementation

The JEA implementation ensures that service tokens have the minimum required permissions. Let's look at how we structure this:

```python
class VulnerabilityEndpoint:
    """Configuration for external vulnerability assessment endpoints."""
    def __init__(
        self,
        name: str,
        url: str,
        method: str = "POST",
        headers: Optional[Dict[str, str]] = None,
    ):
        self.name = name
        self.url = url
        self.method = method
        self.headers = headers or {}
```

The endpoints are configured with specific permissions and access patterns:

```python
self.endpoints: Dict[str, VulnerabilityEndpoint] = {
    "assess_vulnerability": VulnerabilityEndpoint(
        name="vulnerability_assessment",
        url="http://localhost:8000/api/scans/assess-vulnerability",
    ),
    "get_vulnerability_info": VulnerabilityEndpoint(
        name="nvd",
        url="https://services.nvd.nist.gov/rest/json/cves/2.0",
        method="GET",
    )
}
```

### AI-Driven Access Control

What makes the implementation unique is that the AI agent itself determines when to use authenticated endpoints versus public ones. This decision-making process is tracked through the function call logging:

```python
def _track_function_call(
    self,
    function_name: str,
    service_name: str,
    status: str,
    location: str
):
    self.function_calls.append({
        "timestamp": datetime.utcnow().isoformat(),
        "function": function_name,
        "service": service_name,
        "status": status,
        "location": location,
    })
```

### Error Handling and Security Boundaries

I've implemented robust error handling for authentication failures:

```python
if response.status_code == 403:
    error_msg = "Authentication failed - check service account configuration"
    logger.error(f"🔒 {error_msg}")
    return {"error": error_msg}
```

### Best Practices and Recommendations

When implementing JIT and JEA in an agentic AI system, consider these key points:

1. **Token Lifecycle Management**: Generate tokens only when needed and ensure they expire quickly
2. **Audit Logging**: Maintain comprehensive logs of all API access decisions
3. **Separation of Concerns**: Keep public and authenticated endpoint configurations separate
4. **Error Handling**: Implement graceful fallbacks for authentication failures
5. **Access Tracking**: Monitor and log all API access patterns for security analysis

### Security Considerations

To enhance the security of your agentic AI system:

1. Implement rate limiting for token generation
2. Use secure token storage and transmission
3. Regular rotation of service account credentials
4. Monitoring of AI decision patterns for potential security anomalies
5. Implementation of circuit breakers for API call patterns



## App Objective

We will allow vulnerability reports to be ingested by our AI Agent backed by our FastAPI application, synthesized, and analyzed with external calls to NVD ([https://nvd.nist.gov/vuln](https://nvd.nist.gov/vuln)), and our own internal API endpoints, to gather information for prompt exhaustion.

I do not supervise what the AI does, it will perform these calls on it's own. I however set limitations and compensating controls to prevent scaling of costs, exploitation, bad behaviors, and infinite loop catching.

A good example of limitations I set is through prompt engineering and staging. This does presume to an extent that GPT4 will only do these tasks, however we secure and monitor any internal API calls, and log that information.

[My github project](https://github.com/coopdloop/compliance-ragops)
```json
    messages = [
        {
            "role": "system",
            "content": """You are an expert security analyst AI.
            For EVERY vulnerability, you MUST:
            1. Check the NVD database for comprehensive vulnerability details
            2. Use the get_vulnerability_info function to retrieve NVD information
            3. Explain your reasoning for each vulnerability lookup

            Mandatory steps for each vulnerability:
            - If CVE ID is present, always call NVD database
            - Log reasoning for why NVD might or might not be relevant
            - Explicitly state if NVD lookup is skipped and why""",
        },
        {
            "role": "user",
            "content": f"""Analyze vulnerability and perform NVD lookup:
            Vulnerability Details: {json.dumps(vuln)}

            Specific instructions:
            - Check if CVE ID is available
            - Use get_vulnerability_info function if possible
            - Provide detailed reasoning""",
        },
    ]
```


Here is some output of the AI process and reasoning.

![agentic logs](/agentic_sets_log.gif)

### The Compliance Challenge

Traditional compliance workflows involve manual review of security scans, policy documents, and compliance requirements. This process is time-consuming and error-prone, often leading to delayed security assessments, missed compliance violations, inconsistent remediation strategies, difficulty maintaining continuous compliance

### AI-Powered Compliance Management

![app demo](/agentic_main_demo.gif)

In this quick preview, I show the dashboard, navigate to Document uploading, then to the scans. The scans have a history, and in the history you can observe AI recommendations, it's Function Calls, and it's though processes.

Here is the user flow

![app demo](/mmc_agentic_user_flow.png)

[My github project](https://github.com/coopdloop/compliance-ragops)

My demo app (to be named) leverages GPT-4's function calling capabilities to create an agentic system that:

1. **Automates Security Analysis**
   - Real-time vulnerability assessment
   - Contextual analysis against compliance policies
   - Intelligent severity classification
   - Automated remediation recommendations

2. **Maintains Continuous Compliance**
   - Dynamic policy-scan correlation
   - Automated compliance impact analysis
   - Real-time compliance status monitoring
   - Trend analysis and forecasting

3. **Streamlines Documentation**
   - Policy document integration
   - Automated evidence collection
   - Smart documentation linking
   - Compliance reporting automation

## Real-World Implementation

Consider a typical compliance workflow:

1. **Security Scanning**
   ```json
   {
     "scan_type": "container",
     "findings": {
       "critical": 2,
       "high": 3,
       "medium": 5
     }
   }
   ```

2. **AI Analysis**
   ```json
   {
     "compliance_impact": {
       "standards_affected": ["ISO27001 A.12.6.1", "SOC2 CC7.1"],
       "required_controls": ["Patch Management", "Vulnerability Management"],
       "compliance_status": "AT_RISK"
     }
   }
   ```

3. **Automated Actions**
   - Generate JIRA tickets
   - Update compliance dashboards
   - Notify stakeholders
   - Schedule remediation

## Benefits for Compliance Engineers

1. **Time Savings**
   - Reduction in manual review time
   - Automated report generation
   - Instant compliance impact analysis

2. **Enhanced Accuracy**
   - Consistent evaluation criteria
   - Comprehensive policy coverage
   - Reduced human error

3. **Proactive Compliance**
   - Real-time violation detection
   - Predictive risk assessment
   - Automated trend analysis

## Future of Compliance

1. **Automated Compliance**
   - Continuous assessment
   - Intelligent remediation
   - Predictive maintenance

2. **AI-Driven Security**
   - Context-aware analysis
   - Dynamic risk assessment
   - Automated response

3. **Streamlined Operations**
   - Reduced manual effort
   - Enhanced accuracy
   - Faster compliance cycles

## Conclusion


The combination of JIT and JEA token authorization in an agentic AI system provides a robust security model while maintaining the flexibility needed for autonomous operation. By carefully managing token generation and access patterns, we can ensure that our AI agent operates securely while making intelligent decisions about API usage.

Remember that this is an evolving field, and security patterns should be regularly reviewed and updated based on new threats and requirements. The key is to maintain the balance between security and functionality while allowing your AI agent to make informed decisions about API access.

Consequently, when we create our Agentic AI systems, we have to be aware of what AI security and safety implementations are available. Our systems must be predictable at the cost of productivity. We must monitor our systems, delegate and revoke access, and specify what exactly our systems are allowed to do.

Please reach out to me if any of this interests you or you are wanting to learn more.

[__coopdevsec@proton.me__](mailto:coopdevsec@proton.me)

Until next post,

~ Cooper
