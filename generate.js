function buildSingleStat(yaml, stat) {
    const allSkills = {
      STR: ["Athletics", "Saving Throw"],
      DEX: ["Acrobatics", "Sleight of Hand", "Stealth", "Saving Throw"],
      CON: ["Saving Throw"],
      INT: ["Arcana", "History", "Investigation", "Nature", "Religion", "Saving Throw"],
      WIS: ["Perception", "Insight", "Medicine", "Animal Handling", "Survival", "Saving Throw"],
      CHA: ["Intimidation", "Deception", "Performance", "Persuasion", "Saving Throw"],
    };
    
    const skillNameMap = {
      "Sleight of Hand": "Hand",
      "Animal Handling": "Animals",
    };
  
    const statData = yaml.card.stats[stat];
    if (!statData) return "";
  
    const skillsHtml = allSkills[stat]
      .map(skill => {
        const isChecked = statData.proficiency.includes(skill) ? "checked" : "";
        const displayName = skillNameMap[skill] || skill;
        return `<label><input type="radio" ${isChecked}> ${displayName}</label>`;
      })
      .join("");
  
    return `
      <div class="grid-item" id="${stat}">
        <div class="subgrid">
          <div>
            <h2>${stat}</h2>
            <div class="important-number">${statData.modifier}</div>
          </div>
          <div class="radio-list">${skillsHtml}</div>
        </div>
      </div>
    `;
  }
  
  function generateAbilities(yaml) {
    const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    return stats.map(stat => buildSingleStat(yaml, stat)).join("");
  }
  
  function generateSection(title, content) {
    return `
      <div class="grid-row">
        <div class="grid-item" id="${title}">
          <h2>${title}</h2>
          ${content}
        </div>
      </div>
    `;
  }
  
  function generateList(items, labelFn) {
    return `<ul>${items.map(labelFn).join("")}</ul>`;
  }
  
  function generateHpAcInit(yaml) {
    const { hp, ac, initiative } = yaml.card;
    return `
      <div class="triple-grid-row">
        ${generateSection(`HP(${hp.dice})`, `<p class="important-number">${hp.value}</p>`)}
        ${generateSection("AC", `<p class="important-number">${ac.value}</p>`)}
        ${generateSection("INIT", `<p class="important-number">${initiative.modifier}</p>`)}
      </div>
    `;
  }
  
  function generateFeatures(yaml) {
    const featuresByOrigin = yaml.card.features.reduce((acc, feature) => {
      acc[feature.origin] = acc[feature.origin] || [];
      acc[feature.origin].push(feature);
      return acc;
    }, {});
  
    const featuresHtml = Object.entries(featuresByOrigin)
      .map(
        ([origin, features]) =>
          `<h3>${origin}</h3>${generateList(features, f => `<li><strong>${f.name}:</strong> ${f.description}</li>`)}`
      )
      .join("");
  
    return generateSection("Features", featuresHtml);
  }
  
  function generateWeapons(yaml) {
    const weaponsHtml = generateList(yaml.card.weapons, w => `<li><strong>${w.name}:</strong> ${w.description}</li>`);
    return generateSection("Weapons", weaponsHtml);
  }
  
  function generateSpells(yaml, isTwoPages) {
    const { spells, spell_slots } = yaml.card;
    if (!spells || spells.length === 0) return "";
  
    const slotMap = (spell_slots || []).reduce((acc, slot) => {
      acc[slot.level] = slot.slots;
      return acc;
    }, {});
  
    const spellsByLevel = spells.reduce((acc, spell) => {
      acc[spell.level] = acc[spell.level] || [];
      acc[spell.level].push(spell);
      return acc;
    }, {});
  
    const sortedLevels = Object.keys(spellsByLevel).sort((a, b) => (a === "Cantrip" ? -1 : b === "Cantrip" ? 1 : a - b));
  
    const spellsHtml = sortedLevels
      .map(level => {
        const numericLevel = parseInt(level);
        const radios =
          numericLevel && slotMap[numericLevel]
            ? Array.from({ length: slotMap[numericLevel] }, (_, i) => `<input type="radio" name="spellRadiosLv${numericLevel}" value="${i + 1}" />`).join("")
            : "";
  
        const levelSpells = generateList(spellsByLevel[level], spell => `<li><strong>${spell.name}:</strong> ${spell.description}</li>`);
        return `<h3>${level} ${radios}</h3>${levelSpells}`;
      })
      .join("");
  
    return generateSection("Spells", spellsHtml);
  }
  
  function generateTraits(yaml) {
    if (!yaml.card.traits?.length) return "";
    const traitsHtml = generateList(yaml.card.traits, t => `<li><strong>${t.name}:</strong> ${t.description}</li>`);
    return generateSection("Traits", traitsHtml);
  }
  
  function generateHtmlFromyaml(yaml, isTwoPages) {
    const { name, level, race, class: className, proficiency_modifier } = yaml.card;
    const leftColumn = `
      <div class="character-info">
        <h2>${name}</h2>
        <small>Lv. ${level} ${race} ${className}</small>
      </div>
      <div class="proficiency">
        <small>Proficiency: ${proficiency_modifier}</small>
      </div>
      ${generateAbilities(yaml)}
    `;
  
    const rightColumn = `
      ${generateHpAcInit(yaml)}
      ${generateFeatures(yaml)}
      ${generateWeapons(yaml)}
    `;
  
    const spellSection = generateSpells(yaml, isTwoPages);
    const traitsSection =`
    ${generateTraits(yaml)}
    `;
    if (isTwoPages) {
      return `
        <div class="card">
          <div class="left-column">${leftColumn}</div>
          <div class="right-column">${rightColumn}${traitsSection}</div>
          
        </div>
        <div class="spell-card">
          <div class="wide-column">${spellSection}</div>
        </div>
      `;
    }
  
    return `
      <div class="card">
        <div class="left-column">${leftColumn}</div>
        <div class="right-column">${rightColumn}${spellSection}${traitsSection}</div>
      </div>
    `;

  }
  