/* ═══════════════════════════════════════════════════════════════
   MAB AI — CONTACT PAGE
   Mini-torus config + contact form delivery.
   Extracted from an inline <script> so the CSP can drop 'unsafe-inline'
   from script-src. Must load BEFORE torus.js so __MINI_TORUS__ is set
   before the torus boots.
   ═══════════════════════════════════════════════════════════════ */
window.__MINI_TORUS__ = { canvasId:'mini-torus', particleCount:900, scale:0.48 };

document.addEventListener('DOMContentLoaded', () => {
  /* ─────────────────────────────────────────────────────────────
     CONTACT FORM DELIVERY
     Set CONTACT_ENDPOINT to a Formspree endpoint (https://formspree.io/f/XXXXXXX)
     or a Make.com / n8n / Zapier webhook URL to deliver submissions directly.
     While it is left blank, the form opens the visitor's email client with a
     pre-filled message — so submissions always have a working path and never
     silently fail.
     ───────────────────────────────────────────────────────────── */
  const CONTACT_ENDPOINT = '';
  const CONTACT_EMAIL    = 'mark@mabaistrategies.com';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function buildMailto(p) {
    const subject = encodeURIComponent('MAB AI — Inquiry from ' + (p.name || 'website visitor'));
    const body = encodeURIComponent(
      `Name: ${p.name}\nEmail: ${p.email}\nCompany: ${p.company || '—'}\nService: ${p.service || '—'}\n\n${p.message}`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn    = document.getElementById('form-submit-btn');
    const status = document.getElementById('form-status-msg');
    const label  = btn.querySelector('.btn-label');
    const origLabel = label.innerHTML;

    const payload = {
      name:    form.querySelector('#cf-name').value.trim(),
      email:   form.querySelector('#cf-email').value.trim(),
      company: form.querySelector('#cf-company').value.trim(),
      service: form.querySelector('#cf-service').value,
      message: form.querySelector('#cf-message').value.trim(),
      source:  'MAB AI Website — Contact Page',
      ts:      new Date().toISOString()
    };

    // Client-side validation
    if (!payload.name || !payload.email || !payload.message) {
      status.className = 'form-status error';
      status.textContent = 'Please fill in your name, a valid email, and a message.';
      return;
    }
    if (!isEmail(payload.email)) {
      status.className = 'form-status error';
      status.textContent = 'That email address doesn’t look right — please double-check it.';
      return;
    }

    // No endpoint configured → guaranteed email-client path
    if (!CONTACT_ENDPOINT) {
      window.location.href = buildMailto(payload);
      status.className = 'form-status success';
      status.innerHTML = '<i class="fa-solid fa-envelope"></i> Opening your email client… if nothing happens, email <strong>' + CONTACT_EMAIL + '</strong> directly.';
      return;
    }

    // Endpoint configured → POST directly
    label.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.style.pointerEvents = 'none';
    status.className = 'form-status';
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        status.className = 'form-status success';
        status.innerHTML = '<i class="fa-solid fa-check-circle"></i> Message received. Expect a response within one business day — usually sooner.';
        form.reset();
      } else {
        throw new Error('Non-OK response: ' + res.status);
      }
    } catch (err) {
      const link = buildMailto(payload);
      status.className = 'form-status error';
      status.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Direct send failed. <a href="' + link + '" style="color:inherit;text-decoration:underline;">Send via your email client</a> — or email ' + CONTACT_EMAIL + ' directly.';
    } finally {
      label.innerHTML = origLabel;
      btn.style.pointerEvents = '';
    }
  });
});
