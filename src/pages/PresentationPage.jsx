import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const C = {
  orange: "#F77F00",
  orangeLight: "#FFAD4E",
  orangeDark: "#C46200",
  green: "#009A44",
  greenLight: "#00C45A",
  greenDark: "#006B30",
  white: "#FFFFFF",
  cream: "#FFF9F0",
  gold: "#D4A017",
  dark: "#111",
  darkBg: "#0d1a0f",
};

const SLIDES = ["cover", "overview", "results", "breakdown", "map", "next"];

function FlagStripes({ vertical = false, opacity = 0.12 }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
      }}
    >
      {[C.orange, C.white, C.green].map((c, i) => (
        <div key={i} style={{ flex: 1, background: c }} />
      ))}
    </div>
  );
}

function ElephantSVG({ size = 120, color = C.orange, opacity = 1 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <ellipse cx="95" cy="120" rx="60" ry="45" fill={color} />
      <ellipse cx="130" cy="90" rx="38" ry="35" fill={color} />
      <circle cx="148" cy="78" r="9" fill="white" opacity="0.85" />
      <circle cx="150" cy="78" r="5" fill="#1a1a1a" />
      <path
        d="M120 118 Q112 148 104 162 Q98 172 100 178"
        stroke={C.orangeDark}
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M68 140 L62 172" stroke={C.orangeDark} strokeWidth="10" strokeLinecap="round" />
      <path d="M82 144 L78 176" stroke={C.orangeDark} strokeWidth="10" strokeLinecap="round" />
      <path d="M108 140 L104 172" stroke={C.orangeDark} strokeWidth="10" strokeLinecap="round" />
      <path d="M122 138 L118 170" stroke={C.orangeDark} strokeWidth="10" strokeLinecap="round" />
      <path
        d="M130 90 Q140 68 152 64 Q166 60 162 76"
        stroke={C.orangeDark}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M93 82 Q88 70 84 68" stroke={color} strokeWidth="3" fill="none" />
    </svg>
  );
}

