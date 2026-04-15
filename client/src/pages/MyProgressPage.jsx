import React, { useEffect, useState, useCallback } from 'react';
import { progressAPI } from '../services/api';
import { useAppContext } from '../context/useAppContext';
import { useToast } from '../context/ToastContext';
import { GOLD } from '../constants';
import { TrendingUp, FileText, Trophy, Activity } from 'lucide-react';

const STROKES = [
  { key: 'forehand',   label: 'Forehand' },
  { key: 'backhand',   label: 'Backhand' },
  { key: 'serve',      label: 'Serve' },
  { key: 'volley',     label: 'Volley' },
  { key: 'footwork',   label: 'Footwork' },
  { key: 'mentalGame', label: 'Mental Game' },
];

const MILESTONE_ICONS = {
  'First Session': '🎾',
  '5 Sessions':    '⭐',
  '10 Sessions':   '🏅',
  '25 Sessions':   '🥈',
  '50 Sessions':   '🏆',
};

const ALL_MILESTONES = [
  { name: 'First Session', sessions: 1 },
  { name: '5 Sessions',    sessions: 5 },
  { name: '10 Sessions',   sessions: 10 },
  { name: '25 Sessions',   sessions: 25 },
  { name: '50 Sessions',   sessions: 50 },
];

const StrokeBar = ({ label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
    <span style={{ width: '100px', fontSize: '0.8125rem', color: '#aaa', flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, display: 'flex', gap: '0.25rem' }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          flex: 1, height: '10px', borderRadius: '2px',
          backgroundColor: i < value
            ? (i < 4 ? '#c9a84c66' : i < 7 ? GOLD : '#e8c96a')
            : '#1e1e1e',
        }} />
      ))}
    </div>
    <span style={{ width: '24px', textAlign: 'right', fontSize: '0.875rem', color: value > 0 ? GOLD : '#555', fontWeight: 600 }}>
      {value > 0 ? value : '–'}
    </span>
  </div>
);

const NtrpChart = ({ history }) => {
  if (!history || history.length === 0) {
    return <p style={{ color: '#555', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>No NTRP entries yet — your coach will log these after sessions.</p>;
  }
  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', minWidth: `${sorted.length * 44}px`, height: '100px', padding: '0 0.25rem' }}>
        {sorted.map((entry, i) => {
          const pct = ((entry.rating - 1) / 6) * 100;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 36px', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: GOLD, fontWeight: 600 }}>{entry.rating}</span>
              <div style={{ width: '100%', height: `${Math.max(pct, 8)}px`, backgroundColor: `rgba(201,168,76,${0.3 + (pct / 100) * 0.7})`, borderRadius: '3px 3px 0 0' }} />
              <span style={{ fontSize: '0.6rem', color: '#555', writingMode: 'vertical-rl', transform: 'rotate(180deg)', marginTop: '0.25rem' }}>
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MyProgressPage = () => {
  const { state } = useAppContext();
  const toast = useToast();
  const email = state.authUser?.email;

  const [progress, setProgress]         = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('strokes');

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await progressAPI.get(email);
      setSessionCount(res.sessionCount || 0);
      setProgress(res.data || null);
    } catch {
      toast('Failed to load your progress', 'error');
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => { load(); }, [load]);

  const strokes = progress?.strokeRatings || {};
  const hasAnyStroke = STROKES.some(s => (strokes[s.key] || 0) > 0);

  const tabs = [
    { id: 'strokes',    label: 'Strokes',    icon: Activity },
    { id: 'ntrp',       label: 'NTRP',       icon: TrendingUp },
    { id: 'notes',      label: 'Notes',      icon: FileText },
    { id: 'milestones', label: 'Milestones', icon: Trophy },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '2rem 1rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '0.25rem', fontFamily: "'Playfair Display', serif" }}>
            My Progress
          </h1>
          <p style={{ color: '#555', fontSize: '0.9375rem' }}>
            {state.authUser?.name ? `Welcome back, ${state.authUser.name}` : email} · {sessionCount} paid session{sessionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Milestones strip */}
      {progress?.milestones?.length > 0 && (
        <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '0.75rem 1rem' }}>
          <div className="container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {progress.milestones.map((m, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '999px', fontSize: '0.75rem', color: GOLD }}>
                {MILESTONE_ICONS[m.name] || '🎾'} {m.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e' }}>
        <div className="container">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t.id} type="button" onClick={() => setActiveTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '1rem 1.25rem', background: 'none', border: 'none', borderBottom: activeTab === t.id ? `2px solid ${GOLD}` : '2px solid transparent', color: activeTab === t.id ? GOLD : '#555', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeTab === t.id ? 600 : 400, whiteSpace: 'nowrap' }}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {loading ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Loading your progress…</p>
        ) : (
          <>
            {/* Strokes */}
            {activeTab === 'strokes' && (
              <div className="card" style={{ padding: '1.5rem', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>Stroke Ratings</h2>
                {hasAnyStroke ? (
                  STROKES.map(s => <StrokeBar key={s.key} label={s.label} value={strokes[s.key] || 0} />)
                ) : (
                  <p style={{ color: '#555', fontSize: '0.875rem' }}>No stroke ratings yet — your coach will fill these in after your sessions.</p>
                )}
              </div>
            )}

            {/* NTRP */}
            {activeTab === 'ntrp' && (
              <div className="card" style={{ padding: '1.5rem', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>NTRP Rating History</h2>
                <NtrpChart history={progress?.ntrpHistory} />
                {progress?.ntrpHistory?.length > 0 && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[...progress.ntrpHistory].sort((a, b) => new Date(b.date) - new Date(a.date)).map((e, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0.875rem', backgroundColor: '#0d0d0d', borderRadius: '0.375rem', border: '1px solid #1a1a1a' }}>
                        <span style={{ color: '#aaa', fontSize: '0.875rem' }}>{e.note || '—'}</span>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ color: GOLD, fontWeight: 700 }}>{e.rating}</span>
                          <span style={{ color: '#555', fontSize: '0.75rem' }}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {activeTab === 'notes' && (
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Session Notes from Coach</h2>
                {!progress?.notes?.length ? (
                  <p style={{ color: '#555', fontSize: '0.875rem' }}>No notes yet — your coach will add feedback after each session.</p>
                ) : progress.notes.map(n => (
                  <div key={n._id} className="card" style={{ padding: '1rem 1.25rem', border: '1px solid #1e1e1e' }}>
                    <p style={{ margin: 0, color: '#d0d0d0', fontSize: '0.9rem', lineHeight: 1.6 }}>{n.text}</p>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#555' }}>
                      {new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Milestones */}
            {activeTab === 'milestones' && (
              <div className="card" style={{ padding: '1.5rem', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>Milestones</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ALL_MILESTONES.map(m => {
                    const achieved = progress?.milestones?.some(ms => ms.name === m.name);
                    const achievedDate = progress?.milestones?.find(ms => ms.name === m.name)?.achievedAt;
                    return (
                      <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', backgroundColor: achieved ? 'rgba(201,168,76,0.06)' : '#0d0d0d', border: `1px solid ${achieved ? 'rgba(201,168,76,0.25)' : '#1a1a1a'}`, borderRadius: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{achieved ? MILESTONE_ICONS[m.name] : '⬜'}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600, color: achieved ? GOLD : '#555', fontSize: '0.9rem' }}>{m.name}</p>
                          {achievedDate && <p style={{ margin: 0, fontSize: '0.75rem', color: '#555' }}>Achieved {new Date(achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: achieved ? GOLD : '#444', fontWeight: 500 }}>{sessionCount}/{m.sessions}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProgressPage;
