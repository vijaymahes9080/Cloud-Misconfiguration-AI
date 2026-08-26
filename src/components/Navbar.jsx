import React from 'react';
import { 
  ShieldCheck, ShieldAlert, LayoutDashboard, Network, 
  FileCode, CheckCircle2, Crosshair, DollarSign, Activity, 
  Award, Bell, Sparkles 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedScenario, setSelectedScenario, scenarios, isLiveMonitoring, setIsLiveMonitoring }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  CloudMisconfig<span className="text-cyan-400">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Next-Gen CSPM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Cloud Security Engineer & Attack-Path Intelligence
              </p>
            </div>
          </div>

          {/* Scenario Picker for Mobile */}
          <div className="lg:hidden">
            <select
              value={selectedScenario.id}
              onChange={(e) => {
                const found = scenarios.find(s => s.id === e.target.value);
                if (found) setSelectedScenario(found);
              }}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>[{s.provider}] {s.name.split('—')[0]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('attack-path')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'attack-path'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Attack Path</span>
          </button>

          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'executive'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive Risk</span>
          </button>

          <button
            onClick={() => setActiveTab('mitre')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'mitre'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>MITRE Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('iac')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'iac'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>IaC Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('monte-carlo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'monte-carlo'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>FAIR VaR</span>
          </button>

          <button
            onClick={() => setActiveTab('remediation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'remediation'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={() => setActiveTab('drift')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'drift'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Drift Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('crown-jewels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'crown-jewels'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Crown Jewels</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compliance</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'webhooks'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Webhooks</span>
          </button>
        </nav>

        {/* Cloud Scenario & Live Monitor Controls */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Env:</span>
            <select
              value={selectedScenario.id}
              onChange={(e) => {
                const found = scenarios.find(s => s.id === e.target.value);
                if (found) setSelectedScenario(found);
              }}
              className="bg-transparent text-xs font-medium text-cyan-300 focus:outline-none cursor-pointer"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.provider} — {s.name.split('—')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
