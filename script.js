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

  // Reset UI
  msg.style.display = "none";
  tip.innerText = "";
  loader.style.display = "block";
  loaderBar.style.width = "0";
  confettiCanvas.style.display = "none";

  // Show a random tip
  showRandomTip();

  // Animate loading bar
  setTimeout(() => {
    loaderBar.style.width = "100%";
  }, 100);

  // Show result after 5 seconds
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
      confettiCanvas.style.display = "none";
    }, 30000);
  }, 5100);
}

function showRandomTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const tipBox = document.getElementById("tip");
  tipBox.innerText = randomTip;
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
  if (descBox) {
    descBox.style.display = "none";
  }
  hasSeenInstructions = true;
}

function scrollToToggle() {
  document.getElementById("side-nav").classList.add("open");
}

function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.style.display = 'block';

  if (typeof confetti === "function") {
    // If canvas-confetti is loaded as global function
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
  } else if (canvas.confetti) {
    // If canvas-confetti is bound to canvas
    canvas.confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.1, y: 0.5 },
    });
    canvas.confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.9, y: 0.5 },
    });
  } else {
    console.warn("Confetti library not found");
  }
}

// Make sure nav is closed on load
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("side-nav").classList.remove("open");

  const menuButton = document.getElementById("menu-toggle");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      document.getElementById("side-nav").classList.toggle("open");
    });
  }
});
