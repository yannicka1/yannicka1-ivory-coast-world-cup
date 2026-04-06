import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const COLORS = {
  orange: "#F77F00",
  orangeLight: "#FF9A2E",
  orangeDark: "#C86200",
  green: "#009A44",
  greenLight: "#00C457",
  greenDark: "#007030",
  white: "#FFFFFF",
  offWhite: "#FFF8F0",
  text: "#1A1A1A",
  textMuted: "#555",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  border: `2px solid #e0d8cc`,
  fontSize: 15,
  fontFamily: "Georgia, serif",
  background: "#fffdf9",
  color: COLORS.text,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontFamily: "'Georgia', serif",
  fontWeight: "bold",
  fontSize: 13,
  color: COLORS.orangeDark,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
};

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: COLORS.orange }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const questions = [
  {
    id: "heard_from",
    label: "How did you hear about this opportunity?",
    options: [
      "Social Media",
      "Friend / Family",
      "Community Organization",
      "Email Newsletter",
      "Radio / TV",
      "Other",
    ],
  },
  {
    id: "attended_before",
    label: "Have you attended a World Cup match before?",
    options: ["Yes", "No"],
  },
  {
    id: "travel_ready",
    label: "Are you able to travel to Philadelphia on June 25?",
    options: ["Yes, definitely", "Likely yes", "Not sure yet", "Probably not"],
  },
  {
    id: "party_size",
    label: "How many tickets are you requesting? (max 4)",
    options: ["1", "2", "3", "4"],
  },
  {
    id: "age_group",
    label: "Age group",
    options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"],
  },
  {
    id: "ci_connection",
    label: "What is your connection to Côte d'Ivoire?",
    options: [
      "Ivorian national",
      "Ivorian diaspora",
      "Family ties",
      "Fan of the team",
      "General football fan",
    ],
  },
];

