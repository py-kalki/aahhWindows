import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  '104 unique moan sounds — one per key, no repeats',
  'Works on Windows & Mac (yes, both)',
  'Lightweight — your dignity weighs more',
  'Download link sent to your email instantly',
  'Lifetime updates (we\'ll add weirder sounds)',
  "Silent mode toggle — for when you can't explain",
];

export default function Pricing({ onBuyClick }) {
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
      <p className="section-label">Pricing</p>
      <h2 className="section-title" ref={titleRef}>
        ONE PRICE.<br />
        <span className="accent">INFINITE MOANS.</span>
      </h2>

      <div className="price-card" ref={cardRef}>
        <span className="price-tag">🔥 BEST VALUE 🔥</span>

        <div className="price-amount">₹99</div>
        <p className="price-note">
          one-time. no subscription. <em>we're not monsters.</em>
        </p>

        <ul className="features">
          {FEATURES.map((f, i) => (
            <li key={i}>
              <span className="check">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <button
          className="buy-btn"
          id="pricing-buy-btn"
          onClick={onBuyClick}
        >
          BUY AAHHWINDOWS — ₹99
        </button>
      </div>
    </section>
  );
}
