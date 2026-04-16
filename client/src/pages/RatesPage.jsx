import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/useAppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Check, Star, Calculator, Tag } from 'lucide-react';
import { discountAPI } from '../services/api';
import { GOLD } from '../constants';

const RatesPage = () => {
  const { state } = useAppContext();
  const { lessons, loading, error } = state;
  const [calculatorQuantity, setCalculatorQuantity] = useState(1);
  const [selectedLessonForCalc, setSelectedLessonForCalc] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError('');
    try {
      const response = await discountAPI.validate(discountCode);
      setAppliedDiscount(response.discount);
    } catch {
      setAppliedDiscount(0);
      setDiscountError('Invalid discount code');
    }
  };

  const displayLessons = lessons || [];

  const calculatedTotal = useMemo(() => {
    if (!selectedLessonForCalc) return 0;
    const subtotal = selectedLessonForCalc.price * calculatorQuantity;
    const discount = subtotal * (appliedDiscount / 100);
    return subtotal - discount;
  }, [selectedLessonForCalc, calculatorQuantity, appliedDiscount]);

  if (loading) return <LoadingSpinner message="Loading pricing..." />;
  if (error) console.error('RatesPage Error:', error);

  const lessonsByLevel = {
    'Beginner': displayLessons.filter(l => l.level === 'Beginner'),
    'Intermediate': displayLessons.filter(l => l.level === 'Intermediate'),
    'Advanced': displayLessons.filter(l => l.level === 'Advanced'),
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f0f0f0', fontFamily: "'Playfair Display', serif" }}>
          Rates & Packages
        </h1>
        <p style={{ color: '#666', fontSize: '1.0625rem' }}>
          Competitive pricing for quality tennis instruction
        </p>
      </div>

      {/* Price Calculator */}
      <div className="card" style={{
        marginBottom: '3rem',
        boxShadow: '0 0 0 1px rgba(201,168,76,0.2), 0 4px 24px rgba(0,0,0,0.4)',
        padding: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <Calculator size={28} color={GOLD} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0', margin: 0, fontFamily: "'Playfair Display', serif" }}>
            Price Calculator
          </h2>
        </div>

        <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Select Lesson Type</label>
            <select
              className="form-select"
              value={selectedLessonForCalc?._id || ''}
              onChange={(e) => {
                const lesson = displayLessons.find(l => l._id === e.target.value);
                setSelectedLessonForCalc(lesson || null);
              }}
            >
              <option value="">Choose a lesson...</option>
              {displayLessons.map((lesson) => (
                <option key={lesson._id} value={lesson._id}>
                  {lesson.title} — ${lesson.price} ({lesson.level})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Number of Lessons</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="50"
              value={calculatorQuantity}
              onChange={(e) => setCalculatorQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Discount Code <span style={{ color: '#555', fontWeight: 400 }}>(Optional)</span></label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => { setDiscountCode(e.target.value); setAppliedDiscount(0); setDiscountError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && applyDiscount()}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary" onClick={applyDiscount} style={{ whiteSpace: 'nowrap' }}>
              Apply
            </button>
            {appliedDiscount > 0 && (
              <div style={{
                backgroundColor: 'rgba(201,168,76,0.15)',
                color: GOLD,
                border: `1px solid rgba(201,168,76,0.3)`,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
              }}>
                <Tag size={16} />
                {appliedDiscount}% OFF
              </div>
            )}
          </div>
          {discountError && (
            <p style={{ fontSize: '0.875rem', color: '#f87171', marginTop: '0.5rem', marginBottom: 0 }}>
              {discountError}
            </p>
          )}
        </div>

        {selectedLessonForCalc ? (
          <div style={{
            backgroundColor: '#0d0d0d',
            padding: '1.5rem',
            borderRadius: '0.875rem',
            boxShadow: '0 0 0 1px rgba(201,168,76,0.15)',
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#888' }}>{selectedLessonForCalc.title} × {calculatorQuantity}</span>
                <span style={{ fontWeight: 600, color: '#e0e0e0' }}>${(selectedLessonForCalc.price * calculatorQuantity).toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: GOLD }}>
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-${((selectedLessonForCalc.price * calculatorQuantity * appliedDiscount) / 100).toFixed(2)}</span>
                </div>
              )}
            </div>
            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</span>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: GOLD, fontFamily: "'Playfair Display', serif" }}>
                ${calculatedTotal.toFixed(2)}
              </span>
            </div>
            {calculatorQuantity >= 5 && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(201,168,76,0.07)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(201,168,76,0.2)',
                color: GOLD,
                fontSize: '0.875rem',
              }}>
                Tip: Ask about package deals for 10+ lessons and save more.
              </div>
            )}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#0d0d0d',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px dashed rgba(255,255,255,0.08)',
            textAlign: 'center',
            color: '#555',
          }}>
            Select a lesson type above to calculate your total
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-3">
        {Object.entries(lessonsByLevel).map(([level, levelLessons]) => {
          if (levelLessons.length === 0) return null;

          const avgPrice = Math.round(levelLessons.reduce((sum, l) => sum + l.price, 0) / levelLessons.length);

          return (
            <div
              key={level}
              className="card"
              style={{
                borderTop: `3px solid ${GOLD}`,
                position: 'relative',
                overflow: 'visible',
                padding: '1.75rem',
              }}
            >
              {level === 'Intermediate' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  backgroundColor: GOLD,
                  color: '#000',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  <Star size={11} fill="#000" />
                  Popular
                </div>
              )}

              <span style={{
                backgroundColor: 'rgba(201,168,76,0.1)',
                color: GOLD,
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem',
              }}>
                {level}
              </span>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 700, color: '#f0f0f0', fontFamily: "'Playfair Display', serif" }}>
                  ${avgPrice}
                </span>
                <span style={{ color: '#555', fontSize: '0.9rem' }}> / session avg</span>
              </div>

              <div style={{ marginBottom: '0.5rem', color: '#555', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {levelLessons.length} package{levelLessons.length > 1 ? 's' : ''} available
              </div>

              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '1.25rem 0' }} />

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                {levelLessons.map((lesson) => (
                  <li key={lesson._id} style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <Check size={18} color={GOLD} style={{ flexShrink: 0, marginTop: '0.125rem', opacity: 0.8 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: '#e0e0e0', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                        {lesson.title}
                      </strong>
                      <div style={{
                        fontSize: '0.8125rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span style={{ color: '#555' }}>{lesson.duration} min</span>
                        <span style={{ fontWeight: 700, color: GOLD }}>${lesson.price}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => {
                  if (levelLessons.length > 0) {
                    setSelectedLessonForCalc(levelLessons[0]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                Calculate Price
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment — Zelle */}
      <div className="card" style={{
        marginTop: '3rem',
        padding: '2rem 2.5rem',
        boxShadow: '0 0 0 1px rgba(201,168,76,0.18), 0 4px 24px rgba(0,0,0,0.4)',
        display: 'flex',
        gap: '2.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <img
          src="/media/zelle-qr.png"
          alt="Zelle QR code"
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '0.875rem',
            border: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
            objectFit: 'cover',
          }}
        />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{
            color: GOLD,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif',
          }}>
            Payment
          </p>
          <h3 style={{ color: '#f0f0f0', marginBottom: '0.625rem', fontFamily: "'Playfair Display', serif" }}>
            Pay via Zelle
          </h3>
          <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Scan the QR code or send payment directly to:
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.22)',
            borderRadius: '0.625rem',
            padding: '0.625rem 1.125rem',
          }}>
            <span style={{ color: GOLD, fontSize: '1.0625rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', letterSpacing: '0.01em' }}>
              (616) 500-6583
            </span>
          </div>
          <p style={{ color: '#444', fontSize: '0.8125rem', marginTop: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
            Payment due after each session unless a package is prepaid.
          </p>
        </div>
      </div>

      {/* All Packages Include */}
      <div className="card" style={{ marginTop: '3rem', boxShadow: '0 0 0 1px rgba(201,168,76,0.15), 0 4px 24px rgba(0,0,0,0.4)', padding: '2rem' }}>
        <h3 style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          marginBottom: '1.75rem',
          color: '#f0f0f0',
          fontFamily: "'Playfair Display', serif",
          textAlign: 'center',
        }}>
          All Packages Include
        </h3>
        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
          {[
            { title: 'Personalized Instruction', desc: 'Tailored coaching based on your skill level' },
            { title: 'Flexible Scheduling', desc: 'Book lessons at times that work for you' },
            { title: 'Video Analysis', desc: 'Review your technique with slow-motion replays' },
            { title: 'Progress Tracking', desc: 'Monitor your improvement over time' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Check size={16} color={GOLD} />
              </div>
              <div>
                <strong style={{ color: '#e0e0e0', display: 'block', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{title}</strong>
                <span style={{ color: '#666', fontSize: '0.875rem' }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatesPage;
