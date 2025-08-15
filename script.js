let childFed = false;
let hasSeenInstructions = false;

const tips = [
  "אכלו ירקות צבעוניים בכל ארוחה",
  "שתו הרבה מים במהלך היום",
  "נסו להימנע מממתקים לפני הארוחות",
  "אכלו פירות במקום קינוחים מתוקים",
  "זכרו ללעוס היטב את האוכל",
  "אל תשכחו לאכול ארוחת בוקר בריאה",
  "שלבו קטניות ודגנים בארוחות שלכם",
  "הימנעו ממשקאות ממותקים",
  "נסו לטעום דברים חדשים ובריאים"
];

function setFed(fed) {
  childFed = fed;
  closeSideNav(); // auto close after choosing
}

function startTest() {
  const msg = document.getElementById("message");
  const tip = document.getElementById("tip");
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  const confettiCanvas = document.getElementById("confetti-canvas");

  // Reset UI
  msg.style.display = "none";
  tip.innerText = "";
  loader.style.display = "block";
  loaderBar.style.width = "0";
  confettiCanvas && (confettiCanvas.style.display = "none");

  // Show a random tip during loading
  showRandomTip();

  // Animate loading bar (5s)
  setTimeout(() => {
    loaderBar.style.width = "100%";
  }, 100);

  // Show result after ~5.1s
  setTimeout(() => {
    loader.style.display = "none";
    msg.style.display = "block";

    if (childFed) {
      msg.innerText = "אכל(ה) מספיק!";
      msg.style.backgroundColor = "#2ecc71";
      playBeep(880, 300);
      triggerConfetti();
    } else {
      msg.innerText = "לא אכל(ה) מספיק, עדיין יש מקום!";
      msg.style.backgroundColor = "#e74c3c";
      playBeep(400, 300);
    }

    // Auto-hide message after 30s
    setTimeout(() => {
      msg.style.display = "none";
      confettiCanvas && (confettiCanvas.style.display = "none");
    }, 30000);
  }, 5100);
}

function showRandomTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const tipBox = document.getElementById("tip");
  if (tipBox) tipBox.innerText = randomTip;
}

function playBeep(frequency, duration) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = frequency;
  osc.start();
  gain.gain.setValueAtTime(1, ctx.currentTime);
  osc.stop(ctx.currentTime + duration / 1000);
}

/* -------- Side nav open/close -------- */
window.addEventListener("DOMContentLoaded", () => {
  const sideNav = document.getElementById("side-nav");
  const menuBtn = document.getElementById("menu-toggle");
  if (!sideNav || !menuBtn) return;

  // start closed (force)
  sideNav.classList.remove("open");

  // open from right + hide ☰
  menuBtn.addEventListener("click", () => {
    sideNav.classList.add("open");
    menuBtn.style.display = "none";
  });
});

function closeSideNav() {
  const sideNav = document.getElementById("side-nav");
  const menuBtn = document.getElementById("menu-toggle");
  if (sideNav) sideNav.classList.remove("open");
  if (menuBtn) menuBtn.style.display = "block";
}

/* -------- Help popup -------- */
function toggleHelpPopup() {
  const overlay = document.getElementById("help-overlay");
  if (!overlay) return;
  overlay.style.display = (overlay.style.display === "flex") ? "none" : "flex";
}

function dismissHelp(event) {
  if (event.target && event.target.id === "help-overlay") {
    toggleHelpPopup();
  }
}

/* -------- Intro box hide (double-tap) -------- */
function hideDescription() {
  const descBox = document.querySelector(".description-box");
  if (descBox) descBox.style.display = "none";
  hasSeenInstructions = true;
}

/* -------- Jump to controls by opening menu -------- */
function scrollToToggle() {
  document.getElementById("side-nav")?.classList.add("open");
  const menuBtn = document.getElementById("menu-toggle");
  if (menuBtn) menuBtn.style.display = "none";
}

/* -------- Confetti (requires canvas-confetti script) -------- */
function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) canvas.style.display = 'block';

  try {
    if (typeof confetti === "function") {
      confetti({ particleCount: 100, spread: 100, origin: { x: 0.1, y: 0.5 } });
      confetti({ particleCount: 100, spread: 100, origin: { x: 0.9, y: 0.5 } });
    } else if (canvas && canvas.confetti) {
      canvas.confetti({ particleCount: 100, spread: 100, origin: { x: 0.1, y: 0.5 } });
      canvas.confetti({ particleCount: 100, spread: 100, origin: { x: 0.9, y: 0.5 } });
    }
  } catch (err) {
    console.warn("Confetti error:", err);
  }
}
