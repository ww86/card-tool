    
    
    


    // -------------------------------
    // Global variables object
    // -------------------------------

    var global = {

        art                         : {
            mainImage               : new Image (),
            mainSrc                 : "",
            frameBgImage            : new Image (),
            sidePanelImage          : new Image (),            
            loadedSymbolImages      : {}, 
            uploadedSymbolImages    : {}, 
            uploadedFrame           : new Image(),
        },

        data                        : {
            availableFonts          : [],
            textFieldPanelStructure : [],
            textFieldHeaderDefaults : [],
            textFieldBgDefaults     : [],
            textFieldFontDefaults   : [],
            textFieldConfigs        : [], 
            miscIconData            : {},
            disciplineData          : [],
            clanData                : [],
            frameMap                : [],
            typeMap                 : {},
            symbolMap               : {},
            markdownTextmap         : {},
            markdownIconmap         : {},
            premadeTemplates        : [],
        },

        util                        : {
            showError               : function(){},
            showOnloadError         : function(){},
            hexToRgba               : function(){},
            drawRoundedRect         : function(){},
            drawBorders             : function(){},
            split_arr               : function(){},
            createLabel             : function(){},
            createNumberInput       : function(){},
            createToggle            : function(){},
            wrapImgPath             : function(){},

        },

        ui                          : {
            new_inl                 : function (){}, 
            new_rad                 : function (){},
            new_pck                 : function (){},
            new_hex                 : function (){},
            new_opt                 : function (){},
            new_lbl                 : function (){},
            new_inp                 : function (){},
            new_btn                 : function (){},
            new_sel                 : function (){},           
            createFont              : function (){}, 
        },


        text                        : {
            wrapText                : function (){},
        },

        json                        : {
            exportJson              : function(){},
            importJson              : function(){},
        },

        tests                       : {
            testAllImages           : function(){},
            testAllFonts            : function(){},
        },

        showLicensePopup            : function(){},
        darkPack                    : function(){},
        renderDarkPackLogo          : function(){},

    };
