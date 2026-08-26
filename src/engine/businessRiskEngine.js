// Business Risk Calculation Engine

const WEIGHTS = {
  technicalSeverity: { Low: 3, Medium: 6, High: 8.5, Critical: 10 },
  assetCriticality: { Low: 2, Medium: 5, High: 8, Critical: 10 },
  dataSensitivity: { Public: 1, Internal: 4, Confidential: 8, 'Confidential PII (1.4M Users)': 9.8, 'PII & Financial Ledger': 10, 'Protected Health Info (PHI / HIPAA)': 10, 'Proprietary ML Models & Data Lake': 9.2, 'Host Shell Access': 8.5 },
  exposure: { Internal: 2, VPC: 4, High: 8, Extreme: 10 },
  exploitability: { Difficult: 3, Medium: 6, High: 8.5, Trivial: 10 },
  businessDependency: { NonCritical: 2, InternalTool: 4, 'Production Bastion Host': 7, 'AI Recommendation Engine': 8.5, 'Disaster Recovery Archive': 9, 'Core Transaction Banking': 10, 'Patient Diagnostic Archive': 10 }
};

export function calculateBusinessRisk(finding) {
  const sTech = WEIGHTS.technicalSeverity[finding.technicalSeverity] || 6;
  const sCrit = WEIGHTS.assetCriticality[finding.assetCriticality] || 7;
  const sSens = WEIGHTS.dataSensitivity[finding.dataSensitivity] || 7;
  const sExpo = WEIGHTS.exposure[finding.exposure] || 7;
  const sExpl = WEIGHTS.exploitability[finding.exploitability] || 6;
  const sDep = WEIGHTS.businessDependency[finding.businessDependency] || 6;

  // Composite Multiplier Normalized to 0 - 100 scale
  // Business Risk prioritizes Asset Criticality & Data Sensitivity heavily over just raw tech severity
  const rawScore = (sTech * 0.15) + (sCrit * 0.25) + (sSens * 0.25) + (sExpo * 0.15) + (sExpl * 0.10) + (sDep * 0.10);
  const normalizedScore = Math.min(100, Math.round(rawScore * 10));

  let priority = 'LOW';
  let badgeColor = 'emerald';

  if (normalizedScore >= 85) {
    priority = 'CRITICAL';
    badgeColor = 'rose';
  } else if (normalizedScore >= 70) {
    priority = 'HIGH';
    badgeColor = 'amber';
  } else if (normalizedScore >= 45) {
    priority = 'MEDIUM';
    badgeColor = 'cyan';
  }

  // Why does this risk score differ from raw CVSS?
  let deltaExplanation = '';
  if (finding.technicalSeverity === 'Medium' && priority === 'HIGH') {
    deltaExplanation = 'Elevated from Medium technical severity because finding directly exposes a Crown Jewel database.';
  } else if (finding.technicalSeverity === 'High' && priority === 'CRITICAL') {
    deltaExplanation = 'Elevated to Critical business risk due to unauthenticated Internet exposure combined with Sensitive PII assets.';
  } else {
    deltaExplanation = 'Aligned with standard risk matrix considering environment exposure.';
  }

  return {
    score: normalizedScore,
    priority,
    badgeColor,
    factors: {
      technicalSeverity: sTech,
      assetCriticality: sCrit,
      dataSensitivity: sSens,
      exposure: sExpo,
      exploitability: sExpl,
      businessDependency: sDep
    },
    deltaExplanation
  };
}

export function computeOverallCloudScore(findings) {
  if (!findings || findings.length === 0) return { overall: 98, breakdown: { iam: 95, storage: 95, database: 95, network: 98, encryption: 99 } };

  let totalPenalty = 0;
  findings.forEach(f => {
    const risk = calculateBusinessRisk(f);
    if (risk.priority === 'CRITICAL') totalPenalty += 18;
    else if (risk.priority === 'HIGH') totalPenalty += 10;
    else if (risk.priority === 'MEDIUM') totalPenalty += 5;
    else totalPenalty += 2;
  });

  const overall = Math.max(32, 100 - totalPenalty);
  return {
    overall,
    breakdown: {
      iam: Math.max(40, overall + (overall < 70 ? 8 : -4)),
      network: Math.max(45, overall + (overall < 60 ? 12 : -2)),
      storage: Math.max(35, overall - 6),
      database: Math.max(50, overall + 4),
      encryption: Math.max(60, overall + 10)
    }
  };
}
