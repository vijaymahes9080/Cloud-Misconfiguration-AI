// Compliance Mapping Engine

export const COMPLIANCE_FRAMEWORKS = [
  {
    id: 'cis',
    name: 'CIS Cloud Benchmark',
    version: 'v3.0.0',
    description: 'Center for Internet Security prescriptive security guidelines for AWS, Azure & GCP.',
    target: 95,
    currentScore: 78,
    failedControls: ['1.16 Ensure IAM policies adhere to least privilege', '2.1.5 Ensure S3 buckets enforce block public access', '5.2 Ensure SSH is not open to 0.0.0.0/0']
  },
  {
    id: 'nist',
    name: 'NIST SP 800-53 Rev 5',
    version: 'Rev 5',
    description: 'Security and Privacy Controls for Information Systems and Organizations.',
    target: 90,
    currentScore: 82,
    failedControls: ['AC-6 Least Privilege', 'SC-7 Boundary Protection', 'SC-13 Cryptographic Protection']
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    version: '2024 Trust Criteria',
    description: 'Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
    target: 100,
    currentScore: 84,
    failedControls: ['CC6.1 Logical Access Controls', 'CC6.3 Role-based Authorization', 'CC6.6 Perimeter Network Security']
  },
  {
    id: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    version: '2022 Controls',
    description: 'Information Security Management System Standard.',
    target: 92,
    currentScore: 86,
    failedControls: ['A.8.24 Use of Cryptography', 'A.9.2 User Access Provisioning']
  },
  {
    id: 'pci',
    name: 'PCI DSS 4.0',
    version: 'v4.0',
    description: 'Payment Card Industry Data Security Standard for Cardholder Data Environments.',
    target: 100,
    currentScore: 71,
    failedControls: ['Requirement 1.3: Prohibit Direct Public Ingress to CDE', 'Requirement 7.1.2: Restrict Access via Least Privilege']
  }
];

export function calculateFrameworkCompliance(findings) {
  // Compute real-time compliance percentage deductions based on active misconfigurations
  const totalFindings = findings.length;
  return COMPLIANCE_FRAMEWORKS.map(f => {
    const penalty = totalFindings * 6;
    const score = Math.max(55, Math.min(99, 100 - penalty + (f.id === 'iso27001' ? 4 : f.id === 'pci' ? -8 : 0)));
    return {
      ...f,
      currentScore: score,
      status: score >= 85 ? 'Passing' : score >= 75 ? 'At Risk' : 'Non-Compliant'
    };
  });
}
