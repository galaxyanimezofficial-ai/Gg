import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const STARTING_BALANCE = 12500;

const PLANS = [
  { id: "mc-starter", name: "MC Starter", price: 4.99, category: "Minecraft" },
  { id: "mc-pro", name: "MC Pro", price: 9.99, category: "Minecraft" },
  { id: "mc-elite", name: "MC Elite", price: 19.99, category: "Minecraft" },
  { id: "vps-basic", name: "VPS Basic", price: 12.99, category: "VPS" },
  { id: "vps-plus", name: "VPS Plus", price: 24.99, category: "VPS" },
  { id: "vps-ultra", name: "VPS Ultra", price: 49.99, category: "VPS" },
  { id: "dedicated-s", name: "Dedicated S", price: 89.99, category: "Dedicated" },
  { id: "dedicated-m", name: "Dedicated M", price: 149.99, category: "Dedicated" },
];

const CLIENTS = [
  { id: "c1", name: "Alex Rivers", discord: "alexrivers#4421", location: "US", email: "alex@gmail.com" },
  { id: "c2", name: "Mia Thornton", discord: "miath#7732", location: "EU", email: "mia@outlook.com" },
  { id: "c3", name: "James Kudo", discord: "jkudo#1190", location: "US", email: "james@yahoo.com" },
  { id: "c4", name: "Sophia Lane", discord: "sophialane#8854", location: "AU", email: "sophia@gmail.com" },
  { id: "c5", name: "Noah Bennett", discord: "noahb#3310", location: "EU", email: "noah@proton.me" },
  { id: "c6", name: "Lena Marz", discord: "lenamarz#5503", location: "DE", email: "lena@web.de" },
  { id: "c7", name: "Carlos Vega", discord: "cvega#2211", location: "MX", email: "carlos@gmail.com" },
  { id: "c8", name: "Priya Sharma", discord: "priyash#9981", location: "IN", email: "priya@hotmail.com" },
  { id: "c9", name: "Tyler Frost", discord: "tfrost#6640", location: "US", email: "tyler@gmail.com" },
  { id: "c10", name: "Emma Johansson", discord: "emmaj#4472", location: "SE", email: "emma@gmail.com" },
  { id: "c11", name: "Kai Nguyen", discord: "kaing#8823", location: "US", email: "kai@gmail.com" },
  { id: "c12", name: "Isla McKenzie", discord: "islamck#1104", location: "UK", email: "isla@yahoo.co.uk" },
];

const generateSales = () => {
  const sales = [];
  const now = new Date(2026, 4, 27);
  let id = 1;
  for (let m = 0; m < 6; m++) {
    const month = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const count = 8 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const client = CLIENTS[Math.floor(Math.random() * CLIENTS.length)];
      const plan = PLANS[Math.floor(Math.random() * PLANS.length)];
      const day = 1 + Math.floor(Math.random() * 28);
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const renewal = new Date(date);
      renewal.setMonth(renewal.getMonth() + 1);
      const paid = Math.random() > 0.12;
      sales.push({
        id: `INV-${String(id++).padStart(4, "0")}`,
        clientId: client.id,
        clientName: client.name,
        discord: client.discord,
        location: client.location,
        plan: plan.name,
        planId: plan.id,
        category: plan.category,
        amount: plan.price,
        currency: "USD",
        method: ["PayPal", "Stripe", "Crypto", "Bank Transfer"][Math.floor(Math.random() * 4)],
        status: paid ? "paid" : (Math.random() > 0.5 ? "unpaid" : "overdue"),
        date: date.toISOString().split("T")[0],
        renewal: renewal.toISOString().split("T")[0],
        notes: "",
      });
    }
  }
  return sales.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const SALES = generateSales();

const EXPENSES = [
  { id: "e1", category: "Server Costs", description: "Hetzner Node - EU Cluster", amount: 340, date: "2026-05-01", recurring: true },
  { id: "e2", category: "Server Costs", description: "AWS EC2 - US East", amount: 210, date: "2026-05-01", recurring: true },
  { id: "e3", category: "Marketing", description: "Discord Server Boost Ads", amount: 75, date: "2026-05-03", recurring: false },
  { id: "e4", category: "Marketing", description: "Google Ads Campaign", amount: 200, date: "2026-05-05", recurring: false },
  { id: "e5", category: "Domain & CDN", description: "Cloudflare Pro Plan", amount: 20, date: "2026-05-01", recurring: true },
  { id: "e6", category: "Domain & CDN", description: "blizzbyte.net renewal", amount: 15, date: "2026-05-10", recurring: false },
  { id: "e7", category: "Staff", description: "Support Agent - May", amount: 450, date: "2026-05-15", recurring: true },
  { id: "e8", category: "Marketing", description: "YouTube Sponsorship", amount: 150, date: "2026-05-08", recurring: false },
  { id: "e9", category: "Server Costs", description: "Hetzner Node - US Cluster", amount: 280, date: "2026-04-01", recurring: true },
  { id: "e10", category: "Marketing", description: "Facebook Ads", amount: 120, date: "2026-04-12", recurring: false },
  { id: "e11", category: "Staff", description: "Dev Contractor - April", amount: 600, date: "2026-04-15", recurring: false },
  { id: "e12", category: "Miscellaneous", description: "Legal / Business Registration", amount: 250, date: "2026-04-20", recurring: false },
  { id: "e13", category: "Server Costs", description: "OVH VPS Fleet - March", amount: 390, date: "2026-03-01", recurring: true },
  { id: "e14", category: "Marketing", description: "Discord Partner Promo", amount: 90, date: "2026-03-15", recurring: false },
  { id: "e15", category: "Tax", description: "Q1 Estimated Tax Payment", amount: 820, date: "2026-04-15", recurring: false },
  { id: "e16", category: "Refund", description: "Client Refund - mc-starter", amount: 4.99, date: "2026-05-18", recurring: false },
  { id: "e17", category: "Server Costs", description: "Hetzner Node - EU Cluster", amount: 340, date: "2026-04-01", recurring: true },
  { id: "e18", category: "Marketing", description: "TikTok Ads Campaign", amount: 180, date: "2026-05-12", recurring: false },
];

