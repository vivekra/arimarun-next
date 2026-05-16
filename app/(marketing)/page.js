
"use client";

import { useState } from 'react';

export default function MarketingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const doSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Please enter your name and email to continue.');
      return;
    }
    setFormSubmitted(true);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      


<nav>
  <div className="nav-inner">
    <div className="logo">Arima<em>Run</em></div>
    <div className="nav-links">
      <a href="#how">How it works</a>
      <a href="#features">Features</a>
      <a href="#compare">Compare</a>
      <a href="#pricing">Pricing</a>
    </div>
    <div className="nav-right">
      <a href="#start" className="btn btn-primary"  id="nav-cta-desk" style={{ display: "inline-flex" }}>Deploy now →</a>
      <button className="hamburger" id="ham" aria-label="Menu" onClick={toggleMenu}>
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div className="mobile-menu" id="mob-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`}>
    <a href="#how" onClick={closeMenu}>How it works</a>
    <a href="#features" onClick={closeMenu}>Features</a>
    <a href="#compare" onClick={closeMenu}>Compare</a>
    <a href="#pricing" onClick={closeMenu}>Pricing</a>
    <a href="#start" className="btn btn-primary" onClick={closeMenu}>Deploy now →</a>
  </div>
</nav>


<div className="hero">
  <div className="hero-glow"></div>
  <div className="hero-grid"></div>
  <div className="container">
    <div className="hero-badge"><span className="pulse"></span>AI-managed container hosting</div>
    <h1>Deploy your app.<br /><span>We handle everything else.</span></h1>
    <p>ArimaRun gives Indian startups <strong style={{ color: "var(--text)" }}>enterprise-grade container infrastructure</strong> — set up by experts, monitored by AI, managed by humans. From ₹3,000/month. No DevOps hire needed.</p>
    <div className="hero-btns">
      <a href="#start" className="btn btn-primary">Start free trial &nbsp;→</a>
      <a href="#how" className="btn btn-outline">See how it works</a>
    </div>
    <div className="hero-stats">
      <div className="stat"><div className="stat-num">48hr</div><div className="stat-label">Setup time</div></div>
      <div className="stat"><div className="stat-num">₹3K</div><div className="stat-label">Starting / month</div></div>
      <div className="stat"><div className="stat-num">99.9%</div><div className="stat-label">Uptime SLA</div></div>
      <div className="stat"><div className="stat-num">10×</div><div className="stat-label">Cheaper than hiring</div></div>
    </div>
  </div>
</div>


<div className="logos-strip">
  <div className="logos-inner">
    <span className="logos-label">Works with</span>
    <span className="pill">Node.js</span>
    <span className="pill">Python</span>
    <span className="pill">Django</span>
    <span className="pill">React / Next.js</span>
    <span className="pill">Laravel</span>
    <span className="pill">Go</span>
    <span className="pill">Spring Boot</span>
    <span className="pill">FastAPI</span>
  </div>
</div>


<section>
  <div className="container">
    <div className="s-label">The problem</div>
    <h2 className="s-title">You're a startup, not a DevOps team</h2>
    <p className="s-sub">Every week your developers spend on servers is a week not spent on your product.</p>
    <div className="pain-grid">
      <div className="pain-card">
        <div className="pain-ico">💸</div>
        <h3>DevOps is too expensive</h3>
        <p>A mid-level DevOps engineer in India costs ₹60,000–1,00,000 per month. You're pre-Series A — that's not an option.</p>
      </div>
      <div className="pain-card">
        <div className="pain-ico">😵</div>
        <h3>AWS overwhelms your team</h3>
        <p>ECS, VPC, IAM, security groups, load balancers — you wanted containers running, not a cloud architecture degree.</p>
      </div>
      <div className="pain-card">
        <div className="pain-ico">📉</div>
        <h3>Shared hosting breaks at scale</h3>
        <p>Works fine at 10 users. Crashes at 1,000. You need infrastructure that grows with you, not against you.</p>
      </div>
      <div className="pain-card">
        <div className="pain-ico">🔥</div>
        <h3>3am production fires</h3>
        <p>Memory leaks, container crashes, disk full — you're firefighting instead of building. Your runway is burning.</p>
      </div>
    </div>
  </div>
