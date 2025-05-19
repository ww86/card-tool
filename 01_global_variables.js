    
    
    


    // -------------------------------
    // Global variables object
    // -------------------------------

    var global = {

        art                     : {
            mainImage           : new Image (),
            mainSrc             : "",
        },

        data                    : {
            availableFonts      : [],
            fontSelectorConfigs : [],
            miscIconData        : {},
            disciplineData      : [],
            clanData            : [],
            frameMap            : [],
            typeMap             : {},
            symbolMap           : {},
            markdownTextmap     : {},
            markdownIconmap     : {},
        },

        util                    : {
            showError           : function(){},
            showOnloadError     : function(){},
            hexToRgba           : function(){},
            drawRoundedRect     : function(){},
            createLabel         : function(){},
            createNumberInput   : function(){},
            createToggle        : function(){},

        },

        text                    : {
            Word                : function (){},
            wrapText            : function (){},
        },

        json                    : {
            exportJson          : function(){},
            importJson          : function(){},
        },

        tests                   : {
            testAllImages       : function(){},
            testAllFonts        : function(){},
        },

        showLicensePopup        : function(){},
        darkPack                : function(){},
        renderDarkPackLogo      : function(){},

    };
