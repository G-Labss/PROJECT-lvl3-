import ContactForm from '../components/ContactForm';
import Testimonials from '../components/Testimonials';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Target, Users, Award, Clock, MapPin } from 'lucide-react';
import { GOLD } from '../constants';

// ── Reusable section header ───────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <div style={{ textAlign: align, marginBottom: '3.5rem' }}>
    {eyebrow && (
      <p style={{
        color: GOLD,
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: '0.875rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        {eyebrow}
      </p>
    )}
    <h2 style={{ color: '#f2f2f2', marginBottom: subtitle ? '0.875rem' : 0 }}>
      {title}
    </h2>
    {subtitle && (
      <p style={{ color: '#666', fontSize: '1rem', maxWidth: '36rem', margin: align === 'center' ? '0 auto' : undefined, lineHeight: 1.7 }}>
        {subtitle}
      </p>
    )}
  </div>
);

const HomePage = () => {
  const { state, fetchLessons } = useAppContext();
  const { lessons, loading, error, currentUser } = state;

  if (error) return <ErrorMessage message={error} onRetry={fetchLessons} />;

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#0d0d0d',
        padding: '8rem 1.5rem 7rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
        }} />

        <div className="container" style={{ position: 'relative', maxWidth: '820px' }}>
          <p style={{
            color: GOLD,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif',
          }}>
            Professional Tennis Coaching
          </p>

          <h1 style={{ marginBottom: '1.5rem', color: '#f2f2f2', lineHeight: 1.1 }}>
            Tennis Lessons{' '}
            <br />
            <span style={{
              color: GOLD,
              backgroundImage: `linear-gradient(135deg, ${GOLD} 0%, #e8c96a 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              with {currentUser?.name?.split(' ')[0] || 'Daniil'}
            </span>
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: '#777',
            maxWidth: '34rem',
            margin: '0 auto 2.75rem',
            lineHeight: 1.75,
            fontFamily: 'Inter, sans-serif',
          }}>
            {currentUser?.bio || 'Professional tennis coaching for all skill levels — from first-timers to competitive players.'}
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/lessons" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.9375rem 2.5rem' }}>
              Book a Lesson
            </Link>
            <Link to="/rates" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.9375rem 2.5rem' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#0a0a0a' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
          }}>
            {[
              { icon: Target, value: `${currentUser?.yearsExperience || 10}+`, label: 'Years Experience' },
              { icon: Users, value: '100+', label: 'Packages Provided' },
              { icon: Award, value: '12.5', label: 'Max UTR' },
            ].map(({ value, label }, i) => (
              <div key={label} style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#111',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                  fontWeight: 700,
                  color: '#f2f2f2',
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: '0.625rem',
                }}>
                  {value}
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#555',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <MediaGallery />
      <VideoGallery />

      {/* ── Featured Lessons ─────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0a0a0a' }}>
        <div className="container">
          <SectionHeader
            eyebrow="What's Available"
            title="Featured Lesson Packages"
            subtitle="Choose the perfect package for your skill level and goals"
          />

          <div className="grid grid-3">
            {loading ? [0, 1, 2].map((i) => (
              <div key={i} className="card skeleton-card" style={{ height: '320px' }}>
                <div className="skeleton-line" style={{ width: '40%', height: '22px', marginBottom: '1.25rem', borderRadius: '9999px' }} />
                <div className="skeleton-line" style={{ width: '75%', height: '26px', marginBottom: '0.75rem' }} />
                <div className="skeleton-line" style={{ width: '90%', height: '16px', marginBottom: '0.4rem' }} />
                <div className="skeleton-line" style={{ width: '70%', height: '16px', marginBottom: '1.75rem' }} />
                <div style={{ marginTop: 'auto' }}>
                  <div className="skeleton-line" style={{ width: '100%', height: '44px', borderRadius: '0.5rem' }} />
                </div>
              </div>
            )) : lessons.slice(0, 3).map((lesson) => (
              <div key={lesson._id} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.2), 0 12px 40px rgba(0,0,0,0.55)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.transform = '';
                }}
              >
                <span style={{
                  backgroundColor: 'rgba(201,168,76,0.08)',
                  color: GOLD,
                  border: '1px solid rgba(201,168,76,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  display: 'inline-block',
                  marginBottom: '1.25rem',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {lesson.level}
                </span>

                <h3 style={{ marginBottom: '0.75rem', color: '#f2f2f2' }}>
                  {lesson.title}
                </h3>

                <p style={{ color: '#666', marginBottom: '1.75rem', flexGrow: 1, lineHeight: 1.75, fontSize: '0.9375rem' }}>
                  {lesson.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="#444" />
                    <span style={{ fontSize: '0.8125rem', color: '#555', fontFamily: 'Inter, sans-serif' }}>{lesson.duration} min</span>
                  </div>
                  <span style={{
                    fontSize: '1.875rem',
                    fontWeight: 700,
                    color: GOLD,
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}>
                    ${lesson.price}
                  </span>
                </div>

                <Link to="/lessons" className="btn btn-primary" style={{ width: '100%' }}>
                  Learn More
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/lessons" className="btn btn-secondary">
              View All Lessons
            </Link>
          </div>
        </div>
      </section>

      {/* ── Specialties ──────────────────────────────────────────────────── */}
      {currentUser?.specialties && currentUser.specialties.length > 0 && (
        <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0d0d0d' }}>
          <div className="container">
            <SectionHeader eyebrow="Expertise" title="My Specialties" />
            <div className="grid grid-3">
              {currentUser.specialties.map((specialty, index) => (
                <div key={index} className="card" style={{
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  transition: 'box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.5)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}>
                    <Award size={22} color={GOLD} style={{ opacity: 0.85 }} />
                  </div>
                  <h4 style={{ color: '#e8e8e8', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {specialty}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Service Area ─────────────────────────────────────────────────── */}
      {currentUser?.serviceArea && currentUser.serviceArea.length > 0 && (
        <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0a0a0a' }}>
          <div className="container">
            <SectionHeader
              eyebrow="Where I Coach"
              title="Service Area"
              subtitle="Courts and locations where lessons are available"
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
            }}>
              {currentUser.serviceArea.map((location, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#111',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '0.875rem',
                  padding: '1rem 1.25rem',
                }}>
                  <MapPin size={18} color={GOLD} style={{ flexShrink: 0, opacity: 0.85 }} />
                  <span style={{ color: '#d0d0d0', fontSize: '0.9375rem', fontFamily: 'Inter, sans-serif' }}>
                    {location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        padding: '7rem 1.5rem',
        background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%), #0a0a0a',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
        }} />

        <div className="container" style={{ position: 'relative', maxWidth: '680px' }}>
          <p style={{
            color: GOLD,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            fontFamily: 'Inter, sans-serif',
          }}>
            Start Today
          </p>
          <h2 style={{ color: '#f2f2f2', marginBottom: '1.25rem' }}>
            Ready to Elevate Your Game?
          </h2>
          <p style={{
            color: '#666',
            marginBottom: '2.75rem',
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            fontFamily: 'Inter, sans-serif',
          }}>
            Book your first lesson today and start your tennis journey with professional coaching.
          </p>
          <Link to="/lessons" className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.75rem' }}>
            Get Started
          </Link>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0d0d0d' }}>
        <div className="container">
          <SectionHeader
            eyebrow="Reviews"
            title="What My Students Say"
            subtitle="Real feedback from students who've improved their game"
          />
          <Testimonials />
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0a0a0a' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'start' }}>
            <div>
              <p style={{
                color: GOLD,
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif',
              }}>
                Get in Touch
              </p>
              <h2 style={{ color: '#f2f2f2', marginBottom: '1.25rem' }}>
                Let's Talk
              </h2>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Ready to take your tennis game to the next level? Send a message and let's discuss your goals.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { label: 'Email', value: currentUser?.email || 'khitroudaniil@gmail.com' },
                  { label: 'Phone', value: '(616) 500-6583' },
                  { label: 'Location', value: 'Chicago, Illinois' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{
                      fontWeight: 500,
                      color: '#444',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '0.3rem',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {label}
                    </p>
                    <p style={{ color: '#bbb', fontSize: '0.9375rem', margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '2.5rem' }}>
              <h3 style={{ color: '#f2f2f2', marginBottom: '1.75rem' }}>Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ── Media Gallery ─────────────────────────────────────────────────────────────
const imageModules = import.meta.glob('../assets/media/*.{jpg,jpeg,png,webp,gif}', { eager: true });
const MEDIA_PHOTOS = Object.entries(imageModules).map(([path, mod]) => ({
  src: mod.default,
  caption: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase()),
}));

const MediaGallery = () => {
  const [lightbox, setLightbox] = React.useState(null);
  if (MEDIA_PHOTOS.length === 0) return null;

  return (
    <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0d0d0d' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: GOLD, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
            On the Court
          </p>
          <h2 style={{ color: '#f2f2f2' }}>In Action</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {MEDIA_PHOTOS.map((photo, i) => (
            <div key={i} onClick={() => setLightbox(i)} style={{
              borderRadius: '0.875rem',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              aspectRatio: '4/3',
              backgroundColor: '#111',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
            }}>
              <img
                src={photo.src}
                alt={photo.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                padding: '2rem 1.25rem 1rem',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
              }}>
                {photo.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', backdropFilter: 'blur(8px)' }}
        >
          <img
            src={MEDIA_PHOTOS[lightbox].src}
            alt={MEDIA_PHOTOS[lightbox].caption}
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '0.875rem', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '2.5rem', height: '2.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
};

// ── Video Gallery ─────────────────────────────────────────────────────────────
const videoModules = import.meta.glob('../assets/media/videos/*.{mov,MOV,mp4,MP4,webm,WEBM}', { eager: true });
const MEDIA_VIDEOS = Object.entries(videoModules).map(([path, mod]) => ({
  src: mod.default,
  caption: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/^\w/, c => c.toUpperCase()),
}));

const VideoGallery = () => {
  const [active, setActive] = React.useState(null);
  if (MEDIA_VIDEOS.length === 0) return null;

  return (
    <section style={{ padding: '0 1.5rem 6rem', backgroundColor: '#0d0d0d' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ color: '#f2f2f2', marginBottom: '0.75rem' }}>Video Highlights</h2>
          <p style={{ color: '#555', fontSize: '0.9375rem' }}>Watch coaching sessions in action</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {MEDIA_VIDEOS.map((video, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              borderRadius: '0.875rem',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              aspectRatio: '16/9',
              backgroundColor: '#111',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
            }}>
              <video src={video.src} muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
              >
                <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', backgroundColor: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem', boxShadow: '0 4px 20px rgba(201,168,76,0.35)' }}>
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="#000"><polygon points="6,3 17,10 6,17" /></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{video.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {active !== null && (
        <div onClick={() => setActive(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem', backdropFilter: 'blur(12px)' }}>
          <video src={MEDIA_VIDEOS[active].src} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '0.875rem', outline: 'none', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setActive(null)} style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '2.5rem', height: '2.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}>✕</button>
        </div>
      )}
    </section>
  );
};

export default HomePage;
