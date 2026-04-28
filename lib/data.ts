// import { GoldTitle, GrayTitle } from "@/components/reusables";

/**
 * BRANDING & ASSETS
 */
export const BRAND_NAME = "Mocktail";

export const LOGOS = [
  { src: "/amazon.svg", alt: "Amazon" },
  { src: "/atlassian.svg", alt: "Atlassian" },
  { src: "/google.webp", alt: "Google" },
  { src: "/meta.svg", alt: "Meta" },
  { src: "/microsoft.webp", alt: "Microsoft" },
  { src: "/netflix.png", alt: "Netflix" },
  { src: "/uber.svg", alt: "Uber" },
];

export const AVATARS = [
  { src: "https://randomuser.me/api/portraits/men/32.jpg" },
  { src: "https://randomuser.me/api/portraits/women/44.jpg" },
  { src: "https://randomuser.me/api/portraits/men/76.jpg" },
  { src: "https://randomuser.me/api/portraits/women/68.jpg" },
  { src: "https://randomuser.me/api/portraits/men/12.jpg" },
];

/**
 * INTERVIEW & USER TAGS
 */
export const AI_TAGS = [
  { label: "Frontend Engineer", active: true },
  { label: "L5 Level", active: true },
  { label: "React Performance", active: false },
  { label: "System Design", active: false },
  { label: "Behavioural", active: true },
  { label: "DSA", active: false },
];

export const SLOTS = [
  { label: "Mon 10:00 AM", cls: "border-amber-400/30 text-amber-200 bg-amber-400/5" },
  { label: "Mon 2:00 PM", cls: "border-white/7 text-stone-500" },
  { label: "Tue 11:00 AM", cls: "border-amber-400/30 text-amber-200 bg-amber-400/5" },
  { label: "Wed 9:00 AM ✓", cls: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
  { label: "Thu 3:00 PM", cls: "border-amber-400/30 text-amber-200 bg-amber-400/5" },
];

/**
 * SUBSCRIPTION PLANS
 */
export const PLANS = [
  {
    name: "Free",
    price: "$0",
    credits: "1 credit / month",
    featured: false,
    planId: null,
    slug: "free",
    features: [
      "1 Mocktail session",
      "HD video call via Stream",
      "Persistent chat thread",
      "Standard AI feedback",
    ],
  },
  {
    name: "Starter",
    price: "$29",
    credits: "5 credits / month",
    featured: true,
    planId: "cplan_3Az9LokzTcywp64E2clEolnnqhB",
    slug: "starter",
    features: [
      "5 Mocktail sessions",
      "Advanced AI feedback report",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
    ],
  },
  {
    name: "Pro",
    price: "$69",
    credits: "15 credits / month",
    featured: false,
    planId: "cplan_3Az9PNOYND36xNf4JEkpT22w4X2",
    slug: "pro",
    features: [
      "15 Mocktail sessions",
      "Full AI-powered performance analysis",
      "HD video call via Stream",
      "Persistent chat thread",
      "Credits roll over monthly",
      "Session recording & playback",
    ],
  },
];

/**
 * CORE ROLES & ONBOARDING
 */
export const ROLES = [
  {
    label: "Interviewee",
    // title: <GrayTitle>Land the role you deserve</GrayTitle>,
    desc: "Stop guessing what interviewers want. Practice with experts on Mocktail who've been on the other side and know exactly how top companies evaluate.",
    perks: [
      "Browse by category: Frontend, Backend, Systems",
      "Book sessions using Mocktail credits",
      "Receive AI-powered feedback after every session",
      "Access Stream-powered recording links",
      "Real-time chat before and after the call",
    ],
  },
  {
    label: "Interviewer",
    // title: <GoldTitle>Earn doing what you're great at</GoldTitle>,
    desc: "Join the Mocktail Mentor community. Share your knowledge, help engineers grow, and earn meaningful income on your own schedule.",
    perks: [
      "Set your own availability and rates",
      "AI-driven question generator for every role",
      "Earn credits per session — withdraw any time",
      "Comprehensive dashboard for earnings and requests",
    ],
  },
];

export const ONBOARDING_ROLES = [
  {
    value: "INTERVIEWEE",
    icon: "🎯",
    title: "I want to practice",
    desc: "Browse expert interviewers, book sessions, and get AI-powered feedback on Mocktail.",
  },
  {
    value: "INTERVIEWER",
    icon: "🧑‍💼",
    title: "I want to interview",
    desc: "Share your expertise, earn credits, and help engineers level up.",
  },
];

/**
 * CATEGORIES & UI STYLES
 */
export const CATEGORIES = [
  { value: null, label: "All" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "DSA", label: "DSA" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "MOBILE", label: "Mobile" },
];

export const CATEGORY_LABEL: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  DATA_SCIENCE: "DSA",
  SYSTEM_DESIGN: "System Design",
  HR: "Behavioral",
  DEVOPS: "DevOps",
  MOBILE: "Mobile",
  AI_AND_ML: "Ai And ML",
};

export const STATUS_STYLES = {
  SCHEDULED: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  COMPLETED: "border-green-500/20 bg-green-500/10 text-green-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-400",
};

export const RATING_LABEL:Record<string,string>={
  POOR:"Poor",
  AVERAGE:"Average",
  GOOD:"Good",
  EXCELLENT:"Excellent",
}

export const RATING_CONFIG = {
  POOR: { label: "Poor", emoji: "📉", className: "border-red-500/20 bg-red-500/10 text-red-400", bg: "from-red-500/5" },
  AVERAGE: { label: "Average", emoji: "📊", className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400", bg: "from-yellow-500/5" },
  GOOD: { label: "Good", emoji: "👍", className: "border-blue-500/20 bg-blue-500/10 text-blue-400", bg: "from-blue-500/5" },
  EXCELLENT: { label: "Excellent", emoji: "🏆", className: "border-green-500/20 bg-green-500/10 text-green-400", bg: "from-green-500/5" },
};

export const EXPECT_ITEMS = [
  ["🎥", "Stream HD Video", "45-minute high-performance session with built-in screen sharing."],
  ["🤖", "AI Question Generator", "Context-aware questions generated live based on the candidate's target role."],
  ["💬", "Persistent Chat", "Collaborate via Stream Chat before and after—share notes and resources."],
  ["📊", "Mocktail Feedback Report", "Deep post-interview analysis on technical skills and communication."],
  ["📹", "Cloud Recordings", "Automatic recording links generated instantly for later review."],
];