function updateYamlFromForm() {
  const yaml = jsyaml.load(document.getElementById("yamlTextarea").value) || {};
  yaml.card = yaml.card || {};

  updateBasicFields(yaml.card);
  updateCombatStats(yaml.card);
  updateStats(yaml.card);
  updateDynamicElements(yaml.card);
  updateSpellSlots(yaml.card);


  document.getElementById("yamlTextarea").value = jsyaml.dump(yaml);
  updateHtmlSandbox();
}

function updateBasicFields(card) {
  const form = document.getElementById("yamlForm");
  card.race = form.race.value;
  card.class = form.class.value;
  card.name = form.name.value;
  card.level = parseInt(form.level.value, 10) || 1;
  card.proficiency_modifier = form.proficiencyModifier.value;
}

function updateCombatStats(card) {
  const form = document.getElementById("yamlForm");
  card.hp = { value: parseInt(form.hpValue.value, 10) || 0, dice: form.hpDice.value };
  card.ac = { value: parseInt(form.acValue.value, 10) || 0 };
  card.initiative = { modifier: form.initiativeModifier.value };
}

function updateStats(card) {
  const form = document.getElementById("yamlForm");
  card.stats = card.stats || {};
  ["STR", "DEX", "CON", "INT", "WIS", "CHA"].forEach(stat => {
    card.stats[stat] = card.stats[stat] || {};
    card.stats[stat].modifier = form[`${stat.toLowerCase()}Modifier`].value;
    card.stats[stat].proficiency = Array.from(
      document.querySelectorAll(`[data-stat="${stat}"]:checked`)
    ).map(checkbox => checkbox.dataset.skill);
  });
}


function updateDynamicElements(card) {
  card.features = reindexElements("feature", "featuresContainer");
  card.actions = reindexElements("action", "actionsContainer"); // Add this line
  card.weapons = reindexElements("weapon", "weaponsContainer");
  card.spells = reindexElements("spell", "spellsContainer");
  card.traits = reindexElements("trait", "traitsContainer");
}

function updateSpellSlots(card) {
  const spellSlots = [];

  for (let i = 1; i <= 9; i++) {
    const slotInput = document.getElementById(`spell-slots-lv-${i}`);
    const val = parseInt(slotInput?.value, 10);
    if (slotInput && slotInput.value !== "" && val > 0) {
      spellSlots.push({ level: i, slots: val });
    }
  }

  if (spellSlots.length > 0) {
    card.spell_slots = spellSlots;
  } else {
    delete card.spell_slots; // avoid polluting the YAML
  }
}

function reindexElements(type, containerId) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll(".form-group");
  const elements = [];

  inputs.forEach((group, index) => {
    const placeholders = {
      feature: ["origin", "name", "description", "resources"],
      action: ["type", "name", "description", "resources"], // Add resources here
      weapon: ["name", "description"],
      spell: ["level", "name", "description"],
      trait: ["name", "description"],
    };

    if (!placeholders[type]) {
      console.error(`Invalid type: ${type}`);
      return;
    }

    let elementData = {};
    placeholders[type].forEach((field) => {
      const input = group.querySelector(`[data-${type}-${field}]`);
      if (input) {
        input.setAttribute(`data-${type}-${field}`, index);
        elementData[field] = field === "resources" ? parseInt(input.value, 10) || 0 : input.value;
      }
    });

    elements.push(elementData);
  });

  return elements;
}
