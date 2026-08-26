import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { calculateFrameworkCompliance } from '../engine/complianceEngine';

export default function ComplianceView({ scenario }) {
  const findings = scenario.misconfigurations || [];
  const frameworks = calculateFrameworkCompliance(findings);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Security Compliance & Regulatory Governance
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Audit-Ready Cross-Mapping</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Industry Compliance & Benchmark Standards
          </h2>
        </div>

        <button
          onClick={() => alert('Compliance Audit Report generated (PDF/CSV ready).')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Compliance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameworks.map((fw) => {
          const isPassing = fw.currentScore >= 80;
          return (
            <div key={fw.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    {fw.version}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{fw.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  fw.status === 'Passing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  fw.status === 'At Risk' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {fw.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                {fw.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Compliance Rating</span>
                  <span className="text-white font-mono font-bold">{fw.currentScore}% / Target {fw.target}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isPassing ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${fw.currentScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Failed Controls List */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Non-Compliant Findings:
                </span>
                <div className="space-y-1.5">
                  {fw.failedControls.map((fc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{fc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
