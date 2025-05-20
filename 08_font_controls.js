
/**
 * Creates a complete UI panel for customizing a text field's appearance.
 * Uses helper functions from global.ui to create individual elements.
 *
 * @param {object} config - Configuration object for this text field from global.data.textFieldConfigs (currently just { id_prefix: string }).
 * @param {object} defaults - An object containing all default values for this panel instance,
 *                            structured with nested 'header', 'font', and 'background' objects.
 * @returns {HTMLDivElement} The created panel element (an input-group div).
 */
global.ui.createFont = function (config, defaults) {
    // Ensure global.ui helpers are available
    if (!global.ui || !global.ui.new_inl || !global.ui.new_rad || !global.ui.new_pck || !global.ui.new_hex || !global.ui.new_opt || !global.ui.new_lbl || !global.ui.new_txt || !global.ui.new_btn) {
        console.error("global.ui helper functions are not fully defined. Cannot create font control panel.");
        return null; // Or throw an error
    }

    // --- Helper functions to create specific rows/sections of the panel ---

    function _getControlStructureConfig(controlName) {
        if (!global.data.textFieldPanelStructure) {
            console.error(`_getControlStructureConfig: global.data.textFieldPanelStructure is not defined.`);
            return { label: controlName }; // Fallback label
        }
        const structure = global.data.textFieldPanelStructure.find(item => item.name === controlName);
        if (!structure) {
            console.warn(`_getControlStructureConfig: No structure found for control name "${controlName}". Using controlName as label.`);
            return { label: controlName }; // Fallback label
        }
        return structure;
    }

    function _createFontAndSizeRow(id_prefix, fontDefaults) {
        const row                 = global.ui.new_inl(null, ["inline-selector", "font-control-inline-selector"]);
        const fontSelectConfig    = _getControlStructureConfig('font_select');
        const fontSizeSelectConfig= _getControlStructureConfig('font_size_select');

        const fontLabel           = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_font_select`, textContent: fontSelectConfig.label });
        const fontSelect          = document.createElement('select');
              fontSelect.id       = `${id_prefix}_font_select`;
              fontSelect.className= 'control-select font-family-select';
        // Font options are populated later by populateFontSelectors in 10_script.js

        const sizeLabel           = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_font_size_select`, textContent: fontSizeSelectConfig.label });
        const sizeSelect          = document.createElement('select');
              sizeSelect.id       = `${id_prefix}_font_size_select`;
              sizeSelect.className= 'control-select font-size-select';
        
        const font_sizes          = fontSizeSelectConfig.options_values || [12, 14, 16, 18, 20]; // Fallback if not defined

        font_sizes.forEach(size => { // FONT_SIZES sourced from textFieldPanelStructure
            const option = global.ui.new_opt(null, null, { value: size.toString(), text: size.toString(), selected: size.toString() === String(fontDefaults.size) });
            sizeSelect.appendChild(option);
        });

        row.appendChild(fontLabel);   
        row.appendChild(fontSelect);
        row.appendChild(sizeLabel);   
        row.appendChild(sizeSelect);
        return row;
    }

    function _createTextColorRow(id_prefix, fontDefaults) {
        const row                  = global.ui.new_inl(null, ["inline-selector", "font-control-inline-selector"]);
        const colorPickerConfig    = _getControlStructureConfig('text_color_picker');
        const hexInputConfig       = _getControlStructureConfig('text_color_hex');
        const opacityInputConfig   = _getControlStructureConfig('text_opacity_input');

        // colorLabel is intentionally empty for color pickers if structure.label is ""
        const colorLabel           = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_text_color_picker`, textContent: colorPickerConfig.label });
        const hexLabel             = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_text_color_hex`, textContent: hexInputConfig.label });
        const opacityLabel         = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_text_opacity_input`, textContent: opacityInputConfig.label });
        
        const colorPicker          = global.ui.new_pck(`${id_prefix}_text_color_picker`, ["control-color-picker", "text-color-picker"], { value: fontDefaults.color || '#000000' });
        const hexInput             = global.ui.new_hex(`${id_prefix}_text_color_hex`, ["control-input", "control-input-hex", "text-color-hex"], { value: fontDefaults.hex || '#000000', maxLength: 7, placeholder: '#RRGGBB' });       
        const opacityInput         = global.ui.new_txt(`${id_prefix}_text_opacity_input`, ["control-input", "control-input-number", "opacity-input", "text-opacity-input"], {
            type: 'number', value: fontDefaults.opacity || 100, min: 0, max: 100
        });

        if (colorPickerConfig.label) row.appendChild(colorLabel); 
        row.appendChild(colorPicker);
        row.appendChild(hexLabel);    
        row.appendChild(hexInput);
        row.appendChild(opacityLabel);
        row.appendChild(opacityInput);
        return row;
    }

    function _createTextEffectsRadioGroup(id_prefix, fontDefaults) {
        const group             = global.ui.new_inl(null, ["inline-selector", "radio-group"]);
        const effectsConfig     = _getControlStructureConfig('effect_radio');
        const effectsLabel      = global.ui.new_lbl(null, ["control-label-inline"], { textContent: effectsConfig.label });

        group.appendChild(effectsLabel);
        for (let i = 0; i <= 6; i++) {
            const radioId        = `${id_prefix}_effect_radio_${i}`;
            const radioLabelText = i === 0 ? 'None' : i.toString();
            const radio          = global.ui.new_rad(radioId, ["control-radio"], {
                name: `${id_prefix}_effect_radio`,
                value: i.toString(),
                checked: i.toString() === String(fontDefaults.effect)
            });
            const radioLabel     = global.ui.new_lbl(null, ["radio-label"], { forId: radioId, textContent: radioLabelText });
            
            group.appendChild(radioLabel);
            group.appendChild(radio);      
        }
        return group;
    }

    function _createBackgroundPositionRow(id_prefix, backgroundDefaults) {
        const row           = global.ui.new_inl(null, ["inline-selector", "font-control-inline-selector"]);
        const xInputConfig  = _getControlStructureConfig('box_x_input');
        const yInputConfig  = _getControlStructureConfig('box_y_input');

        const xLabel        = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_box_x_input`, textContent: xInputConfig.label });
        const yLabel        = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_box_y_input`, textContent: yInputConfig.label });
        const xInput        = global.ui.new_txt(`${id_prefix}_box_x_input`, ["control-input", "control-input-number", "position-input"], { type: 'number', value: backgroundDefaults.x || 0 });
        const yInput        = global.ui.new_txt(`${id_prefix}_box_y_input`, ["control-input", "control-input-number", "position-input"], { type: 'number', value: backgroundDefaults.y || 0 });

        row.appendChild(xLabel);      row.appendChild(xInput);
        row.appendChild(yLabel);      row.appendChild(yInput);
        return row;
    }

    function _createBackgroundDimensionsRow(id_prefix, backgroundDefaults) {
        const row           = global.ui.new_inl(null, ["inline-selector", "font-control-inline-selector"]);
        const wInputConfig  = _getControlStructureConfig('box_width_input');
        const hInputConfig  = _getControlStructureConfig('box_height_input');

        const wLabel        = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_box_width_input`, textContent: wInputConfig.label });
        const hLabel        = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_box_height_input`, textContent: hInputConfig.label });
        const wInput        = global.ui.new_txt(`${id_prefix}_box_width_input`, ["control-input", "control-input-number", "dimension-input"], { type: 'number', value: backgroundDefaults.width || 100 });
        const hInput        = global.ui.new_txt(`${id_prefix}_box_height_input`, ["control-input", "control-input-number", "dimension-input"], { type: 'number', value: backgroundDefaults.height || 20 });

        row.appendChild(wLabel);      row.appendChild(wInput);
        row.appendChild(hLabel);      row.appendChild(hInput);
        return row;
    }

    function _createBackgroundColorRow(id_prefix, backgroundDefaults) {
        const row                  = global.ui.new_inl(null, ["inline-selector", "font-control-inline-selector"]);
        const colorPickerConfig    = _getControlStructureConfig('bg_color_picker');
        const hexInputConfig       = _getControlStructureConfig('bg_color_hex');
        const opacityInputConfig   = _getControlStructureConfig('bg_opacity_input');
        const borderInputConfig    = _getControlStructureConfig('bg_border_input');

        const colorLabel           = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_bg_color_picker`, textContent: colorPickerConfig.label });
        const hexLabel             = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_bg_color_hex`, textContent: hexInputConfig.label });
        const opacityLabel         = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_bg_opacity_input`, textContent: opacityInputConfig.label });

        const colorPicker          = global.ui.new_pck(`${id_prefix}_bg_color_picker`, ["control-color-picker", "bg-color-picker"], { value: backgroundDefaults.color || '#FFFFFF' });
        const hexInput             = global.ui.new_hex(`${id_prefix}_bg_color_hex`, ["control-input", "control-input-hex", "bg-hex-input"], { value: backgroundDefaults.hex || '#FFFFFF', maxLength: 7, placeholder: '#RRGGBB' });
        const opacityInput         = global.ui.new_txt(`${id_prefix}_bg_opacity_input`, ["control-input", "control-input-number", "opacity-input", "bg-opacity-input"], {
            type: 'number', value: backgroundDefaults.opacity || 0, min: 0, max: 100
        });
        const borderLabel          = global.ui.new_lbl(null, ["control-label-inline"], { forId: `${id_prefix}_bg_border_input`, textContent: borderInputConfig.label });
        const borderInput          = global.ui.new_txt(`${id_prefix}_bg_border_input`, ["control-input", "control-input-number", "border-input", "bg-border-input"], {
            type: 'number', value: backgroundDefaults.border || 0, min: 0, max: backgroundDefaults.border_max || 4
        });

        if (colorPickerConfig.label) { row.appendChild(colorLabel); }// Only add label if defined
        row.appendChild(colorPicker);
        row.appendChild(hexLabel);       
        row.appendChild(hexInput);
        row.appendChild(opacityLabel);   
        row.appendChild(opacityInput);
        row.appendChild(borderLabel);    
        row.appendChild(borderInput);
        return row;
    }

    // --- Main function logic ---

    const id_prefix             = config.id_prefix;
    const headerDefaults        = defaults.header || {};
    const fontDefaults          = defaults.font || {}; // Ensure fontDefaults is an object
    const backgroundDefaults    = defaults.background || {};

    // Main container: input-group
    const inputGroup            = global.ui.new_inl(`${id_prefix}_control_group`, ["input-group", "text-field-control-group"]);

    // H-Selector: Label and Main Text Input
    const hSelector             = global.ui.new_inl(null, ["h-selector"]);
    const mainInputLabel        = global.ui.new_lbl(null, ["control-label"], { forId: `${id_prefix}_input`, textContent: headerDefaults.label || `${id_prefix} Text:` });
    const mainInput             = global.ui.new_txt(`${id_prefix}_input`, ["control-input", `control-${headerDefaults.type || 'text'}`, "font-control-main-input"], {
        type: headerDefaults.type || 'text',
        value: headerDefaults.value || '',
        placeholder: headerDefaults.placeholder || ''
    });
    hSelector.appendChild(mainInputLabel);
    hSelector.appendChild(mainInput);
    inputGroup.appendChild(hSelector);

    // Settings Group: Contains Text and Background settings
    const settingsGroup         = global.ui.new_inl(null, ["settings-group"]);

    // --- Text Settings Fieldset ---
    const textSettingsFieldset              = document.createElement('fieldset');
          textSettingsFieldset.className    = 'control-fieldset';
    const textLegend                        = document.createElement('legend');
          textLegend.className              = 'control-legend';
          textLegend.textContent            = 'Text';
    textSettingsFieldset.appendChild(textLegend);

    textSettingsFieldset.appendChild(_createFontAndSizeRow(id_prefix, fontDefaults));
    textSettingsFieldset.appendChild(_createTextColorRow(id_prefix, fontDefaults));
    textSettingsFieldset.appendChild(_createTextEffectsRadioGroup(id_prefix, fontDefaults));
    
    settingsGroup.appendChild(textSettingsFieldset);

    // --- Background Settings Fieldset ---
    const bgSettingsFieldset                = document.createElement('fieldset');
          bgSettingsFieldset.className      = 'control-fieldset';
    const bgLegend                          = document.createElement('legend');
          bgLegend.className                = 'control-legend';
          bgLegend.textContent              = 'Background';
    bgSettingsFieldset.appendChild(bgLegend);

    bgSettingsFieldset.appendChild(_createBackgroundPositionRow(id_prefix, backgroundDefaults));
    bgSettingsFieldset.appendChild(_createBackgroundDimensionsRow(id_prefix, backgroundDefaults));
    bgSettingsFieldset.appendChild(_createBackgroundColorRow(id_prefix, backgroundDefaults));

    settingsGroup.appendChild(bgSettingsFieldset);
    inputGroup.appendChild(settingsGroup);

    return inputGroup;
};