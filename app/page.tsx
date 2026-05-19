/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Clock, Hotel, Landmark, LucidePhone, Mail, MapPin, MessageCircle, ParkingCircle, Phone, Sparkles, Star } from "lucide-react";

// ─── Framer Motion shim (pure CSS fallback since we use React artifacts) ───
// We'll use Intersection Observer + CSS transitions instead of framer-motion
// because framer-motion isn't available as a named import in this environment.

// ─── HOOK: Intersection Observer for reveal animations ────────────────────
function useReveal(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── FONT INJECTION ───────────────────────────────────────────────────────
function FontLoader() : null {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { font-family: 'DM Sans', sans-serif; color: #0d1b2a; background: #fff; }
      .font-display { font-family: 'Cormorant Garamond', serif; }
      .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.75s ease, transform 0.75s ease; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.75s ease, transform 0.75s ease; }
      .reveal-left.visible { opacity: 1; transform: translateX(0); }
      .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.75s ease, transform 0.75s ease; }
      .reveal-right.visible { opacity: 1; transform: translateX(0); }
      .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(10,35,66,0.18); }
      .img-zoom img { transition: transform 0.6s ease; }
      .img-zoom:hover img { transform: scale(1.07); }
      .nav-link { position: relative; }
      .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: #e8d5b0; transition: width 0.3s ease; }
      .nav-link:hover::after { width: 100%; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; }
      ::-webkit-scrollbar-thumb { background: #2a5298; border-radius: 3px; }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home", "Rooms", "Amenities", "Gallery", "Contact", "Location"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,35,66,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(232,213,176,0.15)" : "none",
      transition: "all 0.4s ease",
      padding: scrolled ? "14px 24px" : "22px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, #2a5298, #e8d5b0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}> */}
            <Image src="/Logo.png" alt="Logo" width={80} height={40} style={{ display: "block" }} />
          {/* </div> */}
          <div>
            <div className="font-display" style={{ color: "#fff", fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>
              Coastal Lodge
            </div>
            <div style={{ color: "#e8d5b0", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Coastal Hospitality
            </div>
          </div>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link"
              style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em" }}>
              {l}
            </a>
          ))}
          <a href="#booking" style={{
            background: "linear-gradient(135deg, #e8d5b0, #c9a96e)",
            color: "#0a2342", padding: "9px 22px", borderRadius: 50,
            fontWeight: 600, fontSize: 14, textDecoration: "none",
            boxShadow: "0 4px 15px rgba(232,213,176,0.35)",
            transition: "all 0.3s ease",
          }}>Book Now</a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "none", flexDirection: "column", gap: 5, padding: 4,
        }} className="hamburger" aria-label="Menu">
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: 24, height: 2,
              background: "#fff", borderRadius: 2,
              transition: "all 0.3s ease",
              transform: open && i === 0 ? "translateY(7px) rotate(45deg)" : open && i === 2 ? "translateY(-7px) rotate(-45deg)" : open && i === 1 ? "opacity 0" : "none",
              opacity: open && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "rgba(10,35,66,0.98)", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: 16,
          borderTop: "1px solid rgba(232,213,176,0.2)",
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{ color: "#fff", fontSize: 16, textDecoration: "none", fontWeight: 500 }}>
              {l}
            </a>
          ))}
          <a href="#booking" onClick={() => setOpen(false)} style={{
            background: "linear-gradient(135deg, #e8d5b0, #c9a96e)",
            color: "#0a2342", padding: "12px 24px", borderRadius: 50,
            fontWeight: 600, fontSize: 15, textDecoration: "none",
            textAlign: "center", marginTop: 8,
          }}>Book Now</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  const [currentImage, setCurrentImage] = useState(0)


  const heroImages = [
  "/hero/murdeshwar.webp",
  "/hero/murdeshwar2.webp",
  "/hero/murdeshwar3.webp",
  "/hero/hero.webp",
]

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length)
  }, 5000)

  return () => clearInterval(interval)
}, [heroImages.length])

  return (
    <section id="home" style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}>
      {/* <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80"
        alt="Murdeshwar coastal view"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          transform: loaded ? "scale(1)" : "scale(1.08)",
          transition: "transform 1.8s ease",
        }}
      /> */}
      {/* Background slideshow */}
<div
  style={{
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  }}
>
  {heroImages.map((image, index) => (
    <div
      key={image}
      style={{
        position: "absolute",
        inset: 0,

        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        opacity: currentImage === index ? 1 : 0,

        transform:
          currentImage === index
            ? loaded
              ? "scale(1.02)"
              : "scale(1.08)"
            : "scale(1)",

        transition:
          "opacity 1.8s ease-in-out, transform 7s ease",

        willChange: "opacity, transform",
      }}
    />
  ))}

  {/* dark cinematic overlay */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      // background:
        // "linear-gradient(180deg, rgba(10,35,66,0.58) 0%, rgba(10,35,66,0.42) 40%, rgba(10,35,66,0.78) 100%)",
    }}
  />

  {/* subtle luxury tint */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at center, rgba(42,82,152,0.16), transparent 70%)",
      mixBlendMode: "screen",
    }}
  />

  {/* wave texture */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity: 0.06,
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(232,213,176,0.5) 40px, rgba(232,213,176,0.5) 41px)",
    }}
  />
