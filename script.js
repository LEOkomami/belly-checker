let childFed = false;
let scanning = false;
let hideMsgTimer = null;
let audioCtx = null;

const FULL_MESSAGES = [
  "אכל(ה) מספיק!",
  "הבטן מלאה לגמרי! כל הכבוד!",
  "וואו, איזו ארוחה! הבטן שמחה!",
  "הסורק מאשר: בטן שבעה ומאושרת!",
];

const HUNGRY_MESSAGES = [
  "לא אכל(ה) מספיק, עדיין יש מקום!",
  "הסורק מצא מקום פנוי בבטן!",
  "עוד כמה ביסים והבטן תהיה מלאה!",
  "יש עוד מקום! הבטן מחכה לאוכל!",
];

const DESSERT_MESSAGES = [
  "נמצא מקום לקינוח! תמיד יש! 🍰",
  "תא הקינוחים ריק לגמרי! 🍦",
  "הסורק מאשר: מקום מיוחד לקינוח! 🧁",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// One shared AudioContext: browsers cap concurrent contexts, and iOS requires
// creating/resuming it inside a user gesture for sound to play.
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep(frequency, duration) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(1, context.currentTime);
  oscillator.start();
  oscillator.stop(context.currentTime + duration / 1000);
}

function startScanSound(durationMs) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const secs = durationMs / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    // Gentle sci-fi hum: low sine with a slow frequency wobble, quiet on purpose
    lfo.frequency.value = 2.5;
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.type = 'sine';
    osc.frequency.value = 240;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.4);
    gain.gain.setValueAtTime(0.05, now + secs - 0.4);
    gain.gain.linearRampToValueAtTime(0.0001, now + secs);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + secs);
    lfo.stop(now + secs);
  } catch (e) {
    // Sound is a bonus; never break the scan because of it.
  }
}

function launchConfetti() {
  const colors = ['#FFD93D', '#6EB5FF', '#4ADE80', '#FF8AAE', '#A78BFA'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = pick(colors);
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

function setFed(fed) {
  childFed = fed;
  document.getElementById("side-nav").classList.remove("open");

  // Visual feedback for parent (subtle)
  const appTitle = document.querySelector(".app-title");
  appTitle.style.opacity = "0.5";
  setTimeout(() => appTitle.style.opacity = "1", 300);
}

// Ninja Controls
document.getElementById("ninja-full").addEventListener("click", () => setFed(true));
document.getElementById("ninja-room").addEventListener("click", () => setFed(false));

// Third covert control: hold the app title for 2 seconds to toggle the outcome.
// Feedback code: 1 blink = ate enough, 2 blinks = still room.
(function setupTitleLongPress() {
  const title = document.querySelector(".app-title");
  let pressTimer = null;

  const start = () => {
    pressTimer = setTimeout(() => {
      pressTimer = null;
      childFed = !childFed;
      const blinks = childFed ? 1 : 2;
      let done = 0;
      const blink = () => {
        title.style.opacity = "0.4";
        setTimeout(() => {
          title.style.opacity = "1";
          done++;
          if (done < blinks) setTimeout(blink, 150);
        }, 150);
      };
      blink();
      if (navigator.vibrate) navigator.vibrate(30);
    }, 2000);
  };
  const cancel = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  title.addEventListener("pointerdown", start);
  title.addEventListener("pointerup", cancel);
  title.addEventListener("pointerleave", cancel);
})();

function runScan(durationMs, computeResult) {
  if (scanning) return;
  scanning = true;

  const mainBtn = document.querySelector(".button");
  const dessertBtn = document.getElementById("dessert-btn");
  mainBtn.disabled = true;
  dessertBtn.disabled = true;

  // Unlock audio while we are still inside the tap gesture
  getAudioContext();

  const msg = document.getElementById("message");
  if (hideMsgTimer) {
    clearTimeout(hideMsgTimer);
    hideMsgTimer = null;
  }
  msg.style.display = "none";

  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  loader.style.display = "block";
  loaderBar.style.transition = "none";
  loaderBar.style.width = "0";

  // Show laser + hum
  const laser = document.getElementById("laser-line");
  laser.classList.add("scanning");
  startScanSound(durationMs);

  // Haptic feedback (if supported)
  if (navigator.vibrate) {
    const vibrateInterval = setInterval(() => {
      if (!laser.classList.contains("scanning")) {
        clearInterval(vibrateInterval);
        return;
      }
      navigator.vibrate(50);
    }, 500);
  }

  setTimeout(() => {
    loaderBar.style.transition = `width ${(durationMs - 100) / 1000}s linear`;
    loaderBar.style.width = "100%";
  }, 100);

  setTimeout(() => {
    loader.style.display = "none";
    laser.classList.remove("scanning");

    const result = computeResult();
    msg.innerText = result.text;
    msg.style.backgroundColor = result.color;
    msg.style.display = "block";

    if (result.happy) {
      playBeep(880, 200);
      setTimeout(() => playBeep(1100, 300), 200);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      launchConfetti();
    } else {
      playBeep(400, 500);
      if (navigator.vibrate) navigator.vibrate(400);
    }

    dessertBtn.style.display = result.showDessert ? "inline-block" : "none";

    scanning = false;
    mainBtn.disabled = false;
    dessertBtn.disabled = false;

    hideMsgTimer = setTimeout(() => {
      msg.style.display = "none";
    }, 20000);
  }, durationMs + 100);
}

function startTest() {
  if (scanning) return;
  document.getElementById("dessert-btn").style.display = "none";
  runScan(5000, () => childFed
    ? { text: pick(FULL_MESSAGES), color: "#2ecc71", happy: true, showDessert: true }
    : { text: pick(HUNGRY_MESSAGES), color: "#e74c3c", happy: false, showDessert: false });
}

// The classic law of the dessert stomach: this scan always finds room.
function dessertTest() {
  if (scanning) return;
  document.getElementById("dessert-btn").style.display = "none";
  runScan(2500, () => ({
    text: pick(DESSERT_MESSAGES),
    color: "#A78BFA",
    happy: true,
    showDessert: false,
  }));
}

document.getElementById("menu-toggle").addEventListener("click", (e) => {
  const sideNav = document.getElementById("side-nav");
  sideNav.classList.toggle("open");
  e.stopPropagation();
});

// Click outside to close
document.getElementById("side-nav").addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.remove("open");
  }
});

function hideDescription() {
  const descBox = document.querySelector(".description-box");
  descBox.style.display = "none";
}
