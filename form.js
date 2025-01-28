document.addEventListener("DOMContentLoaded", () => {
  const yamlTextarea = document.getElementById("yamlTextarea");
  const form = document.getElementById("yamlForm");
  const tabs = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const featuresContainer = document.getElementById("featuresContainer");
  const weaponsContainer = document.getElementById("weaponsContainer");
  const spellsContainer = document.getElementById("spellsContainer");
  const traitsContainer = document.getElementById("traitsContainer");

  // Parse YAML to Form
  function updateFormFromYaml() {
    const yaml = jsyaml.load(yamlTextarea.value);
    const card = yaml.card || {};
  
    // Populate basic fields
    form.race.value = card.race || "";
    form.class.value = card.class || "";
    form.name.value = card.name || "";
    form.level.value = card.level || "";
    form.proficiencyModifier.value = card.proficiency_modifier || "";
  
    // Populate HP, AC, Initiative
    form.hpValue.value = card.hp?.value || "";
    form.hpDice.value = card.hp?.dice || "";
    form.acValue.value = card.ac?.value || "";
    form.initiativeModifier.value = card.initiative?.modifier || "";
  
    // Populate Stats
    form.strModifier.value = card.stats?.STR?.modifier || "";
    form.dexModifier.value = card.stats?.DEX?.modifier || "";
    form.conModifier.value = card.stats?.CON?.modifier || "";
    form.intModifier.value = card.stats?.INT?.modifier || "";
    form.wisModifier.value = card.stats?.WIS?.modifier || "";
    form.chaModifier.value = card.stats?.CHA?.modifier || "";
  
// Populate Skills and Saving Throws
const allSkills = document.querySelectorAll("#skillsContainer input");
allSkills.forEach((checkbox) => {
  const stat = checkbox.dataset.stat;
  const skill = checkbox.dataset.skill;
  const proficiencies = card.stats?.[stat]?.proficiency || [];
  checkbox.checked = proficiencies.includes(skill);
});



    // Populate Features
    featuresContainer.innerHTML = "";
    (card.features || []).forEach((feature, i) => {
      featuresContainer.appendChild(createFeatureInput(i, feature));
    });
  
    // Populate Weapons
    weaponsContainer.innerHTML = "";
    (card.weapons || []).forEach((weapon, i) => {
      weaponsContainer.appendChild(createWeaponInput(i, weapon));
    });
  
    // Populate Spells
    spellsContainer.innerHTML = "";
    (card.spells || []).forEach((spell, i) => {
      spellsContainer.appendChild(createSpellInput(i, spell));
    });
  
    // Populate Traits
    traitsContainer.innerHTML = "";
    (card.traits || []).forEach((trait, i) => {
      traitsContainer.appendChild(createTraitInput(i, trait));
    });

    addDeleteButtonListeners(); // Add delete functionality after rendering

  }
  

  // Update YAML from Form
  function updateYamlFromForm() {
    const yaml = jsyaml.load(yamlTextarea.value) || {};
    yaml.card = yaml.card || {};
  
    // Update basic fields
    yaml.card.race = form.race.value;
    yaml.card.class = form.class.value;
    yaml.card.name = form.name.value;
    yaml.card.level = parseInt(form.level.value, 10) || 1;
    yaml.card.proficiency_modifier = form.proficiencyModifier.value;
  
    // Update HP, AC, Initiative
    yaml.card.hp = yaml.card.hp || {};
    yaml.card.hp.value = parseInt(form.hpValue.value, 10) || 0;
    yaml.card.hp.dice = form.hpDice.value;
    yaml.card.ac = { value: parseInt(form.acValue.value, 10) || 0 };
    yaml.card.initiative = { modifier: form.initiativeModifier.value };
  
// Update Stats
yaml.card.stats = yaml.card.stats || {};
const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
stats.forEach((stat) => {
  yaml.card.stats[stat] = yaml.card.stats[stat] || {};
  yaml.card.stats[stat].modifier = form[`${stat.toLowerCase()}Modifier`].value;
  yaml.card.stats[stat].proficiency = Array.from(
    document.querySelectorAll(`[data-stat="${stat}"]:checked`)
  ).map((checkbox) => checkbox.dataset.skill);
});


  // Reindex dynamic elements
  yaml.card.features = reindexFeatures();
  yaml.card.weapons = reindexWeapons();
  yaml.card.spells = reindexSpells();
  yaml.card.traits = reindexTraits();

  
    // Update Features
    yaml.card.features = [];
    Array.from(featuresContainer.children).forEach((featureDiv, i) => {
      yaml.card.features.push({
        origin: featureDiv.querySelector(`[data-feature-origin="${i}"]`).value,
        name: featureDiv.querySelector(`[data-feature-name="${i}"]`).value,
        description: featureDiv.querySelector(`[data-feature-description="${i}"]`).value,
      });
    });
  
    // Update Weapons
    yaml.card.weapons = [];
    Array.from(weaponsContainer.children).forEach((weaponDiv, i) => {
      yaml.card.weapons.push({
        name: weaponDiv.querySelector(`[data-weapon-name="${i}"]`).value,
        description: weaponDiv.querySelector(`[data-weapon-description="${i}"]`).value,
      });
    });
  
    // Update Spells
    yaml.card.spells = [];
    Array.from(spellsContainer.children).forEach((spellDiv, i) => {
      yaml.card.spells.push({
        level: spellDiv.querySelector(`[data-spell-level="${i}"]`).value,
        name: spellDiv.querySelector(`[data-spell-name="${i}"]`).value,
        description: spellDiv.querySelector(`[data-spell-description="${i}"]`).value,
      });
    });
  
    // Update Traits
    yaml.card.traits = [];
    Array.from(traitsContainer.children).forEach((traitDiv, i) => {
      yaml.card.traits.push({
        name: traitDiv.querySelector(`[data-trait-name="${i}"]`).value,
        description: traitDiv.querySelector(`[data-trait-description="${i}"]`).value,
      });
    });
  
    yamlTextarea.value = jsyaml.dump(yaml);
    updateHtmlSandbox(); // Update the sandbox view
  }

// Utility functions for dynamic elements with delete buttons
function createFeatureInput(index, feature = {}) {
  const div = document.createElement("div");
  div.classList.add("form-group", "feature-group");
  div.innerHTML = `
    <button type="button" class="delete-row-button" data-feature-index="${index}">-</button>
    <input type="text" placeholder="Feature Origin" data-feature-origin="${index}" value="${feature.origin || ""}">
    <input type="text" placeholder="Feature Name" data-feature-name="${index}" value="${feature.name || ""}">
    <input type="text" placeholder="Feature Description" data-feature-description="${index}" value="${feature.description || ""}">
  `;
  return div;
}

function createWeaponInput(index, weapon = {}) {
  const div = document.createElement("div");
  div.classList.add("form-group", "feature-group");
  div.innerHTML = `
    <button type="button" class="delete-row-button" data-weapon-index="${index}">-</button>
    <input type="text" placeholder="Weapon Name" data-weapon-name="${index}" value="${weapon.name || ""}">
    <input type="text" placeholder="Weapon Description" data-weapon-description="${index}" value="${weapon.description || ""}">
  `;
  return div;
}

function createSpellInput(index, spell = {}) {
  const div = document.createElement("div");
  div.classList.add("form-group", "feature-group");
  div.innerHTML = `
    <button type="button" class="delete-row-button" data-spell-index="${index}">-</button>
    <input type="text" placeholder="Spell Level" data-spell-level="${index}" value="${spell.level || ""}">
    <input type="text" placeholder="Spell Name" data-spell-name="${index}" value="${spell.name || ""}">
    <input type="text" placeholder="Spell Description" data-spell-description="${index}" value="${spell.description || ""}">
  `;
  return div;
}

function createTraitInput(index, trait = {}) {
  const div = document.createElement("div");
  div.classList.add("form-group", "feature-group");
  div.innerHTML = `
    <button type="button" class="delete-row-button" data-trait-index="${index}">-</button>
    <input type="text" placeholder="Trait Name" data-trait-name="${index}" value="${trait.name || ""}">
    <input type="text" placeholder="Trait Description" data-trait-description="${index}" value="${trait.description || ""}">
  `;
  return div;
}

// Add Event Listener for Delete Buttons
function addDeleteButtonListeners() {
  document.querySelectorAll(".delete-row-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const parent = event.target.parentElement;
      parent.remove();
      updateYamlFromForm(); // Sync YAML after deletion
    });
  });
}


  // Event Listeners
  yamlTextarea.addEventListener("input", updateFormFromYaml);
  form.addEventListener("input", updateYamlFromForm);

  // Tab Switching Logic
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      tabContents.forEach((content) => {
        content.style.display = content.id === targetTab ? "block" : "none";
      });
    });
  });

  // Initialize with YAML values
  updateFormFromYaml();

  document.querySelector(".tab-button[data-tab='formTab']").click();

    // Add Dynamic Elements
    document.getElementById("addFeatureButton").addEventListener("click", () => {
      const index = featuresContainer.children.length;
      featuresContainer.appendChild(createFeatureInput(index));
      addDeleteButtonListeners();

    });
  
    document.getElementById("addWeaponButton").addEventListener("click", () => {
      const index = weaponsContainer.children.length;
      weaponsContainer.appendChild(createWeaponInput(index));
      addDeleteButtonListeners();

    });
  
    document.getElementById("addSpellButton").addEventListener("click", () => {
      const index = spellsContainer.children.length;
      spellsContainer.appendChild(createSpellInput(index));
      addDeleteButtonListeners();

    });
  
    document.getElementById("addTraitButton").addEventListener("click", () => {
      const index = traitsContainer.children.length;
      traitsContainer.appendChild(createTraitInput(index));
      addDeleteButtonListeners();

    });
  // Utility functions for reindexing dynamic elements
