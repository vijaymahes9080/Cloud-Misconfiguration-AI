// Open Policy Agent (OPA) Rego Policy-as-Code Generator

export function generateRegoPolicy(ruleType) {
  switch (ruleType) {
    case 's3_public_block':
      return `package cloud.security.aws.s3

default allow = false

# Enforce S3 Public Access Block on all buckets
allow {
    input.resource_type == "aws_s3_bucket"
    input.public_access_block.block_public_acls == true
    input.public_access_block.block_public_policy == true
    input.public_access_block.ignore_public_acls == true
    input.public_access_block.restrict_public_buckets == true
}

deny[msg] {
    not allow
    msg := sprintf("S3 Bucket '%v' must have Public Access Block fully enabled", [input.name])
}`;

    case 'iam_least_privilege':
      return `package cloud.security.aws.iam

default allow = true

# Deny any IAM policy with wildcard actions on sensitive storage
deny[msg] {
    statement := input.Statement[_]
    statement.Effect == "Allow"
    action := statement.Action[_]
    action == "*"
    msg := "Wildcard Action '*' is strictly prohibited by enterprise security policy."
}`;

    case 'nsg_ssh_restriction':
    default:
      return `package cloud.security.network

default allow = false

# Deny 0.0.0.0/0 on SSH port 22
allow {
    input.protocol == "tcp"
    input.port != 22
}

allow {
    input.port == 22
    input.cidr != "0.0.0.0/0"
}

deny[msg] {
    not allow
    msg := "Port 22 SSH must not be reachable from 0.0.0.0/0"
}`;
  }
}
