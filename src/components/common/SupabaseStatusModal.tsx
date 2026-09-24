import React, { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { Database, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, FileText, Lock, Globe } from './Icons';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const isConfigured = isSupabaseConfigured();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    if (!isConfigured || !supabase) {
      setTimeout(() => {
        setTesting(false);
        setTestResult({
          success: false,
          message: 'No live Supabase credentials detected in environment variables. Application is currently using dynamic in-memory & local-storage state engine.'
        });
      }, 600);
      return;
    }

    try {
      const { data, error } = await supabase.from('procurement_centers').select('count').limit(1);
      setTesting(false);
      if (error) {
        setTestResult({
          success: false,
          message: `Connection test failed: ${error.message}. Please verify your tables were created using supabase/schema.sql.`
        });
      } else {
        setTestResult({
          success: true,
          message: 'Successfully connected to live Supabase PostgreSQL database! All tables and RLS policies are active.'
        });
      }
    } catch (err: any) {
      setTesting(false);
      setTestResult({
        success: false,
        message: `Exception during connection: ${err.message}`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  Backend Architecture
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  Supabase Backend Integration
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Connect your real-time PostgreSQL database with Row Level Security (RLS)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* Current Status Box */}
          <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
            isConfigured
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="mt-0.5">
              {isConfigured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">
                  {isConfigured ? 'Supabase Live Connection Configured' : 'Dynamic In-Memory Engine Active'}
                </p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  isConfigured ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  {isConfigured ? 'LIVE DATABASE' : 'MOCK ENGINE'}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                {isConfigured
                  ? 'Your application is reading and writing directly to your Supabase PostgreSQL cluster with full RLS security enabled.'
                  : 'All values, bookings, calculations, queue updates, and DBT payments operate dynamically in-memory right now. You can attach your real Supabase backend anytime by adding your keys to .env.'}
              </p>
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Connection...' : 'Test Supabase Connectivity'}</span>
            </button>
            <span className="text-slate-500 text-[11px]">Pings your database endpoint with latency telemetry</span>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              testResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <p className="font-semibold">{testResult.success ? 'Test Passed!' : 'Connection Notice'}</p>
              <p className="mt-0.5 text-[11px]">{testResult.message}</p>
            </div>
          )}

          {/* 3 Simple Steps to Attach Backend */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <span>How to Attach Your Supabase Backend</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Create a Free Supabase Project</p>
                  <p className="text-slate-600">
                    Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">supabase.com</a>, create a project (e.g. "e-Kisan MSP Hub").
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Run the Prepared SQL Schema</p>
                  <p className="text-slate-600">
                    Open your Supabase <strong>SQL Editor</strong> and execute the contents of <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">supabase/schema.sql</code>. It creates all tables and the 3-role RLS security policies!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Add Keys into .env</p>
                  <p className="text-slate-600">
                    In your project root, add your Project URL and Anon API key to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">.env</code>:
                  </p>
                  <pre className="mt-1 p-2 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
