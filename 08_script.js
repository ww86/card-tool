




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
  // Global variables for the main art image & its original source.

  const imgPath = "./img/";

  function wrapImgPath(path) {
    if (!path) return ""; // Handle empty or undefined paths

    if (path.startsWith(imgPath)) {
      global.util.showError(`Path already starts with:` + imgPath + `; ${path}`);
      return path; // Return the path as-is
    }

    return imgPath + `${path}`;
  }

  // -------------------------------
  // License Popup
  // -------------------------------

  global.showLicensePopup();


  
  // --------------
  // Testing
  // --------------

  let tested = false;
  let testAllDisciplines = false;
 
  if (tested === false) { global.tests.testAllImages(wrapImgPath, testAllDisciplines); tested = true; }

  // Currently not working properly
  global.tests.testAllFonts(global.data.availableFonts);



  // -------------------------------
  // Font Population and Checking
  // -------------------------------

  function populateFontSelectors(availableFonts, fontSelectorConfigs) {

    // createOptions(availableFonts, selectedFont), 
    // function which returns an array of divs, one for each font option, 
    // and adds the 'selected' option to the selectedFont

    function createOptions(fonts, selectedFontName) {
      const options = [];
      fonts.forEach(font => {
        const option = document.createElement("option");
        option.value = font.name;
        option.textContent = font.displayName;
        if (font.name === selectedFontName) {
          option.selected = true;
        }
        options.push(option);
      });
      return options;
    };

    // fontSelectorConfigs.forEach( ... )
    // Function that calls createOptions for each selector in the table, 
    // and then calls Array.forEach on the return value, and appends each object to the div.

    fontSelectorConfigs.forEach(config => {
      const selector = document.getElementById(config.id);
      const options = createOptions(availableFonts, config.default);
      options.forEach(option => selector.appendChild(option));
    });
 
  };

  populateFontSelectors(global.data.availableFonts, global.data.fontSelectorConfigs);



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

  function createSymbolSettings (setting) {
    const label     = document.createElement("div");
    const input     = document.createElement("input");

    label.htmlFor   = setting.id;
    label.innerText = setting.label;

    if (setting.type == "number") {
      input.type      = "number";
      input.id        = setting.id;
      input.value     = setting.defaultValue;
      input.min       = setting.min;
      input.max       = setting.max;
    }

    if (setting.type == "checkbox") {
      input.type      = "checkbox";
      input.class     = "symbol-checkbox";
      input.id        = setting.id;
      input.checked   = setting.defaultValue;
    }

    return [input, label];

  };

  function createSettingsDiv (settings, name) {
    const setDiv = document.createElement("div");
    const title = document.createElement("div");
    title.innerHTML = name + ":";
    setDiv.className = "symbol-inline";
    setDiv.appendChild(title);

    settings.forEach(set => {
      const [input,label] = createSymbolSettings(set);
      setDiv.appendChild(label);
      setDiv.appendChild(input);
    });

    return setDiv;

  };

  let poolDiv       = createSettingsDiv(global.data.miscIconData.poolSettings     , "Pool");
  let bloodDiv      = createSettingsDiv(global.data.miscIconData.bloodSettings    , "Blood");
  let capacityDiv   = createSettingsDiv(global.data.miscIconData.capacitySettings , "Capacity");
  let lifeDiv       = createSettingsDiv(global.data.miscIconData.lifeSettings     , "Life");
  
  costSymbolGrid.appendChild(poolDiv);
  costSymbolGrid.appendChild(bloodDiv);
  costSymbolGrid.appendChild(capacityDiv);
  costSymbolGrid.appendChild(lifeDiv);
  


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
    disciplinesSettingsDiv.className  = "inline-selector";
    disciplinesSettingsDiv2.className = "inline-selector";


    // Add global settings for X, Y, Size, Spacing, and Orientation
    const disciplineSettings = [
        { id: "disciplineX",              label: "X:",        defaultValue: 18,   min: 0,   max: 358 },
        { id: "disciplineY",              label: "Y:",        defaultValue: 400,  min: 0,   max: 500 },
        { id: "disciplineSize",           label: "Size:",     defaultValue: 30,   min: 10,  max: 100 },
        { id: "disciplineDiff",           label: "Diff:",     defaultValue: 8,    min: 0,   max: 20  },
        { id: "disciplineSpacing",        label: "Gap:",      defaultValue: 0,    min: 0,   max: 20  },
        { id: "disciplineSuperiorOffset", label: "Adjust:",   defaultValue: 3,    min: 0,   max: 20  }        
    ];
    const disciplineSettings2 = [
        { id: "disciplineToggleX",              label: "X:",        defaultValue: 18,   min: 0,   max: 358 },
        { id: "disciplineToggleY",              label: "Y:",        defaultValue: 240,  min: 0,   max: 500 },
        { id: "disciplineToggleSize",           label: "Size:",     defaultValue: 34,   min: 10,  max: 100 },
        { id: "disciplineToggleDiff",           label: "Diff:",     defaultValue: 8,    min: 0,   max: 20  },
        { id: "disciplineToggleSpacing",        label: "Gap:",      defaultValue: 2,    min: 0,   max: 20  },
        { id: "disciplineToggleSuperiorOffset", label: "Adjust:",   defaultValue: 4,    min: 0,   max: 20  }                
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

    // Toggle for Additional Feature
    const featureToggleDiv = document.createElement("div");
    featureToggleDiv.className = "discipline-toggle";
    const featureLabel = document.createElement("label");
    featureLabel.htmlFor = `${item.id}Feature`;
    featureLabel.innerText = "I:";
    const featureCheckbox = document.createElement("input");
    featureCheckbox.type = "checkbox";
    featureCheckbox.id = `${item.id}Feature`;
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
      symbol.image.src = wrapImgPath(symbol.imgSrc);
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
  
  

  // -------------------------------
  // updateCard(): Renders the complete card.
  // -------------------------------

  function updateCard() {

    const mainImage = global.art.mainImage;
    mainImage.crossOrigin = "anonymous";
    let frameImage = null;
    let frameBgImage = null;    

    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";            


    // Reserve margin
    const margin          = parseInt(document.getElementById("borderRadius").value);
    const innerX          = margin;
    const innerY          = margin;
    const innerWidth      = canvas.width - (margin * 2);
    const innerHeight     = canvas.height - (margin * 2);
  
    // --- Draw main art image within the inner rounded area.
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
  
      ctx.save();
      ctx.drawImage(mainImage, srcX, srcY, srcWidth, srcHeight,
                    0 + offsetX, 0 + offsetY, destWidth, destHeight);
      ctx.restore();
    }
    
    // --- Vampire or Other Frame
    const mainFrameKey = document.getElementById("mainFrame").value;
    const mainFrameSrc = wrapImgPath(global.data.frameMap[mainFrameKey]);

    if (mainFrameSrc) {
      if (!frameBgImage || frameBgImage.src !== mainFrameSrc) {
        frameBgImage = new Image();
        frameBgImage.src = mainFrameSrc;
      }
    }
    
    ctx.save();
    if (frameBgImage && frameBgImage.complete && mainFrameKey !== "none") {
      ctx.drawImage(frameBgImage, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
    
    // --- Frame Overlay: Draw the side panel overlay
    const sidePanelKey = document.getElementById("sidePanel").value;
    const sidePanelSrc = wrapImgPath(global.data.frameMap[sidePanelKey]);
    if (sidePanelSrc) {
      if (!frameImage || frameImage.src !== sidePanelSrc) {
        frameImage = new Image();
        frameImage.src = sidePanelSrc;
      }
    }

    ctx.save();
    if (frameImage && frameImage.complete && sidePanelKey !== "none") {
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();

    // Draw black border 
    function drawBorders (ctx,margin) {
      let r = margin;
      let w = canvas.width - 2 * margin;
      let h = canvas.height - 2 * margin;
      let p = Math.PI;

      ctx.clearRect(0, 0, canvas.width, r);
      ctx.clearRect(0, 0, r, canvas.height);    
      ctx.clearRect(r + w, 0,r + w, canvas.height);
      ctx.clearRect(0, h + r, canvas.width, canvas.height);    
      
      ctx.save();
      ctx.lineWidth = margin * 2;
      ctx.strokeStyle = "black";
      
      ctx.beginPath();
      ctx.moveTo(r * 2, r);
      ctx.lineTo(w, r);
      ctx.arc(w, r * 2, r, 1.5 * p, 2 * p), 
      ctx.lineTo(1 * r + w, h);
      ctx.arc(w, h, r, 0 * p, 0.5 * p);
      ctx.lineTo(r * 2, 1 * r + h);
      ctx.arc(r * 2, h, r, 0.5 * p, 1 * p);
      ctx.lineTo(r, r * 2);
      ctx.arc(r * 2, r * 2, r, 1 * p, 1.5 * p);    
      ctx.closePath();
    
      ctx.stroke();
      ctx.restore();
    };

    drawBorders(ctx,margin);

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



        // Collect active disciplines with their tier and other properties
        disciplineData.forEach(symbol => {
            const slider = document.querySelector(`.discipline-slider[id="${symbol.id}"]`);
            const displayCheckbox = document.getElementById(`${symbol.id}Display`);
            const innateCheckbox = document.getElementById(`${symbol.id}Feature`);

            if (slider) {
                const tier = parseInt(slider.dataset.currentTier, 10);

                if (tier > 0) {
                    const imgSrc = innateCheckbox && innateCheckbox.checked
                        ? symbol[`img_${tier + 3}_src`]
                        : symbol[`img_${tier}_src`];

                    activeDisciplines.push({
                        id: symbol.id,
                        label: symbol.label,
                        tier: tier,
                        imgSrc: wrapImgPath(imgSrc),
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
            let current   = parseInt(symbol.tier);
            let previous  = index == 0 ? current : activeDisciplines[index - 1].tier;
            let step      = (current == 1 && previous == 2);
      
            // Load and render the icon
            const img = new Image();
            img.src = symbol.imgSrc;
            img.onload = () => {

              ctx.save();

              ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
              ctx.shadowBlur = 3;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;  

                // Currently doesn't support other tiers than 1 & 2 
                if        (step               && (isHorizontal))   { x2 -= (iconSize2 - iconSize) - 1; }
                if        (step               && (!isHorizontal))  { y2 += (iconSize2 - iconSize) - 1; }

                if         (symbol.tier == 1)                      { ctx.drawImage(img, x + x2         , y + y2          , iconSize, iconSize);   }
                if        ((symbol.tier == 2) && (isHorizontal))   { ctx.drawImage(img, x + x2         , y + y2 - adjust , iconSize2, iconSize2); }                
                if        ((symbol.tier == 2) && (!isHorizontal))  { ctx.drawImage(img, x + x2 - adjust, y + y2          , iconSize2, iconSize2); }                        

                if        ((symbol.tier == 2) && (isHorizontal))   { x2 += iconSize2 + spacing;     } 
                if        ((symbol.tier == 2) && (!isHorizontal))  { y2 -= iconSize2 + spacing;     }

                if        ((symbol.tier == 1) && (isHorizontal))   { x2 += iconSize + spacing;      } 
                if        ((symbol.tier == 1) && (!isHorizontal))  { y2 -= iconSize + spacing;      }

              ctx.restore();

            }
        });
    }

    renderDisciplineIcons(ctx, global.data.disciplineData);

    // END render discipline symbols



    // ---------------------------------------------
    // Render pool cost, blood cost, capacity, life
    // ---------------------------------------------

    // Helper function to render a cost or capacity symbol
    function renderCostSymbol(ctx, image, x, y, sizeW, sizeH, textOffset, value, color, toggle) {
    
      ctx.save();  

      if (toggle)       { ctx.shadowColor      = "#000000";   } 
      if (toggle)       { ctx.shadowBlur      = 2;            }
      if (toggle)       { ctx.shadowOffsetX   = 0;            }
      if (toggle)       { ctx.shadowOffsetY   = 2;            }

      ctx.drawImage(image, x, y, sizeW, sizeH);
      ctx.font          = "bold 18px Arial";
      ctx.textAlign     = "center";
      ctx.textBaseline  = "middle";
      ctx.fillStyle     = color;
      ctx.fillText(value, x + sizeW / 2, textOffset + y + sizeH / 2);

      ctx.restore();

    };

    function renderCostAndCapacitySymbols(ctx, symbolMap) {

        // Get user selections
        const poolAmount            = parseInt(document.getElementById("poolAmount").value);
        const bloodAmount           = parseInt(document.getElementById("bloodAmount").value);
        const capacityAmount        = parseInt(document.getElementById("capacityAmount").value);
        const lifeAmount            = parseInt(document.getElementById("lifeAmount").value);

        const poolX                 = parseFloat(document.getElementById("poolX").value);
        const poolY                 = parseFloat(document.getElementById("poolY").value);
        const poolSize              = parseFloat(document.getElementById("poolSize").value);
        const poolTextOffset        = parseFloat(document.getElementById("poolTextOffset").value);
        const poolEnable            =            document.getElementById("poolEnable").checked;

        const bloodX                = parseFloat(document.getElementById("bloodX").value);
        const bloodY                = parseFloat(document.getElementById("bloodY").value);
        const bloodSize             = parseFloat(document.getElementById("bloodSize").value);
        const bloodTextOffset       = parseFloat(document.getElementById("bloodTextOffset").value);
        const bloodEnable           =            document.getElementById("bloodEnable").checked;

        const capacityX             = parseFloat(document.getElementById("capacityX").value);
        const capacityY             = parseFloat(document.getElementById("capacityY").value);
        const capacitySize          = parseFloat(document.getElementById("capacitySize").value);
        const capacityTextOffset    = parseFloat(document.getElementById("capacityTextOffset").value);
        const capacityEnable        =            document.getElementById("capacityEnable").checked;

        const lifeX                 = parseFloat(document.getElementById("lifeX").value);
        const lifeY                 = parseFloat(document.getElementById("lifeY").value);
        const lifeSize              = parseFloat(document.getElementById("lifeSize").value);
        const lifeTextOffset        = parseFloat(document.getElementById("lifeTextOffset").value);
        const lifeEnable            =            document.getElementById("lifeEnable").checked;
        
        
        function newW (img, size) {
            let scalar              = img.naturalWidth / img.naturalHeight;          
            let w                   = size / scalar;
            return w;
        };

        if (poolAmount > 0 ) {
          const poolImage             = new Image ();
          poolImage.src               = wrapImgPath(symbolMap["symbol_pool"]);
          poolImage.onload = function () { 
            let w = newW(poolImage, poolSize);
            renderCostSymbol(ctx, poolImage, poolX, poolY, poolSize, w, poolTextOffset, poolAmount, "black",poolEnable);
          }          
        }

        if (bloodAmount > 0) {
          const bloodImage            = new Image ();
          bloodImage.src              = wrapImgPath(symbolMap["symbol_blood"]);
          bloodImage.onload = function () { 
            let w = newW(bloodImage, bloodSize);
            renderCostSymbol(ctx, bloodImage, bloodX, bloodY, bloodSize, w, bloodTextOffset, bloodAmount, "white",bloodEnable);
          }
        }        
        
        if (capacityAmount > 0 ) { 
          const capacityImage         = new Image ();
          capacityImage.src           = wrapImgPath(symbolMap["symbol_capacity"]);
          capacityImage.onload = function () { 
            let w = newW(capacityImage, capacitySize);      
            renderCostSymbol(ctx, capacityImage, capacityX, capacityY, capacitySize, w, capacityTextOffset, capacityAmount, "white",capacityEnable);
          }           
        }

        if (lifeAmount > 0) {
          const lifeImage             = new Image ();
          lifeImage.src               = wrapImgPath(symbolMap["symbol_life"]);
          lifeImage.onload = function () {
            let w = newW(lifeImage, lifeSize);      
            renderCostSymbol(ctx, lifeImage, lifeX, lifeY, lifeSize, w, lifeTextOffset, lifeAmount, "white",lifeEnable);
          }           
        }        

    };

    renderCostAndCapacitySymbols(ctx, global.data.symbolMap);

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
          iconSrc: wrapImgPath(type.iconSrc)
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



    // ----------------------------------
    // Draw text field backgrounds
    // ----------------------------------

    // --- Header Background ---
    const nameBoxX        = parseFloat(document.getElementById("nameBoxX").value) || 20;
    const nameBoxY        = parseFloat(document.getElementById("nameBoxY").value) || 300;
    const nameBoxWidth    = parseFloat(document.getElementById("nameBoxWidth").value) || 318;
    const nameBoxHeight   = parseFloat(document.getElementById("nameBoxHeight").value) || 100;
    const nameBgColor     = document.getElementById("nameBgHex").value || document.getElementById("nameBgColor").value;
    const nameBgOpacity   = (parseFloat(document.getElementById("nameBgOpacity").value) || 0) * 0.01;
    const nameBgRgba      = global.util.hexToRgba(nameBgColor, nameBgOpacity);
    const nameBgBorder    = parseFloat(document.getElementById("nameBgBorder").value) || 0;
    ctx.fillStyle         = nameBgRgba;
    global.util.drawRoundedRect(ctx, nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight, 3, nameBgBorder);
    //ctx.fillRect(nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight);
    
    // --- Card Text Background ---
    const textBoxX        = parseFloat(document.getElementById("textBoxX").value) || 20;
    const textBoxY        = parseFloat(document.getElementById("textBoxY").value) || 300;
    const textBoxWidth    = parseFloat(document.getElementById("textBoxWidth").value) || 318;
    const textBoxHeight   = parseFloat(document.getElementById("textBoxHeight").value) || 100;
    const textBgColor     = document.getElementById("textBgHex").value || document.getElementById("textBgColor").value;
    const textBgOpacity   = (parseFloat(document.getElementById("textBgOpacity").value) || 0) * 0.01;
    const textBgRgba      = global.util.hexToRgba(textBgColor, textBgOpacity);
    const textBgBorder    = parseFloat(document.getElementById("textBgBorder").value) || 0;
    ctx.fillStyle         = textBgRgba;
    global.util.drawRoundedRect(ctx, textBoxX, textBoxY, textBoxWidth, textBoxHeight, 3, textBgBorder);
    // ctx.fillRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    
    // --- Flavour Text Background ---
    const flavourBoxX       = parseFloat(document.getElementById("flavourBoxX").value) || 20;
    const flavourBoxY       = parseFloat(document.getElementById("flavourBoxY").value) || (textBoxY + textBoxHeight + 20);
    const flavourBoxWidth   = parseFloat(document.getElementById("flavourBoxWidth").value) || (canvas.width - 40);
    const flavourBoxHeight  = parseFloat(document.getElementById("flavourBoxHeight").value) || 50;
    const flavourBgColor    = document.getElementById("flavourBgHex").value || document.getElementById("flavourBgColor").value;
    const flavourBgOpacity  = (parseFloat(document.getElementById("flavourBgOpacity").value) || 0) * 0.01;
    const flavourBgRgba     = global.util.hexToRgba(flavourBgColor, flavourBgOpacity);
    const flavourBgBorder   = parseFloat(document.getElementById("flavourBgBorder").value) || 0;
    ctx.fillStyle           = flavourBgRgba;
    global.util.drawRoundedRect(ctx, flavourBoxX, flavourBoxY, flavourBoxWidth, flavourBoxHeight, 3, flavourBgBorder);    

    
    // --- Artist Background ---
    const artistBoxX        = parseFloat(document.getElementById("artistBoxX").value) || (canvas.width - 110);
    const artistBoxY        = parseFloat(document.getElementById("artistBoxY").value) || (canvas.height - 30);
    const artistBoxWidth    = parseFloat(document.getElementById("artistBoxWidth").value) || 100;
    const artistBoxHeight   = parseFloat(document.getElementById("artistBoxHeight").value) || 20;
    const artistBgColor     = document.getElementById("artistBgHex").value || document.getElementById("artistBgColor").value;
    const artistBgOpacity   = (parseFloat(document.getElementById("artistBgOpacity").value) || 0) * 0.01;
    const artistBgRgba      = global.util.hexToRgba(artistBgColor, artistBgOpacity);
    const artistBgBorder    = parseFloat(document.getElementById("artistBgBorder").value) || 0;
    ctx.fillStyle           = artistBgRgba;
    global.util.drawRoundedRect(ctx, artistBoxX, artistBoxY, artistBoxWidth, artistBoxHeight, 3, artistBgBorder);  

        // --- Artist Background ---
    const miniBoxX        = parseFloat(document.getElementById("miniBoxX").value) || (canvas.width - 110);
    const miniBoxY        = parseFloat(document.getElementById("miniBoxY").value) || (canvas.height - 30);
    const miniBoxWidth    = parseFloat(document.getElementById("miniBoxWidth").value) || 100;
    const miniBoxHeight   = parseFloat(document.getElementById("miniBoxHeight").value) || 20;
    const miniBgColor     = document.getElementById("miniBgHex").value || document.getElementById("miniBgColor").value;
    const miniBgOpacity   = (parseFloat(document.getElementById("miniBgOpacity").value) || 0) * 0.01;
    const miniBgRgba      = global.util.hexToRgba(miniBgColor, miniBgOpacity);
    const miniBgBorder    = parseFloat(document.getElementById("miniBgBorder").value) || 0;
    ctx.fillStyle         = miniBgRgba;
    global.util.drawRoundedRect(ctx, miniBoxX, miniBoxY, miniBoxWidth, miniBoxHeight, 3, miniBgBorder);  
    
    
    
    
    // ----------------------------------
    // Draw text on the backgrounds
    // ----------------------------------

    // global.text.wrapText() arguments are "ctx, text, x, y, maxWidth, lineHeight, antialias"

    const nameRgba          = global.util.hexToRgba(document.getElementById("nameHex").value, document.getElementById("nameOpacity").value);
    const textRgba          = global.util.hexToRgba(document.getElementById("textHex").value, document.getElementById("textOpacity").value);
    const flavourRgba       = global.util.hexToRgba(document.getElementById("flavourHex").value, document.getElementById("flavourOpacity").value);    
    const artistRgba        = global.util.hexToRgba(document.getElementById("artistHex").value, document.getElementById("artistOpacity").value);    
    const miniRgba          = global.util.hexToRgba(document.getElementById("miniHex").value, document.getElementById("miniOpacity").value);    
    
    // --- Header Text (Card Name, Type, Subtype) ---
    const nameString        = document.getElementById("cardName").value;
    const nameBgX           = parseFloat(document.getElementById("nameBoxX").value) + 5;
    const nameBgY           = parseFloat(document.getElementById("nameBoxY").value) + 20;
    const nameBgW           = parseFloat(document.getElementById("nameBoxWidth").value) - 10;
    const nameLineHeight    = parseFloat(document.getElementById("nameFontSize").value);
    const nameAntialias     = document.querySelector('input[name="nameEffect"]:checked').value;
    const nameFont          = `${document.getElementById("nameFontSize").value}px ${document.getElementById("nameFont").value}`;

    ctx.save();
    global.text.newWrapText(ctx, nameString, nameBgX, nameBgY, nameBgW, nameLineHeight, nameAntialias, nameFont, nameRgba);
    ctx.restore();

    // --- Card Text ---
    const textString        = document.getElementById("cardText").value;
    const textBgX           = parseFloat(document.getElementById("textBoxX").value) + 5;
    const textBgY           = parseFloat(document.getElementById("textBoxY").value) + 20;
    const textBgW           = parseFloat(document.getElementById("textBoxWidth").value) - 10;
    const textLineHeight    = parseFloat(document.getElementById("textFontSize").value);
    const textAntialias     = document.querySelector('input[name="textEffect"]:checked').value;
    const textFont          = `${document.getElementById("textFontSize").value}px ${document.getElementById("textFont").value}`;

    ctx.save();
    global.text.newWrapText(ctx, textString, textBgX, textBgY, textBgW, textLineHeight, textAntialias, textFont, textRgba);
    ctx.restore();

    // --- Flavour Text ---
    const flavourString     = document.getElementById("cardFlavour").value;
    const flavourBgX        = parseFloat(document.getElementById("flavourBoxX").value) + 5;
    const flavourBgY        = parseFloat(document.getElementById("flavourBoxY").value) + 20;
    const flavourBgW        = parseFloat(document.getElementById("flavourBoxWidth").value) - 10;
    const flavourLineHeight = parseFloat(document.getElementById("flavourFontSize").value);
    const flavourAntialias  = document.querySelector('input[name="flavourEffect"]:checked').value;
    const flavourFont      = `${document.getElementById("flavourFontSize").value}px ${document.getElementById("flavourFont").value}`;

    ctx.save();
    global.text.newWrapText(ctx, flavourString, flavourBgX, flavourBgY, flavourBgW, flavourLineHeight, flavourAntialias, flavourFont, flavourRgba);
    ctx.restore();

    // --- Artist Text ---
    const artistString      = document.getElementById("cardArtist").value;
    const artistBgX         = parseFloat(document.getElementById("artistBoxX").value) + 5;
    const artistBgY         = parseFloat(document.getElementById("artistBoxY").value);
    const artistBgW         = parseFloat(document.getElementById("artistBoxWidth").value) - 10;
    const artistLineHeight  = parseFloat(document.getElementById("artistFontSize").value);
    const artistAntialias   = document.querySelector('input[name="artistEffect"]:checked').value;
    const artistFont        = `${document.getElementById("artistFontSize").value}px ${document.getElementById("artistFont").value}`;

    ctx.save();
    global.text.newWrapText(ctx, artistString, artistBgX, artistBgY, artistBgW, artistLineHeight, artistAntialias, artistFont, artistRgba);
    ctx.restore();

    // --- Mini Text ---
    const miniString        = document.getElementById("cardMini").value;
    const miniBgX           = parseFloat(document.getElementById("miniBoxX").value) + 5;
    const miniBgY           = parseFloat(document.getElementById("miniBoxY").value);
    const miniBgW           = parseFloat(document.getElementById("miniBoxWidth").value) - 10;
    const miniLineHeight    = parseFloat(document.getElementById("miniFontSize").value);
    const miniAntialias     = document.querySelector('input[name="miniEffect"]:checked').value;
    const miniFont          = `${document.getElementById("miniFontSize").value}px ${document.getElementById("miniFont").value}`;


    ctx.save();
    global.text.newWrapText(ctx, miniString, miniBgX, miniBgY, miniBgW, miniLineHeight, miniAntialias, miniFont, miniRgba);
    ctx.restore();    



    // -------------------------------
    // Render the Dark Pack logo
    // -------------------------------

    global.renderDarkPackLogo(ctx);

  }
  // -------------------------------
  // END of updateCard() 
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
        global.art.mainSrc = event.target.result;
        global.art.mainImage.src = global.art.mainSrc;
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById("loadArtUrl").addEventListener("click", function () {
    const url = document.getElementById("artUrl").value;
    if (url) {
      global.art.mainSrc = url;
      global.art.mainImage.src = url;
    }
  });
  
  global.art.mainImage.onload = updateCard;
  
  // -------------------------------
  // Export the canvas as a PNG (preserving transparency).
  // -------------------------------
  document.getElementById("exportButton").addEventListener("click", function () {
    const canvas = document.getElementById("cardCanvas");
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "custom_card.png";
    link.href = dataURL;
    link.click();
  });



  // -------------------------------
  // Event listeners for colorpickers
  // -------------------------------
    const pickerDefName       = document.getElementById("nameColor");
    const pickerHexName       = document.getElementById("nameHex");
    const pickerDefBgName     = document.getElementById("nameBgColor");
    const pickerHexBgName     = document.getElementById("nameBgHex");
  
    const pickerDefCard       = document.getElementById("textColor");
    const pickerHexCard       = document.getElementById("textHex");
    const pickerDefBgCard     = document.getElementById("textBgColor");
    const pickerHexBgCard     = document.getElementById("textBgHex");  
  
    const pickerDefFlavour    = document.getElementById("flavourColor");
    const pickerHexFlavour    = document.getElementById("flavourHex"); 
    const pickerDefBgFlavour  = document.getElementById("flavourBgColor");
    const pickerHexBgFlavour  = document.getElementById("flavourBgHex");  
  
    const pickerDefArtist     = document.getElementById("artistColor");
    const pickerHexArtist     = document.getElementById("artistHex");  
    const pickerDefBgArtist   = document.getElementById("artistBgColor");
    const pickerHexBgArtist   = document.getElementById("artistBgHex");   
    
    const pickerDefMini       = document.getElementById("miniColor");
    const pickerHexMini       = document.getElementById("miniHex");
    const pickerDefBgMini     = document.getElementById("miniBgColor");
    const pickerHexBgMini     = document.getElementById("miniBgHex");    

    // Function to update hex input when color picker changes
    function listenerPair(pick1,pick2) {
      pick1.addEventListener("input", () => { pick2.value = pick1.value; });
      pick2.addEventListener("input", () => {      
        let hex = pick2.value.trim();
        if (/^#([0-9A-Fa-f]{6})$/.test(hex)) { 
          pick1.value = hex; 
        }
      });
    }

    listenerPair(pickerDefName      , pickerHexName);
    listenerPair(pickerDefBgName    , pickerHexBgName);
    listenerPair(pickerDefCard      , pickerHexCard);
    listenerPair(pickerDefBgCard    , pickerHexBgCard);
    listenerPair(pickerDefFlavour   , pickerHexFlavour);
    listenerPair(pickerDefBgFlavour , pickerHexBgFlavour);
    listenerPair(pickerDefArtist    , pickerHexArtist);
    listenerPair(pickerDefBgArtist  , pickerHexBgArtist);  
    listenerPair(pickerDefMini      , pickerHexMini);
    listenerPair(pickerDefBgMini    , pickerHexBgMini);          

  
  // Initial render.
  updateCard();
});
// -------------------------------
// End of DOM Content Loaded 
// -------------------------------
