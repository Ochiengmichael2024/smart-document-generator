import React, { useState, useRef, useEffect } from "react";

const SIDEBAR_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "documents", icon: "📄", label: "Documents" },
  { id: "create", icon: "✦", label: "Create Document" },
  { id: "templates", icon: "◧", label: "Templates" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

const TEMPLATES = ["Modern Professional", "Classic Elegant", "Minimal Clean", "Creative Bold"];
const CATEGORIES = ["CV", "Cover Letter", "Resume", "Portfolio", "Report"];
const THEMES = ["Modern", "Classic", "Minimal", "Bold"];
const FONT_FAMILIES = ["Playfair Display", "Georgia", "Garamond", "Lato"];
const FONT_SIZES = ["10 pt", "11 pt", "12 pt", "14 pt"];
const COLOR_SCHEMES = ["#1e3a5f", "#3b82f6", "#6366f1", "#0f766e", "#64748b", "#94a3b8", "#cbd5e1"];

const defaultCV = {
  name: "Michael Ochieng",
  title: "Software Engineer",
  location: "Nairobi, Kenya",
  email1: "ochiengmichael082@gmail.com",
  email2: "michaelochieng@gmail.com",
  summary: "Accomplished Software Engineer with over 8 years of experience specializing in Machine Learning, Artificial Intelligence, and Web Development. Proven ability in quality control and maintenance across various industrial environments.",
  skills: ["Machine Learning", "Artificial Intelligence", "Web Development", "Python", "Team Collaboration"],
  experience: [
    {
      company: "Tech Solutions Ltd",
      role: "Lead Software Engineer",
      period: "Apr 2018 – Present",
      bullets: [
        "Led development of AI-powered web applications serving over 50,000 users monthly.",
        "Collaborated with cross-functional teams to deliver machine learning models with 95% accuracy.",
        "Reduced system downtime by 30% through implementing automated monitoring solutions.",
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

// Editable inline field — shows text normally, becomes input on edit mode
function EditableField({ value, onChange, editMode, multiline, style }) {
  const baseStyle = {
    background: editMode ? "#fffbeb" : "transparent",
    border: editMode ? "1.5px dashed #f59e0b" : "1.5px solid transparent",
    borderRadius: 4, padding: editMode ? "2px 6px" : "2px 0",
    outline: "none", width: "100%", fontFamily: "inherit",
    resize: "none", transition: "all 0.15s",
    ...style,
  };

  if (!editMode) return <span style={{ ...style }}>{value}</span>;

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        style={{ ...baseStyle, display: "block", lineHeight: 1.5 }}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...baseStyle, display: "inline-block" }}
    />
  );
}

function CVPreview({ data, onDataChange, fontFamily, fontSize, accentColor, editMode }) {
  const accent = accentColor || "#1e3a5f";
  const fontSizeNum = parseInt(fontSize) || 12;

  const update = (field, value) => onDataChange({ ...data, [field]: value });
  const updateExp = (expIdx, field, value) => {
    const exp = data.experience.map((e, i) => i === expIdx ? { ...e, [field]: value } : e);
    onDataChange({ ...data, experience: exp });
  };
  const updateBullet = (expIdx, bulletIdx, value) => {
    const exp = data.experience.map((e, i) => {
      if (i !== expIdx) return e;
      const bullets = e.bullets.map((b, j) => j === bulletIdx ? value : b);
      return { ...e, bullets };
    });
    onDataChange({ ...data, experience: exp });
  };
  const updateSkill = (idx, value) => {
    const skills = data.skills.map((s, i) => i === idx ? value : s);
    onDataChange({ ...data, skills });
  };
  const addSkill = () => onDataChange({ ...data, skills: [...data.skills, "New Skill"] });
  const removeSkill = (idx) => onDataChange({ ...data, skills: data.skills.filter((_, i) => i !== idx) });
  const addBullet = (expIdx) => {
    const exp = data.experience.map((e, i) => i === expIdx ? { ...e, bullets: [...e.bullets, "New achievement"] } : e);
    onDataChange({ ...data, experience: exp });
  };
  const removeBullet = (expIdx, bulletIdx) => {
    const exp = data.experience.map((e, i) => {
      if (i !== expIdx) return e;
      return { ...e, bullets: e.bullets.filter((_, j) => j !== bulletIdx) };
    });
    onDataChange({ ...data, experience: exp });
  };

  const editBorder = editMode ? "1px dashed #f59e0b40" : "none";

  return (
    <div style={{
      fontFamily: `'${fontFamily}', Georgia, serif`,
      fontSize: `${fontSizeNum}px`,
      color: "#1a1a2e", background: "#fff",
      padding: "28px 32px", minHeight: "500px", lineHeight: 1.5,
      position: "relative",
    }}>
      {editMode && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          background: "#fef3c7", border: "1px solid #f59e0b",
          borderRadius: 6, padding: "3px 10px",
          fontSize: 11, color: "#92400e", fontWeight: 600,
        }}>✏ Editing Mode — click any field to edit</div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <EditableField
            value={data.name} onChange={v => update("name", v)}
            editMode={editMode}
            style={{ fontSize: fontSizeNum * 1.9, fontWeight: 700, color: "#111", letterSpacing: "-0.5px", width: "100%" }}
          />
          <div style={{ marginTop: 2 }}>
            <EditableField
              value={data.title} onChange={v => update("title", v)}
              editMode={editMode}
              style={{ fontSize: fontSizeNum * 1.05, color: "#555" }}
            />
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: fontSizeNum * 0.9, color: "#555", minWidth: 180 }}>
          <div><EditableField value={data.location} onChange={v => update("location", v)} editMode={editMode} style={{ color: "#555", textAlign: "right" }} /></div>
          <div style={{ marginTop: 4 }}>✉ <EditableField value={data.email1} onChange={v => update("email1", v)} editMode={editMode} style={{ color: "#555" }} /></div>
          <div>✉ <EditableField value={data.email2} onChange={v => update("email2", v)} editMode={editMode} style={{ color: "#555" }} /></div>
        </div>
      </div>

      {/* Summary */}
      <SectionHeader label="Summary" accent={accent} fontSizeNum={fontSizeNum} />
      <div style={{ marginBottom: 14, marginTop: 6, border: editBorder, borderRadius: 4 }}>
        <EditableField
          value={data.summary} onChange={v => update("summary", v)}
          editMode={editMode} multiline
          style={{ fontSize: fontSizeNum * 0.92, color: "#333", width: "100%" }}
        />
      </div>

      {/* Skills */}
      <SectionHeader label="Key Skills" accent={accent} fontSizeNum={fontSizeNum} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0 14px", border: editBorder, borderRadius: 4, padding: editMode ? 4 : 0 }}>
        {data.skills.map((s, i) => (
          <span key={i} style={{
            background: `${accent}15`, color: accent,
            border: `1px solid ${accent}40`, borderRadius: 4,
            padding: "2px 6px", fontSize: fontSizeNum * 0.85,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {editMode ? (
              <>
                <input
                  value={s}
                  onChange={e => updateSkill(i, e.target.value)}
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: accent, fontSize: fontSizeNum * 0.85, fontFamily: "inherit",
                    width: Math.max(60, s.length * 7),
                  }}
                />
                <span onClick={() => removeSkill(i)} style={{ cursor: "pointer", color: "#ef4444", fontWeight: 700, fontSize: 12 }}>×</span>
              </>
            ) : s}
          </span>
        ))}
        {editMode && (
          <button onClick={addSkill} style={{
            background: `${accent}20`, color: accent, border: `1px dashed ${accent}`,
            borderRadius: 4, padding: "2px 8px", cursor: "pointer",
            fontSize: fontSizeNum * 0.85, fontFamily: "inherit"
          }}>+ Add</button>
        )}
      </div>

      {/* Experience */}
      <SectionHeader label="Professional Experience" accent={accent} fontSizeNum={fontSizeNum} />
      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginTop: 10, border: editBorder, borderRadius: 4, padding: editMode ? 6 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <EditableField
              value={exp.company} onChange={v => updateExp(i, "company", v)}
              editMode={editMode}
              style={{ fontWeight: 700, fontSize: fontSizeNum }}
            />
            <EditableField
              value={exp.period} onChange={v => updateExp(i, "period", v)}
              editMode={editMode}
              style={{ fontSize: fontSizeNum * 0.85, color: "#777", textAlign: "right" }}
            />
          </div>
          <div style={{ marginBottom: 6 }}>
            <EditableField
              value={exp.role} onChange={v => updateExp(i, "role", v)}
              editMode={editMode}
              style={{ color: accent, fontWeight: 600, fontSize: fontSizeNum * 0.92 }}
            />
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {exp.bullets.map((b, j) => (
              <li key={j} style={{ fontSize: fontSizeNum * 0.88, color: "#444", marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 4 }}>
                <EditableField
                  value={b} onChange={v => updateBullet(i, j, v)}
                  editMode={editMode} multiline
                  style={{ fontSize: fontSizeNum * 0.88, color: "#444", flex: 1 }}
                />
                {editMode && (
                  <span onClick={() => removeBullet(i, j)} style={{ cursor: "pointer", color: "#ef4444", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 2 }}>×</span>
                )}
              </li>
            ))}
          </ul>
          {editMode && (
            <button onClick={() => addBullet(i)} style={{
              marginTop: 6, marginLeft: 18, background: "transparent",
              border: `1px dashed ${accent}`, color: accent,
              borderRadius: 4, padding: "2px 10px", cursor: "pointer",
              fontSize: fontSizeNum * 0.82, fontFamily: "inherit"
            }}>+ Add bullet</button>
          )}
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

function AIChat({ cvData, onCVUpdate }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI document assistant. Tell me about yourself and I'll help build your CV.\n\nTry saying:\n• \"Change my name to Sarah Kim\"\n• \"Add a skill: Docker\"\n• \"Update my summary to focus on leadership\"\n• \"Add experience at Google as Senior Engineer\"",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an AI assistant helping users build and edit their CV/resume inside AdaptDoc.
The current CV data is:
${JSON.stringify(cvData, null, 2)}

When the user asks to update anything, respond with:
1. A short friendly confirmation message
2. A JSON block wrapped in <cv_update></cv_update> tags with the FULL updated CV object

The CV object structure must be exactly:
{
  "name": string,
  "title": string,
  "location": string,
  "email1": string,
  "email2": string,
  "summary": string,
  "skills": [array of strings],
  "experience": [{ "company": string, "role": string, "period": string, "bullets": [array of strings] }]
}

If the user is just chatting or asking questions, respond conversationally without a <cv_update> block.
Be helpful, concise, and encouraging.`,
          messages: [{ role: "user", content: userMsg }]
        })
      });

      const data = await response.json();
      const fullText = data.content?.map(c => c.text || "").join("") || "Sorry, I could not process that.";

      const cvMatch = fullText.match(/<cv_update>([\s\S]*?)<\/cv_update>/);
      if (cvMatch) {
        try {
          const updated = JSON.parse(cvMatch[1].trim());
          onCVUpdate(updated);
        } catch (e) {
          console.error("Failed to parse CV update", e);
        }
      }

      const displayText = fullText.replace(/<cv_update>[\s\S]*?<\/cv_update>/g, "").trim();
      setMessages(prev => [...prev, { role: "assistant", text: displayText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong. Please try again." }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#475569",
        textTransform: "uppercase", letterSpacing: 1,
        marginBottom: 10, display: "flex", alignItems: "center", gap: 6, flexShrink: 0
      }}>
        <span style={{ background: "#3b82f6", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>AI</span>
        Document Assistant
      </div>

      <div style={{
        flex: 1, overflowY: "auto", display: "flex",
        flexDirection: "column", gap: 8, minHeight: 0, paddingRight: 2
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "90%",
              background: msg.role === "user" ? "#1e3a5f" : "#f1f5f9",
              color: msg.role === "user" ? "#fff" : "#1e293b",
              borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "8px 11px", fontSize: 11.5,
              lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              background: "#f1f5f9", borderRadius: "12px 12px 12px 2px",
              padding: "8px 14px", fontSize: 18, letterSpacing: 2, color: "#94a3b8"
            }}>···</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask AI to update your CV..."
          rows={2}
          style={{
            flex: 1, padding: "8px 10px", borderRadius: 8,
            border: "1.5px solid #e2e8f0", background: "#f8fafc",
            fontSize: 12, color: "#1e293b", resize: "none",
            fontFamily: "inherit", lineHeight: 1.4, outline: "none",
          }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
          background: loading || !input.trim() ? "#cbd5e1" : "#1e3a5f",
          color: "#fff", border: "none", borderRadius: 8,
          width: 36, height: 36, cursor: loading ? "not-allowed" : "pointer",
          fontSize: 16, display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0, transition: "background 0.15s"
        }}>➤</button>
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
        Enter to send · Shift+Enter for new line
      </div>
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
  const [cvData, setCvData] = useState(defaultCV);
  const [editMode, setEditMode] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

      {/* ── Category & Template Top Bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "10px 24px", flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>
          Dashboard /&nbsp;
          <span style={{ color: "#1e3a5f", fontWeight: 600 }}>Editing Document</span>
        </span>
        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Category</span>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{
            padding: "6px 12px", borderRadius: 7, border: "1px solid #e2e8f0",
            background: "#f8fafc", fontSize: 12, color: "#1e293b", cursor: "pointer", minWidth: 120,
          }}>
            {CATEGORIES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Template</span>
          <select value={template} onChange={e => setTemplate(e.target.value)} style={{
            padding: "6px 12px", borderRadius: 7, border: "1px solid #e2e8f0",
            background: "#f8fafc", fontSize: 12, color: "#1e293b", cursor: "pointer", minWidth: 165,
          }}>
            {TEMPLATES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <button style={{
          background: "#1e3a5f", color: "#fff", border: "none",
          borderRadius: 7, padding: "7px 18px", cursor: "pointer",
          fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
        }}>💾 Save Draft</button>
      </div>

      {/* ── 3-Column Row ── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* Left — AI Chat */}
        <div style={{
          width: 250, background: "#fff", borderRight: "1px solid #e2e8f0",
          padding: "16px", display: "flex", flexDirection: "column",
          flexShrink: 0, minHeight: 0,
        }}>
          <AIChat cvData={cvData} onCVUpdate={setCvData} />
        </div>

        {/* Center — CV Preview + Edit Button */}
        <div style={{ flex: 1, background: "#f8fafc", overflowY: "auto", padding: "24px 28px" }}>

          {/* Edit / Done button below top bar, above preview */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              onClick={() => setEditMode(p => !p)}
              style={{
                background: editMode ? "#f59e0b" : "#fff",
                color: editMode ? "#fff" : "#1e3a5f",
                border: editMode ? "none" : "1.5px solid #1e3a5f",
                borderRadius: 8, padding: "7px 18px",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 1px 4px #0001", transition: "all 0.15s"
              }}>
              {editMode ? "✅ Done Editing" : "✏ Edit CV"}
            </button>
          </div>

          {/* CV Preview */}
          <div style={{
            background: "#fff", borderRadius: 12,
            boxShadow: editMode ? "0 0 0 2px #f59e0b, 0 4px 24px #0000000d" : "0 4px 24px #0000000d",
            overflow: "hidden", transition: "box-shadow 0.2s"
          }}>
            <CVPreview
              data={cvData}
              onDataChange={setCvData}
              fontFamily={fontFamily}
              fontSize={fontSize}
              accentColor={accentColor}
              editMode={editMode}
            />
          </div>
        </div>

        {/* Right — Export */}
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

          <div style={{
            border: "1px solid #e2e8f0", borderRadius: 8,
            overflow: "hidden", marginBottom: 14, height: 110, position: "relative"
          }}>
            <div style={{ transform: "scale(0.33)", transformOrigin: "top left", width: "303%", pointerEvents: "none" }}>
              <CVPreview data={cvData} onDataChange={() => {}} fontFamily={fontFamily} fontSize={fontSize} accentColor={accentColor} editMode={false} />
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
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const docs = [
    { title: "Michael Ochieng - CV", template: "Modern Professional", date: "Mar 1, 2026" },
    { title: "Cover Letter - Tech Solutions", template: "Classic Elegant", date: "Feb 28, 2026" },
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

export default function AdaptDoc() {
  const [activeTab, setActiveTab] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: "#f1f5f9", overflow: "hidden"
    }}>
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
          }}>MO</div>
          {sidebarOpen && <span style={{ color: "#93c5fd", fontSize: 12 }}>Michael Ochieng</span>}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
