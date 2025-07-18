




"use strict";

(function () {
    const logError = (message) => {
        const errorLog = document.getElementById("errorLog");
        if (errorLog) {
            errorLog.style.display = "block";
            const errorMessage = document.createElement("div");
            errorMessage.textContent = message;
            errorLog.appendChild(errorMessage);
            errorLog.scrollTop = errorLog.scrollHeight;
        }
    };

    window.addEventListener("error", (event) => {
        console.error(event.message, event.error);
        logError(`Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    });

    window.addEventListener("unhandledrejection", (event) => {
        console.error("Unhandled Promise Rejection:", event.reason);
        logError(`Unhandled Promise Rejection: ${event.reason}`);
    });
})();



// -------------------------------
// DOM Content Loaded 
// -------------------------------

document.addEventListener("DOMContentLoaded", function () {

  // -------------------------------
  // License Popup
  // -------------------------------

  global.showLicensePopup();


  
  // --------------
  // Testing
  // --------------

  let tested = false;
  let testAllDisciplines = false;
 
  if (tested === false) { global.tests.testAllImages(global.util.wrapImgPath, testAllDisciplines); tested = true; }

  // Currently not working properly
  global.tests.testAllFonts(global.data.availableFonts);



  // -------------------------------
  // Dynamic Font Control Panel Generation & Setup
  // -------------------------------


  
  // Populates font selectors that have been dynamically added to the DOM.
  function populateFontSelectors() {
    const fontSelectors = document.querySelectorAll('.font-family-select'); // Get all font selectors by class
    const availableFonts = global.data.availableFonts; // Already sorted if needed

    fontSelectors.forEach(selector => {
        if (selector.options.length > 0) return; // Already populated

        availableFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.name; // Use the actual font name for CSS
            option.textContent = font.displayName; // User-friendly display name
            selector.appendChild(option);
        });
    });
  }

  // Generalized function to link hex input and color picker
  function linkHexAndColorInputs(hexInputId, colorInputId) {
    const hexInput = document.getElementById(hexInputId);
    const colorInput = document.getElementById(colorInputId);

    if (!hexInput || !colorInput) {
        return;
    }
    hexInput.addEventListener('input', () => {
        let hexVal = hexInput.value.toUpperCase();
        if (/^#[0-9A-F]{3}$/.test(hexVal)) { // Expand 3-digit hex
            hexVal = `#${hexVal[1]}${hexVal[1]}${hexVal[2]}${hexVal[2]}${hexVal[3]}${hexVal[3]}`;
            hexInput.value = hexVal;
        }
        if (/^#[0-9A-F]{6}$/.test(hexVal)) {
            colorInput.value = hexVal;
        }
    });
    colorInput.addEventListener('input', () => {
        hexInput.value = colorInput.value.toUpperCase();
    });
  };

   // Dynamically generate text field control panels
  const textFieldControlsContainer = document.getElementById('left-panel'); // Ensure this div exists in index.html
  if (textFieldControlsContainer && global.data.textFieldConfigs && Array.isArray(global.data.textFieldConfigs)) {
      global.data.textFieldConfigs.forEach(panelConfig => { // panelConfig is { id_prefix: "..." }
          const id_prefix = panelConfig.id_prefix;
          // Find the corresponding defaults for this panel
          const headerDefaults      = global.data.textFieldHeaderDefaults.find(d => d.id_prefix === id_prefix) || {};
          const fontDefaults        = global.data.textFieldFontDefaults.find(d => d.id_prefix === id_prefix) || {};
          const backgroundDefaults  = global.data.textFieldBgDefaults.find(d => d.id_prefix === id_prefix) || {};

          // Combine the defaults into the structure expected by global.ui.createFont
          const combinedDefaults = { header: headerDefaults, font: fontDefaults, background: backgroundDefaults };

          // Call the primary function from 08_font_controls.js to create the panel
          const panelElement = global.ui.createFont(panelConfig, combinedDefaults); 
          if (panelElement) {
              // Add the newly created panel to the DOM
              textFieldControlsContainer.appendChild(panelElement);
          } else {
              console.error(`Failed to create panel for config: ${id_prefix}`);
          }
      });

      // After all panels are in the DOM, populate their font select dropdowns
      populateFontSelectors(); 

      // Then, set the default selected font for each panel and link color pickers
      global.data.textFieldConfigs.forEach(panelConfig => {
          const id_prefix = panelConfig.id_prefix;
          const fontDefaults = global.data.textFieldFontDefaults.find(d => d.id_prefix === id_prefix) || {};
          const fontSelect = document.getElementById(`${id_prefix}_font_select`);
          if (fontSelect && fontDefaults.family) {
              fontSelect.value = fontDefaults.family;
          }
          linkHexAndColorInputs(`${id_prefix}_text_color_hex`, `${id_prefix}_text_color_picker`);
          linkHexAndColorInputs(`${id_prefix}_bg_color_hex`, `${id_prefix}_bg_color_picker`);
      });
  } else {
      console.error("Could not find 'left-panel' or 'global.data.textFieldConfigs' is not set up correctly.");
  }




  // -------------------------------
  // Generate dark pack logo ui (Found in 04_darkpack_license.js)
  // -------------------------------
  
  const darkPackDiv = global.darkPack()
  document.getElementById("darkPackSection").appendChild(darkPackDiv);
  
  

  // ------------------------------------
  // Generate HTML User Interace elements
  // ------------------------------------

  // Generate pool cost, blood cost, capacity, and life symbols
  const costSymbolSection     = document.getElementById("symbolHeader");
  const costSymbolGrid        = document.getElementById("symbolGrid");

  /**
   * Creates a label and an input element for a single symbol setting.
   * @param {string} id_prefix - The prefix for the element IDs (e.g., "pool").
   * @param {object} setting_config - The configuration object for this specific setting.
   * @returns {[HTMLLabelElement, HTMLInputElement]} An array containing the created label and input elements.
   */
  function createSymbolSettings (id_prefix, setting_config) {
    const full_id = `${id_prefix}${setting_config.id_suffix}`;
    let inputElement; // Will hold the created input/select/file element

    // Arguments for global.ui.new_lbl
    const labelId         = null; // Labels often don't need an ID themselves
    const labelClasses    = ["symbol-setting-label"];
    const labelDefaults   = {
      forId:       full_id,
      textContent: setting_config.label
    };
    const label = global.ui.new_lbl(labelId, labelClasses, labelDefaults);

    // Common classes for all input types in this context
    const commonInputClasses = ["symbol-setting-input"];

    if (setting_config.type === "number" || setting_config.type === "checkbox") {
      const inputDefaults   = { type: setting_config.type };
      let currentClasses    = [...commonInputClasses]; // Clone for potential modification

      if (setting_config.type === "number") {
        inputDefaults.value   = setting_config.defaultValue;
        if (setting_config.min !== undefined) inputDefaults.min = setting_config.min;
        if (setting_config.max !== undefined) inputDefaults.max = setting_config.max;
      } else { // checkbox
        inputDefaults.checked = setting_config.defaultValue;
        currentClasses.push("symbol-checkbox");
      }
      inputElement = global.ui.new_txt(full_id, currentClasses, inputDefaults);
    } else if (setting_config.type === "select") {
      const selectId          = full_id;
      const selectClasses     = commonInputClasses;
      const selectDefaults    = { name: selectId }; // e.g., name attribute
      inputElement = global.ui.new_sel(selectId, selectClasses, selectDefaults);

      // Create and append options
      (setting_config.options || []).forEach(optionConfig => {
        const optionId          = null;
        const optionClasses     = [];
        const optionDefaults    = optionConfig; // { value: "...", text: "..." }
        const optionElement     = global.ui.new_opt(optionId, optionClasses, optionDefaults);
        inputElement.appendChild(optionElement);
      });

      if (setting_config.defaultValue !== undefined) {
        inputElement.value = setting_config.defaultValue;
      }
    } else if (setting_config.type === "file") {
      const inputDefaults   = {
        type: "file",
        accept: "image/*" // Suggest image files
      };
      inputElement = global.ui.new_txt(full_id, commonInputClasses, inputDefaults);
    } else {
      console.warn(`Unknown setting type: ${setting_config.type} for ${full_id}`);
      inputElement = document.createElement("span"); // Fallback
      inputElement.textContent = `[Unsupported type: ${setting_config.type}]`;
    }
    return [label, inputElement];
  }

  /**
   * Creates a div containing all settings for a particular symbol type (e.g., Pool, Blood).
   * @param {object} symbol_config - The configuration object for the symbol type from global.data.symbolIconConfigs.
   * @returns {HTMLDivElement} The created div element containing the settings UI.
   */
  function createSettingsDiv (symbol_config) {
    // Arguments for settingsGroupDiv
    const settingsGroupId       = `${symbol_config.id_prefix}_settings_group`;
    const settingsGroupClasses  = ["symbol-inline"];
    const settingsGroupDefaults = {}; // No specific defaults needed here beyond id and class
    const settingsGroupDiv      = global.ui.new_inl(settingsGroupId, settingsGroupClasses, settingsGroupDefaults);

    // Arguments for titleDiv
    const titleId         = null;
    const titleClasses    = ["symbol-group-title"];
    const titleDefaults   = { textContent: `${symbol_config.displayName}:` };
    const titleDiv        = global.ui.new_inl(titleId, titleClasses, titleDefaults);
    settingsGroupDiv.appendChild(titleDiv);

    // Create a new container that will hold all the setting rows
    const allRowsContainerId        = `${symbol_config.id_prefix}_all_rows_wrapper`;
    const allRowsContainerClasses   = ["symbol-all-rows-container"]; // New class for this wrapper
    const allRowsContainerDefaults  = {};
    const allRowsContainer          = global.ui.new_inl(allRowsContainerId, allRowsContainerClasses, allRowsContainerDefaults);
    settingsGroupDiv.appendChild(allRowsContainer); // This wrapper is the second direct child    

    // Group settings by uiRow
    const settingsByRow = {};
    symbol_config.settings.forEach(setting_item => {
        const rowNum = setting_item.uiRow || 1; // Default to row 1 if not specified
        if (!settingsByRow[rowNum]) {
            settingsByRow[rowNum] = [];
        }
        settingsByRow[rowNum].push(setting_item);
    });

    // Create and append elements for each row
    Object.keys(settingsByRow).sort((a, b) => a - b).forEach(rowNum => {
        // Arguments for rowDiv
      const rowId         = null;
      const rowClasses    = ["symbol-settings-row", "inline-selector"]; // Added "inline-selector"
      const rowDefaults   = {};
      const rowDiv        = global.ui.new_inl(rowId, rowClasses, rowDefaults);



        settingsByRow[rowNum].forEach(setting_item => {
            const [label, input] = createSymbolSettings(symbol_config.id_prefix, setting_item);
            // Arguments for settingContainer
        const containerId           = null;
        const containerClasses      = ["symbol-setting-item-container"];
        const containerDefaults     = {};
            const settingContainer = global.ui.new_inl(containerId, containerClasses, containerDefaults);
            settingContainer.appendChild(label);
            settingContainer.appendChild(input);
            rowDiv.appendChild(settingContainer);
        });

        allRowsContainer.appendChild(rowDiv); // Append each settings row to the new allRowsContainer
    });
    
    return settingsGroupDiv;
  }

  // Generate and append settings UI for each symbol type defined in symbolIconConfigs
  if (global.data.symbolIconConfigs && Array.isArray(global.data.symbolIconConfigs)) {
      global.data.symbolIconConfigs.forEach(config => {
          const settingsElement = createSettingsDiv(config);
          if (settingsElement) {
              costSymbolGrid.appendChild(settingsElement);
          } else {
              console.error(`Failed to create settings group for ${config.displayName}`);
              logError(`Failed to create symbol settings UI for ${config.displayName}.`);
          }
      });
  } else {
      console.error("global.data.symbolIconConfigs is not defined or not an array.");
      logError("Error: Symbol icon configurations (global.data.symbolIconConfigs) are missing or invalid.");
  }


  
  // -------------------------------
  //  Generate card type settings
  // -------------------------------

  // Generate Card Type Icon Controls
  const typeHeader          = document.getElementById("typeHeader");
  const typeGrid            = document.getElementById("typeGrid"); 

  // Create the generic settings panel
  const genericSettingsDiv = document.createElement("div");
  genericSettingsDiv.className = "inline-selector";

  // Add global settings for X, Y, Size, Spacing, and Orientation
  const typeSettings = [
    { id: "typeX",        label: "X:",        defaultValue: 15, min: 0,   max: 358  },
    { id: "typeY",        label: "Y:",        defaultValue: 70, min: 0,   max: 500  },
    { id: "typeSize",     label: "Size:",     defaultValue: 36, min: 4,   max: 100  },
    { id: "typeSpacing",  label: "Gap:",      defaultValue: 13, min: 0,   max: 20   }
  ];

  typeSettings.forEach(setting => {
    const label = document.createElement("label");
    label.htmlFor = setting.id;
    label.innerText = setting.label;

    const input = document.createElement("input");
    input.type = "number";
    input.id = setting.id;
    input.value = setting.defaultValue;
    if (setting.min !== undefined) input.min = setting.min;
    if (setting.max !== undefined) input.max = setting.max;

    genericSettingsDiv.appendChild(label);
    genericSettingsDiv.appendChild(input);
  });

  // Add orientation toggle
  const orientationLabel      = document.createElement("label");
  const orientationCheckbox   = document.createElement("input");

  orientationLabel.htmlFor    = "typeOrientation";
  orientationLabel.innerText  = "Orient.V/H:";
  
  orientationCheckbox.type    = "checkbox";
  orientationCheckbox.id      = "typeOrientation";
  orientationCheckbox.checked = false; // Default to vertical

  // Add event listener to toggle between vertical and horizontal
  orientationCheckbox.addEventListener("change", updateCard);


  genericSettingsDiv.appendChild(orientationLabel);
  genericSettingsDiv.appendChild(orientationCheckbox);

  // Append the generic settings panel to the typeHeader
  typeHeader.appendChild(genericSettingsDiv);

  // Generate controls for each card type
  global.data.typeMap.forEach(type => {
    const itemDiv       = document.createElement("div");
    itemDiv.className   = "card-type-item";

    // Create label
    const label         = document.createElement("label");
    label.htmlFor       = type.id;
    label.innerText     = type.label;
    label.className     = "card-type-label";
 
    // Create checkbox for toggling the icon
    const checkbox      = document.createElement("input");
    checkbox.type       = "checkbox";
    checkbox.id         = `${type.id}Toggle`;
    checkbox.checked    = false; // Default to unchecked

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);   
    typeGrid.appendChild(itemDiv);
  });



  // -----------------------------------------
  // Generate disciplines header with settings
  // -----------------------------------------

  function generateDisciplineSettings() {
    // Generate the settings header for the disciplines section
    const disciplinesHeader           = document.getElementById("disciplineHeader"); // Target the existing div

    // Create the settings panel
    const disciplinesSettingsDiv      = document.createElement("div");
    const disciplinesSettingsDiv2     = document.createElement("div");
    const disciplineToggle            = document.createElement("input");  
    const disciplineToggleLabel       = document.createElement("label"); 
    const disciplineToggleContainer   = document.createElement("div");

    disciplineToggle.type             = "checkbox";
    disciplineToggle.id               = "disciplineToggle";
    disciplineToggle.checked          = false; 
    disciplineToggleLabel.htmlFor     = "disciplineToggle";
    disciplineToggleLabel.innerText   = "Below settings are used when this is toggled";   

    disciplineToggleContainer.appendChild(disciplineToggle);
    disciplineToggleContainer.appendChild(disciplineToggleLabel);

    disciplineToggleContainer.className = "inline-selector";
    disciplinesSettingsDiv.className  = "inline-selector discipline-inline-selector";
    disciplinesSettingsDiv2.className = "inline-selector discipline-inline-selector";


    // Add global settings for X, Y, Size, Spacing, and Orientation
    const disciplineSettings = [
        { id: "disciplineX",                    label: "X:",        defaultValue: 18,   min: 0,   max: 358 },
        { id: "disciplineY",                    label: "Y:",        defaultValue: 400,  min: 0,   max: 500 },
        { id: "disciplineSize",                 label: "Size:",     defaultValue: 30,   min: 10,  max: 100 },
        { id: "disciplineDiff",                 label: "Diff:",     defaultValue: 8,    min: 0,   max: 20  },
        { id: "disciplineSpacing",              label: "Gap:",      defaultValue: 0,    min: 0,   max: 20  },
        { id: "disciplineSuperiorOffset",       label: "Adjust:",   defaultValue: 0,    min: -10, max: 20  }        
    ];
    const disciplineSettings2 = [
        { id: "disciplineToggleX",              label: "X:",        defaultValue: 18,   min: 0,   max: 358 },
        { id: "disciplineToggleY",              label: "Y:",        defaultValue: 240,  min: 0,   max: 500 },
        { id: "disciplineToggleSize",           label: "Size:",     defaultValue: 34,   min: 10,  max: 100 },
        { id: "disciplineToggleDiff",           label: "Diff:",     defaultValue: 8,    min: 0,   max: 20  },
        { id: "disciplineToggleSpacing",        label: "Gap:",      defaultValue: 2,    min: 0,   max: 20  },
        { id: "disciplineToggleSuperiorOffset", label: "Adjust:",   defaultValue: 0,    min: -10, max: 20  }                
    ];    

    function createDiscSettings (setting, div) {
        const label                = document.createElement("label");
        label.htmlFor              = setting.id;
        label.innerText            = setting.label;

        const input                = document.createElement("input");
        input.type                 = "number";
        input.id                   = setting.id;
        input.value                = setting.defaultValue;
        if (setting.min !== undefined) input.min = setting.min;
        if (setting.max !== undefined) input.max = setting.max;

        div.appendChild(label);
        div.appendChild(input);
    };

    disciplineSettings.forEach(setting => createDiscSettings(setting, disciplinesSettingsDiv));
    disciplineSettings2.forEach(setting => createDiscSettings(setting, disciplinesSettingsDiv2));
    

    // Add orientation toggle
    const disciplineOrientationLabel        = document.createElement("label"); // Renamed to avoid conflict
    const disciplineOrientationCheckbox     = document.createElement("input");
    const disciplineOrientationLabel2       = document.createElement("label"); // Renamed to avoid conflict
    const disciplineOrientationCheckbox2    = document.createElement("input");    

    disciplineOrientationLabel.htmlFor      = "disciplineOrientation";
    disciplineOrientationLabel.innerText    = "V/H:";
    disciplineOrientationLabel2.htmlFor     = "disciplineOrientation";
    disciplineOrientationLabel2.innerText   = "V/H:";    

    disciplineOrientationCheckbox.type      = "checkbox";
    disciplineOrientationCheckbox.id        = "disciplineOrientation";
    disciplineOrientationCheckbox.checked   = false; // Default to vertical
    disciplineOrientationCheckbox2.type     = "checkbox";
    disciplineOrientationCheckbox2.id       = "disciplineToggleOrientation";
    disciplineOrientationCheckbox2.checked  = false; // Default to vertical    

    // Add event listener to toggle between vertical and horizontal
    disciplineOrientationCheckbox.addEventListener("change", updateCard);
    disciplineOrientationCheckbox2.addEventListener("change", updateCard);    

    disciplinesSettingsDiv.appendChild(disciplineOrientationLabel);
    disciplinesSettingsDiv.appendChild(disciplineOrientationCheckbox);

    disciplinesSettingsDiv2.appendChild(disciplineOrientationLabel2);
    disciplinesSettingsDiv2.appendChild(disciplineOrientationCheckbox2);    

    // Append the settings panel to the disciplines header
    disciplinesHeader.appendChild(disciplinesSettingsDiv);
    disciplinesHeader.appendChild(disciplineToggleContainer);
    disciplinesHeader.appendChild(disciplinesSettingsDiv2);
        
  }

  generateDisciplineSettings(); // Call the function to generate the settings panel



  // -------------------------------
  // Generate discipline toggles (unchecked by default).
  // -------------------------------

  // Generate discipline toggles to the grid below the header
  const disciplinesGrid = document.getElementById("disciplinesGrid");
  global.data.disciplineData.forEach(item => {
    const div = document.createElement("div");
    div.className = "discipline-item";

    // Discipline Label
    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerText = item.label;

    // Single Clickable Slider for Tiers (0, 1, 2, 3)
    const sliderDiv = document.createElement("div");
    sliderDiv.className = "discipline-slider tier-0"; // Default to tier 0
    sliderDiv.dataset.currentTier = 0; // Track the current tier
    sliderDiv.id = item.id; // Set the id to match the disciplineData entry

    // Create the color blocks for the slider
    for (let i = 0; i <= 3; i++) {
      const tierBlock = document.createElement("div");
      tierBlock.className = `tier-block tier-${i}`;
      sliderDiv.appendChild(tierBlock);
    }

    // Add click event to toggle between tiers
    sliderDiv.addEventListener("click", function () {
      let currentTier = parseInt(sliderDiv.dataset.currentTier, 10);
      currentTier = (currentTier + 1) % 4; // Cycle through 0, 1, 2, 3
      sliderDiv.dataset.currentTier = currentTier;

      // Update the visual state
      sliderDiv.className = `discipline-slider tier-${currentTier}`;
    });

    // Toggle for Additional Innate Feature
    const featureToggleDiv      = document.createElement("div");
    featureToggleDiv.className  = "discipline-toggle";
    const featureLabel          = document.createElement("label");
    featureLabel.htmlFor        = `${item.id}Innate`;
    featureLabel.innerText      = "I:";
    const featureCheckbox       = document.createElement("input");
    featureCheckbox.type        = "checkbox";
    featureCheckbox.id          = `${item.id}Innate`;
    featureToggleDiv.appendChild(featureLabel);
    featureToggleDiv.appendChild(featureCheckbox);

    // Append all elements to the discipline item container
    div.appendChild(label);
    div.appendChild(sliderDiv);
    div.appendChild(featureToggleDiv);

    // Add the discipline item to the grid
    disciplinesGrid.appendChild(div);
  });



  // -------------------------------
  // Generate clan data HTML UI Settings header
  // -------------------------------

  function generateClanSettings() {
      // Generate the settings header for the clans section
      const clansHeader         = document.getElementById("clanHeader"); // Target the existing div

      // Create the settings panels
      const clansSettingsDiv1   = document.createElement("div");
      clansSettingsDiv1.className   = "inline-selector";


      // Add global settings for X, Y, Size, Spacing, and Orientation
      const clanSettings1 = [
          { id: "clanX",            label: "X:",      defaultValue: 12, min: 0,   max: 358 },
          { id: "clanY",            label: "Y:",      defaultValue: 48, min: 0,   max: 500 },
          { id: "clanSize",         label: "Size:",   defaultValue: 38, min: 10,  max: 100 },
          { id: "clanSpacing",      label: "Gap:",    defaultValue: 2,  min: 0,   max: 20  },
          { id: "clanOffset",       label: "Offset:", defaultValue: 60, min: 0,   max: 400 },
      ];


      function createClanSettings(setting, div) {
          const label       = document.createElement("label");
          label.htmlFor     = setting.id;
          label.innerText   = setting.label;

          const input       = document.createElement("input");
          input.type        = "number";
          input.id          = setting.id;
          input.value       = setting.defaultValue;
          if (setting.min !== undefined) input.min = setting.min;
          if (setting.max !== undefined) input.max = setting.max;

          div.appendChild(label);
          div.appendChild(input);
      }

      clanSettings1.forEach(setting => createClanSettings(setting, clansSettingsDiv1));
    
      // Add orientation toggle
      const clanOrientationLabel1     = document.createElement("label");
      const clanOrientationCheckbox1  = document.createElement("input");

      clanOrientationLabel1.htmlFor   = "clanOrientation";
      clanOrientationLabel1.innerText = "V/H:";
 

      clanOrientationCheckbox1.type     = "checkbox";
      clanOrientationCheckbox1.id       = "clanOrientation";
      clanOrientationCheckbox1.checked  = false; // Default to vertical

      // Add event listener to toggle between vertical and horizontal
      clanOrientationCheckbox1.addEventListener("change", updateCard);

      clansSettingsDiv1.appendChild(clanOrientationLabel1);
      clansSettingsDiv1.appendChild(clanOrientationCheckbox1);

      // Append the settings panels to the clans header
      clansHeader.appendChild(clansSettingsDiv1);

  }

  // Call the function to generate the settings panel
  generateClanSettings();



  // -------------------------------
  // Generate clan data HTML UI
  // -------------------------------

    global.data.clanData.forEach(symbol => {
      // Set the image source
      symbol.image.src = global.util.wrapImgPath(symbol.imgSrc);
      symbol.image.onload = updateCard;

      // Create a container for the clan toggle
      const clanToggleDiv = document.createElement("div");
      clanToggleDiv.className = "clan-toggle";

      // Create the checkbox for the clan
      const clanCheckbox  = document.createElement("input");
      const clanCheckbox2 = document.createElement("input");
      clanCheckbox.type   = "checkbox";
      clanCheckbox2.type  = "checkbox";
      clanCheckbox.id     = symbol.id;
      clanCheckbox2.id    = symbol.id + "-display";

      // Create the label for the clan
      const clanLabel = document.createElement("label");
      clanLabel.htmlFor = symbol.id;
      clanLabel.innerText = symbol.label;

      // Append the checkbox and label to the toggle container
      clanToggleDiv.appendChild(clanCheckbox);
      clanToggleDiv.appendChild(clanCheckbox2);
      clanToggleDiv.appendChild(clanLabel);

      // Append the toggle container to the clansGrid div
      const clansGrid = document.getElementById("clansGrid");
      if (clansGrid) {
          clansGrid.appendChild(clanToggleDiv);
      }
  });
  
  // ------------------------------------
  // Pre-load Symbol Images
  // ------------------------------------

  function loadSymbolImages(symbolMap, imageCache, onAllProcessedCallback) {
      const imageKeys = Object.keys(symbolMap);
      const numImagesToProcess = imageKeys.length;
      let processedCount = 0;

      if (numImagesToProcess === 0) {
          // No symbols to process, call the callback immediately if it's a function
          if (typeof onAllProcessedCallback === 'function') {
              onAllProcessedCallback();
          }
          return;
      }

      function itemProcessed() {
          processedCount++;
          if (processedCount === numImagesToProcess) {
              if (typeof onAllProcessedCallback === 'function') {
                  onAllProcessedCallback();
              }
          }
      }

      imageKeys.forEach(key => {
          const imageShortPath = symbolMap[key];

          if (!imageShortPath) { // Check for undefined, null, or empty string paths
              console.warn(`Symbol key "${key}" has an empty or null path in symbolMap.`);
              global.util.showOnloadError(`Symbol image path not defined for: ${key}`);
              itemProcessed(); // Consider it processed to not hang the loading
              return; // Skip to the next key
          }

          const fullImagePath = global.util.wrapImgPath(imageShortPath);
          let img = imageCache[key];

          if (img && img.src === fullImagePath && img.complete) {
              // Image is already loaded and src matches, count as processed
              itemProcessed();
              return;
          }

          if (!img) {
              img = new Image();
              imageCache[key] = img;
          }

          // (Re-)assign handlers
          img.onload = () => {
              itemProcessed();
          };
          img.onerror = () => {
              console.error(`Failed to load symbol image: ${key} (Path: ${fullImagePath})`);
              global.util.showOnloadError(`Symbol image failed to load: ${key} (Path: ${fullImagePath})`);
              itemProcessed();
          };

          // Set or reset the src to trigger loading.
          // If src is the same and it previously failed, browser behavior for retrying varies.
          // This ensures that if the src is different or the image isn't complete, a load is attempted.
          if (img.src !== fullImagePath || !img.complete) {
              img.src = fullImagePath;
          } else {
            // This case (src is same and complete) should have been caught by the early return.
            // If somehow reached, consider it processed to be safe.
            itemProcessed();
          }
      });
  };

  // Call loadSymbolImages with updateCard as the callback
  loadSymbolImages(global.data.symbolMap, global.art.loadedSymbolImages, updateCard);
  


  // --------------------------------------------------
  // Helper Function to Determine Frame Image for Render
  // --------------------------------------------------

  // This function would be called within your main DOMContentLoaded listener
  function setupFrameUploadListener() {
      const frameFileInput = document.getElementById('frameFile');
      if (!frameFileInput) {
          console.error("Element with ID 'frameFile' not found for frame uploads.");
          return;
      }

      frameFileInput.addEventListener('change', function(event) {
          const file = event.target.files[0];
          if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              
              reader.onload = function(e) {
                  // global.art.uploadedFrame is an Image object, set its src and handlers
                  global.art.uploadedFrame.onload = function() {
                      console.log("Custom frame image loaded and stored in global.art.uploadedFrame.");
                  };
                  global.art.uploadedFrame.onerror = function() {
                      console.error("Error loading the uploaded frame file into an Image object.");
                      global.util.showError("Failed to load the uploaded frame. Ensure it's a valid image file.");
                      global.art.uploadedFrame.src = ""; // Clear src on error
                  };
                  global.art.uploadedFrame.src = e.target.result; // Set src to data URL to trigger load
              };
              
              reader.onerror = function() {
                  console.error("Error reading the uploaded frame file.");
                  global.util.showError("Error reading the selected file for the frame.");
                  global.art.uploadedFrame.src = ""; // Clear src on error
              };
              
              reader.readAsDataURL(file);
          } else if (file) {
              global.util.showError("Please select a valid image file for the frame (e.g., PNG, JPG).");
              global.art.uploadedFrame.src = ""; // Clear src if invalid file type
              event.target.value = null; // Reset file input
              if (document.getElementById('mainFrame').value === 'custom_uploaded_frame') {
              }
          }
      });
  }

  setupFrameUploadListener();
  

  
  // -------------------------------
  // updateCard(): Renders the complete card.
  // -------------------------------

  let lastProcessedSidePanelKey = null; // Track the last processed key for the side panel
  let lastProcessedMainFrameKey = null; // Track the last processed key for the main frame

  function updateCard() {

    const canvas      = document.getElementById("cardCanvas");
    canvas.width      = canvas.width; 
    const ctx         = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";   

    const mainImage   = global.art.mainImage; 
    const margin      = parseInt(document.getElementById("borderRadius").value);


    if (mainImage.src && mainImage.src.startsWith("data:")) {
      mainImage.crossOrigin = null; 
    } else if (mainImage.src) { 
      mainImage.crossOrigin = "anonymous";
    }

    // Helper to get numeric value from an element
    function getNumericValue(id, defaultValue = 0) {
      const el = document.getElementById(id);
      return el ? (parseFloat(el.value) || defaultValue) : defaultValue;
    }

    // Helper to get string value from an element
    function getStringValue(id, defaultValue = "") {
      const el = document.getElementById(id);
      return el ? el.value : defaultValue;
    }

   
  
    // ------------------------------------
    // Render main art image
    // ------------------------------------

    if (mainImage.complete && mainImage.naturalWidth > 0) {
        const offsetX       = parseFloat(document.getElementById("offsetX").value) || 0;
        const offsetY       = parseFloat(document.getElementById("offsetY").value) || 0;
        const cropTop       = parseFloat(document.getElementById("cropTop").value) || 0;
        const cropRight     = parseFloat(document.getElementById("cropRight").value) || 0;
        const cropBottom    = parseFloat(document.getElementById("cropBottom").value) || 0;
        const cropLeft      = parseFloat(document.getElementById("cropLeft").value) || 0;
        const scalePercent  = parseFloat(document.getElementById("scalePercent").value) || 100;
    
        const srcX          = cropLeft;
        const srcY          = cropTop;
        const srcWidth      = mainImage.naturalWidth - cropLeft - cropRight;
        const srcHeight     = mainImage.naturalHeight - cropTop - cropBottom;
        const destWidth     = srcWidth * (scalePercent / 100);
        const destHeight    = srcHeight * (scalePercent / 100);
    

        ctx.drawImage(mainImage, srcX, srcY, srcWidth, srcHeight,
                      0 + offsetX, 0 + offsetY, destWidth, destHeight);

    }
    
    

    // ------------------------------------
    // Render main frame image
    // ------------------------------------

    const currentMainFrameKey     = document.getElementById("mainFrame").value;
    
    if (lastProcessedMainFrameKey !== currentMainFrameKey) {
      lastProcessedMainFrameKey       = currentMainFrameKey; // Update tracker
      const mainFrameNewSrc           = currentMainFrameKey === "none" ? "" : global.util.wrapImgPath(global.data.frameMap[currentMainFrameKey]);
      global.art.frameBgImage.src     = mainFrameNewSrc; // Set src on the global Image object
      // Image will load asynchronously. No onload here to call updateCard.
    }
    
    if (currentMainFrameKey !== "custom_uploaded_frame") {
      ctx.save();
      if (currentMainFrameKey !== "none" && global.art.frameBgImage.complete && global.art.frameBgImage.naturalWidth > 0) {
        ctx.drawImage(global.art.frameBgImage, 0, 0, canvas.width, canvas.height);
      }
    ctx.restore();
    }

    if (currentMainFrameKey === "custom_uploaded_frame") {
      ctx.save();
      if (currentMainFrameKey !== "none" && global.art.uploadedFrame.complete && global.art.uploadedFrame.naturalWidth > 0) {
        ctx.drawImage(global.art.uploadedFrame, 0, 0, canvas.width, canvas.height);
      }
    ctx.restore();
    }
    
    
    // ------------------------------------
    // Render Sidepanel image
    // ------------------------------------
    const currentSidePanelKey = document.getElementById("sidePanel").value;
    if (lastProcessedSidePanelKey !== currentSidePanelKey) {
        lastProcessedSidePanelKey = currentSidePanelKey; // Update tracker
        const sidePanelNewSrc = currentSidePanelKey === "none" ? "" : global.util.wrapImgPath(global.data.frameMap[currentSidePanelKey]);
        global.art.sidePanelImage.src = sidePanelNewSrc; // Set src on the global Image object
    }
    ctx.save();
    if (currentSidePanelKey !== "none" && global.art.sidePanelImage.complete && global.art.sidePanelImage.naturalWidth > 0) {
      ctx.drawImage(global.art.sidePanelImage, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();



    // ------------------------------------
    // Draw black border around card
    // ------------------------------------

    global.util.drawBorders(ctx, canvas, margin);



    // ------------------------------------
    // Render icons & symbols
    // ------------------------------------
    // ------------------------------------
    // Render Clan symbols
    // ------------------------------------

    const clan_location_1 = [ document.getElementById("clanX").value , document.getElementById("clanY").value ].flatMap(x => parseFloat(x));
    const clan_location_2 = [ parseFloat(document.getElementById("clanX").value) , parseFloat(document.getElementById("clanY").value) + parseFloat(document.getElementById("clanOffset").value) ];

    function renderClanIcon(ctx, clanData, loc1, loc2) {
        // Track the current y-offset for each location to avoid overlaps
        let [x1, y1] = loc1;
        let [x2, y2] = loc2;
        let size = parseFloat(document.getElementById("clanSize").value);
        let spacing = parseFloat(document.getElementById("clanSpacing").value);
        let isHorizontal = (document.getElementById("clanOrientation").checked);

        // Keep track of missing icons to avoid duplicate error messages
        const missingIcons = new Set();
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        clanData.forEach(symbol => {
            const checkbox1 = document.getElementById(symbol.id); // First checkbox
            const checkbox2 = document.getElementById(`${symbol.id}-display`); // Second checkbox
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            // Check if the image is loaded and not in a broken state
            if (symbol.image.complete && symbol.image.naturalWidth > 0) {
                if (checkbox1 && checkbox1.checked) {
                    // Render in the first location (upper left corner)
                    ctx.drawImage(symbol.image, x1, y1, size, size); // Adjust size as needed
                    if (!isHorizontal)    { y1 += (size + spacing); }
                    if (isHorizontal)     { x1 += (size + spacing); }
                }
                if (checkbox2 && checkbox2.checked) {
                    // Render in the second location (middle of the left panel)
                    ctx.drawImage(symbol.image, x2, y2, size, size); // Adjust size as needed
                    if (!isHorizontal)    { y2 += (size + spacing); }
                    if (isHorizontal)     { x2 += (size + spacing); }
                }
            } else {
                // If the image is not found or in a broken state
                if ((checkbox1 && checkbox1.checked) || (checkbox2 && checkbox2.checked)) {
                    // Log the error only if the user has selected the clan
                    if (!missingIcons.has(symbol.label)) {
                        global.util.showError(`Clan icon not found or failed to load for: ${symbol.label}`);
                        missingIcons.add(symbol.label);
                    }
                }
            }
        });

        ctx.restore();

        // Optionally, display a summary of missing icons (only once)
        if (missingIcons.size > 0) {
            console.warn("Missing clan icons:", Array.from(missingIcons).join(", "));
        }
    }

    renderClanIcon(ctx, global.data.clanData, clan_location_1, clan_location_2);
    // END render clan symbol 



    // ------------------------------------
    // Render Discipline symbols
    // ------------------------------------
    //
    // Note current code does not properly handle innate checkbox
    // and the current handling of tier 3 images is temporary creation of placeholders
    // which should be removed once they have their own images.

    function renderDisciplineIcons(ctx, disciplineData) {

        const activeDisciplines = [];
        const displayToggled = document.getElementById("disciplineToggle").checked;
        
        // Use ternary statements to set variables based on displayToggled
        const iconSize = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleSize").value) || 34
            : parseFloat(document.getElementById("disciplineSize").value) || 34;

        const iconSize2 = displayToggled
            ? iconSize + (parseFloat(document.getElementById("disciplineToggleDiff").value) || 6)
            : iconSize + (parseFloat(document.getElementById("disciplineDiff").value) || 6);

        const spacing = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleSpacing").value) || 4
            : parseFloat(document.getElementById("disciplineSpacing").value) || 4;

        const x = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleX").value) || 0
            : parseFloat(document.getElementById("disciplineX").value) || 0;

        const y = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleY").value) || 0
            : parseFloat(document.getElementById("disciplineY").value) || 0;

        const adjust = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleSuperiorOffset").value) || 0
            : parseFloat(document.getElementById("disciplineSuperiorOffset").value) || 0;

        const isHorizontal = displayToggled
            ? document.getElementById("disciplineToggleOrientation").checked
            : document.getElementById("disciplineOrientation").checked;

        const diff = displayToggled
            ? (parseFloat(document.getElementById("disciplineToggleDiff").value) || 0)
            : (parseFloat(document.getElementById("disciplineDiff").value) || 0);       

        // const innate = innate 


        // Collect active disciplines with their tier and other properties
        disciplineData.forEach(symbol => {
            const slider = document.querySelector(`.discipline-slider[id="${symbol.id}"]`);
            const displayCheckbox = document.getElementById(`${symbol.id}Display`);
            const innateCheckbox = document.getElementById(`${symbol.id}Innate`);

            if (slider) {
                const tier = parseInt(slider.dataset.currentTier, 10);

                if (tier > 0) {
                    const imgSrc        = symbol[`img_${tier}_src`];
                    const imgInnSrc     = symbol[`img_${tier + 3}_src`];                    

                    activeDisciplines.push({
                        id:           symbol.id,
                        label:        symbol.label,
                        tier:         tier,
                        inn:          innateCheckbox && innateCheckbox.checked,
                        imgSrc:       global.util.wrapImgPath(imgSrc),
                        imgInnSrc:    global.util.wrapImgPath(imgInnSrc),
                        // temporary code for enabling tier 3 placeholder images
                        img_obf_src: "./img/icon_discipline_obfuscate_inferior.png",
                        // temporary code for enablign innate icons
                        img_inn_inf: "./img/misc_innate_border_inferior.png",
                        img_inn_sup: "./img/misc_innate_border_superior.png",
                        img_t2_src: global.util.wrapImgPath(symbol[`img_2_src`]),
                        // above should be removed once tier3 images have icons
                    });
                }
            }
        });

        // Sort by tier (descending), then alphabetically by label
        activeDisciplines.sort((a, b) => {
            if (b.tier !== a.tier) {
                return b.tier - a.tier; // Higher tier first
            }
            return a.label.localeCompare(b.label); // Alphabetical order for same tier
        });

        let y2 = 0;
        let x2 = 0;        

        activeDisciplines.forEach((symbol, index) => {

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            let innate    = symbol.inn;
            let current   = parseInt(symbol.tier);
            let previous  = index == 0 ? current : activeDisciplines[index - 1].tier;
            let step      = (current == 1 && previous == 2);
            let step3     = (current == 3 && previous !== 3);
            let a         = diff * 0.5;            
  
            const inn_border1   = new Image();
            const inn_border2   = new Image();

            inn_border1.src     = symbol.img_inn_inf;
            inn_border2.src     = symbol.img_inn_sup;                

            // Load and render the icon
            const img = new Image();
            img.src = symbol.imgSrc;
            img.onload = () => {


              ctx.save();
              ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
              ctx.shadowBlur = 3;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;  

          

                // Currently doesn't support other tiers than 1 & 2 (Note step3 part of placeholder code)
                if        (step     &&  (isHorizontal))  { x2 -= a; }
                if        (step     && (!isHorizontal))  { y2 += a; }

                if        (step3    &&  (isHorizontal))  { x2 -= a; }
                if        (step3    && (!isHorizontal))  { y2 += a; }                

                if            (symbol.tier == 1)                      { ctx.drawImage(img         , x + x2                 , y + y2                 , iconSize, iconSize);   }
                if (innate &&  symbol.tier == 1)                      { ctx.drawImage(inn_border1 , x + x2                 , y + y2                 , iconSize, iconSize);   }
                if           ((symbol.tier == 2) && (isHorizontal))   { ctx.drawImage(img         , (x + x2) - a           , (y + y2) - a - adjust  , iconSize2, iconSize2); }
                if (innate &&  symbol.tier == 2  && (isHorizontal))   { ctx.drawImage(inn_border2 , (x + x2) - a           , (y + y2) - a - adjust  , iconSize2, iconSize2); }
                if           ((symbol.tier == 2) && (!isHorizontal))  { ctx.drawImage(img         , (x + x2) - a - adjust  , (y + y2) - a           , iconSize2, iconSize2); }
                if (innate &&  symbol.tier == 2  && (!isHorizontal))  { ctx.drawImage(inn_border2 , (x + x2) - a - adjust  , (y + y2) - a           , iconSize2, iconSize2); }                

                if           ((symbol.tier == 2) && (isHorizontal))   { x2 += iconSize2 + spacing;     } 
                if           ((symbol.tier == 2) && (!isHorizontal))  { y2 -= iconSize2 + spacing;     }

                if           ((symbol.tier == 1) && (isHorizontal))   { x2 += iconSize + spacing;      } 
                if           ((symbol.tier == 1) && (!isHorizontal))  { y2 -= iconSize + spacing;      }



              ctx.restore();

            }

              // Temporary code to display tier 3 as a composite of tier 2 and tier 1 obfuscate
              if (symbol.tier == 3) {

                const placeholder1  = new Image();
                const placeholder2  = new Image();

                placeholder1.src    = symbol.img_obf_src;
                placeholder2.src    = symbol.img_t2_src;

                placeholder2.onload = () => {

                  ctx.save();
                  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                  ctx.shadowBlur = 3;
                  ctx.shadowOffsetX = 0;
                  ctx.shadowOffsetY = 0;     


                  if         (isHorizontal)     { ctx.drawImage(placeholder1, x + x2              , y + y2 - adjust      , iconSize, iconSize); }                
                  if        (!isHorizontal)     { ctx.drawImage(placeholder1, x + x2 - adjust     , y + y2               , iconSize, iconSize); }

                  if (innate && isHorizontal)   { ctx.drawImage(inn_border1, x + x2              , y + y2 - adjust      , iconSize, iconSize); }
                  if (innate && !isHorizontal)  { ctx.drawImage(inn_border1, x + x2 - adjust     , y + y2               , iconSize, iconSize); }

                  if         (isHorizontal)     { ctx.drawImage(placeholder2, x + x2 - a          , y + y2 - a - adjust  , iconSize2, iconSize2); }                
                  if        (!isHorizontal)     { ctx.drawImage(placeholder2, x + x2 - a - adjust , y + y2 - a           , iconSize2, iconSize2); }  
                  
                  if (innate && isHorizontal)   { ctx.drawImage(inn_border2, x + x2 - a          , y + y2 - a - adjust  , iconSize2, iconSize2); } 
                  if (innate && !isHorizontal)  { ctx.drawImage(inn_border2, x + x2 - a - adjust , y + y2 - a           , iconSize2, iconSize2); }                  

                  if         (isHorizontal)     { x2 += iconSize2 + spacing;     } 
                  if        (!isHorizontal)     { y2 -= iconSize2 + spacing;     }                  

                  ctx.restore();
              
                }

              }
              // end of temporary code

        });
    }

    renderDisciplineIcons(ctx, global.data.disciplineData);

    // END render discipline symbols



    // ---------------------------------------------
    // Render pool cost, blood cost, capacity, life
    // ---------------------------------------------

    // Helper function to render a cost or capacity symbol
    function renderCostSymbol(ctx, image, x, y, sizeW, sizeH, textOffset, value, color, toggle, valueFontSize) {
    
      ctx.save();  

      if (toggle)       { ctx.shadowColor      = "#000000";   } 
      if (toggle)       { ctx.shadowBlur      = 2;            }
      if (toggle)       { ctx.shadowOffsetX   = 0;            }
      if (toggle)       { ctx.shadowOffsetY   = 2;            }

      ctx.drawImage(image, x, y, sizeW, sizeH);
      
      if (value > 0) { ctx.font          = `bold ${valueFontSize}px Arial`;               }
      if (value > 0) { ctx.textAlign     = "center";                                      }
      if (value > 0) { ctx.textBaseline  = "middle";                                      }
      if (value > 0) { ctx.fillStyle     = color;                                         }
      if (value > 0) { ctx.fillText(value, x + sizeW / 2, textOffset + y + sizeH / 2);    }

      ctx.restore();

    };

    function renderCostAndCapacitySymbols(ctx, symbolMap, configs) {

        if (configs === undefined) { global.util.showError('Missing configs, global.data.symbolIconconfigs'); return; }
        
        function newH (img, size) {
            let scalar              = img.naturalHeight / img.naturalWidth;          
            let h                   = size * scalar;
            return h;
        };

        configs.forEach(config => {
            const prefix                    = config.id_prefix;
            const amount                    = parseInt(document.getElementById(prefix + "Amount").value);
            const enabled                   = document.getElementById(prefix + "Enable").checked;                

            if (enabled) {
                const xPos                  = parseFloat(document.getElementById(prefix + "X").value);
                const yPos                  = parseFloat(document.getElementById(prefix + "Y").value);
                const iconSize              = parseFloat(document.getElementById(prefix + "Size").value); // This is height
                const textOffset            = parseFloat(document.getElementById(prefix + "TextOffset").value);
                const shadowEnabled         = document.getElementById(prefix + "Shadow").checked;

                const valueFontSizeElement  = document.getElementById(prefix + "ValueFontSize");
                let valueFontSize;

                if (valueFontSizeElement) {
                    valueFontSize = parseFloat(valueFontSizeElement.value) || 18; // Default to 18 if parsing fails
                } else {
                    // Fallback to datatable default if DOM element is missing
                    const settingConfig = config.settings.find(s => s.id_suffix === "ValueFontSize");
                    valueFontSize = settingConfig ? (settingConfig.defaultValue || 18) : 18;
                }
                const iconSelectElement = document.getElementById(prefix + "IconSelect");
                const selectedIconValue = iconSelectElement ? iconSelectElement.value : `symbol_${prefix}`;

                // Determine text color based on symbol type (could be added to config later)
                let textColor = "white";
                if (prefix === "pool" || prefix === "humanity") { textColor = "black"; }

                let imageToRender = null;
                let imageKeyForError = selectedIconValue;

                if (selectedIconValue === "custom_upload") {

                    const customImageKey  = `${prefix}IconUpload`; // Key for global.art.uploadedSymbolImages
                    imageToRender         = global.art.uploadedSymbolImages[customImageKey];
                    imageKeyForError      = `custom ${prefix} (${customImageKey})`;
                    if (!imageToRender) {  return; }
                } 

                if (selectedIconValue !== "custom_upload") {

                  imageToRender = global.art.loadedSymbolImages[selectedIconValue];
                  if (!imageToRender) {
                        console.error(`Pre-loaded image for key "${selectedIconValue}" not found in global.art.loadedSymbolImages.`);
                        global.util.showError(`Symbol image for ${selectedIconValue} not pre-loaded. Check console.`);
                        return; // Skip rendering this symbol
                  }
                }

                if (imageToRender.complete && imageToRender.naturalWidth > 0) {
                  const renderHeight = newH(imageToRender, iconSize);
                  renderCostSymbol(ctx, imageToRender, xPos, yPos, iconSize, renderHeight, textOffset, amount, textColor, shadowEnabled, valueFontSize);

                } else if (imageToRender) { 
                    // Image object exists but is not complete.
                    // This should ideally be handled by the initial loading or custom upload handling.
                    // console.warn(`Image for ${imageKeyForError} was not complete during render. Path: ${imageToRender.src}. Attaching onload.`);
                    // Fallback: if not already handled, attach an onload to trigger redraw.
                  if (!imageToRender.onload && (!imageToRender.dataset || !imageToRender.dataset.onloadAttachedRender)) {
                        imageToRender.onload = function() {
                            // console.log(`Deferred load complete for ${imageKeyForError} during render, triggering updateCard.`);
                            if(imageToRender.dataset) delete imageToRender.dataset.onloadAttachedRender;
                            imageToRender.onload = null; // Clear to avoid multiple calls
                            imageToRender.onerror = null; // Clear error handler too
                            updateCard(); 
                  };
                  
                  imageToRender.onerror = function() {
                            console.error(`Deferred load FAILED for ${imageKeyForError} during render. Path: ${imageToRender.src}`);
                            if(imageToRender.dataset) delete imageToRender.dataset.onloadAttachedRender;
                            imageToRender.onload = null; 
                            imageToRender.onerror = null;
                            // Optionally, you might want to show an error or skip future attempts for this image
                  };
                        
                  if(imageToRender.dataset) { imageToRender.dataset.onloadAttachedRender = 'true'; }
                  } // Closes the inner if (!imageToRender.onload && ...)
              
                } 
            }     
        });

    };

    // Function called after render background 
    // renderCostAndCapacitySymbols(ctx, global.data.symbolMap, global.data.symbolIconConfigs);

    // END of Render capacity symbol, life symbol (logic)


    
    // ---------------------------------------------
    // Render card type icons
    // ---------------------------------------------
    
    function renderTypeIcons(ctx, typeMap) {
      // Get global settings
      const x             = parseFloat(document.getElementById("typeX").value) || 0;
      const y             = parseFloat(document.getElementById("typeY").value) || 0;
      const size          = parseFloat(document.getElementById("typeSize").value) || 40;
      const spacing       = parseFloat(document.getElementById("typeSpacing").value) || 0;
      const isHorizontal  = document.getElementById("typeOrientation").checked; // true = horizontal, false = vertical

      // Collect active type icons
      const activeIcons = typeMap
        .filter(type => document.getElementById(`${type.id}Toggle`).checked)
        .map(type => ({
          id: type.id,
          label: type.label,
          iconSrc: global.util.wrapImgPath(type.iconSrc)
        }));

      // Sort icons alphabetically by label
      activeIcons.sort((a, b) => a.label.localeCompare(b.label));

      // Render the icons
      let currentX = x;
      let currentY = y;

      activeIcons.forEach(icon => {
        const img = new Image();
        img.src = icon.iconSrc;

        img.onload = () => {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, currentX, currentY, size, size);

          // Update position for the next icon
          if (isHorizontal) {
            currentX += size + spacing; // Move right
          } else {
            currentY += size + spacing; // Move down
          }
        };

        img.onerror = () => {
          console.error(`Failed to load icon: ${icon.label} (${icon.iconSrc})`);
        };
      });
    }

    renderTypeIcons(ctx, global.data.typeMap);

    // END of render type icons


    // ---------------------------
    // Functions to get DOM Values
    // ---------------------------

    // Helper function to interpret effect values from radio buttons
    function parseEffectValue(effectStringFromRadio) {
      // Try to parse as a number first (for values "0" through "6")
      const numericEffect = parseFloat(effectStringFromRadio);
      if (!isNaN(numericEffect) && numericEffect >= 0 && numericEffect <= 6) {
          return parseInt(effectStringFromRadio, 10); // Ensure it's an integer
      }

    };

    function getTextFieldProperties(prefix) {
      // Get the raw value from the checked radio button for effect
      // The radio group name is now `${prefix}_effect_radio`
      const effectRadio = document.querySelector(`input[name="${prefix}_effect_radio"]:checked`);
      const rawEffectValue = effectRadio ? effectRadio.value : "0"; // Default to "0" (none) if no radio is checked

      return {
          text:         getStringValue(`${prefix}_input`),
          fontFamily:   getStringValue(`${prefix}_font_select`, "Arial"),
          fontSize:     getNumericValue(`${prefix}_font_size_select`, 12),
          color:        global.util.hexToRgba(
                            getStringValue(`${prefix}_text_color_hex`),
                            getNumericValue(`${prefix}_text_opacity_input`, 100) / 100
                        ),
          effect:       parseEffectValue(rawEffectValue), // Renamed from getEffectValue
          boxX:         getNumericValue(`${prefix}_box_x_input`, 0),
          boxY:         getNumericValue(`${prefix}_box_y_input`, 0),
          boxWidth:     getNumericValue(`${prefix}_box_width_input`, 100),
          boxHeight:    getNumericValue(`${prefix}_box_height_input`, 20),
          bgColor:      global.util.hexToRgba(
                            getStringValue(`${prefix}_bg_color_hex`),
                            getNumericValue(`${prefix}_bg_opacity_input`, 0) / 100
                        ),
          bgBorder:     getNumericValue(`${prefix}_bg_border_input`, 0)
      };
    };

    // New function to draw a single text field's background
    function drawTextFieldBackground(ctx, props) {
        ctx.fillStyle = props.bgColor;
        global.util.drawRoundedRect(ctx, props.boxX, props.boxY, props.boxWidth, props.boxHeight, 3, props.bgBorder);
    }

    // New function to draw a single text field's text
    function drawTextFieldText(ctx, props) {
        const textX = props.boxX + 5; // Standard padding from left
        const textY = props.boxY + props.fontSize; // Y for the baseline of the first line of text
        const textMaxWidth = props.boxWidth - 10; // Max width for text, allowing for padding
        
        // The font string for wrapText; wrapText will parse bold/italic from markdown.
        // props.fontSize is used as lineHeight in wrapText, which dictates the rendered size.
        const fontString = `${props.fontSize}px ${props.fontFamily}`;

        ctx.save();
        global.text.wrapText(ctx, props.text, textX, textY, textMaxWidth, props.fontSize, props.effect, fontString, props.color);
        ctx.restore();
    };

    // --------------------------------------------
    // Draw text field backgrounds and text on them
    // --------------------------------------------

    // Use the simplified textFieldConfigs which just contains id_prefixes
    const textFields = global.data.textFieldConfigs ? global.data.textFieldConfigs.map(config => config.id_prefix) : [];
    if (textFields.length === 0 && textFieldControlsContainer) { // Only warn if the container exists but no configs
        console.warn("Text field configurations not found or empty. Text fields will not be rendered.");
    }
    const allTextFieldsProps = textFields.map(prefix => getTextFieldProperties(prefix));

    // First, draw all backgrounds. Then, draw all text over the backgrounds

    allTextFieldsProps.forEach(props => { drawTextFieldBackground(ctx, props);  });
    allTextFieldsProps.forEach(props => { drawTextFieldText      (ctx, props);  });

    renderCostAndCapacitySymbols(ctx, global.data.symbolMap, global.data.symbolIconConfigs);
    


    // -------------------------------
    // Render the Dark Pack logo
    // -------------------------------

    global.renderDarkPackLogo(ctx);

  }
  // -------------------------------
  // NOTE: END of updateCard() 
  // -------------------------------  



  // -------------------------------
  // JSON Export/Import
  // -------------------------------
  document.getElementById("saveJsonButton").addEventListener("click", global.json.exportJson);
  
  document.getElementById("importJsonButton").addEventListener("click", function () {
    document.getElementById("jsonImport").click();
  });
  
  document.getElementById("jsonImport").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      global.json.importJson(e.target.files[0]);
    }
  });

  /**
   * Sets up the premade template selector dropdown.
   * Populates it with options from the provided templates array and attaches an event listener.
   * @param {Array<object>} templatesArray - An array of template objects, 
   *                                         each with 'name' and 'path' properties.
   */
  function setupPremadeTemplateSelector(templatesArray) {
    const templateSelector = document.getElementById('templateSelector');

    if (templateSelector && typeof templatesArray !== 'undefined' && templatesArray.length > 0) {
      // Populate the dropdown
      templatesArray.forEach(template => {
        const option = document.createElement('option');
        option.value = template.path;
        option.textContent = template.name;
        templateSelector.appendChild(option);
      });

      // Add event listener for template selection
      templateSelector.addEventListener('change', function() {
        const selectedPath = this.value;
        if (!selectedPath) {
          return; // No actual template selected (e.g., the "Select a Template..." option)
        }

        const confirmed = confirm("Loading this template will overwrite your current work. Are you sure you want to proceed?");

        if (confirmed) {
          fetch(selectedPath)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, while fetching ${selectedPath}`);
              }
              return response.text(); // Get the JSON as text first
            })
            .then(jsonString => {
              // Create a Blob from the JSON string, then a File object to pass to importJson
              const blob = new Blob([jsonString], { type: 'application/json' });
              const file = new File([blob], selectedPath.split('/').pop() || "template.json", { type: "application/json" });
              global.json.importJson(file); // Use existing import function
            })
            .catch(error => {
              console.error("Error loading premade template:", error);
              alert(`Failed to load template: ${selectedPath}.\n${error.message}`);
              this.value = ""; // Reset dropdown on error
            });
        } else {
          this.value = ""; // Reset dropdown if user cancels
        }
      });
    } else if (templateSelector) {
      console.warn("Template selector found, but the provided templates array is undefined or empty. Dropdown will not be populated.");
    }
  }

  setupPremadeTemplateSelector(global.data.premadeTemplates);


 
  // -------------------------------
  // Listen for changes on all form elements.
  // -------------------------------
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", updateCard);
    el.addEventListener("change", updateCard);
  });

  document.getElementById("updateCardButton").addEventListener("click", updateCard);
  
  // -------------------------------
  // Art Panel: File upload and URL load.
  // -------------------------------
  document.getElementById("artFile").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        console.log("artFile reader.onload: File read as dataURL. Length:", event.target.result.length);
        // --- Modification Start: Re-create Image object for local uploads ---
        global.art.mainSrc = event.target.result;

        const newImg = new Image();
        // newImg.crossOrigin = null; // Explicitly set for dataURL, though default is fine.
        // It's crucial that newImg.onload calls updateCard.
        // global.art.mainImage.onload is already set to updateCard, so we can reuse that.
        // However, to be absolutely safe and explicit:
        newImg.onload = updateCard;
        newImg.onerror = function() {
            global.util.showError(`Failed to load uploaded image: ${file.name}`);
            updateCard(); // Still update to reflect the error or cleared state
        };
        global.art.mainImage = newImg; // Replace the global reference
        console.log("artFile reader.onload: Assigning dataURL to new global.art.mainImage.src");
        global.art.mainImage.src = global.art.mainSrc; // Set src on the NEW image
        
        // --- Modification End ---
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById("loadArtUrl").addEventListener("click", function () {
    const url = document.getElementById("artUrl").value;
    if (url) {
      console.log("loadArtUrl: Loading URL:", url);
      global.art.mainSrc = url;
      // For URL loads, ensure crossOrigin is set on the existing global.art.mainImage
      // or re-create it if you prefer consistency with the file upload logic.
      // Sticking to modifying the existing one for URL loads for now:
      console.log("loadArtUrl: Setting global.art.mainImage.crossOrigin = 'anonymous'");
      global.art.mainImage.crossOrigin = "anonymous"; // SET BEFORE SRC
      console.log("loadArtUrl: Assigning URL to global.art.mainImage.src");
      global.art.mainImage.src = url;
      // The existing global.art.mainImage.onload will handle calling updateCard
    }
  });
  
  global.art.mainImage.onload = updateCard;
  global.art.mainImage.onerror = function() { // Add a generic onerror for the initial/global mainImage
    global.util.showError(`Failed to load main art image from: ${global.art.mainImage.src}. It might be a CORS issue or an invalid URL. Exporting may be affected.`);
    // updateCard(); // Avoid potential infinite loop if placeholder also fails
  };
  
  // -------------------------------
  // Export the canvas as a PNG (preserving transparency).
  // -------------------------------
  document.getElementById("exportButton").addEventListener("click", function () {
    const canvas = document.getElementById("cardCanvas");
    try {
        console.log("ExportButton: Attempting toDataURL...");
        const dataURL = canvas.toDataURL("image/png");
        console.log("ExportButton: toDataURL successful. Data length:", dataURL.length);
        const link = document.createElement("a");
        link.download = "custom_card.png";
        link.href = dataURL;
        link.click();
    } catch (e) {
        console.error("ExportButton: Export PNG failed:", e);
        global.util.showError("Could not export the card as PNG. This might be due to an image loaded from an external website that restricts access (CORS issue), or an unexpected internal error. Try uploading the image directly. Check console for details.");
    }
  });

  // -------------------------------
  // Event listeners for dynamically generated controls
  // -------------------------------
  // Event delegation for dynamically generated text field controls
  if (textFieldControlsContainer) {
      textFieldControlsContainer.addEventListener('input', (event) => {
          if (event.target.closest('.text-field-control-group')) {
              updateCard();
          }
      });
      textFieldControlsContainer.addEventListener('change', (event) => { // For selects, radios
          if (event.target.closest('.text-field-control-group')) {
              updateCard();
          }
      });
  }
  // Listeners for other static controls (art panel, middle panel toggles, etc.)
  // This querySelectorAll might need adjustment if the structure of other panels changes.
  document.querySelectorAll('.middle-panel input, .middle-panel select, .art-panel input, .art-panel select, #darkPackSection input, #symbolHeader input, #typeHeader input, #disciplineHeader input, #clanHeader input').forEach(el => {
      el.addEventListener('input', updateCard);
      el.addEventListener('change', updateCard); // Catch changes for selects, checkboxes, radios
  });

  // Initial render.
  updateCard();
});
// -------------------------------
// End of DOM Content Loaded 
// -------------------------------
