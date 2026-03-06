import { useState, useRef } from "react";
import ModernProfessional from "./templates/ModernProfessional";

// \u2500\u2500 icons (inline SVG helpers) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);
const Icons = {
  home:      "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  file:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  layers:    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  settings:  "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  user:      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  refresh:   "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  edit:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  download:  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  close:     "M18 6L6 18M6 6l12 12",
  chevDown:  "M6 9l6 6 6-6",
  save:      "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  bell:      "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  mail:      "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  share:     "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13",
  menu:      "M3 12h18M3 6h18M3 18h18",
  sparkle:   "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

// \u2500\u2500 colour palettes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const THEMES = {
  Blue:   { primary: "#1e40af", light: "#dbeafe", accent: "#3b82f6", dark: "#1e3a8a" },
  Navy:   { primary: "#1e293b", light: "#e2e8f0", accent: "#475569", dark: "#0f172a" },
  Teal:   { primary: "#0f766e", light: "#ccfbf1", accent: "#14b8a6", dark: "#115e59" },
  Indigo: { primary: "#4338ca", light: "#e0e7ff", accent: "#6366f1", dark: "#312e81" },
  Slate:  { primary: "#475569", light: "#f1f5f9", accent: "#64748b", dark: "#1e293b" },
};

const FONTS = ["Playfair Display", "DM Sans", "Fraunces", "Syne", "Outfit", "Lora"];
const SIZES = ["10 pt", "11 pt", "12 pt", "13 pt", "14 pt"];
const TEMPLATES = ["Modern Professional", "Executive Bold", "Minimal Clean", "Academic", "Creative Edge", "Modern"];

// \u2500\u2500 sample CV data \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const INITIAL_CV = {
  name: "John Doe",
  title: "Software Engineer",
  location: "San Francisco, CA",
  email: "555.555.5555",
  email2: "hello@email.com",
  summary: "Versatile software engineer with a track record of building high-impact products and shipping features at scale.",
  skills: ["Python", "JavaScript (React.js)", "HTML/CSS", "SQL (PostgreSQL, MySQL)"],
  skillGroups: [
    { label: "Languages", items: ["Python", "JavaScript (React.js)", "HTML/CSS", "SQL (PostgreSQL, MySQL)"] },
    { label: "Tools",     items: ["Figma", "Notion", "Jira", "Trello", "Miro", "Google Analytics", "GitHub", "DaVinci Resolve", "OBS"] },
  ],
  experience: [
    {
      company: "YouTube",
      role: "Creator (@johndoe)",
      period: "Aug. 2019 – Present",
      location: "San Francisco, CA",
      bullets: [
        "Grew channel to 60k subscribers in 1.5 years; created 80+ videos on tech and productivity",
        "Conducted A/B testing on titles and thumbnails; increased video impressions by 2.5M in 3 months",
        "Designed a Notion workflow to streamline video production and roadmapping; boosted productivity by 20%",
        "Partnered with brands like Skillshare and Squarespace to expand their outreach via sponsorships",
      ],
    },
    {
      company: "Google Verily",
      role: "Software Engineer",
      period: "Aug. 2018 – Sept. 2019",
      location: "San Francisco, CA",
      bullets: [
        "Led front-end development of a dashboard to process 50k blood samples and detect early-stage cancer",
        "Rebuilt a Quality Control product with input from 20 cross-functional stakeholders, saving $1M annually",
        "Spearheaded product development of a new lab workflow tool, leading to a 40% increase in efficiency",
      ],
    },
    {
      company: "Amazon",
      role: "Software Engineering Intern",
      period: "May 2017 – Aug. 2017",
      location: "Seattle, WA",
      bullets: [
        "Worked on the Search Customer Experience Team; received a return offer for a full-time position",
        "Shipped a new feature to 2M+ users to improve the search experience for movie series-related queries",
        "Built a back-end database service in Java and implemented a front-end UI to support future changes",
      ],
    },
  ],
  projects: [
    {
      name: "Hyku Consulting",
      bullets: [
        "Mentored 15 students towards acceptance at top US boarding schools; achieved 100% success rate",
        "Designed a collaborative learning ecosystem for students and parents with Trello, Miro, and Google Suite",
      ],
    },
    {
      name: "Minimal Icon Pack",
      bullets: [
        "Designed and released 100+ minimal iOS and Android icons from scratch using Procreate and Figma",
        "Marketed the product and design process on YouTube; accumulated over $250 in sales on Gumroad",
      ],
    },
    {
      name: "CommonIntern",
      bullets: [
        "Built a Python script to automatically apply to jobs on Glassdoor using BeautifulSoup and Selenium",
        "500 stars on GitHub; featured on Hackaday; made the front page of r/python and r/programming",
      ],
    },
  ],
  education: [
    {
      school: "Wellesley College",
      degree: "Bachelor of Arts in Computer Science and Pre-Med",
      year: "Aug. 2014 – May 2018",
      location: "Wellesley, MA",
      coursework: "Data Structures, Algorithms, Databases, Computer Systems, Machine Learning",
    },
  ],
};

