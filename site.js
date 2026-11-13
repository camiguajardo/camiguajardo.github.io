/* Cami Guajardo — Portfolio
   Pequeñas funciones que antes hacía Cargo: galerías justificadas,
   presentaciones (slideshows), reloj y visor de imágenes. */
(function () {
  const isMobile = () => matchMedia('(max-width: 767px)').matches;
  const ratioOf = el => parseFloat(getComputedStyle(el).getPropertyValue('--ratio')) || 1;

  /* Altura de la cabecera fija -> espacio arriba del contenido */
  function headerSpace() {
    const h = document.querySelector('.pin-top');
    if (h) document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
  }

  /* ---------------- Galería justificada ---------------- */
  function justify(g) {
    const items = [...g.children].filter(c => c.tagName === 'MEDIA-ITEM');
    if (!items.length) return;
    const W = g.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(g).columnGap) || 0;
    const rh = parseFloat((isMobile() && g.getAttribute('mobile-row-height')) || g.getAttribute('row-height') || '30') / 100;
    const target = Math.max(W * rh, 40);
    let row = [], sum = 0;
    const flush = (last) => {
      if (!row.length) return;
      const avail = W - gap * (row.length - 1);
      let h = avail / sum;
      if (last && h > target * 2) h = target; // última fila corta: no estirar demasiado
      row.forEach(it => { it.style.width = Math.floor(ratioOf(it) * h * 100) / 100 - 0.5 + 'px'; });
      row = []; sum = 0;
    };
    items.forEach((it, i) => {
      row.push(it); sum += ratioOf(it);
      const rowW = sum * target + gap * (row.length - 1);
      if (rowW >= W || it.getAttribute('justify-row-end') === 'true') flush(false);
    });
    flush(true);
  }

  /* ---------------- Slideshow ---------------- */
  function slideshow(s) {
    const items = [...s.children].filter(c => c.tagName === 'MEDIA-ITEM');
    if (!items.length) return;
    let i = 0;
    items[0].classList.add('active');
    const speed = parseFloat(s.getAttribute('transition-speed') || '0.5');
    s.style.setProperty('--speed', speed + 's');
    // limit-by="height": alto máximo
    const scale = s.getAttribute('scale');
    if (s.getAttribute('limit-by') === 'height' && scale && /rem|px|vh/.test(scale)) {
      s.style.maxWidth = `calc(${scale} * ${ratioOf(items[0])})`;
    }
    if (items.length < 2) return;
    const go = n => { items[i].classList.remove('active'); i = (n + items.length) % items.length; items[i].classList.add('active'); };
    if (s.getAttribute('navigation') !== 'false') {
      const mk = (cls, txt, d) => {
        const b = document.createElement('button');
        b.className = 'slide-nav ' + cls; b.textContent = txt; b.type = 'button';
        b.setAttribute('aria-label', cls === 'prev' ? 'Anterior' : 'Siguiente');
        b.addEventListener('click', e => { e.stopPropagation(); go(i + d); restart(); });
        s.appendChild(b);
      };
      mk('prev', '‹', -1); mk('next', '›', 1);
    }
    const delay = Math.max(parseFloat(s.getAttribute('autoplay-delay') || '3'), 0.2) * 1000 + speed * 1000;
    let t;
    const restart = () => { clearInterval(t); t = setInterval(() => { if (!(s.matches(':hover') && s.getAttribute('pause-on-hover') === 'true')) go(i + 1); }, delay); };
    restart();
  }

  /* ---------------- Reloj ---------------- */
  function clocks() {
    const lang = document.documentElement.lang === 'es' ? 'es-ES' : 'en-US';
    const els = document.querySelectorAll('digital-clock');
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      els.forEach(el => {
        const h24 = el.getAttribute('twentyfour-hour') === 'true';
        let hr = d.getHours(); if (!h24) hr = hr % 12 || 12;
        const v = (el.getAttribute('value') || '')
          .replace('{hour}', el.getAttribute('pad-hour') === 'true' ? pad(hr) : hr)
          .replace('{minute}', pad(d.getMinutes()))
          .replace('{second}', pad(d.getSeconds()))
          .replace('{day}', d.toLocaleDateString(lang, { weekday: 'long' }).replace(/^./, c => c.toUpperCase()))
          .replace('{month-name}', d.toLocaleDateString(lang, { month: 'long' }).replace(/^./, c => c.toUpperCase()))
          .replace('{day-of-month}', d.getDate())
          .replace('{year}', d.getFullYear());
        el.textContent = v;
      });
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------------- Enlaces en imágenes ---------------- */
  function links() {
    document.querySelectorAll('media-item[href]').forEach(m => {
      m.addEventListener('click', () => { location.href = m.getAttribute('href'); });
    });
  }

  /* ---------------- Visor (lightbox) ---------------- */
  function lightbox() {
    const zoomables = [...document.querySelectorAll('main media-item.zoomable')].filter(m => m.querySelector('img'));
    if (!zoomables.length) return;
    const box = document.createElement('div');
    box.className = 'lightbox'; box.hidden = true;
    box.innerHTML = '<img alt=""><button class="close" type="button" aria-label="Cerrar">×</button>' +
      '<button class="slide-nav prev" type="button" aria-label="Anterior">‹</button>' +
      '<button class="slide-nav next" type="button" aria-label="Siguiente">›</button>';
    document.body.appendChild(box);
    const img = box.querySelector('img');
    let list = [], idx = 0;
    const show = () => {
      const src = list[idx].querySelector('img');
      img.src = src.dataset.full || src.currentSrc || src.src;
    };
    const open = (m) => {
      const group = m.parentElement.closest('gallery-grid,gallery-justify,gallery-columnized,gallery-slideshow');
      list = group ? zoomables.filter(z => group.contains(z)) : [m];
      idx = list.indexOf(m);
      box.querySelectorAll('.slide-nav').forEach(b => b.hidden = list.length < 2);
      show(); box.hidden = false; document.body.style.overflow = 'hidden';
    };
    const close = () => { box.hidden = true; document.body.style.overflow = ''; };
    zoomables.forEach(m => m.addEventListener('click', () => open(m)));
    box.addEventListener('click', close);
    box.querySelector('.prev').addEventListener('click', e => { e.stopPropagation(); idx = (idx - 1 + list.length) % list.length; show(); });
    box.querySelector('.next').addEventListener('click', e => { e.stopPropagation(); idx = (idx + 1) % list.length; show(); });
    addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') box.querySelector('.prev').click();
      if (e.key === 'ArrowRight') box.querySelector('.next').click();
    });
  }

  /* Vídeos: algunos navegadores ignoran autoplay si no están "muted" vía JS */
  function videos() {
    document.querySelectorAll('video[autoplay]').forEach(v => { v.muted = true; v.play && v.play().catch(() => {}); });
  }

  function layout() { headerSpace(); document.querySelectorAll('gallery-justify').forEach(justify); }

  document.addEventListener('DOMContentLoaded', () => {
    layout();
    document.querySelectorAll('gallery-slideshow').forEach(slideshow);
    clocks(); links(); lightbox(); videos();
  });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 100); });
  addEventListener('load', layout);
})();
