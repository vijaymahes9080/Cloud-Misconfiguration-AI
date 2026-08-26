// Enterprise Real-World Historic Cloud Breach Scenario Catalog

export const HISTORIC_BREACH_SCENARIOS = [
  {
    id: 'capital-one-ssrf-2019',
    name: 'Capital One AWS SSRF & WAF Bypass (2019)',
    victim: 'Capital One Financial Corp',
    year: 2019,
    cloud: 'AWS',
    cost: '$190,000,000 (Fines & Settlements)',
    recordsExposed: '106,000,000 credit applications',
    attackVector: 'ModSecurity WAF SSRF flaw querying IMDSv1 to extract credentials for role "WAFRole", dumping 700+ S3 buckets with sync command.',
    rootMisconfigurations: [
      'WAF EC2 instance assigned overly permissive IAM role with s3:*',
      'IMDSv1 enabled allowing unauthenticated HTTP token theft',
      'S3 buckets lacking bucket policies enforcing SSE-KMS'
    ]
  },
  {
    id: 'tesla-k8s-cryptojack-2018',
    name: 'Tesla Kubernetes Dashboard & AWS Key Leak (2018)',
    victim: 'Tesla Motors',
    year: 2018,
    cloud: 'AWS / Kubernetes',
    cost: 'Unauthorized Compute Charges & Telemetry Exposure',
    recordsExposed: 'Vehicle telemetry & internal AWS access keys',
    attackVector: 'Unauthenticated Kubernetes dashboard exposed to internet. Pod environment variables contained plaintext AWS root admin credentials.',
    rootMisconfigurations: [
      'Kubernetes Dashboard UI exposed with no authentication',
      'Secrets passed in plaintext container environment variables',
      'Missing PodSecurityPolicy restricting host namespace'
    ]
  },
  {
    id: 'uber-aws-github-2016',
    name: 'Uber AWS S3 Credential Leak in GitHub (2016)',
    victim: 'Uber Technologies',
    year: 2016,
    cloud: 'AWS',
    cost: '$148,000,000 (FTC Settlement)',
    recordsExposed: '57,000,000 driver & rider records',
    attackVector: 'Hardcoded AWS master IAM keys embedded in a private GitHub repository used by engineers to download unencrypted S3 archives.',
    rootMisconfigurations: [
      'Hardcoded static AWS access keys in source code',
      'No MFA on sensitive AWS API operations',
      'Lack of automated secret scanning in Git pipelines'
    ]
  },
  {
    id: 'microsoft-azure-chaosdb-2021',
    name: 'Microsoft Azure CosmosDB "ChaosDB" Jupyter Token Leak (2021)',
    victim: 'Thousands of Azure Enterprise Customers',
    year: 2021,
    cloud: 'Azure',
    cost: 'High Regulatory Exposure & Urgent Key Rotations',
    recordsExposed: 'Complete read/write master keys for CosmosDB databases',
    attackVector: 'Misconfigured built-in Jupyter notebook feature in CosmosDB allowed privilege escalation to host container and access to other tenants keys.',
    rootMisconfigurations: [
      'Shared multi-tenant execution environment without strong isolation',
      'Excessive internal container privileges'
    ]
  }
];
