import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { GOLD } from '../constants';
import useScrollReveal from '../hooks/useScrollReveal';

const Layout = () => {
  // Wires IntersectionObserver onto every .card + [data-reveal] element,
  // adding .is-visible when they scroll into view → triggers CSS entrance.
  useScrollReveal();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ── Animated background ───────────────────────────────────────────────
          Four layers (bottom → top):
            1. .bg-mesh    — 5-point CSS gradient mesh morphing via @property
            2. .bg-grid    — faint court-line grid scrolling diagonally
            3. .bg-noise   — SVG fractal film-grain for depth
            4. .bg-shimmer — aurora pulse line along the top edge
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="bg-layer" aria-hidden="true">
        {/* Individual blobs — each on its own GPU layer via will-change: transform.
            Only transform is animated so the browser never repaints. */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
        <div className="bg-blob bg-blob-4" />
        <div className="bg-blob bg-blob-5" />
        {/* Static overlays — no animation cost */}
        <div className="bg-grid"    />
        <div className="bg-noise"   />
        <div className="bg-shimmer" />
      </div>

      {/* z-index: 1 keeps navbar + content above the bg-layer (z-index: 0) */}
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <footer style={{
        backgroundColor: 'rgba(8,8,8,0.85)',   /* slightly transparent so orb glow bleeds through */
        borderTop: '1px solid #1a1a1a',
        padding: '3rem 1rem 2rem',
        marginTop: '4rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '24px', height: '1px', backgroundColor: GOLD, opacity: 0.5 }} />
            <span style={{ color: GOLD, fontSize: '1.125rem', fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em' }}>
              Tennis with Daniil
            </span>
            <div style={{ width: '24px', height: '1px', backgroundColor: GOLD, opacity: 0.5 }} />
          </div>
          <p style={{ color: '#444', fontSize: '0.8125rem', letterSpacing: '0.04em' }}>
            &copy; 2026 Tennis with Daniil. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
