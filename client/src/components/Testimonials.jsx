import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonialAPI } from '../services/api';
import { GOLD } from '../constants';

const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={16} color={GOLD} fill={star <= rating ? GOLD : 'none'} />
        ))}
    </div>
);

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        testimonialAPI.getAll()
            .then(setTestimonials)
            .catch(() => {});
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {testimonials.map((testimonial) => (
                <div
                    key={testimonial._id}
                    className="card"
                    style={{
                        position: 'relative',
                        padding: '2rem 1.5rem',
                        border: '1px solid #1e1e1e',
                        transition: 'border-color 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#1e1e1e';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Quote
                        size={36}
                        color={GOLD}
                        style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', opacity: 0.15 }}
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <StarRating rating={testimonial.rating} />
                    </div>

                    <p style={{ color: '#888', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9375rem', fontStyle: 'italic' }}>
                        "{testimonial.text}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', borderTop: '1px solid #1a1a1a', paddingTop: '1.25rem' }}>
                        <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(201,168,76,0.1)',
                            border: '2px solid rgba(201,168,76,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: GOLD,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            flexShrink: 0,
                        }}>
                            {testimonial.initials}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '0.9375rem' }}>{testimonial.name}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#555' }}>{testimonial.role}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Testimonials;
