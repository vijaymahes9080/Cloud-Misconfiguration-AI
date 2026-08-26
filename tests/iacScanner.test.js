// Unit Tests for Infrastructure-as-Code (IaC) Scanner Engine

import { scanTerraformCode } from '../src/engine/iacScanner.js';

function runIacTests() {
  console.log('Running IaC Scanner Engine Unit Tests...');

  const vulnerableTf = `
    resource "aws_s3_bucket" "test_bucket" {
      bucket = "unprotected-bucket"
    }

    resource "aws_security_group" "open_ssh" {
      ingress {
        from_port   = 22
        to_port     = 22
        cidr_blocks = ["0.0.0.0/0"]
      }
    }
  `;

  const results = scanTerraformCode(vulnerableTf);

  console.assert(results.totalIssues >= 2, `Expected at least 2 issues, got ${results.totalIssues}`);
  console.assert(results.issues.some(i => i.ruleId === 'IAC-AWS-S3-001'), 'Expected S3 public access block check to fail');
  console.assert(results.issues.some(i => i.ruleId === 'IAC-AWS-NET-003'), 'Expected SSH 0.0.0.0/0 check to fail');

  console.log('✓ All IaC Scanner Engine unit tests passed successfully!');
}

runIacTests();
