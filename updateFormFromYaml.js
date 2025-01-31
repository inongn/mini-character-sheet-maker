function updateFormFromYaml() {
  const yaml = jsyaml.load(document.getElementById("yamlTextarea").value);
  const card = yaml.card || {};

  populateBasicFields(card);
  populateCombatStats(card);
  populateStats(card);
  populateSkillsAndSaves(card);
  populateDynamicElements(card);
  populateSpellSlots(card);
  addDeleteButtonListeners();
}

function populateBasicFields(card) {
  const form = document.getElementById("yamlForm");
  form.race.value = card.race || "";
  form.class.value = card.class || "";
  form.name.value = card.name || "";
  form.level.value = card.level || "";
  form.proficiencyModifier.value = card.proficiency_modifier || "";
}

function populateCombatStats(card) {
  const form = document.getElementById("yamlForm");
  form.hpValue.value = card.hp?.value || "";
  form.hpDice.value = card.hp?.dice || "";
  form.acValue.value = card.ac?.value || "";
  form.initiativeModifier.value = card.initiative?.modifier || "";
}

function populateStats(card) {
  const form = document.getElementById("yamlForm");
  ["STR", "DEX", "CON", "INT", "WIS", "CHA"].forEach(stat => {
    form[`${stat.toLowerCase()}Modifier`].value = card.stats?.[stat]?.modifier || "";
  });
}

function populateSkillsAndSaves(card) {
  document.querySelectorAll("#skillsContainer input").forEach(checkbox => {
    const stat = checkbox.dataset.stat;
    const skill = checkbox.dataset.skill;
    checkbox.checked = (card.stats?.[stat]?.proficiency || []).includes(skill);
  });
}

function populateDynamicElements(card) {
  populateContainer("featuresContainer", card.features, "feature");
  populateContainer("weaponsContainer", card.weapons, "weapon");
  populateContainer("spellsContainer", card.spells, "spell");
  populateContainer("traitsContainer", card.traits, "trait");
}

function populateContainer(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  (items || []).forEach((item, i) => {
    container.appendChild(createInputElement(type, i, item));
  });
}

function populateSpellSlots(card) {
  if (!card.spell_slots) return;

  card.spell_slots.forEach(slot => {
    const level = slot.level;
    const slotInput = document.getElementById(`spell-slots-lv-${level}`);
    if (slotInput) {
      slotInput.value = slot.slots || "";
    }
  });
}

function addDeleteButtonListeners() {
  document.querySelectorAll(".delete-row-icon").forEach((i) => {
    i.addEventListener("click", (event) => {
      const parent = event.target.parentElement;
      parent.remove();
      updateYamlFromForm(); // Sync YAML after deletion
    });
  });
}

function createInputElement(type, index, data = {}) {
  const div = document.createElement("div");
  div.classList.add("form-group", "feature-group");

  let inputs = "";
  let placeholders = {
    feature: [
      { key: "origin", placeholder: "Feature Origin" },
      { key: "name", placeholder: "Feature Name" },
      { key: "description", placeholder: "Feature Description" },
    ],
    weapon: [
      { key: "name", placeholder: "Weapon Name" },
      { key: "description", placeholder: "Weapon Description" },
    ],
    spell: [
      { key: "level", placeholder: "Spell Level" },
      { key: "name", placeholder: "Spell Name" },
      { key: "description", placeholder: "Spell Description" },
    ],
    trait: [
      { key: "name", placeholder: "Trait Name" },
      { key: "description", placeholder: "Trait Description" },
    ],
  };

  if (!placeholders[type]) {
    console.error(`Invalid type: ${type}`);
    return div;
  }

  inputs = placeholders[type]
    .map(
      (field) =>
        `<input type="text" placeholder="${field.placeholder}" data-${type}-${field.key}="${index}" value="${data[field.key] || ""}">`
    )
    .join("");

  div.innerHTML = `
    <i class="fas fa-x delete-row-icon"></i>
    ${inputs}
  `;

  return div;
}