function CocoaPod({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="45" rx="18" ry="28" fill="#8B4513" opacity="0.85" />
      <ellipse cx="40" cy="45" rx="10" ry="22" fill="#A0522D" opacity="0.5" />
      <path d="M40 17 Q44 8 40 4 Q36 8 40 17" fill="#009A44" />
      <line x1="28" y1="35" x2="52" y2="35" stroke="#6B3410" strokeWidth="1.5" opacity="0.6" />
      <line x1="26" y1="43" x2="54" y2="43" stroke="#6B3410" strokeWidth="1.5" opacity="0.6" />
      <line x1="28" y1="51" x2="52" y2="51" stroke="#6B3410" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function StatCard({ label, value, accent, icon }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "22px 20px",
        border: `1px solid ${accent}40`,
        textAlign: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div
        style={{
          fontSize: 38,
          fontWeight: "bold",
          color: accent,
          lineHeight: 1,
          fontFamily: "Georgia, serif",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.65)",
          marginTop: 6,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function BarChart({ data, total }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map(({ label, count }, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 140,
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {label}
          </div>
          <div
            style={{
              flex: 1,
              height: 22,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 11,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 11,
                width: `${total ? (count / max) * 100 : 0}%`,
                background: `linear-gradient(90deg, ${C.orange}, ${C.green})`,
                transition: "width 1s ease",
              }}
            />
          </div>
          <div style={{ width: 28, fontSize: 13, color: C.orangeLight, fontWeight: "bold" }}>
            {count}
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ slices, size = 120 }) {
  let cumulative = 0;
  const total = slices.reduce((s, sl) => s + sl.value, 0);

  const paths = slices.map((sl) => {
    if (total === 0) return null;

    const pct = sl.value / total;
    const start = cumulative;
    cumulative += pct;
    const a1 = start * 2 * Math.PI - Math.PI / 2;
    const a2 = cumulative * 2 * Math.PI - Math.PI / 2;
    const r = size / 2;
    const x1 = r + r * Math.cos(a1);
    const y1 = r + r * Math.sin(a1);
    const x2 = r + r * Math.cos(a2);
    const y2 = r + r * Math.sin(a2);
    const large = pct > 0.5 ? 1 : 0;

    return (
      <path
        key={sl.label}
        d={`M${r},${r} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
        fill={sl.color}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: "50%" }}>
      {total === 0 ? (
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill="rgba(255,255,255,0.1)" />
      ) : (
        paths
      )}
    </svg>
  );
}

function SlideTitle({ icon, title, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, position: "relative", zIndex: 1 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: "bold", color, fontFamily: "Georgia, serif" }}>
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: 2,
          background: `linear-gradient(90deg, ${color}60, transparent)`,
          borderRadius: 1,
          marginLeft: 8,
        }}
      />
    </div>
  );
}

export default function PresentationPage() {
  const [slide, setSlide] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("survey_responses")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (error) throw error;
        setResponses(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const total = responses.length;
  const totalTickets = responses.reduce((s, r) => s + (parseInt(r.party_size, 10) || 1), 0);
  const attended = responses.filter((r) => r.attended_before === "Yes").length;
  const travelYes = responses.filter(
    (r) => r.travel_ready === "Yes, definitely" || r.travel_ready === "Likely yes"
  ).length;

  const countBy = (key) => {
    const m = {};
    responses.forEach((r) => {
      if (r[key]) m[r[key]] = (m[r[key]] || 0) + 1;
    });
    return m;
  };

  const ageData = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"].map((a) => ({
    label: a,
    count: countBy("age_group")[a] || 0,
  }));

  const connectionData = [
    "Ivorian national",
    "Ivorian diaspora",
    "Family ties",
    "Fan of the team",
    "General football fan",
  ].map((l) => ({
    label: l,
    count: countBy("ci_connection")[l] || 0,
  }));

  const heardData = [
    "Social Media",
    "Friend / Family",
    "Community Organization",
    "Email Newsletter",
    "Radio / TV",
    "Other",
  ].map((l) => ({
    label: l,
    count: countBy("heard_from")[l] || 0,
  }));

  const ticketDist = ["1", "2", "3", "4"].map((n) => ({
    label: `${n} ticket${n > 1 ? "s" : ""}`,
    value: responses.filter((r) => r.party_size === n).length,
    color: [C.orange, C.green, C.gold, C.orangeLight][parseInt(n, 10) - 1],
  }));

  const bg = {
    cover: `linear-gradient(145deg, ${C.orangeDark} 0%, #1a0a00 35%, ${C.darkBg} 65%, ${C.greenDark} 100%)`,
    overview: `linear-gradient(160deg, #0d1a0f 0%, #1a2e14 50%, #0a1208 100%)`,
    results: `linear-gradient(155deg, #1a0a00 0%, #2a1200 40%, #0d1a0f 100%)`,
    breakdown: `linear-gradient(160deg, #0a1208 0%, #111 50%, #1a0a00 100%)`,
    map: `linear-gradient(155deg, #1a0600 0%, #0d1a0f 60%, #111 100%)`,
    next: `linear-gradient(145deg, ${C.orangeDark} 0%, #1a0a00 40%, ${C.greenDark} 100%)`,
  };

  const slideKey = SLIDES[slide];

  const renderSlide = () => {
    if (slideKey === "cover") {
      return (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 48px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <FlagStripes opacity={0.08} />
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {[C.orange, C.white, C.green].map((c, i) => (
              <div key={i} style={{ height: 5, width: 80, background: c }} />
            ))}
          </div>
          <div style={{ position: "absolute", bottom: -20, right: -20, opacity: 0.08 }}>
            <ElephantSVG size={280} color={C.white} />
          </div>
          <div style={{ fontSize: 72, marginBottom: 8 }}>🇨🇮</div>
          <div
            style={{
              fontSize: 11,
              color: C.orangeLight,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            République de Côte d'Ivoire
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: C.white,
              margin: "0 0 12px",
              fontFamily: "Georgia, serif",
              lineHeight: 1.2,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            FIFA World Cup 2026
          </h1>
          <h2
            style={{
              fontSize: 20,
              color: C.orangeLight,
              margin: "0 0 24px",
              fontFamily: "Georgia, serif",
              fontWeight: "normal",
            }}
          >
            Community Ticket Initiative — Interest Survey Results
          </h2>
          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "14px 28px",
              border: `1px solid ${C.orange}50`,
              display: "inline-block",
            }}
          >
            <p style={{ margin: 0, color: C.white, fontSize: 15 }}>
              🏟️ Philadelphia, PA · <strong>June 25, 2026</strong> · Group Stage
            </p>
          </div>
          <div style={{ marginTop: 32, display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
            <CocoaPod size={36} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Presented to
              </div>
              <div style={{ fontSize: 14, color: C.white, fontFamily: "Georgia, serif" }}>
                Minister of Sports · Côte d'Ivoire
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{now}</div>
            </div>
            <CocoaPod size={36} />
          </div>
        </div>
      );
    }

    if (slideKey === "overview") {
      return (
        <div style={{ flex: 1, padding: "32px 40px", position: "relative", overflow: "hidden" }}>
          <FlagStripes opacity={0.05} />
          <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.06 }}>
            <ElephantSVG size={260} color={C.white} />
          </div>
          <SlideTitle icon="🌍" title="About the Initiative" color={C.orangeLight} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
            {[
              {
                icon: "🎟️",
                title: "Free Tickets",
                desc: "Complimentary match tickets gifted by the Ivorian sports delegation to community members and diaspora across the United States.",
              },
              {
                icon: "🏟️",
                title: "The Venue",
                desc: "Lincoln Financial Field, Philadelphia — hosting Côte d'Ivoire's group stage appearance at the 2026 FIFA World Cup on June 25.",
              },
              {
                icon: "🤝",
                title: "Community Focus",
                desc: "Priority given to Ivorian nationals, diaspora members, and dedicated supporters of Les Éléphants.",
              },
              {
                icon: "📊",
                title: "This Survey",
                desc: "Interest was collected via digital form to gauge demand, eligibility, and geographic reach of the initiative.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 14,
                  padding: 20,
                  border: `1px solid rgba(247,127,0,0.2)`,
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                <div
                  style={{
                    color: C.orangeLight,
                    fontSize: 15,
                    fontWeight: "bold",
                    marginBottom: 6,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {title}
                </div>
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              background: `linear-gradient(90deg, ${C.orange}22, ${C.green}22)`,
              borderRadius: 12,
              padding: "14px 20px",
              border: `1px solid ${C.green}40`,
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 20 }}>🐘</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontStyle: "italic" }}>
              Les Éléphants have qualified for the 2026 World Cup, marking a triumphant return to football's grandest stage for the pride of Côte d'Ivoire.
            </span>
          </div>
        </div>
      );
    }

    if (slideKey === "results") {
      return (
        <div style={{ flex: 1, padding: "32px 40px", position: "relative" }}>
          <FlagStripes opacity={0.05} />
          <SlideTitle icon="📊" title="Survey Summary" color={C.orangeLight} />
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 40, textAlign: "center" }}>
              Loading responses…
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 24 }}>
                <StatCard label="Total Responses" value={total} accent={C.orange} icon="📋" />
                <StatCard label="Tickets Requested" value={totalTickets} accent={C.orangeLight} icon="🎟️" />
                <StatCard label="Travel Confirmed" value={travelYes} accent={C.green} icon="✈️" />
                <StatCard label="Prior WC Attendees" value={attended} accent={C.gold} icon="🏆" />
              </div>
              <div style={{ marginTop: 26 }}>
                <div
                  style={{
                    color: C.orangeLight,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 14,
                  }}
                >
                  How did respondents hear about this?
                </div>
                <BarChart data={heardData} total={total} />
              </div>
              {total === 0 && (
                <div style={{ marginTop: 20, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  No survey submissions yet. Submit the survey form to see live results here.
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    if (slideKey === "breakdown") {
      return (
        <div style={{ flex: 1, padding: "32px 40px", position: "relative" }}>
          <FlagStripes opacity={0.05} />
          <SlideTitle icon="🔍" title="Respondent Breakdown" color={C.greenLight} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
            <div>
              <div
                style={{
                  color: C.greenLight,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                Age Distribution
              </div>
              <BarChart data={ageData} total={total} />
            </div>
            <div>
              <div
                style={{
                  color: C.greenLight,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                Tickets Requested
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <PieChart slices={ticketDist} size={110} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ticketDist.map((sl) => (
                    <div key={sl.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: sl.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                        {sl.label}: <strong style={{ color: sl.color }}>{sl.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    color: C.greenLight,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Connection to Côte d'Ivoire
                </div>
                <BarChart data={connectionData} total={total} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (slideKey === "map") {
      return (
        <div style={{ flex: 1, padding: "32px 40px", position: "relative", overflow: "hidden" }}>
          <FlagStripes opacity={0.05} />
          <div style={{ position: "absolute", bottom: -10, left: -10, opacity: 0.07 }}>
            <ElephantSVG size={240} color={C.orange} />
          </div>
          <SlideTitle icon="🌍" title="Côte d'Ivoire — The Nation" color={C.gold} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { flag: "🐘", label: "National Symbol", value: "The Elephant (Les Éléphants)" },
                { flag: "🏙️", label: "Capital", value: "Yamoussoukro | Economic hub: Abidjan" },
                { flag: "🌍", label: "Region", value: "West Africa — Gulf of Guinea" },
                { flag: "☕", label: "Top Exports", value: "Cocoa (#1 globally), Coffee, Cashew" },
                { flag: "👥", label: "Population", value: "~30 million · 60+ ethnic groups" },
                { flag: "🏅", label: "Football Heritage", value: "World Cup: 2006, 2010, 2014 + 2026" },
              ].map(({ flag, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{flag}</span>
                  <div>
                    <div style={{ fontSize: 11, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  padding: 20,
                  border: `1px solid ${C.gold}30`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 0,
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 12,
                    height: 70,
                  }}
                >
                  {[C.orange, C.white, C.green].map((c, i) => (
                    <div key={i} style={{ flex: 1, background: c }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>
                  NATIONAL FLAG
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 14,
                  padding: 18,
                  border: `1px solid ${C.orange}30`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <ElephantSVG size={80} color={C.orange} />
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textAlign: "center" }}>
                  NATIONAL ANIMAL — LES ÉLÉPHANTS
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[["🥇", "AFCON 1992"], ["🥇", "AFCON 2015"], ["🌍", "World Cup 2026"]].map(([icon, label]) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      background: `${C.orange}22`,
                      borderRadius: 10,
                      padding: "10px 6px",
                      textAlign: "center",
                      border: `1px solid ${C.orange}40`,
                    }}
                  >
                    <div style={{ fontSize: 20 }}>{icon}</div>
                    <div style={{ fontSize: 10, color: C.orangeLight, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (slideKey === "next") {
      return (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 48px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <FlagStripes opacity={0.08} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            {[C.orange, C.white, C.green].map((c, i) => (
              <div key={i} style={{ height: 5, flex: 1, background: c }} />
            ))}
          </div>
          <SlideTitle icon="🚀" title="Next Steps" color={C.orangeLight} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24, width: "100%" }}>
            {[
              {
                num: "01",
                title: "Review Submissions",
                desc: `Assess all ${total} interest form entries against eligibility criteria including diaspora status and travel confirmation.`,
                color: C.orange,
              },
              {
                num: "02",
                title: "Select Recipients",
                desc: "Prioritize Ivorian nationals and diaspora, ensuring equitable distribution of the complimentary tickets.",
                color: C.orangeLight,
              },
              {
                num: "03",
                title: "Notify Winners",
                desc: "Contact selected recipients via email and phone at least 3 weeks before the June 25 match.",
                color: C.green,
              },
              {
                num: "04",
                title: "Game Day Coordination",
                desc: "Arrange group meetup in Philadelphia, distribute tickets, and organize a pre-match community event.",
                color: C.greenLight,
              },
            ].map(({ num, title, desc, color }) => (
              <div
                key={num}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  border: `1px solid ${color}40`,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: `${color}60`,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color,
                    fontWeight: "bold",
                    margin: "6px 0 8px",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>🇨🇮</span>
            <span
              style={{
                fontSize: 16,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "Georgia, serif",
              }}
            >
              "Allez les Éléphants — ensemble, nous sommes forts."
            </span>
            <span style={{ fontSize: 28 }}>⚽</span>
          </div>
        </div>
      );
    }

    return null;
  };

  const titles = ["Welcome", "Initiative", "Results", "Breakdown", "Country", "Next Steps"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Georgia', serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          background: bg[slideKey] || bg.cover,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.orange}30`,
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          transition: "background 0.5s",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 24px",
            background: "rgba(0,0,0,0.35)",
            borderBottom: `1px solid rgba(247,127,0,0.2)`,
          }}
        >
          <div style={{ display: "flex", gap: 3 }}>
            {[C.orange, C.white, C.green].map((c, i) => (
              <div key={i} style={{ width: 20, height: 4, background: c, borderRadius: 2, opacity: 0.9 }} />
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Côte d'Ivoire · World Cup 2026 · {now}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {slide + 1} / {SLIDES.length}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", color: C.white, position: "relative" }}>
          {renderSlide()}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}>
        <button
          onClick={() => setSlide((s) => Math.max(0, s - 1))}
          disabled={slide === 0}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: slide === 0 ? "rgba(255,255,255,0.05)" : C.orange,
            color: C.white,
            border: "none",
            cursor: slide === 0 ? "default" : "pointer",
            fontSize: 14,
            opacity: slide === 0 ? 0.4 : 1,
            transition: "all 0.2s",
          }}
        >
          ‹ Prev
        </button>

        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: i === slide ? C.orange : "rgba(255,255,255,0.25)",
              transition: "all 0.2s",
              padding: 0,
            }}
          />
        ))}

        <button
          onClick={() => setSlide((s) => Math.min(SLIDES.length - 1, s + 1))}
          disabled={slide === SLIDES.length - 1}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: slide === SLIDES.length - 1 ? "rgba(255,255,255,0.05)" : C.green,
            color: C.white,
            border: "none",
            cursor: slide === SLIDES.length - 1 ? "default" : "pointer",
            fontSize: 14,
            opacity: slide === SLIDES.length - 1 ? 0.4 : 1,
            transition: "all 0.2s",
          }}
        >
          Next ›
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        {titles.map((t, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              background: i === slide ? `${C.orange}33` : "transparent",
              color: i === slide ? C.orangeLight : "rgba(255,255,255,0.4)",
              border: `1px solid ${i === slide ? C.orange : "transparent"}`,
              fontSize: 11,
              cursor: "pointer",
              letterSpacing: "0.06em",
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}