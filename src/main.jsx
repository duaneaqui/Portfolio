import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { animated, useSpring } from "@react-spring/web";
import "./styles.css";

import {
  MAP_WIDTH,
  MAP_HEIGHT,
  nodes,
  supportingStars,
  programmingLanguages,
  arsenalCategories,
  galaxyStars,
  ambientDataNodes,
  numericLabels,
  projectSubnodeOffsets,
} from "./data/portfolioData";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function getCamera(progress, width, height) {
  const isMobile = width <= 720;
  const maxIndex = nodes.length - 1;
  const scaled = progress * maxIndex;
  const roundedIndex = clamp(Math.round(scaled), 0, maxIndex);
  const index = clamp(Math.floor(scaled), 0, maxIndex - 1);
  const local = scaled - index;
  const eased = local * local * (3 - 2 * local);
  const current = isMobile ? nodes[roundedIndex] : nodes[index];
  const next = nodes[index + 1] ?? current;
  const x = isMobile ? current.x : interpolate(current.x, next.x, eased);
  const y = isMobile ? current.y : interpolate(current.y, next.y, eased);
  const baseScale = interpolate(current.zoom, next.zoom, eased);
  const scale = isMobile ? 1 : baseScale;
  const focusX = isMobile ? 0.5 : interpolate(current.focusX ?? 0.38, next.focusX ?? 0.38, eased);
  const focusY = isMobile ? 0.48 : interpolate(current.focusY ?? 0.5, next.focusY ?? 0.5, eased);

  if (isMobile) {
    const panelLeft = width <= 430 ? 14 : 18;
    const panelTop = 76;

    return {
      x: panelLeft - x * scale,
      y: panelTop - y * scale,
      scale,
    };
  }

  return {
    x: width * focusX - x * scale,
    y: height * focusY - y * scale,
    scale,
  };
}

function getProjectSubnodes() {
  const projectNode = nodes.find((node) => node.id === "projects");

  return projectNode.entries.map((entry, index) => {
    const [offsetX, offsetY] = projectSubnodeOffsets[index] ?? [index * 150, -260];

    return {
      ...entry,
      id: `project-${index + 1}`,
      x: projectNode.x + offsetX,
      y: projectNode.y + offsetY,
    };
  });
}

function getProjectFocusCamera(projectName, width, height) {
  const project = getProjectSubnodes().find((subnode) => subnode.name === projectName);

  if (!project) {
    return null;
  }

  const isMobile = width <= 720;
  const scale = isMobile ? 0.96 : 0.84;

  return {
    x: width * (isMobile ? 0.5 : 0.34) - project.x * scale,
    y: height * (isMobile ? 0.42 : 0.48) - project.y * scale,
    scale,
  };
}

