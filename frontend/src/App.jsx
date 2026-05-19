import WebGLCanvas    from './components/WebGLCanvas';
import Cursor         from './components/Cursor';
import Navbar         from './components/Navbar';
import HeroSection    from './components/HeroSection';
import MarqueeStrip   from './components/MarqueeStrip';
import HowItWorks     from './components/HowItWorks';
import Showcase       from './components/Showcase';
import Pricing        from './components/Pricing';
import FAQ            from './components/FAQ';
import Footer         from './components/Footer';

export default function App() {
  return (
    <>
      {/* WebGL particle background — fixed, behind everything */}
      <WebGLCanvas />

      {/* Custom cursor */}
      <Cursor />

      {/* Fixed nav */}
      <Navbar />

      {/* Page sections */}
      <main>
        <HeroSection />
        <MarqueeStrip />
        <HowItWorks />
        <Showcase />
        <Pricing />
        <FAQ />
      </main>

      <Footer />
      
      {/* Sticky Watermark Pill */}
      <a 
        href="https://www.vedanshh.dev" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="watermark-pill"
        title="Designed and Developed by Vedanshh.dev"
      >
        Designed and Developed by <span>Vedanshh.dev</span>
      </a>
    </>
  );
}
