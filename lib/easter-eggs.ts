/* ─── Easter Eggs ────────────────────────────────────────────────────────────
   Initialized once in layout.tsx. Not documented anywhere on the site.
   Discovered by curious people only.
 ─────────────────────────────────────────────────────────────────────────── */

export function initEasterEggs() {
  if (typeof window === 'undefined') return;
  egg1_konami();
  egg2_console();
  egg4_cursorTrail();
  egg5_promptClickCounter();
  egg7_tabTitle();
}

/* ── EGG 1: Konami Code → Matrix Rain ──────────────────────────────────── */
const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

function egg1_konami() {
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        playBeep();
        triggerMatrixRain();
        idx = 0;
      }
    } else {
      idx = e.key === KONAMI[0] ? 1 : 0;
    }
  });
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.12);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.13);
    });
  } catch {/* silently skip if AudioContext blocked */}
}

function triggerMatrixRain() {
  // Prevent double-trigger
  if (document.getElementById('egg-matrix')) return;

  const KATAKANA =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const MIXED = KATAKANA + '0123456789!@#$%^&*<>/\\|=+-_[]{}';

  const overlay = document.createElement('div');
  overlay.id = 'egg-matrix';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '9999',
    background: '#000', opacity: '0',
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
  });

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  Object.assign(canvas.style, { display: 'block' });
  overlay.appendChild(canvas);

  // Message overlay
  const msg = document.createElement('div');
  Object.assign(msg.style, {
    position: 'absolute', inset: '0',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    opacity: '0', transition: 'opacity 0.8s ease',
    pointerEvents: 'none',
  });
  msg.innerHTML = `
    <p style="font-family:monospace;font-size:clamp(16px,3vw,28px);
              color:#00ff41;letter-spacing:0.15em;text-shadow:0 0 20px #00ff41;
              text-align:center">ACCESS GRANTED. WELCOME TO THE SYSTEM.</p>
    <p style="font-family:monospace;font-size:clamp(10px,1.5vw,14px);
              color:#006622;margin-top:12px;text-align:center">
      // yashwardhan.exe has entered the building</p>`;
  overlay.appendChild(msg);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => { overlay.style.opacity = '1'; });

  const ctx = canvas.getContext('2d')!;
  const fontSize = 14;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: cols }, () => Math.random() * -50);

  let rafId: number;
  const draw = () => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = '#00ff41';
    drops.forEach((y, i) => {
      const char = MIXED[Math.floor(Math.random() * MIXED.length)];
      ctx.fillStyle = y * fontSize < 40 ? '#ffffff' : '#00ff41';
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    rafId = requestAnimationFrame(draw);
  };
  rafId = requestAnimationFrame(draw);

  // Show message at 2s
  setTimeout(() => { msg.style.opacity = '1'; }, 2000);

  // Fade out and clean up at 5s
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      cancelAnimationFrame(rafId);
      overlay.remove();
    }, 500);
  }, 5000);
}

/* ── EGG 2: Console Message ─────────────────────────────────────────────── */
function egg2_console() {
  console.log('%c', 'font-size:0');
  console.log(
    '%c YASHWARDHAN SINGH TOMAR ',
    'background:#00ff41;color:#000;font-size:14px;font-weight:bold;padding:4px 8px;font-family:monospace;',
  );
  console.log(
    '%c root@yst:~$ cat secrets.txt ',
    'color:#00ff41;font-family:monospace;font-size:12px;',
  );
  console.log(
    "%c > You found the console. You're exactly the kind of person I want to work with.\n > Stack: Next.js · FastAPI · C++20 · Gemini · Playwright\n > Currently: Building agentic systems that actually work.\n > Hiring? → yashwardhansingh.tomar@outlook.com ",
    'color:#33ff66;font-family:monospace;font-size:11px;line-height:1.8;',
  );
  console.log(
    '%c // No flags hidden here. Just vibes. ',
    'color:#006622;font-family:monospace;font-size:10px;font-style:italic;',
  );
}