</div>
      

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,35,66,0.6) 0%, rgba(10,35,66,0.4) 40%, rgba(10,35,66,0.75) 100%)",
      }} />

      {/* Subtle wave pattern overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(232,213,176,0.5) 40px, rgba(232,213,176,0.5) 41px)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 24px",
        paddingTop: 80,
      }}>
        {/* Pill tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(232,213,176,0.15)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(232,213,176,0.4)",
          padding: "6px 18px", borderRadius: 50, marginBottom: 28,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          <span style={{ fontSize: 12 }}><Landmark className="w-4 h-4 text-[#e8d5b0]" /></span>
          <span style={{ color: "#e8d5b0", fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Murdeshwar, Karnataka
          </span>
        </div>

        <h1 className="font-display" style={{
          fontSize: "clamp(2.4rem, 7vw, 5.5rem)", fontWeight: 600,
          color: "#fff", lineHeight: 1.1, marginBottom: 20, maxWidth: 760,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.9s ease 0.4s",
        }}>
          Stay Near<br />
          <em style={{ color: "#e8d5b0", fontStyle: "italic" }}>Murdeshwar Temple</em>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.85)",
          maxWidth: 520, lineHeight: 1.7, marginBottom: 40,
          fontWeight: 300,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.9s ease 0.6s",
        }}>
          Comfortable rooms, sea breeze, and peaceful coastal hospitality.
        </p>

        
<div
  style={{
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(24px)",
    transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
  }}
>
  {/* PRIMARY CTA */}
  <a
    href="#booking"
    style={{
      position: "relative",
      overflow: "hidden",
      background:
        "linear-gradient(135deg, rgba(33,76,140,1) 0%, rgba(15,37,64,1) 100%)",
      color: "#fff",
      padding: "15px 34px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 15,
      textDecoration: "none",
      border: "1px solid rgba(255,255,255,0.16)",
      boxShadow:
        "0 10px 40px rgba(20,40,80,0.45), inset 0 1px 1px rgba(255,255,255,0.08)",
      transition: "all 0.35s ease",
      backdropFilter: "blur(18px)",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"
      e.currentTarget.style.boxShadow =
        "0 18px 50px rgba(20,40,80,0.55)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)"
      e.currentTarget.style.boxShadow =
        "0 10px 40px rgba(20,40,80,0.45)"
    }}
  >
    {/* glow effect */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.12), transparent 80%)",
        transform: "translateX(-120%)",
        animation: "shine 5s infinite",
      }}
    />

    <Hotel size={18} />
    <span>Book Your Stay</span>

    <Sparkles
      size={16}
      style={{
        opacity: 0.7,
      }}
    />
  </a>

  {/* WHATSAPP CTA */}
  <a
    href="https://wa.me/917019639916?text=Hello! I'd like to enquire about accommodation at Murdeshwar Lodge."
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: "relative",
      overflow: "hidden",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      color: "#fff",
      padding: "15px 30px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 15,
      textDecoration: "none",
      border: "1px solid rgba(255,255,255,0.14)",
      transition: "all 0.35s ease",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow:
        "0 8px 30px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)"
      e.currentTarget.style.background = "rgba(255,255,255,0.14)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)"
      e.currentTarget.style.background = "rgba(255,255,255,0.08)"
    }}
  >
    {/* Custom WhatsApp-style Icon */}
    <div
      style={{
        position: "relative",
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* chat bubble */}
      <MessageCircle
        size={22}
        strokeWidth={2.1}
        className="text-green-400"
      />

      {/* phone overlay */}
      <LucidePhone
        size={10}
        strokeWidth={3}
        style={{
          position: "absolute",
          color: "#4ade80",
        }}
      />
    </div>

    <span>WhatsApp Us</span>

    {/* online indicator */}
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#4ade80",
        boxShadow: "0 0 10px #4ade80",
      }}
    />
  </a>

  {/* shimmer animation */}
  <style>
    {`
      @keyframes shine {
        0% {
          transform: translateX(-120%);
        }
        20% {
          transform: translateX(120%);
        }
        100% {
          transform: translateX(120%);
        }
      }
    `}
  </style>
</div>

        {/* Floating review badge */}
      <div
  className="
    relative mt-10
    md:absolute md:bottom-24 md:right-[clamp(16px,4vw,60px)] p-2
    z-10
  "
  style={{
    opacity: loaded ? 1 : 0,
    transform: loaded
      ? "translateY(0px)"
      : "translateY(18px)",
    transition:
      "all 1s cubic-bezier(0.22,1,0.36,1) 1.1s",
  }}
