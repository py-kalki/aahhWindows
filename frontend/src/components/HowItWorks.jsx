import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: '01',
    emoji: '💾',
    name: 'Install',
    desc: 'Drag it. Drop it. Done. No PhD required. If you can open a file, you\'re <em>already overqualified</em>.',
  },
  {
    num: '02',
    emoji: '⌨️',
    name: 'Type',
    desc: 'Press any key. Any key at all. The spacebar. The escape key. The key you\'ve <em>never pressed in your life</em>.',
  },
  {
    num: '03',
    emoji: '😮',
    name: 'Moan',
    desc: 'Your laptop does the rest. You do the <em>explaining</em>.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const stepRefs   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title slide-up
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 85%',
        },
      });

      // Steps stagger in
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how" className="section-how" ref={sectionRef}>
      <p className="section-label">Step by step</p>
      <h2 className="section-title" ref={titleRef}>
        IT'S EMBARRASSINGLY<br />
        <span className="accent">SIMPLE</span>
      </h2>

      <div className="steps-grid">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="step"
            ref={(el) => (stepRefs.current[i] = el)}
          >
            <span className="step-num" aria-hidden="true">{step.num}</span>
            <span className="step-emoji" role="img" aria-label={step.name}>
              {step.emoji}
            </span>
            <div className="step-name">{step.name}</div>
            <p
              className="step-desc"
              dangerouslySetInnerHTML={{ __html: step.desc }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
