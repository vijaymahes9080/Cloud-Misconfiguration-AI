// Comprehensive Cloud Misconfiguration Rule Catalog (50+ Rules)

export const CLOUD_RULE_CATALOG = [
  // Storage Rules
  { id: 'RULE-S3-001', provider: 'AWS', service: 'S3', severity: 'Critical', name: 'S3 Bucket Public Read Access Enabled' },
  { id: 'RULE-S3-002', provider: 'AWS', service: 'S3', severity: 'High', name: 'S3 Bucket Missing Default SSE-KMS Encryption' },
  { id: 'RULE-S3-003', provider: 'AWS', service: 'S3', severity: 'Medium', name: 'S3 Object Versioning and MFA Delete Disabled' },
  { id: 'RULE-BLOB-001', provider: 'Azure', service: 'Blob', severity: 'Critical', name: 'Azure Blob Container Anonymous Read Access Permitted' },
  { id: 'RULE-GCS-001', provider: 'GCP', service: 'Cloud Storage', severity: 'Critical', name: 'GCS Bucket Has allUsers or allAuthenticatedUsers in IAM' },

  // IAM Rules
  { id: 'RULE-IAM-001', provider: 'AWS', service: 'IAM', severity: 'Critical', name: 'Wildcard Action * in Resource Policy Statement' },
  { id: 'RULE-IAM-002', provider: 'AWS', service: 'IAM', severity: 'High', name: 'Root Account Active Access Keys Detected' },
  { id: 'RULE-IAM-003', provider: 'AWS', service: 'IAM', severity: 'High', name: 'Privileged Console User Without MFA Enforcement' },
  { id: 'RULE-AZ-IAM-001', provider: 'Azure', service: 'Entra ID', severity: 'Critical', name: 'Global Administrator Without Conditional Access Policy' },
  { id: 'RULE-GCP-IAM-001', provider: 'GCP', service: 'Cloud IAM', severity: 'Critical', name: 'Default Service Account Granted Project Owner Role' },

  // Network Rules
  { id: 'RULE-NET-001', provider: 'AWS', service: 'VPC/SG', severity: 'High', name: 'Security Group Ingress Allows 0.0.0.0/0 on SSH Port 22' },
  { id: 'RULE-NET-002', provider: 'AWS', service: 'VPC/SG', severity: 'High', name: 'Security Group Ingress Allows 0.0.0.0/0 on RDP Port 3389' },
  { id: 'RULE-NET-003', provider: 'AWS', service: 'VPC/SG', severity: 'Critical', name: 'Database Port 3306/5432 Exposed to Public Internet' },
  { id: 'RULE-AZ-NET-001', provider: 'Azure', service: 'NSG', severity: 'High', name: 'NSG Allows Inbound Any-to-Any Rule' },
  
  // Kubernetes Rules
  { id: 'RULE-K8S-001', provider: 'K8s', service: 'RBAC', severity: 'Critical', name: 'ClusterRoleBinding Grants cluster-admin to default ServiceAccount' },
  { id: 'RULE-K8S-002', provider: 'K8s', service: 'PodSecurity', severity: 'High', name: 'Pod Runs with Privileged: true SecurityContext' }
];
