export default function Navbar({ onBuyClick }) {
  return (
    <nav className="navbar">
      <a href="#hero" className="nav-logo">
        aahh<span>Windows</span>
      </a>
      <button className="nav-cta" onClick={onBuyClick} id="nav-buy-btn">
        Get It — ₹99
      </button>
    </nav>
  );
}
