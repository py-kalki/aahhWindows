import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const KEYS = [
  { letter: 'A', style: { top: '18%', left: '6%' } },
  { letter: 'S', style: { top: '70%', left: '9%' } },
  { letter: 'D', style: { top: '28%', left: '83%' } },
  { letter: 'F', style: { top: '63%', left: '80%' } },
  { letter: 'J', style: { top: '13%', left: '74%' } },
  { letter: 'K', style: { top: '78%', left: '22%' } },
];

const EQ_BARS = Array.from({ length: 20 }, (_, i) => ({
  h: Math.round(12 + Math.abs(Math.sin(i * 0.7)) * 36 + Math.random() * 10),
  d: (0.4 + Math.random() * 0.7).toFixed(2) + 's',
}));

const DL_URL = 'https://github.com/py-kalki/aahhWindows/releases/download/v0.1.0/aahhWindows-Setup-0.1.0.exe';

export default function HeroSection() {
  const sectionRef = useRef(null);
  const logoRef    = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef     = useRef(null);
  const keyRefs    = useRef([]);
  const subRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Logo image entrance — scale + bounce in ────────────────────
      gsap.fromTo(logoRef.current,
        { opacity: 0, scale: 0.78, y: 50, rotate: -3 },
        { opacity: 1, scale: 1, y: 0, rotate: 0, duration: 1.2, ease: 'back.out(1.9)', delay: 0.1 }
      );
      // Continuous gentle float
      gsap.to(logoRef.current, {
        y: -14,
        duration: 3.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.4,
      });

      // ── 2. Tagline + sub fade in ──────────────────────────────────────
      gsap.from([taglineRef.current, subRef.current], {
        opacity: 0,
        y: 22,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.8,
      });

      // ── 3. CTA pulse loop ─────────────────────────────────────────────
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 1.0 }
        );
        gsap.to(ctaRef.current, {
          scale: 1.04,
          duration: 0.9,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: 1.8,
        });
      }

      // ── 4. Floating keys ──────────────────────────────────────────────
      keyRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, scale: 0.5, rotate: i % 2 === 0 ? -15 : 15 });
        gsap.to(el, {
          opacity: 1, scale: 1, rotate: 0,
          duration: 0.7, ease: 'back.out(2)', delay: 0.4 + i * 0.12,
        });
        gsap.to(el, {
          y: `${-14 - i * 3}`, duration: 1.6 + i * 0.25,
          yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.4 + i * 0.12,
        });
        gsap.to(el, {
          rotate: i % 2 === 0 ? 8 : -8, duration: 2.2 + i * 0.2,
          yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.4 + i * 0.12,
        });
      });

      // ── 5. ScrollTrigger parallax on logo ─────────────────────────────
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="hero" ref={sectionRef}>

      {/* Floating keyboard keys */}
      {KEYS.map((k, i) => (
        <div
          key={k.letter}
          className="float-key"
          style={k.style}
          ref={(el) => (keyRefs.current[i] = el)}
          aria-hidden="true"
        >
          {k.letter}
        </div>
      ))}

      {/* ── PNG Logo — replaces text headline ── */}
      <img
        ref={logoRef}
        src="/ahhLOGO.png"
        alt="aahhWindows — Finally, make it moan."
        className="hero-logo"
      />

      {/* Tagline */}
      <p className="hero-tagline" ref={taglineRef}>
        <em>"Finally, make it moan."</em>
        <br />
        Every keystroke. Every moan. Every time.
      </p>

      {/* Sound wave equalizer */}
      <div className="equalizer" aria-hidden="true">
        {EQ_BARS.map((bar, i) => (
          <div
            key={i}
            className="eq-bar"
            style={{ '--h': `${bar.h}px`, '--d': bar.d }}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="hero-cta-wrap">
        <a
          className="hero-cta"
          id="hero-buy-btn"
          href={DL_URL}
          download
          ref={ctaRef}
        >
          GET IT FOR FREE →
        </a>
        <p className="hero-sub" ref={subRef}>
          open source. no payment. just vibes.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint-text">scroll</span>
        <span className="scroll-hint-line" />
      </div>
    </section>
  );
}
