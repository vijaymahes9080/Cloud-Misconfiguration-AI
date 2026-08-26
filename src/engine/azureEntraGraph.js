// Azure Entra ID & RBAC Identity Attack Path Engine

export function analyzeAzureIdentityPath(rbacAssignments) {
  const escalationPaths = [];

  rbacAssignments.forEach(assignment => {
    // Check 1: Subscription or Resource Group Contributor / Owner assigned to Service Principal
    if (assignment.roleDefinitionName === 'Contributor' || assignment.roleDefinitionName === 'Owner') {
      if (assignment.principalType === 'ServicePrincipal' && assignment.scope.includes('subscriptions')) {
        escalationPaths.push({
          type: 'Privilege Escalation',
          severity: 'Critical',
          description: `Service Principal '${assignment.principalName}' has ${assignment.roleDefinitionName} on entire subscription. Compromise grants full control over all tenant workloads.`,
          recommendation: 'Scope assignment strictly to resource group level or assign built-in least-privilege roles.'
        });
      }
    }

    // Check 2: User Access Administrator without PIM
    if (assignment.roleDefinitionName === 'User Access Administrator' && !assignment.isPimEnforced) {
      escalationPaths.push({
        type: 'IAM Permission Abuse',
        severity: 'High',
        description: `Identity '${assignment.principalName}' can grant arbitrary RBAC roles without Privileged Identity Management (PIM) approval.`,
        recommendation: 'Enforce Azure AD PIM with MFA and time-bound activation.'
      });
    }
  });

  return {
    evaluatedAssignments: rbacAssignments.length,
    escalationPathsFound: escalationPaths.length,
    escalationPaths
  };
}
