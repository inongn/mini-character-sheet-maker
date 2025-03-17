document.addEventListener("DOMContentLoaded", () => {
  initializeYamlForm();
});

function initializeYamlForm() {

  // Initialize with YAML values
  updateFormFromYaml();
  addEventListeners();
}

function addEventListeners() {
  document.getElementById("yamlTextarea").addEventListener("input", updateFormFromYaml);
  document.getElementById("yamlForm").addEventListener("input", updateYamlFromForm);

  document.getElementById("addFeatureButton").addEventListener("click", () => {
    const index = featuresContainer.children.length;
    featuresContainer.appendChild(createInputElement("feature", index));
    addDeleteButtonListeners();
  });

  document.getElementById("addWeaponButton").addEventListener("click", () => {
    const index = weaponsContainer.children.length;
    weaponsContainer.appendChild(createInputElement("weapon", index));
    addDeleteButtonListeners();
  });

  document.getElementById("addSpellButton").addEventListener("click", () => {
    const index = spellsContainer.children.length;
    spellsContainer.appendChild(createInputElement("spell", index));
    addDeleteButtonListeners();
  });

  document.getElementById("addTraitButton").addEventListener("click", () => {
    const index = traitsContainer.children.length;
    traitsContainer.appendChild(createInputElement("trait", index));
    addDeleteButtonListeners();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".form-section-header");

  closeHeaders();

  headers.forEach(header => {
      header.addEventListener("click", function () {
          const content = this.nextElementSibling;
          const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

          document.querySelectorAll(".form-section-content").forEach(sec => {
              sec.style.maxHeight = "0";
              sec.style.overflow = "hidden";
              sec.style.padding = "0 10px";
              sec.style.margin = "0 10px";
              sec.style.opacity = "0"; // Fade out content
              sec.previousElementSibling.classList.remove("expanded"); // Remove arrow rotation
          });

          if (!isOpen) {
              content.style.maxHeight = content.scrollHeight + "px";
              content.style.overflow = "visible";

              setTimeout(() => {
                  content.style.padding = "10px";
                  content.style.margin = "10px";
                  content.style.opacity = "1"; // Fade in content smoothly after padding/margin changes
              }, 50);

              this.classList.add("expanded"); // Rotate arrow
          }
      });
  });

  // Observe content changes and adjust height dynamically
  const observer = new MutationObserver(() => {
      document.querySelectorAll(".form-section-content").forEach(content => {
          if (content.style.maxHeight && content.style.maxHeight !== "0px") {
              content.style.maxHeight = content.scrollHeight + "px";
          }
      });
  });

  document.querySelectorAll(".form-section-content").forEach(content => {
      observer.observe(content, { childList: true, subtree: true, characterData: true });
  });

  // Automatically click the first section header to expand it
  if (headers.length > 0) {
      setTimeout(() => {
          headers[0].click();
      }, 100);
  }
});

function closeHeaders(){
  document.querySelectorAll(".form-section-content").forEach(content => {
    content.style.padding = "0";
    content.style.margin = "0";
    content.style.opacity = "0"; // Initially hide content for smooth transition
    content.style.transition = "max-height 0.3s ease-out, opacity 0.3s ease-out, padding 0.3s ease-out, margin 0.3s ease-out";
    content.style.maxHeight = "0"; // Ensure content is collapsed by default
});
}