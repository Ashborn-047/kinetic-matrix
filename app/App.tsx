import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from '@/app/components/CustomCursor';
import Navigation from '@/app/components/Navigation';
import HeroSection from '@/app/components/HeroSection';
import KineticStrips from '@/app/components/KineticStrips';
import MatrixContrast from '@/app/components/MatrixContrast';
import DecodingQuote from '@/app/components/DecodingQuote';
import CyberGrid from '@/app/components/CyberGrid';
import Footer from '@/app/components/Footer';
import ExperimentsView from '@/app/components/ExperimentsView';
import ExperimentsPreview from '@/app/components/experiments/ExperimentsPreview';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'experiments' | 'preview'>('home');
  const [activePreviewTab, setActivePreviewTab] = useState<'source' | 'code'>('source');
  const [isOrganicView, setIsOrganicView] = useState(false);

  useEffect(() => {
    // Nav animations
    gsap.to('.nav-item', { opacity: 1, duration: 1, stagger: 0.2 });
    gsap.from('.hero-subtitle', { opacity: 0, x: -20, duration: 1, delay: 0.5 });

    // Background Strips (Constant Motion)
    gsap.to('.strip-bg', { xPercent: -15, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [currentView]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    switchView('experiments');
  };

  const switchView = (view: 'home' | 'experiments' | 'preview', tab?: 'source' | 'code', organic: boolean = false) => {
    if (view === 'experiments' && !isAuthenticated) {
      alert("ACCESS DENIED: Please authenticate via System Encryption Layer.");
      document.getElementById('grid-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (tab) {
      setActivePreviewTab(tab);
    }

    setIsOrganicView(organic);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <>
      <div className="scanlines"></div>
      <CustomCursor />

      <Navigation
        currentView={currentView === 'preview' ? 'home' : currentView}
        onSwitchView={(view) => switchView(view)}
        isAuthenticated={isAuthenticated}
      />

      {currentView === 'home' ? (
        <div id="view-home" className="view-section smooth-wrapper relative">
          <HeroSection />
          <KineticStrips />
          <MatrixContrast onSwitchView={switchView} />
          <DecodingQuote />
          <CyberGrid onAuthenticate={handleAuthentication} />
          <Footer
            onSwitchView={switchView}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ) : currentView === 'experiments' ? (
        <ExperimentsView />
      ) : (
        <ExperimentsPreview
          activeTab={activePreviewTab}
          onTabChange={(tab) => {
            setActivePreviewTab(tab);
            setIsOrganicView(false);
          }}
          onExit={() => switchView('home')}
          standalone={isOrganicView}
        />
      )}
    </>
  );
}
