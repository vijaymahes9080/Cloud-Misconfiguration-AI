import React from 'react';
import { Activity, Clock, AlertTriangle, ShieldCheck, ArrowRight, GitCommit } from 'lucide-react';

export default function DriftTimelineView({ scenario }) {
  const events = [
    {
      time: '09:42 AM',
      author: 'IAM Role: AutoDeployer-CI',
      action: 'S3 Bucket ACL modified: BlockPublicAcls set to FALSE',
      severity: 'CRITICAL',
      resource: 'fintech-customer-db-backups-2026',
      impact: 'Public internet crawl vulnerability created'
    },
    {
      time: '08:15 AM',
      author: 'DevOps Engineer (Console)',
      action: 'Security Group rule added: Port 22 allowed from 0.0.0.0/0',
      severity: 'HIGH',
      resource: 'sg-fintech-web-ingress',
      impact: 'Exposed SSH management daemon to internet brute-force'
    },
    {
      time: 'Yesterday 17:30',
      author: 'Terraform Cloud Bot',
      action: 'IAM Role attached: AppServer-S3FullAccess with Action: s3:*',
      severity: 'HIGH',
      resource: 'arn:aws:iam::192847192834:role/AppServer',
      impact: 'Granted wildcard object deletion and retrieval privileges'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Event-Driven Security Monitoring
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">CloudTrail & Audit Log Stream</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Infrastructure Configuration Drift Timeline
          </h2>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          ● Listening for Real-time Cloud Events
        </span>
      </div>

      {/* Timeline List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
          {events.map((ev, idx) => (
            <div key={idx} className="relative flex items-start gap-4 pl-8">
              <div className={`absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 ${
                ev.severity === 'CRITICAL' ? 'border-rose-500' : 'border-amber-400'
              }`}></div>

              <div className="flex-1 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {ev.severity} DRIFT
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{ev.time}</span>
                  </div>
                  <span className="text-xs text-slate-400">{ev.author}</span>
                </div>

                <div className="text-xs font-bold text-white">{ev.action}</div>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded">
                  Target: {ev.resource}
                </div>
                <div className="text-[11px] text-rose-300 flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>{ev.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
