import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DL_URL = 'https://github.com/py-kalki/aahhWindows/releases/download/v0.1.0/aahhWindows-Setup-0.1.0.exe';

const FEATURES = [
  '104 unique moan sounds — one per key, no repeats',
  'Windows installer (.exe) — just run it',
  'Lightweight — your dignity weighs more',
  'No account needed, ever',
  'Open source on GitHub',
  "Silent mode toggle — for when you can't explain",
];

export default function Pricing() {
  const sectionRef = useRef(null);
  const cardRef    = useRef(null);
  const titleRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });
      gsap.from(cardRef.current, {
        y: 50, opacity: 0, scale: 0.97, duration: 0.85, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: cardRef.current, start: 'top 82%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" className="section-pricing" ref={sectionRef}>
      <p className="section-label">Download</p>
      <h2 className="section-title" ref={titleRef}>
        COMPLETELY<br />
        <span className="accent">FREE.</span>
      </h2>

      <div className="price-card" ref={cardRef}>
        <span className="price-tag">🔥 OPEN SOURCE 🔥</span>

        <div className="price-amount">FREE</div>
        <p className="price-note">
          open source. no payment. <em>just download.</em>
        </p>

        <ul className="features">
          {FEATURES.map((f, i) => (
            <li key={i}>
              <span className="check">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <a
          className="buy-btn"
          id="pricing-buy-btn"
          href={DL_URL}
          download
        >
          DOWNLOAD AAHHWINDOWS — FREE
        </a>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
          © {new Date().getFullYear()}{' '}
          <a href="https://github.com/py-kalki" target="_blank" rel="noopener" style={{ color: '#ff2d6b', textDecoration: 'none' }}>py-kalki</a>
          {' · '}
          <a href="https://vedanshh.dev" target="_blank" rel="noopener" style={{ color: '#f5ff4b', textDecoration: 'none' }}>vedanshh.dev</a>
        </p>
      </div>
    </section>
  );
}
