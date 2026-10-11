import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import pageCss from "../styles/notepin.css?url";
import config from "../lib/notepin-config.json";

const A = "/site/assets/notepin/";

export const Route = createFileRoute("/world_/plaud-notepin")({
  head: () => ({
    meta: [
      { title: "PLAUD NotePin – Digitmask World" },
      { name: "description", content: "A wearable AI voice recorder that helps turn in-person conversations into transcripts and organised summaries. Sold by Digitmask FZE." },
      { property: "og:title", content: "PLAUD NotePin – Digitmask World" },
      { property: "og:description", content: "Be present. Keep the details. Ask Digitmask about availability." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "copyright", content: "© 2026 Digitmask. All rights reserved." },
    ],
    links: [{ rel: "stylesheet", href: pageCss }],
  }),
  component: NotePinPage,
});

const STEPS = [
  { k: "Record", img: "record.jpg", t: "Capture the in-person conversation with appropriate permission." },
  { k: "Transcribe", img: "transcribe.jpg", t: "Sync your recording to the Plaud app for transcription." },
  { k: "Summarise", img: "summarise.jpg", t: "Generate an organised summary and review the important details before relying on it." },
];

const FAQ = [
  { q: "Does it need the Plaud app for AI features?", a: "Yes. Transcription and AI summaries happen through the Plaud app and software after you sync a recording." },
  { q: "What AI minutes are included?", a: "PLAUD's official page lists a Starter plan with 300 transcription minutes per month. Paid plans are available for higher usage. Please confirm which membership comes with your purchase." },
  { q: "Is Arabic supported?", a: "PLAUD lists transcription in 112 languages. Ask us if you want us to confirm a specific language or dialect for your use." },
  { q: "Which accessories, delivery and warranty terms apply?", a: "These depend on the current offer. Send an enquiry and we will reply with the exact bundle, delivery and warranty terms." },
];

