let childFed = false;

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

function startTest() {
  const msg = document.getElementById("message");
  msg.style.display = "none";
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  loader.style.display = "block";
  loaderBar.style.width = "0";

  // Show laser
  const laser = document.getElementById("laser-line");
  laser.classList.add("scanning");

  // Haptic feedback (if supported)
  if (navigator.vibrate) {
    // Rhythmic vibration
    const vibrateInterval = setInterval(() => {
      if (!laser.classList.contains("scanning")) {
        clearInterval(vibrateInterval);
        return;
      }
      navigator.vibrate(50);
    }, 500);
  }

  setTimeout(() => {
    loaderBar.style.transition = 'width 5s linear';
    loaderBar.style.width = "100%";
  }, 100);

  setTimeout(() => {
    loader.style.display = "none";
    document.getElementById("laser-line").classList.remove("scanning");
    msg.style.display = "block";

    if (childFed) {
      msg.innerText = "אכל(ה) מספיק!";
      msg.style.backgroundColor = "#2ecc71";
      playBeep(880, 200);
      setTimeout(() => playBeep(1100, 300), 200);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else {
      msg.innerText = "לא אכל(ה) מספיק, עדיין יש מקום!";
      msg.style.backgroundColor = "#e74c3c";
      playBeep(400, 500);
      if (navigator.vibrate) navigator.vibrate(400);
    }
    setTimeout(() => {
      msg.style.display = "none";
    }, 20000);
  }, 5100);
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

function scrollToToggle() {
  document.getElementById("side-nav").scrollIntoView({ behavior: 'smooth' });
}