function reindexFeatures() {
  const featureInputs = document.querySelectorAll("#featuresContainer .form-group");
  const features = [];
  featureInputs.forEach((group, index) => {
    const origin = group.querySelector(`[data-feature-origin]`);
    const name = group.querySelector(`[data-feature-name]`);
    const description = group.querySelector(`[data-feature-description]`);

    origin.setAttribute("data-feature-origin", index);
    name.setAttribute("data-feature-name", index);
    description.setAttribute("data-feature-description", index);

    features.push({
      origin: origin.value,
      name: name.value,
      description: description.value,
    });
  });
  return features;
}

function reindexWeapons() {
  const weaponInputs = document.querySelectorAll("#weaponsContainer .form-group");
  const weapons = [];
  weaponInputs.forEach((group, index) => {
    const name = group.querySelector(`[data-weapon-name]`);
    const description = group.querySelector(`[data-weapon-description]`);

    name.setAttribute("data-weapon-name", index);
    description.setAttribute("data-weapon-description", index);

    weapons.push({
      name: name.value,
      description: description.value,
    });
  });
  return weapons;
}

function reindexSpells() {
  const spellInputs = document.querySelectorAll("#spellsContainer .form-group");
  const spells = [];
  spellInputs.forEach((group, index) => {
    const level = group.querySelector(`[data-spell-level]`);
    const name = group.querySelector(`[data-spell-name]`);
    const description = group.querySelector(`[data-spell-description]`);

    level.setAttribute("data-spell-level", index);
    name.setAttribute("data-spell-name", index);
    description.setAttribute("data-spell-description", index);

    spells.push({
      level: level.value,
      name: name.value,
      description: description.value,
    });
  });
  return spells;
}

function reindexTraits() {
  const traitInputs = document.querySelectorAll("#traitsContainer .form-group");
  const traits = [];
  traitInputs.forEach((group, index) => {
    const name = group.querySelector(`[data-trait-name]`);
    const description = group.querySelector(`[data-trait-description]`);

    name.setAttribute("data-trait-name", index);
    description.setAttribute("data-trait-description", index);

    traits.push({
      name: name.value,
      description: description.value,
    });
  });
  return traits;
}
});

