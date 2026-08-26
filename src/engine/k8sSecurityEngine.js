// Kubernetes Security & Pod Security Standards (PSS) Misconfiguration Engine

export function scanKubernetesManifest(k8sYaml) {
  const findings = [];

  // Check 1: privileged: true
  if (/privileged:\s*true/i.test(k8sYaml)) {
    findings.push({
      ruleId: 'K8S-PSS-001',
      title: 'Container Running in Privileged Mode',
      severity: 'Critical',
      description: 'Privileged containers possess root access to host devices and can easily break out to the underlying node.',
      remediation: 'Set securityContext.privileged to false.'
    });
  }

  // Check 2: automountServiceAccountToken: true or not set on sensitive pod
  if (!k8sYaml.includes('automountServiceAccountToken: false')) {
    findings.push({
      ruleId: 'K8S-RBAC-002',
      title: 'Default ServiceAccount Token Automount Enabled',
      severity: 'High',
      description: 'Default service account JWT tokens are mounted at /var/run/secrets/kubernetes.io/serviceaccount, enabling pod lateral movement.',
      remediation: 'Explicitly set automountServiceAccountToken: false on the PodSpec.'
    });
  }

  // Check 3: hostNetwork or hostPID true
  if (/hostNetwork:\s*true/i.test(k8sYaml) || /hostPID:\s*true/i.test(k8sYaml)) {
    findings.push({
      ruleId: 'K8S-PSS-003',
      title: 'Host Network / Host PID Namespace Sharing Enabled',
      severity: 'High',
      description: 'Sharing host namespaces enables container processes to snoop on host network traffic and peer processes.',
      remediation: 'Set hostNetwork: false and hostPID: false.'
    });
  }

  return {
    scannedAt: new Date().toISOString(),
    findingsCount: findings.length,
    findings
  };
}
