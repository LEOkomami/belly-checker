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
  document.getElementById("side-nav").classList.add("hidden");
}

function startTest() {
  const msg = document.getElementById("message");
  msg.style.display = "none";
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  loader.style.display = "block";
  loaderBar.style.width = "0";

  setTimeout(() => {
    loaderBar.style.width = "100%";
  }, 100);

  setTimeout(() => {
    loader.style.display = "none";
    msg.style.display = "block";
    if (childFed) {
      msg.innerText = "אכל(ה) מספיק!";
      msg.style.backgroundColor = "#2ecc71";
      playBeep(880, 300);
    } else {
      msg.innerText = "לא אכל(ה) מספיק, עדיין יש מקום!";
      msg.style.backgroundColor = "#e74c3c";
      playBeep(400, 300);
    }
    setTimeout(() => {
      msg.style.display = "none";
    }, 30000);
  }, 5100);
}

document.getElementById("menu-toggle").addEventListener("click", () => {
  const sideNav = document.getElementById("side-nav");
  sideNav.classList.toggle("hidden");
});

function hideDescription() {
  const descBox = document.querySelector(".description-box");
  descBox.style.display = "none";
}

function scrollToToggle() {
  document.getElementById("side-nav").scrollIntoView({ behavior: 'smooth' });
}
