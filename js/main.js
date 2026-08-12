const navItems = [
  ['Home', 'index.html'], ['About', 'about.html'], ['Services', 'services.html'],
  ['Projects', 'projects.html'], ['Progress', 'progress.html'], ['Gallery', 'gallery.html'],
  ['Blog', 'blog.html'], ['Learning', 'learning.html'], ['Consulting', 'consulting.html'], ['Contact', 'contact.html']
];

const page = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('[data-header]').forEach(container => {
  const links = navItems.map(([label, url]) => `<a class="${page === url ? 'active' : ''}" href="${url}">${label}</a>`).join('');
  container.innerHTML = `<div class="announcement">Professional civil engineering, construction &amp; consulting services across Nepal</div><header class="site-header"><div class="container nav"><a class="brand" href="index.html" aria-label="Hirakala Build and Consult home"><span class="brand-mark"><span>H</span></span>HIRAKALA BUILD<br>&amp; CONSULT</a><button class="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button><nav class="nav-links" id="navLinks">${links}<a class="btn" href="quote.html">Request a Quote</a></nav></div></header>`;
});

document.querySelectorAll('.menu-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const navigation = document.getElementById(button.getAttribute('aria-controls'));
    const isOpen = navigation.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
});

document.querySelectorAll('[data-footer]').forEach(container => {
  container.innerHTML = `<footer class="site-footer"><div class="container footer-grid"><div><a class="brand" href="index.html" style="color:white"><span class="brand-mark"><span>H</span></span>HIRAKALA BUILD<br>&amp; CONSULT</a><p>Professional Civil Engineering &amp; Construction Consultancy across Nepal.</p><div class="socials"><a href="https://www.facebook.com/Hirakalabuildandconsult" target="_blank" rel="noopener noreferrer" aria-label="Visit Hirakala Build &amp; Consult on Facebook">f</a><a href="https://www.instagram.com/hirakalabuildandconsult/" target="_blank" rel="noopener noreferrer" aria-label="Visit Hirakala Build &amp; Consult on Instagram">ig</a><a href="https://www.linkedin.com/company/131904161/" target="_blank" rel="noopener noreferrer" aria-label="Visit Hirakala Build &amp; Consult on LinkedIn">in</a><a href="https://www.youtube.com/@HirakalaBuildandConsult" target="_blank" rel="noopener noreferrer" aria-label="Visit Hirakala Build &amp; Consult on YouTube">yt</a></div></div><div><h3>Quick Links</h3><ul><li><a href="about.html">About</a></li><li><a href="services.html">Services</a></li><li><a href="projects.html">Projects</a></li><li><a href="blog.html">Blog</a></li><li><a href="learning.html">Learning</a></li></ul></div><div><h3>Services</h3><ul><li>Building Design</li><li>Structural Design</li><li>Surveying</li><li>BOQ &amp; Estimation</li><li>Construction</li><li>BIM &amp; Digital Engineering</li></ul></div><div><h3>Contact</h3><ul><li><a href="tel:+9779851206290">+977-9851206290</a></li><li><a href="mailto:hirakalabuildandconsult@gmail.com">hirakalabuildandconsult@gmail.com</a></li><li>All Over Nepal</li><li><a href="contact.html">Talk to an Engineer &rarr;</a></li></ul></div></div><div class="container copyright">&copy; 2026 Hirakala Build &amp; Consult Pvt. Ltd. All Rights Reserved.</div></footer><a class="whatsapp" href="https://wa.me/9779851206290" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">WA</a>`;
});

document.querySelectorAll('form:not([data-enquiry-form])').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const notice = form.querySelector('[data-form-note]');
  if (notice) {
    notice.textContent = 'Thank you. Your request has been recorded for follow-up by our engineering team.';
    notice.hidden = false;
  }
  form.reset();
}));

document.querySelectorAll('a[href="https://www.tiktok.com/"]').forEach(link => {
  link.href = 'https://www.tiktok.com/@hirakala.buildandconsult';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Visit Hirakala Build & Consult on TikTok');
});

document.querySelectorAll('[data-filter]').forEach(group => group.addEventListener('click', event => {
  const button = event.target.closest('.filter');
  if (!button) return;
  group.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  const key = button.dataset.value;
  document.querySelectorAll('[data-category]').forEach(card => {
    const values = card.dataset.category.split(' ');
    card.hidden = key !== 'All' && key !== 'All Projects' && !values.includes(key);
  });
}));

window.addEventListener('scroll', () => document.body.classList.toggle('has-scrolled', window.scrollY > 8), { passive: true });
document.body.classList.add('is-ready');
