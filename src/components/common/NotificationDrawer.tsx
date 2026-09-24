import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Bell, 
  Smartphone, 
  Check, 
  Sparkles, 
  Send,
  AlertCircle,
  ShieldCheck
} from './Icons';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationAsRead,
    addNotification,
    myActiveToken
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'sms' | 'app'>('all');
  const [customMsg, setCustomMsg] = useState('');

  if (!isNotificationDrawerOpen) return null;

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleSimulateCustomSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    addNotification('Custom Mandi SMS', customMsg.trim(), 'sms');
    setCustomMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">SMS & Notification Center</h3>
              <p className="text-[11px] text-slate-400">National SMS Gateway • Token {myActiveToken?.tokenNumber || 'A-024'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Notice */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center space-x-2 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span><strong>Telecom Gateway:</strong> Automated SMS notifications dispatched directly to registered mobile numbers.</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'all'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'sms'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mandi SMS ({notifications.filter(n => n.type === 'sms').length})
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`pb-2 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'app'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            App Push ({notifications.filter(n => n.type === 'app' || n.type === 'system').length})
          </button>
        </div>

        {/* Notification Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No notifications in this category.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.type === 'sms'
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                } ${!item.isRead ? 'shadow-sm ring-1 ring-emerald-500/20' : 'opacity-85'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    {item.type === 'sms' ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-700 text-white flex items-center space-x-1">
                        <MessageSquare className="w-2.5 h-2.5" />
                        <span>SMS: AX-EKISAN</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center space-x-1">
                        <Bell className="w-2.5 h-2.5" />
                        <span>APP PUSH</span>
                      </span>
                    )}
                    <span className="font-semibold text-xs text-slate-900">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white/80 p-2 rounded-lg border border-slate-100">
                  {item.message}
                </p>

                {!item.isRead && (
                  <div className="mt-2 flex items-center justify-end space-x-1 text-[10px] text-emerald-700 font-medium">
                    <Check className="w-3 h-3" />
                    <span>Mark as Read</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Dispatch Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <p className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick SMS Dispatcher:</span>
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-2.5 text-[10px]">
            <button
              onClick={() => addNotification('Queue Alert', `Token A-024: 3 farmers ahead. Please stand near Counter 2.`, 'sms')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-left truncate"
            >
              📲 Trigger 3-Ahead Alert
            </button>
            <button
              onClick={() => addNotification('Counter Call', `Token A-024: Proceed to Counter 2 immediately for weighing.`, 'sms')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-left truncate"
            >
              📢 Trigger Counter Call
            </button>
          </div>

          <form onSubmit={handleSimulateCustomSMS} className="flex items-center space-x-1.5">
            <input
              type="text"
              placeholder="Type custom farmer SMS alert..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-lg transition"
              title="Send simulated SMS"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
