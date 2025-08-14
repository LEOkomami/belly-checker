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
  closeSideNav();
}

function startTest() {
  const msg = document.getElementById("message");
  const tip = document.getElementById("tip");
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  const confettiCanvas = document.getElementById("confetti-canvas");

  msg.style.display = "none";
  loader.style.display = "block";
  loaderBar.style.width = "0";
  tip.innerText = "";

  // Show random tip
  showRandomTip();

  setTimeout(() => {
    loaderBar.style.width = "100%";
  }, 100);

  setTimeout(() => {
    loader.style.display = "none";
    const success = childFed;
    msg.style.display = "block";

    if (success) {
      msg.innerText = "אכל(ה) מספיק!";
      msg.style.backgroundColor = "#2ecc71";
      playBeep(880, 300);
      triggerConfetti();
    } else {
      msg.innerText = "לא אכל(ה) מספיק, עדיין יש מקום!";
      msg.style.backgroundColor = "#e74c3c";
      playBeep(400, 300);
    }

    // Clear result after 30s
    setTimeout(() => {
      msg.style.display = "none";
      confettiCanvas.style.display = "none";
    }, 30000);
  }, 5100);
}

function showRandomTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById("tip").innerText = randomTip;
}

function playBeep(frequency, duration) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.start();
  gainNode.gain.setValueAtTime(1, context.currentTime);
  oscillator.stop(context.currentTime + duration / 1000);
}

function closeSideNav() {
  document.getElementById("side-nav").classList.remove("open");
}

function toggleHelpPopup() {
  const overlay = document.getElementById("help-overlay");
  overlay.style.display = overlay.style.display === "flex" ? "none" : "flex";
}

function dismissHelp(event) {
  if (event.target.id === "help-overlay") {
    toggleHelpPopup();
  }
}

function hideDescription() {
  const descBox = document.querySelector(".description-box");
  descBox.style.display = "none";
  hasSeenInstructions = true;
}

function scrollToToggle() {
  document.getElementById("side-nav").classList.add("open");
}

function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.style.display = 'block';
  const confetti = canvas.confetti || window.confetti;
  if (!confetti) return;

  confetti({
    particleCount: 60,
    spread: 100,
    origin: { x: 0.1, y: 0.5 },
  });

  confetti({
    particleCount: 60,
    spread: 100,
    origin: { x: 0.9, y: 0.5 },
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("side-nav").classList.toggle("open");
  });
  document.getElementById("side-nav").classList.remove("open");
});
