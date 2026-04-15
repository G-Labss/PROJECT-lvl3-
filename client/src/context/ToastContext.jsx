import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { GOLD } from '../constants';

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ToastList toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const COLORS = {
  success: { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)', icon: GOLD, text: '#e0e0e0' },
  error:   { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.35)',  icon: '#ef4444', text: '#e0e0e0' },
  warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)',  icon: '#fbbf24', text: '#e0e0e0' },
};

const ToastList = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const Icon = ICONS[t.type] || ICONS.success;
        const c = COLORS[t.type] || COLORS.success;
        return (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.125rem',
              backgroundColor: '#111111',
              border: `1px solid ${c.border}`,
              borderLeft: `3px solid ${c.icon}`,
              borderRadius: '0.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              minWidth: '280px',
              maxWidth: '380px',
              pointerEvents: 'auto',
              animation: 'slideInToast 0.25s ease',
            }}
          >
            <Icon size={18} color={c.icon} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '0.875rem', color: c.text, lineHeight: 1.4 }}>
              {t.message}
            </span>
            <button
              onClick={() => onRemove(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                padding: '0.125rem',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
};