</section>


<section id="how" style={{ paddingTop: "0" }}>
  <div className="container">
    <div className="s-label">How it works</div>
    <h2 className="s-title">From signup to live in 48 hours</h2>
    <p className="s-sub" style={{ marginBottom: "40px" }}>No calls with 10 people. No 2-week onboarding. Just tell us what you're building.</p>
    <div className="how-grid">
      <div className="how-step">
        <div className="step-n">Step 01</div>
        <h3>Tell us your stack</h3>
        <p>Fill a simple form — your tech stack, team size, expected traffic, and preferred cloud provider.</p>
        <span className="time-tag">10 minutes</span>
      </div>
      <div className="how-step">
        <div className="step-n">Step 02</div>
        <h3>We design your infra</h3>
        <p>Our engineer reviews your needs and proposes a container architecture right-sized for your stage and budget.</p>
        <span className="time-tag">Within 24 hours</span>
      </div>
      <div className="how-step">
        <div className="step-n">Step 03</div>
        <h3>We build and hand over</h3>
        <p>Containers live, CI/CD wired, SSL done, monitoring active. A 30-minute walkthrough call with your engineer.</p>
        <span className="time-tag">Within 48 hours</span>
      </div>
      <div className="how-step">
        <div className="step-n">Step 04</div>
        <h3>You ship. We manage.</h3>
        <p>Push your code. ArimaRun's AI monitors uptime, auto-scales on traffic spikes, and alerts us before you notice an issue.</p>
        <span className="time-tag">Ongoing, 24/7</span>
      </div>
    </div>
  </div>
</section>


<section id="features" style={{ paddingTop: "0" }}>
  <div className="container">
    <div className="s-label">Features</div>
    <h2 className="s-title">Everything your infra needs</h2>
    <p className="s-sub" style={{ marginBottom: "40px" }}>Production-grade from day one, without the complexity.</p>
    <div className="feat-grid">

      <div className="feat-card wide">
        <div className="feat-ico">🤖</div>
        <h3>AI-powered monitoring and auto-healing</h3>
        <p>Our AI agent watches your containers 24/7 — detects anomalies, predicts failures before they happen, and auto-restarts unhealthy containers. When something needs a human, we get alerted first. You hear about it only if it matters.</p>
        <div className="tags">
          <span className="tag">Anomaly detection</span>
          <span className="tag">Auto-restart</span>
          <span className="tag">Predictive alerts</span>
          <span className="tag">24/7 watch</span>
        </div>
      </div>

      <div className="feat-card tall">
        <div className="feat-ico blue">⚡</div>
        <h3>CI/CD pipeline included</h3>
        <p>GitHub Actions wired to your containers. Push to main, your app deploys. Zero-downtime by default.</p>
        <div className="tags"><span className="tag">GitHub Actions</span><span className="tag">Zero downtime</span></div>
      </div>

      <div className="feat-card half">
        <div className="feat-ico">📦</div>
        <h3>Docker and Kubernetes managed</h3>
        <p>Start with Docker Compose, graduate to Kubernetes when you need it — no migration pain, no re-architecture.</p>
      </div>

      <div className="feat-card half">
        <div className="feat-ico purple">🔒</div>
        <h3>Security built in</h3>
        <p>SSL certificates, container isolation, network policies, secrets management. Hardened from day one.</p>
      </div>

      <div className="feat-card third">
        <div className="feat-ico blue">📈</div>
        <h3>Auto-scaling</h3>
        <p>Traffic spike at 2am? Containers scale up. Quiet period? They scale back down.</p>
      </div>

      <div className="feat-card third">
        <div className="feat-ico">💬</div>
        <h3>Human support on WhatsApp</h3>
        <p>A real infra engineer, not a bot. WhatsApp for urgent issues, scheduled review calls monthly.</p>
      </div>

      <div className="feat-card third">
        <div className="feat-ico purple">☁️</div>
        <h3>Your cloud, our management</h3>
        <p>AWS, GCP, or DigitalOcean — you choose and own the account. We manage it. Zero lock-in.</p>
      </div>

    </div>
  </div>
