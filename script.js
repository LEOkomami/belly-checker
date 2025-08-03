let isFed = false;

// Toggle hamburger menu
document.getElementById("menu-toggle").addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
});

// Set fed state and close menu
function setFed(fed) {
  isFed = fed;

  // Close the menu
  const menu = document.getElementById("menu");
  menu.classList.add("hidden");
}

// Start the "בדיקה" test
function startTest() {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");
  const message = document.getElementById("message");

  // Reset loader and message
  bar.style.width = "0%";
  message.style.opacity = "0";

  loader.style.display = "block";

  let width = 0;
  const interval = setInterval(() => {
    width += 1;
    bar.style.width = width + "%";

    if (width >= 100) {
      clearInterval(interval);
      loader.style.display = "none";
      showMessage();
    }
  }, 50); // 50ms * 100 = 5 seconds
}

// Show message result
function showMessage() {
  const message = document.getElementById("message");

  if (isFed) {
    message.textContent = "אכל(ה) מספיק, כל הכבוד!";
    message.style.backgroundColor = "#a8e6a1"; // green
    playSound("pleasant.mp3");
  } else {
    message.textContent = "לא אכל(ה) מספיק, עדיין יש מקום!";
    message.style.backgroundColor = "#f8a5a5"; // red
    playSound("unpleasant.mp3");
  }

  message.style.opacity = "1";

  // Auto-hide after 30 seconds
  setTimeout(() => {
    message.style.opacity = "0";
  }, 30000);
}

// Sound playback
function playSound(file) {
  const audio = new Audio(file);
  audio.play();
}

// Scroll to toggle section (if needed by arrow)
function scrollToToggle() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}
