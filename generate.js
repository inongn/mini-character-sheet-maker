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
    "Sleight of Hand": "Sleight of Hand",
    "Animal Handling": "Animals",
  };

  const statIcons = {
    STR: "fa-dumbbell",
    DEX: "fa-wind",
    CON: "fa-layer-group",
    INT: "fa-brain",
    WIS: "fa-eye",
    CHA: "fa-comment",
  };

  const statData = yaml.card.stats[stat];
  if (!statData) return "";

  const skillsHtml = allSkills[stat]
    .map(skill => {
      const isChecked = statData.proficiency.includes(skill) ? "checked" : "";
      const displayName = skillNameMap[skill] || skill;
      return `<label><input type="radio" ${isChecked}>${displayName}</label>`;
    })
    .join("");

  const iconClass = statIcons[stat] ? `<i class="fas ${statIcons[stat]}"></i> ` : "";

  return `
    <div class="grid-item" id="${stat}">
      <div class="subgrid">
        <div>
          <h2 class="ability">${iconClass}${stat}</h2>
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
    const icons = {
      "Features": "fa-user",
      "Actions": "fa-atom",
      "Bonus Actions": "fa-bolt",
      "Reactions": "fa-reply",
      "Enhancements": "fa-bullseye",
      "Weapons": "fa-fist-raised",
      "Spells": "fa-hand-sparkles",
      "HP": "fa-heart",
      "AC": "fa-shield-alt",
      "INIT": "fa-angles-right",
      "PROF": "fa-asterisk",
      "INSP": "fa-lightbulb",


    };
  
    const iconClass = icons[title] ? `<i class="fas ${icons[title]}"></i> ` : "";
  
    return `
      <div class="grid-row">
        <div class="grid-item" id="${title}">
          <h2>${iconClass}${title}</h2>
          ${content}
        </div>
      </div>
    `;
  }
  
  
  function generateList(items, labelFn) {
    return `<ul>${items.map(labelFn).join("")}</ul>`;
  }
  
  function generateHpAcInit(yaml) {
    const { hp, ac, initiative, proficiency_modifier } = yaml.card;
    return `
      <div class="triple-grid-row">
        ${generateSection("AC", `<p class="important-number">${ac.value}</p>`)}
        ${generateSection("INIT", `<p class="important-number">${initiative.modifier}</p>`)}
        ${generateSection(`PROF`, `<p class="important-number">${proficiency_modifier}</p>`)}
      </div>
      <div class="double-grid-row">
        <div class="grid-item" id="HP">
          <h2><i class="fas fa-heart"></i>HP (${hp.dice})</h2>
          <p class="important-number hp">/${hp.value}</p>
        </div>
                <div class="grid-item" id="INSP">
          <h2><i class="fas fa-lightbulb"></i>INSP</h2>
          <p class="important-number" style="margin-top:-6px;"><input type="radio"></p>
        </div>

      </div>

    `;
  }
  
  
  
  function generateFeatures(yaml, showFeatureSources) {
    const featuresByOrigin = yaml.card.features.reduce((acc, feature) => {
      acc[feature.origin] = acc[feature.origin] || [];
      acc[feature.origin].push(feature);
      return acc;
    }, {});
    if (!yaml.card.features || yaml.card.features.length === 0) return "";

    const sourcesDisplay = showFeatureSources ? "" : "none";
  
    const featuresHtml = Object.entries(featuresByOrigin)
      .map(([origin, features]) =>
        `<h3 class="feature-origin" style="display:${sourcesDisplay}">${origin}</h3>${generateList(features, f => {
          const resourceRadios = f.resources ? Array.from({length: f.resources}, (_, i) => 
            `<input type="radio" name="${f.name.replace(/\s+/g, '')}Resource" value="${i + 1}">`).join("") : "";
          return `<li><strong>${f.name}:</strong> ${f.description} ${resourceRadios}</li>`;
        })}`
      )
      .join("");
  
    return generateSection("Features", featuresHtml);
  }
  function generateActions(yaml) {
    if (!yaml.card.actions?.length) return "";
  
    const actionsByType = yaml.card.actions.reduce((acc, action) => {
      const type = action.type?.trim() || "";
      acc[type] = acc[type] || [];
      acc[type].push(action);
      return acc;
    }, {});
  
    const sortedTypes = Object.keys(actionsByType).sort((a, b) => {
      if (a === "Enhancements") return 1;
      if (b === "Enhancements") return -1;
      if (a === "") return -1;
      if (b === "") return 1;
      return a.localeCompare(b);
    });
  
    const actionsHtml = sortedTypes
      .map(type => {
        const typeActions = generateList(actionsByType[type], a => {
          const resourceRadios = a.resources ? Array.from({ length: a.resources }, (_, i) =>
            `<input type="radio" name="${a.name.replace(/\s+/g, '')}Resource" value="${i + 1}">`).join("") : "";
          return `<li><strong>${a.name}:</strong> ${a.description} ${resourceRadios}</li>`;
        });
  
        return type === ""
          ? typeActions
          : (() => {
            const icons = {
              "Bonus Actions": "fa-bolt",
              "Reactions": "fa-reply",
              "Enhancements": "fa-bullseye",
            };
            const iconClass = icons[type] ? `<i class="fas ${icons[type]}"></i> ` : "";
            return `<div id="${type.replace(/\s+/g, '-').toLowerCase()}"><h2>${iconClass}${type}</h2>${typeActions}</div>`;
          })();
        
      })
      .join("");
  
    return generateSection("Actions", actionsHtml);
  }
  
  
  
  
  
  function generateWeapons(yaml) {
    const weaponsHtml = generateList(yaml.card.weapons, w => `<li><strong>${w.name}:</strong> ${w.description}</li>`);
    return generateSection("Weapons", weaponsHtml);
  }
  
  function generateSpells(yaml) {
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
  
  function generateHtmlFromyaml(yaml, isTwoPages, showFeatureSources) {
    const { name, level, race, class: className, proficiency_modifier, size } = yaml.card;


    
    // Override isTwoPages if size is 2
    if (size === 2) {
      isTwoPages = true;
    }
  
    const leftColumn = `
      <div class="character-info">
        <h1>${name}</h1>
        <div class="info">Lv. ${level} ${race} ${className}</div>
      </div>
      <div class="proficiency">
        <small>Proficiency: ${proficiency_modifier}</small>
      </div>
            ${generateHpAcInit(yaml)}
      ${generateAbilities(yaml)}
    `;
  
    const rightColumnTop = `
    `;

    const rightColumnMiddle = `
    ${generateFeatures(yaml, showFeatureSources)}
    ${generateActions(yaml)}
    ${generateWeapons(yaml)}
  `;
  
    const spellSection = generateSpells(yaml, isTwoPages);
    const rightColumnBottom =`
    ${generateTraits(yaml)}
    `;
    if (isTwoPages) {
      return `
        <div class="card">
          <div class="left-column">${leftColumn}</div>
          <div class="right-column">${rightColumnTop}<div class="right-column-middle">${rightColumnMiddle}${rightColumnBottom}</div></div>
          
        </div>
        <div class="spell-card">
          <div class="wide-column">${spellSection}</div>
        </div>
      `;
    }
  
    return `
      <div class="card">
        <div class="left-column">${leftColumn}</div>
          <div class="right-column">${rightColumnTop}<div class="right-column-middle">${rightColumnMiddle}${spellSection}${rightColumnBottom}</div></div>
      </div>
    `;
  }
