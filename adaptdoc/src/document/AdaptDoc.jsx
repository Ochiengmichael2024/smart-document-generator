import React, { useState } from "react";


const SIDEBAR_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "documents", icon: "📄", label: "Documents" },
  { id: "create", icon: "✦", label: "Create Document" },
  { id: "templates", icon: "◧", label: "Templates" },
  { id: "settings", icon: "⚙", label: "Settings" },
];


const TEMPLATES = ["Modern Professional", "Classic Elegant", "Minimal Clean", "Creative Bold"];
const CATEGORIES = ["CV", "Cover Letter", "Proposal"];
const THEMES = ["Modern", "Classic", "Minimal", "Bold"];
const FONT_FAMILIES = ["Playfair Display", "Georgia", "Garamond", "Lato"];
const FONT_SIZES = ["10 pt", "11 pt", "12 pt", "14 pt"];
const COLOR_SCHEMES = ["#1e3a5f", "#3b82f6", "#6366f1", "#0f766e", "#64748b", "#94a3b8", "#cbd5e1"];


const sampleCV = {
  name: "Michael Ochieng",
  title: "Software Engineer",
  location: "Springfield, IL",
  email1: "ochiengmichael082@gmail.com",
  email2: "michaeochieng@gmail.com",
  summary: `Accomplished Software Engineering with over 8 years of experience specializing in Machine Learning,Artificial Intelligence, and Web Development. Proven ability in quality control and maintenance across various industrial environments.`,
  skills: ["Advanced CNC Operation", "CAD/CAM Design", "Quality Control", "Team Collaboration", "Preventive Maintenance"],
  experience: [
    {
      company: "Acme Manufacturing",
      role: "Lead CNC Machinist",
      period: "Apr 2018 – Present",
      bullets: [
        "Operate advanced CNC machine in high-speed, precision manufacturing environment, programme and optimize G code with ±0.005\" tolerances.",
        "Collaborate with engineering teams on CAD designs for manufacturability, boosted production output by 25%.",
        "Developed and implemented a preventive maintenance schedule that reduced downtime by 30%.",
      ]
    }
  ]
};


function SectionHeader({ label, accent, fontSizeNum }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      borderBottom: `2px solid ${accent}`,
      paddingBottom: 4, marginBottom: 4,
    }}>
      <span style={{
        background: accent, color: "#fff",
        fontSize: fontSizeNum * 0.8, fontWeight: 700,
        padding: "1px 6px", borderRadius: 3,
      }}>AT</span>
      <span style={{ fontWeight: 700, fontSize: fontSizeNum * 1.05, color: "#111" }}>{label}</span>
    </div>
  );
}


