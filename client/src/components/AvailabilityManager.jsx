import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import { Save, Loader, Check, X } from 'lucide-react';
import { DAYS, TIME_BLOCKS, GOLD } from '../constants';

const AvailabilityManager = () => {
  // blocked[dayIndex] = Set of block keys ('07:00', '12:00', '17:00')
  const [blocked, setBlocked] = useState(() =>
    Array.from({ length: 7 }, () => new Set())
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    availabilityAPI.getSlots()
      .then(data => {
        const newBlocked = Array.from({ length: 7 }, () => new Set());
        (data.slots || []).forEach(slot => {
          if (!slot.isActive && slot.dayOfWeek >= 0 && slot.dayOfWeek <= 6) {
            newBlocked[slot.dayOfWeek].add(slot.startTime);
          }
        });
        setBlocked(newBlocked);
      })
      .catch(() => setError('Failed to load schedule.'))
      .finally(() => setLoading(false));
  }, []);

  function toggle(dayIndex, key) {
    setBlocked(prev => {
      const next = prev.map(s => new Set(s));
      if (next[dayIndex].has(key)) {
        next[dayIndex].delete(key);
      } else {
        next[dayIndex].add(key);
      }
      return next;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const slots = [];
      DAYS.forEach((_, dayIndex) => {
        TIME_BLOCKS.forEach(({ key }) => {
          slots.push({
            dayOfWeek: dayIndex,
            startTime: key,
            isActive: !blocked[dayIndex].has(key),
          });
        });
      });
      await availabilityAPI.upsert(slots);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: GOLD }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const totalBlocked = blocked.reduce((sum, s) => sum + s.size, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f0f0f0', marginBottom: '0.25rem' }}>
            Weekly Schedule
          </h2>
          <p style={{ color: '#555', fontSize: '0.875rem' }}>
            All slots available by default. Click to mark when you're <span style={{ color: '#ef4444' }}>unavailable</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: saved ? '#14532d' : GOLD,
            color: saved ? '#fff' : '#000',
            border: 'none', borderRadius: '0.5rem',
            fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem', transition: 'all 0.2s',
          }}
        >
          {saving ? <Loader size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : `Save${totalBlocked > 0 ? ` (${totalBlocked} blocked)` : ''}`}
        </button>
      </div>

      {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

      {/* Grid */}
      <div style={{
        backgroundColor: '#0d0d0d',
        borderRadius: '0.75rem',
        border: '1px solid #1e1e1e',
        overflow: 'hidden',
      }}>
        {/* Day header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px repeat(7, 1fr)',
          backgroundColor: '#111',
          borderBottom: '1px solid #1e1e1e',
        }}>
          <div style={{ padding: '0.875rem', borderRight: '1px solid #1e1e1e' }} />
          {DAYS.map((day, i) => (
            <div key={i} style={{
              padding: '0.875rem 0.5rem',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              color: blocked[i].size === TIME_BLOCKS.length ? '#ef4444' : GOLD,
              borderRight: i < 6 ? '1px solid #1e1e1e' : 'none',
            }}>
              {day.slice(0, 3).toUpperCase()}
              <div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '0.2rem', color: '#444' }}>
                {blocked[i].size === 0 ? 'all open' : blocked[i].size === TIME_BLOCKS.length ? 'day off' : `${blocked[i].size} off`}
              </div>
            </div>
          ))}
        </div>

        {/* Time block rows */}
        {TIME_BLOCKS.map(({ key, label, sub }, bi) => (
          <div key={key} style={{
            display: 'grid',
            gridTemplateColumns: '110px repeat(7, 1fr)',
            borderBottom: bi < TIME_BLOCKS.length - 1 ? '1px solid #161616' : 'none',
          }}>
            {/* Block label */}
            <div style={{
              padding: '1rem 0.875rem',
              borderRight: '1px solid #1e1e1e',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ccc', letterSpacing: '0.03em' }}>{label}</div>
              <div style={{ fontSize: '0.7rem', color: '#444', marginTop: '0.15rem' }}>{sub}</div>
            </div>

            {/* Day cells */}
            {DAYS.map((_, di) => {
              const isBlocked = blocked[di].has(key);
              return (
                <div
                  key={di}
                  onClick={() => toggle(di, key)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRight: di < 6 ? '1px solid #161616' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.15s',
                    backgroundColor: isBlocked ? 'rgba(239,68,68,0.05)' : 'transparent',
                  }}
                  title={isBlocked ? `Mark available` : `Mark unavailable`}
                >
                  <div style={{
                    width: '40px', height: '36px',
                    borderRadius: '0.5rem',
                    backgroundColor: isBlocked ? 'rgba(239,68,68,0.12)' : 'rgba(201,168,76,0.07)',
                    border: isBlocked ? '1.5px solid rgba(239,68,68,0.35)' : `1.5px solid rgba(201,168,76,0.18)`,
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {isBlocked
                      ? <X size={15} color="#ef4444" strokeWidth={2.5} />
                      : <Check size={15} color={GOLD} strokeWidth={2} style={{ opacity: 0.4 }} />
                    }
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ color: '#333', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
        Gold = available &nbsp;·&nbsp; Red = unavailable &nbsp;·&nbsp; Click any cell to toggle
      </p>
    </div>
  );
};

export default AvailabilityManager;
