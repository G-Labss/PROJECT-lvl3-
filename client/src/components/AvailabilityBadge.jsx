import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import { GOLD } from '../constants';
import { CalendarCheck, Zap } from 'lucide-react';

/**
 * AvailabilityBadge
 *
 * Fetches the /api/availability/summary endpoint on mount and renders two
 * pieces of information side-by-side:
 *
 *   [⚡ 5 spots left this week]   [📅 Next opening: Thursday Morning]
 *
 * Rules:
 *  - If spotsThisWeek === 0 and no nextOpening → show "Fully booked this week"
 *  - If spotsThisWeek <= 2 → badge turns amber to create urgency
 *  - While loading → skeleton pulse animation
 *  - On API error → renders nothing (fail silently, not a critical UI element)
 */
const AvailabilityBadge = () => {
  const [summary, setSummary]   = useState(null); // null = loading, false = error
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    availabilityAPI.getSummary()
      .then(data => setSummary(data))
      .catch(() => setSummary(false)) // fail silently
      .finally(() => setLoading(false));
  }, []);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {/* Two skeleton pills */}
        {[140, 200].map(w => (
          <div
            key={w}
            style={{
              width: w,
              height: 34,
              borderRadius: '999px',
              backgroundColor: '#1a1a1a',
              // Simple CSS pulse via opacity animation using inline keyframe trick
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
        {/* Inline keyframe for the skeleton pulse */}
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  // ── API error or no data → render nothing ─────────────────────────────────
  if (!summary) return null;

  const { spotsThisWeek, nextOpening } = summary;

  // ── Fully booked ──────────────────────────────────────────────────────────
  if (spotsThisWeek === 0 && !nextOpening) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <Pill color="#ef4444" borderColor="rgba(239,68,68,0.3)" bg="rgba(239,68,68,0.08)">
          <CalendarCheck size={14} />
          Fully booked this week — check back soon
        </Pill>
      </div>
    );
  }

  // ── Urgency colour: amber when ≤ 5 spots, gold otherwise ─────────────────
  const urgency   = spotsThisWeek > 0 && spotsThisWeek <= 5;
  const spotColor = urgency ? '#f59e0b' : GOLD;           // amber vs. gold
  const spotBg    = urgency ? 'rgba(245,158,11,0.08)' : 'rgba(201,168,76,0.08)';
  const spotBorder = urgency ? 'rgba(245,158,11,0.35)' : 'rgba(201,168,76,0.25)';

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>

      {/* ── Spots-left pill ─────────────────────────────────────────────── */}
      {spotsThisWeek > 0 && (
        <Pill color={spotColor} borderColor={spotBorder} bg={spotBg}>
          <Zap size={13} fill={urgency ? '#f59e0b' : 'none'} />
          {/* Show exact count when scarce, otherwise a friendly label */}
          {urgency
            ? `Only ${spotsThisWeek} spot${spotsThisWeek > 1 ? 's' : ''} left this week`
            : `${spotsThisWeek} spot${spotsThisWeek > 1 ? 's' : ''} open this week`}
        </Pill>
      )}

      {/* ── Next-opening pill ───────────────────────────────────────────── */}
      {nextOpening && (
        <Pill color="#a0a0a0" borderColor="#2a2a2a" bg="rgba(255,255,255,0.03)">
          <CalendarCheck size={13} />
          {/* e.g. "Next opening: Thursday Morning" or "Today Evening" */}
          Next opening: <strong style={{ color: '#e0e0e0', marginLeft: '0.25rem' }}>
            {nextOpening.dayLabel} {nextOpening.timeLabel}
          </strong>
        </Pill>
      )}

    </div>
  );
};

/**
 * Pill — small reusable inline badge used above.
 * Keeps the JSX above clean and avoids repeating the same style object.
 */
const Pill = ({ children, color, borderColor, bg }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.375rem 0.875rem',
      borderRadius: '999px',
      fontSize: '0.8125rem',
      fontWeight: 500,
      color,
      backgroundColor: bg,
      border: `1px solid ${borderColor}`,
      // Subtle entrance — the badge fades in so it doesn't pop in jarringly
      animation: 'fadeIn 0.3s ease',
    }}
  >
    {children}
    <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }`}</style>
  </div>
);

export default AvailabilityBadge;
