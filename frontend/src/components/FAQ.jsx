import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: 'What exactly does aahhWindows do?',
    a: 'Every time you press a key on your keyboard, your laptop plays a unique moan sound. Different key = different moan. There are 104 sounds — one for every key. Yes, including the function keys.',
  },
  {
    q: 'Is this a joke?',
    a: "It's a joke that actually works. You install it, you press keys, your laptop moans. The technology is very real. The judgment you'll receive is also very real.",
  },
  {
    q: 'Does it work on Windows and Mac?',
    a: 'Yes. Both Windows 10/11 and macOS 12+ are supported. We believe in equal opportunity embarrassment.',
  },
  {
    q: 'Will it slow down my computer?',
    a: "aahhWindows is extremely lightweight (under 15MB). It runs silently in the background and uses less RAM than a browser tab. Your dignity, however, may take a hit.",
  },
  {
    q: 'Can I turn it off without uninstalling?',
    a: 'Yes — the app sits in your system tray. One click toggles it on or off. Perfect for when your boss walks over or you suddenly remember you\'re in a library.',
  },
  {
    q: 'Is this safe / does it contain malware?',
    a: "100% safe. It's a simple audio playback app hooked to your keyboard listener. No data collection, no telemetry, no ads. We're weird, not evil.",
  },
  {
    q: 'I paid — where\'s my download?',
    a: "Check your email (including spam). Your download link is sent automatically after payment is confirmed. If it's been more than 5 minutes, contact us at support@aahhwindows.com.",
  },
  {
    q: 'Can I get a refund?',
    a: "It's $4.99. If it genuinely doesn't work on your machine, contact us and we'll sort it out. We're not going to fight you over five dollars.",
  },
];

export default function FAQ() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <section id="faq" className="section-faq" ref={sectionRef}>
      <p className="section-label">Got questions?</p>
      <h2 className="section-title" ref={titleRef}>
        OBVIOUSLY YOU<br />
        <span className="accent">HAVE QUESTIONS</span>
      </h2>

      <div className="faq-list">
        {FAQS.map((item, i) => (
          <div
            key={i}
            className={`faq-item ${openIdx === i ? 'open' : ''}`}
            onClick={() => toggle(i)}
            id={`faq-item-${i}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggle(i)}
            aria-expanded={openIdx === i}
          >
            <div className="faq-question">
              <span>{item.q}</span>
              <span className="faq-icon">{openIdx === i ? '−' : '+'}</span>
            </div>
            <div className="faq-answer">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
