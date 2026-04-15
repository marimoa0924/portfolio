import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────────────────────
const projects = [
  {
    id: 'dorm',
    title: '기숙사 배정 최적화 시스템',
    oneliner: '기숙사 배정 규칙과 학생 선호를 동시에 만족시키는 최적 배치 알고리즘',
    tags: ['C++', 'DFS', 'Algorithm', 'Optimization'],
    problem: '기존 기숙사 배정은 규칙이 제대로 지켜지지 않거나, 학생 간 관계와 선호를 반영하기 어려운 구조였습니다.',
    approach: '구조체 기반 데이터 모델 설계 후, 완전탐색(DFS)과 가중치 기반 알고리즘을 결합하여 조건 충족률과 선호 점수를 동시에 최적화했습니다.',
    role: '구조체 기반 데이터 모델 설계, 완전탐색 및 가중치 기반 알고리즘 구현, 배정 결과의 불만족도를 수치화하는 기준 설계',
    result: '규칙 충족과 선호 반영을 동시에 달성하는 시스템 구현. 다양한 조건을 유연하게 처리할 수 있는 확장 가능한 구조 완성.',
    learned: '알고리즘 설계에서 정확성과 효율성을 동시에 만족시키는 균형점을 찾는 방법을 익혔습니다. 데이터 모델링이 문제 해결의 핵심임을 체감했습니다.',
    image: null,
  },
  {
    id: 'ai-film',
    title: 'AI 내러티브 필름: 보이지 않는 영웅들',
    oneliner: 'AI 영상 생성 파이프라인을 직접 설계·구축한 내러티브 다큐멘터리',
    tags: ['AI Video', 'Pipeline', 'Narrative Design', 'Prompt Engineering'],
    problem: '육체 노동 직군의 가치를 직관적이고 감동적으로 전달할 수 있는 방식이 필요했습니다.',
    approach: '히어로 서사 구조를 직업군에 매핑하고, AI 이미지/영상 생성 파이프라인을 설계했습니다. Prompt Engineering과 후처리 파이프라인 자동화.',
    role: '스토리 구조 설계, AI 영상 생성 파이프라인 구축, 프롬프트 엔지니어링, 편집 자동화',
    result: '제3회 "땀 흘려 일하는 사람들" AI 영화제 대상 수상. AI 도구 기반 콘텐츠 제작 파이프라인 완성.',
    learned: '기술 시스템 설계와 스토리텔링이 결합될 때의 시너지를 직접 체험했습니다. AI 도구를 단순 사용하는 것이 아니라 파이프라인으로 엮는 것이 핵심임을 배웠습니다.',
    image: null,
  },
];

// Oldest first (top → bottom)
const experiences = [
  {
    year: '2022',
    title: '알고리즘/코딩 동아리 부기장',
    desc: '한민고등학교 · 알고리즘/코딩 동아리',
    highlight: false,
  },
  {
    year: '2022',
    title: 'SFPC 프로그래밍 챌린지 5위',
    desc: '전국 알고리즘/코딩 챌린지',
    highlight: true,
  },
  {
    year: '2023',
    title: '한국정보올림피아드 동상',
    desc: '전체/일반고 부문 · 2022·2023 연속 수상',
    highlight: true,
  },
  {
    year: '2023',
    title: '알고리즘/코딩 동아리 기장',
    desc: '한민고등학교 · 동아리 기장',
    highlight: false,
  },
  {
    year: '2025',
    title: '성균관대학교 컴퓨터교육과 입학',
    desc: '재학 중',
    highlight: false,
  },
  {
    year: '2025',
    title: 'Share via AI 우수상',
    desc: '성균관대학교 교수학습혁신센터 · AI 기반 학습 공유 프로젝트',
    highlight: true,
  },
  {
    year: '2025',
    title: 'Learning Fair SW융합대학장상',
    desc: '성균관대학교 SW융합대학',
    highlight: true,
  },
  {
    year: '2026',
    title: '제3회 AI 영화제 대상',
    desc: '"땀 흘려 일하는 사람들" AI 영화제 · AI 파이프라인 설계 및 제작',
    highlight: true,
  },
];