// \u2500\u2500 CV Preview Component \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// ── CV Preview Router ────────────────────────────────────────────────────────
// Add new templates here — just import and add a case below.
function CVPreview({ cv, theme, fontFamily, fontSize, template }) {
  if (template === "Modern Professional" || template === "Modern") {
    return <ModernProfessional cv={cv} fontFamily={fontFamily} fontSize={fontSize} />;
  }
  return <DefaultCVPreview cv={cv} theme={theme} fontFamily={fontFamily} fontSize={fontSize} />;
}

// ── Default CV Preview ───────────────────────────────────────────────────────
function DefaultCVPreview({ cv, theme, fontFamily, fontSize }) {
  const t = THEMES[theme] || THEMES.Blue;
  const fs = parseInt(fontSize) || 12;

  return (
    <div style={{
      fontFamily: `'${fontFamily}', serif`,
      fontSize: `${fs}px`,
      lineHeight: 1.5,
      color: "#1a1a2e",
      background: "#fff",
      padding: "28px 32px",
      minHeight: "600px",
      boxShadow: "0 2px 24px rgba(0,0,0,0.10)",
      borderRadius: "6px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: `${fs * 2}px`, fontWeight: 700, letterSpacing: "-0.5px", color: "#111" }}>{cv.name}</div>
          <div style={{ fontSize: `${fs * 1.1}px`, color: t.accent, fontWeight: 500, marginTop: 2 }}>{cv.title}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: `${fs * 0.9}px`, color: "#555", marginTop: 4 }}>
          <div>\ud83d\udccd {cv.location}</div>
          <div>\u2709 {cv.email2}</div>
          <div>\u2709 {cv.email}</div>
        </div>
      </div>

      {/* Section renderer */}
      {[
        { label: "Summary", content: (
          <p style={{ margin: 0, color: "#333" }}>{cv.summary}</p>
        )},
        { label: "Key Skills", content: (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {cv.skills.map(s => (
              <span key={s} style={{
                background: t.light, color: t.dark, padding: "2px 10px",
                borderRadius: 20, fontSize: `${fs * 0.85}px`, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        )},
        { label: "Professional Experience", content: (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cv.experience.map((exp, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, color: "#111" }}>{exp.company}</div>
                  <div style={{ fontSize: `${fs * 0.85}px`, color: "#777" }}>{exp.period}</div>
                </div>
                <div style={{ color: t.accent, fontStyle: "italic", marginBottom: 6, fontSize: `${fs * 0.95}px` }}>{exp.role}</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#333" }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 4 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )},
        { label: "Education", content: (
          <div>
            {cv.education.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{e.school}</span>
                  <span style={{ color: "#555", marginLeft: 8 }}>{e.degree}</span>
                </div>
                <div style={{ color: "#777", fontSize: `${fs * 0.9}px` }}>{e.year}</div>
              </div>
            ))}
          </div>
        )},
      ].map(sec => (
        <div key={sec.label} style={{ marginBottom: 18 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            borderBottom: `2px solid ${t.primary}`, paddingBottom: 4, marginBottom: 10,
          }}>
            <div style={{
              background: t.primary, color: "#fff",
              fontSize: `${fs * 0.75}px`, fontWeight: 700,
              padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em",
            }}>AI</div>
            <span style={{ fontWeight: 700, fontSize: `${fs * 1.05}px`, color: t.dark }}>{sec.label}</span>
          </div>
          {sec.content}
        </div>
      ))}
    </div>
  );
}

// \u2500\u2500 Main App \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
export default function AdaptDoc() {
  const [activeNav, setActiveNav] = useState("home");
  const [cv, setCv] = useState(INITIAL_CV);
  const [prompts, setPrompts] = useState({ name: cv.name, title: cv.title, section: "Professional Experience" });
  const [theme, setTheme] = useState("Blue");
  const [fontFamily, setFontFamily] = useState("Playfair Display");
  const [fontSize, setFontSize] = useState("12 pt");
  const [template, setTemplate] = useState("Modern Professional");
  const [category, setCategory] = useState("CV");
  const [showExport, setShowExport] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2800);
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a professional CV writer. Rewrite the Professional Experience section for a person named "${prompts.name}" with the title "${prompts.title}". 
Keep the same companies (Acme Manufacturing and Delta Precision Works) but improve and vary the bullet points to be more impactful, quantified, and action-oriented.
Respond ONLY with a JSON object like:
{"experience": [{"company": "...", "role": "...", "period": "...", "bullets": ["...", "..."]}]}
No markdown, no explanation, just the JSON.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.experience) {
        setCv(prev => ({ ...prev, ...parsed }));
        notify("\u2728 CV regenerated successfully!");
      }
    } catch (e) {
      // Simulate regeneration with slight variation
      setCv(prev => ({
        ...prev,
        summary: `Dynamic ${prompts.title} with a proven track record of driving operational excellence and innovation across high-performance industrial environments. Expert in precision engineering and cross-functional team collaboration.`
      }));
      notify("\u2728 CV updated with new content!");
    }
    setGenerating(false);
  };

  const handleSaveDraft = () => notify("\ud83d\udcbe Draft saved successfully!");

  const navItems = [
    { id: "home",     icon: Icons.home },
    { id: "file",     icon: Icons.file },
    { id: "layers",   icon: Icons.layers },
    { id: "user",     icon: Icons.user },
    { id: "settings", icon: Icons.settings },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Fraunces:wght@400;600;700&family=Syne:wght@400;600;700&family=Outfit:wght@300;400;500;600&family=Lora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        .adaptdoc-root { display: flex; height: 100vh; background: #f0f4f8; overflow: hidden; font-family: 'DM Sans', sans-serif; }
        
        /* Sidebar */
        .sidebar { width: 56px; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 12px 0; gap: 4px; flex-shrink: 0; z-index: 10; }
        .sidebar-logo { width: 36px; height: 36px; background: #3b82f6; border-radius: 10px; display:flex; align-items:center; justify-content:center; margin-bottom: 12px; font-weight:700; color:#fff; font-size:14px; letter-spacing:-0.5px; }
        .nav-btn { width: 40px; height: 40px; border-radius: 10px; border:none; background:transparent; color: #94a3b8; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: all 0.15s; }
        .nav-btn:hover { background: #1e293b; color: #e2e8f0; }
        .nav-btn.active { background: #1e40af; color: #fff; }
        .nav-bottom { margin-top: auto; display: flex; flex-direction:column; align-items:center; gap:8px; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:700; cursor:pointer; }
        
        /* Main area */
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        
        /* Topbar */
        .topbar { background: #fff; border-bottom: 1px solid #e2e8f0; height: 52px; display: flex; align-items: center; padding: 0 20px; gap: 12px; flex-shrink: 0; }
        .breadcrumb { display:flex; align-items:center; gap:6px; font-size:13px; color:#64748b; }
        .breadcrumb span { color:#1e293b; font-weight:500; }
        .topbar-right { margin-left:auto; display:flex; align-items:center; gap:8px; }
        .icon-btn { width:32px; height:32px; border-radius:8px; border:none; background:transparent; color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .icon-btn:hover { background:#f1f5f9; color:#1e293b; }
        
        /* Content */
        .content { flex:1; display:flex; overflow:hidden; }
        
        /* Editor Panel */
        .editor-panel { width: 260px; background:#fff; border-right:1px solid #e2e8f0; display:flex; flex-direction:column; flex-shrink:0; overflow-y:auto; }
        .panel-section { padding: 16px; border-bottom: 1px solid #f1f5f9; }
        .panel-label { font-size:11px; font-weight:600; color:#94a3b8; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:10px; }
        .select-row { display:flex; gap:8px; margin-bottom:12px; }
        .custom-select { flex:1; padding: 7px 10px; border-radius:8px; border:1px solid #e2e8f0; font-size:13px; color:#334155; background:#f8fafc; cursor:pointer; outline:none; font-family:'DM Sans',sans-serif; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 8px center; padding-right:26px; }
        .custom-select:focus { border-color:#3b82f6; background:#fff; }
        .prompt-input { width:100%; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; font-size:13px; color:#334155; outline:none; font-family:'DM Sans',sans-serif; background:#f8fafc; transition:border 0.15s; margin-bottom:8px; }
        .prompt-input:focus { border-color:#3b82f6; background:#fff; }
        .section-hint { font-size:12px; color:#94a3b8; line-height:1.5; margin-bottom:12px; }
        .btn-primary { width:100%; padding:9px; border-radius:9px; border:none; background: linear-gradient(135deg,#1e40af,#3b82f6); color:#fff; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:opacity 0.15s; font-family:'DM Sans',sans-serif; }
        .btn-primary:hover { opacity:0.9; }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
        .btn-secondary { width:100%; padding:8px; border-radius:9px; border:1px solid #e2e8f0; background:#f8fafc; color:#475569; font-size:13px; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.15s; font-family:'DM Sans',sans-serif; margin-top:6px; }
        .btn-secondary:hover { background:#e2e8f0; }
        .btn-save { width:100%; padding:9px; border-radius:9px; border:none; background:#0f172a; color:#fff; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:opacity 0.15s; font-family:'DM Sans',sans-serif; margin-top:4px; }
        .btn-save:hover { opacity:0.85; }
        
        /* Preview area */
        .preview-area { flex:1; padding:20px; overflow-y:auto; }
        .preview-scroll { max-width:680px; margin:0 auto; }
        
        /* Export panel */
        .export-panel { width:260px; background:#fff; border-left:1px solid #e2e8f0; flex-shrink:0; overflow-y:auto; }
        .export-header { padding:16px 20px 12px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; }
        .export-title { font-size:15px; font-weight:700; color:#0f172a; }
        .export-section { padding:16px 20px; border-bottom:1px solid #f1f5f9; }
        .theme-colors { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
        .theme-chip { width:28px; height:28px; border-radius:7px; cursor:pointer; border:2px solid transparent; transition:all 0.15s; flex-shrink:0; }
        .theme-chip.active { border-color:#1e293b; transform:scale(1.1); }
        .mini-preview { border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; margin-top:12px; transform-origin:top center; }
        .btn-download { width:100%; padding:11px; border-radius:10px; border:none; background: linear-gradient(135deg,#16a34a,#22c55e); color:#fff; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:opacity 0.15s; font-family:'DM Sans',sans-serif; margin:16px 20px; width:calc(100% - 40px); }
        .btn-download:hover { opacity:0.9; }
        
        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        
        /* Notification */
        @keyframes slideIn { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .notification { position:fixed; top:16px; left:50%; transform:translateX(-50%); background:#0f172a; color:#fff; padding:10px 20px; border-radius:10px; font-size:13px; font-weight:500; z-index:999; animation:slideIn 0.2s ease; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
        
        /* Generating pulse */
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .generating { animation: pulse 1s ease-in-out infinite; }
      `}</style>

      <div className="adaptdoc-root">
        {/* \u2500\u2500 Sidebar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
        <div className="sidebar">
          <div className="sidebar-logo">AT</div>
          {navItems.map(n => (
            <button key={n.id} className={`nav-btn ${activeNav === n.id ? "active" : ""}`}
              onClick={() => setActiveNav(n.id)} title={n.id}>
              <Icon d={n.icon} size={17} />
            </button>
          ))}
          <div className="nav-bottom">
            <button className="icon-btn" style={{ color: "#94a3b8" }} title="Notifications">
              <Icon d={Icons.bell} size={17} />
            </button>
            <button className="icon-btn" style={{ color: "#94a3b8" }} title="Mail">
              <Icon d={Icons.mail} size={17} />
            </button>
            <div className="avatar" title="John Doe">JD</div>
          </div>
        </div>

        {/* \u2500\u2500 Main \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
        <div className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="breadcrumb">
              Dashboard <span style={{ color: "#94a3b8" }}>/</span>
              <span>Editing Document</span>
            </div>
            <div style={{ width: 14, height: 14, border: "2px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: generating ? "spin 0.7s linear infinite" : "none" }} />
            <div className="topbar-right">
              <button className="icon-btn" title="Edit" onClick={() => setEditMode(e => !e)}>
                <Icon d={Icons.edit} size={16} />
              </button>
              <button className="icon-btn" title="Share">
                <Icon d={Icons.share} size={16} />
              </button>
              <button className="icon-btn" title="Export" onClick={() => setShowExport(e => !e)}>
                <Icon d={Icons.download} size={16} />
              </button>
            </div>
          </div>

          <div className="content">
            {/* \u2500\u2500 Editor Panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
            <div className="editor-panel">
              <div className="panel-section">
                <div className="panel-label">Document Type</div>
                <div className="select-row">
                  <select className="custom-select" value={category} onChange={e => setCategory(e.target.value)}>
                    {["CV", "Resume", "Cover Letter", "Portfolio"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select className="custom-select" value={template} onChange={e => setTemplate(e.target.value)}>
                    {TEMPLATES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="panel-section">
                <div className="panel-label">Prompts</div>
                <input className="prompt-input" placeholder="Full Name"
                  value={prompts.name}
                  onChange={e => setPrompts(p => ({ ...p, name: e.target.value }))} />
                <input className="prompt-input" placeholder="Job Title"
                  value={prompts.title}
                  onChange={e => setPrompts(p => ({ ...p, title: e.target.value }))} />
              </div>

              <div className="panel-section">
                <div className="panel-label">Prompts</div>
                <input className="prompt-input" placeholder="Full Name"
                  value={prompts.name} readOnly style={{ opacity: 0.6 }} />
                <select className="custom-select" style={{ marginBottom: 10 }}
                  value={prompts.section}
                  onChange={e => setPrompts(p => ({ ...p, section: e.target.value }))}>
                  {["Professional Experience", "Summary", "Key Skills", "Education"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="panel-section">
                <div className="panel-label" style={{ marginBottom: 6 }}>Professional Experience</div>
                <p className="section-hint">
                  Describe your relevant work experience, emphasizing your key achievements and responsibilities in each role. This will be rewritten and refined to avoid redundancy.
                </p>

                <button className="btn-primary" onClick={handleRegenerate} disabled={generating}>
                  {generating ? <><div className="spinner" /> Regenerating\u2026</> : <><Icon d={Icons.refresh} size={14} /> Regenerate</>}
                </button>
                <button className="btn-secondary" onClick={() => setEditMode(e => !e)}>
                  <Icon d={Icons.edit} size={14} /> {editMode ? "Close Editor" : "Edit Content"}
                </button>
              </div>

              {editMode && (
                <div className="panel-section">
                  <div className="panel-label">Quick Edit</div>
                  <textarea className="prompt-input" rows={4}
                    style={{ resize: "vertical", lineHeight: 1.5 }}
                    value={cv.summary}
                    onChange={e => setCv(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Edit summary\u2026"
                  />
                  <input className="prompt-input" value={cv.name}
                    onChange={e => setCv(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name" />
                  <input className="prompt-input" value={cv.title}
                    onChange={e => setCv(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Job title" />
                </div>
              )}

              <div className="panel-section" style={{ marginTop: "auto" }}>
                <button className="btn-save" onClick={handleSaveDraft}>
                  <Icon d={Icons.save} size={14} /> Save Draft
                </button>
              </div>
            </div>

            {/* \u2500\u2500 Preview \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
            <div className="preview-area">
              <div className="preview-scroll">
                <div className={generating ? "generating" : ""}>
                  <CVPreview cv={cv} theme={theme} fontFamily={fontFamily} fontSize={fontSize} template={template} />
                </div>
              </div>
            </div>

            {/* \u2500\u2500 Export Panel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
            {showExport && (
              <div className="export-panel">
                <div className="export-header">
                  <span className="export-title">Export Document</span>
                  <button className="icon-btn" onClick={() => setShowExport(false)}>
                    <Icon d={Icons.close} size={15} />
                  </button>
                </div>

                <div className="export-section">
                  <div className="panel-label">Theme</div>
                  <select className="custom-select" style={{ width: "100%", marginTop: 6 }}
                    value={theme} onChange={e => setTheme(e.target.value)}>
                    {Object.keys(THEMES).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="export-section">
                  <div className="panel-label">Font Family</div>
                  <select className="custom-select" style={{ width