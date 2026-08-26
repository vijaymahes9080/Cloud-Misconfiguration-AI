// Multi-Cloud Asset Models and Pre-loaded Enterprise Scenarios

export const ENTERPRISE_SCENARIOS = [
  {
    id: 'aws-fintech-ssrf',
    name: 'AWS Fintech — Critical SSRF & IAM S3 Compromise',
    provider: 'AWS',
    account: 'aws-prod-192847192834 (us-east-1)',
    description: 'Public-facing EC2 web portal vulnerable to SSRF, assuming an overly permissive IAM role with S3 Admin access reaching confidential customer financial records.',
    assetCount: 18,
    criticalAssets: ['arn:aws:s3:::fintech-customer-db-backups-2026', 'arn:aws:rds:us-east-1:192847192834:db:prod-transactions-db'],
    nodes: [
      { id: 'internet', label: 'Internet / Adversary', type: 'external', layer: 0, x: 80, y: 220, risk: 'extreme', icon: 'Globe' },
      { id: 'sg-public', label: 'Public SG (0.0.0.0/0:80,443,22)', type: 'network', layer: 1, x: 260, y: 140, risk: 'high', icon: 'ShieldAlert', provider: 'AWS' },
      { id: 'ec2-web', label: 'EC2: WebPortal-Prod-01', type: 'compute', layer: 2, x: 440, y: 140, risk: 'high', icon: 'Server', provider: 'AWS', ip: '54.210.88.19', metadata: { os: 'Ubuntu 22.04', imdsV1: 'Enabled', port: 80 } },
      { id: 'iam-role', label: 'IAM Role: AppServer-S3FullAccess', type: 'iam', layer: 3, x: 620, y: 140, risk: 'critical', icon: 'KeyRound', provider: 'AWS', metadata: { wildcardAction: 's3:*', assumeRole: 'Enabled' } },
      { id: 's3-backup', label: 'S3: fintech-customer-db-backups', type: 'storage', layer: 4, x: 800, y: 140, risk: 'critical', icon: 'Database', provider: 'AWS', crownJewel: true, metadata: { encryption: 'None', publicRead: true, piiRecords: '1.4M users' } },
      { id: 'rds-prod', label: 'RDS: prod-transactions-db', type: 'database', layer: 4, x: 800, y: 300, risk: 'critical', icon: 'HardDrive', provider: 'AWS', crownJewel: true, metadata: { engine: 'PostgreSQL 16', publiclyAccessible: true } },
      { id: 'lambda-etl', label: 'Lambda: TransactionETL-Worker', type: 'compute', layer: 2, x: 440, y: 300, risk: 'medium', icon: 'Cpu', provider: 'AWS' },
      { id: 'vpc-main', label: 'VPC: vpc-fintech-prod (10.0.0.0/16)', type: 'network', layer: 1, x: 260, y: 300, risk: 'low', icon: 'Network', provider: 'AWS' }
    ],
    edges: [
      { from: 'internet', to: 'sg-public', label: 'Direct Public Exposure (Port 22/80/443)', isAttackPath: true },
      { from: 'sg-public', to: 'ec2-web', label: 'Ingress Traffic to Web Server', isAttackPath: true },
      { from: 'ec2-web', to: 'iam-role', label: 'IMDSv1 Credential Theft (SSRF)', isAttackPath: true },
      { from: 'iam-role', to: 's3-backup', label: 'Wildcard S3 Exfiltration Privilege', isAttackPath: true },
      { from: 'iam-role', to: 'rds-prod', label: 'Harvested Master DB Credentials', isAttackPath: true },
      { from: 'vpc-main', to: 'lambda-etl', label: 'Internal Subnet Association', isAttackPath: false },
      { from: 'lambda-etl', to: 'rds-prod', label: 'DB Query Connection', isAttackPath: false }
    ],
    misconfigurations: [
      {
        id: 'MISCONFIG-AWS-001',
        title: 'Wildcard IAM Permission on S3 Production Buckets',
        service: 'IAM / Storage',
        provider: 'AWS',
        resourceId: 'arn:aws:iam::192847192834:role/AppServer-S3FullAccess',
        technicalSeverity: 'High',
        assetCriticality: 'Critical',
        dataSensitivity: 'Confidential PII (1.4M Users)',
        exposure: 'High',
        exploitability: 'High',
        businessDependency: 'Core Transaction Banking',
        complianceViolations: ['CIS AWS 1.16', 'NIST SP 800-53 AC-6', 'PCI DSS 7.1.2', 'SOC 2 CC6.3'],
        financialRiskEstimate: '$1,850,000',
        blastRadius: {
          affectedResources: 14,
          crownJewelsExposed: 2,
          productionServices: 3
        },
        attackStory: 'An attacker exploiting a web application SSRF flaw on EC2 can query IMDSv1 to extract temporary STS credentials for AppServer-S3FullAccess. Because this role has Action: "s3:*", the attacker gains unrestricted download access to raw customer database backups.',
        fixSnippet: {
          terraform: `resource "aws_iam_role_policy" "least_privilege_s3" {
  name = "AppServer-S3-Restricted"
  role = aws_iam_role.app_server_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = "arn:aws:s3:::fintech-app-assets/*"
      }
    ]
  })
}`,
          cli: `aws iam put-role-policy --role-name AppServer-S3FullAccess \\
  --policy-name AppServer-S3-Restricted \\
  --policy-document file://restricted-policy.json`,
          policy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": ["s3:DeleteBucket", "s3:PutBucketPolicy"],
      "Resource": "*"
    }
  ]
}`
        }
      },
      {
        id: 'MISCONFIG-AWS-002',
        title: 'S3 Customer Backup Bucket is Publicly Readable',
        service: 'Storage',
        provider: 'AWS',
        resourceId: 'arn:aws:s3:::fintech-customer-db-backups-2026',
        technicalSeverity: 'High',
        assetCriticality: 'Critical',
        dataSensitivity: 'PII & Financial Ledger',
        exposure: 'Extreme',
        exploitability: 'Trivial',
        businessDependency: 'Disaster Recovery Archive',
        complianceViolations: ['CIS AWS 2.1.5', 'ISO 27001 A.8.24', 'HIPAA 164.312', 'SOC 2 CC6.1'],
        financialRiskEstimate: '$2,400,000',
        blastRadius: {
          affectedResources: 6,
          crownJewelsExposed: 1,
          productionServices: 1
        },
        attackStory: 'Bucket policy allows Principal: "*" with s3:GetObject without authentication tokens, permitting immediate scraping by external automated crawlers.',
        fixSnippet: {
          terraform: `resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.customer_backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`,
          cli: `aws s3api put-public-access-block --bucket fintech-customer-db-backups-2026 \\
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"`,
          policy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceSSLOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::fintech-customer-db-backups-2026/*",
      "Condition": {
        "Bool": { "aws:SecureTransport": "false" }
      }
    }
  ]
}`
        }
      },
      {
        id: 'MISCONFIG-AWS-003',
        title: 'Unrestricted Ingress Security Group (0.0.0.0/0 on SSH Port 22)',
        service: 'Network',
        provider: 'AWS',
        resourceId: 'sg-0982348912ef-prod-ingress',
        technicalSeverity: 'Medium',
        assetCriticality: 'High',
        dataSensitivity: 'Host Shell Access',
        exposure: 'High',
        exploitability: 'Medium',
        businessDependency: 'Production Bastion Host',
        complianceViolations: ['CIS AWS 5.2', 'PCI DSS 1.3', 'NIST SP 800-53 SC-7'],
        financialRiskEstimate: '$450,000',
        blastRadius: {
          affectedResources: 8,
          crownJewelsExposed: 1,
          productionServices: 2
        },
        attackStory: 'Port 22 is exposed to 0.0.0.0/0 allowing automated SSH brute force and exploitation of unpatched OpenSSH vulnerabilities.',
        fixSnippet: {
          terraform: `resource "aws_security_group_rule" "ssh_restricted" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["198.51.100.0/24"] # Authorized Corporate VPN CIDR
  security_group_id = aws_security_group.web_sg.id
}`,
          cli: `aws ec2 revoke-security-group-ingress --group-id sg-0982348912ef --protocol tcp --port 22 --cidr 0.0.0.0/0`,
          policy: `# Enforce corporate bastion IP gateway`
        }
      }
    ]
  },
  {
    id: 'azure-healthcare-hipaa',
    name: 'Azure HealthCloud — Patient PII & Storage Key Leak',
    provider: 'Azure',
    account: 'sub-healthcare-prod-8819 (East US)',
    description: 'Azure App Service with managed identity possessing Contributor rights across resource group, storing unencrypted patient MRI scans in publicly accessible Azure Blob Storage.',
    assetCount: 14,
    criticalAssets: ['/subscriptions/8819/resourceGroups/rg-health/providers/Microsoft.Storage/storageAccounts/stpatientrecords2026'],
    nodes: [
      { id: 'internet', label: 'Internet / Threat Actor', type: 'external', layer: 0, x: 80, y: 220, risk: 'extreme', icon: 'Globe' },
      { id: 'nsg-app', label: 'NSG: nsg-health-portal (0.0.0.0/0:8080)', type: 'network', layer: 1, x: 260, y: 150, risk: 'high', icon: 'ShieldAlert', provider: 'Azure' },
      { id: 'app-service', label: 'App Service: PatientPortal-EastUS', type: 'compute', layer: 2, x: 440, y: 150, risk: 'high', icon: 'Server', provider: 'Azure', ip: '20.120.44.12' },
      { id: 'managed-id', label: 'System Managed Identity (Contributor)', type: 'iam', layer: 3, x: 620, y: 150, risk: 'critical', icon: 'KeyRound', provider: 'Azure' },
      { id: 'blob-records', label: 'Blob: stpatientrecords2026', type: 'storage', layer: 4, x: 800, y: 150, risk: 'critical', icon: 'Database', provider: 'Azure', crownJewel: true, metadata: { hipaaProtected: true, publicBlobAccess: 'Enabled' } },
      { id: 'cosmos-db', label: 'CosmosDB: ClinicalNotes-DB', type: 'database', layer: 4, x: 800, y: 290, risk: 'critical', icon: 'HardDrive', provider: 'Azure', crownJewel: true }
    ],
    edges: [
      { from: 'internet', to: 'nsg-app', label: 'Unrestricted Inbound Internet Route', isAttackPath: true },
      { from: 'nsg-app', to: 'app-service', label: 'Web Application Port 8080 Traffic', isAttackPath: true },
      { from: 'app-service', to: 'managed-id', label: 'MSI Token Extraction via App Hook', isAttackPath: true },
      { from: 'managed-id', to: 'blob-records', label: 'List Keys & Blob Data Exfiltration', isAttackPath: true },
      { from: 'managed-id', to: 'cosmos-db', label: 'Query Full Patient Records API', isAttackPath: true }
    ],
    misconfigurations: [
      {
        id: 'MISCONFIG-AZ-001',
        title: 'Azure Storage Account Public Blob Access Enabled (HIPAA Violation)',
        service: 'Storage',
        provider: 'Azure',
        resourceId: '/subscriptions/8819/.../storageAccounts/stpatientrecords2026',
        technicalSeverity: 'High',
        assetCriticality: 'Critical',
        dataSensitivity: 'Protected Health Info (PHI / HIPAA)',
        exposure: 'Extreme',
        exploitability: 'Trivial',
        businessDependency: 'Patient Diagnostic Archive',
        complianceViolations: ['HIPAA § 164.312(a)(1)', 'CIS Microsoft Azure 3.7', 'SOC 2 CC6.6'],
        financialRiskEstimate: '$3,200,000 (OCR Penalty Risk)',
        blastRadius: { affectedResources: 9, crownJewelsExposed: 2, productionServices: 2 },
        attackStory: 'Public anonymous read access is permitted on containers containing raw medical images and lab findings.',
        fixSnippet: {
          terraform: `resource "azurerm_storage_account" "patient_storage" {
  name                     = "stpatientrecords2026"
  resource_group_name      = azurerm_resource_group.health_rg.name
  location                 = "eastus"
  account_tier             = "Standard"
  account_replication_type = "GRS"

  allow_nested_items_to_be_public = false
  min_tls_version                 = "TLS1_2"
}`,
          cli: `az storage account update --name stpatientrecords2026 --resource-group rg-health --allow-blob-public-access false`,
          policy: `Azure Policy: Deny-Storage-Public-Access`
        }
      }
    ]
  },
  {
    id: 'gcp-saas-k8s',
    name: 'GCP AI Cloud — GKE Privilege Escalation to BigQuery Data Lake',
    provider: 'GCP',
    account: 'gcp-analytics-prod-9921',
    description: 'Kubernetes Pod running with default compute service account having Editor role on GCP project, exposing BigQuery telemetry and ML models.',
    assetCount: 16,
    criticalAssets: ['projects/gcp-analytics-prod-9921/datasets/enterprise_raw_lake'],
    nodes: [
      { id: 'internet', label: 'Internet / Attacker', type: 'external', layer: 0, x: 80, y: 220, risk: 'extreme', icon: 'Globe' },
      { id: 'gcp-lb', label: 'Cloud Load Balancer (Public VIP)', type: 'network', layer: 1, x: 260, y: 150, risk: 'medium', icon: 'Network', provider: 'GCP' },
      { id: 'gke-pod', label: 'GKE Pod: analytics-worker-pod', type: 'compute', layer: 2, x: 440, y: 150, risk: 'high', icon: 'Cpu', provider: 'GCP' },
      { id: 'gcp-sa', label: 'Default Compute Service Account (Editor)', type: 'iam', layer: 3, x: 620, y: 150, risk: 'critical', icon: 'KeyRound', provider: 'GCP' },
      { id: 'bigquery-lake', label: 'BigQuery: enterprise_raw_lake', type: 'database', layer: 4, x: 800, y: 150, risk: 'critical', icon: 'HardDrive', provider: 'GCP', crownJewel: true }
    ],
    edges: [
      { from: 'internet', to: 'gcp-lb', label: 'Web Inbound Route', isAttackPath: true },
      { from: 'gcp-lb', to: 'gke-pod', label: 'Ingress to Vulnerable Container', isAttackPath: true },
      { from: 'gke-pod', to: 'gcp-sa', label: 'Compute Metadata Token Query', isAttackPath: true },
      { from: 'gcp-sa', to: 'bigquery-lake', label: 'Editor Role Full Table Dump', isAttackPath: true }
    ],
    misconfigurations: [
      {
        id: 'MISCONFIG-GCP-001',
        title: 'Default Compute Service Account with Project Editor Assigned to GKE',
        service: 'IAM / GKE',
        provider: 'GCP',
        resourceId: '992112345678-compute@developer.gserviceaccount.com',
        technicalSeverity: 'High',
        assetCriticality: 'Critical',
        dataSensitivity: 'Proprietary ML Models & Data Lake',
        exposure: 'High',
        exploitability: 'High',
        businessDependency: 'AI Recommendation Engine',
        complianceViolations: ['CIS GCP 1.4', 'NIST AC-6', 'ISO 27001 A.9.2'],
        financialRiskEstimate: '$1,200,000',
        blastRadius: { affectedResources: 12, crownJewelsExposed: 1, productionServices: 2 },
        attackStory: 'Pod escape or Remote Code Execution inside GKE pod allows querying metadata.google.internal to obtain OAuth tokens with Editor permissions over the entire GCP project.',
        fixSnippet: {
          terraform: `resource "google_service_account" "gke_least_privilege" {
  account_id   = "sa-gke-analytics-worker"
  display_name = "Least Privilege GKE Analytics Worker"
}

resource "google_project_iam_member" "bigquery_reader" {
  project = "gcp-analytics-prod-9921"
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:\${google_service_account.gke_least_privilege.email}"
}`,
          cli: `gcloud iam service-accounts create sa-gke-analytics-worker --display-name="Least Privilege"`,
          policy: `Workload Identity Binding with Google IAM`
        }
      }
    ]
  }
];