</section>


<section style={{ paddingTop: "0" }}>
  <div className="container">
    <div className="ai-wrap">
      <div>
        <div className="s-label">AI-powered</div>
        <h2 className="s-title">Your infra runs on<br /><span>AI autopilot</span></h2>
        <p>ArimaRun isn't just managed hosting. Our AI agent continuously monitors your containers, learns your traffic patterns, and acts before issues become outages.</p>
        <ul className="ai-list">
          <li>Detects memory leaks and restarts containers automatically</li>
          <li>Predicts traffic spikes and pre-scales your containers</li>
          <li>Flags security vulnerabilities in your container images</li>
          <li>Sends weekly infra health reports to your inbox</li>
          <li>Escalates to a human engineer for anything it can't resolve</li>
        </ul>
      </div>
      <div className="terminal">
        <div className="term-bar">
          <div className="dot" style={{ background: "#ff5f57" }}></div>
          <div className="dot" style={{ background: "#ffbd2e" }}></div>
          <div className="dot" style={{ background: "#28ca41" }}></div>
          <span className="term-title">arima-ai-agent — live monitor</span>
        </div>
        <div className="term-body">
          <div><span className="tc">02:14:33</span> <span className="tg">✔</span> <span className="tw">All containers healthy</span></div>
          <div><span className="tc">02:31:07</span> <span className="ty">⚠</span> <span className="tw">Memory spike on api-server</span></div>
          <div><span className="tc">02:31:09</span> <span className="tb">→</span> <span className="tw">Analysing pattern...</span></div>
          <div><span className="tc">02:31:11</span> <span className="tb">→</span> <span className="tw">Cause: slow query leak</span></div>
          <div><span className="tc">02:31:14</span> <span className="tg">✔</span> <span className="tw">Container recycled cleanly</span></div>
          <div><span className="tc">02:31:15</span> <span className="tg">✔</span> <span className="tw">Zero downtime. No action needed.</span></div>
          <div>&nbsp;</div>
          <div><span className="tc">08:00:00</span> <span className="tb">📋</span> <span className="tw">Daily health report sent</span></div>
          <div><span className="tc">08:00:01</span> <span className="tg">✔</span> <span className="tw">Uptime last 24h: 100%</span></div>
        </div>
      </div>
    </div>
  </div>
</section>


<section id="compare" style={{ paddingTop: "0" }}>
  <div className="container">
    <div className="centered">
      <div className="s-label">Comparison</div>
      <h2 className="s-title">ArimaRun vs. the alternatives</h2>
      <p className="s-sub">Why Indian startups choose managed over DIY.</p>
    </div>
    <div className="table-wrap">
      <table className="compare">
        <thead>
          <tr>
            <th>What you need</th>
            <th>AWS / GCP DIY</th>
            <th>Shared hosting</th>
            <th>Hire DevOps</th>
            <th className="hl">ArimaRun ✦</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="feat">Setup time</td><td>Weeks</td><td>Hours (limited)</td><td>Weeks (hiring)</td><td className="hl">48 hours</td></tr>
          <tr><td className="feat">Monthly cost</td><td>₹15K+ infra only</td><td>₹500–2,000</td><td>₹60–100K salary</td><td className="hl">From ₹3,000</td></tr>
          <tr><td className="feat">Scales with traffic</td><td className="yes">✓ Yes</td><td className="no">✗ No</td><td className="yes">✓ Yes</td><td className="hl yes">✓ Auto-scales</td></tr>
          <tr><td className="feat">24/7 monitoring</td><td className="maybe">Paid add-on</td><td className="no">✗ No</td><td className="maybe">Depends</td><td className="hl yes">✓ AI-powered</td></tr>
          <tr><td className="feat">Human support</td><td className="no">Ticket system</td><td className="no">Ticket system</td><td className="yes">✓ Yes</td><td className="hl yes">✓ WhatsApp + calls</td></tr>
          <tr><td className="feat">CI/CD included</td><td className="maybe">You configure it</td><td className="no">✗ No</td><td className="maybe">If they set it up</td><td className="hl yes">✓ Included</td></tr>
          <tr><td className="feat">Zero vendor lock-in</td><td className="no">✗ Locked to AWS</td><td className="no">✗ Locked</td><td className="yes">✓ Yes</td><td className="hl yes">✓ Your account</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>


