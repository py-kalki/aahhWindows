import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const wrapperRef = useRef(null);
  const img1Ref    = useRef(null);
  const img2Ref    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fade in
      gsap.from(titleRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
      });

      // Screenshots entry animation
      gsap.from([img1Ref.current, img2Ref.current], {
        y: 100,
        opacity: 0,
        rotateX: 10,
        scale: 0.9,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 80%',
        },
      });

      // Subtle parallax float for the screenshots on scroll
      gsap.to(img1Ref.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(img2Ref.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="showcase" className="section-showcase" ref={sectionRef}>
      <p className="section-label">A peek inside</p>
      <h2 className="section-title" ref={titleRef}>
        BEAUTIFULLY <span className="accent">CURSED</span>
      </h2>

      <div className="showcase-wrap" ref={wrapperRef}>
        <div className="showcase-img-container left" ref={img1Ref}>
          <img src="/dashboard.jpeg" alt="aahhWindows Dashboard" className="showcase-img" />
          <div className="showcase-caption">The Dashboard — simple, dark, unapologetic.</div>
        </div>

        <div className="showcase-img-container right" ref={img2Ref}>
          <img src="/custom_sound.jpeg" alt="aahhWindows Custom Sounds" className="showcase-img" />
          <div className="showcase-caption">Custom Sounds — yes, you can add your own.</div>
        </div>
      </div>
    </section>
  );
}
