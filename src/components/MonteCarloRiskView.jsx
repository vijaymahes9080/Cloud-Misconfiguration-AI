import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, BarChart3, PieChart } from 'lucide-react';
import { runMonteCarloSimulation } from '../engine/monteCarloRisk';

export default function MonteCarloRiskView() {
  const [iterations, setIterations] = useState(1000);
  const [data, setData] = useState(() => runMonteCarloSimulation(1000, 1850000));
  const [isComputing, setIsComputing] = useState(false);

  const handleRerun = () => {
    setIsComputing(true);
    setTimeout(() => {
      setData(runMonteCarloSimulation(iterations, 1850000));
      setIsComputing(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Quantitative Financial Cyber Risk
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">FAIR Cyber Risk Formulation</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Monte Carlo Financial Breach Loss & Value-at-Risk (VaR)
          </h2>
        </div>

        <button
          onClick={handleRerun}
          disabled={isComputing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isComputing ? 'animate-spin' : ''}`} />
          <span>Rerun 1,000 Iteration Simulation</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Expected Mean Loss</span>
          <div className="text-3xl font-extrabold text-white mt-2">{data.formattedMean}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Annualized Expected Loss</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">90% Value-at-Risk (VaR)</span>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">{data.formattedVaR90}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">90% confidence ceiling</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">99% Tail Risk (Worst Case)</span>
          <div className="text-3xl font-extrabold text-rose-400 mt-2">{data.formattedVaR99}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Catastrophic breach scenario</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Simulation Sample Runs</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">1,000</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Log-normal distributed</span>
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Simulated Breach Loss Distribution Curve</h3>
        <div className="h-40 flex items-end gap-1 pt-6 px-2 bg-slate-950/60 rounded-xl border border-slate-900">
          {data.distributionSamples.map((sample, idx) => {
            const heightPercent = Math.min(100, Math.max(8, (sample / data.var99) * 100));
            return (
              <div
                key={idx}
                style={{ height: `${heightPercent}%` }}
                className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 hover:from-rose-500 hover:to-rose-400 rounded-t transition-all cursor-pointer group relative"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 text-[9px] font-mono px-1.5 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none">
                  ${(sample / 1000).toFixed(0)}k
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
