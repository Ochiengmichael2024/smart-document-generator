// ─────────────────────────────────────────────────────────────────────────────
// templates/ModernProfessional.jsx
//
// "Modern Professional" resume template for AdaptDoc.
//
// USAGE in AdaptDoc.jsx (or any parent component):
//
//   import ModernProfessional from "./templates/ModernProfessional";
//
//   <ModernProfessional cv={cv} fontFamily={fontFamily} fontSize={fontSize} />
//
// PROPS:
//   cv          {object}  — CV data object (see shape below)
//   fontFamily  {string}  — e.g. "Playfair Display"
//   fontSize    {string}  — e.g. "12 pt"  (numeric string also accepted)
//
// CV DATA SHAPE:
//   {
//     name        : string
//     email       : string          // phone / primary contact
//     email2      : string          // email address
//     location    : string          // city, state
//     experience  : Array<{
//       company   : string
//       role      : string
//       period    : string
//       location? : string          // falls back to cv.location
//       bullets   : string[]
//     }>
//     projects?   : Array<{
//       name    : string
//       bullets : string[]
//     }>
//     education   : Array<{
//       school      : string
//       degree      : string
//       year        : string
//       location?   : string
//       coursework? : string
//     }>
//     skillGroups? : Array<{ label: string; items: string[] }>
//     skills?      : string[]       // used when skillGroups is absent
//   }
// ─────────────────────────────────────────────────────────────────────────────

export default function ModernProfessional({ cv, fontFamily = "Georgia", fontSize = "12 pt" }) {
  const fs = parseInt(fontSize) || 12;

  // ── Shared style tokens ──────────────────────────────────────────────────
  const secHeading = {
    fontSize: `${fs}px`,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#111",
    borderBottom: "1.5px solid #333",
    paddingBottom: 2,
    marginBottom: 8,
    marginTop: 0,
  };

  const flexBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  };

  const companyName = {
    fontWeight: 700,
    fontSize: `${fs}px`,
    color: "#111",
  };

  const dateTxt = {
    fontSize: `${fs * 0.88}px`,
    color: "#333",
    whiteSpace: "nowrap",
    marginLeft: 8,
  };

  const roleItalic = {
    fontStyle: "italic",
    fontSize: `${fs * 0.95}px`,
    color: "#222",
  };

  const locationTxt = {
    fontSize: `${fs * 0.88}px`,
    color: "#333",
    whiteSpace: "nowrap",
    marginLeft: 8,
  };

  const ulStyle = {
    margin: "4px 0 0 0",
    paddingLeft: 20,
    color: "#222",
    fontSize: `${fs * 0.92}px`,
    lineHeight: 1.6,
  };

  const liStyle = { marginBottom: 2 };

  // ── Contact row (pipe-separated, matching screenshot) ────────────────────
  const contactItems = [
    cv.email    && { icon: "📞", text: cv.email },
    cv.email2   && { icon: "✉",  text: cv.email2 },
    cv.username && { icon: "🐦", text: cv.username },
    cv.location && { icon: "📍", text: cv.location },
  ].filter(Boolean);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: `Georgia, '${fontFamily}', serif`,
      fontSize: `${fs}px`,
      lineHeight: 1.55,
      color: "#111",
      background: "#fff",
      padding: "36px 40px",
      minHeight: "600px",
      boxShadow: "0 2px 24px rgba(0,0,0,0.10)",
      borderRadius: "6px",
    }}>

      {/* ── NAME ── */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{
          fontSize: `${fs * 2.1}px`,
          fontWeight: 900,
          letterSpacing: "0.01em",
          color: "#111",
          fontFamily: "Georgia, serif",
        }}>
          {cv.name}
        </div>
      </div>

      {/* ── CONTACT ROW ── */}
      <div style={{
        textAlign: "center",
        fontSize: `${fs * 0.85}px`,
        color: "#333",
        marginBottom: 18,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0 4px",
      }}>
        {contactItems.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {i > 0 && <span style={{ margin: "0 4px", color: "#888" }}>|</span>}
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>

      {/* ── EXPERIENCE ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={secHeading}>EXPERIENCE</div>
        {cv.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={flexBetween}>
              <div style={companyName}>{exp.company}</div>
              <div style={dateTxt}>{exp.period}</div>
            </div>
            <div style={{ ...flexBetween, marginBottom: 3 }}>
              <div style={roleItalic}>{exp.role}</div>
              <div style={locationTxt}>{exp.location || cv.location}</div>
            </div>
            <ul style={ulStyle}>
              {exp.bullets.map((b, j) => (
                <li key={j} style={liStyle}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── PROJECTS (only rendered when cv.projects exists) ── */}
      {cv.projects && cv.projects.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={secHeading}>PROJECTS</div>
          {cv.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={companyName}>{proj.name}</div>
              <ul style={ulStyle}>
                {proj.bullets.map((b, j) => (
                  <li key={j} style={liStyle}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── EDUCATION ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={secHeading}>EDUCATION</div>
        {cv.education.map((e, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={flexBetween}>
              <div style={companyName}>{e.school}</div>
              <div style={dateTxt}>{e.year}</div>
            </div>
            <div style={{ ...flexBetween, marginBottom: 3 }}>
              <div style={roleItalic}>{e.degree}</div>
              {e.location && <div style={locationTxt}>{e.location}</div>}
            </div>
            {e.coursework && (
              <ul style={ulStyle}>
                <li style={liStyle}><strong>Coursework:</strong> {e.coursework}</li>
              </ul>
            )}
            {e.research && (
              <ul style={ulStyle}>
                <li style={liStyle}><strong>Research:</strong> {e.research}</li>
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* ── SKILLS ── */}
      <div style={{ marginBottom: 8 }}>
        <div style={secHeading}>SKILLS</div>
        <div style={{ fontSize: `${fs * 0.92}px`, color: "#222", lineHeight: 1.8 }}>
          {cv.skillGroups ? (
            // Preferred: structured groups e.g. Languages / Tools
            cv.skillGroups.map((grp, i) => (
              <div key={i}>
                <strong>{grp.label} :</strong>{" "}
                <span>{grp.items.join(", ")}</span>
              </div>
            ))
          ) : (
            // Fallback: split skills array roughly in half
            <div>
              <strong>Languages :</strong>{" "}
              {cv.skills.slice(0, Math.ceil(cv.skills.length / 2)).join(", ")}
              <br />
              <strong>Tools :</strong>{" "}
              {cv.skills.slice(Math.ceil(cv.skills.length / 2)).join(", ")}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
