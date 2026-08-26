import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, X, MessageSquare, Flame } from 'lucide-react';

export default function AiSecurityChat({ scenario, onSelectFinding }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **AI Cloud Security Engineer**. I am actively analyzing the **${scenario.name}** environment. Ask me anything about attack paths, business risk calculation, or remediation code.`
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // AI dynamic reasoning response generator
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('attack') || lower.includes('path') || lower.includes('ssrf')) {
        reply = `**Attack Path Analysis:**\n\n1. External adversary scans public internet and locates port 80/443 on \`EC2: WebPortal-Prod-01\`.\n2. An SSRF flaw queries AWS IMDSv1 (\`169.254.169.254\`) to extract temporary STS role credentials.\n3. The attached role \`AppServer-S3FullAccess\` contains wildcard \`s3:*\` permissions.\n4. Attacker exfiltrates 1.4M customer records from \`fintech-customer-db-backups\`.\n\n*Recommended action:* Enable IMDSv2 and restrict IAM role permissions immediately.`;
      } else if (lower.includes('risk') || lower.includes('score') || lower.includes('business')) {
        reply = `**Business Risk Engine Breakdown:**\n\nThe highest business risk is **MISCONFIG-AWS-001** (Score: **94/100 - CRITICAL**).\n\nEven though technical severity is High, its business risk is CRITICAL because the resource protects **1.4M active user banking ledgers** with an estimated regulatory liability of **$1,850,000**.`;
      } else if (lower.includes('fix') || lower.includes('terraform') || lower.includes('remediat')) {
        reply = `**Terraform Remediation:**\n\nHead over to the **AI Copilot & Fixes** tab to preview and 1-click apply least-privilege Terraform code that restricts \`Action: s3:*\` to specific resource ARNs with SSE-KMS encryption.`;
      } else {
        reply = `I've analyzed your cloud topology for **${scenario.account}**. All findings have been cross-checked against CIS Benchmarks, NIST SP 800-53, and SOC 2 criteria. Let me know if you would like me to generate a Terraform remediation patch or simulate blast radius.`;
      }

      setMessages([...newMessages, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="text-xs font-bold hidden sm:inline">Ask AI Cloud Security Engineer</span>
        </button>
      )}

      {/* Chat Modal / Sidebar */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] glass-panel-glow rounded-2xl border border-cyan-500/30 flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Security Copilot</h4>
                <span className="text-[10px] text-emerald-400 font-mono">● Online & Graph-Aware</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setInput('Explain the attack path')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-300 font-medium whitespace-nowrap border border-slate-800"
            >
              Explain attack path
            </button>
            <button
              onClick={() => setInput('Why is business risk Critical?')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-amber-300 font-medium whitespace-nowrap border border-slate-800"
            >
              Why Business Risk?
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about vulnerabilities or fixes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
