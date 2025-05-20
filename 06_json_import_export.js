




  // -------------------------------
  // JSON Export/Import functions.
  // -------------------------------
  
  global.json.exportJson = function () {

      const template = {

          // General card properties
          mainSrc:                     global.art.mainSrc, // Store the original source
          cardName:                    document.getElementById("cardName").value,
          cardText:                    document.getElementById("cardText").value,
          cardFlavour:                 document.getElementById("cardFlavour").value,
          cardArtist:                  document.getElementById("cardArtist").value,
          cardMini:                    document.getElementById("cardMini").value,

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

          // Name Text Properties
          nameFont:                    document.getElementById("nameFont").value,
          nameFontSize:                document.getElementById("nameFontSize").value,
          nameHex:                     document.getElementById("nameHex").value,
          nameOpacity:                 document.getElementById("nameOpacity").value,
          nameEffect:                  document.querySelector('input[name="nameEffect"]:checked').value,
          nameBoxX:                    document.getElementById("nameBoxX").value,
          nameBoxY:                    document.getElementById("nameBoxY").value,
          nameBoxWidth:                document.getElementById("nameBoxWidth").value,
          nameBoxHeight:               document.getElementById("nameBoxHeight").value,
          nameBgHex:                   document.getElementById("nameBgHex").value,
          nameBgOpacity:               document.getElementById("nameBgOpacity").value,
          nameBgBorder:                document.getElementById("nameBgBorder").value,

          // Card Text Properties
          textFont:                    document.getElementById("textFont").value,
          textFontSize:                document.getElementById("textFontSize").value,
          textHex:                     document.getElementById("textHex").value,
          textOpacity:                 document.getElementById("textOpacity").value,
          textEffect:                  document.querySelector('input[name="textEffect"]:checked').value,
          textBoxX:                    document.getElementById("textBoxX").value,
          textBoxY:                    document.getElementById("textBoxY").value,
          textBoxWidth:                document.getElementById("textBoxWidth").value,
          textBoxHeight:               document.getElementById("textBoxHeight").value,
          textBgHex:                   document.getElementById("textBgHex").value,
          textBgOpacity:               document.getElementById("textBgOpacity").value,
          textBgBorder:                document.getElementById("textBgBorder").value,

          // Flavour Text Properties
          flavourFont:                 document.getElementById("flavourFont").value,
          flavourFontSize:             document.getElementById("flavourFontSize").value,
          flavourHex:                  document.getElementById("flavourHex").value,
          flavourOpacity:              document.getElementById("flavourOpacity").value,
          flavourEffect:               document.querySelector('input[name="flavourEffect"]:checked').value,
          flavourBoxX:                 document.getElementById("flavourBoxX").value,
          flavourBoxY:                 document.getElementById("flavourBoxY").value,
          flavourBoxWidth:             document.getElementById("flavourBoxWidth").value,
          flavourBoxHeight:            document.getElementById("flavourBoxHeight").value,
          flavourBgHex:                document.getElementById("flavourBgHex").value,
          flavourBgOpacity:            document.getElementById("flavourBgOpacity").value,
          flavourBgBorder:             document.getElementById("flavourBgBorder").value,

          // Artist Text Properties
          artistFont:                  document.getElementById("artistFont").value,
          artistFontSize:              document.getElementById("artistFontSize").value,
          artistHex:                   document.getElementById("artistHex").value,
          artistOpacity:               document.getElementById("artistOpacity").value,
          artistEffect:                document.querySelector('input[name="artistEffect"]:checked').value,
          artistBoxX:                  document.getElementById("artistBoxX").value,
          artistBoxY:                  document.getElementById("artistBoxY").value,
          artistBoxWidth:              document.getElementById("artistBoxWidth").value,
          artistBoxHeight:             document.getElementById("artistBoxHeight").value,
          artistBgHex:                 document.getElementById("artistBgHex").value,
          artistBgOpacity:             document.getElementById("artistBgOpacity").value,
          artistBgBorder:              document.getElementById("artistBgBorder").value,

          // Mini Text Properties
          miniFont:                    document.getElementById("miniFont").value,
          miniFontSize:                document.getElementById("miniFontSize").value,
          miniHex:                     document.getElementById("miniHex").value,
          miniOpacity:                 document.getElementById("miniOpacity").value,
          miniEffect:                  document.querySelector('input[name="miniEffect"]:checked').value,
          miniBoxX:                    document.getElementById("miniBoxX").value,
          miniBoxY:                    document.getElementById("miniBoxY").value,
          miniBoxWidth:                document.getElementById("miniBoxWidth").value,
          miniBoxHeight:               document.getElementById("miniBoxHeight").value,
          miniBgHex:                   document.getElementById("miniBgHex").value,
          miniBgOpacity:               document.getElementById("miniBgOpacity").value,
          miniBgBorder:                document.getElementById("miniBgBorder").value,

          // Costs and Symbols (Pool, Blood, Capacity, Life)
          poolSettings: {}, bloodSettings: {}, capacitySettings: {}, lifeSettings: {},

          // Disciplines
          disciplines: global.data.disciplineData.reduce((acc, item) => {
              acc[item.id] = { // Align the object properties
                  tier:   parseInt(document.querySelector(`.discipline-slider[data-current-tier][id="${item.id}"]`)?.dataset.currentTier || "0", 10),
                  innate: document.getElementById(`${item.id}Feature`)?.checked || false
              };
              return acc;
          }, {}),

          // Clans
          clans: global.data.clanData.reduce((acc, item) => {
              acc[item.id] = { // Align the object properties
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
          typeX: document.getElementById("typeX").value,
          typeY: document.getElementById("typeY").value,
          typeSize: document.getElementById("typeSize").value,
          typeSpacing: document.getElementById("typeSpacing").value,
          typeOrientation: document.getElementById("typeOrientation").checked,

          // Dark Pack Logo Settings
          darkPackToggle:                 document.getElementById("darkPackToggle").checked,
          darkPackX:                      document.getElementById("darkPackX").value,
          darkPackY:                      document.getElementById("darkPackY").value,
          darkPackH:                      document.getElementById("darkPackH").value,
          darkPackW:                      document.getElementById("darkPackW").value,
      };

      // Populate cost/capacity settings
      ["pool", "blood", "capacity", "life"].forEach(type => {
          template[`${type}Settings`] = {
              amount:     document.getElementById(`${type}Amount`).value,
              x:          document.getElementById(`${type}X`).value,
              y:          document.getElementById(`${type}Y`).value,
              size:       document.getElementById(`${type}Size`).value,
              textOffset: document.getElementById(`${type}TextOffset`).value,
              enable:     document.getElementById(`${type}Enable`).checked,
          };
      });

      // Convert the template to JSON and trigger download
      const jsonStr         = JSON.stringify(template, null, 2);
      const blob            = new Blob([jsonStr], { type: "application/json" });
      const url             = URL.createObjectURL(blob);
      const link            = document.createElement("a");
      link.download         = "card_template.json";
      link.href             = url;
      link.click();
      URL.revokeObjectURL(url);
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

              // Update general card properties
              setValue("cardName",      template.cardName);
              setValue("cardText",      template.cardText);
              setValue("cardFlavour",   template.cardFlavour);
              setValue("cardArtist",    template.cardArtist);
              setValue("cardMini",      template.cardMini);

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

              // Name Text Properties
              setValue("nameFont",        template.nameFont);
              setValue("nameFontSize",    template.nameFontSize);
              setValue("nameHex",         template.nameHex);
              if (get("nameColor") &&     template.nameHex) get("nameColor").value = template.nameHex; // Update color picker
              setValue("nameOpacity",     template.nameOpacity);
              if (template.nameEffect)    setRadio("nameEffect", template.nameEffect);
              setValue("nameBoxX",        template.nameBoxX);
              setValue("nameBoxY",        template.nameBoxY);
              setValue("nameBoxWidth",    template.nameBoxWidth);
              setValue("nameBoxHeight",   template.nameBoxHeight);
              setValue("nameBgHex",       template.nameBgHex);
              if (get("nameBgColor") &&   template.nameBgHex) get("nameBgColor").value = template.nameBgHex; // Update color picker
              setValue("nameBgOpacity",   template.nameBgOpacity);
              setValue("nameBgBorder",    template.nameBgBorder);

              // Card Text Properties
              setValue("textFont",        template.textFont);
              setValue("textFontSize",    template.textFontSize);
              setValue("textHex",         template.textHex);
              if (get("textColor") &&     template.textHex) get("textColor").value = template.textHex;
              setValue("textOpacity",     template.textOpacity);
              if (template.textEffect)    setRadio("textEffect", template.textEffect);
              setValue("textBoxX",        template.textBoxX);
              setValue("textBoxY",        template.textBoxY);
              setValue("textBoxWidth",    template.textBoxWidth);
              setValue("textBoxHeight",   template.textBoxHeight);
              setValue("textBgHex",       template.textBgHex);
              if (get("textBgColor") &&   template.textBgHex) get("textBgColor").value = template.textBgHex;
              setValue("textBgOpacity",   template.textBgOpacity);
              setValue("textBgBorder",    template.textBgBorder);

              // Flavour Text Properties
              setValue("flavourFont",     template.flavourFont);
              setValue("flavourFontSize", template.flavourFontSize);
              setValue("flavourHex",      template.flavourHex);
              if (get("flavourColor") &&  template.flavourHex) get("flavourColor").value = template.flavourHex;
              setValue("flavourOpacity",  template.flavourOpacity);
              if (template.flavourEffect) setRadio("flavourEffect", template.flavourEffect);
              setValue("flavourBoxX",     template.flavourBoxX);
              setValue("flavourBoxY",     template.flavourBoxY);
              setValue("flavourBoxWidth", template.flavourBoxWidth);
              setValue("flavourBoxHeight",template.flavourBoxHeight);
              setValue("flavourBgHex",    template.flavourBgHex);
              if (get("flavourBgColor") && template.flavourBgHex) get("flavourBgColor").value = template.flavourBgHex;
              setValue("flavourBgOpacity",template.flavourBgOpacity);
              setValue("flavourBgBorder", template.flavourBgBorder);

              // Artist Text Properties
              setValue("artistFont",      template.artistFont);
              setValue("artistFontSize",  template.artistFontSize);
              setValue("artistHex",       template.artistHex);
              if (get("artistColor") &&   template.artistHex) get("artistColor").value = template.artistHex;
              setValue("artistOpacity",   template.artistOpacity);

              if (template.artistEffect)  setRadio("artistEffect", template.artistEffect);

              setValue("artistBoxX",      template.artistBoxX);
              setValue("artistBoxY",      template.artistBoxY);
              setValue("artistBoxWidth",  template.artistBoxWidth);
              setValue("artistBoxHeight", template.artistBoxHeight);
              setValue("artistBgHex",     template.artistBgHex);
              if (get("artistBgColor") && template.artistBgHex) get("artistBgColor").value = template.artistBgHex;
              setValue("artistBgOpacity", template.artistBgOpacity);
              setValue("artistBgBorder",  template.artistBgBorder);

              // Mini Text Properties
              setValue("miniFont",        template.miniFont);
              setValue("miniFontSize",    template.miniFontSize);
              setValue("miniHex",         template.miniHex);

              if (get("miniColor") && template.miniHex) get("miniColor").value = template.miniHex;
              
              setValue("miniOpacity",     template.miniOpacity);

              if (template.miniEffect)    setRadio("miniEffect", template.miniEffect);

              setValue("miniBoxX",        template.miniBoxX);
              setValue("miniBoxY",        template.miniBoxY);
              setValue("miniBoxWidth",    template.miniBoxWidth);
              setValue("miniBoxHeight",   template.miniBoxHeight);
              setValue("miniBgHex",       template.miniBgHex);

              if (get("miniBgColor") && template.miniBgHex) get("miniBgColor").value = template.miniBgHex;

              setValue("miniBgOpacity",   template.miniBgOpacity);
              setValue("miniBgBorder",    template.miniBgBorder);

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
                  }
              });

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

              // Update the main art image
              if (template.mainSrc) {
                  global.art.mainSrc = template.mainSrc; // Use the src as is
                  global.art.mainImage.src = global.art.mainSrc;
              }

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
  