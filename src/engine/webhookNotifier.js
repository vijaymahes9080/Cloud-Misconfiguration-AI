// Multi-Channel Incident Alerting & Webhook Dispatcher

export function generateSlackPayload(finding, scenario) {
  return {
    text: `🚨 *CRITICAL CLOUD ATTACK PATH DETECTED* on \`${scenario.account}\``,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Critical Cloud Misconfiguration Alert',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Finding:*\n${finding.title}` },
          { type: 'mrkdwn', text: `*Business Risk:*\n${finding.financialRiskEstimate} Potential Loss` },
          { type: 'mrkdwn', text: `*Resource:*\n\`${finding.resourceId}\`` },
          { type: 'mrkdwn', text: `*Provider:*\n${finding.provider}` }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Attack Killchain:* ${finding.attackStory}`
        }
      }
    ]
  };
}

export function generateDiscordPayload(finding, scenario) {
  return {
    username: 'CloudMisconfig AI Bot',
    avatar_url: 'https://raw.githubusercontent.com/vijaymahes9080/Cloud-Misconfiguration-AI/main/icon.png',
    embeds: [
      {
        title: `🚨 ${finding.title}`,
        description: finding.attackStory,
        color: 15158332, // Red
        fields: [
          { name: 'Target Resource', value: `\`${finding.resourceId}\``, inline: true },
          { name: 'Estimated Financial Risk', value: finding.financialRiskEstimate, inline: true },
          { name: 'Cloud Account', value: scenario.account, inline: false }
        ],
        footer: { text: 'Cloud Misconfiguration AI — Next-Gen CSPM' },
        timestamp: new Date().toISOString()
      }
    ]
  };
}
