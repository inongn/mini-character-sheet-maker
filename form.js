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

  // Expand the first section by default
  const firstContent = headers[0].nextElementSibling;
  firstContent.style.maxHeight = firstContent.scrollHeight + "px";
  firstContent.style.overflow = "visible";

  headers.forEach(header => {
      header.addEventListener("click", function () {
          const content = this.nextElementSibling;
          const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

          document.querySelectorAll(".form-section-content").forEach(sec => {
              sec.style.maxHeight = null;
              sec.style.overflow = "hidden";
          });

          if (!isOpen) {
              content.style.maxHeight = content.scrollHeight + "px";
              content.style.overflow = "visible";
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
});
