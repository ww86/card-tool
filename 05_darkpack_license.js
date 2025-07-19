  




  // -------------------------------
  // License Popup
  // -------------------------------

  global.showLicensePopup = function () {
    // Use a session variable to track if the popup has been shown
    let licensePopupShown = false;

    // Check if the popup has already been shown in this session
    if (licensePopupShown) {
      return; // Do not show the popup again
    }

    // License text stored in a variable with line breaks
    const licenseTextContent = `
      All of the image files may be copyrighted by 'Paradox Interactive AB'.<br>
      Make a pinkie promise not to use these image files in a way that breaks the law.<br><br>
      Fanmade content. The codebase: script.js, index.html and style.css are intended as free to use, but not properly licensed.
    `;

    // Show the popup
    const licensePopup = document.getElementById("licensePopup");
    const licenseText = document.getElementById("licenseText");
    const acceptButton = document.getElementById("acceptButton");
    const declineButton = document.getElementById("declineButton");

    licensePopup.style.display = "flex";

    // Set the license text with line breaks
    licenseText.innerHTML = licenseTextContent;

    // Add the image below the license text
    const licenseImage = document.createElement("img");
    licenseImage.src = "license_001.png"; // Path to the image
    licenseImage.alt = "License Image";
    licenseImage.style.marginTop = "20px"; // Add some spacing
    licenseImage.style.maxWidth = "100%"; // Ensure the image fits within the popup
    licenseImage.style.height = "auto"; // Maintain aspect ratio

    // Append the image to the license text container
    licenseText.appendChild(licenseImage);

    // Add links below the image
    const linksContainer = document.createElement("div");
    linksContainer.style.marginTop = "20px"; // Add spacing above the links
    linksContainer.style.textAlign = "center"; // Center-align the links

    // Paradox Interactive AB link
    const paradoxLink = document.createElement("a");
    paradoxLink.href = "https://www.paradoxinteractive.com/";
    paradoxLink.target = "_blank"; // Open in a new tab
    paradoxLink.textContent = "Paradox Interactive AB";
    paradoxLink.style.display = "block"; // Display as a block for vertical stacking
    paradoxLink.style.color = "#007bff"; // Optional: Add link color
    paradoxLink.style.textDecoration = "none"; // Optional: Remove underline
    paradoxLink.style.marginBottom = "10px"; // Add spacing between links

    // Dark Pack license information link
    const darkPackLink = document.createElement("a");
    darkPackLink.href = "https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement";
    darkPackLink.target = "_blank"; // Open in a new tab
    darkPackLink.textContent = "Dark Pack License Information";
    darkPackLink.style.display = "block"; // Display as a block for vertical stacking
    darkPackLink.style.color = "#007bff"; // Optional: Add link color
    darkPackLink.style.textDecoration = "none"; // Optional: Remove underline
    darkPackLink.style.marginBottom = "10px"; // Add spacing between links

    // World of Darkness website link
    const wodLink = document.createElement("a");
    wodLink.href = "https://www.worldofdarkness.com/";
    wodLink.target = "_blank"; // Open in a new tab
    wodLink.textContent = "World of Darkness";
    wodLink.style.display = "block"; // Display as a block for vertical stacking
    wodLink.style.color = "#007bff"; // Optional: Add link color
    wodLink.style.textDecoration = "none"; // Optional: Remove underline
    wodLink.style.marginBottom = "10px";     

    // Black Chantry Productions website link
    const blackChantryLink = document.createElement("a");
    blackChantryLink.href = "https://www.blackchantry.com/";
    blackChantryLink.target = "_blank"; // Open in a new tab
    blackChantryLink.textContent = "Black Chantry Productions";
    blackChantryLink.style.display = "block"; // Display as a block for vertical stacking
    blackChantryLink.style.color = "#007bff"; // Optional: Add link color
    blackChantryLink.style.textDecoration = "none"; // Optional: Remove underline    
    blackChantryLink.style.marginBottom = "10px"; 

    // VTES Discord server link
    const discordLink = document.createElement("a");
    discordLink.href = "https://discord.com/invite/vampire-the-eternal-struggle-official-887471681277399091"; // Replace with the actual invite link
    discordLink.target = "_blank"; // Open in a new tab
    discordLink.textContent = "VTES Discord Server";
    discordLink.style.display = "block"; // Display as a block for vertical stacking
    discordLink.style.color = "#007bff"; // Optional: Add link color
    discordLink.style.textDecoration = "none"; // Optional: Remove underline
    discordLink.style.marginBottom = "10px"; // Add spacing between links    

    // Append links to the container
    linksContainer.appendChild(paradoxLink);
    linksContainer.appendChild(darkPackLink);
    linksContainer.appendChild(wodLink);
    linksContainer.appendChild(blackChantryLink);    
    linksContainer.appendChild(discordLink);    

    // Append the links container to the license text container
    licenseText.appendChild(linksContainer);

    // Handle Accept button
    acceptButton.addEventListener("click", function () {
      licensePopup.style.display = "none"; // Hide the popup
      licensePopupShown = true; // Mark the popup as shown
    });

    // Handle Decline button
    declineButton.addEventListener("click", function () {
      alert("You must accept the license to use this application.");
    });
  };


  
  // -------------------------------
  // Generate dark pack logo ui (Checked by default).
  // -------------------------------

  global.darkPack = function () {
    const darkPackControls          = document.createElement("div");
    const darkPackToggleLabel       = document.createElement("label");
    const darkPackToggle            = document.createElement("input");
    const darkPackXLabel            = document.createElement("label");
    const darkPackXInput            = document.createElement("input");
    const darkPackYLabel            = document.createElement("label");
    const darkPackYInput            = document.createElement("input");
    const darkPackHLabel            = document.createElement("label");
    const darkPackHInput            = document.createElement("input");
    const darkPackWLabel            = document.createElement("label");
    const darkPackWInput            = document.createElement("input");
    
    darkPackControls.className      = "inline-selector";

    // Toggle for On/Off
    darkPackToggleLabel.htmlFor     = "darkPackToggle";
    darkPackToggleLabel.innerText   = "On:";
    darkPackToggle.type             = "checkbox";
    darkPackToggle.id               = "darkPackToggle";
    darkPackToggle.checked          = true; // Default value

    // X Position
    darkPackXLabel.htmlFor          = "darkPackX";
    darkPackXLabel.innerText        = "X:";  
    darkPackXInput.type             = "number";
    darkPackXInput.id               = "darkPackX";
    darkPackXInput.value            = 328; // Default value
    darkPackXInput.min              = 0;

    // Y Position
    darkPackYLabel.htmlFor          = "darkPackY";
    darkPackYLabel.innerText        = "Y:";
    darkPackYInput.type             = "number";
    darkPackYInput.id               = "darkPackY";
    darkPackYInput.value            = 13; // Default value
    darkPackYInput.min              = 0;

    // Size Height
    darkPackHLabel.htmlFor          = "darkPackH";
    darkPackHLabel.innerText        = "H:";
    darkPackHInput.type             = "number";
    darkPackHInput.id               = "darkPackH";
    darkPackHInput.value            = 18; // Default value
    darkPackHInput.min              = 1;

    // Size Width
    darkPackWLabel.htmlFor          = "darkPackW";
    darkPackWLabel.innerText        = "W:";
    darkPackWInput.type             = "number";
    darkPackWInput.id               = "darkPackW";
    darkPackWInput.value            = 0; // Default value
    darkPackWInput.min              = 0;

    // Append all controls to the container
    darkPackControls.appendChild(darkPackToggleLabel);
    darkPackControls.appendChild(darkPackToggle);
    darkPackControls.appendChild(darkPackXLabel);
    darkPackControls.appendChild(darkPackXInput);
    darkPackControls.appendChild(darkPackYLabel);
    darkPackControls.appendChild(darkPackYInput);
    darkPackControls.appendChild(darkPackHLabel);
    darkPackControls.appendChild(darkPackHInput);
    darkPackControls.appendChild(darkPackWLabel);
    darkPackControls.appendChild(darkPackWInput);

    return darkPackControls;

  };


  // -------------------------------
  // Render the Dark Pack logo
  // -------------------------------

  global.renderDarkPackLogo = function (ctx) {
    const toggle = document.getElementById("darkPackToggle");
    if (!toggle || !toggle.checked) { return; }

    const x = parseFloat(document.getElementById("darkPackX").value) || 0;
    const y = parseFloat(document.getElementById("darkPackY").value) || 0;
    const sizeH = parseFloat(document.getElementById("darkPackH").value) || 50; // Default height
    const sizeW = parseFloat(document.getElementById("darkPackW").value) || 0; // Default width (0 means preserve proportions)   

    // Get the image path for the Dark Pack logo
    const logoSrc = "symbol_dark_pack_logo_bw.png";

    // Load the image
    const logoImage = new Image();
    logoImage.src = logoSrc;

    logoImage.onload = function () {
      if (logoImage.width > 0 && logoImage.height > 0) {
        // Calculate the width and height
        let renderWidth = sizeW > 0 ? sizeW : sizeH * (logoImage.width / logoImage.height); // Use sizeW if defined, otherwise preserve proportions
        let renderHeight = sizeH;

        // Draw the logo on the canvas
        ctx.save();
        ctx.drawImage(logoImage, x, y, renderWidth, renderHeight);
        ctx.restore();
      } else {
        console.error("Dark Pack logo image has invalid dimensions:", logoImage.width, logoImage.height);
      }
    };

    logoImage.onerror = function () {
      console.error("Failed to load the Dark Pack logo image.");
    };
  };