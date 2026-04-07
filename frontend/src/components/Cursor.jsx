import { useEffect, useRef } from 'react';

export default function Cursor() {
  const mainRef  = useRef(null);
  const trailRef = useRef(null);
  const pos      = useRef({ x: -100, y: -100 });
  const trail    = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      // trail lerps toward main cursor
      trail.current.x += (pos.current.x - trail.current.x) * 0.14;
      trail.current.y += (pos.current.y - trail.current.y) * 0.14;

      if (mainRef.current) {
        mainRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform =
          `translate(${trail.current.x}px, ${trail.current.y}px) translate(-50%, -50%)`;
      }
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={mainRef}  className="cursor-main">🫦</div>
      <div ref={trailRef} className="cursor-trail" />
    </>
  );
}
