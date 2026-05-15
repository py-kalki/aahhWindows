const DL_URL = 'https://github.com/py-kalki/aahhWindows/releases/download/v0.1.0/aahhWindows-Setup-0.1.0.exe';

export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="#hero" className="nav-logo">
        aahh<span>Windows</span>
      </a>
      <a className="nav-cta" id="nav-buy-btn" href={DL_URL} download>
        Get It Free
      </a>
    </nav>
  );
}
