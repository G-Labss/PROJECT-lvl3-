import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../services/api';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

import { GOLD, DAYS_SHORT as DAYS, DISPLAY_TO_JS_DOW, TIME_BLOCKS } from '../constants';
import { formatTime } from '../utils/formatters';

function formatBlockLabel(startTime) {
  const block = TIME_BLOCKS.find(b => b.key === startTime);
  return block ? block.label : startTime;
}

function formatBlockSub(startTime) {
  const block = TIME_BLOCKS.find(b => b.key === startTime);
  return block ? block.sub : '';
}


function getWeekDates(weekOffset) {
  const today = new Date();
  // Find this Monday
  const dow = today.getDay(); // 0=Sun
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const AvailabilityCalendar = ({ onSelect, selectedSlot }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    availabilityAPI.getSlots()
      .then(data => {
        setSlots((data.slots || []).filter(s => s.isActive));
        setBookedSlots(data.bookedSlots || []);
      })
      .catch(() => setError('Could not load available times.'))
      .finally(() => setLoading(false));
  }, []);

  const weekDates = getWeekDates(weekOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getSlotsForDate(date) {
    const jsDow = date.getDay();
    return slots.filter(s => DISPLAY_TO_JS_DOW[s.dayOfWeek] === jsDow || s.dayOfWeek === jsDow);
  }

  function isBooked(date, time) {
    return bookedSlots.some(b => {
      const bDate = new Date(b.date);
      return isSameDay(bDate, date) && b.time === time;
    });
  }

  function isPast(date) {
    return date < today;
  }

  function isSelected(date, time) {
    if (!selectedSlot) return false;
    return isSameDay(new Date(selectedSlot.date), date) && selectedSlot.time === time;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: GOLD }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return <p style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error}</p>;
  }

  if (slots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No availability set yet.</p>
        <p style={{ fontSize: '0.875rem' }}>The coach hasn't added time slots. Contact directly to schedule.</p>
      </div>
    );
  }

  const weekLabel = (() => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  })();

  return (
    <div>
      {/* Week navigation */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.25rem',
      }}>
        <button
          type="button"
          onClick={() => setWeekOffset(w => w - 1)}
          disabled={weekOffset <= 0}
          style={{
            background: 'none', border: 'none', cursor: weekOffset <= 0 ? 'not-allowed' : 'pointer',
            color: weekOffset <= 0 ? '#444' : GOLD, padding: '0.25rem',
            display: 'flex', alignItems: 'center',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <span style={{ color: '#ccc', fontSize: '0.9rem', fontWeight: 500 }}>{weekLabel}</span>

        <button
          type="button"
          onClick={() => setWeekOffset(w => w + 1)}
          disabled={weekOffset >= 1}
          style={{
            background: 'none', border: 'none', cursor: weekOffset >= 1 ? 'not-allowed' : 'pointer',
            color: weekOffset >= 1 ? '#444' : GOLD, padding: '0.25rem',
            display: 'flex', alignItems: 'center',
          }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Day columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {weekDates.map((date, i) => {
          const daySlots = getSlotsForDate(date).sort((a, b) => a.startTime.localeCompare(b.startTime));
          const past = isPast(date);
          const isToday = isSameDay(date, new Date());

          return (
            <div key={i}>
              {/* Day header */}
              <div style={{
                textAlign: 'center',
                marginBottom: '0.5rem',
              }}>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
                  color: past ? '#444' : GOLD, textTransform: 'uppercase',
                }}>
                  {DAYS[i]}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: isToday ? '#fff' : past ? '#333' : '#aaa',
                  backgroundColor: isToday ? GOLD : 'transparent',
                  borderRadius: '50%',
                  width: '26px', height: '26px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0.25rem auto 0',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {date.getDate()}
                </div>
              </div>

              {/* Time slots */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {daySlots.length === 0 ? (
                  <div style={{ height: '2rem' }} />
                ) : daySlots.map(slot => {
                  const booked = isBooked(date, slot.startTime);
                  const selected = isSelected(date, slot.startTime);
                  const disabled = past || booked;

                  return (
                    <button
                      key={slot._id}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && onSelect({ date: date.toISOString(), time: slot.startTime, slotId: slot._id })}
                      style={{
                        padding: '0.3rem 0.2rem',
                        fontSize: '0.7rem',
                        fontWeight: selected ? 700 : 500,
                        borderRadius: '0.375rem',
                        border: selected ? `1.5px solid ${GOLD}` : booked ? '1.5px solid #2a2a2a' : '1.5px solid #333',
                        backgroundColor: selected ? GOLD : booked ? '#1a1a1a' : '#111',
                        color: selected ? '#000' : disabled ? '#333' : '#ccc',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                      title={booked ? 'Already booked' : past ? 'Past date' : `Book ${formatBlockLabel(slot.startTime)}`}
                    >
                      <div>{formatBlockLabel(slot.startTime)}</div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.55 }}>{formatBlockSub(slot.startTime)}</div>
                      {booked && <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Booked</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedSlot && (
        <div style={{
          marginTop: '1.25rem', padding: '0.75rem 1rem',
          backgroundColor: '#1a1500',
          border: `1px solid ${GOLD}`,
          borderRadius: '0.5rem',
          color: GOLD,
          fontSize: '0.875rem',
          textAlign: 'center',
        }}>
          Selected: <strong>
            {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </strong> at <strong>{formatTime(selectedSlot.time)}</strong>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
