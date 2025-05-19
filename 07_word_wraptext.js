




// -------------------------------
// Word constructor function
// -------------------------------
global.text.Word = function (text, font, fontColor, effect) {

    if (typeof effect !== "number") { global.util.showError("Word constructor argument 'effect'  is not a number"); }

    this.text       = text; 
    this.effect     = effect; 
    this.font       = "Arial"; 
    this.fontSize   = 12;
    this.fontColor  = fontColor;  
    this.italic     = false; 
    this.bold       = false; 
    
    // Properties related to canvas measurement
    this.measured   = false; // True once ctx.measureText() is called
    this.width      = 0;        // Measured width of the word in pixels
    
    // Parse the font string if provided
    if (typeof font === 'string' && font.trim() !== '') {
        let styleString = font.trim(); // Work with a trimmed copy
        
        // Check for 'bold' keyword (case-insensitive, whole word)
        if (/\bbold\b/i.test(styleString)) {
            this.bold = true;
            styleString = styleString.replace(/\bbold\b/i, "").trim(); // Remove 'bold'
        }
        
        // Check for 'italic' keyword (case-insensitive, whole word)
        if (/\bitalic\b/i.test(styleString)) {
            this.italic = true;
            styleString = styleString.replace(/\bitalic\b/i, "").trim(); // Remove 'italic'
        }
        
        // After removing bold/italic, styleString should contain font-size and/or font-family
        // e.g., "16px Arial", "12pt Times New Roman", "Arial", "16px"
        
        if (styleString) { // If there's anything left to parse
            // Regex to extract font size and font family
            // e.g., "16px Arial", "12pt Times New Roman"
            const sizeFamilyRegex = /^(\d+)\s*(?:px|pt|em|rem|%)?\s*(.+)$/i;
            let match = styleString.match(sizeFamilyRegex);
            
            if (match) {
                // Matched both size and family
                this.fontSize = parseInt(match[1], 10);
                this.font = match[2].trim();
            } else {
                // Did not match "size family", try "size only" or "family only"
                const sizeOnlyRegex = /^(\d+)\s*(?:px|pt|em|rem|%)?$/i;
                match = styleString.match(sizeOnlyRegex);
                
                if (match) {
                    // Matched size only
                    this.fontSize = parseInt(match[1], 10);
                    // this.font remains the default ("Arial")
                } else {
                    // Assume what's left is the font family only
                    this.font = styleString.trim();
                    // this.fontSize remains the default (12)
                }
            }
        }
        // If styleString became empty after removing bold/italic (e.g., font was "bold italic"),
        // font and fontSize will correctly use their defaults.
    }
};



  // -------------------------------
  // wrapText function
  // -------------------------------