<section id="pricing" style={{ paddingTop: "0" }}>
  <div className="container">
    <div className="centered">
      <div className="s-label">Pricing</div>
      <h2 className="s-title">Flat monthly fee.<br />No bill shock.</h2>
      <p className="s-sub">Infra cost (your cloud provider) billed at exact cost — zero markup. You pay for expert management, not our margin.</p>
    </div>
    <div className="price-grid">

      <div className="price-card">
        <div className="price-name">Starter</div>
        <div className="price-for">Solo founders and freelancers</div>
        <div className="price-amt"><sup>₹</sup>3,000<sub>/mo</sub></div>
        <div className="price-setup">+ ₹5,000 one-time setup fee</div>
        <ul className="price-feats">
          <li>1 containerised app (Docker)</li>
          <li>1 domain + SSL configured</li>
          <li>Uptime monitoring and alerts</li>
          <li>Monthly health check call</li>
          <li>WhatsApp support (business hours IST)</li>
          <li>Hosted on your chosen provider</li>
        </ul>
        <button className="price-btn" onClick={() => scrollTo('start')}>Get started</button>
      </div>

      <div className="price-card pop">
        <div className="pop-tag">Most popular</div>
        <div className="price-name">Growth</div>
        <div className="price-for">Teams of 5–20 shipping fast</div>
        <div className="price-amt"><sup>₹</sup>8,000<sub>/mo</sub></div>
        <div className="price-setup">+ ₹10,000 one-time setup fee</div>
        <ul className="price-feats">
          <li>Up to 5 containers or microservices</li>
          <li>CI/CD pipeline (GitHub Actions)</li>
          <li>Auto-scaling configuration</li>
          <li>Daily backups with 1-click restore</li>
          <li>Staging and production environments</li>
          <li>AI monitoring and auto-healing</li>
          <li>Bi-weekly review call</li>
          <li>Priority WhatsApp and email support</li>
        </ul>
        <button className="price-btn prim" onClick={() => scrollTo('start')}>Get started</button>
      </div>

      <div className="price-card">
        <div className="price-name">Scale</div>
        <div className="price-for">Funded startups, complex needs</div>
        <div className="price-amt"><sup>₹</sup>18,000<sub>/mo</sub></div>
        <div className="price-setup">+ ₹20,000 one-time setup fee</div>
        <ul className="price-feats">
          <li>Unlimited containers</li>
          <li>Kubernetes cluster management</li>
          <li>Multi-region deployment</li>
          <li>99.9% uptime SLA (written)</li>
          <li>Security audit and hardening</li>
          <li>Dedicated engineer — 5 hrs/week</li>
          <li>Weekly strategy call</li>
          <li>Custom SLA and invoicing</li>
        </ul>
        <button className="price-btn" onClick={() => scrollTo('start')}>Talk to us</button>
      </div>

    </div>
    <p className="price-note">
      A junior DevOps engineer costs <strong>₹60,000–1,00,000/month</strong> in salary alone.<br />
      ArimaRun Growth = <strong style={{ color: "var(--accent)" }}>₹8,000/month</strong>. Same outcome. Zero HR. No notice period.
    </p>
  </div>
