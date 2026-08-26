// Infrastructure-as-Code (IaC) Static Analysis Scanner (Terraform & CloudFormation)

export function scanTerraformCode(tfCode) {
  const issues = [];

  // Check 1: S3 Public Access Block Missing or False
  if (tfCode.includes('resource "aws_s3_bucket"') && !tfCode.includes('aws_s3_bucket_public_access_block')) {
    issues.push({
      ruleId: 'IAC-AWS-S3-001',
      title: 'Missing S3 Public Access Block Resource',
      severity: 'High',
      lineHint: 'aws_s3_bucket',
      recommendation: 'Attach an aws_s3_bucket_public_access_block with all 4 block settings set to true.'
    });
  }

  // Check 2: Wildcard IAM Action
  if (/Action\s*=\s*\[?\s*"\*"/i.test(tfCode) || /Action\s*=\s*"s3:\*"/i.test(tfCode)) {
    issues.push({
      ruleId: 'IAC-AWS-IAM-002',
      title: 'Wildcard Action in IAM Policy Statement',
      severity: 'Critical',
      lineHint: 'Action = "*"',
      recommendation: 'Replace wildcard actions with specific least-privilege API operations.'
    });
  }

  // Check 3: 0.0.0.0/0 Ingress on Management Ports
  if (/cidr_blocks\s*=\s*\[\s*"0\.0\.0\.0\/0"\s*\]/.test(tfCode) && /(22|3389|3306|5432|27017|6379)/.test(tfCode)) {
    issues.push({
      ruleId: 'IAC-AWS-NET-003',
      title: 'Security Group Ingress Open to 0.0.0.0/0 on Sensitive Port',
      severity: 'High',
      lineHint: 'cidr_blocks = ["0.0.0.0/0"]',
      recommendation: 'Restrict ingress CIDR to internal VPC CIDR or dedicated corporate VPN IPs.'
    });
  }

  // Check 4: Unencrypted EBS Volume
  if (tfCode.includes('resource "aws_ebs_volume"') && !tfCode.includes('encrypted = true')) {
    issues.push({
      ruleId: 'IAC-AWS-EBS-004',
      title: 'EBS Volume Missing Encryption At Rest',
      severity: 'Medium',
      lineHint: 'aws_ebs_volume',
      recommendation: 'Set encrypted = true and specify kms_key_id.'
    });
  }

  return {
    scannedAt: new Date().toISOString(),
    totalIssues: issues.length,
    issues
  };
}
