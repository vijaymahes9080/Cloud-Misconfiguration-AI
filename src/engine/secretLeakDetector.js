// Cloud Secret & Credential Leak Detection Engine

const SECRET_PATTERNS = [
  {
    name: 'AWS Access Key ID',
    regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
    severity: 'Critical',
    category: 'AWS Credentials'
  },
  {
    name: 'AWS Secret Access Key',
    regex: /(?i)aws_secret_access_key\s*=\s*['"][A-Za-z0-9/+=]{40}['"]/g,
    severity: 'Critical',
    category: 'AWS Credentials'
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /ghp_[0-9a-zA-Z]{36}/g,
    severity: 'High',
    category: 'VCS Tokens'
  },
  {
    name: 'Private RSA / OpenSSH Key Block',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
    severity: 'Critical',
    category: 'Cryptographic Keys'
  },
  {
    name: 'GCP Service Account Private Key ID',
    regex: /"private_key_id":\s*"[a-f0-9]{40}"/g,
    severity: 'Critical',
    category: 'GCP Credentials'
  }
];

export function detectSecretLeaks(content) {
  const leaks = [];

  SECRET_PATTERNS.forEach(pat => {
    let match;
    const re = new RegExp(pat.regex);
    while ((match = re.exec(content)) !== null) {
      leaks.push({
        name: pat.name,
        severity: pat.severity,
        category: pat.category,
        matchedSnippet: match[0].substring(0, 10) + '...' + match[0].substring(match[0].length - 4),
        index: match.index
      });
    }
  });

  return {
    scannedLength: content.length,
    leakCount: leaks.length,
    leaks
  };
}
