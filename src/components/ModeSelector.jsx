import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ModeSelector() {
  const navigate = useNavigate();
  // 'dev' | 'creator' | null
  const [hovered, setHovered] = useState(null);

  const handleEnter = (mode) => navigate(`/${mode}`);

  // Base transitions for smoothness
  const springTransition = { type: "spring", stiffness: 300, damping: 30 };
  const colorTransition = { duration: 0.5, ease: "easeInOut" };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans select-none px-6 py-12"
      animate={{
        // Default & Dev: Dark BG. Creator: White BG.
        backgroundColor: hovered === 'creator' ? '#ffffff' : '#0a0a0a'
      }}
      transition={colorTransition}
    >
      
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Dynamic Glow Blob */}
        <motion.div
           className="w-[120vw] h-[120vw] max-w-[1000px] max-h-[1000px] rounded-full blur-[140px]"
           animate={{
             background: hovered === 'creator'
                ? 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, rgba(255,255,255,0) 70%)'
                : hovered === 'dev'
                ? 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(10,10,10,0) 70%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(10,10,10,0) 70%)',
             x: hovered === 'creator' ? '20%' : hovered === 'dev' ? '-20%' : '0%',
           }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Subtle Grid overlay */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none" 
        animate={{
          opacity: hovered === 'creator' ? 0.04 : 0.06,
          backgroundImage: hovered === 'creator'
            ? 'radial-gradient(#000 1px, transparent 1px)'
            : 'radial-gradient(#fff 1px, transparent 1px)'
        }}
        transition={colorTransition}
        style={{ backgroundSize: '40px 40px' }} 
      />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        
        {/* Header Section */}
        <motion.div
           className="flex flex-col items-center text-center mb-16 md:mb-20"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Name */}
          <motion.p 
            className="font-mono text-xs tracking-[0.4em] uppercase mb-6"
            animate={{ color: hovered === 'creator' ? '#6b7280' : '#6b7280' }} // Gray in both modes
            transition={colorTransition}
          >
            Park Soyoon
          </motion.p>
          
          {/* Copy */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
            <motion.span
              animate={{
                color: hovered === 'creator' 
                  ? '#111827'  // Black when background is white
                  : hovered === 'dev' 
                  ? '#38bdf8'  // Sky Blue on DEV hover
                  : '#ffffff'  // Default White
              }}
              transition={colorTransition}
            >
              Where code
            </motion.span>
            <br className="md:hidden" />
            <motion.span
              className="ml-4 md:ml-6"
              animate={{
                color: hovered === 'creator' 
                  ? '#a855f7' // Purple on Creator hover
                  : '#ffffff' // White in dev/default
              }}
              transition={colorTransition}
            >
              meets craft.
            </motion.span>
          </h1>
          
        </motion.div>

        {/* ── Cards Section ── */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 w-full max-w-4xl px-4">
          
          {/* DEV Card */}
          <motion.div
             className="flex-1 relative cursor-pointer rounded-3xl"
             onMouseEnter={() => setHovered('dev')}
             onMouseLeave={() => setHovered(null)}
             onClick={() => handleEnter('developer')}
             initial={{ opacity: 0, y: 30 }}
             animate={{ 
               opacity: hovered === 'creator' ? 0.3 : 1, // Fade out softly when looking at Creator
               y: hovered === 'dev' ? -4 : 0,
               scale: hovered === 'dev' ? 1.01 : 1,
               backgroundColor: hovered === 'dev' ? '#0f172a' : '#111111', 
               borderColor: hovered === 'dev' ? '#38bdf8' : '#222222',
               boxShadow: hovered === 'dev' ? '0 20px 40px rgba(56,189,248, 0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
             }}
             transition={{ ...colorTransition, y: springTransition, scale: springTransition }}
             style={{ borderWidth: '1px' }}
          >
             {/* Card Content */}
             <div className="relative z-10 p-10 flex flex-col h-full min-h-[300px]">
                {/* Top Row: Number & Icon */}
                <div className="flex justify-between items-start mb-auto">
                    <motion.span 
                      className="font-mono text-xs tracking-[0.2em]"
                      animate={{ color: hovered === 'dev' ? '#7dd3fc' : '#737373' }}
                    >
                      01
                    </motion.span>
                    <motion.div
                       className="w-10 h-10 rounded-full flex items-center justify-center border"
                       animate={{
                         backgroundColor: hovered === 'dev' ? '#38bdf8' : 'transparent',
                         color: hovered === 'dev' ? '#ffffff' : '#737373',
                         borderColor: hovered === 'dev' ? '#38bdf8' : '#333333'
                       }}
                       transition={colorTransition}
                    >
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M5 12h14m-7-7 7 7-7 7"/>
                       </svg>
                    </motion.div>
                </div>
                
                {/* Bottom Row: Title & Desc */}
                <div className="mt-8">
                   <motion.h2 
                     className="text-4xl font-black mb-4 tracking-tight"
                     animate={{ color: hovered === 'dev' ? '#38bdf8' : '#ffffff' }}
                     transition={colorTransition}
                   >
                     DEVELOPER
                   </motion.h2>
                   <motion.p 
                     className="text-sm leading-relaxed font-mono word-keep"
                     animate={{ color: hovered === 'dev' ? '#e0f2fe' : '#9ca3af' }}
                     transition={colorTransition}
                   >
                     알고리즘으로 문제를 구조화하고<br/>시스템으로 해결을 완성합니다.
                   </motion.p>
                </div>
             </div>
          </motion.div>

          {/* CREATOR Card */}
          <motion.div
             className="flex-1 relative cursor-pointer rounded-3xl"
             onMouseEnter={() => setHovered('creator')}
             onMouseLeave={() => setHovered(null)}
             onClick={() => handleEnter('creator')}
             initial={{ opacity: 0, y: 30 }}
             animate={{ 
               opacity: hovered === 'dev' ? 0.3 : 1, // Fade out softly when looking at Dev
               y: hovered === 'creator' ? -4 : 0,
               scale: hovered === 'creator' ? 1.01 : 1,
               backgroundColor: hovered === 'creator' ? '#ffffff' : '#111111', 
               borderColor: hovered === 'creator' ? '#e9d5ff' : '#222222',
               boxShadow: hovered === 'creator' ? '0 20px 40px rgba(167,139,250, 0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
             }}
             transition={{ ...colorTransition, y: springTransition, scale: springTransition }}
             style={{ borderWidth: '1px' }}
          >
             {/* Card Content */}
             <div className="relative z-10 p-10 flex flex-col h-full min-h-[300px]">
                {/* Top Row: Number & Icon */}
                <div className="flex justify-between items-start mb-auto">
                    <motion.span 
                      className="font-mono text-xs tracking-[0.2em]"
                      animate={{ color: hovered === 'creator' ? '#c084fc' : '#737373' }}
                      transition={colorTransition}
                    >
                      02
                    </motion.span>
                    <motion.div
                       className="w-10 h-10 rounded-full flex items-center justify-center border"
                       animate={{
                         backgroundColor: hovered === 'creator' ? '#a855f7' : 'transparent',
                         color: hovered === 'creator' ? '#ffffff' : '#737373',
                         borderColor: hovered === 'creator' ? '#a855f7' : '#333333'
                       }}
                       transition={colorTransition}
                    >
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M5 12h14m-7-7 7 7-7 7"/>
                       </svg>
                    </motion.div>
                </div>
                
                {/* Bottom Row: Title & Desc */}
                <div className="mt-8">
                   <motion.h2 
                     className="text-4xl font-black mb-4 tracking-tight"
                     animate={{ color: hovered === 'creator' ? '#a855f7' : '#ffffff' }}
                     transition={colorTransition}
                   >
                     CREATOR
                   </motion.h2>
                   <motion.p 
                     className="text-sm leading-relaxed word-keep"
                     animate={{ color: hovered === 'creator' ? '#6b7280' : '#9ca3af' }}
                     transition={colorTransition}
                   >
                     3D 공간을 조각하고 AI로 세계를 그립니다.<br/>상상을 픽셀로 번역하는 크리에이터.
                   </motion.p>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
