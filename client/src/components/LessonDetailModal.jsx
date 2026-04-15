import React, { useState } from 'react';
import Modal from './Modal';
import BookingModal from './BookingModal';
import { Clock, Users, DollarSign, Award, Calendar, Target } from 'lucide-react';
import { formatDuration } from '../utils/formatters';
import { GOLD } from '../constants';

const LessonDetailModal = ({ lesson, isOpen, onClose }) => {
    const [bookingOpen, setBookingOpen] = useState(false);

    if (!lesson) return null;

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} title={lesson.title}>
            <div>
                {/* Level Badge */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{
                        backgroundColor: 'rgba(201,168,76,0.1)',
                        color: GOLD,
                        border: '1px solid rgba(201,168,76,0.25)',
                        padding: '0.375rem 1rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    }}>
                        {lesson.level}
                    </span>
                </div>

                <p style={{ color: '#777', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.9375rem' }}>
                    {lesson.description}
                </p>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[
                        { icon: Clock, label: 'Duration', value: formatDuration(lesson.duration) },
                        { icon: DollarSign, label: 'Price', value: `$${lesson.price}${lesson.priceLabel || '/session'}` },
                        { icon: Users, label: 'Class Size', value: lesson.minStudents > 1 ? `Min ${lesson.minStudents} students` : `Max ${lesson.maxStudents} students` },
                        { icon: Award, label: 'Skill Level', value: lesson.level },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid #1e1e1e' }}>
                            <Icon size={20} color={GOLD} style={{ opacity: 0.8 }} />
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                                <div style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '0.9375rem' }}>{value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* What You'll Learn */}
                <div style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: GOLD, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={18} />
                        What You'll Learn
                    </h3>
                    <ul style={{ color: '#888', lineHeight: 1.9, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        <li>Proper technique and form</li>
                        <li>Strategic game play</li>
                        <li>Physical conditioning for tennis</li>
                        <li>Mental preparation and focus</li>
                    </ul>
                </div>

                {/* Coach Info */}
                {lesson.coach && (
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #1e1e1e' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#666', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Your Coach
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, fontSize: '1.375rem', fontWeight: 700 }}>
                                {lesson.coach.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '1rem' }}>{lesson.coach.name}</div>
                                <div style={{ color: '#666', fontSize: '0.8125rem' }}>NTRP Rating: {lesson.coach.ntrpRating}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #1e1e1e' }}>
                    <button type="button" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setBookingOpen(true)}>
                        <Calendar size={18} />
                        Book This Lesson
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: '0 0 auto' }}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>

        <BookingModal lesson={lesson} isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
        </>
    );
};

export default LessonDetailModal;
