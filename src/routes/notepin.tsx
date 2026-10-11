import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import pageCss from "../styles/notepin.css?url";
import product from "@/assets/np-product.png";
import lawyer from "@/assets/np-lawyer.jpg";
import desk from "@/assets/np-desk.jpg";
import meeting from "@/assets/np-meeting.jpg";
import spin from "@/assets/np-spin.mp4.asset.json";

const PinModel = lazy(() => import("@/components/notepin/PinModel"));

export const Route = createFileRoute("/notepin")({
  head: () => ({
    meta: [
      { title: "PLAUD NotePin for Lawyers – Digitmask" },
      { name: "description", content: "The AI voice recorder for law firms. Every meeting recorded, transcribed and summarised. AED 800 per month from Digitmask." },
      { property: "og:title", content: "PLAUD NotePin for Lawyers – Digitmask" },
      { property: "og:description", content: "Every word of every meeting. AED 800 / month." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "copyright", content: "© 2026 Digitmask. All rights reserved." },
    ],
    links: [{ rel: "stylesheet", href: pageCss }],
  }),
  component: NotePinPage,
});

const USES = [
  { img: meeting, k: "Client meetings", t: "Listen. It writes." },
  { img: lawyer, k: "Negotiations", t: "Every term, on record." },
  { img: desk, k: "Case prep", t: "Summaries by morning." },
];

function NotePinPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".np-reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")), { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <main className="np">
      <div className="np-surface" aria-hidden="true" />
      <header className="np-top">
        <a href="/" className="np-back" aria-label="Back down to Home">↓ Digitmask</a>
        <a href="#buy" className="np-pill">AED 800 / month</a>
      </header>

      <section className="np-hero">
        <div className="np-hero__text">
          <p className="np-k">PLAUD NotePin · For lawyers</p>
          <h1>Every word.<br /><em>On record.</em></h1>
          <a href="#buy" className="np-cta">Subscribe — AED 800/mo</a>
        </div>
        <div className="np-hero__model">
          <ClientOnly fallback={<img src={product} alt="PLAUD NotePin" width={1024} height={1024} className="np-fallback" />}>
            <Suspense fallback={<img src={product} alt="PLAUD NotePin" width={1024} height={1024} className="np-fallback" />}>
              <PinModel />
            </Suspense>
          </ClientOnly>
          <p className="np-hint">Move to turn it</p>
        </div>
      </section>

      <section className="np-film np-reveal">
        <video src={spin.url} autoPlay muted loop playsInline poster={product} />
        <div className="np-film__stats">
          <div><b>30h</b><span>recording</span></div>
          <div><b>112</b><span>languages</span></div>
          <div><b>1 tap</b><span>to start</span></div>
        </div>
      </section>

      <section className="np-uses">
        <p className="np-k np-reveal">Built for the courtroom and the boardroom</p>
        <div className="np-uses__grid">
          {USES.map((u) => (
            <figure key={u.k} className="np-use np-reveal">
              <img src={u.img} alt={u.k} loading="lazy" width={1400} height={1000} />
              <figcaption><span>{u.k}</span>{u.t}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="np-flow np-reveal">
        {["Record", "Transcribe", "Summarise"].map((s, i) => (
          <div key={s}><i>0{i + 1}</i>{s}</div>
        ))}
      </section>

      <section id="buy" className="np-buy np-reveal">
        <img src={product} alt="" loading="lazy" width={1024} height={1024} />
        <div>
          <p className="np-k">For leading lawyers and law firms</p>
          <h2><b>AED 800</b> / month</h2>
          <ul>
            <li>NotePin device</li>
            <li>Unlimited AI transcripts & summaries</li>
            <li>Set-up and support by Digitmask</li>
          </ul>
          <a className="np-cta" href="mailto:info@digitmask.com?subject=NotePin%20subscription">Subscribe now</a>
        </div>
      </section>

      <footer className="np-foot">© 2026 Digitmask. All rights reserved.</footer>
    </main>
  );
}
