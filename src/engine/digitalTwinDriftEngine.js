// Real-time Cloud Digital Twin Drift & Snapshot Differential Engine

export function computeConfigurationDrift(previousSnapshot, currentSnapshot) {
  const drifts = [];

  currentSnapshot.forEach(curr => {
    const prev = previousSnapshot.find(p => p.id === curr.id);
    if (!prev) {
      drifts.push({
        type: 'Resource Created',
        severity: curr.risk === 'critical' ? 'High' : 'Low',
        resourceId: curr.id,
        description: `New resource '${curr.label}' was instantiated in environment.`
      });
    } else if (JSON.stringify(prev.metadata) !== JSON.stringify(curr.metadata)) {
      drifts.push({
        type: 'Policy Mutation / Drift',
        severity: 'Critical',
        resourceId: curr.id,
        description: `Configuration parameters on '${curr.label}' mutated from baseline security state.`,
        before: prev.metadata,
        after: curr.metadata
      });
    }
  });

  return {
    timestamp: new Date().toISOString(),
    driftCount: drifts.length,
    drifts
  };
}
