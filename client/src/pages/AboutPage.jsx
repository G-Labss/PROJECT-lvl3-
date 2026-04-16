import React from 'react';
import { useAppContext } from '../context/useAppContext';
import { Award, Target, Calendar, TrendingUp, CheckCircle, Trophy } from 'lucide-react';
import { GOLD } from '../constants';

const AboutPage = () => {
    const { state } = useAppContext();
    const { currentUser } = state;

    const achievements = [
        { icon: Trophy, title: 'ITF lvl 1 certified', description: 'Professional Tennis Registry Certification' },
        { icon: Award, title: 'NTRP 6.5 Rated and 7.0 in the past', description: 'Elite competitive player background' },
        { icon: Target, title: '100+ Students Coached', description: 'Helping players of all levels since 2015' },
        { icon: TrendingUp, title: '95% Success Rate', description: 'Students reach their goals within 3–6 months' },
    ];

    const timeline = [
        { year: '2018', event: 'Started professional coaching career' },
        { year: '2019', event: 'Opened private coaching practice' },
        { year: '2021', event: 'Reached 100+ students milestone' },
        { year: '2023', event: 'Expanded to group coaching programs' },
        { year: '2025', event: 'Launched online coaching platform' },
    ];

    const philosophyPoints = [
        "Personalized training programs tailored to each student's goals",
        'Focus on both technical skills and mental game development',
        'Emphasis on proper form to prevent injuries',
        'Video analysis to track progress and identify areas for improvement',
        'Positive reinforcement and building confidence on court',
        'Strategic game planning for competitive players',
    ];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(180deg, #0d0d0d 0%, #111111 100%)',
                color: 'white',
                padding: '5rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #1a1a1a',
            }}>
                <div className="container">
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: '#1a1a1a',
                        border: `2px solid rgba(201,168,76,0.4)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: GOLD,
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        margin: '0 auto 2rem',
                    }}>
                        {currentUser?.name?.charAt(0) || 'D'}
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700, color: '#f0f0f0' }}>
                        About {currentUser?.name || 'Me'}
                    </h1>
                    <div style={{ width: '40px', height: '2px', backgroundColor: GOLD, margin: '0 auto 1.25rem', opacity: 0.7 }} />
                    <p style={{ fontSize: '1.0625rem', color: '#777', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.7 }}>
                        Passionate tennis coach dedicated to helping players unlock their full potential
                    </p>
                </div>
            </section>

            {/* Bio Section */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#0a0a0a' }}>
                <div className="container">
                    <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#f0f0f0' }}>
                                My Story
                            </h2>
                            <div style={{ color: '#777', lineHeight: 1.85, fontSize: '0.9375rem' }}>
                                <p style={{ marginBottom: '1.25rem' }}>
                                    {currentUser?.bio || 'Tennis has been my passion for over 18 years. What started as a childhood hobby evolved into a lifelong dedication to the sport.'}
                                </p>
                                <p style={{ marginBottom: '1.25rem' }}>
                                    After competing at the collegiate level, I discovered my true calling: teaching others to love the game as much as I do. There's nothing more rewarding than watching a student's face light up when they finally nail that serve they've been working on for weeks.
                                </p>
                                <p style={{ marginBottom: '1.25rem' }}>
                                    My coaching philosophy is simple: meet students where they are and guide them to where they want to be. Whether you're picking up a racket for the first time or looking to compete at a higher level, I'm here to help you achieve your tennis goals.
                                </p>
                                <p>
                                    With {currentUser?.yearsExperience || 10}+ years of coaching experience and an NTRP rating of {currentUser?.ntrpRating || 6.5}, I bring both expertise and enthusiasm to every lesson.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="card" style={{ border: `1px solid rgba(201,168,76,0.25)`, padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1.5rem', color: GOLD }}>
                                    Quick Facts
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <CheckCircle size={20} color={GOLD} style={{ flexShrink: 0 }} />
                                        <div>
                                            <strong style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>Experience:</strong>
                                            <span style={{ color: '#888', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                                                {currentUser?.yearsExperience || 10}+ years
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <CheckCircle size={20} color={GOLD} style={{ flexShrink: 0 }} />
                                        <div>
                                            <strong style={{ color: '#c0c0c0', fontSize: '0.9rem' }}>NTRP Rating:</strong>
                                            <span style={{ color: '#888', marginLeft: '0.5rem', fontSize: '0.9rem' }}>
                                                {currentUser?.ntrpRating || 5.5}
                                            </span>
                                        </div>
                                    </div>
                                    {currentUser?.specialties && currentUser.specialties.map((specialty, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <CheckCircle size={20} color={GOLD} style={{ flexShrink: 0 }} />
                                            <span style={{ color: '#888', fontSize: '0.9rem' }}>{specialty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements Grid */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f0f0f0' }}>
                            Achievements & Credentials
                        </h2>
                        <div style={{ width: '40px', height: '2px', backgroundColor: GOLD, margin: '0 auto', opacity: 0.7 }} />
                    </div>
                    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="card"
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', padding: '2rem', border: '1px solid #1e1e1e', transition: 'border-color 0.2s, transform 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ width: '52px', height: '52px', borderRadius: '0.625rem', backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <achievement.icon size={26} color={GOLD} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem', color: '#e0e0e0' }}>
                                        {achievement.title}
                                    </h3>
                                    <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.875rem' }}>
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coaching Philosophy */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <Target size={40} color={GOLD} style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f0f0f0' }}>
                                My Coaching Philosophy
                            </h2>
                            <div style={{ width: '40px', height: '2px', backgroundColor: GOLD, margin: '0 auto 1rem', opacity: 0.7 }} />
                            <p style={{ color: '#666', fontSize: '1rem' }}>What guides my approach to tennis instruction</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {philosophyPoints.map((point, index) => (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem',
                                    backgroundColor: '#111111', borderRadius: '0.5rem', border: '1px solid #1e1e1e', borderLeft: `3px solid ${GOLD}`,
                                }}>
                                    <CheckCircle size={20} color={GOLD} style={{ flexShrink: 0, marginTop: '0.1rem', opacity: 0.8 }} />
                                    <p style={{ color: '#888', lineHeight: 1.65, margin: 0, fontSize: '0.9375rem' }}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f0f0f0' }}>
                            My Journey
                        </h2>
                        <div style={{ width: '40px', height: '2px', backgroundColor: GOLD, margin: '0 auto', opacity: 0.7 }} />
                    </div>
                    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {timeline.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '2rem', marginBottom: index < timeline.length - 1 ? '1.5rem' : 0, position: 'relative' }}>
                                {index < timeline.length - 1 && (
                                    <div style={{ position: 'absolute', left: '2.4375rem', top: '3rem', bottom: '-1.5rem', width: '1px', backgroundColor: '#222' }} />
                                )}
                                <div style={{
                                    width: '78px', height: '78px', borderRadius: '50%',
                                    backgroundColor: '#111', border: `2px solid rgba(201,168,76,0.4)`,
                                    color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '1rem', flexShrink: 0, position: 'relative', zIndex: 1,
                                }}>
                                    {item.year}
                                </div>
                                <div className="card" style={{ flex: 1, padding: '1.25rem 1.5rem', marginTop: '0.875rem', border: '1px solid #1e1e1e' }}>
                                    <p style={{ color: '#c0c0c0', fontWeight: 500, fontSize: '0.9375rem', margin: 0 }}>{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '5rem 1rem', backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem', color: '#f0f0f0' }}>
                        Ready to Start Your Tennis Journey?
                    </h2>
                    <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.0625rem' }}>
                        Let's work together to achieve your tennis goals.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="/lessons" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem', textDecoration: 'none' }}>
                            View Lesson Packages
                        </a>
                        <a href="/" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem', textDecoration: 'none' }}>
                            Get In Touch
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