const MONTHLY = [
  { month: "Dec", revenue: 1820, expenses: 1100, profit: 720 },
  { month: "Jan", revenue: 2140, expenses: 1230, profit: 910 },
  { month: "Feb", revenue: 2580, expenses: 1380, profit: 1200 },
  { month: "Mar", revenue: 3110, expenses: 1540, profit: 1570 },
  { month: "Apr", revenue: 3640, expenses: 1720, profit: 1920 },
  { month: "May", revenue: 4180, expenses: 1870, profit: 2310 },
];

const ACTIVITY_LOG = [
  { id: 1, action: "Invoice INV-0048 marked as paid", user: "Admin", time: "2 min ago", type: "payment" },
  { id: 2, action: "New client Kai Nguyen added", user: "Admin", time: "14 min ago", type: "client" },
  { id: 3, action: "Expense added: TikTok Ads $180", user: "Admin", time: "1 hr ago", type: "expense" },
  { id: 4, action: "Invoice INV-0047 overdue flagged", user: "System", time: "3 hrs ago", type: "alert" },
  { id: 5, action: "Tax estimate updated for May", user: "Admin", time: "5 hrs ago", type: "tax" },
  { id: 6, action: "New sale: VPS Ultra - Emma Johansson", user: "Admin", time: "1 day ago", type: "sale" },
  { id: 7, action: "CSV export downloaded", user: "Admin", time: "2 days ago", type: "export" },
];

