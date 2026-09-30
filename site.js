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
  const dialog = document.getElementById('lavar-case');
  let returnFocus;
  document.querySelectorAll('[data-open-case]').forEach(button => button.addEventListener('click', () => { returnFocus = button; dialog.showModal(); document.body.style.overflow = 'hidden'; }));
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const box = dialog.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (returnFocus) returnFocus.focus(); });
  document.getElementById('case-inquire').addEventListener('click', () => dialog.close());
  const form = document.getElementById('contact');
  const result = document.getElementById('inquiry-result');
  const output = document.getElementById('inquiry-text');
  const status = document.getElementById('copy-status');
  let intent = 'Project inquiry';
  document.querySelectorAll('[data-intent]').forEach(button => button.addEventListener('click', () => {
    intent = button.dataset.intent;
    document.querySelectorAll('[data-intent]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    document.querySelector('.form-title').textContent = intent === 'Corporate brief' ? 'Tell us about your brief' : 'Your project inquiry';
    form.elements.message.placeholder = intent === 'Corporate brief' ? 'Share your brief link, scope, timing and budget.' : 'Tell us about your goals, timing and budget.';
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
    output.value = `Latin Quarter Collective: ${intent}\n\nName: ${value('name')}\nEmail: ${value('email')}\nOrganization: ${value('organization')}\n\n${value('message')}`;
    status.textContent = ''; form.hidden = true; result.hidden = false; result.querySelector('h3').focus();
  });
  document.getElementById('edit-inquiry').addEventListener('click', () => { result.hidden = true; form.hidden = false; form.elements.name.focus(); });
  document.getElementById('copy-inquiry').addEventListener('click', async () => {
    try { if (!navigator.clipboard) throw new Error('unavailable'); await navigator.clipboard.writeText(output.value); status.textContent = 'Copied. Your inquiry has not been sent.'; }
    catch { output.focus(); output.select(); status.textContent = 'Select and copy the draft above. Your browser could not copy it automatically.'; }
  });
})();
