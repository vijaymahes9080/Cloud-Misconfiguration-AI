import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, Check, MessageSquare, Bell } from 'lucide-react';
import { generateSlackPayload, generateDiscordPayload } from '../engine/webhookNotifier';

export default function WebhookIntegrationView({ scenario }) {
  const finding = scenario.misconfigurations[0];
  const [platform, setPlatform] = useState('slack'); // 'slack' | 'discord'
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const payload = platform === 'slack' 
    ? JSON.stringify(generateSlackPayload(finding, scenario), null, 2)
    : JSON.stringify(generateDiscordPayload(finding, scenario), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Real-Time SOC Incident Alerts
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Webhook Dispatch Integrations</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Incident Webhook & SIEM Integrations
          </h2>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setPlatform('slack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              platform === 'slack' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            Slack BlockKit
          </button>
          <button
            onClick={() => setPlatform('discord')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              platform === 'discord' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            Discord Embeds
          </button>
        </div>
      </div>

      {/* Main Payload Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase">
            Generated {platform === 'slack' ? 'Slack Webhook' : 'Discord Webhook'} JSON Payload
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Payload'}</span>
            </button>
            <button
              onClick={handleSendTest}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Webhook Dispatch</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto max-h-96">
          <pre>{payload}</pre>
        </div>

        {testSent && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Simulated Webhook Dispatched Successfully (HTTP 200 OK Response)</span>
          </div>
        )}
      </div>
    </div>
  );
}
