import React, { useEffect, useState } from 'react';
import { Sparkles, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHomeBtn?: boolean;
  onHomeClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showHomeBtn, onHomeClick }) => {
  const [bubbles, setBubbles] = useState<Array<{left: number, size: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 15 }).map(() => ({
      left: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 5
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="w-full max-w-[480px] h-full bg-[#0b6b45] flex flex-col relative shadow-2xl overflow-hidden">
      {/* Background Gradient & Bubbles */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b6b45] to-[#074d31] pointer-events-none z-0" />
      
      {bubbles.map((b, i) => (
        <div 
          key={i}
          className="bubble pointer-events-none"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`
          }}
        />
      ))}

      {/* Floating Home Button */}
      {showHomeBtn && (
        <button 
            onClick={onHomeClick}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-all shadow-lg active:scale-95"
        >
            <Home className="w-5 h-5" />
        </button>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto z-10 scrollbar-hide">
        <div className="p-5 pb-24 min-h-full pt-10">
            {children}
        </div>
      </main>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#c3e02e] rounded-full mix-blend-overlay filter blur-[100px] opacity-20 pointer-events-none z-0" />
    </div>
  );
};

export default Layout;