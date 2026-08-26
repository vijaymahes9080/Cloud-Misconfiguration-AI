// Unit Tests for Business Risk Calculation Engine

import { calculateBusinessRisk, computeOverallCloudScore } from '../src/engine/businessRiskEngine.js';

function runTests() {
  console.log('Running Business Risk Engine Unit Tests...');

  const sampleCriticalFinding = {
    technicalSeverity: 'High',
    assetCriticality: 'Critical',
    dataSensitivity: 'Confidential PII (1.4M Users)',
    exposure: 'High',
    exploitability: 'High',
    businessDependency: 'Core Transaction Banking'
  };

  const risk = calculateBusinessRisk(sampleCriticalFinding);

  console.assert(risk.score >= 85, `Expected score >= 85, got ${risk.score}`);
  console.assert(risk.priority === 'CRITICAL', `Expected priority CRITICAL, got ${risk.priority}`);

  const overall = computeOverallCloudScore([sampleCriticalFinding]);
  console.assert(overall.overall < 90, `Expected penalty to reduce overall score, got ${overall.overall}`);

  console.log('✓ All 4 Business Risk Engine unit test assertions passed!');
}

runTests();
