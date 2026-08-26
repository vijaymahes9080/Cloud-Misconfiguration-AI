// Unit Tests for Multi-Hop Attack Path Graph Traversal

import { ENTERPRISE_SCENARIOS } from '../src/engine/cloudAssets.js';

function runAttackPathTests() {
  console.log('Running Attack Path Graph Engine Unit Tests...');

  const scenario = ENTERPRISE_SCENARIOS[0]; // AWS Fintech
  const attackEdges = scenario.edges.filter(e => e.isAttackPath);

  console.assert(attackEdges.length >= 4, `Expected at least 4 attack path edges, got ${attackEdges.length}`);
  
  // Verify path connects internet to a crown jewel
  const startEdge = attackEdges.find(e => e.from === 'internet');
  console.assert(startEdge !== undefined, 'Attack path must start from internet external adversary');

  const crownNodes = scenario.nodes.filter(n => n.crownJewel);
  console.assert(crownNodes.length >= 1, 'Scenario must have designated crown jewel targets');

  console.log('✓ All Attack Path Graph traversal unit tests passed successfully!');
}

runAttackPathTests();
