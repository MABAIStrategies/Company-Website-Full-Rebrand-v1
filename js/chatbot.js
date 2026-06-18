/* ═══════════════════════════════════════════════════════════════
   MAB AI — PERSISTENT CHATBOT WIDGET
   Agentic dark theme · Knowledge base responses · Webhook-ready
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ────────── KNOWLEDGE BASE (stateless FAQ engine) ────────── */
  const KB = [
    {
      keys: ["pricing","price","cost","tier","how much","foundation","accelerator","principal","retainer","invest"],
      answer: `All ongoing engagements are monthly retainers:<br>
        <strong>Foundation</strong> — $2,500/mo (2 workflows/mo, AI audit, monthly strategy call)<br>
        <strong>Accelerator</strong> — $5,500/mo (6 workflows/mo, 1 agent/quarter, 90-day ROI guarantee)<br>
        <strong>Principal</strong> — Custom/mo (fractional Chief AI Officer, unlimited builds)<br>
        One-off engagements also available — AI Audit ($2,000), Sprint Build ($3,500+), Speaking (custom).<br>
        Not sure which fits? <a href="https://calendar.app.google/kuwKF2VrDuyvdfN9A" target="_blank">Book a free 30-min briefing</a> — we'll tell you exactly.`
    },
    {
      keys: ["roi","return","results","proof","impact","12m","$12","how much money","revenue"],
      answer: `$12M+ in documented B2B revenue impact across 250+ deployments. One case study: a Director of Staff recovered <strong>15 hours/week</strong> from a single candidate-vetting agent — her estimate was ~$40,000 in annual net liquidity, plus near-10% YoY output improvement from her team. Every engagement is measured against agreed-on metrics.`
    },
    {
      keys: ["agent","agents","custom agent","langgraph","langchain","crewai","autogen","ag2","build","automate","automation"],
      answer: `Custom AI agents are our core capability. We build on <strong>LangGraph, CrewAI v0.9, AG2 (AutoGen v0.4), or the OpenAI Agents SDK</strong> — whichever fits your stack. Agents handle multi-step reasoning, tool calling (API, CRM, ATS, email), and human-in-the-loop checkpoints. LLM backends: o3, GPT-4.5, Claude 4 Sonnet, Gemini 2.5 Pro, Llama 4 Scout. Want a demo? <a href="https://calendar.app.google/kuwKF2VrDuyvdfN9A" target="_blank">Schedule here.</a>`
    },
    {
      keys: ["audit","readiness","assessment","process","inefficiency","bottleneck","map"],
      answer: `The AI Readiness Audit is our diagnostic. We map your entire operation, quantify the cost of each inefficiency, and deliver an ROI-ranked roadmap — which automations to build first, and exactly what each is worth. Typically takes 1–2 weeks. Included in all retainer tiers; available standalone at $2,000.`
    },
    {
      keys: ["speaking","keynote","conference","advisory","board","workshop"],
      answer: `Mark Bockrath is available for keynotes, leadership workshops, and advisory board roles. Topics: AI adoption strategy, agentic workflow design, ROI frameworks for automation, future of human-AI collaboration. <a href="mailto:mark@mabaistrategies.com">Email mark@mabaistrategies.com</a> to discuss availability and fees.`
    },
    {
      keys: ["webhook","n8n","make","zapier","integration","connect","crm","ats","erp","salesforce","hubspot","slack"],
      answer: `We're integration-first. We work natively with most CRMs (HubSpot, Salesforce, Pipedrive), ATS (Greenhouse, Lever, Workday), Slack, Teams, Gmail/Outlook, and custom APIs. Orchestration platforms: n8n v1.x, Make, Zapier AI. If it has an API or webhook endpoint, we can wire it in.`
    },
    {
      keys: ["member","portal","login","access","client","dashboard","repo","workflow library"],
      answer: `Active clients get a dedicated workspace — workflow repository, deployment logs, ROI dashboards, and async support — provisioned at engagement kickoff (the secure login is rolling out soon). New client? <a href="https://calendar.app.google/kuwKF2VrDuyvdfN9A" target="_blank" rel="noopener">Book an onboarding briefing</a> and we'll get you set up.`
    },
    {
      keys: ["secure","security","gdpr","soc 2","compliance","data","privacy","safe"],
      answer: `Every engagement starts with a security architecture review. We design pipelines to be SOC 2- and GDPR-aligned, implement encrypted data flows, and establish data retention policies before writing a single line of automation code. Your proprietary data is never used to train external models without written consent.`
    },
    {
      keys: ["contact","reach","talk","meet","email","schedule","book","call","phone","mark"],
      answer: `Best ways to reach Mark:<br>
        📅 <a href="https://calendar.app.google/kuwKF2VrDuyvdfN9A" target="_blank">Schedule a free 30-min briefing</a><br>
        📧 <a href="mailto:mark@mabaistrategies.com">mark@mabaistrategies.com</a><br>
        💼 <a href="https://www.linkedin.com/in/mark-bockrath-a5a1b2196/" target="_blank">LinkedIn</a><br>
        He responds within a few hours, usually.`
    },
    {
      keys: ["how long","timeline","time","fast","quick","turnaround","deploy","how soon"],
      answer: `Timelines: <strong>AI Readiness Audit</strong> — 1-2 weeks. <strong>Single automation workflow</strong> — 5-10 business days. <strong>Custom AI agent</strong> — 2-4 weeks depending on complexity. Accelerator and Principal retainers have monthly ROI milestones. We do not do open-ended timelines — you'll see results or you won't be billed.`
    },
    {
      keys: ["different","compete","vs","compare","consultancy","agency","why you","why mab"],
      answer: `Unlike large consultancies, you get <strong>Mark Bockrath directly</strong> on every engagement — not a junior analyst billed at principal rates. We identify your highest-ROI automation, build it, measure it, and scale it. No upsell cycles, no inflated scopes. $12M+ in documented impact across 250+ deployments.`
    },
    {
      keys: ["services","what do you do","what do you offer","capabilities","what can you build"],
      answer: `Six core capabilities:<br>
        🔍 AI Readiness Audits<br>
        📦 Automation Library (250+ templates)<br>
        🤖 Custom AI Agents<br>
        ⚡ Workflow Automation (24/7)<br>
        🌐 Conversion Web Experiences<br>
        👑 Fractional AI Architecture (CAO-level)<br>
        <a href="services.html">Full services page →</a>`
    }
  ];

  /* ────────── QUICK REPLIES ────────── */
  const QUICK_REPLIES = [
    { label:"💰 Pricing", query:"What are your pricing tiers?" },
    { label:"📅 Book a call", query:"How do I schedule a briefing?" },
    { label:"🤖 Custom agents", query:"Tell me about custom AI agents" },
    { label:"📈 ROI proof", query:"What ROI results have you achieved?" }
  ];

  /* ────────── GREETING SEQUENCE ────────── */
  const GREET = [
    "Hey! I'm the MAB AI assistant — how can I help you today?",
    "I can answer questions about our services, pricing, past results, or help you book a strategic briefing with Mark."
  ];

  /* ────────── BUILD THE DOM ────────── */
  function buildWidget() {
    // Trigger button
    const trigger = document.createElement('button');
    trigger.id = 'chatbot-trigger';
    trigger.setAttribute('aria-label', 'Open AI assistant');
    trigger.innerHTML = `
      <i class="fa-solid fa-robot cb-open"></i>
      <i class="fa-solid fa-xmark cb-close"></i>
      <span class="cb-notif">1</span>`;
    document.body.appendChild(trigger);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'chatbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'MAB AI Chat Assistant');
    panel.innerHTML = `
      <div class="cb-head">
        <div class="cb-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="cb-info">
          <strong>MAB·AI Assistant</strong>
          <span>Online · Replies instantly</span>
        </div>
      </div>
      <div class="cb-body" id="cb-body" aria-live="polite" aria-label="Chat messages"></div>
      <div class="cb-quick-replies" id="cb-qr-row"></div>
      <div class="cb-foot">
        <input id="cb-input" type="text" placeholder="Ask me anything…" autocomplete="off" maxlength="400">
        <button id="cb-send" aria-label="Send"><i class="fa-solid fa-paper-plane"></i></button>
      </div>`;
    document.body.appendChild(panel);

    // Quick reply row
    const qrRow = panel.querySelector('#cb-qr-row');
    QUICK_REPLIES.forEach(qr => {
      const btn = document.createElement('button');
      btn.className = 'cb-qr';
      btn.textContent = qr.label;
      btn.addEventListener('click', () => { sendMessage(qr.query); });
      qrRow.appendChild(btn);
    });

    return { trigger, panel };
  }

  /* ────────── CHAT LOGIC ────────── */
  let isOpen = false;
  let greeted = false;
  const { trigger, panel } = buildWidget();
  const body    = panel.querySelector('#cb-body');
  const input   = panel.querySelector('#cb-input');
  const sendBtn = panel.querySelector('#cb-send');

  function appendMsg(text, role) {
    const wrap = document.createElement('div');
    wrap.className = `cb-msg cb-msg--${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'cb-bubble';
    // Security: only the trusted knowledge-base (bot) answers may contain markup.
    // Anything originating from the visitor is rendered as inert text to prevent
    // HTML/script injection (DOM-based XSS) via the chat input.
    if (role === 'bot') {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return bubble;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'cb-msg cb-msg--bot';
    wrap.id = 'cb-typing-indicator';
    wrap.innerHTML = `<div class="cb-typing"><span></span><span></span><span></span></div>`;
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('cb-typing-indicator');
    if (t) t.remove();
  }

  function findAnswer(q) {
    const lower = q.toLowerCase();
    for (const item of KB) {
      if (item.keys.some(k => lower.includes(k))) return item.answer;
    }
    return `I don't have a specific answer for that — but Mark definitely will. <a href="https://calendar.app.google/kuwKF2VrDuyvdfN9A" target="_blank">Book a free 30-min briefing</a> or <a href="mailto:mark@mabaistrategies.com">email him directly</a>. He usually responds within a few hours.`;
  }

  async function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text) return;
    input.value = '';
    appendMsg(text, 'user');

    showTyping();
    await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
    hideTyping();
    appendMsg(findAnswer(text), 'bot');

    /* Optional: forward to n8n webhook for logging / human handoff
    try {
      await fetch('YOUR_WEBHOOK_URL_HERE', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, ts: new Date().toISOString(), source: window.location.pathname })
      });
    } catch(e) {} // silent fail
    */
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    setTimeout(() => appendMsg(GREET[0], 'bot'), 400);
    setTimeout(() => appendMsg(GREET[1], 'bot'), 1100);
    // hide notif
    const notif = trigger.querySelector('.cb-notif');
    if (notif) notif.style.display = 'none';
  }

  function toggle() {
    isOpen = !isOpen;
    trigger.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      greet();
      setTimeout(() => input.focus(), 350);
    }
  }

  trigger.addEventListener('click', toggle);
  sendBtn.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) toggle();
  });

  // Auto-open once with delay (only on first visit to any page, once per session)
  if (!sessionStorage.getItem('cb_auto')) {
    sessionStorage.setItem('cb_auto', '1');
    setTimeout(() => {
      if (!isOpen) toggle();
    }, 8000);
  }
})();
