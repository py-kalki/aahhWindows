const items = [
  'PRESS ANY KEY',  'YOUR LAPTOP MOANS',  'IT\'S GENIUS',
  '104 UNIQUE SOUNDS', 'ONE-TIME $4.99', 'ZERO SHAME',
  'WINDOWS & MAC',  'INSTANT DOWNLOAD',   'JUDGEMENT-FREE',
  'PRESS ANY KEY',  'YOUR LAPTOP MOANS',  'IT\'S GENIUS',
  '104 UNIQUE SOUNDS', 'ONE-TIME $4.99', 'ZERO SHAME',
  'WINDOWS & MAC',  'INSTANT DOWNLOAD',   'JUDGEMENT-FREE',
];

export default function MarqueeStrip() {
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-inner">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