function AmbientDataNodes() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <svg className="ambient-lines" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
        {ambientDataNodes.map((node, index) => {
          const target = ambientDataNodes[(index * 7 + 5) % ambientDataNodes.length];

          return (
            <line
              key={node.id}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              className="ambient-line"
            />
          );
        })}
      </svg>
      {ambientDataNodes.map((node) => (
        <div
          key={node.id}
          className={`ambient-data-node ${node.tone}`}
          style={{ left: node.x, top: node.y, width: node.width }}
        >
          <span className="ambient-node-light" />
          <span className="ambient-node-label">{node.label}</span>
          {Array.from({ length: node.lines }, (_, index) => (
            <span
              key={index}
              className="ambient-node-row"
              style={{ width: `${38 + ((index * 23 + node.width) % 58)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function getOverviewCamera(width, height) {
  const scale = Math.min(width / (MAP_WIDTH + 520), height / (MAP_HEIGHT + 260), 0.52);

  return {
    x: width / 2 - (MAP_WIDTH / 2) * scale,
    y: height / 2 - (MAP_HEIGHT / 2) * scale,
    scale,
  };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { progress, viewport };
}

function ConstellationLines({ activeIndex }) {
  return (
    <svg className="constellation-lines" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">
      <defs>
        <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#81f7ff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#e8ffe8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9ae8ff" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {nodes.slice(0, -1).map((node, index) => {
        const next = nodes[index + 1];
        const isCurrent = index === activeIndex || index === activeIndex - 1;
        const isVisited = index < activeIndex - 1;
        return (
          <line
            key={`${node.id}-${next.id}`}
            x1={node.x}
            y1={node.y}
            x2={next.x}
            y2={next.y}
            className={[
              "route-line",
              isCurrent ? "active" : "",
              isVisited ? "visited" : "",
            ].filter(Boolean).join(" ")}
          />
        );
      })}
      {supportingStars.slice(0, 10).map(([x, y], index) => (
        <line
          key={`support-${index}`}
          x1={x}
          y1={y}
          x2={nodes[index % nodes.length].x}
          y2={nodes[index % nodes.length].y}
          className="faint-line"
        />
      ))}
    </svg>
  );
}

function TypeText({ children, delay = 180, duration = 900, className = "" }) {
  const text = typeof children === "string" ? children : "";
  const steps = clamp(text.length, 12, 90);

  return (
    <span
      className={["type-reveal", className].filter(Boolean).join(" ")}
      style={{
        "--type-delay": `${delay}ms`,
        "--type-duration": `${duration}ms`,
        "--type-steps": steps,
      }}
    >
      {children}
    </span>
  );
}

function BioTypeLines({ paragraphs, startDelay = 760 }) {
  const lines = paragraphs.flatMap((paragraph) => (
    paragraph
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
  ));

  return (
    <div className="bio-type-lines">
      {lines.map((line, index) => (
        <p key={`${line}-${index}`}>
          <TypeText delay={startDelay + index * 150} duration={520}>
            {line}
          </TypeText>
        </p>
      ))}
    </div>
  );
}

function IntroProfileCard({ node }) {
  return (
    <article className="intro-dossier">
      <div className="intro-dossier-header">
        <span className="dossier-mark">GD</span>
        <div>
          <span><TypeText delay={220}>PERSONAL RECORD // INTRO NODE</TypeText></span>
          <strong><TypeText delay={420} duration={1200}>{node.profile.fullName}</TypeText></strong>
        </div>
      </div>
      <div className="intro-dossier-grid">
        <section className="profile-record">
          <h2>Record</h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd><TypeText delay={760}>{node.profile.fullName}</TypeText></dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd><TypeText delay={900}>{node.profile.location}</TypeText></dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd><TypeText delay={1040}>{node.profile.education}</TypeText></dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd><TypeText delay={1180}>{node.profile.experience}</TypeText></dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd><TypeText delay={1320}>{node.profile.role}</TypeText></dd>
            </div>
          </dl>
        </section>
        <section className="bio-panel">
          <h2>Bio</h2>
          <BioTypeLines paragraphs={node.profile.bio} />
        </section>
        <section className="hologram-panel" aria-label="Generated hologram portrait">
          <div className="hologram-stage">
            <div className="hologram-scan" />
            <div className="hologram-particles" />
            <img
              className="hologram-photo"
              src="/assets/gerard-hologram.png"
              alt="Gerard Aqui hologram portrait"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        </section>
      </div>
    </article>
  );
}

function TechArsenalCard({ node }) {
  const [activeCategory, setActiveCategory] = useState(arsenalCategories[0].title);
  const selectedCategory = arsenalCategories.find((category) => category.title === activeCategory) ?? arsenalCategories[0];

  return (
    <article className="tech-arsenal">
      <div className="arsenal-header">
        <span><TypeText delay={220}>CAPABILITY MATRIX // TECH ARSENAL</TypeText></span>
        <strong><TypeText delay={420}>{node.title}</TypeText></strong>
        <p><TypeText delay={650} duration={1100}>{node.copy}</TypeText></p>
      </div>
      <div className="arsenal-console">
        <nav className="arsenal-rail" aria-label="Tech categories">
          {arsenalCategories.map((category) => (
            <button
              key={category.title}
              type="button"
              className={category.title === activeCategory ? "active" : ""}
              onClick={() => setActiveCategory(category.title)}
            >
              <span>{category.title}</span>
              <small>{category.items.length} tools</small>
            </button>
          ))}
        </nav>
        <section className={`arsenal-detail ${selectedCategory.accent}`} key={selectedCategory.title}>
          <span className="core-label">Active Category</span>
          <h2><TypeText delay={420}>{selectedCategory.title}</TypeText></h2>
          <div className="arsenal-chip-list">
            {selectedCategory.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <section className="language-core">
          <span className="core-label">Main Node</span>
          <h2><TypeText delay={680}>Programming Languages</TypeText></h2>
          <div className="language-list">
            {programmingLanguages.map(([language, rating]) => (
              <div className="language-meter" key={language}>
                <div>
                  <strong>{language}</strong>
                  <span>{rating}/10</span>
                </div>
                <i>
                  <b style={{ width: `${rating * 10}%` }} />
                </i>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

function WorkExperienceCard({ node }) {
  const currentRole = node.experiences[0];
  const previousRoles = node.experiences.slice(1);

  return (
    <article className="work-dossier">
      <header className="work-header">
        <span><TypeText delay={220}>CAREER RECORD // WORK EXPERIENCE</TypeText></span>
        <strong><TypeText delay={420}>{node.title}</TypeText></strong>
        <p><TypeText delay={650} duration={1100}>{node.copy}</TypeText></p>
      </header>
      <section className="current-experience">
        <div className="experience-status">{currentRole.status}</div>
        <h2><TypeText delay={880}>{currentRole.role}</TypeText></h2>
        <h3>{currentRole.company}</h3>
        <p className="experience-location">{currentRole.location}</p>
        <p className="experience-period">{currentRole.period}</p>
        <p className="experience-summary">{currentRole.summary}</p>
        <div className="experience-groups">
          <div>
            <span>Front-End</span>
            <div className="experience-tags">
              {currentRole.stack.map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
          </div>
          <div>
            <span>Backend</span>
            <div className="experience-tags">
              {currentRole.backend.map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
          </div>
          <div>
            <span>Tools Used</span>
            <div className="experience-tags">
              {currentRole.tools.map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="experience-timeline" aria-label="Previous work experience">
        {previousRoles.map((experience) => (
          <article className="timeline-record" key={`${experience.role}-${experience.company}`}>
            <div className="timeline-dot" />
            <span>{experience.status}</span>
            <h3>{experience.role}</h3>
            <strong>{experience.company}</strong>
            <p className="experience-location">{experience.location}</p>
            <p className="experience-period">{experience.period}</p>
            <p>{experience.summary}</p>
            <div className="experience-tags">
              {experience.stack.map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
          </article>
        ))}
      </section>
    </article>
  );
}

function ProjectsMadeCard({ node, expandedProject, onToggleProject }) {
  const liveCount = node.entries.filter((entry) => !entry.isPlaceholder).length;
  const queuedCount = node.entries.length - liveCount;

  return (
    <article className="projects-console">
      <header className="projects-header">
        <span><TypeText delay={220}>PROJECT ARRAY // SELECTED BUILDS</TypeText></span>
        <strong><TypeText delay={420}>{node.title}</TypeText></strong>
        <p><TypeText delay={650} duration={1100}>{node.copy}</TypeText></p>
      </header>
      <section className="project-command-strip" aria-label="Project summary">
        <div>
          <span>Total Nodes</span>
          <strong>{node.entries.length}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{liveCount}</strong>
        </div>
        <div>
          <span>Queued</span>
          <strong>{queuedCount}</strong>
        </div>
      </section>
      <section className="project-grid">
        {node.entries.map((entry, index) => {
          const isSelected = expandedProject === entry.name;

          return (
            <article
              className={[
                "project-tile",
                isSelected ? "selected" : "",
                entry.isPlaceholder ? "placeholder" : "",
              ].filter(Boolean).join(" ")}
              style={{ "--project-delay": `${index * 80 + 220}ms` }}
              key={entry.name}
            >
              {entry.image && (
                <span
                  className="project-tile-scan"
                  style={{ backgroundImage: `url(${entry.image})` }}
                  aria-hidden="true"
                />
              )}
              <div className="project-tile-top">
                <span>{entry.status ?? "Published"}</span>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </div>
              <div className="project-tile-main">
                <span className={`project-logo mini ${entry.logoType ?? "generic"}`}>
                  {entry.logo ? (
                    <img src={entry.logo} alt={`${entry.name} logo`} />
                  ) : entry.logoType === "sentimentscope" ? (
                    <>
                      <i />
                      <i />
                      <i />
                    </>
                  ) : (
                    entry.name.split(" ").slice(0, 2).map((word) => word[0]).join("")
                  )}
                </span>
                <div>
                  <h3>{entry.name}</h3>
                  <p>{entry.description}</p>
                </div>
              </div>
              <div className="project-tile-tags">
                {entry.meta.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <button type="button" onClick={() => onToggleProject(entry.name)}>
                {isSelected ? "Selected" : entry.isPlaceholder ? "Inspect Slot" : "Details"}
              </button>
            </article>
          );
        })}
      </section>
    </article>
  );
}

function CertificatesCard({ node }) {
  const featured = node.certificates.find((certificate) => certificate.featured);
  const records = node.certificates.filter((certificate) => !certificate.featured);

  return (
    <article className="certificates-console">
      <header className="certificates-header">
        <span><TypeText delay={220}>CREDENTIAL ARCHIVE // CERTIFICATES</TypeText></span>
        <strong><TypeText delay={420}>{node.title}</TypeText></strong>
        <p><TypeText delay={650} duration={1200}>{node.copy}</TypeText></p>
      </header>
      {featured && (
        <section className="featured-certificate">
          <div>
            <span>{featured.status}</span>
            <h2>{featured.title}</h2>
            <p>{featured.venue}</p>
          </div>
          <strong>{featured.date}</strong>
        </section>
      )}
      <section className="certificate-grid">
        {records.map((certificate) => (
          <article className="certificate-record" key={`${certificate.title}-${certificate.date}`}>
            <div className="certificate-date">{certificate.date}</div>
            <div>
              <span>{certificate.type}</span>
              <h3>{certificate.title}</h3>
              <p>{certificate.description ?? certificate.venue}</p>
            </div>
          </article>
        ))}
      </section>
    </article>
  );
}

function ContactStation({ node }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [copied, setCopied] = useState("");
  const [transmissionStatus, setTransmissionStatus] = useState("");

  const contact = node.contact;
  const copyValue = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      setCopied("Copy failed");
      window.setTimeout(() => setCopied(""), 1600);
    }
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const sendTransmission = (event) => {
    event.preventDefault();
    setTransmissionStatus("Opening your email client with the message prepared.");
    const subject = encodeURIComponent(`Portfolio message from ${form.name || "Visitor"}`);
    const body = encodeURIComponent([
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      "",
      form.message,
    ].join("\n"));
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    window.setTimeout(() => setTransmissionStatus(""), 3200);
  };

  const channels = [
    ["Email", contact.email, contact.email, true],
    ["Phone", contact.phone, contact.phone, true],
    ["LinkedIn", "Open profile", contact.linkedin, false],
    ["Discord", contact.discord, contact.discord, true],
    ["Location", contact.location, contact.location, false],
  ];

  return (
    <article className="contact-station">
      <div className="station-orbit orbit-one" />
      <div className="station-orbit orbit-two" />
      <header className="station-header">
        <span><TypeText delay={220}>FINAL NODE // UPLINK PORTAL</TypeText></span>
        <strong><TypeText delay={420}>{node.title}</TypeText></strong>
        <p><TypeText delay={650} duration={1100}>{node.copy}</TypeText></p>
      </header>
      <div className="station-panels">
        <section className="transmission-panel">
          <h2><TypeText delay={820}>Send Transmission</TypeText></h2>
          <form onSubmit={sendTransmission}>
            <label>
              <span>Name</span>
              <input name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
            </label>
            <label className="message-field">
              <span>Message</span>
              <textarea name="message" value={form.message} onChange={updateField} placeholder="Write your message..." required />
            </label>
            <button type="submit">Transmit Message</button>
            <p className="transmission-status" aria-live="polite">{transmissionStatus}</p>
          </form>
          <div className="am-waveform" aria-hidden="true">
            <div className="waveform-readout">
              <span>AM SIGNAL</span>
              <strong>07.13 MHz</strong>
            </div>
            <svg viewBox="0 0 720 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="amWaveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffb6dc" stopOpacity="0.1" />
                  <stop offset="18%" stopColor="#ffb6dc" stopOpacity="0.9" />
                  <stop offset="52%" stopColor="#f4ffd1" stopOpacity="0.92" />
                  <stop offset="84%" stopColor="#8ef1ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8ef1ff" stopOpacity="0.1" />
                </linearGradient>
                <filter id="amWaveBlur">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              <path
                className="am-envelope envelope-top"
                d="M0 58 C48 22 78 22 112 58 S176 94 220 58 S292 16 336 58 S410 104 458 58 S532 12 584 58 S668 88 720 58"
              />
              <path
                className="am-envelope envelope-bottom"
                d="M0 62 C48 98 78 98 112 62 S176 26 220 62 S292 104 336 62 S410 16 458 62 S532 108 584 62 S668 32 720 62"
              />
              <path
                className="am-wave wave-shadow"
                d="M0 60 C10 32 20 32 30 60 S50 88 60 60 S80 32 90 60 S110 88 120 60 S140 22 152 60 S176 98 188 60 S212 26 224 60 S248 94 260 60 S284 44 296 60 S320 76 332 60 S356 56 368 60 S392 64 404 60 S428 36 440 60 S464 84 476 60 S500 24 512 60 S536 96 548 60 S572 16 584 60 S608 104 620 60 S644 26 656 60 S680 92 692 60 S710 42 720 60"
              />
              <path
                className="am-wave wave-main"
                d="M0 60 C10 32 20 32 30 60 S50 88 60 60 S80 32 90 60 S110 88 120 60 S140 22 152 60 S176 98 188 60 S212 26 224 60 S248 94 260 60 S284 44 296 60 S320 76 332 60 S356 56 368 60 S392 64 404 60 S428 36 440 60 S464 84 476 60 S500 24 512 60 S536 96 548 60 S572 16 584 60 S608 104 620 60 S644 26 656 60 S680 92 692 60 S710 42 720 60"
              />
            </svg>
            <div className="waveform-axis">
              <span>RX</span>
              <i />
              <span>TX</span>
            </div>
          </div>
        </section>
        <aside className="contact-channel-panel">
          <h2><TypeText delay={900}>Contact Channels</TypeText></h2>
          <div className="channel-list">
            {channels.map(([label, display, value, canCopy], index) => (
              <div className="channel-row" key={label}>
                <span className="channel-glyph">{label.slice(0, 2).toUpperCase()}</span>
                <div>
                  <span>{label}</span>
                  {label === "LinkedIn" ? (
                    <a href={value} target="_blank" rel="noreferrer">{display}</a>
                  ) : (
                    <strong>{display}</strong>
                  )}
                </div>
                <i className="channel-signal" style={{ "--signal-delay": `${index * 130}ms` }} />
                {canCopy && (
                  <button type="button" onClick={() => copyValue(label, value)}>
                    {copied === label ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
            ))}
          </div>
          <a className="resume-link" href={contact.resume} target="_blank" rel="noreferrer">
            Open Resume
          </a>
          {copied && <p className="copy-status">{copied}</p>}
        </aside>
      </div>
      <div className="station-core">
        <span />
        <i />
      </div>
    </article>
  );
}

function ContactPortal({ isActive }) {
  const contactNode = nodes.find((node) => node.id === "contact");

  return (
    <div
      className={isActive ? "contact-portal active" : "contact-portal"}
      style={{ left: contactNode.x, top: contactNode.y }}
      aria-hidden="true"
    >
      <span className="portal-ring ring-a" />
      <span className="portal-ring ring-b" />
      <span className="portal-ring ring-c" />
      <span className="portal-core" />
      <span className="portal-scan scan-a" />
      <span className="portal-scan scan-b" />
      <span className="portal-pulse pulse-a" />
      <span className="portal-pulse pulse-b" />
    </div>
  );
}

function DataCardNode({ node, isActive, expandedProject, onToggleProject }) {
  const visibleEntries = isActive ? node.entries : node.entries.slice(0, 1);

  return (
    <div
      className={isActive ? "data-node active" : "data-node"}
      data-node-id={node.id}
      data-accent={node.accent}
      style={{ left: node.x, top: node.y }}
    >
      <div className="data-card-beacon" />
      {node.id === "intro" && isActive ? (
        <IntroProfileCard node={node} />
      ) : node.id === "about" && isActive ? (
        <TechArsenalCard node={node} />
      ) : node.id === "skills" && isActive ? (
        <WorkExperienceCard node={node} />
      ) : node.id === "projects" && isActive ? (
        <ProjectsMadeCard
          node={node}
          expandedProject={expandedProject}
          onToggleProject={onToggleProject}
        />
      ) : node.id === "certificates" && isActive ? (
        <CertificatesCard node={node} />
      ) : node.id === "contact" && isActive ? (
        <ContactStation node={node} />
      ) : (
      <article className={`data-card ${node.type}`}>
        <div className="data-card-top">
          <span className="card-code">{node.id.toUpperCase()}</span>
          <span className="card-status">{isActive ? "ACTIVE" : "IDLE"}</span>
        </div>
        <h2>{isActive ? <TypeText delay={320}>{node.title}</TypeText> : node.title}</h2>
        <p>{isActive ? <TypeText delay={520} duration={1050}>{node.copy}</TypeText> : node.eyebrow}</p>
        <div className="card-tags">
          {node.details.slice(0, isActive ? 5 : 2).map((detail) => (
            <span key={detail}>{detail}</span>
          ))}
        </div>
        <div className="entry-list">
          {visibleEntries.map((entry) => {
            const isOpen = expandedProject === entry.name;
            const canExpand = isActive && node.type === "projects";

            return (
              <section className={isOpen ? "entry open" : "entry"} key={entry.name}>
                <div className="entry-main">
                  <div>
                    <strong>{entry.name}</strong>
                    <small>{entry.description}</small>
                  </div>
                  {canExpand && (
                    <button type="button" onClick={() => onToggleProject(entry.name)}>
                      {isOpen ? "Selected" : "View"}
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </article>
      )}
    </div>
  );
}

function ProjectSubNodes({ isVisible, expandedProject, hoveredProject, onHoverProject, onSelectProject }) {
  if (!isVisible) {
    return null;
  }

  const subnodes = getProjectSubnodes();

  return (
    <div className="project-subnodes">
      <svg className="project-subnode-lines" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">
        {subnodes.map((subnode, index) => {
          const previous = index === 0 ? nodes[3] : subnodes[index - 1];
          const isTargeted = expandedProject === subnode.name || hoveredProject === subnode.name;

          return (
            <g key={subnode.id}>
              <line
                x1={nodes[3].x}
                y1={nodes[3].y}
                x2={subnode.x}
                y2={subnode.y}
                pathLength="1"
                className={isTargeted ? "subnode-line active" : "subnode-line"}
                style={{ "--branch-delay": `${index * 110}ms` }}
              />
              {index > 0 && (
                <line
                  x1={previous.x}
                  y1={previous.y}
                  x2={subnode.x}
                  y2={subnode.y}
                  pathLength="1"
                  className="subnode-link"
                  style={{ "--branch-delay": `${index * 130 + 180}ms` }}
                />
              )}
            </g>
          );
        })}
      </svg>
      {subnodes.map((subnode, index) => {
        const isActive = expandedProject === subnode.name;
        const isHovered = hoveredProject === subnode.name;

        return (
          <article
            key={subnode.id}
            className={[
              "project-subnode",
              isActive ? "active" : "",
              isHovered ? "hovered" : "",
              hoveredProject && !isHovered && !isActive ? "muted" : "",
            ].filter(Boolean).join(" ")}
            style={{ left: subnode.x, top: subnode.y, "--node-delay": `${index * 120 + 260}ms` }}
            onMouseEnter={() => onHoverProject(subnode.name)}
            onMouseLeave={() => onHoverProject(null)}
          >
            <span className="subnode-dot" />
            <button
              className="subnode-select"
              type="button"
              onClick={() => onSelectProject(subnode.name)}
            >
              <span className="subnode-title">{subnode.name}</span>
              <span className="subnode-meta">{subnode.meta.join(" / ")}</span>
            </button>
            {isHovered && !isActive && (
              <span className="subnode-preview">
                <strong>{subnode.name}</strong>
                {subnode.description}
              </span>
            )}
            <span className={`project-logo ${subnode.logoType ?? "generic"}`}>
              {subnode.logo ? (
                <img
                  src={subnode.logo}
                  alt={`${subnode.name} logo`}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : subnode.logoType === "sentimentscope" ? (
                <>
                  <i />
                  <i />
                  <i />
                </>
              ) : (
                subnode.name.split(" ").slice(0, 2).map((word) => word[0]).join("")
              )}
            </span>
          </article>
        );
      })}
    </div>
  );
}

function DossierDrawer({ activeNode, selectedProject, onClose }) {
  const selectedEntry = activeNode.id === "projects"
    ? activeNode.entries.find((entry) => entry.name === selectedProject)
    : null;

  if (!selectedEntry) {
    return null;
  }

  return (
    <aside className="dossier-drawer">
      <div className="drawer-frame-top" />
      <div className="drawer-header">
        <span>PROJECT RECORD</span>
        <strong>{selectedEntry.name}</strong>
      </div>
      <div className="drawer-body">
        {selectedEntry.image && (
          <div className="drawer-image-bay">
            <img
              src={selectedEntry.image}
              alt={`${selectedEntry.name} screenshot`}
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling.style.display = "grid";
              }}
            />
            <div className="drawer-image-fallback">
              <span>SCREENSHOT</span>
              <strong>{selectedEntry.name}</strong>
              <small>Add image at {selectedEntry.image}</small>
            </div>
          </div>
        )}
        <section>
          <h3>Description</h3>
          <p>{selectedEntry.description}</p>
        </section>
        <section>
          <h3>Stack</h3>
          <div className="drawer-tags">
            {selectedEntry.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <section>
          <h3>Architecture Notes</h3>
          <p>{selectedEntry.detail}</p>
        </section>
      </div>
      <div className="drawer-actions">
        <button type="button" onClick={onClose}>Back to Projects</button>
        {selectedEntry.link && (
          <a href={selectedEntry.link} target="_blank" rel="noreferrer">Open deployed site</a>
        )}
        {selectedEntry.github && (
          <a href={selectedEntry.github} target="_blank" rel="noreferrer">GitHub repository</a>
        )}
        {selectedEntry.documentation && (
          <a href={selectedEntry.documentation} target="_blank" rel="noreferrer">Documentation</a>
        )}
      </div>
    </aside>
  );
}

function NavigationOverlay({ activeNode, selectedProject, onBack }) {
  return (
    <div className="nav-overlay">
      <span>{activeNode.title}</span>
      {selectedProject && (
        <>
          <span>/</span>
          <strong>{selectedProject}</strong>
          <button type="button" onClick={onBack}>Back</button>
        </>
      )}
    </div>
  );
}

function StarMap({ progress, viewport, activeIndex, hasEntered, expandedProject, hoveredProject, onHoverProject, onToggleProject }) {
  const camera = useMemo(
    () => {
      if (!hasEntered) {
        return getOverviewCamera(viewport.width, viewport.height);
      }

      const projectCamera = activeIndex === 3
        ? getProjectFocusCamera(expandedProject, viewport.width, viewport.height)
        : null;

      return projectCamera ?? getCamera(progress, viewport.width, viewport.height);
    },
    [activeIndex, expandedProject, hasEntered, progress, viewport.width, viewport.height]
  );

  const spring = useSpring({
    transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`,
    config: hasEntered
      ? { tension: 72, friction: 26, mass: 1.15 }
      : { tension: 95, friction: 28, mass: 1.1 },
  });

  return (
    <animated.div className="space-map" style={spring}>
        <ConstellationLines activeIndex={activeIndex} />
      <AmbientDataNodes />
      {galaxyStars.map(([x, y, size, color], index) => (
        <span
          key={`galaxy-${index}`}
          className={`galaxy-star ${color}`}
          style={{ left: x, top: y, "--star-size": `${size}` }}
        />
      ))}
      {supportingStars.map(([x, y, size], index) => (
        <span
          key={index}
          className="supporting-star"
          style={{ left: x, top: y, "--star-size": `${size}` }}
        />
      ))}
      {numericLabels.map(([x, y, label], index) => (
        <span key={index} className="coordinate-label" style={{ left: x, top: y }}>
          {label}
        </span>
      ))}
      <ContactPortal isActive={activeIndex === nodes.findIndex((node) => node.id === "contact")} />
      {nodes.map((node, index) => (
        <DataCardNode
          key={node.id}
          node={node}
          isActive={index === activeIndex}
          expandedProject={expandedProject}
          onToggleProject={onToggleProject}
        />
      ))}
      <ProjectSubNodes
        isVisible={activeIndex === 3}
        expandedProject={expandedProject}
        hoveredProject={hoveredProject}
        onHoverProject={onHoverProject}
        onSelectProject={onToggleProject}
      />
    </animated.div>
  );
}

function InfoPanel({ node, activeIndex }) {
  const panelSpring = useSpring({
    opacity: 1,
    y: 0,
    from: { opacity: 0, y: 20 },
    reset: true,
    config: { tension: 140, friction: 20 },
  });

  return (
    <animated.aside className="info-panel" style={panelSpring}>
      <p className="eyebrow">{node.eyebrow}</p>
      <h1>{node.title}</h1>
      <p className="copy">{node.copy}</p>
      <div className="detail-grid">
        {node.details.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="progress-readout">
        <span>Node {activeIndex + 1}</span>
        <strong>{node.label}</strong>
      </div>
    </animated.aside>
  );
}

function ScrollRail({ activeIndex }) {
  return (
    <nav className="scroll-rail" aria-label="Portfolio sections">
      {nodes.map((node, index) => (
        <a
          key={node.id}
          className={index === activeIndex ? "rail-dot active" : "rail-dot"}
          data-accent={node.accent}
          href={`#${node.id}`}
          aria-label={node.title}
        />
      ))}
    </nav>
  );
}

function App() {
  const { progress, viewport } = useScrollProgress();
  const [hasEntered, setHasEntered] = useState(window.scrollY > 12);
  const [expandedProject, setExpandedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const touchStartRef = useRef(null);
  const activeIndex = clamp(Math.round(progress * (nodes.length - 1)), 0, nodes.length - 1);
  const activeNode = nodes[activeIndex];
  const visibleActiveIndex = hasEntered ? activeIndex : -1;

  useEffect(() => {
    if (hasEntered) {
      return undefined;
    }

    const timer = window.setTimeout(() => setHasEntered(true), 520);
    return () => window.clearTimeout(timer);
  }, [hasEntered]);

  useEffect(() => {
    setExpandedProject(null);
    setHoveredProject(null);
  }, [activeIndex]);

  useEffect(() => {
    const isInteractiveTarget = (target) => (
      target?.closest?.("button, a, input, textarea, select, [role='button']")
    );

    const goToIndex = (index) => {
      const nextIndex = clamp(index, 0, nodes.length - 1);
      const target = document.getElementById(nodes[nextIndex].id);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const handleTouchStart = (event) => {
      if (window.innerWidth > 720 || isInteractiveTarget(event.target)) {
        touchStartRef.current = null;
        return;
      }

      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = (event) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!start || window.innerWidth > 720 || isInteractiveTarget(event.target)) {
        return;
      }

      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;

      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.25) {
        return;
      }

      goToIndex(activeIndex + (dx < 0 ? 1 : -1));
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex]);

  return (
    <main>
      <section
        className={[
          "viewport-stage",
          hasEntered ? "node-active" : "",
          activeNode ? `node-${activeNode.id}` : "",
          expandedProject ? "subnode-focused" : "",
        ].filter(Boolean).join(" ")}
      >
        <div className="starfield" />
        <div className="nebula nebula-one" />
        <div className="nebula nebula-two" />
        <StarMap
          progress={progress}
          viewport={viewport}
          activeIndex={visibleActiveIndex}
          hasEntered={hasEntered}
          expandedProject={expandedProject}
          hoveredProject={hoveredProject}
          onHoverProject={setHoveredProject}
          onToggleProject={(projectName) => {
            setExpandedProject((current) => current === projectName ? null : projectName);
          }}
        />
        {hasEntered && (
          <NavigationOverlay
            activeNode={activeNode}
            selectedProject={expandedProject}
            onBack={() => setExpandedProject(null)}
          />
        )}
        <DossierDrawer
          activeNode={activeNode}
          selectedProject={expandedProject}
          onClose={() => setExpandedProject(null)}
        />
        <ScrollRail activeIndex={activeIndex} />
      </section>
      <div className="scroll-pages" aria-hidden="true">
        {nodes.map((node) => (
          <section key={node.id} id={node.id} />
        ))}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
