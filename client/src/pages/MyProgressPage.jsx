import React, { useEffect, useState, useCallback } from 'react';
import { progressAPI, bookingAPI } from '../services/api';
import { useAppContext } from '../context/useAppContext';
import { useToast } from '../context/ToastContext';
import { GOLD } from '../constants';
import { TrendingUp, FileText, Trophy, Activity, Calendar, Clock, Lock } from 'lucide-react';

const STROKES = [
  { key: 'forehand',   label: 'Forehand' },
  { key: 'backhand',   label: 'Backhand' },
  { key: 'serve',      label: 'Serve' },
  { key: 'volley',     label: 'Volley' },
  { key: 'footwork',   label: 'Footwork' },
  { key: 'mentalGame', label: 'Mental Game' },
];

const ALL_MILESTONES = [
  { name: 'First Session', sessions: 1,  icon: '🎾', desc: 'Stepped on the court' },
  { name: '5 Sessions',    sessions: 5,  icon: '⭐', desc: 'Building the habit' },
  { name: '10 Sessions',   sessions: 10, icon: '🏅', desc: 'Real commitment' },
  { name: '25 Sessions',   sessions: 25, icon: '🥈', desc: 'Serious player' },
  { name: '50 Sessions',   sessions: 50, icon: '🏆', desc: 'Elite dedication' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatUpcoming(booking) {
  if (!booking?.scheduledDate) return null;
  const d = new Date(booking.scheduledDate);
  const day  = DAY_NAMES[d.getDay()];
  const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const time = booking.scheduledTime || null;
  return { day, date, time, title: booking.lesson?.title || 'Tennis Lesson', status: booking.paymentStatus };
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

// Visual achievement badge — earned = glowing gold, locked = dark + lock icon
const MilestoneBadge = ({ milestone, achieved, achievedDate, sessionCount }) => {
  const progress = Math.min(sessionCount / milestone.sessions, 1);
  const pct = Math.round(progress * 100);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.75rem 1rem 1.5rem',
      backgroundColor: achieved ? 'rgba(201,168,76,0.06)' : '#0d0d0d',
      border: `1px solid ${achieved ? 'rgba(201,168,76,0.3)' : '#1a1a1a'}`,
      borderRadius: '1rem',
      textAlign: 'center',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        if (achieved) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.35), 0 12px 32px rgba(201,168,76,0.12)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Badge circle */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: achieved ? 'rgba(201,168,76,0.12)' : '#111',
        border: `2px solid ${achieved ? 'rgba(201,168,76,0.5)' : '#222'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        marginBottom: '0.875rem',
        position: 'relative',
        boxShadow: achieved ? '0 0 24px rgba(201,168,76,0.2), inset 0 0 16px rgba(201,168,76,0.06)' : 'none',
      }}>
        {achieved ? (
          milestone.icon
        ) : (
          <>
            <span style={{ opacity: 0.18, fontSize: '1.75rem' }}>{milestone.icon}</span>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(10,10,10,0.55)',
            }}>
              <Lock size={16} color="#444" />
            </div>
          </>
        )}
      </div>

      {/* Name */}
      <p style={{
        margin: '0 0 0.25rem',
        fontWeight: 700,
        fontSize: '0.9375rem',
        color: achieved ? GOLD : '#555',
        fontFamily: "'Playfair Display', serif",
      }}>
        {milestone.name}
      </p>

      {/* Description */}
      <p style={{ margin: '0 0 0.875rem', fontSize: '0.75rem', color: achieved ? '#888' : '#3a3a3a', lineHeight: 1.5 }}>
        {milestone.desc}
      </p>

      {/* Progress bar */}
      {!achieved && (
        <div style={{ width: '100%', marginBottom: '0.5rem' }}>
          <div style={{ height: '4px', backgroundColor: '#1e1e1e', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: `linear-gradient(90deg, rgba(201,168,76,0.5), rgba(201,168,76,0.85))`,
              borderRadius: '2px',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
          </div>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: '#444' }}>
            {sessionCount} / {milestone.sessions} sessions
          </p>
        </div>
      )}

      {/* Achieved date */}
      {achieved && achievedDate && (
        <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(201,168,76,0.55)' }}>
          {new Date(achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </div>
  );
};

// Upcoming lesson card shown at top of page
const UpcomingLessonCard = ({ booking }) => {
  const info = formatUpcoming(booking);
  if (!info) return null;

  const isPaid = info.status === 'paid';

  return (
    <div data-reveal style={{
      backgroundColor: '#0d0d0d',
      border: '1px solid rgba(201,168,76,0.22)',
      borderLeft: `3px solid ${GOLD}`,
      borderRadius: '0.875rem',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
    }}>
      {/* Icon */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Calendar size={20} color={GOLD} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: '160px' }}>
        <p style={{
          margin: '0 0 0.2rem',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: GOLD,
          fontFamily: 'Inter, sans-serif',
        }}>
          Next Lesson
        </p>
        <p style={{ margin: 0, fontWeight: 600, color: '#f0f0f0', fontSize: '1rem' }}>
          {info.title}
        </p>
      </div>

      {/* Date + time */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ccc', fontSize: '0.9rem', fontWeight: 500 }}>
          <Calendar size={14} color="#666" />
          {info.day}, {info.date}
        </div>
        {info.time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#777', fontSize: '0.8125rem' }}>
            <Clock size={13} color="#555" />
            {info.time}
          </div>
        )}
        <span style={{
          marginTop: '0.25rem',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.2rem 0.6rem',
          borderRadius: '9999px',
          backgroundColor: isPaid ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
          color: isPaid ? '#4ade80' : '#fbbf24',
          border: `1px solid ${isPaid ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
        }}>
          {isPaid ? 'Paid' : 'Payment Pending'}
        </span>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const MyProgressPage = () => {
  const { state } = useAppContext();
  const toast = useToast();
  const email = state.authUser?.email;

  const [progress,      setProgress]      = useState(null);
  const [sessionCount,  setSessionCount]  = useState(0);
  const [upcoming,      setUpcoming]      = useState(undefined); // undefined = loading, null = none
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState('strokes');

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const [progressRes, upcomingRes] = await Promise.all([
        progressAPI.get(email),
        bookingAPI.getUpcoming(email).catch(() => ({ data: null })),
      ]);
      setSessionCount(progressRes.sessionCount || 0);
      setProgress(progressRes.data || null);
      setUpcoming(upcomingRes.data || null);
    } catch {
      toast('Failed to load your progress', 'error');
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => { load(); }, [load]);

  const strokes    = progress?.strokeRatings || {};
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
            {state.authUser?.name ? `Welcome back, ${state.authUser.name}` : email}
            {' · '}
            {sessionCount} paid session{sessionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Earned badges strip */}
      {progress?.milestones?.length > 0 && (
        <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '0.75rem 1rem' }}>
          <div className="container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {progress.milestones.map((m, i) => {
              const def = ALL_MILESTONES.find(ms => ms.name === m.name);
              return (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.25rem 0.65rem',
                  backgroundColor: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  color: GOLD,
                }}>
                  {def?.icon || '🎾'} {m.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1e1e1e' }}>
        <div className="container">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t.id} type="button" onClick={() => setActiveTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '1rem 1.25rem',
                background: 'none', border: 'none',
                borderBottom: activeTab === t.id ? `2px solid ${GOLD}` : '2px solid transparent',
                color: activeTab === t.id ? GOLD : '#555',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeTab === t.id ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>
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
            {/* Upcoming lesson — shown on every tab */}
            {upcoming && <UpcomingLessonCard booking={upcoming} />}

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
              <div style={{ maxWidth: '720px' }}>
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>Achievement Badges</h2>

                {/* Next milestone progress summary */}
                {(() => {
                  const next = ALL_MILESTONES.find(m => sessionCount < m.sessions);
                  if (!next) return (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', backgroundColor: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '0.75rem', color: GOLD, fontSize: '0.9375rem', fontWeight: 500 }}>
                      🏆 You've unlocked all milestones. Incredible dedication!
                    </div>
                  );
                  const prev = ALL_MILESTONES[ALL_MILESTONES.indexOf(next) - 1];
                  const from = prev?.sessions || 0;
                  const range = next.sessions - from;
                  const done  = sessionCount - from;
                  const pct   = Math.round((done / range) * 100);
                  return (
                    <div style={{ marginBottom: '1.75rem', padding: '1rem 1.25rem', backgroundColor: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                        <span style={{ color: '#888', fontSize: '0.875rem' }}>Next: <span style={{ color: GOLD, fontWeight: 600 }}>{next.icon} {next.name}</span></span>
                        <span style={{ color: '#555', fontSize: '0.8125rem' }}>{sessionCount} / {next.sessions}</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, rgba(201,168,76,0.6), ${GOLD})`,
                          borderRadius: '3px',
                          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        }} />
                      </div>
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: '#444' }}>
                        {next.sessions - sessionCount} more session{next.sessions - sessionCount !== 1 ? 's' : ''} to go
                      </p>
                    </div>
                  );
                })()}

                {/* Badge grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '1rem',
                }}>
                  {ALL_MILESTONES.map(m => {
                    const achieved    = progress?.milestones?.some(ms => ms.name === m.name);
                    const achievedDate = progress?.milestones?.find(ms => ms.name === m.name)?.achievedAt;
                    return (
                      <MilestoneBadge
                        key={m.name}
                        milestone={m}
                        achieved={achieved}
                        achievedDate={achievedDate}
                        sessionCount={sessionCount}
                      />
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
