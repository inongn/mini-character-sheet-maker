  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("featureOriginToggle");
  
    toggle.addEventListener("change", function () {
      
      const featureOrigins = document.querySelectorAll(".feature-origin");
      featureOrigins.forEach((element) => {
        if (this.checked) {
          element.style.display = ""; // Hide elements
        } else {
          element.style.display = "none"; // Reset to default CSS

        }
      });
      adjustTextSize();
    });
  });

window.addEventListener("load", function () {
  setTimeout(adjustTextSize, 0);
});

function adjustTextSize() {
  const container = document.querySelector('.right-column-middle');
  if (!container) return;

  let fontSize = 16;
  container.style.fontSize = fontSize + 'px';

  while (container.scrollHeight > 615 && fontSize > 5) { // Ensure a minimum font size (e.g., 5px)
      fontSize -= 0.1; // Decrease font size in smaller increments
      container.style.fontSize = fontSize + 'px';
  }
}