export default function SurveyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setA = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim() || !form.email.includes("@")) e.email = true;
    questions.forEach((q) => {
      if (!answers[q.id]) e[q.id] = true;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const entry = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        heard_from: answers.heard_from,
        attended_before: answers.attended_before,
        travel_ready: answers.travel_ready,
        party_size: answers.party_size,
        age_group: answers.age_group,
        ci_connection: answers.ci_connection,
      };

      const { error } = await supabase.from("survey_responses").insert([entry]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const Elephant = () => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="50" cy="58" rx="30" ry="22" fill={COLORS.orange} opacity="0.9" />
      <ellipse cx="68" cy="44" rx="18" ry="16" fill={COLORS.orange} opacity="0.9" />
      <circle cx="75" cy="39" r="4" fill={COLORS.white} opacity="0.8" />
      <circle cx="76" cy="39" r="2" fill={COLORS.text} />
      <path
        d="M62 58 Q58 75 54 80 Q50 85 52 88"
        stroke={COLORS.orangeDark}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M35 70 L32 85" stroke={COLORS.orangeDark} strokeWidth="5" strokeLinecap="round" />
      <path d="M43 72 L41 87" stroke={COLORS.orangeDark} strokeWidth="5" strokeLinecap="round" />
      <path d="M57 70 L55 85" stroke={COLORS.orangeDark} strokeWidth="5" strokeLinecap="round" />
      <path d="M65 70 L63 85" stroke={COLORS.orangeDark} strokeWidth="5" strokeLinecap="round" />
      <path
        d="M68 44 Q72 35 78 33 Q84 31 82 38"
        stroke={COLORS.orangeDark}
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(160deg, ${COLORS.orange} 0%, ${COLORS.orangeDark} 40%, ${COLORS.green} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: COLORS.white,
            borderRadius: 20,
            padding: "48px 40px",
            maxWidth: 480,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 16 }}>🇨🇮</div>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              color: COLORS.green,
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            Thank You!
          </h2>
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: COLORS.textMuted,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Your interest has been registered. The Ivorian sports delegation will
            review all submissions and reach out if you are selected for
            complimentary tickets to the <strong>Côte d'Ivoire World Cup match in
            Philadelphia on June 25</strong>.
          </p>
          <div
            style={{
              marginTop: 28,
              padding: "16px 24px",
              background: COLORS.offWhite,
              borderRadius: 12,
              borderLeft: `4px solid ${COLORS.orange}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "Georgia, serif",
                fontSize: 14,
                color: COLORS.text,
              }}
            >
              🏟️ Philadelphia · June 25 · FIFA World Cup Group Stage
              <br />
              <strong>Côte d'Ivoire 🇨🇮</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, fontFamily: "Georgia, serif" }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orangeDark} 50%, ${COLORS.green} 100%)`,
          padding: "40px 24px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.07,
            backgroundImage:
              "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Elephant />
          <span style={{ fontSize: 48 }}>🇨🇮</span>
          <span style={{ fontSize: 48 }}>⚽</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
          {["#F77F00", "#FFFFFF", "#009A44"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 6,
                background: c,
                borderRadius: 3,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        <h1
          style={{
            color: COLORS.white,
            fontSize: 26,
            fontWeight: "bold",
            margin: "0 0 8px",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            letterSpacing: "0.02em",
          }}
        >
          Côte d'Ivoire World Cup Interest Form
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.92)",
            fontSize: 15,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          🏟️ Philadelphia · June 25 · FIFA World Cup Group Stage
          <br />
          <em>Complimentary ticket opportunity — limited availability</em>
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px 48px" }}>
        <div
          style={{
            background: COLORS.white,
            borderRadius: 16,
            padding: "32px 28px",
            boxShadow: "0 4px 24px rgba(247,127,0,0.1)",
            border: `1px solid rgba(247,127,0,0.15)`,
          }}
        >
          <h3
            style={{
              color: COLORS.orangeDark,
              fontSize: 16,
              marginTop: 0,
              marginBottom: 24,
              borderBottom: `2px solid ${COLORS.orange}`,
              paddingBottom: 10,
            }}
          >
            Personal Information
          </h3>

          <Field label="Full Name" required>
            <input
              style={{ ...inputStyle, borderColor: errors.name ? "red" : "#e0d8cc" }}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Your full name"
            />
          </Field>

          <Field label="Email Address" required>
            <input
              style={{ ...inputStyle, borderColor: errors.email ? "red" : "#e0d8cc" }}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="your@email.com"
            />
          </Field>

          <Field label="Phone Number">
            <input
              style={inputStyle}
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </Field>

          <Field label="City / State of Residence">
            <input
              style={inputStyle}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="e.g. Philadelphia, PA"
            />
          </Field>
        </div>

        <div
          style={{
            background: COLORS.white,
            borderRadius: 16,
            padding: "32px 28px",
            marginTop: 20,
            boxShadow: "0 4px 24px rgba(247,127,0,0.1)",
            border: `1px solid rgba(247,127,0,0.15)`,
          }}
        >
          <h3
            style={{
              color: COLORS.greenDark,
              fontSize: 16,
              marginTop: 0,
              marginBottom: 24,
              borderBottom: `2px solid ${COLORS.green}`,
              paddingBottom: 10,
            }}
          >
            Match & Attendance Details
          </h3>

          {questions.map((q) => (
            <Field key={q.id} label={q.label} required>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {q.options.map((opt) => {
                  const sel = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setA(q.id, opt)}
                      style={{
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: `2px solid ${
                          sel ? COLORS.orange : errors[q.id] ? "red" : "#ddd"
                        }`,
                        background: sel
                          ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`
                          : COLORS.white,
                        color: sel ? COLORS.white : COLORS.text,
                        fontFamily: "Georgia, serif",
                        fontSize: 14,
                        cursor: "pointer",
                        fontWeight: sel ? "bold" : "normal",
                        transition: "all 0.15s",
                        transform: sel ? "scale(1.03)" : "scale(1)",
                        boxShadow: sel
                          ? `0 4px 12px rgba(247,127,0,0.35)`
                          : "none",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </Field>
          ))}
        </div>

        {Object.keys(errors).length > 0 && (
          <p
            style={{
              color: "red",
              fontFamily: "Georgia, serif",
              fontSize: 13,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            Please complete all required fields before submitting.
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            width: "100%",
            marginTop: 24,
            padding: "16px 24px",
            borderRadius: 12,
            background: saving
              ? "#aaa"
              : `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orangeDark} 40%, ${COLORS.green} 100%)`,
            color: COLORS.white,
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            fontSize: 18,
            border: "none",
            cursor: saving ? "default" : "pointer",
            boxShadow: "0 6px 20px rgba(247,127,0,0.35)",
            letterSpacing: "0.03em",
            transition: "transform 0.15s",
            transform: "scale(1)",
          }}
        >
          {saving ? "Submitting…" : "🇨🇮 Submit My Interest"}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 16 }}>
          Allez les Éléphants! · Powered by the Ivorian Sports Delegation
        </p>
      </div>
    </div>
  );
}