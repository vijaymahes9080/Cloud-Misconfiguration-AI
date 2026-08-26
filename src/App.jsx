import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AttackPathVisualizer from './components/AttackPathVisualizer';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import EngineerDashboard from './components/EngineerDashboard';
import AiRemediationCopilot from './components/AiRemediationCopilot';
import ComplianceView from './components/ComplianceView';
import AiSecurityChat from './components/AiSecurityChat';
import { ENTERPRISE_SCENARIOS } from './engine/cloudAssets';
import { Bell, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [scenarios] = useState(ENTERPRISE_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState(ENTERPRISE_SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState('attack-path'); // 'attack-path' | 'executive' | 'engineer' | 'remediation' | 'compliance'
  const [activeFinding, setActiveFinding] = useState(null);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [liveToast, setLiveToast] = useState(null);

  // Simulate continuous cloud monitoring drift event
  useEffect(() => {
    if (!isLiveMonitoring) return;

    const timer = setTimeout(() => {
      setLiveToast({
        title: 'NEW DRIFT DETECTED: S3 Bucket ACL Changed to PublicRead',
        time: 'Just now',
        account: selectedScenario.account,
        risk: 'CRITICAL',
        message: 'A previously private storage resource has been modified. Risk recalculated immediately.'
      });
    }, 12000);

    return () => clearTimeout(timer);
  }, [isLiveMonitoring, selectedScenario]);

  const handleNavigateToFix = (finding) => {
    setActiveFinding(finding);
    setActiveTab('remediation');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedScenario={selectedScenario}
        setSelectedScenario={(s) => {
          setSelectedScenario(s);
          setActiveFinding(s.misconfigurations[0]);
        }}
        scenarios={scenarios}
        isLiveMonitoring={isLiveMonitoring}
        setIsLiveMonitoring={setIsLiveMonitoring}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'attack-path' && (
          <AttackPathVisualizer
            scenario={selectedScenario}
            onSelectFinding={(f) => {
              setActiveFinding(f);
              setActiveTab('engineer');
            }}
            onNavigateToFix={handleNavigateToFix}
          />
        )}

        {activeTab === 'executive' && (
          <ExecutiveDashboard
            scenario={selectedScenario}
            onSelectFinding={(f) => {
              setActiveFinding(f);
              setActiveTab('engineer');
            }}
            onNavigateToFix={handleNavigateToFix}
          />
        )}

        {activeTab === 'engineer' && (
          <EngineerDashboard
            scenario={selectedScenario}
            onNavigateToFix={handleNavigateToFix}
          />
        )}

        {activeTab === 'remediation' && (
          <AiRemediationCopilot
            scenario={selectedScenario}
            activeFinding={activeFinding || selectedScenario.misconfigurations[0]}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceView scenario={selectedScenario} />
        )}
      </main>

      {/* Floating AI Chat Assistant */}
      <AiSecurityChat
        scenario={selectedScenario}
        onSelectFinding={(f) => handleNavigateToFix(f)}
      />

      {/* Continuous Monitoring Live Event Alert Toast */}
      {liveToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md p-4 rounded-2xl glass-panel-glow border-l-4 border-l-rose-500 border-slate-700 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-6">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-400">
                {liveToast.risk} • {liveToast.time}
              </span>
              <button
                onClick={() => setLiveToast(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h5 className="text-xs font-bold text-white mt-0.5">{liveToast.title}</h5>
            <p className="text-[11px] text-slate-300 mt-1">{liveToast.message}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <p>
          <strong>Cloud Misconfiguration AI</strong> — Developed by{' '}
          <a href="https://github.com/vijaymahes9080/Cloud-Misconfiguration-AI" className="text-cyan-400 hover:underline">
            Vijay Mahes
          </a>{' '}
          (Vijaypradhap2004@gmail.com) • Licensed under Apache 2.0
        </p>
      </footer>
    </div>
  );
}
