import React from 'react';
import { Database, ShieldAlert, Lock, Unlock, Server, HardDrive, Award } from 'lucide-react';

export default function CrownJewelExplorer({ scenario }) {
  const crownJewels = [
    {
      id: 'arn:aws:s3:::fintech-customer-db-backups-2026',
      name: 'Customer DB Backups Bucket',
      type: 'Object Storage (S3)',
      classification: 'Confidential Banking PII (1.4M Accounts)',
      encryption: 'None (Disabled)',
      exposure: 'Public Read Enabled',
      liability: '$1,850,000',
      status: 'CRITICAL RISK'
    },
    {
      id: 'arn:aws:rds:us-east-1:192847192834:db:prod-transactions-db',
      name: 'Production Transaction Database',
      type: 'Relational DB (PostgreSQL 16)',
      classification: 'PCI DSS Cardholder Data Environment',
      encryption: 'AWS-KMS (Active)',
      exposure: 'Direct Public IP Ingress (0.0.0.0/0:5432)',
      liability: '$2,400,000',
      status: 'HIGH RISK'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> High-Value Enterprise Assets
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Data Sensitivity & Encryption Inventory</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Crown Jewel Data Repositories & Assets
          </h2>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          👑 2 Crown Jewel Assets Monitored
        </span>
      </div>

      {/* Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crownJewels.map((cj, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{cj.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{cj.type}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {cj.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-cyan-300 truncate">
              {cj.id}
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-400">
              <div className="flex justify-between">
                <span>Data Classification:</span>
                <span className="font-semibold text-slate-200">{cj.classification}</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption At Rest:</span>
                <span className="font-semibold text-rose-400">{cj.encryption}</span>
              </div>
              <div className="flex justify-between">
                <span>Perimeter Exposure:</span>
                <span className="font-semibold text-amber-300">{cj.exposure}</span>
              </div>
              <div className="flex justify-between">
                <span>Financial Breach Liability:</span>
                <span className="font-bold text-rose-400">{cj.liability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