global.text.wrapText = function (ctx, text, x, y, maxWidth, lineHeight, antialias) {

    function renderIcon (ctx, iconSrc, x, y, size) {
        const img = new Image();
        img.src = iconSrc;
        img.onload = () => {
        ctx.drawImage(img, x, y - 0.8 * size - 1, size * 1.2, size * 1.2); // Adjust vertical alignment
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

  };



  // -------------------------------
  // NEW wrapText function
  // -------------------------------

  global.text.newWrapText = function (ctx, text, x, y, maxWidth, lineHeight, effect, font, fontColor) {

    if (!ctx || typeof text !== "string") { global.util.showError('Invalid arguments to wrapText'); return; }

    function renderWord(ctx, word, x, y) {
        if (!(word instanceof global.text.Word)) {
            global.util.showError("renderWord called with non-Word element");
            return;
        }
        ctx.save();
        ctx.textAlign = "left";  
        ctx.textBaseline = "alphabetic";    

        ctx.fillStyle = word.fontColor;
        let fontStyle = "";
        if (word.bold) fontStyle += "bold ";
        if (word.italic) fontStyle += "italic ";
        fontStyle += `${word.fontSize}px ${word.font}`;
        ctx.font = fontStyle;

        console.log(word.effect);
        if (word.effect >   0     )       { ctx.lineWidth     = word.effect;        }
        if (word.effect >   1     )       { ctx.shadowOffsetX = 0;                  }
        if (word.effect >   1     )       { ctx.shadowOffsetY = 1;                  }
        if (word.effect >   1     )       { ctx.shadowBlur    = 3;                  }
        if (word.effect >   1     )       { ctx.shadowColor   = "#000000EE";        }
        if (word.effect >   0     )       { ctx.strokeText(word.text, x, y);        }

        ctx.fillText(word.text, x, y);
        ctx.restore();
    }

    function renderIcon(ctx, iconSrc, x, y, size) {
        const img = new Image();
        img.src = iconSrc;
        img.onload = () => {
        ctx.save();
        ctx.drawImage(img, x, y - 0.8 * size - 1, size * 1.2, size * 1.2); // Adjust vertical alignment
        ctx.restore();
        };
    };

    // splits text like "car[b] is[n]a"" to an array like ["car", "[b]", "is", "[n]", "a"]
    function initialParse (text) {
        const wordStrings   = text.split(" ");
        const segments      = wordStrings.flatMap(word => word.split(/(?=\[.*?\])|(?<=\])/));
        return segments;
    };

    function effectSwitch(effect)       { 
                                            if (effect === "none") { return 0; }
                                            if (effect === "aa1")  { return 1; }
                                            if (effect === "aa2")  { return 2; }
                                            if (effect === "aa3")  { return 3; }
                                            return 0;
                                        };

    function isToken(string)            { return (typeof string === "string") && string.startsWith("[") && string.endsWith("]");    };
    function isWord(element)            { return (element instanceof global.text.Word);             };

    function isNewline(x)               { return (x === "[n]");                                     };

    function isBold(w)                  { return (w === "[b]");                                     };
    function isBoldClose(w)             { return (w === "[/b]");                                    };

    function isItalic(w)                { return (w === "[i]" );                                    };
    function isItalicClose(w)           { return (w === "[/i]");                                    };      

    // Nightmare reduce method 
    function reducer(f, arr)            { return arr.reduce(f,{ is : false, indices : [], });       };

    function helpBoldReduce(w,e,i)      {
                                          if (isBold(e))        { w.is = true;  return w;       };                      
                                          if (isBoldClose(e))   { w.is = false; return w;       };                      
                                          if (isToken(e))       { return w;                                             }
                                          if (w.is === true)    { w.is = true; w.indices.push(i); return w;             } 
                                          if (w.is === false)   { return w;                                             }
                                        };

    function helpItalicReduce(w,e,i)    {
                                          if (isItalic(e))      { w.is = true;  return w;       };                      
                                          if (isItalicClose(e)) { w.is = false; return w;       };                      
                                          if (isToken(e))       { return w;                                             }
                                          if (w.is === true)    { w.is = true; w.indices.push(i); return w;             } 
                                          if (w.is === false)   { return w;                                             }
                                        };                                                                    

    function boldWords  (arr, segment)  { const r = [...segment]; arr.forEach(e => r[e].bold   = true); return r;   };
    function italicWords(arr, segment)  { const r = [...segment]; arr.forEach(e => r[e].italic = true); return r;   };
    // End of nightmare reduce method

    function processText(segments, font, fontColor, effect) {       
        return segments.flatMap(segment => isToken(segment) ? segment : new global.text.Word(segment, font, fontColor, effect));
    };

    function notBoldOrItalic(x)           { return !isBold(x) && !isItalic(x) && !isBoldClose(x) && !isItalicClose(x); }

    function arraySplit(arr, fDelimiter ) {


        let returnValue     = [];
        let indices         = arr.map( (x,i) => fDelimiter(x) ? i : -1).filter(x=>(x !== -1)); 
        indices             = indices.concat(arr.length);

        if (indices[0] !== 0) { indices  = [0].concat(indices); }

        // Filter pair => pair , removes any `null` values
        const overlappingPairs = indices.map((_, i) => i < indices.length - 1 ? [indices[i], indices[i + 1]] : null).filter(pair => pair); 

        overlappingPairs.forEach(pair => { returnValue.push(arr.slice(pair[0], pair[1])); });
        returnValue = returnValue.filter(x => !fDelimiter(x));

        return returnValue;

    };

    function isIconToken(str) {
        return typeof str === 'string' && global.data.markdownIconMap && global.data.markdownIconMap[str];
    };

    function getElementWidth(element, context, lHeight) {
        if (element instanceof global.text.Word) {
            if (!element.measured) {
                context.save();
                let fontStyle = "";
                if (element.bold) fontStyle += "bold ";
                if (element.italic) fontStyle += "italic ";
                fontStyle += `${element.fontSize}px ${element.font}`; // Word constructor parses styleArg to these
                context.font = fontStyle;
                element.width = context.measureText(element.text).width;
                element.measured = true;
                context.restore();
            }
            return element.width;
        } else if (isIconToken(element)) {
            return lHeight; // Assume icon width is lineHeight
        }
        return 0;
    };    

    function measureAndBreakLines(potentialLines, context, mWidth, lHeight) {
        const allRenderableLines = [];
        for (const pLine of potentialLines) {
            if (pLine.length === 0) { // Handle empty lines from [n][n] etc.
                allRenderableLines.push([]);
                continue;
            }
            let currentLineElements = [];
            let currentLineWidth = 0;
            for (const element of pLine) {
                const elementWidth = getElementWidth(element, context, lHeight);
                if (elementWidth === 0 && !(element instanceof global.text.Word && element.text.trim() === '')) continue; // Skip zero-width non-space elements

                if (currentLineWidth + elementWidth > mWidth && currentLineElements.length > 0) {
                    allRenderableLines.push(currentLineElements);
                    currentLineElements = [element];
                    currentLineWidth = elementWidth;
                } else {
                    currentLineElements.push(element);
                    currentLineWidth += elementWidth;
                }
            }
            if (currentLineElements.length > 0) {
                allRenderableLines.push(currentLineElements);
            }
        }
        return allRenderableLines;
    };

    function renderFinalLines(finalLineSegments, context, startX, startY, lHeight) {
        let currentYPos = startY;
        for (const lineArray of finalLineSegments) {
            let currentXPos = startX;
            if (lineArray.length === 0) { // Handle intentionally blank lines by advancing Y
                currentYPos += lHeight;
                continue;
            }
            for (const element of lineArray) {
                if (element instanceof global.text.Word) {
                    renderWord(context, element, currentXPos, currentYPos);
                    currentXPos += element.width;
                } else if (isIconToken(element)) {
                    const iconFileName = global.util.wrapImgPath(global.data.markdownIconMap[element]);
                    console.log(iconFileName);
                    if (iconFileName) { renderIcon(context, iconFileName, currentXPos, currentYPos, lHeight); currentXPos += lHeight; }
                } else if (typeof element === 'string' && element.trim() === '') { currentXPos += context.measureText(' ').width; } // Handle spaces
            }
            currentYPos += lHeight;
        }
    };    


    // Pipeline

    const parsed                = initialParse(text).filter(x => (x !== ""));
    const words                 = processText(parsed, font, fontColor, effectSwitch(effect));
    
    const boldWordsIndexArray   = reducer(helpBoldReduce, words).indices;
    const italicWordsIndexArray = reducer(helpItalicReduce, words).indices;

    const bWords                = boldWords(boldWordsIndexArray, words);
    const iWords                = italicWords(italicWordsIndexArray, bWords);

    const stripTagWords         = iWords.filter(notBoldOrItalic);
    const lines                 = arraySplit(stripTagWords, isNewline);
    const lines2                = (isNewline(stripTagWords[0])) ? [].concat(lines) : lines
    const lines3                = lines2.filter(x => !(isNewline(x)));

    const measureAndSplit       = measureAndBreakLines(lines2, ctx, maxWidth, lineHeight);

    renderFinalLines(measureAndSplit, ctx, x, y, lineHeight);

  };


