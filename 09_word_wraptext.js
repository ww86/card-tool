




// ------------------------------------------------------------------
// global.text.wrapText function, code was written by Google Gemini
// ------------------------------------------------------------------

if (typeof global === 'undefined') {
    // This is a simplified mock for environments where 'global' might not be fully set up,
    // e.g., during isolated testing. In the actual application, 'global' is populated by other scripts.
    global = {
        util: {
            showError: console.error,
            wrapImgPath: (path) => `./img/${path}` // Adjust if your img folder is elsewhere
        },
        data: {
            markdownIconMap: { /* Mock data can be added here for testing */ }
        }
    };
}

if (!global.text) global.text = {};

/**
 * Renders text onto a canvas, handling markdown for styles, newlines, icons, and text wrapping.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
 * @param {string} text - The text string to render, possibly containing markdown.
 * @param {number} x - The x-coordinate for the start of the text block.
 * @param {number} y - The y-coordinate for the baseline of the first line of text.
 * @param {number} maxWidth - The maximum width the text can occupy before wrapping.
 * @param {number} lineHeight - The height of each line of text (used for vertical spacing and icon scaling).
 * @param {number} effect - Text effect: 0 (none), 1 (outline), 2 (shadow), 3 (stronger shadow), 4 (soft colored glow), 5 (hard offset shadow), 6 (white outline + dark shadow).
 * @param {string} font - The base font string (e.g., "16px Arial", "bold 12px Verdana").
 *                         The font size specified here will be used for rendering.
 * @param {string} fontColor - The color of the text (e.g., "#RRGGBB", "rgba(...)").
 */
