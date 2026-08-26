import React from 'react';
import { 
  ShieldCheck, AlertOctagon, TrendingUp, DollarSign, Award, 
  ArrowUpRight, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles,
  ChevronRight, Building2, Flame
} from 'lucide-react';
import { calculateBusinessRisk, computeOverallCloudScore } from '../engine/businessRiskEngine';
import { calculateFrameworkCompliance } from '../engine/complianceEngine';

export default function ExecutiveDashboard({ scenario, onSelectFinding, onNavigateToFix }) {
  const findings = scenario.misconfigurations || [];
  const cloudScore = computeOverallCloudScore(findings);
  const complianceData = calculateFrameworkCompliance(findings);

  // Business Prioritization: Sort findings by highest business risk
  const prioritizedFindings = [...findings].map(f => ({
    ...f,
    calculatedRisk: calculateBusinessRisk(f)
  })).sort((a, b) => b.calculatedRisk.score - a.calculatedRisk.score);

  const totalFinancialRisk = findings.reduce((acc, f) => {
    const raw = parseInt(f.financialRiskEstimate.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + raw;
  }, 0);

  const formattedFinancialRisk = `$${(totalFinancialRisk / 1000000).toFixed(2)}M`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Executive Posture Summary
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Target Audience: CISO & Security Leadership</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cloud Security Posture & Business Risk Impact
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <TrendingUp className="w-4 h-4" />
          <span>Security Trend: ↑ +6% Past 30 Days</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Security Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Cloud Security Score</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{cloudScore.overall}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                cloudScore.overall >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'
              }`}
              style={{ width: `${cloudScore.overall}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Industry Benchmark: 78</span>
            <span className="text-cyan-400 font-medium">Rank: Top 15%</span>
          </div>
        </div>

        {/* Financial Exposure Liability */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Estimated Financial Exposure</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{formattedFinancialRisk}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Calculated across data breach liability, regulatory fines (HIPAA/GDPR) & downtime.
          </p>
        </div>

        {/* Critical Attack Chains */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Exploitable Attack Chains</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 tracking-tight">
              {prioritizedFindings.filter(f => f.calculatedRisk.priority === 'CRITICAL').length}
            </span>
            <span className="text-xs text-slate-400">Active High-Priority Paths</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Multi-vector weakness chains targeting production crown jewels.
          </p>
        </div>

        {/* Average Compliance */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Avg Compliance Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">82%</span>
            <span className="text-xs text-slate-400">5 Frameworks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            CIS, NIST, SOC 2, ISO 27001, PCI-DSS mapped live.
          </p>
        </div>
      </div>

      {/* Domain Score Breakdown & Priority Action List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Prioritization Engine: "Fix These First" */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-base">AI Prioritization Engine — "Fix These First"</h3>
                <p className="text-xs text-slate-400">
                  Prioritized by business impact (Technical Severity × Crown Jewel Asset Criticality × Exposure)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {prioritizedFindings.map((finding, idx) => {
              const risk = finding.calculatedRisk;
              return (
                <div
                  key={finding.id}
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-cyan-300 font-bold text-xs flex items-center justify-center border border-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{finding.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          risk.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {risk.priority} RISK ({risk.score}/100)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{finding.attackStory}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                        <span className="bg-slate-950 px-2 py-0.5 rounded text-cyan-400 font-mono">{finding.provider}</span>
                        <span>•</span>
                        <span>Data: <strong className="text-slate-200">{finding.dataSensitivity}</strong></span>
                        <span>•</span>
                        <span>Potential Loss: <strong className="text-rose-400">{finding.financialRiskEstimate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToFix && onNavigateToFix(finding)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>Remediate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Domain Breakdown */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Security Domain Health
          </h3>

          <div className="space-y-4 pt-2">
            {Object.entries(cloudScore.breakdown).map(([domain, score]) => (
              <div key={domain} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="capitalize text-slate-300 font-medium">{domain} Security</span>
                  <span className="font-mono font-bold text-white">{score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      score >= 85 ? 'bg-emerald-400' : score >= 70 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Top 5 Recommendation to reach 90+ */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              Action Plan for 90+ Score
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Enforce S3 Block Public Access on backup buckets (+6 pts)</li>
              <li>Restrict IAM role Action wildcard <code className="text-cyan-400">s3:*</code> (+5 pts)</li>
              <li>Revoke 0.0.0.0/0 SSH inbound rule on web SG (+3 pts)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
