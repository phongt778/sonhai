// ...new file...
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // dark toggle
  const body = document.body;
  const darkToggle = document.getElementById('dark-toggle');
  if (localStorage.getItem('dark') === '1') body.classList.add('dark');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const is = body.classList.toggle('dark');
      localStorage.setItem('dark', is ? '1' : '0');
    });
  }

  // edit name (persist)
  const editBtn = document.getElementById('edit-name');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const cur = document.getElementById('name-text').innerText;
      const v = prompt('Nhập tên mới:', cur);
      if (v !== null && v.trim() !== '') {
        document.getElementById('name-text').innerText = v;
        const name2 = document.getElementById('name-text-2');
        if (name2) name2.innerText = v;
        const profileSpan = document.querySelector('#profile-name span');
        if (profileSpan) profileSpan.innerText = v;
        localStorage.setItem('profileName', v);
      }
    });
  }
  const stored = localStorage.getItem('profileName');
  if (stored) {
    const n1 = document.getElementById('name-text');
    const n2 = document.getElementById('name-text-2');
    if (n1) n1.innerText = stored;
    if (n2) n2.innerText = stored;
    const profileSpan = document.querySelector('#profile-name span');
    if (profileSpan) profileSpan.innerText = stored;
  }

  // copy + confetti
  function emitConfetti(x, y) {
    const colors = ['#60a5fa', '#a78bfa', '#34d399', '#f97316', '#fb7185'];
    for (let i = 0; i < 14; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = (x + (Math.random() - 0.5) * 80) + 'px';
      c.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1100);
    }
  }
  const copyBtn = document.getElementById('copy-phone');
  if (copyBtn) {
    copyBtn.addEventListener('click', (ev) => {
      const phoneEl = document.getElementById('phone');
      const txt = phoneEl ? phoneEl.innerText : '';
      if (navigator.clipboard && txt) {
        navigator.clipboard.writeText(txt).then(() => {
          const old = copyBtn.innerText;
          copyBtn.innerText = 'Đã copy';
          setTimeout(() => copyBtn.innerText = old, 1200);
        }).catch(() => { /* ignore */ });
      }
      const rect = copyBtn.getBoundingClientRect();
      emitConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  // ripple for .btn
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });

  // reveal on scroll
  const boxes = document.querySelectorAll('.box');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) { ent.target.classList.add('visible'); io.unobserve(ent.target); }
      });
    }, { threshold: 0.12 });
    boxes.forEach(b => io.observe(b));
  } else {
    // fallback: show all
    boxes.forEach(b => b.classList.add('visible'));
  }

  // typewriter rotate
  const phrases = ['Sinh viên • Thích khám phá', 'Yêu thiên nhiên và câu cá', 'Học hỏi mỗi ngày'];
  let tIdx = 0, ch = 0, forward = true;
  const target = document.getElementById('type-target');
  function tick() {
    if (!target) return;
    const p = phrases[tIdx];
    if (forward) {
      ch++;
      if (ch >= p.length) { forward = false; setTimeout(tick, 1100); return; }
    } else {
      ch--;
      if (ch <= 0) { forward = true; tIdx = (tIdx + 1) % phrases.length; }
    }
    target.textContent = p.slice(0, ch);
    setTimeout(tick, forward ? 70 : 40);
  }
  if (target) tick();

  // particle canvas
  (function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = innerWidth, H = canvas.height = innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        a: 0.2 + Math.random() * 0.6,
        c: ['#60a5fa', '#a78bfa', '#34d399', '#f97316'][Math.floor(Math.random() * 4)]
      });
    }
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      const cssOpacity = parseFloat(getComputedStyle(document.body).getPropertyValue('--particle-opacity')) || 0.9;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
        ctx.beginPath();
        ctx.globalAlpha = p.a * cssOpacity;
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    })();
  })();

  // accessibility: press 'd' to toggle dark
  document.addEventListener('keydown', e => { if (e.key === 'd' && darkToggle) darkToggle.click(); });

  // animated border for each .box
  const palette = [
    ['#FF6B6B','#FFD166'],
    ['#60A5FA','#A78BFA'],
    ['#34D399','#86EFAC'],
    ['#7C5CFF','#F472B6'],
    ['#F97316','#FCA5A5']
  ];

  const containerStyle = document.createElement('style');
  containerStyle.textContent = `
    .box { position:relative; overflow:visible; }
    .box .border-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:3; }
    .box .border-svg rect { fill:none; stroke-width:3; stroke-linejoin:round; stroke-linecap:round; }
    .box:hover .border-svg rect { filter:drop-shadow(0 8px 20px rgba(0,0,0,0.12)); stroke-width:4; }
  `;
  document.head.appendChild(containerStyle);

  function addAnimatedBorder(box, idx) {
    // avoid duplicates
    if (box.querySelector('.border-svg')) return;
    const id = `border-grad-${idx}-${Date.now()}`;
    const animName = `borderAnim${idx}-${Date.now()}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','border-svg');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('preserveAspectRatio','none');

    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    const grad = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    grad.setAttribute('id', id);
    grad.setAttribute('x1','0%'); grad.setAttribute('y1','0%');
    grad.setAttribute('x2','100%'); grad.setAttribute('y2','0%');
    const colors = palette[idx % palette.length];
    for (let i = 0; i < colors.length; i++) {
      const stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
      stop.setAttribute('offset', (i / (colors.length - 1)) * 100 + '%');
      stop.setAttribute('stop-color', colors[i]);
      grad.appendChild(stop);
    }
    defs.appendChild(grad);
    svg.appendChild(defs);

    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x','0');
    rect.setAttribute('y','0');
    rect.setAttribute('width','100%');
    rect.setAttribute('height','100%');
    rect.setAttribute('stroke', `url(#${id})`);
    rect.setAttribute('stroke-dasharray', '400');
    rect.setAttribute('stroke-dashoffset', '400');
    svg.appendChild(rect);

    box.appendChild(svg);

    // animate
    requestAnimationFrame(function animateBorder() {
      const l = rect.getTotalLength();
      rect.setAttribute('stroke-dashoffset', l);
      rect.setAttribute('stroke-dasharray', l);
      rect.style.transition = 'none';
      setTimeout(() => {
        rect.style.transition = 'stroke-dashoffset 1.2s ease-in-out, stroke-dasharray 1.2s ease-in-out';
        rect.setAttribute('stroke-dashoffset', '0');
      }, 20);
    });
  }

  boxes.forEach(addAnimatedBorder);
});