import React, { useState, useRef, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────────────────────
//  THEME DEFINITIONS — each is a complete visual system
// ─────────────────────────────────────────────────────────────
const THEME_CONFIGS = {
  Modern: {
    label: "Modern",
    desc: "Clean sidebar layout with sharp accents",
    fontFamily: "Playfair Display",
    bg: "#ffffff",
    sidebar: true,          // two-column layout with colored sidebar
    headerStyle: "sidebar", // name in sidebar
    sectionStyle: "dot",    // dot + thin line
    skillStyle: "pill",
    bodyFont: "'Lato', sans-serif",
    displayFont: "'Playfair Display', Georgia, serif",
  },
  Classic: {
    label: "Classic",
    desc: "Traditional centered header, ruled sections",
    fontFamily: "Garamond",
    bg: "#fffef9",
    sidebar: false,
    headerStyle: "centered",
    sectionStyle: "underline",
    skillStyle: "inline",
    bodyFont: "'EB Garamond', Garamond, serif",
    displayFont: "'EB Garamond', Garamond, serif",
  },
  Minimal: {
    label: "Minimal",
    desc: "Ultra-sparse whitespace-first design",
    fontFamily: "Georgia",
    bg: "#fafafa",
    sidebar: false,
    headerStyle: "left-sparse",
    sectionStyle: "thin-rule",
    skillStyle: "comma",
    bodyFont: "'DM Sans', sans-serif",
    displayFont: "'DM Sans', sans-serif",
  },
  Bold: {
    label: "Bold",
    desc: "Dark header band, high-contrast impact",
    fontFamily: "Lato",
    bg: "#ffffff",
    sidebar: false,
    headerStyle: "dark-band",
    sectionStyle: "filled-label",
    skillStyle: "outlined",
    bodyFont: "'Barlow', sans-serif",
    displayFont: "'Barlow Condensed', sans-serif",
  },
};

const SIDEBAR_ITEMS = [
  { id:"dashboard", icon:"⊞",  label:"Dashboard" },
  { id:"documents", icon:"📄", label:"Documents" },
  { id:"create",    icon:"✦",  label:"Create Document" },
  { id:"settings",  icon:"⚙",  label:"Settings" },
];

const CATEGORIES_CV = ["CV","Cover Letter","Proposal"];
const THEMES        = ["Modern","Classic","Minimal","Bold"];
const FONT_FAMILIES = ["Playfair Display","Georgia","Garamond","Lato"];
const FONT_SIZES    = ["10 pt","11 pt","12 pt","14 pt"];
const COLOR_SCHEMES = ["#1e3a5f","#3b82f6","#6366f1","#0f766e","#64748b","#94a3b8","#cbd5e1"];

const defaultCV = {
  name:"Michael Ochieng",
  title:"Software Engineer",
  location:"Nairobi, Kenya",
  email1:"ochiengmichael082@gmail.com",
  email2:"michaelochieng@gmail.com",
  summary:"Accomplished Software Engineer with over 8 years of experience specializing in Machine Learning, Artificial Intelligence, and Web Development. Proven ability in quality control and maintenance across various industrial environments.",
  skills:["Machine Learning","Artificial Intelligence","Web Development","Python","Team Collaboration"],
  experience:[{
    company:"Tech Solutions Ltd",
    role:"Lead Software Engineer",
    period:"Apr 2018 – Present",
    bullets:[
      "Led development of AI-powered web applications serving over 50,000 users monthly.",
      "Collaborated with cross-functional teams to deliver machine learning models with 95% accuracy.",
      "Reduced system downtime by 30% through implementing automated monitoring solutions.",
    ]
  }]
};

// ─────────────────────────────────────────────────────────────
//  EDITABLE FIELD
// ─────────────────────────────────────────────────────────────
function EditableField({ value, onChange, editMode, multiline, style, inputStyle }) {
  const base = {
    background: editMode ? "#fffbeb" : "transparent",
    border: editMode ? "1.5px dashed #f59e0b" : "1.5px solid transparent",
    borderRadius: 4, padding: editMode ? "2px 6px" : "2px 0",
    outline: "none", width: "100%", fontFamily: "inherit",
    resize: "none", transition: "all 0.15s", ...style, ...(inputStyle||{}),
  };
  if (!editMode) return <span style={style}>{value}</span>;
  if (multiline) return <textarea value={value} onChange={e=>onChange(e.target.value)} rows={3} style={{ ...base, display:"block", lineHeight:1.5 }} />;
  return <input value={value} onChange={e=>onChange(e.target.value)} style={{ ...base, display:"inline-block" }} />;
}

// ─────────────────────────────────────────────────────────────
//  THEME-AWARE CV PREVIEW
// ─────────────────────────────────────────────────────────────
function CVPreview({ data, onDataChange, theme, fontSize, accentColor, editMode }) {
  const cfg = THEME_CONFIGS[theme] || THEME_CONFIGS.Modern;
  const accent = accentColor || "#1e3a5f";
  const fz = parseInt(fontSize) || 12;

  const update = (f,v) => onDataChange({...data,[f]:v});
  const updateExp = (ei,f,v) => { const e=data.experience.map((x,i)=>i===ei?{...x,[f]:v}:x); onDataChange({...data,experience:e}); };
  const updateBullet = (ei,bi,v) => { const e=data.experience.map((x,i)=>{ if(i!==ei)return x; const b=x.bullets.map((b,j)=>j===bi?v:b); return{...x,bullets:b}; }); onDataChange({...data,experience:e}); };
  const updateSkill = (idx,v) => { const s=data.skills.map((x,i)=>i===idx?v:x); onDataChange({...data,skills:s}); };
  const addSkill = () => onDataChange({...data,skills:[...data.skills,"New Skill"]});
  const removeSkill = (idx) => onDataChange({...data,skills:data.skills.filter((_,i)=>i!==idx)});
  const addBullet = (ei) => { const e=data.experience.map((x,i)=>i===ei?{...x,bullets:[...x.bullets,"New achievement"]}:x); onDataChange({...data,experience:e}); };
  const removeBullet = (ei,bi) => { const e=data.experience.map((x,i)=>{ if(i!==ei)return x; return{...x,bullets:x.bullets.filter((_,j)=>j!==bi)}; }); onDataChange({...data,experience:e}); };

  if (theme === "Modern") return <ModernCV data={data} update={update} updateExp={updateExp} updateBullet={updateBullet} updateSkill={updateSkill} addSkill={addSkill} removeSkill={removeSkill} addBullet={addBullet} removeBullet={removeBullet} accent={accent} fz={fz} editMode={editMode} cfg={cfg} />;
  if (theme === "Classic") return <ClassicCV data={data} update={update} updateExp={updateExp} updateBullet={updateBullet} updateSkill={updateSkill} addSkill={addSkill} removeSkill={removeSkill} addBullet={addBullet} removeBullet={removeBullet} accent={accent} fz={fz} editMode={editMode} cfg={cfg} />;
  if (theme === "Minimal") return <MinimalCV data={data} update={update} updateExp={updateExp} updateBullet={updateBullet} updateSkill={updateSkill} addSkill={addSkill} removeSkill={removeSkill} addBullet={addBullet} removeBullet={removeBullet} accent={accent} fz={fz} editMode={editMode} cfg={cfg} />;
  if (theme === "Bold") return <BoldCV data={data} update={update} updateExp={updateExp} updateBullet={updateBullet} updateSkill={updateSkill} addSkill={addSkill} removeSkill={removeSkill} addBullet={addBullet} removeBullet={removeBullet} accent={accent} fz={fz} editMode={editMode} cfg={cfg} />;
  return null;
}

// ─────────────────────────────────────────────────────────────
//  MODERN THEME  — sidebar layout, geometric accents
// ─────────────────────────────────────────────────────────────
function ModernCV({ data, update, updateExp, updateBullet, updateSkill, addSkill, removeSkill, addBullet, removeBullet, accent, fz, editMode }) {
  const eb = editMode ? "1px dashed #f59e0b40" : "none";
  return (
    <div style={{ fontFamily:"'Lato',sans-serif", fontSize:fz, display:"flex", minHeight:520, background:"#fff" }}>
      {/* Sidebar */}
      <div style={{ width:"34%", background:accent, color:"#fff", padding:"28px 18px", display:"flex", flexDirection:"column", gap:20 }}>
        {/* Name block */}
        <div style={{ borderBottom:"2px solid rgba(255,255,255,0.3)", paddingBottom:16 }}>
          <EditableField value={data.name} onChange={v=>update("name",v)} editMode={editMode}
            style={{ fontSize:fz*1.6, fontWeight:800, color:"#fff", letterSpacing:"-0.3px", fontFamily:"'Playfair Display',Georgia,serif", lineHeight:1.2 }}
            inputStyle={{ color:"#fff", background:"rgba(255,255,255,0.15)", border:"1px dashed rgba(255,255,255,0.5)" }} />
          <div style={{ marginTop:6 }}>
            <EditableField value={data.title} onChange={v=>update("title",v)} editMode={editMode}
              style={{ fontSize:fz*0.88, color:"rgba(255,255,255,0.85)", fontWeight:400, letterSpacing:"0.5px", textTransform:"uppercase" }}
              inputStyle={{ color:"#fff", background:"rgba(255,255,255,0.1)", border:"1px dashed rgba(255,255,255,0.4)" }} />
          </div>
        </div>
        {/* Contact */}
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <div style={{ fontSize:fz*0.72, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:2 }}>Contact</div>
          {[["📍", data.location, v=>update("location",v)],["✉", data.email1, v=>update("email1",v)],["✉", data.email2, v=>update("email2",v)]].map(([icon, val, fn], i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:6, fontSize:fz*0.8 }}>
              <span style={{ flexShrink:0, opacity:0.7, marginTop:1 }}>{icon}</span>
              <EditableField value={val} onChange={fn} editMode={editMode}
                style={{ color:"rgba(255,255,255,0.9)", wordBreak:"break-all" }}
                inputStyle={{ color:"#fff", background:"rgba(255,255,255,0.1)", border:"1px dashed rgba(255,255,255,0.4)", fontSize:fz*0.8 }} />
            </div>
          ))}
        </div>
        {/* Skills */}
        <div>
          <div style={{ fontSize:fz*0.72, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:8 }}>Skills</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {data.skills.map((s,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,0.6)", flexShrink:0 }} />
                {editMode ? (
                  <>
                    <input value={s} onChange={e=>updateSkill(i,e.target.value)} style={{ background:"rgba(255,255,255,0.15)", border:"1px dashed rgba(255,255,255,0.5)", borderRadius:3, padding:"1px 5px", color:"#fff", fontSize:fz*0.82, fontFamily:"inherit", outline:"none", flex:1 }} />
                    <span onClick={()=>removeSkill(i)} style={{ cursor:"pointer", color:"rgba(255,100,100,0.9)", fontWeight:700, fontSize:12 }}>×</span>
                  </>
                ) : (
                  <span style={{ fontSize:fz*0.82, color:"rgba(255,255,255,0.9)" }}>{s}</span>
                )}
              </div>
            ))}
            {editMode && <button onClick={addSkill} style={{ background:"rgba(255,255,255,0.15)", border:"1px dashed rgba(255,255,255,0.5)", borderRadius:4, padding:"3px 8px", color:"#fff", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit", marginTop:4 }}>+ Add Skill</button>}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, padding:"28px 22px", display:"flex", flexDirection:"column", gap:16 }}>
        {editMode && <div style={{ position:"absolute", top:8, right:8, background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:6, padding:"3px 10px", fontSize:11, color:"#92400e", fontWeight:600, zIndex:10 }}>✏ Editing Mode</div>}

        {/* Summary */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:3, height:16, background:accent, borderRadius:2 }} />
            <span style={{ fontSize:fz*0.78, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:accent }}>Summary</span>
          </div>
          <div style={{ border:eb, borderRadius:4 }}>
            <EditableField value={data.summary} onChange={v=>update("summary",v)} editMode={editMode} multiline
              style={{ fontSize:fz*0.88, color:"#444", lineHeight:1.6 }} />
          </div>
        </div>

        {/* Experience */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:3, height:16, background:accent, borderRadius:2 }} />
            <span style={{ fontSize:fz*0.78, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:accent }}>Experience</span>
          </div>
          {data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:12, paddingLeft:10, borderLeft:`2px solid ${accent}20`, border:eb }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap", gap:4 }}>
                <EditableField value={exp.company} onChange={v=>updateExp(i,"company",v)} editMode={editMode} style={{ fontWeight:700, fontSize:fz, color:"#1a1a2e" }} />
                <EditableField value={exp.period} onChange={v=>updateExp(i,"period",v)} editMode={editMode} style={{ fontSize:fz*0.8, color:"#999", whiteSpace:"nowrap" }} />
              </div>
              <EditableField value={exp.role} onChange={v=>updateExp(i,"role",v)} editMode={editMode} style={{ fontSize:fz*0.88, color:accent, fontWeight:600, marginBottom:6, display:"block" }} />
              <ul style={{ margin:0, paddingLeft:16, listStyle:"none" }}>
                {exp.bullets.map((b,j)=>(
                  <li key={j} style={{ fontSize:fz*0.85, color:"#555", marginBottom:4, display:"flex", alignItems:"flex-start", gap:6 }}>
                    <span style={{ color:accent, flexShrink:0, marginTop:2, fontSize:10 }}>▸</span>
                    <EditableField value={b} onChange={v=>updateBullet(i,j,v)} editMode={editMode} multiline style={{ fontSize:fz*0.85, color:"#555", flex:1 }} />
                    {editMode && <span onClick={()=>removeBullet(i,j)} style={{ cursor:"pointer", color:"#ef4444", fontWeight:700, fontSize:13, flexShrink:0 }}>×</span>}
                  </li>
                ))}
              </ul>
              {editMode && <button onClick={()=>addBullet(i)} style={{ marginTop:6, marginLeft:22, background:"transparent", border:`1px dashed ${accent}`, color:accent, borderRadius:4, padding:"2px 10px", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit" }}>+ Add bullet</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CLASSIC THEME  — centered header, traditional typography
// ─────────────────────────────────────────────────────────────
function ClassicCV({ data, update, updateExp, updateBullet, updateSkill, addSkill, removeSkill, addBullet, removeBullet, accent, fz, editMode }) {
  const eb = editMode ? "1px dashed #f59e0b40" : "none";
  return (
    <div style={{ fontFamily:"'EB Garamond',Garamond,Georgia,serif", fontSize:fz, background:"#fffef9", padding:"36px 40px", minHeight:520, color:"#1a1a1a" }}>
      {editMode && <div style={{ position:"absolute", top:8, right:8, background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:6, padding:"3px 10px", fontSize:11, color:"#92400e", fontWeight:600, zIndex:10 }}>✏ Editing Mode</div>}

      {/* Centered header */}
      <div style={{ textAlign:"center", borderBottom:`1.5px solid ${accent}`, paddingBottom:16, marginBottom:20 }}>
        <EditableField value={data.name} onChange={v=>update("name",v)} editMode={editMode}
          style={{ fontSize:fz*2.1, fontWeight:400, color:"#1a1a1a", letterSpacing:"2px", fontVariant:"small-caps", display:"block", textAlign:"center" }} />
        <div style={{ marginTop:4, fontSize:fz*0.95, color:"#666", fontStyle:"italic", letterSpacing:"0.5px" }}>
          <EditableField value={data.title} onChange={v=>update("title",v)} editMode={editMode} style={{ color:"#666", fontStyle:"italic" }} />
        </div>
        <div style={{ marginTop:8, fontSize:fz*0.82, color:"#888", display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"0 16px" }}>
          <EditableField value={data.location} onChange={v=>update("location",v)} editMode={editMode} style={{ color:"#888" }} />
          <span style={{ color:"#ccc" }}>|</span>
          <EditableField value={data.email1} onChange={v=>update("email1",v)} editMode={editMode} style={{ color:"#888" }} />
          <span style={{ color:"#ccc" }}>|</span>
          <EditableField value={data.email2} onChange={v=>update("email2",v)} editMode={editMode} style={{ color:"#888" }} />
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:fz*1.05, fontWeight:400, fontVariant:"small-caps", letterSpacing:"2px", color:accent, borderBottom:`1px solid ${accent}50`, paddingBottom:3, marginBottom:8 }}>Professional Summary</div>
        <div style={{ border:eb, borderRadius:4 }}>
          <EditableField value={data.summary} onChange={v=>update("summary",v)} editMode={editMode} multiline
            style={{ fontSize:fz*0.92, color:"#333", lineHeight:1.7, fontStyle:"italic" }} />
        </div>
      </div>

      {/* Skills inline */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:fz*1.05, fontWeight:400, fontVariant:"small-caps", letterSpacing:"2px", color:accent, borderBottom:`1px solid ${accent}50`, paddingBottom:3, marginBottom:8 }}>Core Competencies</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, border:eb, padding:editMode?4:0, borderRadius:4 }}>
          {data.skills.map((s,i)=>(
            <span key={i} style={{ fontSize:fz*0.88, color:"#444" }}>
              {editMode ? (
                <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}>
                  <input value={s} onChange={e=>updateSkill(i,e.target.value)} style={{ background:"#fffbeb", border:"1px dashed #f59e0b", borderRadius:3, padding:"0 4px", color:"#444", fontSize:fz*0.88, fontFamily:"inherit", outline:"none", width:Math.max(50,s.length*7) }} />
                  <span onClick={()=>removeSkill(i)} style={{ cursor:"pointer", color:"#ef4444", fontWeight:700 }}>×</span>
                </span>
              ) : s}
              {i < data.skills.length-1 && <span style={{ color:"#bbb", margin:"0 6px" }}>✦</span>}
            </span>
          ))}
          {editMode && <button onClick={addSkill} style={{ background:"transparent", border:"1px dashed #94a3b8", borderRadius:3, padding:"0 8px", cursor:"pointer", fontSize:fz*0.82, fontFamily:"inherit", color:"#64748b", marginLeft:6 }}>+ Add</button>}
        </div>
      </div>

      {/* Experience */}
      <div>
        <div style={{ fontSize:fz*1.05, fontWeight:400, fontVariant:"small-caps", letterSpacing:"2px", color:accent, borderBottom:`1px solid ${accent}50`, paddingBottom:3, marginBottom:10 }}>Professional Experience</div>
        {data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:14, border:eb, padding:editMode?6:0, borderRadius:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <EditableField value={exp.company} onChange={v=>updateExp(i,"company",v)} editMode={editMode} style={{ fontWeight:600, fontSize:fz*1.02, color:"#1a1a1a" }} />
              <EditableField value={exp.period} onChange={v=>updateExp(i,"period",v)} editMode={editMode} style={{ fontSize:fz*0.82, color:"#888", fontStyle:"italic" }} />
            </div>
            <EditableField value={exp.role} onChange={v=>updateExp(i,"role",v)} editMode={editMode} style={{ fontSize:fz*0.9, color:accent, fontStyle:"italic", marginBottom:6, display:"block" }} />
            <ul style={{ margin:0, paddingLeft:20 }}>
              {exp.bullets.map((b,j)=>(
                <li key={j} style={{ fontSize:fz*0.88, color:"#444", marginBottom:3, lineHeight:1.6, display:"flex", alignItems:"flex-start", gap:4 }}>
                  <EditableField value={b} onChange={v=>updateBullet(i,j,v)} editMode={editMode} multiline style={{ fontSize:fz*0.88, color:"#444", flex:1 }} />
                  {editMode && <span onClick={()=>removeBullet(i,j)} style={{ cursor:"pointer", color:"#ef4444", fontWeight:700, fontSize:13, flexShrink:0 }}>×</span>}
                </li>
              ))}
            </ul>
            {editMode && <button onClick={()=>addBullet(i)} style={{ marginTop:6, marginLeft:20, background:"transparent", border:`1px dashed ${accent}`, color:accent, borderRadius:4, padding:"2px 10px", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit" }}>+ Add bullet</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MINIMAL THEME  — whitespace dominant, hairline rules
// ─────────────────────────────────────────────────────────────
function MinimalCV({ data, update, updateExp, updateBullet, updateSkill, addSkill, removeSkill, addBullet, removeBullet, accent, fz, editMode }) {
  const eb = editMode ? "1px dashed #f59e0b40" : "none";
  return (
    <div style={{ fontFamily:"'DM Sans','Helvetica Neue',sans-serif", fontSize:fz, background:"#fafafa", padding:"44px 48px", minHeight:520, color:"#111" }}>
      {editMode && <div style={{ position:"absolute", top:8, right:8, background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:6, padding:"3px 10px", fontSize:11, color:"#92400e", fontWeight:600, zIndex:10 }}>✏ Editing Mode</div>}

      {/* Sparse left-aligned header */}
      <div style={{ marginBottom:36 }}>
        <EditableField value={data.name} onChange={v=>update("name",v)} editMode={editMode}
          style={{ fontSize:fz*2.4, fontWeight:300, color:"#111", letterSpacing:"-1px", lineHeight:1.1, display:"block" }} />
        <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:16 }}>
          <EditableField value={data.title} onChange={v=>update("title",v)} editMode={editMode}
            style={{ fontSize:fz*0.88, color:accent, fontWeight:500, letterSpacing:"0.3px" }} />
        </div>
        <div style={{ marginTop:10, display:"flex", gap:16, flexWrap:"wrap", fontSize:fz*0.78, color:"#888" }}>
          <EditableField value={data.location} onChange={v=>update("location",v)} editMode={editMode} style={{ color:"#888", fontSize:fz*0.78 }} />
          <EditableField value={data.email1} onChange={v=>update("email1",v)} editMode={editMode} style={{ color:"#888", fontSize:fz*0.78 }} />
          <EditableField value={data.email2} onChange={v=>update("email2",v)} editMode={editMode} style={{ color:"#888", fontSize:fz*0.78 }} />
        </div>
      </div>

      {/* Thin rule section label style */}
      {[
        {
          label:"About",
          content:(
            <div style={{ border:eb, borderRadius:4 }}>
              <EditableField value={data.summary} onChange={v=>update("summary",v)} editMode={editMode} multiline
                style={{ fontSize:fz*0.9, color:"#444", lineHeight:1.8, fontWeight:300 }} />
            </div>
          )
        },
        {
          label:"Skills",
          content:(
            <div style={{ border:eb, padding:editMode?4:0, borderRadius:4 }}>
              <span style={{ fontSize:fz*0.85, color:"#555", fontWeight:300 }}>
                {data.skills.map((s,i)=>(
                  <span key={i} style={{ display:"inline-flex", alignItems:"center" }}>
                    {editMode ? (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:3 }}>
                        <input value={s} onChange={e=>updateSkill(i,e.target.value)} style={{ background:"#fffbeb", border:"1px dashed #f59e0b", borderRadius:3, padding:"0 4px", color:"#444", fontSize:fz*0.85, fontFamily:"inherit", outline:"none", width:Math.max(50,s.length*7) }} />
                        <span onClick={()=>removeSkill(i)} style={{ cursor:"pointer", color:"#ef4444", fontWeight:700, marginRight:8 }}>×</span>
                      </span>
                    ) : (
                      <>
                        {s}
                        {i < data.skills.length-1 && <span style={{ color:"#ccc", margin:"0 10px" }}>—</span>}
                      </>
                    )}
                  </span>
                ))}
                {editMode && <button onClick={addSkill} style={{ background:"transparent", border:"1px dashed #94a3b8", borderRadius:3, padding:"0 8px", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit", color:"#64748b", marginLeft:6 }}>+ Add</button>}
              </span>
            </div>
          )
        },
        {
          label:"Experience",
          content:(
            <div>
              {data.experience.map((exp,i)=>(
                <div key={i} style={{ marginBottom:20, border:eb, padding:editMode?6:0, borderRadius:4 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <EditableField value={exp.company} onChange={v=>updateExp(i,"company",v)} editMode={editMode} style={{ fontWeight:500, fontSize:fz*0.95, color:"#111" }} />
                    <EditableField value={exp.period} onChange={v=>updateExp(i,"period",v)} editMode={editMode} style={{ fontSize:fz*0.78, color:"#aaa", whiteSpace:"nowrap" }} />
                  </div>
                  <EditableField value={exp.role} onChange={v=>updateExp(i,"role",v)} editMode={editMode} style={{ fontSize:fz*0.82, color:accent, fontWeight:400, marginBottom:8, display:"block" }} />
                  {exp.bullets.map((b,j)=>(
                    <div key={j} style={{ display:"flex", gap:10, marginBottom:4, alignItems:"flex-start" }}>
                      <span style={{ color:"#ddd", fontSize:fz*0.7, flexShrink:0, marginTop:3 }}>—</span>
                      <EditableField value={b} onChange={v=>updateBullet(i,j,v)} editMode={editMode} multiline style={{ fontSize:fz*0.84, color:"#555", flex:1, lineHeight:1.6, fontWeight:300 }} />
                      {editMode && <span onClick={()=>removeBullet(i,j)} style={{ cursor:"pointer", color:"#ef4444", fontWeight:700, fontSize:13, flexShrink:0 }}>×</span>}
                    </div>
                  ))}
                  {editMode && <button onClick={()=>addBullet(i)} style={{ marginTop:6, background:"transparent", border:`1px dashed ${accent}`, color:accent, borderRadius:4, padding:"2px 10px", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit" }}>+ Add bullet</button>}
                </div>
              ))}
            </div>
          )
        }
      ].map(({ label, content }) => (
        <div key={label} style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:fz*0.68, fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:"#bbb" }}>{label}</span>
            <div style={{ flex:1, height:"1px", background:"#e5e7eb" }} />
          </div>
          {content}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  BOLD THEME  — dark header band, high contrast
// ─────────────────────────────────────────────────────────────
function BoldCV({ data, update, updateExp, updateBullet, updateSkill, addSkill, removeSkill, addBullet, removeBullet, accent, fz, editMode }) {
  const eb = editMode ? "1px dashed #f59e0b40" : "none";
  const darkBg = "#0f172a";
  return (
    <div style={{ fontFamily:"'Barlow','Helvetica Neue',sans-serif", fontSize:fz, background:"#fff", minHeight:520 }}>
      {editMode && <div style={{ position:"absolute", top:8, right:8, background:"#fef3c7", border:"1px solid #f59e0b", borderRadius:6, padding:"3px 10px", fontSize:11, color:"#92400e", fontWeight:600, zIndex:10 }}>✏ Editing Mode</div>}

      {/* Dark band header */}
      <div style={{ background:darkBg, padding:"28px 32px 22px", position:"relative", overflow:"hidden" }}>
        {/* Accent stripe */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:accent }} />
        {/* Geometric decoration */}
        <div style={{ position:"absolute", right:-20, top:-20, width:120, height:120, borderRadius:"50%", background:`${accent}18`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:30, bottom:-30, width:80, height:80, borderRadius:"50%", background:`${accent}10`, pointerEvents:"none" }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12, position:"relative" }}>
          <div>
            <EditableField value={data.name} onChange={v=>update("name",v)} editMode={editMode}
              style={{ fontSize:fz*2.3, fontWeight:800, color:"#fff", letterSpacing:"-0.5px", textTransform:"uppercase", lineHeight:1, fontFamily:"'Barlow Condensed','Barlow',sans-serif" }}
              inputStyle={{ color:"#fff", background:"rgba(255,255,255,0.1)", border:"1px dashed rgba(255,255,255,0.4)" }} />
            <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:24, height:3, background:accent, borderRadius:2 }} />
              <EditableField value={data.title} onChange={v=>update("title",v)} editMode={editMode}
                style={{ fontSize:fz*0.9, color:accent, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase" }}
                inputStyle={{ color:accent, background:"rgba(255,255,255,0.05)", border:"1px dashed rgba(255,255,255,0.3)" }} />
            </div>
          </div>
          <div style={{ textAlign:"right", fontSize:fz*0.78, color:"rgba(255,255,255,0.6)", display:"flex", flexDirection:"column", gap:3 }}>
            <EditableField value={data.location} onChange={v=>update("location",v)} editMode={editMode} style={{ color:"rgba(255,255,255,0.6)", textAlign:"right" }} inputStyle={{ color:"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.05)", border:"1px dashed rgba(255,255,255,0.3)", textAlign:"right" }} />
            <EditableField value={data.email1} onChange={v=>update("email1",v)} editMode={editMode} style={{ color:"rgba(255,255,255,0.6)", textAlign:"right" }} inputStyle={{ color:"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.05)", border:"1px dashed rgba(255,255,255,0.3)", textAlign:"right" }} />
            <EditableField value={data.email2} onChange={v=>update("email2",v)} editMode={editMode} style={{ color:"rgba(255,255,255,0.6)", textAlign:"right" }} inputStyle={{ color:"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.05)", border:"1px dashed rgba(255,255,255,0.3)", textAlign:"right" }} />
          </div>
        </div>
      </div>

      {/* Skills strip */}
      <div style={{ background:accent, padding:"10px 32px", display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
        {data.skills.map((s,i)=>(
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
            {editMode ? (
              <>
                <input value={s} onChange={e=>updateSkill(i,e.target.value)} style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.5)", borderRadius:3, padding:"1px 6px", color:"#fff", fontSize:fz*0.78, fontFamily:"inherit", outline:"none", fontWeight:600, letterSpacing:"0.5px" }} />
                <span onClick={()=>removeSkill(i)} style={{ cursor:"pointer", color:"rgba(255,100,100,0.9)", fontWeight:700, fontSize:12 }}>×</span>
              </>
            ) : (
              <span style={{ fontSize:fz*0.78, color:"#fff", fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>{s}</span>
            )}
            {i < data.skills.length-1 && <span style={{ color:"rgba(255,255,255,0.4)", marginLeft:6 }}>·</span>}
          </span>
        ))}
        {editMode && <button onClick={addSkill} style={{ background:"rgba(255,255,255,0.2)", border:"1px dashed rgba(255,255,255,0.6)", borderRadius:3, padding:"1px 10px", color:"#fff", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit", fontWeight:600, marginLeft:4 }}>+ Add</button>}
      </div>

      {/* Body */}
      <div style={{ padding:"24px 32px" }}>
        {/* Summary */}
        <div style={{ marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ background:darkBg, color:"#fff", fontSize:fz*0.7, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", padding:"3px 10px", borderRadius:3 }}>Summary</div>
            <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
          </div>
          <div style={{ border:eb, borderRadius:4 }}>
            <EditableField value={data.summary} onChange={v=>update("summary",v)} editMode={editMode} multiline
              style={{ fontSize:fz*0.9, color:"#374151", lineHeight:1.7 }} />
          </div>
        </div>

        {/* Experience */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ background:darkBg, color:"#fff", fontSize:fz*0.7, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", padding:"3px 10px", borderRadius:3 }}>Experience</div>
            <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
          </div>
          {data.experience.map((exp,i)=>(
            <div key={i} style={{ marginBottom:16, border:eb, padding:editMode?6:0, borderRadius:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#f8fafc", padding:"8px 12px", borderLeft:`4px solid ${accent}`, borderRadius:"0 6px 6px 0", marginBottom:8 }}>
                <div>
                  <EditableField value={exp.company} onChange={v=>updateExp(i,"company",v)} editMode={editMode} style={{ fontWeight:700, fontSize:fz*1.02, color:"#111", textTransform:"uppercase", letterSpacing:"0.5px" }} />
                  <EditableField value={exp.role} onChange={v=>updateExp(i,"role",v)} editMode={editMode} style={{ fontSize:fz*0.82, color:accent, fontWeight:600, display:"block", marginTop:2 }} />
                </div>
                <EditableField value={exp.period} onChange={v=>updateExp(i,"period",v)} editMode={editMode} style={{ fontSize:fz*0.8, color:"#888", whiteSpace:"nowrap", fontWeight:500 }} />
              </div>
              <ul style={{ margin:0, paddingLeft:0, listStyle:"none" }}>
                {exp.bullets.map((b,j)=>(
                  <li key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:5, padding:"3px 0" }}>
                    <div style={{ width:18, height:18, borderRadius:4, background:accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <span style={{ color:"#fff", fontSize:8, fontWeight:700 }}>✓</span>
                    </div>
                    <EditableField value={b} onChange={v=>updateBullet(i,j,v)} editMode={editMode} multiline style={{ fontSize:fz*0.87, color:"#444", flex:1, lineHeight:1.6 }} />
                    {editMode && <span onClick={()=>removeBullet(i,j)} style={{ cursor:"pointer", color:"#ef4444", fontWeight:700, fontSize:13, flexShrink:0, marginTop:2 }}>×</span>}
                  </li>
                ))}
              </ul>
              {editMode && <button onClick={()=>addBullet(i)} style={{ marginTop:6, background:"transparent", border:`1px dashed ${accent}`, color:accent, borderRadius:4, padding:"2px 10px", cursor:"pointer", fontSize:fz*0.78, fontFamily:"inherit" }}>+ Add bullet</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  THEME SELECTOR CARD
// ─────────────────────────────────────────────────────────────
function ThemeCard({ name, selected, onClick }) {
  const cfg = THEME_CONFIGS[name];
  return (
    <div onClick={onClick} style={{
      border: selected ? "2px solid #1e3a5f" : "1.5px solid #e2e8f0",
      borderRadius: 8, padding:"8px 10px", cursor:"pointer",
      background: selected ? "#eff6ff" : "#fafafa",
      transition:"all 0.15s", marginBottom:6,
      outline: selected ? "2px solid #93c5fd" : "none",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontWeight:700, fontSize:12, color: selected ? "#1e3a5f" : "#374151" }}>{name}</span>
        {selected && <span style={{ fontSize:10, color:"#3b82f6", fontWeight:700 }}>✓ Active</span>}
      </div>
      <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>{cfg.desc}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  REST OF APP (unchanged except theme wired through)
// ─────────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:10 }}>
      {label && <div style={{ fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>}
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%", padding:"7px 10px", borderRadius:7, border:"1px solid #e2e8f0", background:"#f8fafc", fontSize:12, color:"#1e293b", cursor:"pointer" }}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function AIChat({ cvData, onCVUpdate }) {
  const [messages, setMessages] = useState([{
    role:"assistant",
    text:'Hi! I\'m your AI document assistant. Tell me about yourself and I\'ll help build your CV.\n\nTry:\n• "Change my name to Sarah Kim"\n• "Add a skill: Docker"\n• "Update my summary to focus on leadership"',
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);
  const sendMessage = async () => {
    if (!input.trim()||loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev=>[...prev,{role:"user",text:userMsg}]);
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are an AI assistant helping users build and edit their CV/resume inside AdaptDoc.
The current CV data is:
${JSON.stringify(cvData,null,2)}
When the user asks to update anything, respond with:
1. A short friendly confirmation message
2. A JSON block wrapped in <cv_update></cv_update> tags with the FULL updated CV object
The CV object structure must be exactly:
{"name":string,"title":string,"location":string,"email1":string,"email2":string,"summary":string,"skills":[strings],"experience":[{"company":string,"role":string,"period":string,"bullets":[strings]}]}
If the user is just chatting, respond conversationally without a <cv_update> block.`,
          messages:[{role:"user",content:userMsg}]
        })
      });
      const data = await response.json();
      const fullText = data.content?.map(c=>c.text||"").join("")||"Sorry, I could not process that.";
      const cvMatch = fullText.match(/<cv_update>([\s\S]*?)<\/cv_update>/);
      if (cvMatch) { try { onCVUpdate(JSON.parse(cvMatch[1].trim())); } catch(e){} }
      const displayText = fullText.replace(/<cv_update>[\s\S]*?<\/cv_update>/g,"").trim();
      setMessages(prev=>[...prev,{role:"assistant",text:displayText}]);
    } catch(err) {
      setMessages(prev=>[...prev,{role:"assistant",text:"Something went wrong. Please try again."}]);
    }
    setLoading(false);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:1, marginBottom:10, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
        <span style={{ background:"#3b82f6", color:"#fff", borderRadius:4, padding:"1px 6px", fontSize:10 }}>AI</span>
        Document Assistant
      </div>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, minHeight:0, paddingRight:2 }}>
        {messages.map((msg,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"90%", background:msg.role==="user"?"#1e3a5f":"#f1f5f9", color:msg.role==="user"?"#fff":"#1e293b", borderRadius:msg.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px", padding:"8px 11px", fontSize:11.5, lineHeight:1.5, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{msg.text}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex", justifyContent:"flex-start" }}><div style={{ background:"#f1f5f9", borderRadius:"12px 12px 12px 2px", padding:"8px 14px", fontSize:18, color:"#94a3b8" }}>···</div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ marginTop:10, display:"flex", gap:6, alignItems:"flex-end", flexShrink:0 }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Ask AI to update your CV..." rows={2}
          style={{ flex:1, padding:"8px 10px", borderRadius:8, border:"1.5px solid #e2e8f0", background:"#f8fafc", fontSize:12, color:"#1e293b", resize:"none", fontFamily:"inherit", lineHeight:1.4, outline:"none" }} />
        <button onClick={sendMessage} disabled={loading||!input.trim()} style={{ background:loading||!input.trim()?"#cbd5e1":"#1e3a5f", color:"#fff", border:"none", borderRadius:8, width:36, height:36, cursor:loading?"not-allowed":"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>➤</button>
      </div>
      <div style={{ fontSize:10, color:"#94a3b8", marginTop:4, textAlign:"center" }}>Enter to send · Shift+Enter for new line</div>
    </div>
  );
}

function CollapsedExportTab({ onOpen, accentColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onOpen} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} title="Open Export Panel"
      style={{ width:36, background:hovered?"#1e3a5f":"#fff", borderLeft:"1px solid #e2e8f0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, cursor:"pointer", flexShrink:0, transition:"background 0.18s" }}>
      <div style={{ writingMode:"vertical-rl", textOrientation:"mixed", transform:"rotate(180deg)", fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:hovered?"#93c5fd":"#64748b", transition:"color 0.18s", userSelect:"none", marginBottom:6 }}>Export</div>
      <div style={{ width:26, height:26, borderRadius:7, background:hovered?"#3b82f6":`${accentColor}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transition:"background 0.18s" }}>⬇</div>
      <div style={{ fontSize:10, color:hovered?"#60a5fa":"#94a3b8", transition:"color 0.18s" }}>◀</div>
    </div>
  );
}

function CreateDocument() {
  const cvPreviewRef = useRef(null);
  const [category,    setCategory]    = useState("CV");
  const [theme,       setTheme]       = useState("Modern");
  const [fontSize,    setFontSize]    = useState("12 pt");
  const [accentColor, setAccentColor] = useState("#1e3a5f");
  const [cvData,      setCvData]      = useState(defaultCV);
  const [editMode,    setEditMode]    = useState(false);
  const [pdfLoading,  setPdfLoading]  = useState(false);
  const [wordLoading, setWordLoading] = useState(false);
  const [exportOpen,  setExportOpen]  = useState(true);

  const handleDownloadPDF = async () => {
    const element = cvPreviewRef.current;
    if (!element) return;
    setPdfLoading(true);
    const badge = element.querySelector('[style*="fef3c7"]');
    if (badge) badge.style.display = "none";
    try {
      if (!window.html2canvas) await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
      if (!window.jspdf) await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
      const canvas = await window.html2canvas(element,{scale:2,useCORS:true,backgroundColor:"#ffffff",removeContainer:true});
      if (badge) badge.style.display="";
      const imgData=canvas.toDataURL("image/png");
      const {jsPDF}=window.jspdf;
      const pdf=new jsPDF("p","mm","a4");
      const pw=pdf.internal.pageSize.getWidth(), ph=pdf.internal.pageSize.getHeight();
      const ih=(canvas.height*pw)/canvas.width;
      let hl=ih,pos=0;
      pdf.addImage(imgData,"PNG",0,pos,pw,ih); hl-=ph;
      while(hl>0){pos-=ph;pdf.addPage();pdf.addImage(imgData,"PNG",0,pos,pw,ih);hl-=ph;}
      pdf.save(`${cvData.name.replace(/\s+/g,"_")}_CV.pdf`);
    } catch(err) { if(badge)badge.style.display=""; alert("PDF export failed."); }
    setPdfLoading(false);
  };

  const handleDownloadWord = async () => {
    setWordLoading(true);
    try {
      const ac=accentColor.replace("#","");
      const doc=new Document({sections:[{properties:{},children:[
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:cvData.name,bold:true,size:36,color:"1e3a5f"})],spacing:{after:80}}),
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:cvData.title,size:22,color:"555555"})],spacing:{after:60}}),
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:`${cvData.location}  |  ${cvData.email1}  |  ${cvData.email2}`,size:18,color:"777777"})],spacing:{after:200}}),
        new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"1e3a5f"}},spacing:{after:160}}),
        new Paragraph({children:[new TextRun({text:"SUMMARY",bold:true,size:22,color:"1e3a5f"})],spacing:{after:80}}),
        new Paragraph({children:[new TextRun({text:cvData.summary,size:20,color:"333333"})],spacing:{after:200}}),
        new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"1e3a5f"}},children:[new TextRun({text:"KEY SKILLS",bold:true,size:22,color:"1e3a5f"})],spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:cvData.skills.join("   •   "),size:20,color:"333333"})],spacing:{after:200}}),
        new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"1e3a5f"}},children:[new TextRun({text:"PROFESSIONAL EXPERIENCE",bold:true,size:22,color:"1e3a5f"})],spacing:{after:120}}),
        ...cvData.experience.flatMap(exp=>[
          new Paragraph({children:[new TextRun({text:exp.company,bold:true,size:22}),new TextRun({text:`   ${exp.period}`,size:18,color:"777777"})],spacing:{after:60}}),
          new Paragraph({children:[new TextRun({text:exp.role,size:20,color:ac,italics:true})],spacing:{after:80}}),
          ...exp.bullets.map(b=>new Paragraph({bullet:{level:0},children:[new TextRun({text:b,size:19,color:"444444"})],spacing:{after:60}})),
          new Paragraph({spacing:{after:120}}),
        ]),
      ]}]});
      const blob=await Packer.toBlob(doc);
      saveAs(blob,`${cvData.name.replace(/\s+/g,"_")}_CV.docx`);
    } catch(err){alert("Word export failed.");}
    setWordLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:20, background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"10px 24px", flexShrink:0 }}>
        <span style={{ fontSize:11, color:"#94a3b8", whiteSpace:"nowrap" }}>Dashboard /&nbsp;<span style={{ color:"#1e3a5f", fontWeight:600 }}>Editing Document</span></span>
        <div style={{ flex:1 }} />
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:0.5, whiteSpace:"nowrap" }}>Category</span>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{ padding:"6px 12px", borderRadius:7, border:"1px solid #e2e8f0", background:"#f8fafc", fontSize:12, color:"#1e293b", cursor:"pointer", minWidth:120 }}>
            {CATEGORIES_CV.map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <button style={{ background:"#1e3a5f", color:"#fff", border:"none", borderRadius:7, padding:"7px 18px", cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>💾 Save Draft</button>
      </div>

      
      
      <div style={{ display:"flex", flex:1, minHeight:0 }}>
        <div style={{ width:250, background:"#fff", borderRight:"1px solid #e2e8f0", padding:"16px", display:"flex", flexDirection:"column", flexShrink:0, minHeight:0 }}>
          <AIChat cvData={cvData} onCVUpdate={setCvData} />
        </div>

        <div style={{ flex:1, background:"#f8fafc", overflowY:"auto", padding:"24px 28px" }}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
            <button onClick={()=>setEditMode(p=>!p)} style={{ background:editMode?"#f59e0b":"#fff", color:editMode?"#fff":"#1e3a5f", border:editMode?"none":"1.5px solid #1e3a5f", borderRadius:8, padding:"7px 18px", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6, boxShadow:"0 1px 4px #0001", transition:"all 0.15s" }}>
              {editMode ? "✅ Done Editing" : "✏ Edit CV"}
            </button>
          </div>
          <div ref={cvPreviewRef} style={{ background:"#fff", borderRadius:12, boxShadow:editMode?"0 0 0 2px #f59e0b, 0 4px 24px #0000000d":"0 4px 24px #0000000d", overflow:"hidden", transition:"box-shadow 0.3s ease", position:"relative" }}>
            <CVPreview data={cvData} onDataChange={setCvData} theme={theme} fontSize={fontSize} accentColor={accentColor} editMode={editMode} />
          </div>
        </div>

        {exportOpen ? (
          <div style={{ width:230, background:"#fff", borderLeft:"1px solid #e2e8f0", padding:"20px 16px", flexShrink:0, overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>Export</span>
              <button onClick={()=>setExportOpen(false)} style={{ background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:6, width:26, height:26, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#64748b", padding:0 }}
                onMouseEnter={e=>{e.currentTarget.style.background="#e2e8f0";}} onMouseLeave={e=>{e.currentTarget.style.background="#f1f5f9";}}>▶</button>
            </div>

            {/* Theme cards replacing old dropdown */}
             <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Theme</div>
          {THEME_LIST.map(t=><ThemeCard key={t} name={t} selected={theme===t} onClick={()=>setTheme(t)} />)}
             </div>

            <SelectField label="Font Size" value={fontSize} onChange={setFontSize} options={FONT_SIZES} />

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#64748b", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Accent Color</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {COLOR_SCHEMES.map(c=>(
                  <div key={c} onClick={()=>setAccentColor(c)} style={{ width:24, height:24, borderRadius:6, background:c, cursor:"pointer", border:accentColor===c?"2.5px solid #1e3a5f":"2px solid transparent", outline:accentColor===c?"2px solid #93c5fd":"none", transition:"all 0.15s" }} />
                ))}
              </div>
            </div>

            {/* Mini preview */}
            <div style={{ border:"1px solid #e2e8f0", borderRadius:8, overflow:"hidden", marginBottom:14, height:110, position:"relative" }}>
              <div style={{ transform:"scale(0.33)", transformOrigin:"top left", width:"303%", pointerEvents:"none" }}>
                <CVPreview data={cvData} onDataChange={()=>{}} theme={theme} fontSize={fontSize} accentColor={accentColor} editMode={false} />
              </div>
            </div>

            <button onClick={handleDownloadPDF} disabled={pdfLoading} style={{ width:"100%", background:pdfLoading?"#86efac":"#16a34a", color:"#fff", border:"none", borderRadius:8, padding:"11px 0", cursor:pdfLoading?"not-allowed":"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"background 0.2s" }}>
              {pdfLoading?"⏳ Downloading...":"⬇ Download PDF"}
            </button>
            <button onClick={handleDownloadWord} disabled={wordLoading} style={{ width:"100%", background:wordLoading?"#93c5fd":"#2563eb", color:"#fff", border:"none", borderRadius:8, padding:"11px 0", cursor:wordLoading?"not-allowed":"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:8, transition:"background 0.2s" }}>
              {wordLoading?"⏳ Downloading...":"📝 Download Word"}
            </button>
          </div>
        ) : (
          <CollapsedExportTab onOpen={()=>setExportOpen(true)} accentColor={accentColor} />
        )}
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const docs=[{title:"Michael Ochieng - CV",template:"Modern Professional",date:"Mar 1, 2026"},{title:"Cover Letter - Tech Solutions",template:"Classic Elegant",date:"Feb 28, 2026"}];
  return (
    <div style={{ padding:"32px 40px" }}>
      <h2 style={{ fontSize:24, fontWeight:700, color:"#1e3a5f", marginBottom:4 }}>Dashboard</h2>
      <p style={{ color:"#64748b", marginBottom:28 }}>Welcome back! Manage your documents below.</p>
      <div style={{ display:"flex", gap:16, marginBottom:32 }}>
        {[["Total Docs","2"],["Exports","1"],["Drafts","1"]].map(([label,val])=>(
          <div key={label} style={{ flex:1, background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 24px", boxShadow:"0 1px 4px #0001" }}>
            <div style={{ fontSize:28, fontWeight:800, color:"#1e3a5f" }}>{val}</div>
            <div style={{ fontSize:13, color:"#94a3b8", marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <span style={{ fontWeight:700, color:"#1e3a5f" }}>Recent Documents</span>
        <button onClick={()=>onNavigate("create")} style={{ background:"#1e3a5f", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:13, fontWeight:600 }}>+ New Document</button>
      </div>
      {docs.map((d,i)=>(
        <div key={i} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"14px 20px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:600, color:"#1e293b" }}>{d.title}</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{d.template} · {d.date}</div>
          </div>
          <button onClick={()=>onNavigate("create")} style={{ background:"#f1f5f9", border:"none", borderRadius:6, padding:"6px 14px", cursor:"pointer", fontSize:12, color:"#475569" }}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default function AdaptDoc() {
  const [activeTab, setActiveTab] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#f1f5f9", overflow:"hidden" }}>
      <div style={{ width:sidebarOpen?210:56, background:"#1e3a5f", display:"flex", flexDirection:"column", transition:"width 0.2s ease", overflow:"hidden", flexShrink:0 }}>
        <div style={{ padding:"16px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #ffffff20" }}>
          <div style={{ width:30, height:30, background:"#3b82f6", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14, flexShrink:0 }}>AT</div>
          {sidebarOpen && <span style={{ color:"#fff", fontWeight:700, fontSize:15, whiteSpace:"nowrap" }}>AdaptDoc</span>}
        </div>
        <nav style={{ flex:1, padding:"12px 8px" }}>
          {SIDEBAR_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setActiveTab(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 10px", marginBottom:2, background:activeTab===item.id?"#ffffff20":"transparent", border:"none", borderLeft:activeTab===item.id?"3px solid #60a5fa":"3px solid transparent", borderRadius:8, cursor:"pointer", color:activeTab===item.id?"#fff":"#93c5fd", fontSize:13, fontWeight:activeTab===item.id?600:400, textAlign:"left", whiteSpace:"nowrap", transition:"all 0.15s" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"12px 10px", borderTop:"1px solid #ffffff20", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"#3b82f6", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700, flexShrink:0 }}>MO</div>
          {sidebarOpen && <span style={{ color:"#93c5fd", fontSize:12 }}>Michael Ochieng</span>}
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 20px", height:50, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={()=>setSidebarOpen(p=>!p)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#64748b" }}>☰</button>
            <span style={{ fontWeight:700, color:"#1e3a5f", fontSize:15 }}>AdaptDoc</span>
          </div>
          <div style={{ display:"flex", gap:14, color:"#94a3b8", fontSize:16 }}>
            <span style={{ cursor:"pointer" }}>✉</span>
            <span style={{ cursor:"pointer" }}>🔔</span>
            <span style={{ cursor:"pointer" }}>⬡</span>
          </div>
        </div>
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {activeTab==="dashboard" && <Dashboard onNavigate={setActiveTab} />}
          {activeTab==="create" && <CreateDocument />}
          {activeTab==="documents" && <div style={{ padding:40 }}><h2 style={{ color:"#1e3a5f", marginBottom:8 }}>My Documents</h2><p style={{ color:"#64748b" }}>Your saved documents will appear here.</p></div>}
          {activeTab==="settings" && <div style={{ padding:40 }}><h2 style={{ color:"#1e3a5f", marginBottom:8 }}>Settings</h2><p style={{ color:"#64748b" }}>Account settings and preferences.</p></div>}
        </div>
      </div>
    </div>
  );
}