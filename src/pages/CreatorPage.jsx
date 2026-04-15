import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────────────────────
const archiveItems = [
  {
    id: 'arch-1',
    title: 'Still Life in Shadows',
    tool: 'Blender 3D',
    desc: 'Exploring physical properties and lighting variations in still geometry.',
    image: '/post1.jpg',
  },
  {
    id: 'arch-2',
    title: 'Neon Drift',
    tool: 'Photoshop',
    desc: 'Retrowave inspired coloring and structural modifications.',
    image: '/post2.jpg',
  },
  {
    id: 'arch-3',
    title: 'Organic Forms',
    tool: 'Blender 3D',
    desc: 'Procedural generation of organic patterns using Geometry Nodes.',
    image: '/post3.jpg',
  },
  {
    id: 'arch-4',
    title: 'Abstract Concept Art',
    tool: 'Lightroom',
    desc: 'Color grading focusing on deep contrasts and subtle hues.',
    image: '/post4.jpg',
  },
  {
    id: 'arch-5',
    title: 'Industrial Complex',
    tool: 'Blender 3D',
    desc: 'Hard surface modeling exercise of an imaginary factory.',
    image: '/post5.jpg',
  },
  {
    id: 'arch-6',
    title: 'Texture Study',
    tool: 'Photoshop',
    desc: 'Material recreation and lighting interaction studies.',
    image: '/post6.jpg',
  },
];

// Sorted chronologically (oldest first)
const builtProjects = [
  {
    id: 'p-5',
    date: '2024. 01',
    title: '태릉씨티치과 간판 캐릭터 디자인',
    oneliner: '오프라인 간판에 배치할 3D 입체 캐릭터 모델링 지원',
    tags: ['3D Modeling', 'Character Design'],
    problem: '',
    approach: '',
    role: '3D 캐릭터 기획 및 모델링 렌더링',
    result: '실제 치과 외부 간판으로 채택',
    learned: '',
    image: null,
  },
  {
    id: 'p-6',
    date: '2024. 02',
    title: '팽이초콜릿 캐릭터 디자인',
    oneliner: '팽이초콜릿 패키징 캐릭터 3D 디자인',
    tags: ['3D Modeling', 'Character Design'],
    problem: '',
    approach: '',
    role: '초콜릿 캐릭터 스케치 및 3D 구현',
    result: '',
    learned: '',
    image: null,
  },
  {
    id: 'p-7',
    date: '2025. 04',
    title: '리수갤러리 <2025 봄, 예술로 꽃피우다 展>',
    oneliner: '리수갤러리 오프라인 단체전 3D/시각 작품 출품',
    tags: ['Exhibition', 'Visual Art'],
    problem: '',
    approach: '',
    role: '전시용 아트워크 기획 및 제작',
    result: '단기 오프라인 전시',
    learned: '',
    image: null,
  },
  {
    id: 'p-3',
    date: '2025. 06',
    title: '크레페 활동',
    oneliner: '손전등 배경화면 디자인 등 진행 (누적 약 120만원 매출)',
    tags: ['Design', 'Commission'],
    problem: '',
    approach: '',
    role: '개별 맞춤 배경화면 및 그래픽 에셋 디자인',
    result: '약 120만원 규모의 디자인 매출 발생',
    learned: '',
    image: null,
  },
  {
    id: 'p-1',
    date: '2026. 01',
    title: '보이지 않는 영웅들',
    oneliner: '제3회 땀흘려 일하는 사람들 영화제 대상작',
    tags: ['AI Film', 'Directing'],
    problem: '',
    approach: '',
    role: '전체 기획 및 시스템 제작',
    result: '제3회 영화제 대상 수상',
    learned: '',
    image: null,
  },
  {
    id: 'p-2',
    date: '2026. 03',
    title: '성균관대학교 중앙동아리 능라촌 정기공연 <수재>',
    oneliner: '능라촌 제109회 정기공연 기획 참여',
    tags: ['Playwriting', 'Directing'],
    problem: '',
    approach: '',
    role: '기획 / 극작 등 참여',
    result: '성균관대학교 교내 공연 진행',
    learned: '',
    image: null,
  },
];