// ─── CALCULATIONS ──────────────────────────────────────────────────────────────
const calcFinancials = (sales, expenses) => {
  const totalRevenue = sales.filter(s => s.status === "paid").reduce((a, s) => a + s.amount, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const pendingRevenue = sales.filter(s => s.status !== "paid").reduce((a, s) => a + s.amount, 0);
  const marketingCosts = expenses.filter(e => e.category === "Marketing").reduce((a, e) => a + e.amount, 0);
  const serverCosts = expenses.filter(e => e.category === "Server Costs").reduce((a, e) => a + e.amount, 0);
  const taxPaid = expenses.filter(e => e.category === "Tax").reduce((a, e) => a + e.amount, 0);
  const estimatedTax = totalRevenue * 0.21;
  const netProfit = totalRevenue - totalExpenses;
  const currentBalance = STARTING_BALANCE + netProfit;
  return { totalRevenue, totalExpenses, pendingRevenue, marketingCosts, serverCosts, taxPaid, estimatedTax, netProfit, currentBalance };
};

// ─── THEME & STYLES ────────────────────────────────────────────────────────────
const tw = (...c) => c.filter(Boolean).join(" ");

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ path, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
);

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  sales: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M12 7a4 4 0 100 8 4 4 0 000-8z M19 8v6 M22 11h-6",
  expenses: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  clients: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  invoices: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  tax: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  analytics: "M18 20V10 M12 20V4 M6 20v-6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  trend_up: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  trend_down: "M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6",
  dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  credit: "M1 4h22v16H1z M1 10h22",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  plus: "M12 5v14 M5 12h14",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  server: "M2 3h20v6H2z M2 9h20v6H2z M2 15h20v6H2z M6 6h.01 M6 12h.01 M6 18h.01",
  globe: "M12 22a10 10 0 100-20 10 10 0 000 20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const styles = {
    paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    unpaid: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    overdue: "bg-red-500/20 text-red-400 border-red-500/30",
    active: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };
  return (
    <span className={tw("px-2 py-0.5 rounded-full text-xs font-semibold border", styles[status] || styles.unpaid)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const StatCard = ({ title, value, sub, icon, trend, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 group hover:border-white/20 transition-all duration-300"
  >
    <div className={tw("absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity", gradient)} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-widest">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/70">
          <Icon path={icon} size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white font-mono tracking-tight">{value}</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        {trend !== undefined && (
          <span className={tw("flex items-center gap-0.5 text-xs font-semibold", trend >= 0 ? "text-emerald-400" : "text-red-400")}>
            <Icon path={trend >= 0 ? ICONS.trend_up : ICONS.trend_down} size={12} />
            {Math.abs(trend)}%
          </span>
        )}
        {sub && <p className="text-xs text-white/40">{sub}</p>}
      </div>
    </div>
  </motion.div>
);

const GlassCard = ({ children, className = "", title, action }) => (
  <div className={tw("rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md", className)}>
    {title && (
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</h3>
        {action}
      </div>
    )}
    {children}
  </div>
);

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
const fmtShort = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1117] border border-white/20 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-white/60 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>{p.name}: {fmtShort(p.value)}</p>
      ))}
    </div>
  );
};

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      if (user === "admin" && pass === "blizz2026") {
        onLogin();
      } else {
        setErr("Invalid credentials. Try admin / blizz2026");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Dark wave background - matches uploaded image */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 70% 20%, #2a2a2a 0%, #111 40%, #000 100%)"
      }} />
      {/* Wave ribbon layer 1 - the main dark swoosh */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#2a2a2a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000" stopOpacity="1" />
            <stop offset="50%" stopColor="#0d0d0d" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="shine1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#555" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#3a3a3a" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#222" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#444" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="shine2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#666" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#333" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#111" stopOpacity="0.1" />
          </linearGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {/* Upper dark region */}
        <rect width="1000" height="1000" fill="#080808" />
        {/* Main ribbon - dark center band going diagonal */}
        <path d="M-50 350 Q200 200 500 320 Q750 420 1050 280 L1050 480 Q750 620 500 500 Q200 380 -50 540 Z" fill="url(#wave2)" />
        {/* Top surface shine of ribbon */}
        <path d="M-50 350 Q200 200 500 320 Q750 420 1050 280 L1050 320 Q750 460 500 360 Q200 240 -50 390 Z" fill="url(#shine1)" />
        {/* Bottom surface highlight */}
        <path d="M-50 500 Q200 360 500 480 Q750 580 1050 440 L1050 480 Q750 620 500 500 Q200 380 -50 540 Z" fill="url(#shine2)" />
        {/* Subtle upper glow sweep */}
        <ellipse cx="200" cy="180" rx="350" ry="120" fill="#2a2a2a" opacity="0.4" filter="url(#softBlur)" transform="rotate(-15 200 180)" />
        {/* Lower glow sweep */}
        <ellipse cx="800" cy="820" rx="300" ry="100" fill="#2a2a2a" opacity="0.35" filter="url(#softBlur)" transform="rotate(-15 800 820)" />
        {/* Edge glint top-left */}
        <path d="M-50 320 Q100 240 300 280 L300 300 Q100 260 -50 340 Z" fill="#aaa" opacity="0.08" />
        {/* Edge glint bottom-right */}
        <path d="M700 760 Q850 700 1050 710 L1050 730 Q850 720 700 782 Z" fill="#aaa" opacity="0.07" />
      </svg>
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Icon path={ICONS.server} size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">BlizzByte</h1>
            <p className="text-white/40 text-sm mt-1 font-mono">Finance OS · Admin Portal</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Username</label>
              <input
                value={user}
                onChange={e => { setUser(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="admin"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={pass}
                onChange={e => { setPass(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            {err && <p className="text-red-400 text-xs text-center">{err}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-60 mt-2"
            >
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authenticating…</span> : "Sign In"}
            </button>
          </div>
          <p className="text-center text-white/20 text-xs mt-6">Demo: admin / blizz2026</p>
        </div>
      </motion.div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: ICONS.dashboard },
  { id: "sales", label: "Sales", icon: ICONS.sales },
  { id: "expenses", label: "Expenses", icon: ICONS.expenses },
  { id: "clients", label: "Clients", icon: ICONS.clients },
  { id: "invoices", label: "Invoices", icon: ICONS.invoices },
  { id: "tax", label: "Tax & Profit", icon: ICONS.tax },
  { id: "analytics", label: "Analytics", icon: ICONS.analytics },
  { id: "settings", label: "Settings", icon: ICONS.settings },
];

const Sidebar = ({ page, setPage, onLogout, notifs }) => {
  return (
    <div className="w-60 min-h-screen border-r border-white/8 flex flex-col py-5 shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0e0e0e 0%, #080808 50%, #0c0c0c 100%)" }}>
      {/* Subtle wave reflection on sidebar */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-64 opacity-20" style={{ background: "linear-gradient(135deg, #2a2a2a 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-24 h-48 opacity-15" style={{ background: "linear-gradient(315deg, #222 0%, transparent 60%)" }} />
      </div>
      {/* Logo */}
      <div className="px-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Icon path={ICONS.server} size={17} className="text-white" />
          </div>
          <div>
            <p className="font-black text-white text-sm leading-none">BlizzByte</p>
            <p className="text-white/30 text-xs font-mono">Finance OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={tw(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
              page === item.id
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            )}
          >
            <Icon path={item.icon} size={16} className="shrink-0" />
            {item.label}
            {item.id === "invoices" && notifs > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{notifs}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">Admin</p>
            <p className="text-xs text-white/30 truncate">Owner</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <Icon path={ICONS.logout} size={15} />
          Logout
        </button>
      </div>
    </div>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const Topbar = ({ page, search, setSearch }) => {
  const titles = { dashboard: "Dashboard", sales: "Sales Tracking", expenses: "Expense Management", clients: "Client Records", invoices: "Invoices", tax: "Tax & Profit", analytics: "Analytics", settings: "Settings" };
  return (
    <div className="h-14 border-b border-white/5 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0" style={{ background: "rgba(8,8,8,0.85)" }}>
      <h2 className="font-bold text-white text-base flex-1">{titles[page]}</h2>
      <div className="relative">
        <Icon path={ICONS.search} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-sm text-white placeholder-white/20 w-48 focus:outline-none focus:border-white/20 focus:w-64 transition-all"
        />
      </div>
      <div className="relative">
        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
          <Icon path={ICONS.bell} size={15} />
        </button>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
      </div>
      <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-blue-500/20">
        <Icon path={ICONS.plus} size={12} />
        New
      </button>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage = ({ sales, expenses }) => {
  const fin = calcFinancials(sales, expenses);
  const overdue = sales.filter(s => s.status === "overdue").length;

  const planSales = useMemo(() => {
    const map = {};
    sales.filter(s => s.status === "paid").forEach(s => {
      map[s.plan] = (map[s.plan] || 0) + s.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [sales]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <div className="p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Current Balance" value={fmt(fin.currentBalance)} sub="Starting: $12,500" icon={ICONS.dollar} trend={18.4} gradient="bg-gradient-to-br from-blue-600 to-blue-900" delay={0} />
        <StatCard title="Total Revenue" value={fmt(fin.totalRevenue)} sub="All paid invoices" icon={ICONS.trend_up} trend={12.1} gradient="bg-gradient-to-br from-emerald-600 to-emerald-900" delay={0.05} />
        <StatCard title="Net Profit" value={fmt(fin.netProfit)} sub="Revenue − Expenses" icon={ICONS.analytics} trend={20.3} gradient="bg-gradient-to-br from-violet-600 to-violet-900" delay={0.1} />
        <StatCard title="Total Expenses" value={fmt(fin.totalExpenses)} sub="All costs" icon={ICONS.expenses} trend={-4.2} gradient="bg-gradient-to-br from-orange-600 to-orange-900" delay={0.15} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Payments" value={fmt(fin.pendingRevenue)} sub={`${sales.filter(s => s.status !== "paid").length} invoices`} icon={ICONS.clock} gradient="bg-gradient-to-br from-amber-600 to-amber-900" delay={0.2} />
        <StatCard title="Marketing Costs" value={fmt(fin.marketingCosts)} sub="Ads & promos" icon={ICONS.globe} gradient="bg-gradient-to-br from-pink-600 to-pink-900" delay={0.25} />
        <StatCard title="Est. Tax Owed" value={fmt(fin.estimatedTax)} sub="~21% of revenue" icon={ICONS.tax} gradient="bg-gradient-to-br from-red-600 to-red-900" delay={0.3} />
        <StatCard title="Overdue Invoices" value={overdue} sub="Need attention" icon={ICONS.invoices} trend={-2} gradient="bg-gradient-to-br from-rose-600 to-rose-900" delay={0.35} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" title="Revenue vs Expenses">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="url(#rev)" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="url(#exp)" strokeWidth={2} dot={{ fill: "#f43f5e", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Revenue by Plan">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={planSales} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {planSales.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {planSales.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-white/50">{p.name}</span>
                  </div>
                  <span className="text-xs text-white/70 font-mono">{fmtShort(p.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Monthly Profit + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" title="Monthly Net Profit">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MONTHLY} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="profit" name="Profit" radius={[6, 6, 0, 0]}>
                  {MONTHLY.map((_, i) => <Cell key={i} fill={`rgba(139,92,246,${0.4 + i * 0.1})`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Activity Log">
          <div className="px-4 pb-4 space-y-1">
            {ACTIVITY_LOG.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-start gap-2.5 py-2 border-b border-white/5 last:border-0">
                <div className={tw("w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  a.type === "payment" ? "bg-emerald-500/20 text-emerald-400" :
                  a.type === "alert" ? "bg-red-500/20 text-red-400" :
                  a.type === "expense" ? "bg-orange-500/20 text-orange-400" :
                  "bg-blue-500/20 text-blue-400"
                )}>
                  <Icon path={a.type === "payment" ? ICONS.check : a.type === "alert" ? ICONS.x : ICONS.activity} size={11} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 leading-snug">{a.action}</p>
                  <p className="text-xs text-white/25 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Sales */}
      <GlassCard title="Recent Transactions" action={
        <span className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">View all →</span>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Invoice", "Client", "Plan", "Amount", "Method", "Status", "Date"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 8).map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-blue-400">{s.id}</td>
                  <td className="px-5 py-3 text-white/80 whitespace-nowrap">{s.clientName}</td>
                  <td className="px-5 py-3 text-white/50 whitespace-nowrap">{s.plan}</td>
                  <td className="px-5 py-3 font-mono text-emerald-400 whitespace-nowrap">{fmt(s.amount)}</td>
                  <td className="px-5 py-3 text-white/40 whitespace-nowrap">{s.method}</td>
                  <td className="px-5 py-3"><Badge status={s.status} /></td>
                  <td className="px-5 py-3 text-white/30 whitespace-nowrap text-xs">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── SALES PAGE ───────────────────────────────────────────────────────────────
const SalesPage = ({ sales, search }) => {
  const [filter, setFilter] = useState("all");
  const filtered = sales.filter(s =>
    (filter === "all" || s.status === filter) &&
    (!search || s.clientName.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()) || s.plan.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", val: sales.length, color: "text-white" },
          { label: "Paid", val: sales.filter(s => s.status === "paid").length, color: "text-emerald-400" },
          { label: "Unpaid", val: sales.filter(s => s.status === "unpaid").length, color: "text-amber-400" },
          { label: "Overdue", val: sales.filter(s => s.status === "overdue").length, color: "text-red-400" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            <p className={tw("text-3xl font-black mt-1", s.color)}>{s.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "paid", "unpaid", "overdue"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={tw("px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              filter === f ? "bg-blue-600 text-white" : "bg-white/5 text-white/40 hover:text-white/70 border border-white/10")}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="ml-auto text-xs text-white/30 self-center">{filtered.length} results</div>
      </div>

      {/* Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Invoice", "Client", "Discord", "Plan", "Location", "Amount", "Method", "Status", "Date", "Renewal"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                  <td className="px-4 py-3 font-mono text-xs text-blue-400">{s.id}</td>
                  <td className="px-4 py-3 text-white/80 whitespace-nowrap">{s.clientName}</td>
                  <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{s.discord}</td>
                  <td className="px-4 py-3"><span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg px-2 py-0.5 text-xs font-medium whitespace-nowrap">{s.plan}</span></td>
                  <td className="px-4 py-3 text-white/50 text-xs">{s.location}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400 whitespace-nowrap">{fmt(s.amount)}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{s.method}</td>
                  <td className="px-4 py-3"><Badge status={s.status} /></td>
                  <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">{s.date}</td>
                  <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">{s.renewal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── EXPENSES PAGE ────────────────────────────────────────────────────────────
const ExpensesPage = ({ expenses, search }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: "Server Costs", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
  const [list, setList] = useState(expenses);
  const [filter, setFilter] = useState("all");

  const categories = ["Server Costs", "Marketing", "Domain & CDN", "Staff", "Tax", "Refund", "Miscellaneous"];
  const catTotals = categories.map(c => ({ name: c, value: list.filter(e => e.category === c).reduce((a, e) => a + e.amount, 0) })).filter(c => c.value > 0);
  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  const filtered = list.filter(e =>
    (filter === "all" || e.category === filter) &&
    (!search || e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))
  );

  const addExpense = () => {
    if (!form.description || !form.amount) return;
    setList(prev => [{ ...form, id: `e${prev.length + 1}`, amount: parseFloat(form.amount), recurring: false }, ...prev]);
    setForm({ category: "Server Costs", description: "", amount: "", date: new Date().toISOString().split("T")[0] });
    setShowAdd(false);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {catTotals.slice(0, 4).map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">{c.name}</p>
            <p className="text-2xl font-bold text-white mt-1 font-mono">{fmtShort(c.value)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2" title="Expense Breakdown">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catTotals} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Amount" radius={[0, 6, 6, 0]}>
                  {catTotals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Category Share">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {catTotals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap flex-1">
          {["all", ...categories].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={tw("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === f ? "bg-blue-600 text-white" : "bg-white/5 text-white/40 hover:text-white/70 border border-white/10")}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
          <Icon path={ICONS.plus} size={12} />Add Expense
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <GlassCard className="border-blue-500/30">
              <div className="p-5 grid grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                  {categories.map(c => <option key={c} value={c} className="bg-[#0d1117]">{c}</option>)}
                </select>
                <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 lg:col-span-2" />
                <input placeholder="Amount $" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50" />
                <button onClick={addExpense} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg py-2 text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  Add
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Category", "Description", "Amount", "Date", "Recurring"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">{e.category}</span>
                  </td>
                  <td className="px-5 py-3 text-white/70">{e.description}</td>
                  <td className="px-5 py-3 font-mono text-red-400">{fmt(e.amount)}</td>
                  <td className="px-5 py-3 text-white/30 text-xs">{e.date}</td>
                  <td className="px-5 py-3">
                    {e.recurring ? <span className="text-xs text-cyan-400">● Recurring</span> : <span className="text-xs text-white/20">One-time</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── CLIENTS PAGE ─────────────────────────────────────────────────────────────
const ClientsPage = ({ sales, search }) => {
  const clientMap = useMemo(() => {
    const map = {};
    sales.forEach(s => {
      if (!map[s.clientId]) {
        map[s.clientId] = { ...CLIENTS.find(c => c.id === s.clientId), total: 0, count: 0, unpaid: 0, plans: new Set(), lastDate: s.date };
      }
      const c = map[s.clientId];
      c.count++;
      if (s.status === "paid") c.total += s.amount;
      else c.unpaid += s.amount;
      c.plans.add(s.plan);
      if (s.date > c.lastDate) c.lastDate = s.date;
    });
    return Object.values(map);
  }, [sales]);

  const filtered = clientMap.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.discord?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Clients", val: clientMap.length, color: "text-white" },
          { label: "Total Revenue", val: fmt(clientMap.reduce((a, c) => a + c.total, 0)), color: "text-emerald-400" },
          { label: "Pending Payments", val: fmt(clientMap.reduce((a, c) => a + c.unpaid, 0)), color: "text-amber-400" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            <p className={tw("text-2xl font-bold mt-1", s.color)}>{s.val}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/8 transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                {c.name.charAt(0)}
              </div>
              <Badge status={c.unpaid > 0 ? "unpaid" : "paid"} />
            </div>
            <h3 className="font-semibold text-white">{c.name}</h3>
            <p className="text-xs text-white/40 mt-0.5">{c.discord}</p>
            <p className="text-xs text-white/30 flex items-center gap-1 mt-1"><Icon path={ICONS.globe} size={11} />{c.location} · {c.email}</p>
            <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-white/30">Total Spent</p>
                <p className="text-sm font-mono text-emerald-400 font-semibold">{fmt(c.total)}</p>
              </div>
              <div>
                <p className="text-xs text-white/30">Invoices</p>
                <p className="text-sm text-white font-semibold">{c.count}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {[...c.plans].slice(0, 3).map(p => (
                <span key={p} className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded px-1.5 py-0.5">{p}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── INVOICES PAGE ────────────────────────────────────────────────────────────
const InvoicesPage = ({ sales, search }) => {
  const [invoices, setInvoices] = useState(sales);
  const [filter, setFilter] = useState("all");

  const toggle = (id) => {
    setInvoices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "paid" ? "unpaid" : "paid" } : s));
  };

  const filtered = invoices.filter(s =>
    (filter === "all" || s.status === filter) &&
    (!search || s.clientName.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Invoices", v: invoices.length, c: "text-white" },
          { l: "Total Value", v: fmt(invoices.reduce((a, s) => a + s.amount, 0)), c: "text-white" },
          { l: "Collected", v: fmt(invoices.filter(s => s.status === "paid").reduce((a, s) => a + s.amount, 0)), c: "text-emerald-400" },
          { l: "Outstanding", v: fmt(invoices.filter(s => s.status !== "paid").reduce((a, s) => a + s.amount, 0)), c: "text-amber-400" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">{s.l}</p>
            <p className={tw("text-2xl font-bold mt-1", s.c)}>{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {["all", "paid", "unpaid", "overdue"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={tw("px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                filter === f ? "bg-blue-600 text-white" : "bg-white/5 text-white/40 hover:text-white/70 border border-white/10")}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-2 text-xs text-white/40 border border-white/10 hover:border-white/20 hover:text-white/70 rounded-lg px-3 py-1.5 transition-all">
          <Icon path={ICONS.download} size={12} />Export CSV
        </button>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Invoice", "Client", "Plan", "Amount", "Method", "Status", "Date", "Due", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-blue-400">{s.id}</td>
                  <td className="px-4 py-3 text-white/80 whitespace-nowrap">{s.clientName}</td>
                  <td className="px-4 py-3 text-white/50 whitespace-nowrap text-xs">{s.plan}</td>
                  <td className="px-4 py-3 font-mono text-white font-semibold whitespace-nowrap">{fmt(s.amount)}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{s.method}</td>
                  <td className="px-4 py-3"><Badge status={s.status} /></td>
                  <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">{s.date}</td>
                  <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">{s.renewal}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggle(s.id)}
                        className={tw("text-xs px-2 py-1 rounded-lg border transition-all",
                          s.status === "paid" ? "text-amber-400 border-amber-500/30 hover:bg-amber-500/10" : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10")}>
                        {s.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
                      </button>
                      <button className="text-xs px-2 py-1 rounded-lg border border-white/10 text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
                        <Icon path={ICONS.download} size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── TAX PAGE ─────────────────────────────────────────────────────────────────
const TaxPage = ({ sales, expenses }) => {
  const fin = calcFinancials(sales, expenses);
  const taxRate = 0.21;
  const selfEmployTax = fin.netProfit * 0.153;
  const totalTax = fin.netProfit > 0 ? fin.netProfit * (taxRate + 0.153) : 0;
  const afterTax = fin.netProfit - totalTax;

  const monthlyProfit = MONTHLY.map(m => ({ ...m, tax: m.profit * taxRate, afterTax: m.profit * (1 - taxRate) }));

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { l: "Gross Revenue", v: fmt(fin.totalRevenue), c: "text-white", sub: "All paid income" },
          { l: "Total Expenses", v: fmt(fin.totalExpenses), c: "text-red-400", sub: "Deductible costs" },
          { l: "Net Profit", v: fmt(fin.netProfit), c: "text-emerald-400", sub: "Pre-tax earnings" },
          { l: "Income Tax (21%)", v: fmt(fin.estimatedTax), c: "text-amber-400", sub: "Federal estimate" },
          { l: "Self-Employ Tax", v: fmt(selfEmployTax), c: "text-orange-400", sub: "15.3% SE tax" },
          { l: "After-Tax Profit", v: fmt(afterTax > 0 ? afterTax : 0), c: "text-cyan-400", sub: "Take-home earnings" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider">{s.l}</p>
            <p className={tw("text-2xl font-bold font-mono mt-1", s.c)}>{s.v}</p>
            <p className="text-xs text-white/25 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <GlassCard title="Monthly Profit vs Tax vs After-Tax">
        <div className="px-5 pb-5">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyProfit} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <Bar dataKey="profit" name="Gross Profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tax" name="Est. Tax" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="afterTax" name="After-Tax" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Tax Summary" className="max-w-xl">
        <div className="p-5 space-y-3">
          {[
            ["Gross Business Revenue", fmt(fin.totalRevenue)],
            ["Deductible Expenses", `- ${fmt(fin.totalExpenses)}`],
            ["Taxable Net Income", fmt(fin.netProfit)],
            ["Federal Income Tax (21%)", `- ${fmt(fin.estimatedTax)}`],
            ["Self-Employment Tax (15.3%)", `- ${fmt(selfEmployTax)}`],
            ["Total Tax Liability", `- ${fmt(totalTax)}`],
            ["Net After-Tax Earnings", fmt(Math.max(0, afterTax))],
          ].map(([label, val], i) => (
            <div key={label} className={tw("flex items-center justify-between py-2", i < 6 ? "border-b border-white/5" : "pt-2")}>
              <span className={tw("text-sm", i === 6 ? "text-white font-bold" : "text-white/50")}>{label}</span>
              <span className={tw("font-mono text-sm font-semibold",
                i === 6 ? "text-cyan-400 text-base" :
                val.startsWith("-") ? "text-red-400" : "text-white/70")}>{val}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = ({ sales, expenses }) => {
  const categoryRevenue = useMemo(() => {
    const map = {};
    sales.filter(s => s.status === "paid").forEach(s => {
      map[s.category] = (map[s.category] || 0) + s.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const topClients = useMemo(() => {
    const map = {};
    sales.filter(s => s.status === "paid").forEach(s => {
      map[s.clientName] = (map[s.clientName] || 0) + s.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, total]) => ({ name, total }));
  }, [sales]);

  const topPlans = useMemo(() => {
    const map = {};
    sales.forEach(s => { map[s.plan] = (map[s.plan] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([plan, count]) => ({ plan, count }));
  }, [sales]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Monthly Revenue Trend">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Revenue by Category">
          <div className="px-5 pb-5 flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryRevenue.map((c, i) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{c.name}</span>
                    <span className="text-white/80 font-mono">{fmtShort(c.value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${(c.value / categoryRevenue.reduce((a, x) => a + x.value, 0)) * 100}%`, backgroundColor: COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Top Paying Clients">
          <div className="p-5 space-y-3">
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-white/20 w-5">#{i + 1}</span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center text-xs font-bold text-white">
                  {c.name.charAt(0)}
                </div>
                <span className="flex-1 text-sm text-white/70">{c.name}</span>
                <div className="text-right">
                  <p className="font-mono text-sm text-emerald-400 font-semibold">{fmt(c.total)}</p>
                </div>
                <div className="w-24 h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{ width: `${(c.total / topClients[0].total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Best Selling Plans">
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topPlans} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="plan" type="category" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Sales" radius={[0, 6, 6, 0]}>
                  {topPlans.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Year-over-Year Comparison">
        <div className="px-5 pb-5">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtShort} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [vals, setVals] = useState({ company: "BlizzByte", currency: "USD", timezone: "UTC-5", taxRate: "21", notifications: true, darkMode: true, twoFactor: false });
  const set = (k, v) => setVals(p => ({ ...p, [k]: v }));
  const Toggle = ({ val, onToggle }) => (
    <button onClick={onToggle} className={tw("w-11 h-6 rounded-full relative transition-all duration-200", val ? "bg-blue-600" : "bg-white/10")}>
      <div className={tw("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200", val ? "left-6" : "left-1")} />
    </button>
  );

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <GlassCard title="Business Settings">
        <div className="p-5 space-y-4">
          {[
            { label: "Company Name", key: "company", type: "text" },
            { label: "Currency", key: "currency", type: "select", opts: ["USD", "EUR", "GBP"] },
            { label: "Timezone", key: "timezone", type: "select", opts: ["UTC-8", "UTC-7", "UTC-6", "UTC-5", "UTC+0", "UTC+1"] },
            { label: "Tax Rate (%)", key: "taxRate", type: "number" },
          ].map(f => (
            <div key={f.key} className="flex items-center justify-between">
              <label className="text-sm text-white/60">{f.label}</label>
              {f.type === "select" ? (
                <select value={vals[f.key]} onChange={e => set(f.key, e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50">
                  {f.opts.map(o => <option key={o} value={o} className="bg-[#0d1117]">{o}</option>)}
                </select>
              ) : (
                <input type={f.type} value={vals[f.key]} onChange={e => set(f.key, e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50 text-right w-40" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Preferences">
        <div className="p-5 space-y-4">
          {[
            { l: "Email Notifications", k: "notifications" },
            { l: "Dark Mode", k: "darkMode" },
            { l: "Two-Factor Authentication", k: "twoFactor" },
          ].map(p => (
            <div key={p.k} className="flex items-center justify-between">
              <span className="text-sm text-white/60">{p.l}</span>
              <Toggle val={vals[p.k]} onToggle={() => set(p.k, !vals[p.k])} />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Admin Account">
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white">A</div>
            <div>
              <p className="text-sm text-white font-semibold">Admin</p>
              <p className="text-xs text-white/40">admin@blizzbyte.net · Owner</p>
            </div>
            <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-2 py-0.5">Owner</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm py-2 rounded-lg transition-all">Change Password</button>
            <button className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm py-2 rounded-lg transition-all">Export Data</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const overdue = SALES.filter(s => s.status === "overdue").length;

  const pages = {
    dashboard: <DashboardPage sales={SALES} expenses={EXPENSES} />,
    sales: <SalesPage sales={SALES} search={search} />,
    expenses: <ExpensesPage expenses={EXPENSES} search={search} />,
    clients: <ClientsPage sales={SALES} search={search} />,
    invoices: <InvoicesPage sales={SALES} search={search} />,
    tax: <TaxPage sales={SALES} expenses={EXPENSES} />,
    analytics: <AnalyticsPage sales={SALES} expenses={EXPENSES} />,
    settings: <SettingsPage />,
  };

  if (!auth) return <LoginPage onLogin={() => setAuth(true)} />;

  return (
    <div className="min-h-screen text-white font-sans flex" style={{ backgroundColor: "#080808" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileSidebar(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar desktop */}
      <div className="hidden lg:block shrink-0">
        <Sidebar page={page} setPage={p => { setPage(p); setSearch(""); }} onLogout={() => setAuth(false)} notifs={overdue} />
      </div>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-40 lg:hidden">
            <Sidebar page={page} setPage={p => { setPage(p); setSearch(""); setMobileSidebar(false); }} onLogout={() => setAuth(false)} notifs={overdue} />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Main content area with wave background */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        {/* Wave SVG background — matches uploaded dark ribbon image */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ left: "240px" }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d0d0d" />
                <stop offset="100%" stopColor="#080808" />
              </linearGradient>
              <linearGradient id="ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#0a0a0a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#111111" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="topShine" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#333" stopOpacity="0" />
                <stop offset="40%" stopColor="#444" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#555" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3a3a3a" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="bottomShine" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#222" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#444" stopOpacity="0.35" />
              </linearGradient>
              <filter id="blur1"><feGaussianBlur stdDeviation="18" /></filter>
              <filter id="blur2"><feGaussianBlur stdDeviation="10" /></filter>
            </defs>
            {/* Base */}
            <rect width="1200" height="900" fill="url(#bgBase)" />
            {/* Upper ambient glow */}
            <ellipse cx="350" cy="150" rx="500" ry="180" fill="#1e1e1e" opacity="0.5" filter="url(#blur1)" transform="rotate(-18 350 150)" />
            {/* Main dark ribbon swoosh */}
            <path d="M-100 320 Q150 140 450 260 Q720 360 1300 180 L1300 440 Q720 620 450 500 Q150 380 -100 560 Z" fill="url(#ribbon)" />
            {/* Top edge highlight of ribbon */}
            <path d="M-100 320 Q150 140 450 260 Q720 360 1300 180 L1300 215 Q720 395 450 295 Q150 175 -100 355 Z" fill="url(#topShine)" opacity="0.7" />
            {/* Bottom edge highlight */}
            <path d="M-100 520 Q150 350 450 470 Q720 590 1300 410 L1300 440 Q720 620 450 500 Q150 380 -100 560 Z" fill="url(#bottomShine)" opacity="0.6" />
            {/* Lower ambient glow */}
            <ellipse cx="900" cy="750" rx="420" ry="150" fill="#1a1a1a" opacity="0.45" filter="url(#blur1)" transform="rotate(-18 900 750)" />
            {/* Subtle edge glint top-left */}
            <path d="M-100 295 Q50 230 230 252 L230 268 Q50 246 -100 312 Z" fill="#888" opacity="0.06" />
            {/* Subtle edge glint bottom-right */}
            <path d="M970 565 Q1100 510 1300 508 L1300 524 Q1100 526 970 582 Z" fill="#888" opacity="0.055" />
          </svg>
          {/* Vignette */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.55) 100%)" }} />
        </div>

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 backdrop-blur-sm relative z-10" style={{ background: "rgba(8,8,8,0.9)" }}>
          <button onClick={() => setMobileSidebar(v => !v)} className="text-white/50 hover:text-white/80">
            <Icon path={ICONS.menu} size={20} />
          </button>
          <span className="font-bold text-white text-sm flex-1">BlizzByte Finance OS</span>
        </div>
        <Topbar page={page} search={search} setSearch={setSearch} />

        <div className="flex-1 overflow-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