const skills = [
  { icon: '⚙️', name: 'C / C++', desc: 'DFS 기반 완전탐색 · 자료구조 설계 · PS 알고리즘 구현' },
  { icon: '🇨', name: 'C', desc: '시스템 프로그래밍 · 저수준 메모리 관리 · 알고리즘 구현' },
  { icon: '🐍', name: 'Python', desc: '최적화 알고리즘 · AI 파이프라인 구축 · 자동화 스크립트' },
  { icon: '아', name: '아희', desc: '국산 난해 언어(Esoteric) · PS 취미 및 도전적 레크리에이션 코딩' },
  { icon: '⚛️', name: 'JavaScript / React', desc: '포트폴리오 웹 개발 · Vite + Tailwind + Framer Motion' },
];

const psProfiles = [
  {
    platform: 'solved.ac',
    handle: 'sky_yoon1',
    tier: 'Platinum V',
    tierLabel: '플래티넘 5',
    // solved.ac platinum color
    tierColor: '#27e2a4',
    rating: '1666점',
    sub: '아레나 A+ · 1442점',
    link: 'https://solved.ac/profile/sky_yoon1',
    featured: true,
  },
  {
    platform: 'Codeforces',
    handle: 'sky_yoon1',
    tier: 'Newbie',
    tierLabel: 'Newbie',
    tierColor: '#888888',
    rating: '1061점',
    sub: 'max rating 1071',
    link: 'https://codeforces.com/profile/sky_yoon1',
    featured: false,
  },
  {
    platform: 'AtCoder',
    handle: 'sky_yoon1',
    tier: '9 Kyu',
    tierLabel: '9급',
    tierColor: '#808080',
    rating: 'Rating 321',
    sub: 'Rank 41308th · Rated Matches 4',
    link: 'https://atcoder.jp/users/sky_yoon1',
    featured: false,
  },
];

const blogPosts = [
  {
    id: 1,
    category: 'Codeforces',
    title: 'Codeforces Round 950 참가 후기',
    date: '2024.06',
    summary: 'Div.2 A~C 솔브. D번에서 시간 초과를 만나며 구간합 전략의 중요성을 체감.',
    link: '#',
  },
  {
    id: 2,
    category: 'Baekjoon',
    title: '플래티넘 달성 기념 회고',
    date: '2024.03',
    summary: '1년간의 PS 여정. 세그먼트 트리와 DP 최적화를 정복하기까지.',
    link: '#',
  },
  {
    id: 3,
    category: 'AtCoder',
    title: 'AtCoder Beginner Contest 352 풀이',
    date: '2024.05',
    summary: 'ABC에서 E번까지 클리어. 문자열 해싱의 응용이 핵심이었던 대회.',
    link: '#',
  },
  {
    id: 4,
    category: '기타',
    title: '한국정보올림피아드(KOI) 2023 후기',
    desc: '',
    date: '2023.09',
    summary: '2개년 연속 동상 수상. 지역 예선과 전국 본선의 분위기 차이 및 문제 유형 분석.',
    link: '#',
  },
];

const BLOG_CATEGORIES = ['전체', 'Codeforces', 'AtCoder', 'Baekjoon', '기타'];
const categoryColors = {
  Codeforces: 'bg-red-900/40 text-red-300 border-red-800',
  AtCoder: 'bg-sky-900/40 text-sky-300 border-sky-800',
  Baekjoon: 'bg-blue-900/40 text-blue-300 border-blue-800',
  기타: 'bg-neutral-800 text-neutral-400 border-neutral-700',
};

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } },
});

