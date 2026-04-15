import React, { useState } from 'react';
import Modal from './Modal';
import AvailabilityCalendar from './AvailabilityCalendar';
import { paymentAPI } from '../services/api';
import { CheckCircle, Loader, AlertCircle, Calendar, Smartphone } from 'lucide-react';

import { formatTime } from '../utils/formatters';
import { GOLD, ZELLE_NUMBER } from '../constants';

const BookingModal = ({ lesson, isOpen, onClose }) => {
  const [step, setStep] = useState('schedule'); // 'schedule' | 'details' | 'payment' | 'success'
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetAndClose = () => {
    setStep('schedule');
    setSelectedSlot(null);
    setStudentName('');
    setStudentEmail('');
    setNotes('');
    setError('');
    onClose();
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');
    setStep('payment');
  };

  const handleZelleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await paymentAPI.createZelleBooking({
        lessonId: lesson._id,
        studentName,
        studentEmail,
        notes,
        scheduledDate: selectedSlot?.date,
        scheduledTime: selectedSlot?.time,
        availabilitySlotId: selectedSlot?.slotId,
      });
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!lesson) return null;

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Book Lesson">
      {/* Step indicator */}
      {step !== 'success' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'schedule', label: '1. Schedule' },
            { key: 'details', label: '2. Details' },
            { key: 'payment', label: '3. Payment' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.key}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600,
                color: step === s.key ? GOLD : ['schedule', 'details', 'payment'].indexOf(step) > i ? '#555' : '#333',
              }}>
                {s.label}
              </span>
              {i < arr.length - 1 && <span style={{ color: '#333', fontSize: '0.75rem' }}>›</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* ── Step: schedule ── */}
      {step === 'schedule' && (
        <div>
          <p style={{ color: '#666', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            Pick a time for <strong style={{ color: '#e0e0e0' }}>{lesson.title}</strong>
          </p>

          <AvailabilityCalendar onSelect={setSelectedSlot} selectedSlot={selectedSlot} />

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={resetAndClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 2, opacity: selectedSlot ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              disabled={!selectedSlot}
              onClick={() => setStep('details')}
            >
              {selectedSlot ? <><Calendar size={16} /> Continue</> : 'Select a time to continue'}
            </button>
          </div>
        </div>
      )}

      {/* ── Step: details ── */}
      {step === 'details' && (
        <form onSubmit={handleDetailsSubmit}>
          <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Booking: <strong style={{ color: '#e0e0e0' }}>{lesson.title}</strong> — <span style={{ color: GOLD, fontWeight: 700 }}>${lesson.price}</span>
          </p>
          {selectedSlot && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.25rem', padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(201,168,76,0.07)', border: `1px solid rgba(201,168,76,0.25)`,
              borderRadius: '0.375rem', fontSize: '0.8rem', color: GOLD,
            }}>
              <Calendar size={14} color={GOLD} />
              <span>
                {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {' '}at <strong>{formatTime(selectedSlot.time)}</strong>
              </span>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Your name</label>
            <input
              type="text"
              className="input"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Jane Smith"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="input"
              value={studentEmail}
              onChange={e => setStudentEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Notes <span style={{ color: '#444', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              className="input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Skill level, goals..."
              rows={3}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep('schedule')}>
              Back
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              Continue to payment
            </button>
          </div>
        </form>
      )}

      {/* ── Step: payment (Zelle) ── */}
      {step === 'payment' && (
        <div>
          {/* Personal message */}
          <div style={{
            textAlign: 'center',
            padding: '1.25rem 1rem 1rem',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(201,168,76,0.03) 100%)',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ fontSize: '1.375rem', marginBottom: '0.375rem' }}>🎾</div>
            <p style={{ color: '#e0e0e0', fontFamily: "'Playfair Display', serif", fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              You're one step away, {studentName.split(' ')[0]}.
            </p>
            <p style={{ color: '#555', fontSize: '0.8125rem', lineHeight: 1.6 }}>
              Your spot is being held. Complete your payment and let's get on the court.
            </p>
          </div>

          {/* Order summary pill */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.875rem 1.125rem',
            backgroundColor: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '0.625rem',
            marginBottom: '1.25rem',
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '0.9375rem' }}>{lesson.title}</div>
              {selectedSlot && (
                <div style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                  {' · '}{formatTime(selectedSlot.time)}
                </div>
              )}
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: GOLD, fontFamily: "'Playfair Display', serif" }}>
              ${lesson.price}
            </div>
          </div>

          {/* QR Code section */}
          <div style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '0.875rem',
            padding: '1.5rem 1.25rem',
            marginBottom: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Smartphone size={15} color={GOLD} style={{ opacity: 0.8 }} />
              <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Scan to Pay with Zelle
              </span>
            </div>

            {/* QR frame */}
            <div style={{
              display: 'inline-block',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '0.75rem',
              boxShadow: `0 0 0 1px rgba(201,168,76,0.3), 0 0 24px rgba(201,168,76,0.08)`,
              marginBottom: '1rem',
            }}>
              <img
                src="/media/zelle-qr.png"
                alt="Zelle QR Code"
                style={{ display: 'block', width: '180px', height: '180px', borderRadius: '0.375rem' }}
              />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1e1e1e' }} />
              <span style={{ color: '#333', fontSize: '0.75rem' }}>or enter manually</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1e1e1e' }} />
            </div>

            {/* Manual details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Send to', value: ZELLE_NUMBER, mono: true, highlight: false },
                { label: 'Amount', value: `$${lesson.price}`, mono: false, highlight: true },
                { label: 'Memo', value: `${studentName} — ${lesson.title}`, mono: false, highlight: false },
              ].map(({ label, value, mono, highlight }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: '#111',
                  borderRadius: '0.375rem',
                  border: '1px solid #1a1a1a',
                }}>
                  <span style={{ color: '#444', fontSize: '0.8rem' }}>{label}</span>
                  <span style={{
                    color: highlight ? GOLD : '#ccc',
                    fontWeight: highlight ? 700 : 500,
                    fontFamily: mono ? 'monospace' : 'inherit',
                    fontSize: '0.875rem',
                  }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <CheckCircle size={15} color={GOLD} style={{ flexShrink: 0, marginTop: '0.1rem', opacity: 0.7 }} />
            <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
              After sending, click below to confirm. I'll personally verify and send you a confirmation email within a few hours.
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem',
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.625rem', padding: '0.875rem' }}
            onClick={handleZelleConfirm}
            disabled={loading}
          >
            {loading ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Confirming...</> : <><CheckCircle size={18} /> I've sent the payment</>}
          </button>

          <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setStep('details')}>
            Back
          </button>
        </div>
      )}

      {/* ── Step: success ── */}
      {step === 'success' && (
        <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
          {/* Icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.04) 100%)',
            border: '2px solid rgba(201,168,76,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 32px rgba(201,168,76,0.12)',
          }}>
            <CheckCircle size={38} color={GOLD} />
          </div>

          <h3 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '0.375rem', fontFamily: "'Playfair Display', serif" }}>
            Welcome to the Academy.
          </h3>
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Your booking is in. I'll confirm once payment clears<br />and we'll be on the court before you know it.
          </p>

          {/* Booking summary card */}
          <div style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>
              Booking Summary
            </div>
            {[
              { label: 'Lesson', value: lesson.title },
              { label: 'Student', value: studentName },
              ...(selectedSlot ? [{
                label: 'Date',
                value: `${new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · ${formatTime(selectedSlot.time)}`
              }] : []),
              { label: 'Status', value: 'Pending confirmation', gold: true },
            ].map(({ label, value, gold }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#444' }}>{label}</span>
                <span style={{ color: gold ? GOLD : '#ccc', fontWeight: gold ? 600 : 400, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}
          </div>

          <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            A confirmation will be sent to <span style={{ color: '#888' }}>{studentEmail}</span>
          </p>

          <button type="button" className="btn btn-primary" style={{ minWidth: '160px', padding: '0.875rem 2rem' }} onClick={resetAndClose}>
            Back to Lessons
          </button>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