</section>


<section id="start" style={{ paddingTop: "0" }}>
  <div className="container">
    <div className="form-box">
      <div className="s-label">Get started</div>
      <h2 className="s-title">Get your <span>setup plan</span></h2>
      <p>Tell us about your startup. We'll review your requirements and send a personalised infra plan within 24 hours — no obligation, no sales call unless you want one.</p>

      <div id="the-form" style={{ display: formSubmitted ? "none" : "block" }}>
        <div className="frow">
          <div className="fg"><label>Your name</label><input type="text" id="f-name" placeholder="Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="fg"><label>Work email</label><input type="email" id="f-email" placeholder="rahul@startup.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        </div>
        <div className="frow">
          <div className="fg"><label>Startup name</label><input type="text" id="f-company" placeholder="My Startup" /></div>
          <div className="fg">
            <label>Team size</label>
            <select id="f-size">
              <option value="">Select...</option>
              <option>1–5 people</option>
              <option>5–20 people</option>
              <option>20–50 people</option>
              <option>50+ people</option>
            </select>
          </div>
        </div>
        <div className="frow">
          <div className="fg"><label>Tech stack</label><input type="text" id="f-stack" placeholder="Node.js, PostgreSQL, React" /></div>
          <div className="fg">
            <label>Plan interest</label>
            <select id="f-plan">
              <option value="">Select...</option>
              <option>Starter — ₹3,000/mo</option>
              <option>Growth — ₹8,000/mo</option>
              <option>Scale — ₹18,000/mo</option>
              <option>Not sure yet</option>
            </select>
          </div>
        </div>
        <div className="frow">
          <div className="fg full"><label>Current hosting situation (optional)</label>
          <textarea id="f-current" placeholder="e.g. On shared hosting, crashes when we hit 200 users..."></textarea></div>
        </div>
        <button className="submit-btn" onClick={doSubmit}>Get my setup plan &nbsp;→</button>
        <p className="fnote">No spam. We respond within 24 hours on business days.</p>
      </div>

      <div className="success" id="success-panel" style={{ display: formSubmitted ? "block" : "none" }}>
        <div className="success-ico">✓</div>
        <h3>You're in!</h3>
        <p>We've received your details and will send a personalised setup plan within 24 hours.<br /><br />
        Questions? WhatsApp us at <strong style={{ color: "var(--accent)" }}>+91 98765 43210</strong></p>
      </div>
    </div>
  </div>
</section>


<footer>
  <div className="container">
    <div className="foot-top">
      <div className="foot-brand">
        <span className="logo">Arima<em>Run</em></span>
        <p>Managed container hosting for Indian startups. Set up by experts, monitored by AI, supported by humans.</p>
        <div className="foot-legal">A product of DigitalQ Information Services Pvt Ltd<br />GST registered · India</div>
      </div>
      <div className="foot-col">
        <h4>Product</h4>
        <a href="#how">How it works</a>
        <a href="#features">Features</a>
        <a href="#compare">Compare</a>
        <a href="#pricing">Pricing</a>
      </div>
      <div className="foot-col">
        <h4>Resources</h4>
        <a href="#">Documentation</a>
        <a href="#">Blog</a>
        <a href="#">Status page</a>
        <a href="#">Changelog</a>
      </div>
      <div className="foot-col">
        <h4>Company</h4>
        <a href="#">About Arima</a>
        <a href="#">Contact us</a>
        <a href="#">Privacy policy</a>
        <a href="#">Terms of service</a>
      </div>
    </div>
    <div className="foot-bottom">
      <span>© 2025 DigitalQ Information Services Pvt Ltd. All rights reserved.</span>
      <span>Built for Indian startups 🇮🇳</span>
    </div>
  </div>
</footer>



    </>
  );
}
  