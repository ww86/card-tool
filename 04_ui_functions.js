




    // ---------------------------------
    // Create HTML UI DOM elements 
    // ---------------------------------

    // arg structure (id string, classes array, default values object)

    /*    
    global.ui.new_inl = function (id, classes, defaults) {

        const   div             = document.createElement("div");
                div.id          = id;
                div.class       = classes.join(" ");
        return  div;

    };

    global.ui.new_rad = function (id, classes, defaults) {

        const   div             = document.createElement("input");
                div.id          = id;
                div.class       = classes.join(" ");
                div.type        = "radio";
        return  div;

    };

    global.ui.new_pck = function (id, classes, defaults) {

        const   div             = document.createElement("input");
                div.id          = id;
                div.class       = classes.join(" ");
                div.type        = "color";                
        return  div;

    };

    global.ui.new_hex = function (id, classes, defaults) {

        const   div             = document.createElement("input");
                div.id          = id;
                div.class       = classes.join(" ");
                div.type        = "text";
                div.maxLength   = 7;       
        return  div;

    };

    global.ui.new_opt = function (id, classes, defaults) {

        const   div             = document.createElement("option");
                div.id          = id;
                div.class       = classes.join(" ");
        return  div;

    };

    global.ui.new_lbl = function (id, classes, defaults) {

        const   div             = document.createElement("label");
                div.id          = id;
                div.class       = classes.join(" ");
        return  div;

    };

    global.ui.new_txt = function (id, classes, defaults) {

        const   div             = document.createElement("input");
                div.id          = id;
                div.class       = classes.join(" ");
                div.type        = "text";
        return  div;

    };

    global.ui.new_btn           = function (id, classes, defaults) {

        const   div             = document.createElement("button");
                div.id          = id;
                div.class       = classes.join(" ");
                div.type        = "button";
        return  div;

    };
    */    

    if (typeof global === 'undefined') {
        throw new Error("Fatal Error: The 'global' namespace has not been initialized. Please ensure '01_global_variables.js' (or an equivalent setup script) is loaded and executed before this script ('04_ui_functions.js').");
    }
    if (typeof global.ui === 'undefined') {
        throw new Error("Fatal Error: The 'global.ui' object has not been initialized. Please ensure '01_global_variables.js' (or an equivalent setup script) initializes 'global.ui = {};' before this script ('04_ui_functions.js').");
    }

    /**
     * Creates a new div element.
     * @param {string} id - The ID for the div.
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} [defaults={}] - An object containing default properties (currently unused for div).
     * @returns {HTMLDivElement} The created div element.
     */
    global.ui.new_inl = function (id, classes = [], defaults = {}){
        const div = document.createElement("div");
        if (id) div.id = id;
        if (classes && classes.length > 0) {
            div.className = classes.join(" ");
        }
        // defaults object could be used here for data attributes etc. if needed later
        return div;
    };

    /**
     * Creates a new radio input element.
     * Expects defaults object to contain: { name: string, value: string, checked: boolean }
     * @param {string} id - The ID for the radio input.
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} defaults - An object containing default properties (name, value, checked).
     * @returns {HTMLInputElement} The created radio input element.
     */
    global.ui.new_rad = function (id, classes = [], defaults){
        const radio = document.createElement("input");
        if (id) radio.id = id;
        radio.type = "radio";
        if (defaults && defaults.name !== undefined) radio.name = defaults.name;
        if (defaults && defaults.value !== undefined) radio.value = defaults.value;
        if (defaults && defaults.checked !== undefined) radio.checked = defaults.checked;
        if (classes && classes.length > 0) {
            radio.className = classes.join(" ");
        }
        return radio;
    };

    /**
     * Creates a new color picker input element.
     * Expects defaults object to contain: { value: string }
     * @param {string} id - The ID for the color picker.
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} defaults - An object containing default properties (value).
     * @returns {HTMLInputElement} The created color picker element.
     */
    global.ui.new_pck = function (id, classes = [], defaults){
        const picker = document.createElement("input");
        if (id) picker.id = id;
        picker.type = "color";
        if (defaults && defaults.value !== undefined) picker.value = defaults.value;
        else picker.value = '#000000'; // Default if not provided
        if (classes && classes.length > 0) {
            picker.className = classes.join(" ");
        }
        return picker;
    };

    /**
     * Creates a new text input element for hex color codes.
     * Expects defaults object to contain: { value: string, maxLength: number, placeholder: string }
     * @param {string} id - The ID for the hex input.
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} defaults - An object containing default properties (value, maxLength, placeholder).
     * @returns {HTMLInputElement} The created hex input element.
     */
    global.ui.new_hex = function (id, classes = [], defaults){
        const hexInput = document.createElement("input");
        if (id) hexInput.id = id;
        hexInput.type = "text";
        if (defaults && defaults.value !== undefined) hexInput.value = defaults.value;
        else hexInput.value = '#000000'; // Default if not provided
        if (defaults && defaults.maxLength !== undefined) hexInput.maxLength = defaults.maxLength;
        else hexInput.maxLength = 7; // Default if not provided
        if (defaults && defaults.placeholder !== undefined) hexInput.placeholder = defaults.placeholder;
        else hexInput.placeholder = '#RRGGBB'; // Default if not provided
        if (classes && classes.length > 0) {
            hexInput.className = classes.join(" ");
        }
        return hexInput;
    };

    /**
     * Creates a new option element for a select dropdown.
     * Expects defaults object to contain: { value: string, text: string, selected: boolean }
     * @param {string} id - The ID for the option (often not needed).
     * @param {string[]} [classes=[]] - An array of CSS classes to apply (often not needed).
     * @param {object} defaults - An object containing default properties (value, text, selected).
     * @returns {HTMLOptionElement} The created option element.
     */
    global.ui.new_opt = function (id, classes = [], defaults){
        const option = document.createElement("option");
        // id and classes are typically not needed for options, but keeping signature as requested
        if (defaults && defaults.value !== undefined) option.value = defaults.value;
        if (defaults && defaults.text !== undefined) option.textContent = defaults.text;
        if (defaults && defaults.selected !== undefined) option.selected = defaults.selected;
        return option;
    };

    /**
     * Creates a new label element.
     * Expects defaults object to contain: { forId: string, textContent: string }
     * @param {string} id - The ID for the label (often not needed).
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} defaults - An object containing default properties (forId, textContent).
     * @returns {HTMLLabelElement} The created label element.
     */
    global.ui.new_lbl = function (id, classes = [], defaults){
        const label = document.createElement("label");
        // id is typically not needed for labels, but keeping signature as requested
        if (defaults && defaults.forId !== undefined) label.htmlFor = defaults.forId;
        if (defaults && defaults.textContent !== undefined) label.textContent = defaults.textContent;
        if (classes && classes.length > 0) {
            label.className = classes.join(" ");
        }
        return label;
    };

    /**
     * Creates a new text input, number input, or textarea element.
     * Expects defaults object to contain: { type: string, value: string|number, placeholder: string, min: number, max: number, step: number, maxLength: number }
     * @param {string} id - The ID for the input/textarea.
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} defaults - An object containing default properties (type, value, placeholder, min, max, step, maxLength).
     * @returns {HTMLInputElement|HTMLTextAreaElement} The created input or textarea element.
     */
    global.ui.new_txt = function (id, classes = [], defaults){
        const type = (defaults && defaults.type) || 'text';
        const element = (type === 'textarea') ? document.createElement('textarea') : document.createElement('input');

        if (id) element.id = id;
        if (type !== 'textarea') element.type = type;

        if (defaults && defaults.value !== undefined) {
            if (type === 'textarea') element.textContent = defaults.value;
            else element.value = defaults.value;
        }
        if (defaults && defaults.placeholder !== undefined) element.placeholder = defaults.placeholder;
        if (defaults && defaults.maxLength !== undefined) element.maxLength = defaults.maxLength;

        // Specific attributes for number inputs
        if (type === 'number') {
            if (defaults && defaults.min !== undefined) element.min = defaults.min;
            if (defaults && defaults.max !== undefined) element.max = defaults.max;
            if (defaults && defaults.step !== undefined) element.step = defaults.step;
        }

        if (classes && classes.length > 0) {
            element.className = classes.join(" ");
        }
        return element;
    };

    /**
     * Creates a new button element.
     * Expects defaults object to contain: { textContent: string, type: string }
     * @param {string} id - The ID for the button.
     * @param {string[]} [classes=[]] - An array of CSS classes to apply.
     * @param {object} defaults - An object containing default properties (textContent, type).
     * @returns {HTMLButtonElement} The created button element.
     */
    global.ui.new_btn = function (id, classes = [], defaults){
        const button = document.createElement("button");
        if (id) button.id = id;
        if (defaults && defaults.type !== undefined) button.type = defaults.type;
        else button.type = 'button'; // Default if not provided
        if (defaults && defaults.textContent !== undefined) button.textContent = defaults.textContent;
        if (classes && classes.length > 0) {
            button.className = classes.join(" ");
        }
        return button;
    };

    /*
        // Placeholder for new_inp if needed later, currently new_txt covers text/number/textarea
        global.ui.new_inp = function (id, classes = [], defaults = {}) {
            const input = document.createElement("input");
            if (id) input.id = id;
            if (defaults && defaults.type !== undefined) input.type = defaults.type;
            if (defaults && defaults.value !== undefined) input.value = defaults.value;
            if (defaults && defaults.placeholder !== undefined) input.placeholder = defaults.placeholder;
            if (defaults && defaults.min !== undefined) input.min = defaults.min;
            if (defaults && defaults.max !== undefined) input.max = defaults.max;
            if (defaults && defaults.step !== undefined) input.step = defaults.step;
            if (defaults && defaults.maxLength !== undefined) input.maxLength = defaults.maxLength;
            if (classes && classes.length > 0) {
                input.className = classes.join(" ");
            }
            return input;
        };
    */
