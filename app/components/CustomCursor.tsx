import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Hide cursor on touch devices
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    
    if (isTouchDevice) return;

    const cursorDot = document.querySelector('.cursor-dot') as HTMLElement;
    const cursorOutline = document.querySelector('.cursor-outline') as HTMLElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorDot) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
      }
      if (cursorOutline) {
        gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.15 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Hover effects
    const hoverElements = document.querySelectorAll('a, .hover-container, .grid div');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, { 
          scale: 2, 
          borderColor: '#00ff41', 
          backgroundColor: "rgba(0, 255, 65, 0.1)" 
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, { 
          scale: 1, 
          borderColor: 'rgba(0, 255, 65, 0.5)', 
          backgroundColor: "transparent" 
        });
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div className="cursor-dot hidden lg:block"></div>
      <div className="cursor-outline hidden lg:block"></div>
    </>
  );
}