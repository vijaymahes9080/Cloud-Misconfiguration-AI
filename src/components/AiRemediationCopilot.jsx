import React, { useState } from 'react';
import { 
  FileCode, CheckCircle2, Copy, Play, ShieldCheck, 
  Terminal, Sparkles, RefreshCw, Check, ArrowRight, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AiRemediationCopilot({ scenario, activeFinding }) {
  const findings = scenario.misconfigurations || [];
  const [selectedFinding, setSelectedFinding] = useState(activeFinding || findings[0]);
  const [codeType, setCodeType] = useState('terraform'); // 'terraform' | 'cli' | 'policy'
  const [copied, setCopied] = useState(false);
  const [workflowState, setWorkflowState] = useState('preview'); // 'preview' | 'approved' | 'applied'
  const [isApplying, setIsApplying] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyFix = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setWorkflowState('applied');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const currentCode = selectedFinding?.fixSnippet?.[codeType] || '// No remediation snippet generated.';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Remediation Copilot
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Human-in-the-Loop Safe Deployment</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Automated Infrastructure-as-Code Remediation
          </h2>
        </div>

        {/* Workflow State Tracker: Preview -> Approve -> Apply */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-xs">
          <div className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
            workflowState === 'preview' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
          }`}>
            <Eye className="w-3.5 h-3.5" />
            <span>1. Preview Fix</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <div className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
            workflowState === 'approved' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Approve Plan</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <div className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
            workflowState === 'applied' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Applied</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Finding Selector Column */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Target Misconfigurations ({findings.length})
          </h3>
          {findings.map((f) => {
            const isSelected = selectedFinding?.id === f.id;
            return (
              <div
                key={f.id}
                onClick={() => {
                  setSelectedFinding(f);
                  setWorkflowState('preview');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">{f.id}</span>
                <h4 className="text-xs font-bold text-white mt-1">{f.title}</h4>
                <div className="text-[11px] text-slate-400 mt-1">{f.service}</div>
              </div>
            );
          })}
        </div>

        {/* Code Generator & Fix Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Selected Resource:</span>
                <div className="text-sm font-bold text-white font-mono">{selectedFinding?.resourceId}</div>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setCodeType('terraform')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    codeType === 'terraform' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Terraform (.tf)
                </button>
                <button
                  onClick={() => setCodeType('cli')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    codeType === 'cli' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cloud CLI
                </button>
                <button
                  onClick={() => setCodeType('policy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    codeType === 'policy' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  IAM Policy
                </button>
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-cyan-300">
              <button
                onClick={() => handleCopy(currentCode)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-all shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre className="pt-2">{currentCode}</pre>
            </div>

            {/* AI Explanation of the Remediation */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <span className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider block">
                Security Engineer AI Explanation
              </span>
              <p>
                This patch removes wildcard actions and restricts resource boundaries strictly to approved service ARNs.
                Applying this eliminates the attack path from public ingress to production database credentials without breaking application workflow.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {workflowState === 'preview' && (
                <button
                  onClick={() => setWorkflowState('approved')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700"
                >
                  Approve Remediation Plan
                </button>
              )}

              {workflowState === 'approved' && (
                <button
                  onClick={handleApplyFix}
                  disabled={isApplying}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying Terraform via CI/CD...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Apply Safe Remediation</span>
                    </>
                  )}
                </button>
              )}

              {workflowState === 'applied' && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fix Successfully Applied & Verified! Attack Path Severed.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
