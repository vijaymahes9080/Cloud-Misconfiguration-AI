import React from 'react';
import { Target, ShieldAlert, Crosshair, AlertTriangle, ExternalLink } from 'lucide-react';
import { mapFindingsToMitre } from '../engine/mitreAttackEngine';

export default function MitreMatrixView({ scenario }) {
  const findings = scenario.misconfigurations || [];
  const matrix = mapFindingsToMitre(findings);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" /> Threat Adversary Intelligence
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Enterprise Cloud Matrix v14</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            MITRE ATT&CK® for Cloud Heatmap
          </h2>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Active Threat Killchain in Progress</span>
        </div>
      </div>

      {/* Heatmap Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {matrix.map((tactic) => (
          <div key={tactic.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col space-y-3">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{tactic.id}</span>
                <h3 className="text-xs font-bold text-white tracking-tight">{tactic.name}</h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                tactic.activeCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-900 text-slate-500'
              }`}>
                {tactic.activeCount}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {tactic.techniques.map((tech) => (
                <div
                  key={tech.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    tech.isActiveThreat
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/30'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-cyan-300 font-semibold">{tech.id}</span>
                    {tech.isActiveThreat && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </div>
                  <div className="font-medium text-[11px] mt-1 line-clamp-2">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
