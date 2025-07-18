    
    
    


    // -------------------------------
    // Utility functions
    // -------------------------------

    

    global.util.showError = function (message) {
            const errorLog = document.getElementById("errorLog");

            // Ensure the error log is visible
            errorLog.style.display = "block";

            // Append the error message
            const errorMessage = document.createElement("div");
            errorMessage.textContent = message;
            errorLog.appendChild(errorMessage);

            // Auto-scroll to the bottom of the log
            errorLog.scrollTop = errorLog.scrollHeight;
    };

    global.util.showOnloadError = function (message) {
            const onloadErrorLog = document.getElementById("onloadErrorLog");

            // Ensure the onload error log is visible
            onloadErrorLog.style.display = "block";

            // Append the error message
            const errorMessage = document.createElement("div");
            errorMessage.textContent = message;
            onloadErrorLog.appendChild(errorMessage);

            // Auto-scroll to the bottom of the log
            onloadErrorLog.scrollTop = onloadErrorLog.scrollHeight;
    };

    global.util.hexToRgba = function (hex, opacity) {
            hex = hex.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    global.util.drawRoundedRect = function (ctx, x, y, width, height, radius, stroke = 0) {
            // Ensure all values are treated as numbers
            x = Number(x);
            y = Number(y);
            width = Number(width);
            height = Number(height);
            radius = Number(radius);
            stroke = Number(stroke);

            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.lineTo(x + radius, y + height);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();
            if (stroke > 0) { ctx.lineWidth = stroke; ctx.stroke(); }
            ctx.fill();
    };

    // Draw black border 
    global.util.drawBorders = function (ctx, canvas, margin) {
        let r = margin;
        let w = canvas.width - 2 * margin;
        let h = canvas.height - 2 * margin;
        let p = Math.PI;

        ctx.clearRect(0, 0, canvas.width, r);
        ctx.clearRect(0, 0, r, canvas.height);    
        ctx.clearRect(r + w, 0,r + w, canvas.height);
        ctx.clearRect(0, h + r, canvas.width, canvas.height);    
        
        ctx.save();
        ctx.lineWidth = margin * 2;
        ctx.strokeStyle = "black";
        
        ctx.beginPath();
        ctx.moveTo(r * 2, r);
        ctx.lineTo(w, r);
        ctx.arc(w, r * 2, r, 1.5 * p, 2 * p), 
        ctx.lineTo(1 * r + w, h);
        ctx.arc(w, h, r, 0 * p, 0.5 * p);
        ctx.lineTo(r * 2, 1 * r + h);
        ctx.arc(r * 2, h, r, 0.5 * p, 1 * p);
        ctx.lineTo(r, r * 2);
        ctx.arc(r * 2, r * 2, r, 1 * p, 1.5 * p);    
        ctx.closePath();
        
        ctx.stroke();
        ctx.restore();
    };    

    global.util.split_arr = function (array, num) {
        if (!array || typeof array.length !== 'number') {
                console.error("splitIntoChunksOf4: Invalid argument. Expected an array-like object.");
                return [];
        }

        if (array.length % num !== 0) { console.error ("array length incongruent with num. split_arr() at utility functions."); }
        
        // Calculate the number of chunks needed.
        const numChunks = Math.ceil(array.length / num);

        // Create an array with `numChunks` length, then map each index `i`
        // to a slice of the original array.
        return Array.from({ length: numChunks }, (_, i) =>
                Array.from(array.slice(i * num, i * num + num))
        );
    };

    global.util.createLabel = function (forId, text) {
        const label = document.createElement("label");
        label.htmlFor = forId;
        label.innerText = text;
        return label;
    };

        // Helper function to create a number input
    global.util.createNumberInput = function (id, defaultValue = 0) {
        const input = document.createElement("input");
        input.type = "number";
        input.id = id;
        input.value = defaultValue;
        input.min = 0;
        return input;
    };

        // Helper function to create a toggle checkbox
    global.util.createToggle = function (id, input) {
            const toggleDiv = document.createElement("div");
            toggleDiv.className = "cost-symbol-toggle";

            const toggleLabel = global.util.createLabel(`${id}Toggle`, "X:");
            const toggleCheckbox = document.createElement("input");
            toggleCheckbox.type = "checkbox";
            toggleCheckbox.id = `${id}Toggle`;

            // Toggle logic: Switch between 'X' and number
            toggleCheckbox.addEventListener("change", () => {
                if (toggleCheckbox.checked) {
                input.value = "X";
                input.disabled = true;
                } else {
                input.value = 0;
                input.disabled = false;
                }
            });

            toggleDiv.appendChild(toggleLabel);
            toggleDiv.appendChild(toggleCheckbox);
            return toggleDiv;
    };

    global.util.wrapImgPath = function(path) {
            
            const imgPath = "./img/";
            if (!path) return ""; // Handle empty or undefined paths

            if (path.startsWith(imgPath)) {
            global.util.showError(`Path already starts with:` + imgPath + `; ${path}`);
            return path; // Return the path as-is
            }

            return imgPath + `${path}`;
    };
    // END Utility Functions
