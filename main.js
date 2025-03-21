


    // Add a listener to dynamically add new textareas
    document.getElementById('addyamlButton').addEventListener('click', function() {
      const container = document.getElementById('yamlContainer');
      const newTextarea = document.createElement('textarea');
      newTextarea.classList.add('yamlInput');
      container.appendChild(newTextarea);
      addInputListener(newTextarea); // Attach input listener for real-time updates
    });
  
    // Function to generate HTML from yaml and update the sandbox
    function updateHtmlSandbox() {
      const textareas = document.querySelectorAll('.yamlInput');
      const isTwoPages = false;
      const showFeatureSources = document.getElementById('featureOriginToggle').checked;
      let combinedHTML = '';
  
      textareas.forEach((textarea) => {
        const yamlInput = textarea.value.trim();
        if (!yamlInput) return;
        let yamlObject;
        try {
          yamlObject = jsyaml.load(yamlInput);
        } catch (e) {
          document.getElementById('htmlSandbox').innerHTML = `<div class="error">Invalid yaml format detected.</div>`;
          return;
        }
        const htmlOutput = generateHtmlFromyaml(yamlObject, isTwoPages, showFeatureSources);
        combinedHTML += htmlOutput;
      });
  
      document.getElementById('htmlSandbox').innerHTML = combinedHTML;
      adjustTextSize();

    }
  
    // Attach input listeners to all current textareas
    function attachInputListeners() {
      const textareas = document.querySelectorAll('.yamlInput');
      textareas.forEach((textarea) => {
        addInputListener(textarea);
      });
    }
  
    // Add an input event listener to a textarea
    function addInputListener(textarea) {
      textarea.addEventListener('input', updateHtmlSandbox);
    }
    // Initial setup: attach listeners to existing elements
    attachInputListeners();    
  
    
    document.addEventListener("DOMContentLoaded", () => {
      // Default YAML content
      const defaultYaml = `
    card:
      race: Human
      class: Rogue
      name: Veylin Shadowlace
      level: 5
      proficiency_modifier: "+3"
      hp:
        value: 33
        dice: "5d8+1"
      ac:
        value: 15
        armor: Studded Leather Armor
      initiative:
        modifier: "+3"
      stats:
        STR:
          modifier: "-1"
          proficiency: []
        DEX:
          modifier: "+3"
          proficiency:
            - Saving Throw
            - Acrobatics
            - Sleight of Hand
            - Stealth
        CON:
          modifier: "+1"
          proficiency: []
        INT:
          modifier: "+2"
          proficiency:
            - Saving Throw
            - Investigation
        WIS:
          modifier: "+0"
          proficiency:
            - Perception
        CHA:
          modifier: "+1"
          proficiency:
            - Deception
      features:
        - name: Sneak Attack
          origin: Rogue
          description: Extra 3d6 damage with attacks if you have advantage or an ally is within 5 feet of the target.
        - name: Cunning Action
          origin: Rogue
          description: Dash, Disengage, or Hide as a bonus action.
        - name: Uncanny Dodge
          origin: Rogue
          description: Halve the damage of an attack you can see as a reaction.
        - name: Spellcasting
          origin: Arcane Trickster
          description: Save DC 13, Attack +5
        - name: Mage Hand Legerdemain
          origin: Arcane Trickster
          description: Use Mage Hand invisibly to perform fine control tasks (e.g., pickpocketing, disarming traps).
      weapons:
        - name: Rapier (Finesse)
          description: "+7 to hit; 1d8+3 piercing damage"
        - name: Shortbow
          description: "+7 to hit; 1d6+3 piercing damage (80/320 ft.)"
      spells:
        - level: Cantrip
          name: Chill Touch
          description: Deal necrotic damage (1d10) at melee range.
        - level: Cantrip
          name: Mage Hand
          description: Create a spectral hand to manipulate objects at a distance.
        - level: Cantrip
          name: Minor Illusion
          description: Create a sound or an image to deceive others.
        - level: "1"
          name: Disguise Self
          description: Alter your appearance for 1 hour.
        - level: "1"
          name: Feather Fall
          description: Slow the fall of up to five creatures.
      spell_slots:
        - level: 1
          slots: 3
      traits:
        - name: Backstory
          description: I was raised into the monster hunter life. I tried to get out, but it got to me again.
        - name: Bond
          description: My dad is missing, and we need to find him.
        - name: Proficiencies
          description: Disguise Kit, Lute
        - name: Languages
          description: Common, Undercommon
    `;
    
      // Set default YAML content
      const yamlTextarea = document.getElementById("yamlTextarea");
      yamlTextarea.value = defaultYaml.trim();
      updateHtmlSandbox();
    });
    
    const tabs = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    
    // Tab Switching Logic
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.getAttribute("data-tab");
    
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove("active"));
    
        // Add active class to the clicked tab
        tab.classList.add("active");
        // Show the correct tab content
        tabContents.forEach((content) => {
          content.style.display = content.id === targetTab ? "block" : "none";
        });
        closeHeaders();

      });
    });
    
    // Set default active tab
    const defaultTab = document.querySelector(".tab-button[data-tab='formTab']");
    if (defaultTab) {
      defaultTab.classList.add("active");
      defaultTab.click();
    }

