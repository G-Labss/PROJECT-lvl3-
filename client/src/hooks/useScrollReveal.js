import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 *
 * Automatically wires up an IntersectionObserver that watches every
 * .card element and every [data-reveal] element on the page.
 *
 * When an element enters the viewport it gets the `is-visible` class,
 * which triggers the CSS entrance transition defined in index.css.
 *
 * Cards in the same 3-column row are staggered by their visual position
 * (index % 3) so they cascade in left → right rather than all at once.
 *
 * Called once from Layout so it covers every page automatically.
 */
const useScrollReveal = () => {
  // Track the observer across renders so we can disconnect the old one
  // before creating a new one on route change.
  const observerRef = useRef(null);

  useEffect(() => {
    // Disconnect any previous observer (e.g. from a previous route)
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = document.querySelectorAll('.card, [data-reveal]');

    targets.forEach((el, index) => {
      el.classList.add('reveal');
      // Stagger left→right in groups of 3 (matches grid-3 layout)
      el.style.transitionDelay = `${(index % 3) * 80}ms`;
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();

  // Re-run when the pathname changes so new pages get wired up.
  // Using location.pathname keeps re-runs minimal (once per navigation).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);
};

export default useScrollReveal;