function NotePinPage() {
  const [step, setStep] = useState(0);
  return (
    <div className="np">
      <header className="np-head">
        <a href="/" className="np-logo">Digitmask</a>
        <nav>
          <a href="/">Home</a>
          <a href="/projects/">Projects</a>
          <a href="/contact/">Contact</a>
          <a href="/world/">World</a>
        </nav>
      </header>

      <main>
        <section className="np-hero np-wrap">
          <div>
            <p className="np-k">PLAUD NotePin</p>
            <h1>Be present. Keep the details.</h1>
            <p className="np-lead">
              A wearable AI voice recorder that helps turn in-person conversations into transcripts and organised summaries through the Plaud app.
            </p>
            {config.price != null && <p className="np-price">{config.currency} {config.price}</p>}
            <div className="np-ctas">
              <a href="#enquire" className="np-btn np-btn--solid">Ask about availability</a>
              <a href="#how" className="np-btn">Watch how it works</a>
            </div>
            <p className="np-small">Made by PLAUD. Sold by Digitmask FZE, subject to availability and offer terms.</p>
          </div>
          <img src={A + "hero.jpg"} alt="PLAUD NotePin wearable voice recorder" width={1200} height={675} />
        </section>

        <section id="how" className="np-wrap np-sec">
          <h2>Three steps</h2>
          <div className="np-tabs" role="tablist">
            {STEPS.map((s, i) => (
              <button key={s.k} role="tab" aria-selected={i === step} onClick={() => setStep(i)}>
                {i + 1}. {s.k}
              </button>
            ))}
          </div>
          <figure className="np-fig" key={step}>
            <img src={A + STEPS[step].img} alt="" loading="lazy" width={900} height={507} />
            <figcaption>{STEPS[step].t}</figcaption>
          </figure>
          <p className="np-small">Illustrative visuals — not real customers or actual app screens.</p>
        </section>

        <section className="np-wrap np-sec np-card">
          <h2>For lawyers and consultancies</h2>
          <p className="np-lead">More attention in the meeting. Clearer notes afterwards.</p>
          <ul className="np-list">
            <li><b>Client-meeting notes</b> — organise what was discussed.</li>
            <li><b>Consultation recap</b> — a clear summary to review.</li>
            <li><b>Follow-up checklist</b> — tasks and questions to check.</li>
          </ul>
          <p className="np-small">Suggested examples only. AI output needs human review and does not replace professional judgement or legal advice.</p>
        </section>

        <section className="np-wrap np-sec np-two">
          <div>
            <h2>Specifications</h2>
            <ul className="np-list">
              <li>Up to 20 hours of continuous recording</li>
              <li>64 GB local storage</li>
              <li>Transcription in 112 languages</li>
              <li>Speaker labels and AI summaries (via Plaud app)</li>
            </ul>
            <p className="np-small">Manufacturer specifications, not independently tested.</p>
            <h2>Ways to wear it</h2>
            <p>Wrist, necklace, clip or magnetic pin. The exact accessories in our bundle are confirmed with your enquiry.</p>
          </div>
          <img src={A + "wear.jpg"} alt="NotePin worn on the wrist, as a necklace and as a clip" loading="lazy" width={1273} height={578} />
        </section>

        <section className="np-wrap np-sec">
          <h2>Questions</h2>
          {FAQ.map((f) => (
            <details key={f.q} className="np-faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
          <p className="np-small">Please get permission before recording anyone, and follow your organisation's rules for confidential information.</p>
        </section>

        <Enquiry />
      </main>

      <footer className="np-wrap np-foot">© 2026 Digitmask. All rights reserved. PLAUD and NotePin are trademarks of their owner.</footer>
    </div>
  );
}

function Enquiry() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) ?? "").trim();
    if (v("website")) return; // spam trap
    const er: Record<string, string> = {};
    if (!v("name") || v("name").length > 100) er.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) || v("email").length > 255) er.email = "Please enter a valid email.";
    const q = Number(v("qty"));
    if (!Number.isInteger(q) || q < 1 || q > 999) er.qty = "Quantity must be 1 or more.";
    if (v("message").length > 2000) er.message = "Please keep the message under 2000 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    const body = `Name: ${v("name")}\nEmail: ${v("email")}\nPhone: ${v("phone")}\nOrganisation: ${v("org")}\nQuantity: ${q}\n\n${v("message")}`;
    window.location.href = `mailto:${config.enquiryEmail}?subject=${encodeURIComponent("PLAUD NotePin enquiry")}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  const field = (name: string, label: string, props: Record<string, unknown> = {}) => (
    <label className="np-field">
      <span>{label}</span>
      <input name={name} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? name + "-err" : undefined} {...props} />
      {errors[name] && <em id={name + "-err"}>{errors[name]}</em>}
    </label>
  );

  return (
    <section id="enquire" className="np-wrap np-sec np-card">
      <h2>Ask about availability</h2>
      <p>Price, stock, delivery and warranty are confirmed by Digitmask FZE when you ask. This opens your email app with your details filled in.</p>
      <form onSubmit={submit} noValidate className="np-form">
        {field("name", "Name", { required: true, maxLength: 100 })}
        {field("email", "Email", { type: "email", required: true, maxLength: 255 })}
        {field("phone", "Phone (optional)", { type: "tel", maxLength: 30 })}
        {field("qty", "Quantity", { type: "number", min: 1, defaultValue: 1 })}
        {field("org", "Organisation (optional)", { maxLength: 120 })}
        <label className="np-field np-full">
          <span>Message</span>
          <textarea name="message" rows={4} maxLength={2000} />
          {errors.message && <em>{errors.message}</em>}
        </label>
        <input name="website" tabIndex={-1} autoComplete="off" className="np-hp" aria-hidden="true" />
        <button type="submit" className="np-btn np-btn--solid np-full">Open email app</button>
        {opened && <p className="np-full" role="status">Your email app should now be open — press send there to reach us at {config.enquiryEmail}.</p>}
      </form>
    </section>
  );
}
