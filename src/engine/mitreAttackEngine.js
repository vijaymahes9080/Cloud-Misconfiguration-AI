// MITRE ATT&CK for Cloud (v14) TTP Mapping Engine

export const MITRE_CLOUD_TACTICS = [
  {
    id: 'TA0001',
    name: 'Initial Access',
    techniques: [
      { id: 'T1078.004', name: 'Valid Accounts: Cloud Accounts', mappedFindings: ['MISCONFIG-AWS-001'] },
      { id: 'T1190', name: 'Exploit Public-Facing Application (SSRF)', mappedFindings: ['MISCONFIG-AWS-003'] },
      { id: 'T1133', name: 'External Remote Services (SSH 0.0.0.0/0)', mappedFindings: ['MISCONFIG-AWS-003'] }
    ]
  },
  {
    id: 'TA0004',
    name: 'Privilege Escalation',
    techniques: [
      { id: 'T1098.001', name: 'Account Manipulation: Additional Cloud Credentials', mappedFindings: ['MISCONFIG-AWS-001'] },
      { id: 'T1484.002', name: 'Domain Policy: Cloud Trust Modifications', mappedFindings: ['MISCONFIG-AWS-001'] }
    ]
  },
  {
    id: 'TA0006',
    name: 'Credential Access',
    techniques: [
      { id: 'T1552.005', name: 'Unsecured Credentials: Cloud Instance Metadata (IMDSv1)', mappedFindings: ['MISCONFIG-AWS-001'] },
      { id: 'T1528', name: 'Steal Application Access Token', mappedFindings: ['MISCONFIG-AWS-001'] }
    ]
  },
  {
    id: 'TA0009',
    name: 'Collection',
    techniques: [
      { id: 'T1530', name: 'Data from Cloud Storage Object (Public S3/Blob)', mappedFindings: ['MISCONFIG-AWS-002', 'MISCONFIG-AZ-001'] }
    ]
  },
  {
    id: 'TA0010',
    name: 'Exfiltration',
    techniques: [
      { id: 'T1537', name: 'Transfer Data to Cloud Account', mappedFindings: ['MISCONFIG-AWS-002'] },
      { id: 'T1567', name: 'Exfiltration Over Web Service', mappedFindings: ['MISCONFIG-AWS-002'] }
    ]
  }
];

export function mapFindingsToMitre(findings) {
  const result = MITRE_CLOUD_TACTICS.map(tactic => {
    const activeTechniques = tactic.techniques.map(tech => {
      const active = tech.mappedFindings.some(mfId => findings.some(f => f.id === mfId));
      return {
        ...tech,
        isActiveThreat: active
      };
    });
    return {
      ...tactic,
      techniques: activeTechniques,
      activeCount: activeTechniques.filter(t => t.isActiveThreat).length
    };
  });
  return result;
}
