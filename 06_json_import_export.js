



  // Helper function to convert an Image object to Base64
  function imageToBase64(imgElement) {
    if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0 || imgElement.naturalHeight === 0) {
        // console.warn("imageToBase64: Image not loaded or no dimensions.", imgElement ? imgElement.src : 'No image element');
        return null;
    }
    // If the image source is already a data URL, just return it.
    if (imgElement.src && imgElement.src.startsWith('data:image')) {
        // console.log("imageToBase64: Source is already a data URL, returning it directly.", imgElement.src.substring(0, 30) + "...");
        return imgElement.src;
    }
    try {
        const canvas        = document.createElement('canvas');
        canvas.width        = imgElement.naturalWidth;
        canvas.height       = imgElement.naturalHeight;
        const ctx           = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0);

        // Prefer PNG for lossless, but check for very small dataURLs which might indicate an issue
        let dataURL         = canvas.toDataURL('image/png');
        if (dataURL.length < 200) { // Arbitrary small length, might indicate empty canvas from CORS issue
            // Fallback to JPEG with quality, might be better for photos if PNG was problematic
            dataURL         = canvas.toDataURL('image/jpeg', 0.90);
        }
        return dataURL;
    } catch (e) {
        console.error("Error converting image to Base64:", e, imgElement.src);
        global.util.showError(`Error converting image to Base64 (src: ${imgElement.src}). Check console for details. Image might be cross-origin restricted.`);
        return null;
    }
  }

  // -------------------------------
  // JSON Export/Import functions.
  // -------------------------------
  
  global.json.exportJson = function () {
      try {
          const template = {

              // General card properties
              mainSrc:                     global.art.mainSrc, // Store the original source
              // Art positioning and framing
              offsetX:                     document.getElementById("offsetX").value,
              offsetY:                     document.getElementById("offsetY").value,
              cropTop:                     document.getElementById("cropTop").value,
              cropRight:                   document.getElementById("cropRight").value,
              cropBottom:                  document.getElementById("cropBottom").value,
              cropLeft:                    document.getElementById("cropLeft").value,
              scalePercent:                document.getElementById("scalePercent").value,
              mainFrameValue:              document.getElementById("mainFrame").value,
              sidePanelValue:              document.getElementById("sidePanel").value,
              borderRadius:                document.getElementById("borderRadius").value,
              // Base64 image data
              mainImageBase64:             imageToBase64(global.art.mainImage),
              frameBgImageBase64:          imageToBase64(global.art.frameBgImage),
              uploadedFrameBase64:         imageToBase64(global.art.uploadedFrame),
              sidePanelImageBase64:        imageToBase64(global.art.sidePanelImage),
              
              textFields: {}, // Will be populated dynamically

              // Costs and Symbols (Pool, Blood, Capacity, Life)
              poolSettings: {}, bloodSettings: {}, capacitySettings: {}, lifeSettings: {},

              // Disciplines
              disciplines: global.data.disciplineData.reduce((acc, item) => {
                  acc[item.id] = {
                      tier:   parseInt(document.querySelector(`.discipline-slider[data-current-tier][id="${item.id}"]`)?.dataset.currentTier || "0", 10),
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

              // Discipline Global Settings
              disciplineX:                    document.getElementById("disciplineX").value,
              disciplineY:                    document.getElementById("disciplineY").value,
              disciplineSize:                 document.getElementById("disciplineSize").value,
              disciplineDiff:                 document.getElementById("disciplineDiff").value,
              disciplineSpacing:              document.getElementById("disciplineSpacing").value,
              disciplineSuperiorOffset:       document.getElementById("disciplineSuperiorOffset").value,
              disciplineOrientation:          document.getElementById("disciplineOrientation").checked,
              disciplineToggle:               document.getElementById("disciplineToggle").checked,
              disciplineToggleX:              document.getElementById("disciplineToggleX").value,
              disciplineToggleY:              document.getElementById("disciplineToggleY").value,
              disciplineToggleSize:           document.getElementById("disciplineToggleSize").value,
              disciplineToggleDiff:           document.getElementById("disciplineToggleDiff").value,
              disciplineToggleSpacing:        document.getElementById("disciplineToggleSpacing").value,
              disciplineToggleSuperiorOffset: document.getElementById("disciplineToggleSuperiorOffset").value,
              disciplineToggleOrientation:    document.getElementById("disciplineToggleOrientation").checked,

              // Clan Global Settings
              clanX:                          document.getElementById("clanX").value,
              clanY:                          document.getElementById("clanY").value,
              clanSize:                       document.getElementById("clanSize").value,
              clanSpacing:                    document.getElementById("clanSpacing").value,
              clanOffset:                     document.getElementById("clanOffset").value,
              clanOrientation:                document.getElementById("clanOrientation").checked,

              // Card Type Toggles & Global Settings
              cardTypesToggled: global.data.typeMap.reduce((acc, type) => {
                  acc[type.id] = document.getElementById(`${type.id}Toggle`).checked;
                  return acc;
              }, {}),
              typeX:                          document.getElementById("typeX").value,
              typeY:                          document.getElementById("typeY").value,
              typeSize:                       document.getElementById("typeSize").value,
              typeSpacing:                    document.getElementById("typeSpacing").value,
              typeOrientation:                document.getElementById("typeOrientation").checked,

              // Dark Pack Logo Settings
              darkPackToggle:                 document.getElementById("darkPackToggle").checked,
              darkPackX:                      document.getElementById("darkPackX").value,
              darkPackY:                      document.getElementById("darkPackY").value,
              darkPackH:                      document.getElementById("darkPackH").value,
              darkPackW:                      document.getElementById("darkPackW").value,
          };
          template.loadedSymbolImagesBase64 = {};
          template.uploadedSymbolImagesBase64 = {};

          // Populate text field properties dynamically
          if (global.data.textFieldConfigs && Array.isArray(global.data.textFieldConfigs)) {
              global.data.textFieldConfigs.forEach(config => {
                  const prefix = config.id_prefix;
                  const effectRadio = document.querySelector(`input[name="${prefix}_effect_radio"]:checked`);

                  template.textFields[prefix] = {
                      text:           document.getElementById(`${prefix}_input`)?.value || "",
                      fontFamily:     document.getElementById(`${prefix}_font_select`)?.value || "Arial",
                      fontSize:       document.getElementById(`${prefix}_font_size_select`)?.value || "12",
                      colorHex:       document.getElementById(`${prefix}_text_color_hex`)?.value || "#000000",
                      opacity:        document.getElementById(`${prefix}_text_opacity_input`)?.value || "100",
                      effect:         effectRadio ? effectRadio.value : "0",
                      boxX:           document.getElementById(`${prefix}_box_x_input`)?.value || "0",
                      boxY:           document.getElementById(`${prefix}_box_y_input`)?.value || "0",
                      boxWidth:       document.getElementById(`${prefix}_box_width_input`)?.value || "100",
                      boxHeight:      document.getElementById(`${prefix}_box_height_input`)?.value || "20",
                      bgColorHex:     document.getElementById(`${prefix}_bg_color_hex`)?.value || "#FFFFFF",
                      bgOpacity:      document.getElementById(`${prefix}_bg_opacity_input`)?.value || "0",
                      bgBorder:       document.getElementById(`${prefix}_bg_border_input`)?.value || "0",
                  };
              });
          }
          // Populate cost/capacity settings
          ["pool", "blood", "capacity", "life"].forEach(type => {
              template[`${type}Settings`] = {
                  amount:     document.getElementById(`${type}Amount`).value,
                  x:          document.getElementById(`${type}X`).value,
                  y:          document.getElementById(`${type}Y`).value,
                  size:       document.getElementById(`${type}Size`).value,
                  textOffset: document.getElementById(`${type}TextOffset`).value,
                  enable:     document.getElementById(`${type}Enable`).checked,
                  iconSelect: document.getElementById(`${type}IconSelect`)?.value || `symbol_${type}`,
                  valueFontSize: document.getElementById(`${type}ValueFontSize`)?.value || "18",
              };
          });
          // Populate loaded symbol images base64
          if (global.art.loadedSymbolImages) {
            Object.keys(global.art.loadedSymbolImages).forEach(key => {
                const img = global.art.loadedSymbolImages[key];
                const base64 = imageToBase64(img);
                if (base64) template.loadedSymbolImagesBase64[key] = base64;
            });
          }
          // Populate uploaded symbol images base64
          if (global.art.uploadedSymbolImages) {
            Object.keys(global.art.uploadedSymbolImages).forEach(key => {
                const img = global.art.uploadedSymbolImages[key];
                const base64 = imageToBase64(img);
                if (base64) template.uploadedSymbolImagesBase64[key] = base64;
            });
          }

          // Convert the template to JSON and trigger download
          const jsonStr         = JSON.stringify(template, null, 2);
          const blob            = new Blob([jsonStr], { type: "application/json" });
          const url             = URL.createObjectURL(blob);
          const link            = document.createElement("a");
          link.download         = "card_template.json";
          link.href             = url;
          link.click();
          URL.revokeObjectURL(url);
      } catch (error) {
          console.error("Error exporting JSON:", error);
          global.util.showError("Failed to export card data to JSON. " + error.message);
      }
  };



 // -------------------------------
 // JSON Import functions.
 // -------------------------------  
 global.json.importJson = function (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
          try {
              const template = JSON.parse(event.target.result);
              const get = (id) => document.getElementById(id); // Helper

              // Helper to set value if element exists
              const setValue = (id, value, defaultValue = "") => {
                  const el = get(id);
                  if (el) el.value = value !== undefined ? value : defaultValue;
              };
              const setChecked = (id, value, defaultValue = false) => {
                  const el = get(id);
                  if (el) el.checked = value !== undefined ? value : defaultValue;
              };
              const setRadio = (name, value) => {
                  const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
                  if (el) el.checked = true;
              };

              // Art positioning and framing
              setValue("offsetX",       template.offsetX);
              setValue("offsetY",       template.offsetY);
              setValue("cropTop",       template.cropTop);
              setValue("cropRight",     template.cropRight);
              setValue("cropBottom",    template.cropBottom);
              setValue("cropLeft",      template.cropLeft);
              setValue("scalePercent",  template.scalePercent);
              setValue("mainFrame",     template.mainFrameValue);
              setValue("sidePanel",     template.sidePanelValue);
              setValue("borderRadius",  template.borderRadius);

              // Load main art image from Base64 if available, else from src
              if (template.mainImageBase64) {
                  global.art.mainImage.src = template.mainImageBase64;
                  global.art.mainSrc = template.mainImageBase64; // Update mainSrc to the base64 data
              } else if (template.mainSrc) {
                  global.art.mainSrc = template.mainSrc;
                  global.art.mainImage.src = global.art.mainSrc;
              }
              // Load frame and side panel from Base64 if available
              // Note: The dropdowns for mainFrame and sidePanel will still be set,
              // potentially re-triggering loads from frameMap if base64 isn't used or fails.
              if (template.frameBgImageBase64)   {     global.art.frameBgImage.src     = template.frameBgImageBase64;   }
              if (template.uploadedFrameBase64)  {     global.art.uploadedFrame.src    = template.uploadedFrameBase64;  }
              if (template.sidePanelImageBase64) {     global.art.sidePanelImage.src   = template.sidePanelImageBase64; }

              // Import text field properties
              if (template.textFields) {
                  Object.keys(template.textFields).forEach(prefix => {
                      const props = template.textFields[prefix];
                      if (props) {
                          setValue(`${prefix}_input`, props.text);
                          setValue(`${prefix}_font_select`, props.fontFamily);
                          setValue(`${prefix}_font_size_select`, props.fontSize);
                          setValue(`${prefix}_text_color_hex`, props.colorHex);
                          if (get(`${prefix}_text_color_picker`) && props.colorHex) get(`${prefix}_text_color_picker`).value = props.colorHex;
                          setValue(`${prefix}_text_opacity_input`, props.opacity);
                          if (props.effect) setRadio(`${prefix}_effect_radio`, props.effect);
                          setValue(`${prefix}_box_x_input`, props.boxX);
                          setValue(`${prefix}_box_y_input`, props.boxY);
                          setValue(`${prefix}_box_width_input`, props.boxWidth);
                          setValue(`${prefix}_box_height_input`, props.boxHeight);
                          setValue(`${prefix}_bg_color_hex`, props.bgColorHex);
                          if (get(`${prefix}_bg_color_picker`) && props.bgColorHex) get(`${prefix}_bg_color_picker`).value = props.bgColorHex;
                          setValue(`${prefix}_bg_opacity_input`, props.bgOpacity);
                          setValue(`${prefix}_bg_border_input`, props.bgBorder);
                      }
                  });
              }

              // Costs and Symbols
              ["pool", "blood", "capacity", "life"].forEach(type => {
                  if (template[`${type}Settings`]) {
                      const settings = template[`${type}Settings`];
                      setValue(`${type}Amount`,     settings.amount);
                      setValue(`${type}X`,          settings.x);
                      setValue(`${type}Y`,          settings.y);
                      setValue(`${type}Size`,       settings.size);
                      setValue(`${type}TextOffset`, settings.textOffset);
                      setChecked(`${type}Enable`,   settings.enable);
                      setValue(`${type}IconSelect`, settings.iconSelect);
                      setValue(`${type}ValueFontSize`, settings.valueFontSize);
                  }
              });

              // Load pre-defined symbol images from Base64
              if (template.loadedSymbolImagesBase64) {
                Object.keys(template.loadedSymbolImagesBase64).forEach(key => {
                    const base64 = template.loadedSymbolImagesBase64[key];
                    if (base64) {
                        if (!global.art.loadedSymbolImages[key]) {
                            global.art.loadedSymbolImages[key] = new Image();
                        }
                        const img = global.art.loadedSymbolImages[key];
                        // Ensure onload/onerror are set for updateCard and error reporting
                        img.onload = () => {
                            // console.log(`Symbol image "${key}" loaded from Base64 during import.`);
                            if (typeof updateCard === 'function') updateCard();
                        };
                        img.onerror = () => {
                            global.util.showError(`Failed to load symbol image "${key}" from Base64 data during import.`);
                            img.src = ""; // Clear src to prevent broken image icon
                        };
                        img.src = base64;
                    }
                });
              }
              // Load uploaded symbol images from Base64
              if (template.uploadedSymbolImagesBase64) {
                Object.keys(template.uploadedSymbolImagesBase64).forEach(key => {
                    // For uploaded symbols, always create a new Image object or overwrite
                    const base64 = template.uploadedSymbolImagesBase64[key];
                    if (base64) {
                        global.art.uploadedSymbolImages[key] = new Image();
                        const img = global.art.uploadedSymbolImages[key];
                        img.onload = () => {
                            // console.log(`Custom uploaded symbol image "${key}" loaded from Base64 during import.`);
                            if (typeof updateCard === 'function') updateCard();
                        };
                        img.onerror = () => {
                            global.util.showError(`Failed to load custom uploaded symbol image "${key}" from Base64 data during import.`);
                            img.src = ""; // Clear src
                        };
                        img.src = base64;
                    }
                });
              }

              // Note: For global.art.mainImage, frameBgImage, uploadedFrame, sidePanelImage:
              // Their .onload and .onerror handlers should be set globally in 10_script.js.
              // When their .src is assigned a Base64 string here, those global handlers
              // will manage calling updateCard() or showing errors.

              // Update disciplines
              if (template.disciplines) {
                  Object.keys(template.disciplines).forEach(id => {
                      const discipline = template.disciplines[id];
                      // const checkbox = document.getElementById(id); // Not used
                      const slider = document.querySelector(`.discipline-slider[data-current-tier][id="${id}"]`);
                      const innateCheckbox = document.getElementById(`${id}Feature`);

                      if (slider && discipline.tier !== undefined) {
                          const tier =          String(discipline.tier || "0");
                          slider.dataset.currentTier = tier;
                          slider.className = `discipline-slider tier-${tier}`; // Update visual state
                      }
                      if (innateCheckbox && discipline.innate !== undefined) innateCheckbox.checked = discipline.innate;
                  });
              }

              // Update clans
              if (template.clans) {
                  Object.keys(template.clans).forEach(id => {
                      const clan = template.clans[id];
                      const mainCheckbox = document.getElementById(id);
                      const displayCheckbox = document.getElementById(`${id}-display`);

                      if (mainCheckbox && clan.checked !== undefined) mainCheckbox.checked = clan.checked;
                      if (displayCheckbox && clan.display !== undefined) displayCheckbox.checked = clan.display;
                  });
              }

              // Discipline Global Settings
              setValue("disciplineX",                    template.disciplineX);
              setValue("disciplineY",                    template.disciplineY);
              setValue("disciplineSize",                 template.disciplineSize);
              setValue("disciplineDiff",                 template.disciplineDiff);
              setValue("disciplineSpacing",              template.disciplineSpacing);
              setValue("disciplineSuperiorOffset",       template.disciplineSuperiorOffset);
              setChecked("disciplineOrientation",        template.disciplineOrientation);
              setChecked("disciplineToggle",             template.disciplineToggle);
              setValue("disciplineToggleX",              template.disciplineToggleX);
              setValue("disciplineToggleY",              template.disciplineToggleY);
              setValue("disciplineToggleSize",           template.disciplineToggleSize);
              setValue("disciplineToggleDiff",           template.disciplineToggleDiff);
              setValue("disciplineToggleSpacing",        template.disciplineToggleSpacing);
              setValue("disciplineToggleSuperiorOffset", template.disciplineToggleSuperiorOffset);
              setChecked("disciplineToggleOrientation",  template.disciplineToggleOrientation);

              // Clan Global Settings
              setValue("clanX",             template.clanX);
              setValue("clanY",             template.clanY);
              setValue("clanSize",          template.clanSize);
              setValue("clanSpacing",       template.clanSpacing);
              setValue("clanOffset",        template.clanOffset);
              setChecked("clanOrientation", template.clanOrientation);

              // Card Type Toggles & Global Settings
              if (template.cardTypesToggled) {
                  global.data.typeMap.forEach(type => {
                      if (template.cardTypesToggled[type.id] !== undefined) {
                          setChecked(`${type.id}Toggle`,  template.cardTypesToggled[type.id]);
                      }
                  });
              }
              setValue("typeX",             template.typeX);
              setValue("typeY",             template.typeY);
              setValue("typeSize",          template.typeSize);
              setValue("typeSpacing",       template.typeSpacing);
              setChecked("typeOrientation", template.typeOrientation);

              // Dark Pack Logo Settings
              setChecked("darkPackToggle",template.darkPackToggle);
              setValue("darkPackX",       template.darkPackX);
              setValue("darkPackY",       template.darkPackY);
              setValue("darkPackH",       template.darkPackH);
              setValue("darkPackW",       template.darkPackW);

              // Trigger a card update
              updateCard();
          } catch (error) {
              console.error("Error importing JSON:", error);
              global.util.showError("Failed to import JSON.", error.message);
              alert("Failed to import JSON. Please check the file format.");
          }
      };
      reader.readAsText(file);
  } 
  