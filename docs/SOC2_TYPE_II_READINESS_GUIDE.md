# 🛡️ SOC 2 Type II Audit Readiness Runbook

A prescriptive compliance verification runbook for organizations preparing for a SOC 2 Type II audit using **Cloud Misconfiguration AI**.

---

## 📋 Trust Services Criteria (TSC) Mapping

### 1. Common Criteria 6.1 (Logical Access Controls)
* **Requirement:** Restrict access to cloud infrastructure and production data based on verified identity.
* **Automated Audit Check:** Ensure 100% of IAM accounts possess MFA and zero console users maintain inactive access keys older than 90 days.

### 2. Common Criteria 6.3 (Least Privilege Authorization)
* **Requirement:** Access to cloud resources is restricted strictly to least-privilege role boundaries.
* **Automated Audit Check:** Detect and flag all `Action: "*"` or `Resource: "*"` wildcard IAM statements.

### 3. Common Criteria 6.6 (Perimeter Boundary Protection)
* **Requirement:** Prevent direct, unauthenticated ingress to sensitive cardholder and customer data environments.
* **Automated Audit Check:** Flag Security Groups and NSGs allowing `0.0.0.0/0` on ports 22, 3389, 3306, 5432, and 27017.

### 4. Common Criteria 6.8 (Encryption at Rest & in Transit)
* **Requirement:** Data stored in object buckets and databases must be cryptographically protected.
* **Automated Audit Check:** Enforce AWS SSE-KMS, Azure Customer-Managed Keys (CMK), and TLS 1.3 in transit.
