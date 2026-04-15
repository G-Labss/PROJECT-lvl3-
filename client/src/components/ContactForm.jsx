import React, { useState } from 'react';
import useForm from '../hooks/useForm';
import { Send, CheckCircle } from 'lucide-react';
import { contactAPI } from '../services/api';
import { GOLD } from '../constants';

const ContactForm = () => {
    const [submitted, setSubmitted] = useState(false);

    const { values, errors, isSubmitting, handleChange, handleSubmit, reset } = useForm(
        { name: '', email: '', phone: '', message: '' },
        async (formData) => {
            await contactAPI.submit(formData);
            setSubmitted(true);
            reset();
            setTimeout(() => setSubmitted(false), 5000);
        }
    );

    return (
        <div>
            {submitted && (
                <div style={{
                    backgroundColor: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    borderRadius: '0.5rem',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <CheckCircle size={28} color={GOLD} />
                    <div>
                        <h3 style={{ color: GOLD, fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.9375rem' }}>
                            Message Sent!
                        </h3>
                        <p style={{ color: '#888', margin: 0, fontSize: '0.875rem' }}>
                            I'll get back to you within 24 hours.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input type="text" name="name" value={values.name} onChange={handleChange} className="form-input" placeholder="Your name" required disabled={isSubmitting} />
                        {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input type="email" name="email" value={values.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required disabled={isSubmitting} />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone (optional)</label>
                    <input type="tel" name="phone" value={values.phone} onChange={handleChange} className="form-input" placeholder="(123) 456-7890" disabled={isSubmitting} />
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>

                <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea name="message" value={values.message} onChange={handleChange} className="form-textarea" placeholder="Tell me about your tennis goals and experience level..." rows="5" required disabled={isSubmitting} />
                    {errors.message && <p className="form-error">{errors.message}</p>}
                </div>

                {errors.general && (
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {errors.general}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : <><Send size={18} />Send Message</>}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
