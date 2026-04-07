import { useState, useEffect } from 'react';
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
import PaymentModal   from './components/PaymentModal';
import LegalModal     from './components/LegalModal';

export default function App() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [legalOpen,   setLegalOpen]   = useState(false);
  const [legalType,   setLegalType]   = useState('privacy'); // 'privacy' | 'terms'

  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  const paymentEmail = urlParams.get('email');
  
  const [initialSuccess] = useState(paymentStatus === 'success');
  const [initialEmail]   = useState(paymentEmail || '');

  useEffect(() => {
    if (paymentStatus === 'success' || paymentStatus === 'error') {
      setPaymentOpen(true);
      // Clean up the URL search params seamlessly
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [paymentStatus]);

  const openPayment  = () => setPaymentOpen(true);
  const closePayment = () => setPaymentOpen(false);

  const openPrivacy  = () => { setLegalType('privacy'); setLegalOpen(true); };
  const openTerms    = () => { setLegalType('terms');   setLegalOpen(true); };
  const closeLegal   = () => setLegalOpen(false);

  return (
    <>
      {/* WebGL particle background — fixed, behind everything */}
      <WebGLCanvas />

      {/* Custom cursor */}
      <Cursor />

      {/* Fixed nav */}
      <Navbar onBuyClick={openPayment} />

      {/* Page sections */}
      <main>
        <HeroSection  onBuyClick={openPayment} />
        <MarqueeStrip />
        <HowItWorks />
        <Showcase />
        <Pricing      onBuyClick={openPayment} />
        <FAQ />
      </main>

      <Footer
        onPrivacyClick={openPrivacy}
        onTermsClick={openTerms}
      />

      {/* Payment modal */}
      <PaymentModal 
        isOpen={paymentOpen} 
        onClose={closePayment} 
        initialSuccess={initialSuccess}
        initialEmail={initialEmail}
        hasError={paymentStatus === 'error'}
      />

      {/* Legal modals (Privacy + Terms share one component) */}
      <LegalModal isOpen={legalOpen} onClose={closeLegal} type={legalType} />
    </>
  );
}