/* ── EGG 4: Cursor Trail in Hero ────────────────────────────────────────── */
function egg4_cursorTrail() {
  const CHARS = ['·', '·', '+', '·', '×'];
  const MAX   = 8;
  const LIFE  = 600; // ms
  let nextId  = 0;

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed', inset: '0',
    pointerEvents: 'none', zIndex: '9000', overflow: 'hidden',
  });
  document.body.appendChild(container);

  const attach = () => {
    const hero = document.getElementById('hero');
    if (!hero) { setTimeout(attach, 500); return; }

    const dots: HTMLElement[] = [];

    hero.addEventListener('mousemove', (e) => {
      const dot = document.createElement('span');
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const id = nextId++;
      dot.textContent = char;
      dot.dataset.id = String(id);
      Object.assign(dot.style, {
        position: 'fixed',
        left: `${e.clientX - 4}px`,
        top: `${e.clientY - 4}px`,
        color: '#00ff41',
        fontFamily: 'monospace',
        fontSize: '10px',
        opacity: '1',
        transition: `opacity ${LIFE}ms linear`,
        pointerEvents: 'none',
        userSelect: 'none',
      });
      container.appendChild(dot);
      dots.push(dot);

      // Limit trail length
      if (dots.length > MAX) {
        const old = dots.shift();
        old?.remove();
      }

      // Fade out
      requestAnimationFrame(() => { dot.style.opacity = '0'; });
      setTimeout(() => dot.remove(), LIFE + 50);
    });
  };

  attach();
}

/* ── EGG 5: Navbar Prompt Click Counter ─────────────────────────────────── */
function egg5_promptClickCounter() {
  const LINES = [
    'root@yst:~$ sudo rm -rf /*',
    '[SUDO] password for yst: ',
    "rm: cannot remove '/': Permission denied",
    "rm: cannot remove '/bin': Operation not permitted",
    '// nice try ;)',
  ];

  let clicks = 0;
  let timer: ReturnType<typeof setTimeout>;
  let dropdown: HTMLElement | null = null;

  const attach = () => {
    const prompt = document.querySelector('[data-egg-prompt]') as HTMLElement | null;
    if (!prompt) { setTimeout(attach, 500); return; }

    prompt.addEventListener('click', () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 2000);

      if (clicks < 5) return;
      clicks = 0;

      // Remove existing dropdown
      dropdown?.remove();

      dropdown = document.createElement('div');
      Object.assign(dropdown.style, {
        position: 'absolute',
        top: '100%',
        left: '0',
        marginTop: '4px',
        background: '#000',
        border: '1px solid #003d0f',
        padding: '10px 14px',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#33ff66',
        zIndex: '9999',
        minWidth: '340px',
        lineHeight: '1.8',
        whiteSpace: 'nowrap',
      });

      prompt.style.position = 'relative';
      prompt.appendChild(dropdown);

      let i = 0;
      const printLine = () => {
        if (i >= LINES.length) {
          setTimeout(() => {
            dropdown?.remove();
            dropdown = null;
          }, 2000);
          return;
        }
        const line = document.createElement('div');
        line.textContent = LINES[i];
        if (i === 0) line.style.color = '#00ff41';
        if (i >= 2) line.style.color = '#ff4444';
        if (i === LINES.length - 1) line.style.color = '#006622';
        dropdown?.appendChild(line);
        i++;
        setTimeout(printLine, 340);
      };
      printLine();
    });
  };

  attach();
}

/* ── EGG 7: Tab Title Changes ───────────────────────────────────────────── */
function egg7_tabTitle() {
  const defaultTitle = document.title;
  let restoreTimer: ReturnType<typeof setTimeout>;

  document.addEventListener('visibilitychange', () => {
    clearTimeout(restoreTimer);
    if (document.hidden) {
      document.title = '⚠ system idle... come back';
    } else {
      document.title = '✓ root@yst:~$ welcome back_';
      restoreTimer = setTimeout(() => {
        document.title = defaultTitle;
      }, 3000);
    }
  });
}
