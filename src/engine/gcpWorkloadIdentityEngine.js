// GCP Workload Identity Federation & IAM Privilege Escalation Engine

export function analyzeGcpIamBindings(iamBindings) {
  const risks = [];

  iamBindings.forEach(binding => {
    // Check 1: Default Compute Engine service account with Editor role
    if (binding.role === 'roles/editor' || binding.role === 'roles/owner') {
      const defaultSa = binding.members.find(m => m.includes('-compute@developer.gserviceaccount.com'));
      if (defaultSa) {
        risks.push({
          ruleId: 'GCP-IAM-001',
          severity: 'Critical',
          title: 'Default Compute Engine SA Assigned Project Editor/Owner',
          member: defaultSa,
          risk: 'Any GCE VM or GKE Node using default SA inherits complete project write privileges.',
          recommendation: 'Create dedicated custom service account with least-privilege IAM roles and disable automatic default SA binding.'
        });
      }
    }

    // Check 2: Service Account User role combined with ActAs
    if (binding.role === 'roles/iam.serviceAccountUser' && binding.members.some(m => m.startsWith('user:'))) {
      risks.push({
        ruleId: 'GCP-IAM-002',
        severity: 'High',
        title: 'Direct User Granted iam.serviceAccountUser Without Resource Boundary',
        risk: 'User can deploy workloads acting as privileged service accounts to escalate privileges.',
        recommendation: 'Enforce Workload Identity Federation and restrict iam.serviceAccountUser to specific target resources.'
      });
    }
  });

  return {
    evaluatedBindingsCount: iamBindings.length,
    risksFound: risks.length,
    risks
  };
}
