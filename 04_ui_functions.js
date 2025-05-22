




    // ---------------------------------
    // Create HTML UI DOM elements 
    // ---------------------------------

    // Contents:
    // global.ui.new_inl - Creates a new div element.
    // global.ui.new_rad - Creates a new radio input element.
    // global.ui.new_pck - Creates a new color picker input element.
    // global.ui.new_hex - Creates a new text input element for hex color codes.
    // global.ui.new_opt - Creates a new option element for a select dropdown.
    // global.ui.new_lbl - Creates a new label element.
    // global.ui.new_txt - Creates a new text input, number input, or textarea element.
    // global.ui.new_inp - Creates a new generic input element.
    // global.ui.new_btn - Creates a new button element.    
    // global.ui.new_sel - Creates a new select element.    
    //
    // Argument structure: 
    // (id string, classes array, default values object)
    //
    // Each of the functions creates a new div element, and has similar arg structure.
    // @param {string} id - The ID for the div.
    // @param {string[]} [classes=[]] - An array of CSS classes to apply.
    // @param {object} [defaults={}] - An object containing default properties 
    // @returns {HTMLDivElement} The created div element.
    //    

    if (typeof global === 'undefined') {
        throw new Error("Fatal Error: The 'global' namespace has not been initialized. Please ensure '01_global_variables.js' (or an equivalent setup script) is loaded and executed before this script ('04_ui_functions.js').");
    }
    if (typeof global.ui === 'undefined') {
        throw new Error("Fatal Error: The 'global.ui' object has not been initialized. Please ensure '01_global_variables.js' (or an equivalent setup script) initializes 'global.ui = {};' before this script ('04_ui_functions.js').");
    }

    // Creates a new div element.
    global.ui.new_inl = function (id, classes = [], defaults = {}){
        const div = document.createElement("div");
        if (id) div.id = id;
        if (classes && classes.length > 0) { div.className = classes.join(" "); }
        Object.keys(defaults).forEach(key => { div[key] = defaults[key]; });
        return div;
    };

    // Creates a new radio input element.
    global.ui.new_rad = function (id, classes = [], defaults){
        const radio = document.createElement("input");
        if (id) radio.id = id;
        if (classes && classes.length > 0) { radio.className = classes.join(" "); }
        Object.keys(defaults).forEach(key => { radio[key] = defaults[key]; });
        radio.type = "radio"; // Enforce type
        return radio;
    };

    // Creates a new color picker input element.
    global.ui.new_pck = function (id, classes = [], defaults){
        const picker = document.createElement("input");
        if (id) picker.id = id;
        if (classes && classes.length > 0) { picker.className = classes.join(" "); }
        Object.keys(defaults).forEach(key => { picker[key] = defaults[key]; });
        picker.type = "color"; // Enforce type
        // Ensure a default value if not set by defaults or if set to empty
        if (picker.value === undefined || picker.value === "") { picker.value = '#000000'; }
        return picker;
    };

    // Creates a new text input element for hex color codes.
    global.ui.new_hex = function (id, classes = [], defaults){
        const hexInput = document.createElement("input");
        if (id) hexInput.id = id;
        if (classes && classes.length > 0) { hexInput.className = classes.join(" "); }
        Object.keys(defaults).forEach(key => { hexInput[key] = defaults[key]; });
        hexInput.type = "text"; // Enforce type

        // Enforce specific defaults if not set by the defaults object
        if (hexInput.value === undefined || hexInput.value === "") { hexInput.value = '#000000'; }
        if (hexInput.maxLength === undefined || hexInput.maxLength <= 0) { hexInput.maxLength = 7; }
        if (hexInput.placeholder === undefined) { hexInput.placeholder = '#RRGGBB'; }
        return hexInput;
    };

    // Creates a new option element for a select dropdown.
    global.ui.new_opt = function (id, classes = [], defaults){
        const option = document.createElement("option");
        if (id) option.id = id; // Though unusual for <option>, apply if provided
        if (classes && classes.length > 0) { option.className = classes.join(" "); }

        Object.keys(defaults).forEach(key => {
            if (key === 'text') { // Special handling for 'text' to 'textContent'
                option.textContent = defaults[key];
            } else {
                option[key] = defaults[key];
            }
        });
        return option;
    };

    // Creates a new label element.
    global.ui.new_lbl = function (id, classes = [], defaults){
        const label = document.createElement("label");
        if (id) label.id = id; // Apply if provided
        if (classes && classes.length > 0) { label.className = classes.join(" "); }

        Object.keys(defaults).forEach(key => {
            if (key === 'forId') { // Special handling for 'forId' to 'htmlFor'
                label.htmlFor = defaults[key];
            } else {
                label[key] = defaults[key];
            }
        });
        return label;
    };

    // Creates a new text input, number input, or textarea element.
    global.ui.new_txt = function (id, classes = [], defaults){
        const isTextarea = defaults && defaults.type === 'textarea';
        const element = isTextarea ? document.createElement('textarea') : document.createElement('input');

        if (id) element.id = id;
        if (classes && classes.length > 0) { element.className = classes.join(" "); }

        Object.keys(defaults).forEach(key => {
            if (isTextarea) {
                if (key === 'value') {
                    element.textContent = defaults[key];
                } else if (key !== 'type') { // Avoid setting 'type' on textarea
                    element[key] = defaults[key];
                }
            } else { // For input elements
                element[key] = defaults[key];
            }
        });

        // If it's an input and 'type' was not in defaults (so element.type is still empty),
        // default it to 'text'.
        if (!isTextarea && !element.type) {
            element.type = 'text';
        }

        return element;
    };

    // Creates a new generic input element.
    global.ui.new_inp = function (id, classes = [], defaults = {}) {
        const input = document.createElement("input");
        if (id) { input.id = id; }
        if (classes && classes.length > 0) { input.className = classes.join(" "); }
        Object.keys(defaults).forEach(key => { input[key] = defaults[key]; });
        return input;
    };

    // Creates a new button element.
    global.ui.new_btn = function (id, classes = [], defaults){
        const button = document.createElement("button");
        if (id) button.id = id;
        if (classes && classes.length > 0) { button.className = classes.join(" "); }

        button.type = 'button'; // Set a sensible default before applying overrides
        Object.keys(defaults).forEach(key => { button[key] = defaults[key]; });

        return button;
    };


    // Creates a new button element.
    global.ui.new_sel = function (id, classes = [], defaults){
        const select = document.createElement("select");
        if (id) select.id = id;
        if (classes && classes.length > 0) { select.className = classes.join(" "); }

        Object.keys(defaults).forEach(key => { select[key] = defaults[key]; });

        return select;
    };    
