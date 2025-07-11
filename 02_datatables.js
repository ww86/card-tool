




    // -------------------------------
    // Data tables & Maps
    // -------------------------------

    global.data = {

        availableFonts : [
            { name: "Verdana",              displayName: "Verdana" },
            { name: "Helvetica",            displayName: "Helvetica" },
            { name: "Times New Roman",      displayName: "Times New Roman" },
            { name: "Georgia",              displayName: "Georgia" },
            { name: "Courier New",          displayName: "Courier New" },
            { name: "Tahoma",               displayName: "Tahoma" },
            { name: "Copperplate Gothic",   displayName: "Copperplate Gothic" },

            // Fonts imported via files (as per @font-face in index.html)
            { name: "Manuskript Gothisch",  displayName: "Manuskript Gothisch" },
            { name: "Gill Sans MT",         displayName: "Gill Sans MT" },
            { name: "Malkavian Font",       displayName: "Malkavian Font" },                 
            { name: "GF Ordner Normal",     displayName: "GF Ordner" },                          

            // Imported Google Fonts (as per <link> tags in index.html)
            { name: "Tangerine",            displayName: "Tangerine" },
            { name: "Vollkorn SC",          displayName: "Vollkorn SC" },
            { name: "Cinzel",               displayName: "Cinzel" },
            { name: "Cormorant Garamond",   displayName: "Cormorant Garamond" },
            { name: "UnifrakturMaguntia",   displayName: "UnifrakturMaguntia" },
            { name: "Dai Banna SIL",        displayName: "Dai Banna SIL" },
            { name: "Crimson Text",         displayName: "Crimson Text" },
            { name: "My Soul",              displayName: "My Soul" },
            { name: "Ballet",               displayName: "Ballet" },
            { name: "Beau Rivage",          displayName: "Beau Rivage" },
            { name: "Imperial Script",      displayName: "Imperial Script" },
        ],

        // textFieldPanelStructure defines the generic layout and control types for a single text customization panel.
        // This structure will be used for each of the 5 text field instances.
        textFieldPanelStructure: [
            // Main text input (name, rules, flavour, etc.)
            { name: "input",                label: "Text:",         type: "text_or_textarea", placeholder_suffix: " Text" }, 

            { name: "font_select",          label: "Font:",         type: "select",           options_source: "availableFonts" },
            { name: "font_size_select",     label: "Size:",         type: "select",           options_values: [5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 60, 72] },
            { name: "text_color_picker",    label: "",              type: "color" },
            { name: "text_color_hex",       label: "#:",            type: "hex" },
            { name: "text_opacity_input",   label: "α:",            type: "number",           min: 0,    max: 100 },
            { name: "effect_radio",         label: "FX:",           type: "radio_group",      options_count: 7, radio_name_suffix: "_effect_radio" }, // 0-6

            { name: "box_x_input",          label: "X:",            type: "number" },
            { name: "box_y_input",          label: "Y:",            type: "number" },
            { name: "box_width_input",      label: "W:",            type: "number" },
            { name: "box_height_input",     label: "H:",            type: "number" },
            { name: "bg_color_picker",      label: "",              type: "color" },
            { name: "bg_color_hex",         label: "#:",            type: "hex" },
            { name: "bg_opacity_input",     label: "α:",            type: "number",           min: 0,    max: 100 },
            { name: "bg_border_input",      label: "B:",            type: "number",           min: 0 } // max will be per-instance
        ],


        // The 'id_prefix' corresponds to the panel, and other keys match 'name' from textFieldPanelStructure,

        textFieldHeaderDefaults: [
            // id_prefix | label        | type     | placeholder      | value
            { id_prefix: "title", label: "Name:",        type: "textarea",      placeholder: "Card Name",      value: "" },
            { id_prefix: "specs", label: "Card Text:",   type: "textarea",      placeholder: "Card Text",      value: "" },
            { id_prefix: "story", label: "Flavour:",     type: "textarea",      placeholder: "Card Flavour",   value: "" },
            { id_prefix: "illus", label: "Artist:",      type: "textarea",      placeholder: "Card Artist",    value: "" },
            { id_prefix: "small", label: "Mini:",        type: "textarea",      placeholder: "Mini type text", value: "" },
            { id_prefix: "subhd", label: "Subheader:",   type: "textarea",      placeholder: "Subheader text", value: "" },
            { id_prefix: "misc1", label: "Misc 1:",      type: "textarea",      placeholder: "Misc text",      value: "" },
            { id_prefix: "misc2", label: "Misc 2:",      type: "textarea",      placeholder: "Misc text",      value: "" }
        ],

        // textFieldFontDefaults: Default values for font, size, color, opacity, and effect for each text field panel.
        textFieldFontDefaults: [
            // id_prefix        | family                  | size      | color           | hex           | opacity     | effect
            { id_prefix: "title", family: "Vollkorn SC",    size: "20", color: "#FFFFFF", hex: "#FFFFFF", opacity: 100, effect: "5" },
            { id_prefix: "specs", family: "Gill Sans MT",   size: "14", color: "#000000", hex: "#000000", opacity: 100, effect: "2" },
            { id_prefix: "story", family: "Tangerine",      size: "18", color: "#000000", hex: "#000000", opacity: 100, effect: "2" },
            { id_prefix: "illus", family: "Vollkorn SC",    size: "12", color: "#FFFFFF", hex: "#FFFFFF", opacity: 100, effect: "5" },
            { id_prefix: "small", family: "Verdana",        size: "8",  color: "#FFFFFF", hex: "#FFFFFF", opacity: 100, effect: "2" },
            { id_prefix: "subhd", family: "Verdana",        size: "10", color: "#FFFFFF", hex: "#FFFFFF", opacity: 100, effect: "5" },
            { id_prefix: "misc1", family: "Verdana",        size: "10", color: "#FFFFFF", hex: "#FFFFFF", opacity: 100, effect: "5" },
            { id_prefix: "misc2", family: "Verdana",        size: "10", color: "#FFFFFF", hex: "#FFFFFF", opacity: 100, effect: "5" }
        ],

        // textFieldBackgroundDefaults: Default values for position, dimensions, color, opacity, and border for each text field panel.
        textFieldBgDefaults: [
            // id_prefix | x   | y   | width | height | color     | hex       | opacity | border | border_max
            { id_prefix: "title", x: 22,  y: 15,  width: 296, height: 28,  color: "#FFFFFF", hex: "#FFFFFF", opacity: 0,   border: 0, border_max: 4 },
            { id_prefix: "specs", x: 74,  y: 315, width: 264, height: 160, color: "#FFFFFF", hex: "#FFFFFF", opacity: 50,  border: 0, border_max: 4 },
            { id_prefix: "story", x: 185, y: 432, width: 150, height: 40,  color: "#FFFFFF", hex: "#FFFFFF", opacity: 0,   border: 0, border_max: 4 },
            { id_prefix: "illus", x: 53,  y: 474, width: 296, height: 17,  color: "#000000", hex: "#000000", opacity: 0,   border: 0, border_max: 4 },
            { id_prefix: "small", x: 13,  y: 108, width: 44,  height: 40,  color: "#FFFFFF", hex: "#FFFFFF", opacity: 0,   border: 0, border_max: 4 },
            { id_prefix: "subhd", x: 22,  y: 40,  width: 296, height: 28,  color: "#FFFFFF", hex: "#FFFFFF", opacity: 0,   border: 0, border_max: 4 },
            { id_prefix: "misc1", x: 13,  y: 108, width: 44,  height: 40,  color: "#FFFFFF", hex: "#FFFFFF", opacity: 0,   border: 0, border_max: 4 },            
            { id_prefix: "misc2", x: 13,  y: 108, width: 44,  height: 40,  color: "#FFFFFF", hex: "#FFFFFF", opacity: 0,   border: 0, border_max: 4 }
        ],

        // textFieldConfigs is now just a list of the prefixes, used to iterate through panels.
        // The actual structure and defaults are in the separate tables above.
        textFieldConfigs: [
            { id_prefix: "title" },
            { id_prefix: "specs" },
            { id_prefix: "story" },
            { id_prefix: "illus" },
            { id_prefix: "small" },
            { id_prefix: "subhd" },
            { id_prefix: "misc1" },
            { id_prefix: "misc2" }
        ],


        symbolIconConfigs: [
            {
                id_prefix: "pool",
                displayName: "Pool",
                settings: [
                    // --- Row 1: Position, Size, Value, Toggle ---
                    { id_suffix: "X",          type: "number",   label: "X:",      defaultValue: 18,  min: 0,   max: 358, uiRow: 1 },
                    { id_suffix: "Y",          type: "number",   label: "Y:",      defaultValue: 380, min: 0,   max: 500, uiRow: 1 },
                    { id_suffix: "Size",       type: "number",   label: "Size:",   defaultValue: 38,  min: 10,  max: 100, uiRow: 1 },
                    { id_suffix: "TextOffset", type: "number",   label: "Offset:", defaultValue: 0,   min: -10, max: 40,  uiRow: 1 },
                    { id_suffix: "Amount",     type: "number",   label: "Amount:", defaultValue: 0,   min: 0,   max: 20,  uiRow: 1 },
                    { id_suffix: "Shadow",     type: "checkbox", label: "Sh:",     defaultValue: false,                   uiRow: 1 },
                    { id_suffix: "Enable",     type: "checkbox", label: "I/O:",    defaultValue: false,                   uiRow: 1 },                    

                    // --- Row 2: Icon Select, Icon Upload, Value Font Size ---
                    {
                        id_suffix: "IconSelect",
                        label: "Icon:",
                        type: "select",
                        uiRow: 2,
                        options: [ // Values should match keys in global.data.symbolMap or be special
                            { value: "symbol_pool",             text: "Pool (Default)"      },
                            { value: "symbol_pool_alt_01",      text: "Alternative Icon"    },
                            { value: "custom_upload",           text: "Custom (Upload)"     } 
                        ],
                        defaultValue: "symbol_pool"
                    },
                    {
                        id_suffix: "IconUpload",
                        label: "Upload:",
                        type: "file",
                        uiRow: 2
                        // No defaultValue for file inputs
                    },
                    {
                        id_suffix: "ValueFontSize",
                        label: "Font:",
                        type: "number",
                        defaultValue: 18, // Default font size for the number on the symbol
                        min: 8, max: 48,
                        uiRow: 2
                    }
                ]
            },
            {
                id_prefix: "blood",
                displayName: "Blood",
                settings: [
                    // --- Row 1 ---
                    { id_suffix: "X",          type: "number",   label: "X:",      defaultValue: 12,  min: 0,   max: 358, uiRow: 1 },
                    { id_suffix: "Y",          type: "number",   label: "Y:",      defaultValue: 380, min: 0,   max: 500, uiRow: 1 },
                    { id_suffix: "Size",       type: "number",   label: "Size:",   defaultValue: 50,  min: 10,  max: 100, uiRow: 1 },
                    { id_suffix: "TextOffset", type: "number",   label: "Offset:", defaultValue: 8,   min: -10, max: 40,  uiRow: 1 },
                    { id_suffix: "Amount",     type: "number",   label: "Amount:", defaultValue: 0,   min: 0,   max: 20,  uiRow: 1 },
                    { id_suffix: "Shadow",     type: "checkbox", label: "Sh:",     defaultValue: false,                   uiRow: 1 },
                    { id_suffix: "Enable",     type: "checkbox", label: "I/O:",    defaultValue: false,                   uiRow: 1 },                    
                    // --- Row 2 ---
                    {
                        id_suffix: "IconSelect", label: "Icon:", type: "select", uiRow: 2,
                        options: [
                            { value: "symbol_blood",            text: "Blood (Default)" },
                            { value: "symbol_blood_alt_01",     text: "Alternative Icon" },
                            { value: "custom_upload",           text: "Custom (Upload)" }
                        ], defaultValue: "symbol_blood"
                    },
                    { id_suffix: "IconUpload", label: "Upload:", type: "file", uiRow: 2 },
                    { id_suffix: "ValueFontSize", label: "Font:", type: "number", defaultValue: 18, min: 8, max: 48, uiRow: 2 }
                ]
            },
            {
                id_prefix: "capacity",
                displayName: "Capacity",
                settings: [
                    // --- Row 1 ---
                    { id_suffix: "X",          type: "number",   label: "X:",      defaultValue: 300, min: 0,   max: 358, uiRow: 1 },
                    { id_suffix: "Y",          type: "number",   label: "Y:",      defaultValue: 420, min: 0,   max: 500, uiRow: 1 },
                    { id_suffix: "Size",       type: "number",   label: "Size:",   defaultValue: 33,  min: 10,  max: 100, uiRow: 1 },
                    { id_suffix: "TextOffset", type: "number",   label: "Offset:", defaultValue: 2,   min: -10, max: 40,  uiRow: 1 },
                    { id_suffix: "Amount",     type: "number",   label: "Amount:", defaultValue: 0,   min: 0,   max: 20,  uiRow: 1 },
                    { id_suffix: "Shadow",     type: "checkbox", label: "Sh:",     defaultValue: false,                   uiRow: 1 },
                    { id_suffix: "Enable",     type: "checkbox", label: "I/O:",    defaultValue: false,                   uiRow: 1 },                    
                    // --- Row 2 ---
                    {
                        id_suffix: "IconSelect", label: "Icon:", type: "select", uiRow: 2,
                        options: [
                            { value: "symbol_capacity",         text: "Capacity (Default)" },
                            { value: "symbol_capacity_alt_01",  text: "Alternative Icon" },
                            { value: "custom_upload",           text: "Custom (Upload)" }
                        ], defaultValue: "symbol_capacity"
                    },
                    { id_suffix: "IconUpload", label: "Upload:", type: "file", uiRow: 2 },
                    { id_suffix: "ValueFontSize", label: "Font:", type: "number", defaultValue: 18, min: 8, max: 48, uiRow: 2 }
                ]
            },
            {
                id_prefix: "life",
                displayName: "Life",
                settings: [
                    // --- Row 1 ---
                    { id_suffix: "X",          type: "number",   label: "X:",      defaultValue: 12,  min: 0,   max: 358, uiRow: 1 },
                    { id_suffix: "Y",          type: "number",   label: "Y:",      defaultValue: 300, min: 0,   max: 500, uiRow: 1 },
                    { id_suffix: "Size",       type: "number",   label: "Size:",   defaultValue: 60,  min: 10,  max: 100, uiRow: 1 },
                    { id_suffix: "TextOffset", type: "number",   label: "Offset:", defaultValue: 8,   min: -10, max: 40,  uiRow: 1 },
                    { id_suffix: "Amount",     type: "number",   label: "Amount:", defaultValue: 0,   min: 0,   max: 20,  uiRow: 1 },
                    { id_suffix: "Shadow",     type: "checkbox", label: "Sh:",     defaultValue: false,                   uiRow: 1 },
                    { id_suffix: "Enable",     type: "checkbox", label: "I/O:",    defaultValue: false,                   uiRow: 1 },                    
                    // --- Row 2 ---
                    {
                        id_suffix: "IconSelect", label: "Icon:", type: "select", uiRow: 2,
                        options: [
                            { value: "symbol_life",             text: "Life (Default)" },
                            { value: "symbol_life_alt_01",      text: "Alternative Icon" },
                            { value: "custom_upload",           text: "Custom (Upload)" }
                        ], defaultValue: "symbol_life"
                    },
                    { id_suffix: "IconUpload", label: "Upload:", type: "file", uiRow: 2 },
                    { id_suffix: "ValueFontSize", label: "Font:", type: "number", defaultValue: 18, min: 8, max: 48, uiRow: 2 }
                ]
            },
            {
                id_prefix: "path",
                displayName: "Path",
                settings: [
                    // --- Row 1 ---
                    { id_suffix: "X",          type: "number",   label: "X:",      defaultValue: 12,  min: 0,   max: 358, uiRow: 1 },
                    { id_suffix: "Y",          type: "number",   label: "Y:",      defaultValue: 300, min: 0,   max: 500, uiRow: 1 },
                    { id_suffix: "Size",       type: "number",   label: "Size:",   defaultValue: 60,  min: 10,  max: 100, uiRow: 1 },
                    { id_suffix: "TextOffset", type: "number",   label: "Offset:", defaultValue: 8,   min: -10, max: 40,  uiRow: 1 },
                    { id_suffix: "Amount",     type: "number",   label: "Amount:", defaultValue: 0,   min: 0,   max: 20,  uiRow: 1 },
                    { id_suffix: "Shadow",     type: "checkbox", label: "Sh:",     defaultValue: false,                   uiRow: 1 },
                    { id_suffix: "Enable",     type: "checkbox", label: "I/O:",    defaultValue: false,                   uiRow: 1 },                    
                    // --- Row 2 ---
                    {
                        id_suffix: "IconSelect", label: "Icon:", type: "select", uiRow: 2,
                        options: [
                            { value: "symbol_path_01",          text: "Path of Caine"                           },
                            { value: "symbol_path_02",          text: "Path of Power and the Inner Voice"       },
                            { value: "symbol_path_03",          text: "Path of Cathari"                         },
                            { value: "symbol_path_04",          text: "Path of Death and the Soul"              },                                                        
                            { value: "custom_upload",           text: "Custom (Upload)"                         }
                        ], defaultValue: "symbol_path_01"
                    },
                    { id_suffix: "IconUpload", label: "Upload:", type: "file", uiRow: 2 },
                    { id_suffix: "ValueFontSize", label: "Font:", type: "number", defaultValue: 18, min: 8, max: 48, uiRow: 2 }
                ]
            }            
        ],

        disciplineData : [
            // Burn is here because of the default location(s) of the burn icon
            { id: "disciplineBurn",         label: "Burn",         img_1_src: "icon_discipline_Burn_inferior.png",         img_2_src: "icon_discipline_Burn_superior.png",         img_3_src: "icon_discipline_Burn_other.png",         img_4_src: "icon_discipline_Burn_inferior_innate.png",         img_5_src: "icon_discipline_Burn_superior_innate.png",         img_6_src: "icon_discipline_Burn_other_innate.png" },

            { id: "disciplineAbombwe",      label: "Abombwe",      img_1_src: "icon_discipline_abombwe_inferior.png",      img_2_src: "icon_discipline_abombwe_superior.png",      img_3_src: "icon_discipline_abombwe_other.png",      img_4_src: "icon_discipline_abombwe_inferior_innate.png",      img_5_src: "icon_discipline_abombwe_superior_innate.png",      img_6_src: "icon_discipline_abombwe_other_innate.png" },
            { id: "disciplineAuspex",       label: "Auspex",       img_1_src: "icon_discipline_auspex_inferior.png",       img_2_src: "icon_discipline_auspex_superior.png",       img_3_src: "icon_discipline_auspex_other.png",       img_4_src: "icon_discipline_auspex_inferior_innate.png",       img_5_src: "icon_discipline_auspex_superior_innate.png",       img_6_src: "icon_discipline_auspex_other_innate.png" },
            { id: "disciplineAnimalism",    label: "Animalism",    img_1_src: "icon_discipline_animalism_inferior.png",    img_2_src: "icon_discipline_animalism_superior.png",    img_3_src: "icon_discipline_animalism_other.png",    img_4_src: "icon_discipline_animalism_inferior_innate.png",    img_5_src: "icon_discipline_animalism_superior_innate.png",    img_6_src: "icon_discipline_animalism_other_innate.png" },
            { id: "disciplineCelerity",     label: "Celerity",     img_1_src: "icon_discipline_celerity_inferior.png",     img_2_src: "icon_discipline_celerity_superior.png",     img_3_src: "icon_discipline_celerity_other.png",     img_4_src: "icon_discipline_celerity_inferior_innate.png",     img_5_src: "icon_discipline_celerity_superior_innate.png",     img_6_src: "icon_discipline_celerity_other_innate.png" },
            { id: "disciplineChimerstry",   label: "Chimerstry",   img_1_src: "icon_discipline_chimerstry_inferior.png",   img_2_src: "icon_discipline_chimerstry_superior.png",   img_3_src: "icon_discipline_chimerstry_other.png",   img_4_src: "icon_discipline_chimerstry_inferior_innate.png",   img_5_src: "icon_discipline_chimerstry_superior_innate.png",   img_6_src: "icon_discipline_chimerstry_other_innate.png" },
            { id: "disciplineDaimonion",    label: "Daimonion",    img_1_src: "icon_discipline_daimonion_inferior.png",    img_2_src: "icon_discipline_daimonion_superior.png",    img_3_src: "icon_discipline_daimonion_other.png",    img_4_src: "icon_discipline_daimonion_inferior_innate.png",    img_5_src: "icon_discipline_daimonion_superior_innate.png",    img_6_src: "icon_discipline_daimonion_other_innate.png" },
            { id: "disciplineDementation",  label: "Dementation",  img_1_src: "icon_discipline_dementation_inferior.png",  img_2_src: "icon_discipline_dementation_superior.png",  img_3_src: "icon_discipline_dementation_other.png",  img_4_src: "icon_discipline_dementation_inferior_innate.png",  img_5_src: "icon_discipline_dementation_superior_innate.png",  img_6_src: "icon_discipline_dementation_other_innate.png" },
            { id: "disciplineDominate",     label: "Dominate",     img_1_src: "icon_discipline_dominate_inferior.png",     img_2_src: "icon_discipline_dominate_superior.png",     img_3_src: "icon_discipline_dominate_other.png",     img_4_src: "icon_discipline_dominate_inferior_innate.png",     img_5_src: "icon_discipline_dominate_superior_innate.png",     img_6_src: "icon_discipline_dominate_other_innate.png" },
            { id: "disciplineFortitude",    label: "Fortitude",    img_1_src: "icon_discipline_fortitude_inferior.png",    img_2_src: "icon_discipline_fortitude_superior.png",    img_3_src: "icon_discipline_fortitude_other.png",    img_4_src: "icon_discipline_fortitude_inferior_innate.png",    img_5_src: "icon_discipline_fortitude_superior_innate.png",    img_6_src: "icon_discipline_fortitude_other_innate.png" },
            { id: "disciplineMaleficia",    label: "Maleficia",    img_1_src: "icon_discipline_maleficia_inferior.png",    img_2_src: "icon_discipline_maleficia_superior.png",    img_3_src: "icon_discipline_maleficia_other.png",    img_4_src: "icon_discipline_maleficia_inferior_innate.png",    img_5_src: "icon_discipline_maleficia_superior_innate.png",    img_6_src: "icon_discipline_maleficia_other_innate.png" },
            { id: "disciplineMelpominee",   label: "Melpominee",   img_1_src: "icon_discipline_melpominee_inferior.png",   img_2_src: "icon_discipline_melpominee_superior.png",   img_3_src: "icon_discipline_melpominee_other.png",   img_4_src: "icon_discipline_melpominee_inferior_innate.png",   img_5_src: "icon_discipline_melpominee_superior_innate.png",   img_6_src: "icon_discipline_melpominee_other_innate.png" },
            { id: "disciplineMortis",       label: "Mortis",       img_1_src: "icon_discipline_mortis_inferior.png",       img_2_src: "icon_discipline_mortis_superior.png",       img_3_src: "icon_discipline_mortis_other.png",       img_4_src: "icon_discipline_mortis_inferior_innate.png",       img_5_src: "icon_discipline_mortis_superior_innate.png",       img_6_src: "icon_discipline_mortis_other_innate.png" },            
            { id: "disciplineMytherceria",  label: "Mytherceria",  img_1_src: "icon_discipline_mytherceria_inferior.png",  img_2_src: "icon_discipline_mytherceria_superior.png",  img_3_src: "icon_discipline_mytherceria_other.png",  img_4_src: "icon_discipline_mytherceria_inferior_innate.png",  img_5_src: "icon_discipline_mytherceria_superior_innate.png",  img_6_src: "icon_discipline_mytherceria_other_innate.png" },
            { id: "disciplineNecromancy",   label: "Necromancy",   img_1_src: "icon_discipline_necromancy_inferior.png",   img_2_src: "icon_discipline_necromancy_superior.png",   img_3_src: "icon_discipline_necromancy_other.png",   img_4_src: "icon_discipline_necromancy_inferior_innate.png",   img_5_src: "icon_discipline_necromancy_superior_innate.png",   img_6_src: "icon_discipline_necromancy_other_innate.png" },
            { id: "disciplineObeah",        label: "Obeah",        img_1_src: "icon_discipline_obeah_inferior.png",        img_2_src: "icon_discipline_obeah_superior.png",        img_3_src: "icon_discipline_obeah_other.png",        img_4_src: "icon_discipline_obeah_inferior_innate.png",        img_5_src: "icon_discipline_obeah_superior_innate.png",        img_6_src: "icon_discipline_obeah_other_innate.png" },
            { id: "disciplineObfuscate",    label: "Obfuscate",    img_1_src: "icon_discipline_obfuscate_inferior.png",    img_2_src: "icon_discipline_obfuscate_superior.png",    img_3_src: "icon_discipline_obfuscate_other.png",    img_4_src: "icon_discipline_obfuscate_inferior_innate.png",    img_5_src: "icon_discipline_obfuscate_superior_innate.png",    img_6_src: "icon_discipline_obfuscate_other_innate.png" },
            { id: "disciplineOblivion",     label: "Oblivion",     img_1_src: "icon_discipline_oblivion_inferior.png",     img_2_src: "icon_discipline_oblivion_superior.png",     img_3_src: "icon_discipline_oblivion_other.png",     img_4_src: "icon_discipline_oblivion_inferior_innate.png",     img_5_src: "icon_discipline_oblivion_superior_innate.png",     img_6_src: "icon_discipline_oblivion_other_innate.png" },            
            { id: "disciplineObtenebration",label: "Obtenebration",img_1_src: "icon_discipline_obtenebration_inferior.png",img_2_src: "icon_discipline_obtenebration_superior.png",img_3_src: "icon_discipline_obtenebration_other.png",img_4_src: "icon_discipline_obtenebration_inferior_innate.png",img_5_src: "icon_discipline_obtenebration_superior_innate.png",img_6_src: "icon_discipline_obtenebration_other_innate.png" },
            { id: "disciplinePotence",      label: "Potence",      img_1_src: "icon_discipline_potence_inferior.png",      img_2_src: "icon_discipline_potence_superior.png",      img_3_src: "icon_discipline_potence_other.png",      img_4_src: "icon_discipline_potence_inferior_innate.png",      img_5_src: "icon_discipline_potence_superior_innate.png",      img_6_src: "icon_discipline_potence_other_innate.png" },
            { id: "disciplinePresence",     label: "Presence",     img_1_src: "icon_discipline_presence_inferior.png",     img_2_src: "icon_discipline_presence_superior.png",     img_3_src: "icon_discipline_presence_other.png",     img_4_src: "icon_discipline_presence_inferior_innate.png",     img_5_src: "icon_discipline_presence_superior_innate.png",     img_6_src: "icon_discipline_presence_other_innate.png" },
            { id: "disciplineProtean",      label: "Protean",      img_1_src: "icon_discipline_protean_inferior.png",      img_2_src: "icon_discipline_protean_superior.png",      img_3_src: "icon_discipline_protean_other.png",      img_4_src: "icon_discipline_protean_inferior_innate.png",      img_5_src: "icon_discipline_protean_superior_innate.png",      img_6_src: "icon_discipline_protean_other_innate.png" },
            { id: "disciplineQuietus",      label: "Quietus",      img_1_src: "icon_discipline_quietus_inferior.png",      img_2_src: "icon_discipline_quietus_superior.png",      img_3_src: "icon_discipline_quietus_other.png",      img_4_src: "icon_discipline_quietus_inferior_innate.png",      img_5_src: "icon_discipline_quietus_superior_innate.png",      img_6_src: "icon_discipline_quietus_other_innate.png" },
            { id: "disciplineSanguinus",    label: "Sanguinus",    img_1_src: "icon_discipline_sanguinus_inferior.png",    img_2_src: "icon_discipline_sanguinus_superior.png",    img_3_src: "icon_discipline_sanguinus_other.png",    img_4_src: "icon_discipline_sanguinus_inferior_innate.png",    img_5_src: "icon_discipline_sanguinus_superior_innate.png",    img_6_src: "icon_discipline_sanguinus_other_innate.png" },
            { id: "disciplineSerpentis",    label: "Serpentis",    img_1_src: "icon_discipline_serpentis_inferior.png",    img_2_src: "icon_discipline_serpentis_superior.png",    img_3_src: "icon_discipline_serpentis_other.png",    img_4_src: "icon_discipline_serpentis_inferior_innate.png",    img_5_src: "icon_discipline_serpentis_superior_innate.png",    img_6_src: "icon_discipline_serpentis_other_innate.png" },
            { id: "disciplineSpiritus",     label: "Spiritus",     img_1_src: "icon_discipline_spiritus_inferior.png",     img_2_src: "icon_discipline_spiritus_superior.png",     img_3_src: "icon_discipline_spiritus_other.png",     img_4_src: "icon_discipline_spiritus_inferior_innate.png",     img_5_src: "icon_discipline_spiritus_superior_innate.png",     img_6_src: "icon_discipline_spiritus_other_innate.png" },
            { id: "disciplineStriga",       label: "Striga",       img_1_src: "icon_discipline_striga_inferior.png",       img_2_src: "icon_discipline_striga_superior.png",       img_3_src: "icon_discipline_striga_other.png",       img_4_src: "icon_discipline_striga_inferior_innate.png",       img_5_src: "icon_discipline_striga_superior_innate.png",       img_6_src: "icon_discipline_striga_other_innate.png" },
            { id: "disciplineTemporis",     label: "Temporis",     img_1_src: "icon_discipline_temporis_inferior.png",     img_2_src: "icon_discipline_temporis_superior.png",     img_3_src: "icon_discipline_temporis_other.png",     img_4_src: "icon_discipline_temporis_inferior_innate.png",     img_5_src: "icon_discipline_temporis_superior_innate.png",     img_6_src: "icon_discipline_temporis_other_innate.png" },
            { id: "disciplineThanatosis",   label: "Thanatosis",   img_1_src: "icon_discipline_thanatosis_inferior.png",   img_2_src: "icon_discipline_thanatosis_superior.png",   img_3_src: "icon_discipline_thanatosis_other.png",   img_4_src: "icon_discipline_thanatosis_inferior_innate.png",   img_5_src: "icon_discipline_thanatosis_superior_innate.png",   img_6_src: "icon_discipline_thanatosis_other_innate.png" },
            { id: "disciplineThaumaturgy",  label: "Thaumaturgy",  img_1_src: "icon_discipline_thaumaturgy_inferior.png",  img_2_src: "icon_discipline_thaumaturgy_superior.png",  img_3_src: "icon_discipline_thaumaturgy_other.png",  img_4_src: "icon_discipline_thaumaturgy_inferior_innate.png",  img_5_src: "icon_discipline_thaumaturgy_superior_innate.png",  img_6_src: "icon_discipline_thaumaturgy_other_innate.png" },
            { id: "disciplineValeren",      label: "Valeren",      img_1_src: "icon_discipline_valeren_inferior.png",      img_2_src: "icon_discipline_valeren_superior.png",      img_3_src: "icon_discipline_valeren_other.png",      img_4_src: "icon_discipline_valeren_inferior_innate.png",      img_5_src: "icon_discipline_valeren_superior_innate.png",      img_6_src: "icon_discipline_valeren_other_innate.png" },
            { id: "disciplineVicissitude",  label: "Vicissitude",  img_1_src: "icon_discipline_vicissitude_inferior.png",  img_2_src: "icon_discipline_vicissitude_superior.png",  img_3_src: "icon_discipline_vicissitude_other.png",  img_4_src: "icon_discipline_vicissitude_inferior_innate.png",  img_5_src: "icon_discipline_vicissitude_superior_innate.png",  img_6_src: "icon_discipline_vicissitude_other_innate.png" },
            { id: "disciplineVisceratika",  label: "Visceratika",  img_1_src: "icon_discipline_visceratika_inferior.png",  img_2_src: "icon_discipline_visceratika_superior.png",  img_3_src: "icon_discipline_visceratika_other.png",  img_4_src: "icon_discipline_visceratika_inferior_innate.png",  img_5_src: "icon_discipline_visceratika_superior_innate.png",  img_6_src: "icon_discipline_visceratika_other_innate.png" }
        ],

        clanData : [
            { id: "clanAhrimanes",             label: "Ahrimanes",             imgSrc: "icon_clan_ahrimanes.png",             image: new Image() },
            { id: "clanAkunanse",              label: "Akunanse",              imgSrc: "icon_clan_akunanse.png",              image: new Image() },
            { id: "clanAnda",                  label: "Anda",                  imgSrc: "icon_clan_anda.png",                  image: new Image() },
            { id: "clanAssamite",              label: "Assamite",              imgSrc: "icon_clan_assamite.png",              image: new Image() },
            { id: "clanBaali",                 label: "Baali",                 imgSrc: "icon_clan_baali.png",                 image: new Image() },
            { id: "clanBanuHaqim",             label: "Banu Haqim",            imgSrc: "icon_clan_banu_haqim.png",            image: new Image() },
            { id: "clanBloodBrothers",         label: "Blood Brothers",        imgSrc: "icon_clan_blood_brothers.png",        image: new Image() },
            { id: "clanBrujah",                label: "Brujah",                imgSrc: "icon_clan_brujah.png",                image: new Image() },
            { id: "clanBrujahAntitribu",       label: "Brujah Antitribu",      imgSrc: "icon_clan_brujah_antitribu.png",      image: new Image() },
            { id: "clanCaitiff",               label: "Caitiff",               imgSrc: "icon_clan_caitiff.png",               image: new Image() },
            { id: "clanCappadocian",           label: "Cappadocian",           imgSrc: "icon_clan_cappadocian.png",           image: new Image() },
            { id: "clanDaughtersOfCacophony",  label: "Daughters of Cacophony",imgSrc: "icon_clan_daughters_of_cacophony.png",image: new Image() },
            { id: "clanFollowersOfSet",        label: "Followers of Set",      imgSrc: "icon_clan_followers_of_set.png",      image: new Image() },
            { id: "clanGangrel",               label: "Gangrel",               imgSrc: "icon_clan_gangrel.png",               image: new Image() },
            { id: "clanGangrelAntitribu",      label: "Gangrel Antitribu",     imgSrc: "icon_clan_gangrel_antitribu.png",     image: new Image() },
            { id: "clanGargoyles",             label: "Gargoyles",             imgSrc: "icon_clan_gargoyles.png",             image: new Image() },
            { id: "clanGiovanni",              label: "Giovanni",              imgSrc: "icon_clan_giovanni.png",              image: new Image() },
            { id: "clanGuruhi",                label: "Guruhi",                imgSrc: "icon_clan_guruhi.png",                image: new Image() },
            { id: "clanHecata",                label: "Hecata",                imgSrc: "icon_clan_hecata.png",                image: new Image() },
            { id: "clanHarbringersOfSkulls",   label: "Harbingers of Skulls",  imgSrc: "icon_clan_harbringers_of_skulls.png", image: new Image() },
            { id: "clanIshtarri",              label: "Ishtarri",              imgSrc: "icon_clan_ishtarri.png",              image: new Image() },
            { id: "clanKiasyd",                label: "Kiasyd",                imgSrc: "icon_clan_kiasyd.png",                image: new Image() },
            { id: "clanKinyonyi",              label: "Kinyonyi",              imgSrc: "icon_clan_kinyonyi.png",              image: new Image() },
            { id: "clanLamia",                 label: "Lamia",                 imgSrc: "icon_clan_lamia.png",                 image: new Image() },
            { id: "clanLasombra",              label: "Lasombra",              imgSrc: "icon_clan_lasombra.png",              image: new Image() },
            { id: "clanMalkavian",             label: "Malkavian",             imgSrc: "icon_clan_malkavian.png",             image: new Image() },
            { id: "clanMalkavianAntitribu",    label: "Malkavian Antitribu",   imgSrc: "icon_clan_malkavian_antitribu.png",   image: new Image() },
            { id: "clanMinistry",              label: "Ministry",              imgSrc: "icon_clan_ministry.png",              image: new Image() },
            { id: "clanNagaraja",              label: "Nagaraja",              imgSrc: "icon_clan_nagaraja.png",              image: new Image() },
            { id: "clanNagloper",              label: "Nagloper",              imgSrc: "icon_clan_nagloper.png",              image: new Image() },
            { id: "clanNoiad",                 label: "Noiad",                 imgSrc: "icon_clan_noiad.png",                 image: new Image() },
            { id: "clanNosferatu",             label: "Nosferatu",             imgSrc: "icon_clan_nosferatu.png",             image: new Image() },
            { id: "clanNosferatuAntitribu",    label: "Nosferatu Antitribu",   imgSrc: "icon_clan_nosferatu_antitribu.png",   image: new Image() },
            { id: "clanOsebo",                 label: "Osebo",                 imgSrc: "icon_clan_osebo.png",                 image: new Image() },
            { id: "clanPander",                label: "Pander",                imgSrc: "icon_clan_pander.png",                image: new Image() },
            { id: "clanRavnos",                label: "Ravnos",                imgSrc: "icon_clan_ravnos.png",                image: new Image() },
            { id: "clanSalubri",               label: "Salubri",               imgSrc: "icon_clan_salubri.png",               image: new Image() },
            { id: "clanSalubriAntitribu",      label: "Salubri Antitribu",     imgSrc: "icon_clan_salubri_antitribu.png",     image: new Image() },
            { id: "clanSamedi",                label: "Samedi",                imgSrc: "icon_clan_samedi.png",                image: new Image() },
            { id: "clanToreador",              label: "Toreador",              imgSrc: "icon_clan_toreador.png",              image: new Image() },
            { id: "clanToreadorAntitribu",     label: "Toreador Antitribu",    imgSrc: "icon_clan_toreador_antitribu.png",    image: new Image() },
            { id: "clanTremere",               label: "Tremere",               imgSrc: "icon_clan_tremere.png",               image: new Image() },
            { id: "clanTremereAntitribu",      label: "Tremere Antitribu",     imgSrc: "icon_clan_tremere_antitribu.png",     image: new Image() },
            { id: "clanTrueBrujah",            label: "True Brujah",           imgSrc: "icon_clan_true_brujah.png",           image: new Image() },
            { id: "clanTzimisce",              label: "Tzimisce",              imgSrc: "icon_clan_tzimisce.png",              image: new Image() },
            { id: "clanVentrue",               label: "Ventrue",               imgSrc: "icon_clan_ventrue.png",               image: new Image() },
            { id: "clanVentrueAntitribu",      label: "Ventrue Antitribu",     imgSrc: "icon_clan_ventrue_antitribu.png",     image: new Image() },
            { id: "clanVolgirre",              label: "Volgirre",              imgSrc: "icon_clan_volgirre.png",              image: new Image() }
        ],

        frameMap : {
            // Main Frame Options
            "vampire_generic_01"      : "frame_vampire_generic_01.png",
            "vampire_generic_02"      : "frame_vampire_generic_02.png",
            "vampire_generic_03"      : "frame_vampire_generic_03.png",
            "vampire_generic_04"      : "frame_vampire_generic_04.png",
            "vampire_generic_05"      : "frame_vampire_generic_05.png",            
            "vampire_cut_01"          : "frame_vampire_cut_01.png",
            "vampire_cut_02"          : "frame_vampire_cut_02.png",
            "vampire_cut_03"          : "frame_vampire_cut_03.png",
            "vampire_cut_04"          : "frame_vampire_cut_04.png",
            "vampire_cut_05"          : "frame_vampire_cut_05.png",

            // Imbued frame
            "imbued_generic_01"       : "frame_imbued_generic_01.png",

            // Generic Library Frame Options
            "library_generic_01"      : "frame_library_generic_01.png",
            "library_generic_02"      : "frame_library_generic_02.png",  
            "library_generic_03"      : "frame_library_generic_03.png",
            "library_generic_04"      : "frame_library_generic_04.png",
            "library_generic_05"      : "frame_library_generic_05.png",
            "library_generic_06"      : "frame_library_generic_06.png",            
            "frame_black_marble_01"   : "frame_black_marble_01.png",        
            "frame_green_marble_01"   : "frame_green_marble_01.png",        

            // Clan Frame Options
            "clan_assamite"           : "frame_clan_assamite.png",
            "clan_brujah"             : "frame_clan_brujah.png",
            "clan_brujah_antitribu"   : "frame_clan_brujah_antitribu.png",
            "clan_cappadocian"        : "frame_clan_cappadocian.png",
            "clan_gangrel"            : "frame_clan_gangrel.png",
            "clan_gangrel_antitribu"  : "frame_clan_gangrel_antitribu.png",
            "clan_giovanni"           : "frame_clan_giovanni.png",
            "clan_lamia"              : "frame_clan_lamia.png",
            "clan_lasombra"           : "frame_clan_lasombra.png",
            "clan_malkavian"          : "frame_clan_malkavian.png",
            "clan_malkavian_antitribu": "frame_clan_malkavian_antitribu.png",
            "clan_nosferatu"          : "frame_clan_nosferatu.png",
            "clan_nosferatu_antitribu": "frame_clan_nosferatu_antitribu.png",
            "clan_ravnos"             : "frame_clan_ravnos.png",
            "clan_salubri"            : "frame_clan_salubri.png",
            "clan_salubri_antitribu"  : "frame_clan_salubri_antitribu.png",
            "clan_toreador"           : "frame_clan_toreador.png",
            "clan_toreador_antitribu" : "frame_clan_toreador_antitribu.png",
            "clan_tremere"            : "frame_clan_tremere.png",
            "clan_tremere_antitribu"  : "frame_clan_tremere_antitribu.png",
            "clan_tzimisce"           : "frame_clan_tzimisce.png",
            "clan_ventrue"            : "frame_clan_ventrue.png",
            "clan_ventrue_antitribu"  : "frame_clan_ventrue_antitribu.png",

            // Other Card Frame Options
            "modifier_card"           : "frame_modifier.png",
            "action_card"             : "frame_action.png",
            "political_action_card"   : "frame_political_action.png",
            "event_card"              : "frame_event.png",
            "master_card"             : "frame_master.png",
            "reaction_card"           : "frame_reaction.png",
            "combat_card"             : "frame_combat.png",
            "equipment_card"          : "frame_equipment.png",
            "ally_card"               : "frame_ally.png",

            // Generic Side Panel Options
            "generic_narrow_01"             : "sidepanel_generic_narrow_01.png",
            "generic_narrow_02"             : "sidepanel_generic_narrow_02.png",
            "generic_narrow_03"             : "sidepanel_generic_narrow_03.png",
            "generic_narrow_04"             : "sidepanel_generic_narrow_04.png",
            "generic_narrow_05"             : "sidepanel_generic_narrow_05.png",            
            
            // Side Panel Options
            "none"                          : null,
            "generic_green_marble"          : "sidepanel_generic_green_marble.png",
            "generic_black_marble"          : "sidepanel_generic_black_marble.png",
            "sidepanel_action"              : "sidepanel_action.png",
            "sidepanel_political_action"    : "sidepanel_political_action.png",
            "sidepanel_event"               : "sidepanel_event.png",
            "sidepanel_master"              : "sidepanel_master.png",
            "sidepanel_reaction"            : "sidepanel_reaction.png",
            "sidepanel_combat"              : "sidepanel_combat.png",
            "sidepanel_equipment"           : "sidepanel_equipment.png",
            "sidepanel_ally"                : "sidepanel_ally.png",
            "sidepanel_assamite"            : "sidepanel_assamite.png",
            "sidepanel_banu_haqim"          : "sidepanel_banu_haqim.png",            
            "sidepanel_brujah"              : "sidepanel_brujah.png",
            "sidepanel_brujah_antitribu"    : "sidepanel_brujah_antitribu.png",
            "sidepanel_cappadocian"         : "sidepanel_cappadocian.png",
            "sidepanel_gangrel"             : "sidepanel_gangrel.png",
            "sidepanel_gangrel_antitribu"   : "sidepanel_gangrel_antitribu.png",
            "sidepanel_giovanni"            : "sidepanel_giovanni.png",
            "sidepanel_lamia"               : "sidepanel_lamia.png",
            "sidepanel_lasombra"            : "sidepanel_lasombra.png",
            "sidepanel_malkavian"           : "sidepanel_malkavian.png",
            "sidepanel_malkavian_antitribu" : "sidepanel_malkavian_antitribu.png",
            "sidepanel_nosferatu"           : "sidepanel_nosferatu.png",
            "sidepanel_nosferatu_antitribu" : "sidepanel_nosferatu_antitribu.png",
            "sidepanel_ravnos"              : "sidepanel_ravnos.png",
            "sidepanel_salubri"             : "sidepanel_salubri.png",
            "sidepanel_salubri_antitribu"   : "sidepanel_salubri_antitribu.png",
            "sidepanel_toreador"            : "sidepanel_toreador.png",
            "sidepanel_toreador_antitribu"  : "sidepanel_toreador_antitribu.png",
            "sidepanel_tremere"             : "sidepanel_tremere.png",
            "sidepanel_tremere_antitribu"   : "sidepanel_tremere_antitribu.png",
            "sidepanel_tzimisce"            : "sidepanel_tzimisce.png",
            "sidepanel_ventrue"             : "sidepanel_ventrue.png",
            "sidepanel_ventrue_antitribu"   : "sidepanel_ventrue_antitribu.png"
        },

        typeMap : [
            { id: "card_type_action",         label: "Action",         iconSrc: "symbol_action.png" },
            { id: "card_type_reaction",       label: "Reaction",       iconSrc: "symbol_reaction.png" },
            { id: "card_type_combat",         label: "Combat",         iconSrc: "symbol_combat.png" },
            { id: "card_type_equipment",      label: "Equipment",      iconSrc: "symbol_equipment.png" },
            { id: "card_type_ally",           label: "Ally",           iconSrc: "symbol_ally.png" },
            { id: "card_type_master",         label: "Master",         iconSrc: "symbol_master.png" },
            { id: "card_type_modifier",       label: "Modifier",       iconSrc: "symbol_modifier.png" },
            { id: "card_type_retainer",       label: "Retainer",       iconSrc: "symbol_retainer.png" },
            { id: "card_type_event",          label: "Event",          iconSrc: "symbol_event.png" },
            { id: "card_type_political",      label: "Political",      iconSrc: "symbol_political.png" }
        ],

        symbolMap : {
            // Pool, Blood, Capacity, and Life
            "symbol_pool"              : "symbol_pool.png",
            "symbol_blood"             : "symbol_blood.png",
            "symbol_capacity"          : "symbol_capacity.png",
            "symbol_life"              : "symbol_life.png",

            "symbol_pool_alt_01"       : "symbol_pool_alt_01.png",
            "symbol_blood_alt_01"      : "symbol_blood_alt_01.png",
            "symbol_capacity_alt_01"   : "symbol_capacity_alt_01.png",
            "symbol_life_alt_01"       : "symbol_life_alt_01.png",

            "symbol_path_01"           : "symbol_path_of_caine.png",
            "symbol_path_02"           : "symbol_path_of_power_and_the_inner_voice.png",
            "symbol_path_03"           : "symbol_path_of_cathari.png",
            "symbol_path_04"           : "symbol_path_of_death_and_the_soul.png",
            
            // Other Useful Symbols
            "symbol_vote"              : "symbol_vote.png",

        },

        markdownTextMap : {
            "[b]"   : "bold",       // Bold text
            "[/b]"  : "normal",     // End bold
            "[i]"   : "italic",     // Italic text
            "[/i]"  : "normal",     // End italic
            "[n]"   : "newline"     // Newline
        },

        markdownIconMap : {
            // Disciplines
            "[abo]": "icon_discipline_abombwe_inferior.png",
            "[ABO]": "icon_discipline_abombwe_superior.png",
            "[aus]": "icon_discipline_auspex_inferior.png",
            "[AUS]": "icon_discipline_auspex_superior.png",
            "[ani]": "icon_discipline_animalism_inferior.png",
            "[ANI]": "icon_discipline_animalism_superior.png",
            "[cel]": "icon_discipline_celerity_inferior.png",
            "[CEL]": "icon_discipline_celerity_superior.png",
            "[chi]": "icon_discipline_chimerstry_inferior.png",
            "[CHI]": "icon_discipline_chimerstry_superior.png",
            "[dai]": "icon_discipline_daimonion_inferior.png",
            "[DAI]": "icon_discipline_daimonion_superior.png",
            "[dem]": "icon_discipline_dementation_inferior.png",
            "[DEM]": "icon_discipline_dementation_superior.png",
            "[dom]": "icon_discipline_dominate_inferior.png",
            "[DOM]": "icon_discipline_dominate_superior.png",
            "[for]": "icon_discipline_fortitude_inferior.png",
            "[FOR]": "icon_discipline_fortitude_superior.png",
            "[mal]": "icon_discipline_maleficia_inferior.png",
            "[MAL]": "icon_discipline_maleficia_superior.png",
            "[mel]": "icon_discipline_melpominee_inferior.png",
            "[MEL]": "icon_discipline_melpominee_superior.png",
            "[myt]": "icon_discipline_mytherceria_inferior.png",
            "[MYT]": "icon_discipline_mytherceria_superior.png",
            "[nec]": "icon_discipline_necromancy_inferior.png",
            "[NEC]": "icon_discipline_necromancy_superior.png",
            "[obe]": "icon_discipline_obeah_inferior.png",
            "[OBE]": "icon_discipline_obeah_superior.png",
            "[obf]": "icon_discipline_obfuscate_inferior.png",
            "[OBF]": "icon_discipline_obfuscate_superior.png",
            "[obl]": "icon_discipline_oblivion_inferior.png",
            "[OBL]": "icon_discipline_oblivion_superior.png",            
            "[obt]": "icon_discipline_obtenebration_inferior.png",
            "[OBT]": "icon_discipline_obtenebration_superior.png",
            "[pot]": "icon_discipline_potence_inferior.png",
            "[POT]": "icon_discipline_potence_superior.png",
            "[pre]": "icon_discipline_presence_inferior.png",
            "[PRE]": "icon_discipline_presence_superior.png",
            "[pro]": "icon_discipline_protean_inferior.png",
            "[PRO]": "icon_discipline_protean_superior.png",
            "[qui]": "icon_discipline_quietus_inferior.png",
            "[QUI]": "icon_discipline_quietus_superior.png",
            "[san]": "icon_discipline_sanguinus_inferior.png",
            "[SAN]": "icon_discipline_sanguinus_superior.png",
            "[ser]": "icon_discipline_serpentis_inferior.png",
            "[SER]": "icon_discipline_serpentis_superior.png",
            "[spi]": "icon_discipline_spiritus_inferior.png",
            "[SPI]": "icon_discipline_spiritus_superior.png",
            "[str]": "icon_discipline_striga_inferior.png",
            "[STR]": "icon_discipline_striga_superior.png",
            "[tem]": "icon_discipline_temporis_inferior.png",
            "[TEM]": "icon_discipline_temporis_superior.png",
            "[tha]": "icon_discipline_thaumaturgy_inferior.png",
            "[THA]": "icon_discipline_thaumaturgy_superior.png",
            "[thn]": "icon_discipline_thanatosis_inferior.png",
            "[THN]": "icon_discipline_thanatosis_superior.png",      
            "[val]": "icon_discipline_valeren_inferior.png",
            "[VAL]": "icon_discipline_valeren_superior.png",
            "[vic]": "icon_discipline_vicissitude_inferior.png",
            "[VIC]": "icon_discipline_vicissitude_superior.png",
            "[vis]": "icon_discipline_visceratika_inferior.png",
            "[VIS]": "icon_discipline_visceratika_superior.png",

            // Clans
            "[ahr]": "icon_clan_ahrimanes.png",
            "[aku]": "icon_clan_akunanse.png",
            "[and]": "icon_clan_anda.png",
            "[ass]": "icon_clan_assamite.png",
            "[baa]": "icon_clan_baali.png",
            "[ban]": "icon_clan_banu_haqim.png", 
            "[blo]": "icon_clan_blood_brothers.png",
            "[bru]": "icon_clan_brujah.png",
            "[!bru]": "icon_clan_brujah_antitribu.png",
            "[cai]": "icon_clan_caitiff.png",
            "[cap]": "icon_clan_cappadocian.png",
            "[dau]": "icon_clan_daughters_of_cacophony.png",
            "[fol]": "icon_clan_followers_of_set.png",
            "[gan]": "icon_clan_gangrel.png",
            "[!gan]": "icon_clan_gangrel_antitribu.png",
            "[gar]": "icon_clan_gargoyles.png",
            "[gio]": "icon_clan_giovanni.png",
            "[gur]": "icon_clan_guruhi.png",
            "[hec]": "icon_clan_hecata.png",
            "[har]": "icon_clan_harbringers_of_skulls.png",
            "[ish]": "icon_clan_isharri.png",
            "[kia]": "icon_clan_kiasyd.png",
            "[kin]": "icon_clan_kinyonyi.png",
            "[lam]": "icon_clan_lamia.png",
            "[las]": "icon_clan_lasombra.png",
            "[mal]": "icon_clan_malkavian.png",
            "[!mal]": "icon_clan_malkavian_antitribu.png",
            "[min]": "icon_clan_ministry.png",
            "[nag]": "icon_clan_nagaraja.png",
            "[nal]": "icon_clan_nagloper.png",
            "[noi]": "icon_clan_noiad.png",
            "[nos]": "icon_clan_nosferatu.png",
            "[!nos]": "icon_clan_nosferatu_antitribu.png",
            "[ose]": "icon_clan_osebo.png",
            "[pan]": "icon_clan_pander.png",
            "[rav]": "icon_clan_ravnos.png",
            "[sal]": "icon_clan_salubri.png",
            "[!sal]": "icon_clan_salubri_antitribu.png",
            "[sam]": "icon_clan_samedi.png",
            "[tor]": "icon_clan_toreador.png",
            "[!tor]": "icon_clan_toreador_antitribu.png",
            "[tre]": "icon_clan_tremere.png",
            "[!tre]": "icon_clan_tremere_antitribu.png",
            "[tru]": "icon_clan_true_brujah.png",
            "[tzi]": "icon_clan_tzimisce.png",
            "[ven]": "icon_clan_ventrue.png",
            "[!ven]": "icon_clan_ventrue_antitribu.png",
            "[vol]": "icon_clan_volgirre.png"
        },

        premadeTemplates : [
            { name: "Placeholder - not a real template", path: "templates/vampire_generic_template.json" },           
        ],        


    };

    // END datatables & maps