>
  <div
    className="
      relative overflow-hidden
      rounded-3xl
      px-4 py-4
      md:px-5 md:py-4.5
      min-w-30
      md:min-w-33.75
      flex flex-col items-center gap-2
      border border-white/20
    "
    style={{
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      boxShadow:
        "0 12px 40px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08)",
    }}
  >
    {/* glow */}
    <div
      style={{
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,215,100,0.18), transparent 70%)",
        top: -40,
        right: -30,
        pointerEvents: "none",
      }}
    />

    {/* sparkle */}
    <div className="absolute top-3 right-3 opacity-60">
      <Sparkles size={14} color="#fff" />
    </div>

    {/* icon */}
    <div
      className="
        w-11 h-11
        md:w-13 md:h-13
        rounded-full
        flex items-center justify-center
        border border-white/20
      "
      style={{
        background:
          "linear-gradient(135deg, rgba(255,215,0,0.22), rgba(255,255,255,0.08))",
      }}
    >
      <Star
        className="w-5 h-5 md:w-6 md:h-6"
        fill="#FFD76A"
        color="#FFD76A"
      />
    </div>

    {/* rating */}
    <div className="flex items-center gap-1.5">
      <span
        className="
          text-white
          text-[26px]
          md:text-[32px]
          font-bold
          leading-none
          tracking-[-1px]
        "
      >
        4.8
      </span>

      <BadgeCheck
        size={16}
        color="#86efac"
      />
    </div>

    {/* text */}
    <div
      className="
        text-center
        text-[11px]
        md:text-[12px]
        font-medium
        leading-relaxed
      "
      style={{
        color: "rgba(255,255,255,0.74)",
      }}
    >
      Rated highly by
      <br />
      happy guests
    </div>

    {/* stars */}
    <div className="flex items-center gap-0.5 mt-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={10}
          fill="#FFD76A"
          color="#FFD76A"
        />
      ))}
    </div>
  </div>
</div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.5s",
      }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Scroll
        </div>
        <div style={{
          width: 1, height: 40,
          background: "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
          animation: "scrollLine 2s ease-in-out infinite",
        }} />
        <style>{`@keyframes scrollLine { 0%,100%{opacity:0.6;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }`}</style>
      </div>
    </section>
  );
}

