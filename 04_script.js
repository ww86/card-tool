




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
  const mainArtImage = new Image();
  mainArtImage.crossOrigin = "anonymous";
  let originalArtSrc = "";
  let frameImage = null;
  let frameBgImage = null;
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

  function showLicensePopup() {
    // Use a session variable to track if the popup has been shown
    let licensePopupShown = false;

    // Check if the popup has already been shown in this session
    if (licensePopupShown) {
      return; // Do not show the popup again
    }

    // License text stored in a variable with line breaks
    const licenseTextContent = `
      All of the image files may be copyrighted by 'Paradox Interactive AB'.<br>
      Make a pinkie promise not to use these image files in a way that breaks the law.<br><br>
      Fanmade content. The codebase: script.js, index.html and style.css are intended as free to use, but not properly licensed.
    `;

    // Show the popup
    const licensePopup = document.getElementById("licensePopup");
    const licenseText = document.getElementById("licenseText");
    const acceptButton = document.getElementById("acceptButton");
    const declineButton = document.getElementById("declineButton");

    licensePopup.style.display = "flex";

    // Set the license text with line breaks
    licenseText.innerHTML = licenseTextContent;

    // Add the image below the license text
    const licenseImage = document.createElement("img");
    licenseImage.src = "license_001.png"; // Path to the image
    licenseImage.alt = "License Image";
    licenseImage.style.marginTop = "20px"; // Add some spacing
    licenseImage.style.maxWidth = "100%"; // Ensure the image fits within the popup
    licenseImage.style.height = "auto"; // Maintain aspect ratio

    // Append the image to the license text container
    licenseText.appendChild(licenseImage);

    // Add links below the image
    const linksContainer = document.createElement("div");
    linksContainer.style.marginTop = "20px"; // Add spacing above the links
    linksContainer.style.textAlign = "center"; // Center-align the links

    // Paradox Interactive AB link
    const paradoxLink = document.createElement("a");
    paradoxLink.href = "https://www.paradoxinteractive.com/";
    paradoxLink.target = "_blank"; // Open in a new tab
    paradoxLink.textContent = "Paradox Interactive AB";
    paradoxLink.style.display = "block"; // Display as a block for vertical stacking
    paradoxLink.style.color = "#007bff"; // Optional: Add link color
    paradoxLink.style.textDecoration = "none"; // Optional: Remove underline
    paradoxLink.style.marginBottom = "10px"; // Add spacing between links

    // Dark Pack license information link
    const darkPackLink = document.createElement("a");
    darkPackLink.href = "https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement";
    darkPackLink.target = "_blank"; // Open in a new tab
    darkPackLink.textContent = "Dark Pack License Information";
    darkPackLink.style.display = "block"; // Display as a block for vertical stacking
    darkPackLink.style.color = "#007bff"; // Optional: Add link color
    darkPackLink.style.textDecoration = "none"; // Optional: Remove underline
    darkPackLink.style.marginBottom = "10px"; // Add spacing between links

    // World of Darkness website link
    const wodLink = document.createElement("a");
    wodLink.href = "https://www.worldofdarkness.com/";
    wodLink.target = "_blank"; // Open in a new tab
    wodLink.textContent = "World of Darkness";
    wodLink.style.display = "block"; // Display as a block for vertical stacking
    wodLink.style.color = "#007bff"; // Optional: Add link color
    wodLink.style.textDecoration = "none"; // Optional: Remove underline
    wodLink.style.marginBottom = "10px";     

    // Black Chantry Productions website link
    const blackChantryLink = document.createElement("a");
    blackChantryLink.href = "https://www.blackchantry.com/";
    blackChantryLink.target = "_blank"; // Open in a new tab
    blackChantryLink.textContent = "Black Chantry Productions";
    blackChantryLink.style.display = "block"; // Display as a block for vertical stacking
    blackChantryLink.style.color = "#007bff"; // Optional: Add link color
    blackChantryLink.style.textDecoration = "none"; // Optional: Remove underline    
    blackChantryLink.style.marginBottom = "10px"; 

    // VTES Discord server link
    const discordLink = document.createElement("a");
    discordLink.href = "https://discord.com/invite/vampire-the-eternal-struggle-official-887471681277399091"; // Replace with the actual invite link
    discordLink.target = "_blank"; // Open in a new tab
    discordLink.textContent = "VTES Discord Server";
    discordLink.style.display = "block"; // Display as a block for vertical stacking
    discordLink.style.color = "#007bff"; // Optional: Add link color
    discordLink.style.textDecoration = "none"; // Optional: Remove underline
    discordLink.style.marginBottom = "10px"; // Add spacing between links    

    // Append links to the container
    linksContainer.appendChild(paradoxLink);
    linksContainer.appendChild(darkPackLink);
    linksContainer.appendChild(wodLink);
    linksContainer.appendChild(blackChantryLink);    
    linksContainer.appendChild(discordLink);    

    // Append the links container to the license text container
    licenseText.appendChild(linksContainer);

    // Handle Accept button
    acceptButton.addEventListener("click", function () {
      licensePopup.style.display = "none"; // Hide the popup
      licensePopupShown = true; // Mark the popup as shown
    });

    // Handle Decline button
    declineButton.addEventListener("click", function () {
      alert("You must accept the license to use this application.");
    });
  }

  showLicensePopup();



  

  let tested = false;
  let testAllDisciplines = false;
  function testAllImages() {

      // Helper function to test a single image
      function testImage(src, label) {
          const img = new Image();
          img.onload = () => {
          };
          img.onerror = () => {
              global.util.showOnloadError(`Image failed to load: ${label} (${src})`);
          };
          img.src = src;
      }

      // Test discipline images
      global.data.disciplineData.forEach(discipline => {
          let nt = testAllDisciplines ? 6 : 2;
          for (let i = 1; i <= nt; i++) {
              const imgSrc = wrapImgPath(discipline[`img_${i}_src`]);
              if (imgSrc) {
                  testImage(imgSrc, `${discipline.label} (image ${i})`);
              }
          }
      });

      // Test clan images
      global.data.clanData.forEach(clan => {
          if (clan.imgSrc) {
              testImage(wrapImgPath(clan.imgSrc), clan.label);
          }
      });

      // Test symbol map images
      Object.entries(global.data.symbolMap).forEach(([key, src]) => {
          if (src) {
              testImage(wrapImgPath(src), key);
          }
      });

      console.log("Image testing completed.");
  }

  if (tested === false) { testAllImages(); tested = true; }




  // -------------------------------
  // renderIcon(), renderStyledText() and renderLine() functions
  // -------------------------------

  function renderIcon (ctx, iconSrc, x, y, size) {
    const img = new Image();
    img.src = iconSrc;
    img.onload = () => {
      ctx.drawImage(img, x, y - size - 1, size * 1.5, size * 1.5); // Adjust vertical alignment
    };
  };

  function renderStyledText(ctx, text, x, y, style, strokeWidth) {
      ctx.save();

      // Extract the current font size and family from ctx.font
      const fontParts   = ctx.font.split(" ");
      const fontSize    = fontParts[0]; // e.g., "16px"
      const fontFamily  = fontParts.slice(1).join(" "); // e.g., "Arial"

      // Apply the style
      ctx.font = `${fontSize} ${fontFamily}`;

      if (style === "bold")           { ctx.font = `bold ${fontSize} ${fontFamily}`;        }        
      if (style === "italic")         { ctx.font = `italic ${fontSize} ${fontFamily}`;      }
      if (style === "bold italic")    { ctx.font = `bold italic ${fontSize} ${fontFamily}`; }
      if (style === "italic bold")    { ctx.font = `bold italic ${fontSize} ${fontFamily}`; }

      // Render the text
      ctx.strokeStyle   = "black";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      if (strokeWidth >   0     )       { ctx.lineWidth     = strokeWidth;        }
      if (strokeWidth >   1     )       { ctx.shadowOffsetX = 0;                  }
      if (strokeWidth >   1     )       { ctx.shadowOffsetY = 1;                  }
      if (strokeWidth >   1     )       { ctx.shadowBlur    = 3;                  }
      if (strokeWidth >   1     )       { ctx.shadowColor   = "#000000EE";        }
      if (strokeWidth >   0     )       { ctx.strokeText(text, x, y);             }

      ctx.fillText(text, x, y);
      ctx.restore();
  };

  function renderLine(ctx, incoming_line, x, y, strokeWidth, h) {

      const tokens = incoming_line.split(/(\[.*?\])/); // Split by markdown-like tokens
      let currentX = x;
      let currentStyle = "normal"; // Default text style
      let style = "normal"; // Default text style
      let icon = false;
      let symbol = false

      tokens.forEach(token => {

        icon = false;
        symbol = false;

        if (global.data.markdownIconMap[token])         { icon = true;    }
        if (global.data.markdownTextMap[token])         { symbol = true;  }

        if (icon)                                       { renderIcon(ctx, wrapImgPath(global.data.markdownIconMap[token]), currentX, y, h); }
        if (icon)                                       { currentX += h;  }

        if (symbol)                                     { style = global.data.markdownTextMap[token]; }
        if (symbol)                                     { currentX -= 0.32 * h; }

        if (symbol && style !== "newline")              { currentStyle = style; }
                
        if (!icon && !symbol)                           { renderStyledText(ctx, token, currentX, y, currentStyle, strokeWidth); }
        if (!icon && !symbol)                           { currentX += ctx.measureText(token).width; }
                   
      });

  };

  // -------------------------------
  // wrapText function
  // -------------------------------

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, antialias) {

    const words = text.split(" ");
    const segments = words.flatMap(word => word.split(/(?=\[.*?\])|(?<=\])/));
   
    let line = "";
    let y2 = y;
    let strokeWidth = 0;

    if (antialias === "aa1") { strokeWidth = 1; }
    if (antialias === "aa2") { strokeWidth = 2; }
    if (antialias === "aa3") { strokeWidth = 3; }  

    for (let i = 0; i < segments.length; i++) {

      if (global.data.markdownTextMap[segments[i]] == "newline") {
        renderLine(ctx, line, x, y2, strokeWidth, lineHeight);
        line = "";
        y2 += lineHeight;
        i++;
      }

      let testLine = line + segments[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        renderLine(ctx, line, x, y2, strokeWidth, lineHeight);
        line = segments[i] + " ";
        y2 += lineHeight;
      } else {
        line = testLine;
      }

    }

    renderLine(ctx, line, x, y2, strokeWidth, lineHeight);

  }



  // -------------------------------
  // Generate dark pack logo ui (unchecked by default).
  // -------------------------------
  
  // Variable declarations
  const destination               = document.getElementById("darkPackSection");
  const darkPackControls          = document.createElement("div");
  const darkPackToggleLabel       = document.createElement("label");
  const darkPackToggle            = document.createElement("input");
  const darkPackXLabel            = document.createElement("label");
  const darkPackXInput            = document.createElement("input");
  const darkPackYLabel            = document.createElement("label");
  const darkPackYInput            = document.createElement("input");
  const darkPackHLabel            = document.createElement("label");
  const darkPackHInput            = document.createElement("input");
  const darkPackWLabel            = document.createElement("label");
  const darkPackWInput            = document.createElement("input");
  
  darkPackControls.className      = "inline-selector";

  // Toggle for On/Off
  darkPackToggleLabel.htmlFor     = "darkPackToggle";
  darkPackToggleLabel.innerText   = "On:";
  darkPackToggle.type             = "checkbox";
  darkPackToggle.id               = "darkPackToggle";
  darkPackToggle.checked          = true; // Default value

  // X Position
  darkPackXLabel.htmlFor          = "darkPackX";
  darkPackXLabel.innerText        = "X:";  
  darkPackXInput.type             = "number";
  darkPackXInput.id               = "darkPackX";
  darkPackXInput.value            = 314; // Default value
  darkPackXInput.min              = 0;

  // Y Position
  darkPackYLabel.htmlFor          = "darkPackY";
  darkPackYLabel.innerText        = "Y:";
  darkPackYInput.type             = "number";
  darkPackYInput.id               = "darkPackY";
  darkPackYInput.value            = 12; // Default value
  darkPackYInput.min              = 0;

  // Size Height
  darkPackHLabel.htmlFor          = "darkPackH";
  darkPackHLabel.innerText        = "H:";
  darkPackHInput.type             = "number";
  darkPackHInput.id               = "darkPackH";
  darkPackHInput.value            = 32; // Default value
  darkPackHInput.min              = 1;

  // Size Width
  darkPackWLabel.htmlFor          = "darkPackW";
  darkPackWLabel.innerText        = "W:";
  darkPackWInput.type             = "number";
  darkPackWInput.id               = "darkPackW";
  darkPackWInput.value            = 0; // Default value
  darkPackWInput.min              = 0;

  // Append all controls to the container
  darkPackControls.appendChild(darkPackToggleLabel);
  darkPackControls.appendChild(darkPackToggle);
  darkPackControls.appendChild(darkPackXLabel);
  darkPackControls.appendChild(darkPackXInput);
  darkPackControls.appendChild(darkPackYLabel);
  darkPackControls.appendChild(darkPackYInput);
  darkPackControls.appendChild(darkPackHLabel);
  darkPackControls.appendChild(darkPackHInput);
  darkPackControls.appendChild(darkPackWLabel);
  darkPackControls.appendChild(darkPackWInput);

  // Append the controls to the middle panel
  destination.appendChild(darkPackControls);
  


  // ------------------------------------
  // Generate HTML User Interace elements
  // ------------------------------------

  // Generate pool cost, blood cost, capacity, and life symbols
  const costSymbolSection     = document.getElementById("symbolHeader");
  const costSymbolGrid        = document.getElementById("symbolGrid");

  const poolSettings = [
    { id: "poolX",            label: "X:",              defaultValue: 18, min: 0,   max: 358 },
    { id: "poolY",            label: "Y:",              defaultValue: 380,min: 0,   max: 500 },
    { id: "poolSize",         label: "Size:",           defaultValue: 38, min: 10,  max: 100 },
    { id: "poolTextOffset",   label: "Text Offset Y:",  defaultValue: 0,  min: -10, max: 40  },
    { id: "poolAmount",       label: "Amount:",         defaultValue: 0,  min: 0,   max: 20 },
  ];

    const bloodSettings = [
    { id: "bloodX",            label: "X:",              defaultValue: 12, min: 0,   max: 358 },
    { id: "bloodY",            label: "Y:",              defaultValue: 380,min: 0,   max: 500 },
    { id: "bloodSize",         label: "Size:",           defaultValue: 50, min: 10,  max: 100 },
    { id: "bloodTextOffset",   label: "Text Offset Y:",  defaultValue: 8,  min: -10, max: 40  },
    { id: "bloodAmount",       label: "Amount:",         defaultValue: 0,   min: 0,   max: 20 },
  ];

  const capacitySettings = [
    { id: "capacityX",            label: "X:",              defaultValue: 300, min: 0,   max: 358 },
    { id: "capacityY",            label: "Y:",              defaultValue: 420, min: 0,   max: 500 },
    { id: "capacitySize",         label: "Size:",           defaultValue: 33, min: 10,  max: 100 },
    { id: "capacityTextOffset",   label: "Text Offset Y:",  defaultValue: 2,  min: -10, max: 40  },
    { id: "capacityAmount",       label: "Amount:",         defaultValue: 0,  min: 0,   max: 20 },
  ];

  const lifeSettings = [
    { id: "lifeX",                label: "X:",              defaultValue: 12, min: 0,   max: 358 },
    { id: "lifeY",                label: "Y:",              defaultValue: 300,min: 0,   max: 500 },
    { id: "lifeSize",             label: "Size:",           defaultValue: 60, min: 10,  max: 100 },
    { id: "lifeTextOffset",       label: "Text Offset Y:",  defaultValue: 8,  min: -10, max: 40  },
    { id: "lifeAmount",           label: "Amount:",         defaultValue: 0,  min: 0,   max: 20 },
  ];  

  function createSymbolSettings (setting) {
    const label     = document.createElement("div");
    const input     = document.createElement("input");

    label.htmlFor   = setting.id;
    label.innerText = setting.label;

    input.type      = "number";
    input.id        = setting.id;
    input.value     = setting.defaultValue;
    input.min       = setting.min;
    input.max       = setting.max;

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

  let poolDiv       = createSettingsDiv(poolSettings, "Pool");
  let bloodDiv      = createSettingsDiv(bloodSettings, "Blood");
  let capacityDiv   = createSettingsDiv(capacitySettings, "Capacity");
  let lifeDiv       = createSettingsDiv(lifeSettings, "Life");
  
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
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";            

    // Reserve margin
    const margin = parseInt(document.getElementById("borderRadius").value);
    const innerX = margin;
    const innerY = margin;
    const innerWidth = canvas.width - (margin * 2);
    const innerHeight = canvas.height - (margin * 2);
  
    // --- Draw main art image within the inner rounded area.
    if (mainArtImage.complete && mainArtImage.naturalWidth > 0) {
      const offsetX = parseFloat(document.getElementById("offsetX").value) || 0;
      const offsetY = parseFloat(document.getElementById("offsetY").value) || 0;
      const cropTop = parseFloat(document.getElementById("cropTop").value) || 0;
      const cropRight = parseFloat(document.getElementById("cropRight").value) || 0;
      const cropBottom = parseFloat(document.getElementById("cropBottom").value) || 0;
      const cropLeft = parseFloat(document.getElementById("cropLeft").value) || 0;
      const scalePercent = parseFloat(document.getElementById("scalePercent").value) || 100;
  
      const srcX = cropLeft;
      const srcY = cropTop;
      const srcWidth = mainArtImage.naturalWidth - cropLeft - cropRight;
      const srcHeight = mainArtImage.naturalHeight - cropTop - cropBottom;
      const destWidth = srcWidth * (scalePercent / 100);
      const destHeight = srcHeight * (scalePercent / 100);
  
      ctx.save();
      ctx.drawImage(mainArtImage, srcX, srcY, srcWidth, srcHeight,
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

        activeDisciplines.forEach(symbol => {

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";            

            // Load and render the icon
            const img = new Image();
            img.src = symbol.imgSrc;
            img.onload = () => {

                // Directly draw the image onto the main canvas
                if         (symbol.tier == 1)                     { ctx.drawImage(img, x + x2         , y + y2          , iconSize, iconSize);
                } else if ((symbol.tier == 2) && (isHorizontal))  { ctx.drawImage(img, x + x2         , y + y2 - adjust , iconSize2, iconSize2);                  
                } else if ((symbol.tier == 2) && (!isHorizontal)) { ctx.drawImage(img, x + x2 - adjust, y + y2          , iconSize2, iconSize2);                 
                } 

            if (isHorizontal)   { x2 += iconSize + spacing; } 
            if (!isHorizontal)  { y2 -= iconSize + spacing; }

            }
        });
    }

    renderDisciplineIcons(ctx, global.data.disciplineData);

    // END render discipline symbols



    // ---------------------------------------------
    // Render pool cost, blood cost, capacity, life
    // ---------------------------------------------

    // Helper function to render a cost or capacity symbol
    function renderCostSymbol(ctx, image, x, y, sizeW, sizeH, textOffset, value, color) {
    
      ctx.save();  

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

        const bloodX                = parseFloat(document.getElementById("bloodX").value);
        const bloodY                = parseFloat(document.getElementById("bloodY").value);
        const bloodSize             = parseFloat(document.getElementById("bloodSize").value);
        const bloodTextOffset       = parseFloat(document.getElementById("bloodTextOffset").value);

        const capacityX             = parseFloat(document.getElementById("capacityX").value);
        const capacityY             = parseFloat(document.getElementById("capacityY").value);
        const capacitySize          = parseFloat(document.getElementById("capacitySize").value);
        const capacityTextOffset    = parseFloat(document.getElementById("capacityTextOffset").value);

        const lifeX                 = parseFloat(document.getElementById("lifeX").value);
        const lifeY                 = parseFloat(document.getElementById("lifeY").value);
        const lifeSize              = parseFloat(document.getElementById("lifeSize").value);
        const lifeTextOffset        = parseFloat(document.getElementById("lifeTextOffset").value);        
        
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
            renderCostSymbol(ctx, poolImage, poolX, poolY, poolSize, w, poolTextOffset, poolAmount, "black");
          }          
        }

        if (bloodAmount > 0) {
          const bloodImage            = new Image ();
          bloodImage.src              = wrapImgPath(symbolMap["symbol_blood"]);
          bloodImage.onload = function () { 
            let w = newW(bloodImage, bloodSize);
            renderCostSymbol(ctx, bloodImage, bloodX, bloodY, bloodSize, w, bloodTextOffset, bloodAmount, "white");
          }
        }        
        
        if (capacityAmount > 0 ) { 
          const capacityImage         = new Image ();
          capacityImage.src           = wrapImgPath(symbolMap["symbol_capacity"]);
          capacityImage.onload = function () { 
            let w = newW(capacityImage, capacitySize);      
            renderCostSymbol(ctx, capacityImage, capacityX, capacityY, capacitySize, w, capacityTextOffset, capacityAmount, "white");
          }           
        }

        if (lifeAmount > 0) {
          const lifeImage             = new Image ();
          lifeImage.src               = wrapImgPath(symbolMap["symbol_life"]);
          lifeImage.onload = function () {
            let w = newW(lifeImage, lifeSize);      
            renderCostSymbol(ctx, lifeImage, lifeX, lifeY, lifeSize, w, lifeTextOffset, lifeAmount, "white");
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

    // wrapText arguments are "ctx, text, x, y, maxWidth, lineHeight, antialias"

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

    ctx.save();
    ctx.fillStyle           = nameRgba;
    ctx.font                = `${document.getElementById("nameFontSize").value}px ${document.getElementById("nameFont").value}`;
    ctx.textAlign           = "left";
    wrapText(ctx, nameString, nameBgX, nameBgY, nameBgW, nameLineHeight, nameAntialias);
    ctx.restore();

    // --- Card Text ---
    const textString        = document.getElementById("cardText").value;
    const textBgX           = parseFloat(document.getElementById("textBoxX").value) + 5;
    const textBgY           = parseFloat(document.getElementById("textBoxY").value) + 20;
    const textBgW           = parseFloat(document.getElementById("textBoxWidth").value) - 10;
    const textLineHeight    = parseFloat(document.getElementById("textFontSize").value);
    const textAntialias     = document.querySelector('input[name="textEffect"]:checked').value;

    ctx.save();
    ctx.fillStyle           = textRgba;
    ctx.font                = `${document.getElementById("textFontSize").value}px ${document.getElementById("textFont").value}`;
    ctx.textAlign           = "left";
    wrapText(ctx, textString, textBgX, textBgY, textBgW, textLineHeight, textAntialias);
    ctx.restore();

    // --- Flavour Text ---
    const flavourString     = document.getElementById("cardFlavour").value;
    const flavourBgX        = parseFloat(document.getElementById("flavourBoxX").value) + 5;
    const flavourBgY        = parseFloat(document.getElementById("flavourBoxY").value) + 20;
    const flavourBgW        = parseFloat(document.getElementById("flavourBoxWidth").value) - 10;
    const flavourLineHeight = parseFloat(document.getElementById("flavourFontSize").value);
    const flavourAntialias  = document.querySelector('input[name="flavourEffect"]:checked').value;

    ctx.save();
    ctx.fillStyle           = flavourRgba;
    ctx.font                = `${document.getElementById("flavourFontSize").value}px ${document.getElementById("flavourFont").value}`;
    ctx.textAlign           = "left";
    wrapText(ctx, flavourString, flavourBgX, flavourBgY, flavourBgW, flavourLineHeight, flavourAntialias);
    ctx.restore();

    // --- Artist Text ---
    const artistString      = document.getElementById("cardArtist").value;
    const artistBgX         = parseFloat(document.getElementById("artistBoxX").value) + 5;
    const artistBgY         = parseFloat(document.getElementById("artistBoxY").value);
    const artistBgW         = parseFloat(document.getElementById("artistBoxWidth").value) - 10;
    const artistLineHeight  = parseFloat(document.getElementById("artistFontSize").value);
    const artistAntialias   = document.querySelector('input[name="artistEffect"]:checked').value;

    ctx.save();
    ctx.fillStyle           = artistRgba;
    ctx.font                = `${document.getElementById("artistFontSize").value}px ${document.getElementById("artistFont").value}`;
    ctx.textAlign           = "left";
    wrapText(ctx, artistString, artistBgX, artistBgY, artistBgW, artistLineHeight, artistAntialias);
    ctx.restore();

    // --- Mini Text ---
    const miniString        = document.getElementById("cardMini").value;
    const miniBgX           = parseFloat(document.getElementById("miniBoxX").value) + 5;
    const miniBgY           = parseFloat(document.getElementById("miniBoxY").value);
    const miniBgW           = parseFloat(document.getElementById("miniBoxWidth").value) - 10;
    const miniLineHeight    = parseFloat(document.getElementById("miniFontSize").value);
    const miniAntialias     = document.querySelector('input[name="miniEffect"]:checked').value;

    ctx.save();
    ctx.fillStyle           = miniRgba;
    ctx.font                = `${document.getElementById("miniFontSize").value}px ${document.getElementById("miniFont").value}`;
    ctx.textAlign           = "left";
    wrapText(ctx, miniString, miniBgX, miniBgY, miniBgW, miniLineHeight, miniAntialias);
    ctx.restore();    



    // -------------------------------
    // Render the Dark Pack logo
    // -------------------------------

    function renderDarkPackLogo(ctx) {
      const toggle = document.getElementById("darkPackToggle");
      if (!toggle || !toggle.checked) { return; }

      const x = parseFloat(document.getElementById("darkPackX").value) || 0;
      const y = parseFloat(document.getElementById("darkPackY").value) || 0;
      const sizeH = parseFloat(document.getElementById("darkPackH").value) || 50; // Default height
      const sizeW = parseFloat(document.getElementById("darkPackW").value) || 0; // Default width (0 means preserve proportions)   

      // Get the image path for the Dark Pack logo
      const logoSrc = "symbol_dark_pack_logo_bw.png";

      // Load the image
      const logoImage = new Image();
      logoImage.src = logoSrc;

      logoImage.onload = function () {
        if (logoImage.width > 0 && logoImage.height > 0) {
          // Calculate the width and height
          let renderWidth = sizeW > 0 ? sizeW : sizeH * (logoImage.width / logoImage.height); // Use sizeW if defined, otherwise preserve proportions
          let renderHeight = sizeH;

          // Draw the logo on the canvas
          ctx.save();
          ctx.drawImage(logoImage, x, y, renderWidth, renderHeight);
          ctx.restore();
        } else {
          console.error("Dark Pack logo image has invalid dimensions:", logoImage.width, logoImage.height);
        }
      };

      logoImage.onerror = function () {
        console.error("Failed to load the Dark Pack logo image.");
      };
    }

    // Call the function to render the Dark Pack logo
    renderDarkPackLogo(ctx);

  }
  // -------------------------------
  // END of updateCard() 
  // -------------------------------  



  // -------------------------------
  // JSON Export/Import functions.
  // -------------------------------
  function saveAsJSON() {
      const template = {
          // General card properties
          cardName: document.getElementById("cardName").value,
          nameFont: document.getElementById("nameFont").value,
          nameFontSize: document.getElementById("nameFontSize").value,
          cardType: document.getElementById("cardType").value,
          cardSubtype: document.getElementById("cardSubtype").value,
          cardText: document.getElementById("cardText").value,
          textFont: document.getElementById("textFont").value,
          textFontSize: document.getElementById("textFontSize").value,
          offsetX: document.getElementById("offsetX").value,
          offsetY: document.getElementById("offsetY").value,
          cropTop: document.getElementById("cropTop").value,
          cropRight: document.getElementById("cropRight").value,
          cropBottom: document.getElementById("cropBottom").value,
          cropLeft: document.getElementById("cropLeft").value,
          scalePercent: document.getElementById("scalePercent").value,
          frameType: document.getElementById("frameType").value,
          canvasBgHex: document.getElementById("canvasBgHex")?.value || "",

          // Costs and symbols
          poolCost: document.getElementById("poolCost").value,
          poolCostToggle: document.getElementById("poolCostToggle").checked,
          bloodCost: document.getElementById("bloodCost").value,
          bloodCostToggle: document.getElementById("bloodCostToggle").checked,
          capacitySymbol: document.getElementById("capacitySymbol").value,
          lifeSymbol: document.getElementById("lifeSymbol").value,

          // Disciplines
          disciplines: global.data.disciplineData.reduce((acc, item) => {
              acc[item.id] = {
                  checked: document.getElementById(item.id).checked,
                  tier: parseInt(document.querySelector(`.discipline-slider[data-current-tier][id="${item.id}"]`)?.dataset.currentTier || "0", 10),
                  innate: document.getElementById(`${item.id}Feature`)?.checked || false
              };
              return acc;
          }, {}),

          // Clans
          clans: global.data.clanData.reduce((acc, item) => {
              acc[item.id] = {
                  checked: document.getElementById(item.id).checked,
                  display: document.getElementById(`${item.id}-display`)?.checked || false
              };
              return acc;
          }, {}),

          // Name box
          nameBoxX: document.getElementById("nameBoxX").value,
          nameBoxY: document.getElementById("nameBoxY").value,
          nameBoxWidth: document.getElementById("nameBoxWidth").value,
          nameBoxHeight: document.getElementById("nameBoxHeight").value,
          nameBgColor: document.getElementById("nameBgHex").value || document.getElementById("nameBgColor").value,
          nameBgOpacity: document.getElementById("nameBgOpacity").value,

          // Text box
          textBoxX: document.getElementById("textBoxX").value,
          textBoxY: document.getElementById("textBoxY").value,
          textBoxWidth: document.getElementById("textBoxWidth").value,
          textBoxHeight: document.getElementById("textBoxHeight").value,
          textBgColor: document.getElementById("textBgHex").value || document.getElementById("textBgColor").value,
          textBgOpacity: document.getElementById("textBgOpacity").value,

          // Flavour box
          flavourBoxX: document.getElementById("flavourBoxX").value,
          flavourBoxY: document.getElementById("flavourBoxY").value,
          flavourBoxWidth: document.getElementById("flavourBoxWidth").value,
          flavourBoxHeight: document.getElementById("flavourBoxHeight").value,
          flavourBgColor: document.getElementById("flavourBgHex").value || document.getElementById("flavourBgColor").value,
          flavourBgOpacity: document.getElementById("flavourBgOpacity").value,

          // Artist box
          artistBoxX: document.getElementById("artistBoxX").value,
          artistBoxY: document.getElementById("artistBoxY").value,
          artistBoxWidth: document.getElementById("artistBoxWidth").value,
          artistBoxHeight: document.getElementById("artistBoxHeight").value,
          artistBgColor: document.getElementById("artistBgHex").value || document.getElementById("artistBgColor").value,
          artistBgOpacity: document.getElementById("artistBgOpacity").value,

          // Original art source
          originalArtSrc: originalArtSrc
      };

      // Convert the template to JSON and trigger download
      const jsonStr = JSON.stringify(template, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "card_template.json";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
  }

  function importJSONFile(file) {
      const reader = new FileReader();
      reader.onload = function (event) {
          try {
              const template = JSON.parse(event.target.result);

              // Update general card properties
              document.getElementById("cardName").value = template.cardName || "";
              document.getElementById("nameFont").value = template.nameFont || "";
              document.getElementById("nameFontSize").value = template.nameFontSize || "";
              document.getElementById("cardType").value = template.cardType || "";
              document.getElementById("cardSubtype").value = template.cardSubtype || "";
              document.getElementById("cardText").value = template.cardText || "";
              document.getElementById("textFont").value = template.textFont || "";
              document.getElementById("textFontSize").value = template.textFontSize || "";
              document.getElementById("textBoxX").value = template.textBoxX || "";
              document.getElementById("textBoxY").value = template.textBoxY || "";
              document.getElementById("textBoxWidth").value = template.textBoxWidth || "";
              document.getElementById("textBoxHeight").value = template.textBoxHeight || "";
              document.getElementById("textBgHex").value = template.textBgColor || "";
              document.getElementById("textBgOpacity").value = template.textBgOpacity || "";
              document.getElementById("textHex").value = template.textColor || "";
              document.getElementById("flavourText").value = template.flavourText || "";
              document.getElementById("flavourFont").value = template.flavourFont || "";
              document.getElementById("flavourFontSize").value = template.flavourFontSize || "";
              document.getElementById("flavourTextHex").value = template.flavourTextColor || "";
              document.getElementById("artist").value = template.artist || "";
              document.getElementById("artistFont").value = template.artistFont || "";
              document.getElementById("artistFontSize").value = template.artistFontSize || "";
              document.getElementById("artistTextHex").value = template.artistTextColor || "";
              document.getElementById("offsetX").value = template.offsetX || "";
              document.getElementById("offsetY").value = template.offsetY || "";
              document.getElementById("cropTop").value = template.cropTop || "";
              document.getElementById("cropRight").value = template.cropRight || "";
              document.getElementById("cropBottom").value = template.cropBottom || "";
              document.getElementById("cropLeft").value = template.cropLeft || "";
              document.getElementById("scalePercent").value = template.scalePercent || "";
              document.getElementById("frameType").value = template.frameType || "";
              document.getElementById("canvasBgHex").value = template.canvasBgHex || "";

              // Update cost and capacity symbols
              document.getElementById("poolCost").value = template.poolCost || "";
              document.getElementById("poolCostToggle").checked = template.poolCostToggle || false;
              document.getElementById("bloodCost").value = template.bloodCost || "";
              document.getElementById("bloodCostToggle").checked = template.bloodCostToggle || false;
              document.getElementById("capacitySymbol").value = template.capacitySymbol || "";
              document.getElementById("lifeSymbol").value = template.lifeSymbol || "";

              // Update disciplines
              if (template.disciplines) {
                  Object.keys(template.disciplines).forEach(id => {
                      const discipline = template.disciplines[id];
                      const checkbox = document.getElementById(id);
                      const slider = document.querySelector(`.discipline-slider[data-current-tier][id="${id}"]`);
                      const displayCheckbox = document.getElementById(`${id}Display`);
                      const innateCheckbox = document.getElementById(`${id}Feature`);

                      if (checkbox) checkbox.checked = discipline.checked || false;
                      if (slider) slider.dataset.currentTier = discipline.tier || "0";
                      if (displayCheckbox) displayCheckbox.checked = discipline.display || false;
                      if (innateCheckbox) innateCheckbox.checked = discipline.innate || false;
                  });
              }

              // Update clans
              if (template.clans) {
                  Object.keys(template.clans).forEach(id => {
                      const clan = template.clans[id];
                      const checkbox = document.getElementById(id);
                      const displayCheckbox = document.getElementById(`${id}-display`);

                      if (checkbox) checkbox.checked = clan.checked || false;
                      if (displayCheckbox) displayCheckbox.checked = clan.display || false;
                  });
              }

              // Update name box
              document.getElementById("nameBoxX").value = template.nameBoxX || "";
              document.getElementById("nameBoxY").value = template.nameBoxY || "";
              document.getElementById("nameBoxWidth").value = template.nameBoxWidth || "";
              document.getElementById("nameBoxHeight").value = template.nameBoxHeight || "";
              document.getElementById("nameBgHex").value = template.nameBgColor || "";
              document.getElementById("nameBgOpacity").value = template.nameBgOpacity || "";

              // Update flavour box
              document.getElementById("flavourBoxX").value = template.flavourBoxX || "";
              document.getElementById("flavourBoxY").value = template.flavourBoxY || "";
              document.getElementById("flavourBoxWidth").value = template.flavourBoxWidth || "";
              document.getElementById("flavourBoxHeight").value = template.flavourBoxHeight || "";
              document.getElementById("flavourBgHex").value = template.flavourBgColor || "";
              document.getElementById("flavourBgOpacity").value = template.flavourBgOpacity || "";

              // Update artist box
              document.getElementById("artistBoxX").value = template.artistBoxX || "";
              document.getElementById("artistBoxY").value = template.artistBoxY || "";
              document.getElementById("artistBoxWidth").value = template.artistBoxWidth || "";
              document.getElementById("artistBoxHeight").value = template.artistBoxHeight || "";
              document.getElementById("artistBgHex").value = template.artistBgColor || "";
              document.getElementById("artistBgOpacity").value = template.artistBgOpacity || "";

              // Update the main art image
              if (template.originalArtSrc) {
                  originalArtSrc = template.wrapImgPath(originalArtSrc);
                  mainArtImage.src = originalArtSrc;
              }

              // Trigger a card update
              updateCard();
          } catch (error) {
              console.error("Error importing JSON:", error);
              alert("Failed to import JSON. Please check the file format.");
          }
      };
      reader.readAsText(file);
  } 
  
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
        originalArtSrc = event.target.result;
        mainArtImage.src = originalArtSrc;
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById("loadArtUrl").addEventListener("click", function () {
    const url = document.getElementById("artUrl").value;
    if (url) {
      originalArtSrc = url;
      mainArtImage.src = url;
    }
  });
  
  mainArtImage.onload = updateCard;
  
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
  // JSON Save and Import events.
  // -------------------------------
  document.getElementById("saveJsonButton").addEventListener("click", saveAsJSON);
  
  document.getElementById("importJsonButton").addEventListener("click", function () {
    document.getElementById("jsonImport").click();
  });
  
  document.getElementById("jsonImport").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      importJSONFile(e.target.files[0]);
    }
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
