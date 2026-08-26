import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Server, KeyRound, Database, Globe, HardDrive, 
  Cpu, Network, AlertTriangle, ArrowRight, Play, RefreshCw, Zap,
  Flame, CheckCircle2, Lock, ExternalLink
} from 'lucide-react';
import { calculateBusinessRisk } from '../engine/businessRiskEngine';

const ICON_MAP = {
  Globe: Globe,
  ShieldAlert: ShieldAlert,
  Server: Server,
  KeyRound: KeyRound,
  Database: Database,
  HardDrive: HardDrive,
  Cpu: Cpu,
  Network: Network
};

export default function AttackPathVisualizer({ scenario, onSelectFinding, onNavigateToFix }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Default to selecting the crown jewel or first critical node
  useEffect(() => {
    if (scenario && scenario.nodes) {
      const crown = scenario.nodes.find(n => n.crownJewel) || scenario.nodes[0];
      setSelectedNode(crown);
      setIsSimulating(false);
      setCurrentStepIndex(0);
    }
  }, [scenario]);

  const attackNodes = scenario.nodes || [];
  const attackEdges = scenario.edges || [];

  // Simulated Attack Sequence
  const attackPathSteps = [
    {
      title: 'Initial Reconnaissance & Public Ingress',
      desc: 'Adversary scans internet IP space and discovers open port 80/443 with unauthenticated SSRF vulnerability.',
      from: 'internet',
      to: 'ec2-web'
    },
    {
      title: 'IMDSv1 STS Credential Exfiltration',
      desc: 'Exploiting SSRF to query 169.254.169.254, capturing temporary AWS IAM STS session tokens for the attached role.',
      from: 'ec2-web',
      to: 'iam-role'
    },
    {
      title: 'Privilege Abuse & Crown Jewel Data Exfiltration',
      desc: 'Using stolen credentials with wildcard s3:* privileges to bypass storage boundaries and dump unencrypted customer databases.',
      from: 'iam-role',
      to: 's3-backup'
    }
  ];

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCurrentStepIndex(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < attackPathSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> High-Impact Exploit Chain
            </span>
            <span className="text-xs text-slate-400">Account: <span className="font-mono text-cyan-300">{scenario.account}</span></span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{scenario.name}</h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">{scenario.description}</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                : 'bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500 shadow-rose-900/30'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Attack Execution...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Attack Path</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Visualizer Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Graph Canvas Container */}
        <div className="xl:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-sm">Interactive Attack Graph & Blast Horizon</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Critical Threat Vector</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Crown Jewel</span>
            </div>
          </div>

          {/* SVG Visual Graph */}
          <div className="w-full h-[420px] relative bg-slate-950/60 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              <defs>
                <linearGradient id="attackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill="#f43f5e" />
                </marker>
                <marker id="arrowhead-normal" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <polygon points="0 0, 8 4, 0 8" fill="#475569" />
                </marker>
              </defs>

              {/* Render Edges */}
              {attackEdges.map((edge, idx) => {
                const sourceNode = attackNodes.find(n => n.id === edge.from);
                const targetNode = attackNodes.find(n => n.id === edge.to);
                if (!sourceNode || !targetNode) return null;

                const isHighlighted = edge.isAttackPath;
                return (
                  <g key={idx}>
                    <line
                      x1={`${(sourceNode.x / 900) * 100}%`}
                      y1={`${(sourceNode.y / 400) * 100}%`}
                      x2={`${(targetNode.x / 900) * 100}%`}
                      y2={`${(targetNode.y / 400) * 100}%`}
                      stroke={isHighlighted ? "url(#attackGradient)" : "#334155"}
                      strokeWidth={isHighlighted ? "3" : "1.5"}
                      strokeDasharray={isHighlighted ? "6 4" : "none"}
                      className={isHighlighted ? "animate-pulse" : ""}
                      markerEnd={isHighlighted ? "url(#arrowhead)" : "url(#arrowhead-normal)"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            <div className="w-full h-full relative">
              {attackNodes.map((node) => {
                const IconComponent = ICON_MAP[node.icon] || Server;
                const isSelected = selectedNode?.id === node.id;
                const isCrown = node.crownJewel;

                let nodeStyle = 'border-slate-700 bg-slate-900/90 text-slate-300';
                if (node.type === 'external') {
                  nodeStyle = 'border-rose-500/80 bg-rose-950/80 text-rose-200 shadow-lg shadow-rose-950/60';
                } else if (isCrown) {
                  nodeStyle = 'border-amber-500 bg-amber-950/90 text-amber-200 shadow-xl shadow-amber-950/80 ring-2 ring-amber-400/40 animate-pulse-slow';
                } else if (node.risk === 'critical' || node.risk === 'high') {
                  nodeStyle = 'border-red-500/70 bg-red-950/70 text-red-200';
                }

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: `${(node.x / 900) * 100}%`,
                      top: `${(node.y / 400) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute cursor-pointer transition-all duration-300 p-3 rounded-xl border flex flex-col items-center gap-1.5 z-10 hover:scale-110 ${nodeStyle} ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-110 shadow-cyan-500/20' : ''
                    }`}
                  >
                    <div className="relative">
                      <IconComponent className="w-6 h-6" />
                      {isCrown && (
                        <span className="absolute -top-2 -right-2 text-[9px] bg-amber-500 text-slate-950 font-bold px-1 rounded">
                          PII
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap text-center max-w-[130px] truncate">
                      {node.label}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-950/80 font-mono text-slate-400">
                      {node.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Exploit Progression */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Attack Killchain Breakdown: Step {currentStepIndex + 1} of {attackPathSteps.length}
              </span>
              <span className="text-xs text-rose-400 font-mono font-medium">
                CVSS: 9.8 / Business Risk: CRITICAL
              </span>
            </div>
            <div className="text-sm font-semibold text-white">
              {attackPathSteps[currentStepIndex]?.title}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {attackPathSteps[currentStepIndex]?.desc}
            </p>
          </div>
        </div>

        {/* Node & Blast Radius Intelligence Panel */}
        <div className="xl:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {selectedNode.type} Node
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{selectedNode.label}</h4>
                </div>
                {selectedNode.crownJewel && (
                  <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    👑 Crown Jewel Asset
                  </span>
                )}
              </div>

              {/* Node Properties */}
              <div className="space-y-2 text-xs border-y border-slate-800/80 py-3">
                <div className="flex justify-between text-slate-400">
                  <span>Node ID:</span>
                  <span className="font-mono text-slate-200">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Provider:</span>
                  <span className="text-cyan-300 font-medium">{scenario.provider}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Exposure Status:</span>
                  <span className="text-rose-400 font-semibold uppercase">{selectedNode.risk}</span>
                </div>
                {selectedNode.metadata && Object.entries(selectedNode.metadata).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-slate-400">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-mono text-amber-300">{String(v)}</span>
                  </div>
                ))}
              </div>

              {/* Blast Radius Quantification */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  Blast Radius Impact
                </h5>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-lg font-bold text-white">14</div>
                    <div className="text-[10px] text-slate-400 uppercase">Resources</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-lg font-bold text-amber-400">1.4M</div>
                    <div className="text-[10px] text-slate-400 uppercase">PII Records</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-lg font-bold text-rose-400">$1.85M</div>
                    <div className="text-[10px] text-slate-400 uppercase">Est. Liability</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigateToFix && onNavigateToFix(scenario.misconfigurations[0])}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Generate Least-Privilege Remediation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
              Select any graph node to inspect metadata and blast radius.
            </div>
          )}

          {/* Quick Findings List */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Connected Misconfigurations ({scenario.misconfigurations.length})
            </h5>
            <div className="space-y-2">
              {scenario.misconfigurations.map((m) => {
                const risk = calculateBusinessRisk(m);
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectFinding(m)}
                    className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-all flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200 line-clamp-1">{m.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.service} • {m.resourceId.split('/').pop()}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      risk.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {risk.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
