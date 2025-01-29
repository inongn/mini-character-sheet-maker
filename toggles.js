  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("featureOriginToggle");
  
    toggle.addEventListener("change", function () {
      const featureOrigins = document.querySelectorAll(".feature-origin");
      featureOrigins.forEach((element) => {
        if (this.checked) {
          element.style.display = "none"; // Hide elements
        } else {
          element.style.display = ""; // Reset to default CSS
        }
      });
    });
  });