function CVPreview({ data, fontFamily, fontSize, accentColor }) {
  const accent = accentColor || "#1e3a5f";
  const fontSizeNum = parseInt(fontSize) || 12;


  return (
    <div style={{
      fontFamily: `'${fontFamily}', Georgia, serif`,
      fontSize: `${fontSizeNum}px`,
      color: "#1a1a2e",
      background: "#fff",
      padding: "28px 32px",
      minHeight: "500px",
      lineHeight: 1.5,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: fontSizeNum * 1.9, fontWeight: 700, color: "#111", letterSpacing: "-0.5px" }}>{data.name}</div>
          <div style={{ fontSize: fontSizeNum * 1.05, color: "#555", marginTop: 2 }}>{data.title}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: fontSizeNum * 0.9, color: "#555" }}>
          <div>{data.location}</div>
          <div style={{ marginTop: 4 }}>✉ {data.email1}</div>
          <div>✉ {data.email2}</div>
        </div>
      </div>


      <SectionHeader label="Summary" accent={accent} fontSizeNum={fontSizeNum} />
      <p style={{ fontSize: fontSizeNum * 0.92, color: "#333", marginBottom: 14, marginTop: 6 }}>{data.summary}</p>


      <SectionHeader label="Key Skills" accent={accent} fontSizeNum={fontSizeNum} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0 14px" }}>
        {data.skills.map((s, i) => (
          <span key={i} style={{
            background: `${accent}15`, color: accent,
            border: `1px solid ${accent}40`, borderRadius: 4,
            padding: "2px 10px", fontSize: fontSizeNum * 0.85,
          }}>{s}</span>
        ))}
      </div>


      <SectionHeader label="Professional Experience" accent={accent} fontSizeNum={fontSizeNum} />
      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>{exp.company}</span>
            <span style={{ fontSize: fontSizeNum * 0.85, color: "#777" }}>{exp.period}</span>
          </div>
          <div style={{ color: accent, fontWeight: 600, fontSize: fontSizeNum * 0.92, marginBottom: 6 }}>{exp.role}</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {exp.bullets.map((b, j) => (
              <li key={j} style={{ fontSize: fontSizeNum * 0.88, color: "#444", marginBottom: 4 }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "7px 10px", borderRadius: 7,
        border: "1px solid #e2e8f0", background: "#f8fafc",
        fontSize: 12, color: "#1e293b", cursor: "pointer"
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}


function InputField({ placeholder, defaultValue }) {
  const [val, setVal] = useState(defaultValue || "");
  return (
    <input value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder} style={{
      width: "100%", padding: "7px 10px", borderRadius: 7, marginBottom: 8,
      border: "1px solid #e2e8f0", background: "#f8fafc",
      fontSize: 12, color: "#1e293b", boxSizing: "border-box", display: "block"
    }} />
  );
}


function Dashboard({ onNavigate }) {
  const docs = [
    { title: "John Doe - CV", template: "Modern Professional", date: "Mar 1, 2026" },
    { title: "Cover Letter - Acme", template: "Classic Elegant", date: "Feb 28, 2026" },
  ];
  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>Dashboard</h2>
      <p style={{ color: "#64748b", marginBottom: 28 }}>Welcome back! Manage your documents below.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        {[["Total Docs", "2"], ["Templates", "4"], ["Exports", "1"]].map(([label, val]) => (
          <div key={label} style={{
            flex: 1, background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px #0001"
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1e3a5f" }}>{val}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontWeight: 700, color: "#1e3a5f" }}>Recent Documents</span>
        <button onClick={() => onNavigate("create")} style={{
          background: "#1e3a5f", color: "#fff", border: "none",
          borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600
        }}>+ New Document</button>
      </div>
      {docs.map((d, i) => (
        <div key={i} style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
          padding: "14px 20px", marginBottom: 10,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, color: "#1e293b" }}>{d.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{d.template} · {d.date}</div>
          </div>
          <button onClick={() => onNavigate("create")} style={{
            background: "#f1f5f9", border: "none", borderRadius: 6,
            padding: "6px 14px", cursor: "pointer", fontSize: 12, color: "#475569"
          }}>Edit</button>
        </div>
      ))}
    </div>
  );
}


function CreateDocument() {
  const [category, setCategory] = useState("CV");
  const [template, setTemplate] = useState("Modern Professional");
  const [theme, setTheme] = useState("Modern");
  const [fontFamily, setFontFamily] = useState("Playfair Display");
  const [fontSize, setFontSize] = useState("12 pt");
  const [accentColor, setAccentColor] = useState("#1e3a5f");


  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Left Panel */}
      <div style={{
        width: 230, background: "#fff", borderRight: "1px solid #e2e8f0",
        padding: "20px 16px", overflowY: "auto", flexShrink: 0
      }}>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
          Dashboard / <span style={{ color: "#1e3a5f", fontWeight: 600 }}>Editing Document</span>
          <span style={{ marginLeft: 6, color: "#94a3b8" }}>↺</span>
        </div>


        <SelectField label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
        <SelectField label="Template" value={template} onChange={setTemplate} options={TEMPLATES} />


        <div style={{ margin: "16px 0 8px", fontWeight: 700, fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Prompts</div>
        <InputField placeholder="Full Name" defaultValue="John Doe" />
        <InputField placeholder="Job Title" defaultValue="Mechanical Engineer" />


        <div style={{ margin: "16px 0 8px", fontWeight: 700, fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Professional Experience</div>
        <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
          Describe your relevant work experience, emphasizing your key achievements and responsibilities in each role.
        </p>


        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button style={{
            flex: 1, background: "#1e3a5f", color: "#fff",
            border: "none", borderRadius: 7, padding: "9px 0",
            cursor: "pointer", fontSize: 12, fontWeight: 600
          }}>↺ Regenerate</button>
          <button style={{
            flex: 1, background: "#f1f5f9", color: "#475569",
            border: "1px solid #e2e8f0", borderRadius: 7, padding: "9px 0",
            cursor: "pointer", fontSize: 12
          }}>✏ Edit</button>
        </div>


        <button style={{
          width: "100%", marginTop: 12, background: "#fff",
          border: "1.5px solid #1e3a5f", color: "#1e3a5f",
          borderRadius: 7, padding: "9px 0", cursor: "pointer",
          fontSize: 12, fontWeight: 600
        }}>💾 Save Draft</button>
      </div>


      {/* Center CV Preview */}
      <div style={{ flex: 1, background: "#f8fafc", overflowY: "auto", padding: "24px 28px" }}>
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px #0000000d", overflow: "hidden" }}>
          <CVPreview data={sampleCV} fontFamily={fontFamily} fontSize={fontSize} accentColor={accentColor} />
        </div>
      </div>


      {/* Right Export Panel */}
      <div style={{
        width: 230, background: "#fff", borderLeft: "1px solid #e2e8f0",
        padding: "20px 16px", flexShrink: 0, overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Export Document</span>
          <span style={{ cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>×</span>
        </div>


        <SelectField label="Theme" value={theme} onChange={setTheme} options={THEMES} />
        <SelectField label="Font Family" value={fontFamily} onChange={setFontFamily} options={FONT_FAMILIES} />
        <SelectField label="Font Size" value={fontSize} onChange={setFontSize} options={FONT_SIZES} />


        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Color Scheme</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {COLOR_SCHEMES.map(c => (
              <div key={c} onClick={() => setAccentColor(c)} style={{
                width: 24, height: 24, borderRadius: 6, background: c, cursor: "pointer",
                border: accentColor === c ? "2.5px solid #1e3a5f" : "2px solid transparent",
                outline: accentColor === c ? "2px solid #93c5fd" : "none",
                transition: "all 0.15s"
              }} />
            ))}
          </div>
        </div>


        {/* Mini Preview */}
        <div style={{
          border: "1px solid #e2e8f0", borderRadius: 8,
          overflow: "hidden", marginBottom: 14, height: 110, position: "relative"
        }}>
          <div style={{ transform: "scale(0.33)", transformOrigin: "top left", width: "303%", pointerEvents: "none" }}>
            <CVPreview data={sampleCV} fontFamily={fontFamily} fontSize={fontSize} accentColor={accentColor} />
          </div>
        </div>


        <button style={{
          width: "100%", background: "#16a34a", color: "#fff",
          border: "none", borderRadius: 8, padding: "11px 0",
          cursor: "pointer", fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6
        }}>⬇ Download PDF</button>
      </div>
    </div>
  );
}


export default function AdaptDoc() {
  const [activeTab, setActiveTab] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);


  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "#f1f5f9", overflow: "hidden"
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 210 : 56, background: "#1e3a5f",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease", overflow: "hidden", flexShrink: 0
      }}>
        <div style={{
          padding: "16px 14px", display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid #ffffff20"
        }}>
          <div style={{
            width: 30, height: 30, background: "#3b82f6", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0
          }}>AT</div>
          {sidebarOpen && <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>AdaptDoc</span>}
        </div>


        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {SIDEBAR_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", marginBottom: 2,
              background: activeTab === item.id ? "#ffffff20" : "transparent",
              border: "none",
              borderLeft: activeTab === item.id ? "3px solid #60a5fa" : "3px solid transparent",
              borderRadius: 8, cursor: "pointer",
              color: activeTab === item.id ? "#fff" : "#93c5fd",
              fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400,
              textAlign: "left", whiteSpace: "nowrap",
              transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>


        <div style={{
          padding: "12px 10px", borderTop: "1px solid #ffffff20",
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", background: "#3b82f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>JD</div>
          {sidebarOpen && <span style={{ color: "#93c5fd", fontSize: 12 }}>John Doe</span>}
        </div>
      </div>


      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #e2e8f0",
          padding: "0 20px", height: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#64748b"
            }}>☰</button>
            <span style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15 }}>AdaptDoc</span>
          </div>
          <div style={{ display: "flex", gap: 14, color: "#94a3b8", fontSize: 16 }}>
            <span style={{ cursor: "pointer" }}>✉</span>
            <span style={{ cursor: "pointer" }}>🔔</span>
            <span style={{ cursor: "pointer" }}>⬡</span>
          </div>
        </div>


        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activeTab === "dashboard" && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === "create" && <CreateDocument />}
          {activeTab === "documents" && (
            <div style={{ padding: 40 }}>
              <h2 style={{ color: "#1e3a5f", marginBottom: 8 }}>My Documents</h2>
              <p style={{ color: "#64748b" }}>Your saved documents will appear here.</p>
            </div>
          )}
          {activeTab === "templates" && (
            <div style={{ padding: 40 }}>
              <h2 style={{ color: "#1e3a5f", marginBottom: 16 }}>Templates</h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {TEMPLATES.map(t => (
                  <div key={t} style={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                    padding: "20px 24px", width: 180, cursor: "pointer", boxShadow: "0 1px 4px #0001"
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>{t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div style={{ padding: 40 }}>
              <h2 style={{ color: "#1e3a5f", marginBottom: 8 }}>Settings</h2>
              <p style={{ color: "#64748b" }}>Account settings and preferences.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