function Section({ id, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section id={id} ref={ref} className="dev-section border-t border-neutral-900">
      <div className="dev-container">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────
function SidePanel({ project, onClose }) {
  const rows = [
    { label: '// problem', content: project.problem },
    { label: '// approach', content: project.approach },
    { label: '// role', content: project.role },
    { label: '// result', content: project.result },
    { label: '// learned', content: project.learned },
  ];

  return (
    <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-neutral-950 border-l border-neutral-800 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        {/* ── Photo placeholder ── */}
        <div className="w-full aspect-video bg-neutral-900 border-b border-neutral-800 flex items-center justify-center relative">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-neutral-600">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="font-mono text-xs tracking-widest uppercase">이미지 준비 중</span>
            </div>
          )}
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white leading-snug word-keep">{project.title}</h2>
              <p className="text-neutral-400 text-sm mt-2 leading-7 word-keep">{project.oneliner}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700
                         flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >✕</button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(t => (
              <span key={t} className="dev-tag">{t}</span>
            ))}
          </div>

          {/* Detail rows */}
          <div className="space-y-4">
            {rows.map(({ label, content }) => (
              <div key={label} className="bg-neutral-900/80 rounded-xl p-5 border border-neutral-800">
                <p className="font-mono text-[11px] text-neutral-500 mb-3 tracking-[0.15em]">{label}</p>
                <p className="text-neutral-300 text-sm leading-7 word-keep">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DeveloperPage() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null);
  const [blogFilter, setBlogFilter] = useState('전체');

  const filteredPosts = blogFilter === '전체'
    ? blogPosts
    : blogPosts.filter(p => p.category === blogFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">

      {/* ── Minimal top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/')}
          className="text-sm text-neutral-600 hover:text-white transition-colors duration-200 font-medium"
        >
          ← Home
        </motion.button>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs tracking-widest uppercase text-neutral-700 font-semibold"
        >
          Developer
        </motion.span>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
        {/* Background "Where code" watermark */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-black text-[clamp(6rem,18vw,18rem)] leading-none select-none pointer-events-none whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.025)', zIndex: 0 }}
          aria-hidden="true"
        >
          WHERE CODE
        </div>

        <div className="dev-container relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:gap-16">
            {/* Left: Text */}
            <div className="flex-1">
              <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible">
                <span className="dev-label">Park Soyoon · Developer</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
                variants={fadeUp(0.2)} initial="hidden" animate="visible"
              >
                Where code<br />
                <span className="text-neutral-500">meets craft.</span>
              </motion.h1>

              <motion.p
                className="text-neutral-400 text-lg max-w-md leading-8 word-keep mb-10"
                variants={fadeUp(0.3)} initial="hidden" animate="visible"
              >
                알고리즘으로 문제를 구조화하고,<br />
                시스템으로 해결을 완성합니다.
              </motion.p>

              <motion.div variants={fadeUp(0.4)} initial="hidden" animate="visible">
                <a
                  href="mailto:skyyoon0924@g.skku.edu"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-neutral-300 rounded-full
                             text-sm font-medium hover:border-white hover:text-white transition-colors duration-200"
                >
                  ✉ skyyoon0924@g.skku.edu
                </a>
              </motion.div>

              <motion.p
                className="font-mono text-xs text-neutral-700 mt-16 tracking-widest"
                variants={fadeUp(0.6)} initial="hidden" animate="visible"
              >
                scroll ↓
              </motion.p>
            </div>

            {/* Right: 3D Model placeholder */}
            <motion.div
              className="hidden md:flex flex-col items-center justify-center w-64 h-64 shrink-0"
              variants={fadeUp(0.25)} initial="hidden" animate="visible"
            >
              <div
                className="w-full h-full rounded-3xl border border-neutral-800 bg-neutral-900/50
                            flex flex-col items-center justify-center gap-3 text-neutral-600"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="2" y="4" width="20" height="14" rx="2" />
                  <path d="M8 20h8M12 18v2" />
                </svg>
                <span className="font-mono text-xs tracking-widest uppercase text-center leading-5">
                  3D Model<br/>준비 중
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <Section id="about">
        <motion.span className="dev-label" variants={fadeUp(0)}>// about</motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-8 word-keep"
          variants={fadeUp(0.05)}
        >
          About Me
        </motion.h2>

        <motion.div className="grid md:grid-cols-3 gap-8 mb-10" variants={fadeUp(0.1)}>
          <div className="md:col-span-2 space-y-5 text-neutral-400 text-base leading-8 word-keep">
            <p>
              <span className="text-white font-semibold">성균관대학교 컴퓨터교육과</span> 재학 중.
              알고리즘 문제풀이(PS)와 시스템 설계에 깊은 관심을 가지고 있습니다.
            </p>
            <p>
              단순히 코드를 작성하는 것이 아니라,{' '}
              <span className="text-white">문제의 구조를 먼저 파악하고 최적의 아키텍처를 설계</span>하는 것을 우선합니다.
              기획 단계부터 최종 구현까지 전 과정을 리드하는 것을 즐깁니다.
            </p>
            <p>
              정보올림피아드, 알고리즘 챌린지 등 경쟁적 프로그래밍 경험을 통해
              <span className="text-white"> 논리적 사고와 효율적 문제 해결 역량</span>을 쌓았습니다.
            </p>
          </div>
          <div className="space-y-3">
            {[
              ['Major', 'Computer Education'],
              ['Interests', 'Algorithm & PS'],
              ['Languages', 'C++, C, Python, Aheui'],
            ].map(([k, v]) => (
              <div key={k} className="border border-neutral-800 rounded-xl p-4">
                <p className="font-mono text-xs text-neutral-600 mb-1">{k}</p>
                <p className="text-neutral-300 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PS Profiles */}
        <motion.div variants={fadeUp(0.15)}>
          <p className="font-mono text-xs text-neutral-500 tracking-[0.2em] uppercase mb-4">// ps profiles</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {psProfiles.map((ps) => (
              <a
                key={ps.platform}
                href={ps.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`dev-card group flex flex-col gap-3 transition-all duration-300 ${
                  ps.featured
                    ? 'border-[#27e2a4]/30 hover:border-[#27e2a4]/70'
                    : 'hover:border-neutral-500'
                }`}
                style={ps.featured ? { boxShadow: '0 0 24px rgba(39,226,164,0.06)' } : {}}
              >
                {/* Platform + Tier badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest uppercase text-neutral-500">{ps.platform}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: ps.tierColor + '22', color: ps.tierColor, border: `1px solid ${ps.tierColor}44` }}
                  >
                    {ps.tierLabel}
                  </span>
                </div>

                {/* Handle */}
                <div>
                  <p className="text-white font-semibold">{ps.handle}</p>
                  {/* Featured (platinum) tier emphasis */}
                  {ps.featured && (
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-2xl font-black tracking-tight"
                        style={{ color: '#27e2a4' }}
                      >
                        Platinum V
                      </span>
                    </div>
                  )}
                  <p className="text-neutral-400 text-sm mt-1">{ps.rating}</p>
                  {ps.sub && <p className="text-neutral-600 text-xs mt-0.5">{ps.sub}</p>}
                </div>

                <span className="text-neutral-700 group-hover:text-neutral-400 transition-colors text-sm font-mono mt-auto">
                  프로필 보기 →
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── Projects ── */}
      <Section id="projects">
        <motion.span className="dev-label" variants={fadeUp(0)}>// projects</motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-10 word-keep"
          variants={fadeUp(0.05)}
        >
          What I Built
        </motion.h2>
        <motion.div className="space-y-4" variants={fadeUp(0.1)}>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveProject(p)}
              className="dev-card group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg mb-2 word-keep group-hover:text-neutral-200 transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="text-neutral-500 text-sm word-keep">{p.oneliner}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.tags.map(t => <span key={t} className="dev-tag">{t}</span>)}
                  </div>
                </div>
                <span className="text-neutral-700 group-hover:text-neutral-400 transition-colors duration-200 text-lg shrink-0 mt-1">→</span>
              </div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ── Experience (Timeline) ── */}
      <Section id="experience">
        <motion.span className="dev-label" variants={fadeUp(0)}>// experience</motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-12 word-keep"
          variants={fadeUp(0.05)}
        >
          Experience
        </motion.h2>
        <motion.div className="relative" variants={fadeUp(0.1)}>
          {/* Vertical line */}
          <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-neutral-800" />

          <div className="space-y-0">
            {experiences.map((e, i) => (
              <div key={i} className="relative flex gap-0 items-start">
                {/* Year */}
                <div className="w-24 shrink-0 pt-1 pb-10">
                  <span className="font-mono text-xs text-neutral-600">{e.year}</span>
                </div>

                {/* Node dot */}
                <div className="relative shrink-0 flex flex-col items-center" style={{ marginTop: '4px' }}>
                  <div className={`w-3 h-3 rounded-full border-2 z-10 -translate-x-[6px] ${
                    e.highlight
                      ? 'bg-white border-white'
                      : 'bg-neutral-800 border-neutral-600'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-10 pl-5">
                  <p className={`font-semibold mb-1 word-keep ${e.highlight ? 'text-white' : 'text-neutral-400'}`}>
                    {e.title}
                  </p>
                  <p className="text-neutral-600 text-sm word-keep">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ── Skills ── */}
      <Section id="skills">
        <motion.span className="dev-label" variants={fadeUp(0)}>// skills</motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-10 word-keep"
          variants={fadeUp(0.05)}
        >
          Tech Stack
        </motion.h2>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={fadeUp(0.1)}>
          {skills.map((s) => (
            <div key={s.name} className="dev-card cursor-default">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0">{s.icon}</span>
                <div>
                  <p className="font-mono font-semibold text-white mb-1.5">{s.name}</p>
                  <p className="text-neutral-500 text-sm leading-6 word-keep">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ── Blog (PS 후기) ── */}
      <Section id="blog">
        <motion.span className="dev-label" variants={fadeUp(0)}>// ps blog</motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-3 word-keep"
          variants={fadeUp(0.05)}
        >
          Contest Log
        </motion.h2>
        <motion.p
          className="text-neutral-500 text-sm mb-8 word-keep"
          variants={fadeUp(0.08)}
        >
          PS 대회 참여 후기 및 풀이 기록
        </motion.p>

        {/* Category filter */}
        <motion.div className="flex flex-wrap gap-2 mb-8" variants={fadeUp(0.1)}>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setBlogFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
                blogFilter === cat
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-500 border border-neutral-800 hover:border-neutral-600 hover:text-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Posts */}
        <motion.div className="space-y-4" variants={fadeUp(0.12)}>
          <AnimatePresence mode="wait">
            {filteredPosts.map((post) => (
              <motion.a
                key={post.id}
                href={post.link}
                className="block dev-card group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${categoryColors[post.category]}`}>
                        {post.category}
                      </span>
                      <span className="font-mono text-xs text-neutral-600">{post.date}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 word-keep group-hover:text-neutral-200 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-6 word-keep">{post.summary}</p>
                  </div>
                  <span className="text-neutral-700 group-hover:text-neutral-400 transition-colors text-lg shrink-0 mt-1">→</span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      {/* ── Connect ── */}
      <Section id="connect">
        <motion.span className="dev-label" variants={fadeUp(0)}>// connect</motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-3 word-keep"
          variants={fadeUp(0.05)}
        >
          Let's talk.
        </motion.h2>
        <motion.p
          className="text-neutral-500 mb-10 word-keep"
          variants={fadeUp(0.1)}
        >
          함께 할 수 있는 모든 기회를 기다리고 있어요.
        </motion.p>
        <motion.div variants={fadeUp(0.15)}>
          <a
            href="mailto:skyyoon0924@g.skku.edu"
            className="inline-flex items-center gap-3 px-7 py-4 border border-neutral-700 rounded-2xl
                       text-neutral-300 hover:border-white hover:text-white transition-all duration-200
                       hover:-translate-y-0.5"
          >
            <span className="text-xl">✉️</span>
            <div>
              <p className="font-semibold text-sm">메일 보내기</p>
              <p className="text-xs text-neutral-600">skyyoon0924@g.skku.edu</p>
            </div>
          </a>
        </motion.div>
        <motion.p
          className="font-mono text-xs text-neutral-800 mt-20 word-keep"
          variants={fadeUp(0.2)}
        >
          © 2026 Park Soyoon
        </motion.p>
      </Section>

      {/* Side Panel */}
      <AnimatePresence>
        {activeProject && (
          <SidePanel project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
