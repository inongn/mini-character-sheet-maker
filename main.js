


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
  race: Gnome
  class: Arcane Trickster
  name: Polly
  level: 6
  proficiency_modifier: '+3'
  hp:
    value: 43
    dice: d8+2
  ac:
    value: 15
  initiative:
    modifier: '+4'
  stats:
    STR:
      modifier: '-1'
      proficiency: []
    DEX:
      modifier: '+4'
      proficiency:
        - Saving Throw
        - Acrobatics
        - Stealth
        - Saving Throw
        - Acrobatics
        - Stealth
    CON:
      modifier: '+2'
      proficiency: []
    INT:
      modifier: '+1'
      proficiency:
        - Saving Throw
        - Saving Throw
    WIS:
      modifier: '+0'
      proficiency:
        - Saving Throw
        - Saving Throw
    CHA:
      modifier: '+0'
      proficiency:
        - Saving Throw
        - Deception
        - Persuasion
        - Saving Throw
        - Deception
        - Persuasion
  features:
    - origin: Rogue
      name: Expertise
      description: Double proficiency on skills.
      resources: 0
    - origin: feat
      name: Skulker
      description: Advantage on stealth checks.
      resources: 0
    - origin: Gnome
      name: Darkvision
      description: See in darkness (60 ft).
      resources: 0
  weapons:
    - name: Hammer
      description: +7 to hit; 1d8+4 bludgeoning damage.
  spells:
    - level: Cantrip
      name: Minor Illusion
      description: Create a sound or an image.
    - level: Cantrip
      name: Mage Hand
      description: Create a spectral hand.
    - level: Cantrip
      name: Fire Bolt
      description: +4 to hit; 2d10 fire damage (120 ft).
    - level: '1'
      name: Disguise Self
      description: Alter your appearance for 1 hour.
    - level: '1'
      name: Charm Person
      description: Force a DC 1 WIS save to charm.
    - level: '1'
      name: Mirror Image
      description: >-
        Create 3 illusory duplicates. When attacked, roll a d6 per remaining
        duplicate. On a 3 or higher, the attack destroys a duplicate.
    - level: '1'
      name: Speak With Animals
      description: 10 minutes.
  spell_slots:
    - level: 1
      slots: 3
    - level: 2
      slots: 3
  traits: []
  actions:
    - type: ''
      name: Attack
      description: Make a weapon attack.
      resources: 0
    - type: Bonus Actions
      name: Cunning Action
      description: Dash, Disengage, or Hide.
      resources: 0
    - type: Bonus Actions
      name: Steady Aim
      description: If you do not move for your turn, gain advantage on your attack.
      resources: 0
    - type: Reactions
      name: Uncanny Dodge
      description: Halve the damage of an attack.
      resources: 0
    - type: ''
      name: Magic
      description: Cast a spell.
      resources: 0
    - type: Enhancements
      name: Sneak Attack
      description: >-
        Once per turn, extra 3d6 damage if you have advantage or an ally is
        close.
      resources: 0




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

