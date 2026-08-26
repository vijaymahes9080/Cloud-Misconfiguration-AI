import React, { useState } from 'react';
import { 
  ShieldAlert, Filter, Search, CheckCircle2, ChevronRight, 
  ExternalLink, FileCode, Flame, Shield, ArrowUpDown
} from 'lucide-react';
import { calculateBusinessRisk } from '../engine/businessRiskEngine';

export default function EngineerDashboard({ scenario, onNavigateToFix }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFinding, setSelectedFinding] = useState(scenario.misconfigurations[0] || null);

  const findings = scenario.misconfigurations || [];

  const filteredFindings = findings.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.resourceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.service.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Security Engineer Console
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Deep Technical Findings & Rule Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Active Misconfigurations & Security Policies
          </h2>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resource or rule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {['All', 'Storage', 'IAM', 'Network'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Findings Table & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Findings List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredFindings.map((finding) => {
            const risk = calculateBusinessRisk(finding);
            const isSelected = selectedFinding?.id === finding.id;
            return (
              <div
                key={finding.id}
                onClick={() => setSelectedFinding(finding)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-cyan-400 font-semibold">{finding.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 font-medium">{finding.service}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{finding.title}</h4>
                    <div className="text-xs font-mono text-slate-400 mt-1 truncate max-w-sm">
                      {finding.resourceId}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold block ${
                      risk.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {risk.priority} ({risk.score})
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Tech: <strong className="text-slate-300">{finding.technicalSeverity}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Finding Inspector */}
        <div className="lg:col-span-6">
          {selectedFinding ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 sticky top-24">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedFinding.id} • {selectedFinding.provider}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{selectedFinding.title}</h3>
                </div>
                <button
                  onClick={() => onNavigateToFix && onNavigateToFix(selectedFinding)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 flex items-center gap-1.5 transition-all"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Fix with Copilot</span>
                </button>
              </div>

              {/* Resource Target */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Target Resource ARN / Resource URI
                </span>
                <span className="text-xs font-mono text-cyan-300 break-all select-all">
                  {selectedFinding.resourceId}
                </span>
              </div>

              {/* Attack Narrative */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  AI Attack Hypothesis & Exposure Path
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {selectedFinding.attackStory}
                </p>
              </div>

              {/* Multi-Factor Risk Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Risk Engine Metrics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Data Sensitivity</span>
                    <span className="font-semibold text-rose-300">{selectedFinding.dataSensitivity}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Financial Liability</span>
                    <span className="font-semibold text-amber-300">{selectedFinding.financialRiskEstimate}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Exploitability</span>
                    <span className="font-semibold text-cyan-300">{selectedFinding.exploitability}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Blast Radius</span>
                    <span className="font-semibold text-purple-300">{selectedFinding.blastRadius.affectedResources} Resources</span>
                  </div>
                </div>
              </div>

              {/* Compliance Violations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Failed Compliance Controls
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFinding.complianceViolations.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
              Select a finding to inspect technical details and security rules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