// ─── QUICK INFO BAR ───────────────────────────────────────────────────────
function QuickInfo() {
  const items = [
    { icon: <MapPin className="text-red-500"/>, label: "Murdeshwar, Karnataka" },
    { icon: <Phone className="text-green-500"/>, label: "24/7 Support" },
    { icon: <ParkingCircle className="text-blue-800 bg-white rounded-3xl"/>, label: "Free Parking" },
    { icon: "🏖️", label: "Near Beach & Temple" },
  ];
  return (
    <section style={{
      background: "linear-gradient(135deg, #0a2342, #1a3a5c)",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 0,
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "20px 24px",
            borderRight: i < items.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ color: "#e8d5b0", fontSize: 14, fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────
function About() {
  const [ref, visible] = useReveal();
  const [refL, visL] = useReveal();
  const [refR, visR] = useReveal();

  return (
    <section id="about" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#2a5298", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Our Story
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0a2342", fontWeight: 600 }}>
            Where Comfort Meets the Coast
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 60, alignItems: "center",
        }}>
          <div ref={refL} className={`reveal-left ${visL ? "visible" : ""} img-zoom`} style={{
            borderRadius: 24, overflow: "hidden",
            boxShadow: "0 30px 80px rgba(10,35,66,0.15)",
            aspectRatio: "4/5",
            position: "relative",
          }}>
            <img
              src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"
              alt="Lodge exterior"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", bottom: 24, left: 24, right: 24,
              background: "rgba(10,35,66,0.8)", backdropFilter: "blur(12px)",
              borderRadius: 14, padding: "16px 20px",
              border: "1px solid rgba(232,213,176,0.2)",
            }}>
              <div style={{ color: "#e8d5b0", fontSize: 13, fontWeight: 600 }}>Est. 2010</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>Serving guests for 14+ years</div>
            </div>
          </div>

          <div ref={refR} className={`reveal-right ${visR ? "visible" : ""}`}>
            <h3 className="font-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#0a2342", marginBottom: 20, fontWeight: 600 }}>
              A Home Away From Home
            </h3>
            <p style={{ color: "#5a7a9a", lineHeight: 1.85, fontSize: 16, marginBottom: 24, fontWeight: 300 }}>
              Nestled in the heart of Murdeshwar, our lodge offers a serene escape where tradition and modern comfort coexist. Wake up to the sound of waves, step out to witness the majestic Murdeshwar Temple at sunrise, and return to spotless rooms that feel like a warm embrace.
            </p>
            <p style={{ color: "#5a7a9a", lineHeight: 1.85, fontSize: 16, marginBottom: 36, fontWeight: 300 }}>
              We're a family-run property built on the values of genuine hospitality — clean rooms, home-cooked flavours, and the kind of care that makes you book again.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "👨‍👩‍👧", label: "Family-Friendly" },
                { icon: "🧹", label: "Spotless Rooms" },
                { icon: "🏛️", label: "Temple Proximity" },
                { icon: "🏖️", label: "Beach Access" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#f5f9ff", borderRadius: 12, padding: "14px 16px",
                  border: "1px solid rgba(42,82,152,0.08)",
                }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <span style={{ color: "#0a2342", fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ROOMS ────────────────────────────────────────────────────────────────
function Rooms() {
  const [ref, visible] = useReveal();
  const rooms = [
    {
      name: "Deluxe AC Room",
      price: "₹1,499",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      amenities: ["Air Conditioning", "Free WiFi", "Hot Water", "TV"],
      occupancy: "2 Adults",
      badge: "Most Popular",
    },
    {
      name: "Family Room",
      price: "₹2,299",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      amenities: ["Air Conditioning", "Extra Beds", "Hot Water", "TV"],
      occupancy: "2 Adults + 2 Kids",
      badge: "Best Value",
    },
    {
      name: "Sea View Room",
      price: "₹2,799",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      amenities: ["Sea View Balcony", "Free WiFi", "Premium Bedding"],
      occupancy: "2 Adults",
      badge: "Premium",
    },
  ];

  return (
    <section id="rooms" style={{ padding: "100px 24px", background: "#f7f9fc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#2a5298", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Accommodations
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0a2342", fontWeight: 600 }}>
            Your Perfect Room Awaits
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {rooms.map((room, i) => <RoomCard key={i} room={room} delay={i * 150} />)}
        </div>
      </div>
    </section>
  );
}

type Room = {
  name: string
  price: string
  image: string
  amenities: string[]
  occupancy: string
  badge: string
}

function RoomCard({ room, delay } : {room : Room; delay: number}) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`card-hover reveal ${visible ? "visible" : ""}`}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 4px 24px rgba(10,35,66,0.08)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, box-shadow 0.3s ease`,
      }}>
      <div className="img-zoom" style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
        <img src={room.image} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: "linear-gradient(135deg, #e8d5b0, #c9a96e)",
          color: "#0a2342", fontSize: 11, fontWeight: 700,
          padding: "4px 12px", borderRadius: 50, letterSpacing: "0.05em",
        }}>{room.badge}</div>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <h3 className="font-display" style={{ fontSize: 22, color: "#0a2342", fontWeight: 600 }}>{room.name}</h3>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#2a5298", fontSize: 22, fontWeight: 700 }}>{room.price}</div>
            <div style={{ color: "#9ab0c8", fontSize: 12 }}>per night</div>
          </div>
        </div>
        <div style={{ color: "#5a7a9a", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          👥 {room.occupancy}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {room.amenities.map((a, i) => (
            <span key={i} style={{
              background: "#f0f4ff", color: "#2a5298", fontSize: 12,
              padding: "4px 10px", borderRadius: 50, fontWeight: 500,
            }}>{a}</span>
          ))}
        </div>
        <a href="#booking" style={{
          display: "block", textAlign: "center",
          background: "linear-gradient(135deg, #0a2342, #2a5298)",
          color: "#fff", padding: "12px", borderRadius: 12,
          fontWeight: 600, fontSize: 14, textDecoration: "none",
          transition: "all 0.3s ease",
        }}>View Details & Book</a>
      </div>
    </div>
  );
}

// ─── AMENITIES ────────────────────────────────────────────────────────────
function Amenities() {
  const [ref, visible] = useReveal();
  const items = [
    { icon: "📶", label: "Free WiFi" },
    { icon: "🅿️", label: "Free Parking" },
    { icon: "🚿", label: "Hot Water" },
    { icon: "❄️", label: "Air Conditioning" },
    { icon: "📹", label: "CCTV Security" },
    { icon: "⚡", label: "Power Backup" },
    { icon: "📺", label: "Smart TV" },
    { icon: "🛎️", label: "Room Service" },
  ];

  return (
    <section id="amenities" style={{
      padding: "100px 24px",
      background: "linear-gradient(135deg, #0a2342 0%, #1a3a5c 100%)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#e8d5b0", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            What We Offer
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", fontWeight: 600 }}>
            Every Comfort, Included
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 20 }}>
          {items.map((item, i) => (
            <AmenityCard key={i} item={item} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

type AmenityItem = {
  icon: string
  label: string
}

function AmenityCard({ item, delay } : { item: AmenityItem; delay: number   }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal card-hover ${visible ? "visible" : ""}`}
      style={{
        textAlign: "center", padding: "28px 16px",
        background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)",
        borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, box-shadow 0.3s ease`,
        cursor: "default",
      }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
      <div style={{ color: "#e8d5b0", fontSize: 14, fontWeight: 500 }}>{item.label}</div>
    </div>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────
function Gallery() {
  const [ref, visible] = useReveal();
  const photos = [
    { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", label: "Pool & Exterior", tall: true },
    { src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", label: "Room Interior" },
    { src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80", label: "Murdeshwar Beach" },
    { src: "/hero/murdeshwar.webp", label: "Temple View", tall: true },
    { src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80", label: "Night Ambience" },
    { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", label: "Deluxe Room" },
  ];

  return (
    <section id="gallery" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#2a5298", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Photo Gallery
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0a2342", fontWeight: 600 }}>
            See It For Yourself
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "220px",
          gap: 14,
        }}>
          {photos.map((photo, i) => (
            <GalleryItem key={i} photo={photo} style={{
              gridRow: photo.tall ? "span 2" : "span 1",
              gridColumn: i === 0 ? "span 2" : "span 1",
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:640px){
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

type GalleryPhoto = {
  src: string
  label: string
  tall?: boolean
}

function GalleryItem({ photo, style }: { photo: GalleryPhoto; style?: React.CSSProperties }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div ref={ref} className={`reveal img-zoom ${visible ? "visible" : ""}`}
      style={{
        ...style, borderRadius: 16, overflow: "hidden",
        cursor: "pointer", position: "relative",
      }}>
      <img src={photo.src} alt={photo.label}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 50%, rgba(10,35,66,0.75) 100%)",
        opacity: 0, transition: "opacity 0.3s ease",
      }} className="gallery-overlay" />
      <div style={{
        position: "absolute", bottom: 14, left: 14,
        color: "#fff", fontSize: 13, fontWeight: 500,
        opacity: 0, transition: "opacity 0.3s ease",
      }} className="gallery-label">{photo.label}</div>
      <style>{`.img-zoom:hover .gallery-overlay,.img-zoom:hover .gallery-label{opacity:1!important}`}</style>
    </div>
  );
}

// ─── NEARBY ATTRACTIONS ───────────────────────────────────────────────────
// function Attractions() {
//   const [ref, visible] = useReveal();
//   const spots = [
//     { icon: "🏛️", name: "Murdeshwar Temple", dist: "0.5 km", desc: "Iconic 20-storey gopura and towering Shiva statue", color: "#fff3e0" },
//     { icon: "🏖️", name: "Murdeshwar Beach", dist: "0.3 km", desc: "Pristine beach perfect for sunrise walks and water activities", color: "#e3f2fd" },
//     { icon: "🤿", name: "Scuba Diving", dist: "At beach", desc: "Explore vibrant underwater life with certified instructors", color: "#e8f5e9" },
//     { icon: "🌄", name: "Gokarna Trip", dist: "~1 hr drive", desc: "Visit the serene temple town and Om Beach", color: "#fce4ec" },
//     { icon: "🚂", name: "Railway Station", dist: "1 km", desc: "Well-connected to Mangalore, Goa, and Mumbai", color: "#f3e5f5" },
//   ];

//   return (
//     <section style={{ padding: "100px 24px", background: "#f7f9fc" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
//           <div style={{ color: "#2a5298", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
//             Explore
//           </div>
//           <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0a2342", fontWeight: 600 }}>
//             Nearby Attractions
//           </h2>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
//           {spots.map((spot, i) => <AttractionCard key={i} spot={spot} delay={i * 100} />)}
//         </div>
//       </div>
//     </section>
//   );
// }

function Attractions() {
  const [ref, visible] = useReveal()

  const spots = [
    {
      image:
        "/hero/murdeshwar.webp",
      name: "Murdeshwar Temple",
      dist: "0.5 km",
      desc: "Iconic 20-storey gopura and towering Shiva statue",
      tag: "Spiritual",
    },
    {
      image:
        "/hero/hero.webp",
      name: "Murdeshwar Beach",
      dist: "0.3 km",
      desc: "Pristine beach perfect for sunrise walks and water activities",
      tag: "Beach",
    },
    {
      image:
        "/hero/scuba.webp",
      name: "Scuba Diving",
      dist: "At beach",
      desc: "Explore vibrant underwater life with certified instructors",
      tag: "Adventure",
    },
    {
      image:
        "/hero/gokarna.webp",
      name: "Gokarna Trip",
      dist: "~1 hr drive",
      desc: "Visit the serene temple town and Om Beach",
      tag: "Road Trip",
    },
    {
      image:
        "/hero/railway-station.webp",
      name: "Railway Station",
      dist: "1 km",
      desc: "Well-connected to Mangalore, Goa, and Mumbai",
      tag: "Travel",
    },
  ]

  return (
    <section
      style={{
        padding: "110px 24px",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* background glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(42,82,152,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* heading */}
        <div
          ref={ref}
          className={`reveal ${visible ? "visible" : ""}`}
          style={{
            textAlign: "center",
            marginBottom: 70,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(42,82,152,0.08)",
              border: "1px solid rgba(42,82,152,0.08)",
              marginBottom: 18,
            }}
          >
            <Sparkles
              size={14}
              color="#2a5298"
            />

            <span
              style={{
                color: "#2a5298",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Explore
            </span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              color: "#0a2342",
              fontWeight: 600,
              lineHeight: 1.08,
              marginBottom: 18,
              letterSpacing: "-0.03em",
            }}
          >
            Nearby Attractions
          </h2>

          <p
            style={{
              maxWidth: 650,
              margin: "0 auto",
              color: "rgba(10,35,66,0.68)",
              fontSize: 16,
              lineHeight: 1.8,
            }}
          >
            Discover beaches, temples, adventure experiences, and coastal
            escapes just minutes away from your stay.
          </p>
        </div>

        {/* modern image cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {spots.map((spot, i) => (
            <AttractionCard
              key={i}
              spot={spot}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

type AttractionSpot = {
  image: string
  name: string
  dist: string
  desc: string
  tag: string
}

function AttractionCard({
  spot,
  delay,
}: {
  spot: AttractionSpot
  delay: number
}) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        background: "#fff",

        transition: `
          opacity 0.8s ease ${delay}ms,
          transform 0.8s ease ${delay}ms,
          box-shadow 0.35s ease
        `,

        boxShadow:
          "0 10px 40px rgba(10,35,66,0.08)",

        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-10px)"

        e.currentTarget.style.boxShadow =
          "0 25px 60px rgba(10,35,66,0.16)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)"

        e.currentTarget.style.boxShadow =
          "0 10px 40px rgba(10,35,66,0.08)"
      }}
    >
      {/* image */}
      <div
        style={{
          position: "relative",
          height: 240,
          overflow: "hidden",
        }}
      >
        <img
          src={spot.image}
          alt={spot.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.8s ease",
          }}
        />

        {/* overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)",
          }}
        />

        {/* floating tag */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,

            padding: "7px 14px",
            borderRadius: 999,

            background: "rgba(255,255,255,0.16)",
            backdropFilter: "blur(12px)",

            border: "1px solid rgba(255,255,255,0.18)",

            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {spot.tag}
        </div>

        {/* distance badge */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 18,

            padding: "8px 14px",
            borderRadius: 999,

            background: "#fff",

            color: "#0a2342",
            fontSize: 12,
            fontWeight: 700,

            boxShadow:
              "0 8px 25px rgba(0,0,0,0.12)",
          }}
        >
          {spot.dist}
        </div>
      </div>

      {/* content */}
      <div
        style={{
          padding: "24px 22px 24px",
        }}
      >
        <h3
          className="font-display"
          style={{
            fontSize: 28,
            color: "#0a2342",
            fontWeight: 600,
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          {spot.name}
        </h3>

        <p
          style={{
            color: "rgba(10,35,66,0.68)",
            fontSize: 15,
            lineHeight: 1.8,
            marginBottom: 18,
          }}
        >
          {spot.desc}
        </p>

        {/* bottom link */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,

            color: "#2a5298",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span>Explore attraction</span>

          <ArrowRight
            size={16}
            strokeWidth={2.4}
          />
        </div>
      </div>
    </div>
  )
}




// function AttractionCard({ spot, delay } : {spot : Spot; delay: number}) {
//   const [ref, visible] = useReveal();
//   return (
//     <div ref={ref} className={`card-hover reveal ${visible ? "visible" : ""}`}
//       style={{
//         background: "#fff", borderRadius: 20, padding: 24,
//         boxShadow: "0 4px 20px rgba(10,35,66,0.07)",
//         border: "1px solid rgba(42,82,152,0.06)",
//         transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, box-shadow 0.3s ease`,
//       }}>
//       <div style={{
//         width: 56, height: 56, borderRadius: 16,
//         background: spot.color, display: "flex", alignItems: "center",
//         justifyContent: "center", fontSize: 28, marginBottom: 16,
//       }}>{spot.icon}</div>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//         <h3 style={{ color: "#0a2342", fontSize: 16, fontWeight: 600 }}>{spot.name}</h3>
//       </div>
//       <div style={{
//         display: "inline-block", background: "#e8f0fe", color: "#2a5298",
//         fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 50, marginBottom: 12,
//       }}>{spot.dist}</div>
//       <p style={{ color: "#5a7a9a", fontSize: 14, lineHeight: 1.65, fontWeight: 300 }}>{spot.desc}</p>
//     </div>
//   );
// }

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────
function Testimonials() {
  const [ref, visible] = useReveal();
  const reviews = [
    {
      name: "Priya Sharma", location: "Bangalore",
      avatar: "https://i.pravatar.cc/64?img=1",
      rating: 5,
      text: "The Sea View Room was absolutely breathtaking. Woke up to the sound of waves and a stunning view of the temple. The staff were incredibly warm and helpful.",
    },
    {
      name: "Rahul Nair", location: "Mumbai",
      avatar: "https://i.pravatar.cc/64?img=3",
      rating: 5,
      text: "Best stay in Murdeshwar! Super clean rooms, great location — just a minute's walk from the beach. The family room fit all four of us comfortably.",
    },
    {
      name: "Meena Iyer", location: "Mysore",
      avatar: "https://i.pravatar.cc/64?img=5",
      rating: 4,
      text: "Wonderful coastal experience. The lodge is well-maintained and the staff go out of their way to make you comfortable. Will definitely come back.",
    },
    {
      name: "Arjun Patel", location: "Hyderabad",
      avatar: "https://i.pravatar.cc/64?img=7",
      rating: 5,
      text: "Perfect base for exploring Murdeshwar and Gokarna. Very affordable for the quality offered. The WhatsApp booking was super convenient!",
    },
  ];

  return (
    <section style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#2a5298", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Guest Reviews
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0a2342", fontWeight: 600 }}>
            What Our Guests Say
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {reviews.map((r, i) => <TestimonialCard key={i} review={r} delay={i * 120} />)}
        </div>
      </div>
    </section>
  );
}

type Review = {
  name: string
  location: string
  avatar: string
  rating: number
  text: string
}

function TestimonialCard({ review, delay } : { review: Review; delay: number }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`card-hover reveal ${visible ? "visible" : ""}`}
      style={{
        background: "linear-gradient(145deg, #f7f9fc, #fff)",
        borderRadius: 20, padding: "28px 24px",
        boxShadow: "0 4px 24px rgba(10,35,66,0.06)",
        border: "1px solid rgba(42,82,152,0.08)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, box-shadow 0.3s ease`,
      }}>
      <div style={{ color: "#f5a623", fontSize: 18, marginBottom: 16, letterSpacing: 2 }}>
        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
      </div>
      <p style={{ color: "#3d5a7a", fontSize: 15, lineHeight: 1.75, fontStyle: "italic", marginBottom: 20, fontWeight: 300 }}>
        "{review.text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={review.avatar} alt={review.name}
          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #e8d5b0" }} />
        <div>
          <div style={{ color: "#0a2342", fontSize: 14, fontWeight: 600 }}>{review.name}</div>
          <div style={{ color: "#9ab0c8", fontSize: 12 }}>{review.location}</div>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING FORM ─────────────────────────────────────────────────────────

type FormState = {
  name: string
  phone: string
  checkin: string
  checkout: string
  guests: string
  roomType: string
}

function Booking() {
  const [ref, visible] = useReveal();
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", checkin: "", checkout: "", guests: "2", roomType: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleWA = () => {
    const msg = `Hello! I'd like to book a room.\nName: ${form.name || "Guest"}\nPhone: ${form.phone}\nCheck-in: ${form.checkin}\nCheck-out: ${form.checkout}\nGuests: ${form.guests}\nRoom Type: ${form.roomType || "Not specified"}`;
    window.open(`https://wa.me/917019639916?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
    border: "1px solid rgba(232,213,176,0.25)", borderRadius: 12,
    color: "#fff", fontSize: 15, outline: "none",
    transition: "border-color 0.3s ease",
  };

  return (
    <section id="booking" style={{
      padding: "100px 24px",
      background: "linear-gradient(135deg, #0a2342 0%, #1a3a5c 60%, #0a2342 100%)",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: "#e8d5b0", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Reserve Your Stay
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#fff", fontWeight: 600 }}>
            Book Your Room Today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 12, fontSize: 16, fontWeight: 300 }}>
            Fill in your details and we'll confirm your booking within 2 hours.
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
          borderRadius: 24, padding: "clamp(24px,5vw,48px)",
          border: "1px solid rgba(232,213,176,0.15)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
        }}>
          {submitted && (
            <div style={{
              background: "rgba(46,213,115,0.15)", border: "1px solid rgba(46,213,115,0.4)",
              borderRadius: 12, padding: "14px 20px", marginBottom: 24, textAlign: "center",
              color: "#4ecca3",
            }}>
               Inquiry sent! We'll contact you within 2 hours.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ color: "rgba(232,213,176,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>Full Name</label>
              <input style={inputStyle} placeholder="Your name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(232,213,176,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>Phone Number</label>
              <input style={inputStyle} placeholder="+91 XXXXX XXXXX" type="tel"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(232,213,176,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>Check-in Date</label>
              <input style={{ ...inputStyle, colorScheme: "dark" }} type="date"
                value={form.checkin} onChange={e => setForm({ ...form, checkin: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(232,213,176,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>Check-out Date</label>
              <input style={{ ...inputStyle, colorScheme: "dark" }} type="date"
                value={form.checkout} onChange={e => setForm({ ...form, checkout: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "rgba(232,213,176,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>Number of Guests</label>
              <select style={{ ...inputStyle, cursor: "pointer" }}
                value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={String(n)} style={{ background: "#0a2342" }}>{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: "rgba(232,213,176,0.8)", fontSize: 13, fontWeight: 500, marginBottom: 8, display: "block" }}>Room Type</label>
              <select style={{ ...inputStyle, cursor: "pointer" }}
                value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
                <option value="" style={{ background: "#0a2342" }}>Select room type</option>
                <option value="Deluxe AC Room" style={{ background: "#0a2342" }}>Deluxe AC Room</option>
                <option value="Family Room" style={{ background: "#0a2342" }}>Family Room</option>
                <option value="Sea View Room" style={{ background: "#0a2342" }}>Sea View Room</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
            <button onClick={handleSubmit} style={{
              flex: 1, minWidth: 180,
              background: "linear-gradient(135deg, #e8d5b0, #c9a96e)",
              color: "#0a2342", padding: "14px 28px", borderRadius: 12,
              fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
              boxShadow: "0 8px 25px rgba(232,213,176,0.3)",
              transition: "all 0.3s ease",
            }}>📩 Send Inquiry</button>
            <button onClick={handleWA} style={{
              flex: 1, minWidth: 180,
              background: "#25d366", color: "#fff",
              padding: "14px 28px", borderRadius: 12,
              fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
              boxShadow: "0 8px 25px rgba(37,211,102,0.35)",
              transition: "all 0.3s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>      <MessageCircle
        size={22}
        strokeWidth={2.1}
        className="text-white"
      />

      {/* phone overlay */}
      <LucidePhone
        size={10}
        strokeWidth={3}
        style={{
          position: "relative", left: -25, top: 0,
          color: "#fff",
        }}
      /> WhatsApp Booking</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAP ──────────────────────────────────────────────────────────────────
function MapSection() {
  const [ref, visible] = useReveal();
  return (
    <section id="location" style={{ padding: "80px 24px 0", background: "#f7f9fc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ color: "#2a5298", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Find Us
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0a2342", fontWeight: 600 }}>
            Our Location
          </h2>
        </div>

        <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(10,35,66,0.12)", position: "relative" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7733.741634185782!2d74.48856!3d14.09317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcbb42b2f5a26b%3A0x3e69cdf7e65d4e06!2sMurdeshwar%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1621000000000!5m2!1sen!2sin"
            width="100%" height="420" style={{ border: 0, display: "block" }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Murdeshwar Lodge Location"
          />
          <div style={{
            position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          }}>
            <a href="https://maps.google.com/?q=Murdeshwar,Karnataka" target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#0a2342", padding: "12px 24px", borderRadius: 50,
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                boxShadow: "0 8px 30px rgba(10,35,66,0.2)",
              }}>
              🗺️ Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: "#060f1a",
      padding: "72px 24px 32px",
      borderTop: "1px solid rgba(232,213,176,0.15)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}><Image src="/Logo.png" alt="Logo" width={80} height={40} style={{ display: "block" }} /></span>
              <div className="font-display" style={{ color: "#fff", fontSize: 22, fontWeight: 600 }}>Coastal Lodge</div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
              Your peaceful coastal retreat near the iconic Murdeshwar Temple, Karnataka.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["📘", "📸", "🐦", "📺"].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "rgba(255,255,255,0.08)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 16,
                  textDecoration: "none", transition: "background 0.3s ease",
                }} title={["Facebook", "Instagram", "Twitter", "YouTube"][i]}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#e8d5b0", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none" }}>
              {["Home", "Rooms", "Amenities", "Gallery", "Location"].map(link => (
                <li key={link} style={{ marginBottom: 10 }}>
                  <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none", transition: "color 0.3s ease" }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = "#e8d5b0"}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 style={{ color: "#e8d5b0", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              Contact Us
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: <MapPin className="text-red-500"/>, text: "Near Murdeshwar Beach,\nMurdeshwar – 581350, Karnataka" },
                { icon: <Phone className="text-green-500"/>, text: "+91 7019639916" },
                { icon: <Mail className="text-blue-500"/>, text: "stay@murdeshwarlodge.com" },
                { icon: <Clock className="text-yellow-500"/>, text: "Check-in: 12:00 PM | Check-out: 11:00 AM" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 28, display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center", gap: 12,
        }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            © 2025 Murdeshwar Lodge. All rights reserved.
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            Made with ❤️ in Karnataka, India
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── FLOATING WHATSAPP BUTTON ─────────────────────────────────────────────
function FloatingWA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 200);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <a href="https://wa.me/7019639916?text=Hi! I'm interested in booking a room at Murdeshwar Lodge."
      target="_blank" rel="noopener noreferrer"
      style={{
        position: "fixed", bottom: 28, right: 24, zIndex: 999,
        width: 58, height: 58, borderRadius: "50%",
        background: "#25d366",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, boxShadow: "0 6px 24px rgba(37,211,102,0.5)",
        textDecoration: "none",
        opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.7)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: show ? "pulse-wa 3s ease-in-out infinite" : "none",
      }}>
      <MessageCircle
        size={28}
        strokeWidth={2.1}
        className="text-white"
        style={{
          position: "relative", left: 4, top:0,
        }}
      />

      {/* phone overlay */}
      <LucidePhone
        size={10}
        strokeWidth={3}
        style={{
          position: "relative", left: -16, top: 0,
          color: "#fff",
        }}
      />
      <style>{`@keyframes pulse-wa { 0%,100%{box-shadow:0 6px 24px rgba(37,211,102,0.5)} 50%{box-shadow:0 6px 40px rgba(37,211,102,0.75)} }`}</style>
    </a>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <FontLoader />
      <Navbar />
      <Hero />
      <QuickInfo />
      <About />
      <Rooms />
      <Amenities />
      <Gallery />
      <Attractions />
      <Testimonials />
      <Booking />
      <MapSection />
      <Footer />
      <FloatingWA />
    </div>
  );
}