global.text.wrapText = function(ctx, text, x, y, maxWidth, lineHeight, effect, font, fontColor) {
    if (!ctx || typeof text !== "string" || text === null) {
        global.util.showError('wrapText: Invalid arguments (ctx or text).');
        return;
    }
    if (lineHeight <= 0) {
        global.util.showError('wrapText: lineHeight must be positive.');
        return;
    }
    if (maxWidth <= 0) {
        // global.util.showError('wrapText: maxWidth must be positive. Rendering without wrapping.');
        // Allow rendering very short text if maxWidth is too small, but it might look odd.
    }

    // --- Helper Functions ---

    function parseInitialFont(fontStr, baseLineHeight) {
        const style = {
            size: baseLineHeight, // Use lineHeight as the authoritative size for styling
            family: "Arial",
            isBold: false,
            isItalic: false
        };

        if (typeof fontStr === 'string' && fontStr.trim() !== '') {
            let tempFontStr = fontStr.trim();

            if (/\bbold\b/i.test(tempFontStr)) {
                style.isBold = true;
                tempFontStr = tempFontStr.replace(/\bbold\b/i, "").trim();
            }
            if (/\bitalic\b/i.test(tempFontStr)) {
                style.isItalic = true;
                tempFontStr = tempFontStr.replace(/\bitalic\b/i, "").trim();
            }

            // Regex to extract font size and font family
            const sizeFamilyRegex = /^(\d+)(?:px|pt|em|rem|%)?\s*(.+)$/i;
            let match = tempFontStr.match(sizeFamilyRegex);
            if (match) {
                // style.size = parseInt(match[1], 10); // We use baseLineHeight for consistency
                style.family = match[2].trim();
            } else if (tempFontStr) { // Assume what's left is the font family only
                style.family = tempFontStr;
            }
        }
        return style;
    }

    function buildFontString(currentStyle) {
        return `${currentStyle.isItalic ? 'italic ' : ''}${currentStyle.isBold ? 'bold ' : ''}${currentStyle.size}px ${currentStyle.family}`;
    }

    // --- Main Logic ---

    const initialFont = parseInitialFont(font, lineHeight);
    let currentStyle = {
        family: initialFont.family,
        size: initialFont.size, // This is effectively lineHeight for styling text
        isBold: initialFont.isBold,
        isItalic: initialFont.isItalic,
        color: fontColor,
        effect: effect
    };

    const tokens = String(text).split(/(\[n\])|(\[b\])|(\[\/b\])|(\[i\])|(\[\/i\])|(\[[a-zA-Z]{3}\])|([^\s\[\]]+)|(\s+)/g).filter(token => token && token.length > 0);

    const renderableElements = [];
    tokens.forEach(token => {
        if (token === "[n]") {
            renderableElements.push({ type: 'newline' });
        } else if (token === "[b]") {
            currentStyle.isBold = true;
        } else if (token === "[/b]") {
            currentStyle.isBold = false;
        } else if (token === "[i]") {
            currentStyle.isItalic = true;
        } else if (token === "[/i]") {
            currentStyle.isItalic = false;
        } else if (global.data.markdownIconMap && global.data.markdownIconMap[token]) {
            const iconSrc = global.util.wrapImgPath(global.data.markdownIconMap[token]);
            const tokenContent = token.substring(1, token.length - 1);
            const isSuperior = tokenContent === tokenContent.toUpperCase();
            renderableElements.push({
                type: 'icon',
                src: iconSrc,
                isSuperior: isSuperior,
                style: { ...currentStyle },
                originalToken: token
            });
        } else if (/\s+/.test(token) && token.length > 0) {
            renderableElements.push({ type: 'space', text: token, style: { ...currentStyle } });
        } else if (token.length > 0) { // Word
            renderableElements.push({ type: 'text', text: token, style: { ...currentStyle } });
        }
    });

    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;

    ctx.save();
    renderableElements.forEach(element => {
        let elWidth = 0;
        let elHeight = element.style ? element.style.size : lineHeight;

        if (element.type === 'text' || element.type === 'space') {
            ctx.font = buildFontString(element.style);
            elWidth = ctx.measureText(element.text).width;
        } else if (element.type === 'icon') {
            const iconScaleFactor = element.isSuperior ? 1.25 : 1.0;
            elHeight = (element.style.size || lineHeight) * iconScaleFactor; // Overall size based on text height
            elWidth = elHeight; // Assume icons are roughly square after scaling
        } else if (element.type === 'newline') {
            lines.push(currentLine);
            currentLine = [];
            currentLineWidth = 0;
            return;
        }

        element.width = elWidth;
        element.height = elHeight; // Store effective height for icons

        if (maxWidth > 0 && currentLineWidth + elWidth > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = [element];
            currentLineWidth = elWidth;
        } else {
            currentLine.push(element);
            currentLineWidth += elWidth;
        }
    });
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }
    ctx.restore();

    let currentY = y;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    lines.forEach(line => {
        let currentX = x;
        line.forEach(element => {
            if (!element.style && (element.type === 'text' || element.type === 'space' || element.type === 'icon')) {
                // Fallback if style somehow didn't get attached (should not happen with current logic)
                element.style = currentStyle;
            }

            ctx.save();
            ctx.fillStyle = element.style.color;
            ctx.font = buildFontString(element.style);

            if (element.type === 'text' || element.type === 'space') {
                const effectToApply = element.style.effect;
                if (effectToApply === 1) { // Outline

                    ctx.lineJoin = "round";
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
                    ctx.lineWidth = 3.0;
                    ctx.strokeText(element.text, currentX, currentY);
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
                    ctx.lineWidth = 2.5;
                    ctx.strokeText(element.text, currentX, currentY);   
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.lineWidth = 2.2;
                    ctx.strokeText(element.text, currentX, currentY);                                       
                    ctx.fillText(element.text, currentX, currentY); 

                } else if (effectToApply === 2) { // Shadow

                    ctx.shadowColor = "rgba(0,0,0,0.5)";
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowBlur = 2;
                    ctx.fillText(element.text, currentX, currentY);

                } else if (effectToApply === 3) { // Stronger Shadow

                    ctx.shadowColor = "rgba(0,0,0,0.50)";
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowBlur = 4;
                    ctx.fillText(element.text, currentX, currentY);   
                    ctx.shadowColor = "rgba(0, 0, 0, 0.70)";
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowBlur = 2;
                    ctx.fillText(element.text, currentX, currentY);                       

                } else if (effectToApply === 4) { // Soft Colored Glow (e.g., soft blue)

                    ctx.shadowColor = "rgba(100, 100, 255, 0.6)";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 8;                    
                    ctx.strokeStyle = "rgba(100, 100, 255, 0.25)";
                    ctx.lineWidth = 3.0;
                    ctx.strokeText(element.text, currentX, currentY);  

                    ctx.shadowColor = "rgba(100, 100, 255, 0.6)";
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 8;
                    ctx.fillText(element.text, currentX, currentY);          

                } else if (effectToApply === 5) { // Drop shadow and outline

                    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                    ctx.shadowOffsetX = 0; // Adjust for desired offset
                    ctx.shadowOffsetY = 1; // Adjust for desired offset
                    ctx.shadowBlur = 3; // No blur for a hard edge
                    ctx.lineWidth = 2.0;
                    ctx.lineJoin = "round";
                    ctx.strokeStyle = "black";
                    ctx.strokeText(element.text, currentX, currentY);  
                    ctx.fillText(element.text, currentX, currentY);        

                } else if (effectToApply === 6) { // Fancy: White Outline + Soft Dark Drop Shadow

                    // Draw the white outline first
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
                    ctx.lineWidth = 3.0; // Adjust thickness as needed
                    ctx.lineJoin = "round"; // For smoother stroke corners
                    ctx.strokeText(element.text, currentX, currentY);

                    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
                    ctx.shadowOffsetX = 0; // Adjust for desired offset
                    ctx.shadowOffsetY = 0; // Adjust for desired offset
                    ctx.shadowBlur = 2; // No blur for a hard edge

                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 1.5; // Adjust thickness as needed
                    ctx.lineJoin = "round"; // For smoother stroke corners
                    ctx.strokeText(element.text, currentX, currentY);  

                    // Then set up the shadow for the main fillText
                    ctx.shadowColor = "rgba(0,0,0,0.5)";
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowBlur = 3;
                    ctx.fillText(element.text, currentX, currentY);

                } else { 
                    ctx.fillText(element.text, currentX, currentY); 
                }

            }
                // The fillText is always called, applying any shadow set above,
                // and drawing the main text color (potentially over a stroke if effect 1 or 6 was used).
                
            if (element.type === 'icon') {
                const img = new Image();
                img.src = element.src;

                const drawX = currentX;
                const iconRenderSize = element.height; // element.height already has superiority scaling
                
                // Align icon top with roughly the top of lowercase letters, or slightly above.
                // textBaseline "alphabetic" means y is the baseline.
                // Icon top: y - ascender_height. A common ascender ratio is ~0.75-0.8 of fontSize.
                // So, icon top = y - (fontSize * 0.75)
                // To center icon vertically with cap height: y - cap_height + (cap_height - icon_height)/2
                // Simpler: align bottom of icon with text baseline, then shift up slightly.
                // Or, align icon center with (y - fontSize/2)
                // From relic.js: yBaseline - 0.75 * iconHeight - 1 (for icon top)
                const drawYIconTop = currentY - (iconRenderSize * 0.75) - (element.style.size * 0.1); // Adjusting this for better alignment

                img.onload = () => {
                    // Create a closure for ctx to ensure it's the correct one if multiple wrapText calls interleave
                    (function(context, image, xPos, yPos, w, h) {
                        context.drawImage(image, xPos, yPos, w, h);
                    })(ctx, img, drawX, drawYIconTop, iconRenderSize, iconRenderSize);
                };
                img.onerror = () => {
                    global.util.showError(`wrapText: Failed to load icon ${element.originalToken} (${element.src})`);
                    const placeholderStyle = element.style;
                    // Create a closure for ctx for the error case too
                    (function(context, tokenText, xPos, yPos, style) {
                        context.font = buildFontString(style);
                        context.fillStyle = style.color;
                        context.fillText(tokenText, xPos, yPos);
                    })(ctx, element.originalToken, drawX, currentY, placeholderStyle);
                };
            }

            ctx.restore();
            currentX += element.width;

        });
        currentY += lineHeight;
    });
};