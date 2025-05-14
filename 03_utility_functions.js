    
    
    


    // -------------------------------
    // Utility functions
    // -------------------------------

    global.util = {

        showError : function (message) {
            const errorLog = document.getElementById("errorLog");

            // Ensure the error log is visible
            errorLog.style.display = "block";

            // Append the error message
            const errorMessage = document.createElement("div");
            errorMessage.textContent = message;
            errorLog.appendChild(errorMessage);

            // Auto-scroll to the bottom of the log
            errorLog.scrollTop = errorLog.scrollHeight;
        },

        showOnloadError : function (message) {
            const onloadErrorLog = document.getElementById("onloadErrorLog");

            // Ensure the onload error log is visible
            onloadErrorLog.style.display = "block";

            // Append the error message
            const errorMessage = document.createElement("div");
            errorMessage.textContent = message;
            onloadErrorLog.appendChild(errorMessage);

            // Auto-scroll to the bottom of the log
            onloadErrorLog.scrollTop = onloadErrorLog.scrollHeight;
        },

        hexToRgba : function (hex, opacity) {
            hex = hex.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        },

        drawRoundedRect : function (ctx, x, y, width, height, radius, stroke = 0) {
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
        },

        createLabel : function (forId, text) {
            const label = document.createElement("label");
            label.htmlFor = forId;
            label.innerText = text;
            return label;
        },

        // Helper function to create a number input
        createNumberInput : function (id, defaultValue = 0) {
            const input = document.createElement("input");
            input.type = "number";
            input.id = id;
            input.value = defaultValue;
            input.min = 0;
            return input;
        },

        // Helper function to create a toggle checkbox
        createToggle : function (id, input) {
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
        }

    };
    // END Utility Functions