const skills = [
  {
    icon: '🧊',
    name: 'Blender 3D',
    desc: '정물·건축 렌더링, Geometry Nodes 기반 프로시저럴 모델링, 애니메이션',
  },
  {
    icon: '🎮',
    name: 'Unity',
    desc: 'URP 실시간 렌더링, Shader Graph, VFX Graph 기반 인터랙티브 설치',
  },
  {
    icon: '📸',
    name: 'Adobe Photoshop & Lightroom',
    desc: '디지털 아트워크 후처리, 텍스처 맵핑 리터칭, 사진 색보정 및 그래픽 합성',
  },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
  },
});

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section
      id={id}
      ref={ref}
      className="creator-section border-t border-purple-50"
    >
      <div className="creator-container">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Side Panel (For Built Projects) ──────────────────────────────────────────
function CreatorSidePanel({ project, onClose }) {
  // 필드가 비어있지 않은 것만 필터링해서 보여줍니다.
  const rawRows = [
    { label: '// problem', content: project.problem },
    { label: '// approach', content: project.approach },
    { label: '// role', content: project.role },
    { label: '// result', content: project.result },
    { label: '// learned', content: project.learned },
  ];
  const rows = rawRows.filter(r => r.content && r.content.trim() !== '');

  return (
    <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white border-l border-purple-100 overflow-y-auto shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        {/* Photo placeholder */}
        <div className="w-full aspect-video bg-gray-100 border-b border-purple-100 flex items-center justify-center relative">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="font-mono text-xs tracking-widest uppercase">Image Placeholder</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug word-keep">{project.title}</h2>
              <p className="text-gray-500 text-sm mt-2 word-keep">{project.oneliner}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 w-9 h-9 rounded-full bg-purple-50 hover:bg-purple-100
                         flex items-center justify-center text-purple-400 hover:text-purple-600 transition-colors"
            >✕</button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-purple-50 text-purple-600 border border-purple-100">{t}</span>
            ))}
          </div>

          <div className="space-y-4">
            {rows.map(({ label, content }) => (
              <div key={label} className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100">
                <p className="font-mono text-[11px] text-purple-400 mb-3 tracking-[0.15em]">{label}</p>
                <p className="text-gray-700 text-sm leading-7 word-keep">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Archive Grid Card (External Link) ────────────────────────────────────────
function ArchiveCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.a
      href="https://instagram.com/biu_bam"
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="relative aspect-square rounded-2xl overflow-hidden group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image with fallback */}
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-gray-100"
        onError={(e) => {
           // Fallback if image not found
           e.target.style.display = 'none';
           e.target.nextSibling.style.display = 'block';
        }}
      />
      <div 
        className="hidden absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg,
            hsl(${260 + index * 18}, 40%, ${88 - index * 4}%) 0%,
            hsl(${280 + index * 15}, 30%, ${95 - index * 3}%) 100%)`,
        }}
      />

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(109,77,210,0.15)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
    </motion.a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CreatorPage() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null);

  // Load model-viewer script lazily
  if (typeof document !== 'undefined' && !document.querySelector('script[data-mv]')) {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    s.type = 'module';
    s.setAttribute('data-mv', '1');
    document.head.appendChild(s);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* ── Minimal top bar with gradient background ── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between bg-gradient-to-b from-white via-white/80 to-transparent pb-10">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-purple-500 transition-colors duration-200 font-medium z-10"
        >
          ← Home
        </motion.button>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs tracking-widest uppercase text-purple-300 font-semibold z-10"
        >
          Creator
        </motion.span>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
        {/* Background "Where code" watermark */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-black text-[clamp(6rem,18vw,18rem)] leading-none select-none pointer-events-none whitespace-nowrap"
          style={{ color: 'rgba(0,0,0,0.02)', zIndex: 0 }}
          aria-hidden="true"
        >
          WHERE CODE
        </div>

        <div className="creator-container relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:gap-16">
            
            {/* Left: Text */}
            <div className="flex-1">
              <motion.span
                className="creator-label"
                variants={fadeUp(0.1)} initial="hidden" animate="visible"
              >
                Park Soyoon · Creator
              </motion.span>

              <motion.h1
                className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
                style={{ color: '#1a1a2e' }}
                variants={fadeUp(0.2)} initial="hidden" animate="visible"
              >
                Where code<br />
                <span style={{ color: '#A78BFA' }}>meets craft.</span>
              </motion.h1>

              <motion.p
                className="text-gray-500 text-lg max-w-md leading-8 word-keep mb-10"
                variants={fadeUp(0.3)} initial="hidden" animate="visible"
              >
                3D 공간을 조각하고, 이야기를 지으며 게임 속 세계를 그립니다.<br />
                상상을 현실로 번역하는 크리에이터.
              </motion.p>

              <motion.p
                className="font-mono text-xs mt-16 tracking-widest"
                style={{ color: '#d8b4fe' }}
                variants={fadeUp(0.6)} initial="hidden" animate="visible"
              >
                scroll ↓
              </motion.p>
            </div>

            {/* Right: 3D Model (Frog) */}
            <motion.div
              className="hidden md:flex flex-col items-center justify-center w-64 h-64 shrink-0"
              variants={fadeUp(0.25)} initial="hidden" animate="visible"
            >
              <model-viewer
                src="/flog.glb"
                alt="3D Frog model"
                auto-rotate
                camera-controls
                interaction-prompt="none"
                camera-orbit="0deg 75deg 210%"
                shadow-intensity="0.5"
                exposure="1"
                disable-zoom
                style={{ width: '100%', height: '100%', outline: 'none' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About Me ── */}
      <Section id="about">
        <motion.span className="creator-label" variants={fadeUp(0)}>
          about
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 word-keep"
          variants={fadeUp(0.05)}
        >
          About Me
        </motion.h2>
        <motion.div className="grid md:grid-cols-3 gap-8 mb-10" variants={fadeUp(0.1)}>
          <div className="md:col-span-2 space-y-5 text-gray-500 text-base leading-8 word-keep">
            <p>
              <span className="text-gray-900 font-semibold">장르와 매체를 넘나드는 창작</span>에 몰두합니다.
              단순한 3D 모델링을 넘어, 게임 개발, 소설 집필, 극작까지 다양한 형태로 상상력을 구현합니다.
            </p>
            <p>
              제가 만드는 모델과 비주얼은 단편적인 이미지가 아니라,{' '}
              <span className="text-gray-900">그 바탕에 깔린 이야기와 서사(Narrative)</span>의 단편입니다.
            </p>
            <p>
              Blender나 Photoshop 같은 도구를 활용해 세계를 시각화하고,
              텍스트를 통해 그 세계의 물리 법칙과 인물들의 삶을 채워나가는 과정을 즐깁니다.
            </p>
          </div>
          <div className="space-y-3">
            {[
              ['Main Tools', 'Blender 3D, Adobe Photoshop & Lightroom'],
              ['Interests', 'Playwriting, 3D Modeling'],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl p-4 border"
                style={{ borderColor: '#f3e8ff', background: '#fafafa' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-purple-300 mb-1">
                  {k}
                </p>
                <p className="text-gray-700 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── Visual Archive (Instagram Links) ── */}
      <Section id="archive">
        <motion.span className="creator-label" variants={fadeUp(0)}>
          visual archive
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 word-keep"
          variants={fadeUp(0.05)}
        >
          Selected Works
        </motion.h2>
        <motion.p
          className="text-gray-400 text-sm mb-10 word-keep"
          variants={fadeUp(0.08)}
        >
          이미지를 클릭하면 인스타그램(@biu_bam) 피드로 이동합니다.
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {archiveItems.map((item, i) => (
            <ArchiveCard
              key={item.id}
              item={item}
              index={i}
            />
          ))}
        </div>
      </Section>

      {/* ── What I Built (Built Projects) ── */}
      <Section id="projects">
        <motion.span className="creator-label" variants={fadeUp(0)}>
          projects
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 word-keep"
          variants={fadeUp(0.05)}
        >
          What I Built
        </motion.h2>
        <motion.div className="space-y-4" variants={fadeUp(0.1)}>
          {builtProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveProject(p)}
              className="rounded-3xl p-7 border transition-all duration-300 hover:shadow-lg cursor-pointer group bg-white"
              style={{ borderColor: '#f3e8ff' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#c4b5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3e8ff'; }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date badge */}
                  {p.date && (
                    <span className="font-mono text-xs text-purple-300 tracking-widest">{p.date}</span>
                  )}
                  <h3 className="text-gray-900 font-bold text-lg mb-2 mt-1 word-keep group-hover:text-purple-600 transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="text-gray-500 text-sm word-keep">{p.oneliner}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.tags.map(t => (
                       <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-purple-50 text-purple-600 border border-purple-100">{t}</span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors duration-200 text-lg shrink-0 mt-1">→</span>
              </div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ── Skills ──────────────────────────────────────────────── */}
      <Section id="skills">
        <motion.span className="creator-label" variants={fadeUp(0)}>
          skills
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 word-keep"
          variants={fadeUp(0.05)}
        >
          Creative Tools
        </motion.h2>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={fadeUp(0.1)}>
          {skills.map((s) => (
            <div
              key={s.name}
              className="rounded-3xl p-7 border transition-all duration-300 hover:shadow-lg cursor-default"
              style={{
                borderColor: '#f3e8ff',
                background: '#fff',
                boxShadow: '0 2px 16px rgba(167,139,250,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#c4b5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3e8ff'; }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1.5">{s.name}</p>
                  <p className="text-gray-400 text-sm leading-6 word-keep">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ── Connect ─────────────────────────────────────────────── */}
      <Section id="connect">
        <motion.span className="creator-label" variants={fadeUp(0)}>
          connect
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 word-keep"
          variants={fadeUp(0.05)}
        >
          Let's talk.
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-10 word-keep"
          variants={fadeUp(0.1)}
        >
          협업, 커미션, 혹은 그냥 반가운 인사도 환영해요.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row flex-wrap gap-4" variants={fadeUp(0.15)}>
          <a
            href="mailto:vio_raccoon@naver.com"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: '#e9d5ff', color: '#7c3aed' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A78BFA'; e.currentTarget.style.background = '#faf5ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.background = ''; }}
          >
            <span className="text-xl">✉️</span>
            <div>
              <p className="font-semibold text-sm">메일 보내기</p>
              <p className="text-xs text-gray-400">vio_raccoon@naver.com</p>
            </div>
          </a>
          <a
            href="https://instagram.com/biu_bam"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: '#e9d5ff', color: '#7c3aed' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A78BFA'; e.currentTarget.style.background = '#faf5ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.background = ''; }}
          >
            <span className="text-xl">📸</span>
            <div>
              <p className="font-semibold text-sm">인스타그램</p>
              <p className="text-xs text-gray-400">@biu_bam</p>
            </div>
          </a>
          <a
            href="https://crepe.cm/ko/@vio_raccoon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: '#e9d5ff', color: '#7c3aed' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A78BFA'; e.currentTarget.style.background = '#faf5ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9d5ff'; e.currentTarget.style.background = ''; }}
          >
            <span className="text-xl">✨</span>
            <div>
              <p className="font-semibold text-sm">커미션 (크레페)</p>
              <p className="text-xs text-gray-400">@vio_raccoon</p>
            </div>
          </a>
        </motion.div>
        <motion.p
          className="text-xs mt-20 word-keep"
          style={{ color: '#e9d5ff' }}
          variants={fadeUp(0.2)}
        >
          © 2026 Park Soyoon <br /> 크리에이터 포트폴리오
        </motion.p>
      </Section>

      {/* Side Panel */}
      <AnimatePresence>
        {activeProject && (
          <CreatorSidePanel project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
