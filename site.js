(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('js-motion');
  }
  // The original photography stays visible until approved video can actually play.
  const videoSource = window.LQC_MEDIA?.heroVideo;
  if (videoSource) {
    const stage = document.querySelector('.hero-art');
    const video = document.createElement('video');
    const toggle = document.createElement('button');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    video.className = 'hero-video'; video.muted = true; video.loop = true;
    video.playsInline = true; video.preload = 'metadata';
    video.poster = 'assets/culture.webp'; video.setAttribute('aria-label', 'Latin Quarter campaign highlights');
    toggle.className = 'video-toggle'; toggle.type = 'button'; toggle.textContent = 'Play video';
    toggle.hidden = true;
    const sync = () => { toggle.textContent = video.paused ? 'Play video' : 'Pause video'; };
    video.addEventListener('loadeddata', () => {
      stage.classList.add('has-video'); toggle.hidden = false;
      if (!reducedMotion) video.play().catch(sync);
    });
    video.addEventListener('error', () => { stage.classList.remove('has-video'); toggle.hidden = true; });
    video.addEventListener('play', sync); video.addEventListener('pause', sync);
    toggle.addEventListener('click', () => { if (video.paused) video.play().catch(sync); else video.pause(); });
    stage.append(video, toggle); video.src = videoSource;
  }
  const dialog = document.getElementById('lavar-case');
  let returnFocus;
  document.querySelectorAll('[data-open-case]').forEach(button => button.addEventListener('click', () => { returnFocus = button; dialog.showModal(); document.body.style.overflow = 'hidden'; }));
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const box = dialog.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (returnFocus) returnFocus.focus(); });
  document.getElementById('case-inquire').addEventListener('click', () => { dialog.close(); document.querySelector('[data-intent="Lavar partnership"]').click(); });
  const form = document.getElementById('contact');
  const result = document.getElementById('inquiry-result');
  const output = document.getElementById('inquiry-text');
  const status = document.getElementById('copy-status');
  let intent = 'General inquiry';
  document.querySelectorAll('[data-intent]').forEach(button => button.addEventListener('click', () => {
    intent = button.dataset.intent;
    document.querySelectorAll('[data-intent]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    document.querySelector('.form-title').textContent = intent === 'Lavar partnership' ? 'Your Lavar partnership inquiry' : 'Your general inquiry';
    form.elements.message.placeholder = intent === 'Lavar partnership' ? 'Tell us about the brand, partnership idea, deliverables and budget.' : 'Tell us about your goals, timing and budget. You can include a link to your brief.';
    document.getElementById('race-field').hidden = intent !== 'Lavar partnership';
    result.hidden = true; form.hidden = false;
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const error = document.getElementById('form-error'); error.textContent = '';
    if (!form.reportValidity()) return;
    const fields = ['name', 'email', 'organization', 'message'];
    const empty = fields.find(k => !form.elements[k].value.trim());
    if (empty) { error.textContent = 'Please complete each field before preparing your inquiry.'; form.elements[empty].focus(); return; }
    const value = k => form.elements[k].value.trim();
    output.value = `Latin Quarter Collective: ${intent}\n\nName: ${value('name')}\nEmail: ${value('email')}\nOrganization: ${value('organization')}${intent === 'Lavar partnership' && value('race') ? `\nRace / timing: ${value('race')}` : ''}\n\n${value('message')}`;
    status.textContent = ''; form.hidden = true; result.hidden = false; result.querySelector('h3').focus();
  });
  document.getElementById('edit-inquiry').addEventListener('click', () => { result.hidden = true; form.hidden = false; form.elements.name.focus(); });
  document.getElementById('copy-inquiry').addEventListener('click', async () => {
    try { if (!navigator.clipboard) throw new Error('unavailable'); await navigator.clipboard.writeText(output.value); status.textContent = 'Copied. Your inquiry has not been sent.'; }
    catch { output.focus(); output.select(); status.textContent = 'Select and copy the draft above. Your browser could not copy it automatically.'; }
  });
})();
