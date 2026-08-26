import React, { useState } from 'react';
import { FileCode, Play, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';
import { scanTerraformCode } from '../engine/iacScanner';

const SAMPLE_TERRAFORM = `resource "aws_s3_bucket" "prod_customer_data" {
  bucket = "customer-vault-2026-prod"
  acl    = "public-read"
}

resource "aws_iam_policy" "wildcard_access" {
  name = "WildcardAdmin"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "s3:*"
      Resource = "*"
    }]
  })
}

resource "aws_security_group" "web_sg" {
  name = "web_ingress"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

export default function IacScannerView() {
  const [code, setCode] = useState(SAMPLE_TERRAFORM);
  const [results, setResults] = useState(null);

  const handleScan = () => {
    const res = scanTerraformCode(code);
    setResults(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" /> Shift-Left Cloud Security
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Terraform & OpenTofu Static Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Infrastructure-as-Code (IaC) Misconfiguration Scanner
          </h2>
        </div>

        <button
          onClick={handleScan}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run IaC Security Scan</span>
        </button>
      </div>

      {/* Editor and Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Input */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span className="font-mono font-semibold text-slate-300">main.tf (Terraform Config)</span>
            <button
              onClick={() => setCode(SAMPLE_TERRAFORM)}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Load Vulnerable Sample
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50 resize-none"
            placeholder="Paste your Terraform code here..."
          />
        </div>

        {/* Scan Results */}
        <div className="lg:col-span-5 space-y-4">
          {results ? (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">Scan Findings</h3>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  results.totalIssues > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {results.totalIssues} Policy Violations Found
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                {results.issues.map((issue, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold text-cyan-400">{issue.ruleId}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 uppercase">
                        {issue.severity}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-100">{issue.title}</div>
                    <p className="text-[11px] text-slate-400 mt-1">{issue.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs flex flex-col items-center justify-center min-h-[300px]">
              <Sparkles className="w-8 h-8 text-cyan-400/60 mb-2 animate-pulse" />
              <span>Click "Run IaC Security Scan" to analyze your Terraform code.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
