"use strict";



// -------------------------------
// Utility functions
// -------------------------------

function showError(message) {
    const errorLog = document.getElementById("errorLog");

    // Ensure the error log is visible
    errorLog.style.display = "block";

    // Append the error message
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorLog.appendChild(errorMessage);

    // Auto-scroll to the bottom of the log
    errorLog.scrollTop = errorLog.scrollHeight;
}

function showOnloadError(message) {
    const onloadErrorLog = document.getElementById("onloadErrorLog");

    // Ensure the onload error log is visible
    onloadErrorLog.style.display = "block";

    // Append the error message
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    onloadErrorLog.appendChild(errorMessage);

    // Auto-scroll to the bottom of the log
    onloadErrorLog.scrollTop = onloadErrorLog.scrollHeight;
}

(function () {
    const logError = (message) => {
        const errorLog = document.getElementById("errorLog");
        if (errorLog) {
            errorLog.style.display = "block";
            const errorMessage = document.createElement("div");
            errorMessage.textContent = message;
            errorLog.appendChild(errorMessage);
            errorLog.scrollTop = errorLog.scrollHeight;
        }
    };

    window.addEventListener("error", (event) => {
        console.error(event.message, event.error);
        logError(`Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    });

    window.addEventListener("unhandledrejection", (event) => {
        console.error("Unhandled Promise Rejection:", event.reason);
        logError(`Unhandled Promise Rejection: ${event.reason}`);
    });
})();



function hexToRgba(hex, opacity) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}



function drawRoundedRect(ctx, x, y, width, height, radius, stroke = 0) {
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
}

function createLabel(forId, text) {
  const label = document.createElement("label");
  label.htmlFor = forId;
  label.innerText = text;
  return label;
}

// Helper function to create a number input
function createNumberInput(id, defaultValue = 0) {
  const input = document.createElement("input");
  input.type = "number";
  input.id = id;
  input.value = defaultValue;
  input.min = 0;
  return input;
}

// Helper function to create a toggle checkbox
function createToggle(id, input) {
  const toggleDiv = document.createElement("div");
  toggleDiv.className = "cost-symbol-toggle";

  const toggleLabel = createLabel(`${id}Toggle`, "X:");
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

// END Utility Functions



document.addEventListener("DOMContentLoaded", function () {
  // Global variables for the main art image & its original source.
  const mainArtImage = new Image();
  mainArtImage.crossOrigin = "anonymous";
  let originalArtSrc = "";
  let frameImage = null;
  let frameBgImage = null;
  const imgPath = "./img/";

  function wrapImgPath(path) {
    if (!path) return ""; // Handle empty or undefined paths

    if (path.startsWith(imgPath)) {
      showError(`Path already starts with:` + imgPath + `; ${path}`);
      return path; // Return the path as-is
    }

    return imgPath + `${path}`;
  }


  // -------------------------------
  // License Popup
  // -------------------------------

  function showLicensePopup() {
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
  }

  showLicensePopup();



  // -------------------------------
  // Data tables & Maps
  // -------------------------------

  const disciplineData = [
      { id: "disciplineAbombwe",      label: "Abombwe",      img_1_src: "icon_discipline_abombwe_inferior.png",      img_2_src: "icon_discipline_abombwe_superior.png",      img_3_src: "icon_discipline_abombwe_other.png",      img_4_src: "icon_discipline_abombwe_inferior_innate.png",      img_5_src: "icon_discipline_abombwe_superior_innate.png",      img_6_src: "icon_discipline_abombwe_other_innate.png" },
      { id: "disciplineAuspex",       label: "Auspex",       img_1_src: "icon_discipline_auspex_inferior.png",       img_2_src: "icon_discipline_auspex_superior.png",       img_3_src: "icon_discipline_auspex_other.png",       img_4_src: "icon_discipline_auspex_inferior_innate.png",       img_5_src: "icon_discipline_auspex_superior_innate.png",       img_6_src: "icon_discipline_auspex_other_innate.png" },
      { id: "disciplineAnimalism",    label: "Animalism",    img_1_src: "icon_discipline_animalism_inferior.png",    img_2_src: "icon_discipline_animalism_superior.png",    img_3_src: "icon_discipline_animalism_other.png",    img_4_src: "icon_discipline_animalism_inferior_innate.png",    img_5_src: "icon_discipline_animalism_superior_innate.png",    img_6_src: "icon_discipline_animalism_other_innate.png" },
      { id: "disciplineCelerity",     label: "Celerity",     img_1_src: "icon_discipline_celerity_inferior.png",     img_2_src: "icon_discipline_celerity_superior.png",     img_3_src: "icon_discipline_celerity_other.png",     img_4_src: "icon_discipline_celerity_inferior_innate.png",     img_5_src: "icon_discipline_celerity_superior_innate.png",     img_6_src: "icon_discipline_celerity_other_innate.png" },
      { id: "disciplineChimerstry",   label: "Chimerstry",   img_1_src: "icon_discipline_chimerstry_inferior.png",   img_2_src: "icon_discipline_chimerstry_superior.png",   img_3_src: "icon_discipline_chimerstry_other.png",   img_4_src: "icon_discipline_chimerstry_inferior_innate.png",   img_5_src: "icon_discipline_chimerstry_superior_innate.png",   img_6_src: "icon_discipline_chimerstry_other_innate.png" },
      { id: "disciplineDaimonion",    label: "Daimonion",    img_1_src: "icon_discipline_daimonion_inferior.png",    img_2_src: "icon_discipline_daimonion_superior.png",    img_3_src: "icon_discipline_daimonion_other.png",    img_4_src: "icon_discipline_daimonion_inferior_innate.png",    img_5_src: "icon_discipline_daimonion_superior_innate.png",    img_6_src: "icon_discipline_daimonion_other_innate.png" },
      { id: "disciplineDementation",  label: "Dementation",  img_1_src: "icon_discipline_dementation_inferior.png",  img_2_src: "icon_discipline_dementation_superior.png",  img_3_src: "icon_discipline_dementation_other.png",  img_4_src: "icon_discipline_dementation_inferior_innate.png",  img_5_src: "icon_discipline_dementation_superior_innate.png",  img_6_src: "icon_discipline_dementation_other_innate.png" },
      { id: "disciplineDominate",     label: "Dominate",     img_1_src: "icon_discipline_dominate_inferior.png",     img_2_src: "icon_discipline_dominate_superior.png",     img_3_src: "icon_discipline_dominate_other.png",     img_4_src: "icon_discipline_dominate_inferior_innate.png",     img_5_src: "icon_discipline_dominate_superior_innate.png",     img_6_src: "icon_discipline_dominate_other_innate.png" },
      { id: "disciplineFortitude",    label: "Fortitude",    img_1_src: "icon_discipline_fortitude_inferior.png",    img_2_src: "icon_discipline_fortitude_superior.png",    img_3_src: "icon_discipline_fortitude_other.png",    img_4_src: "icon_discipline_fortitude_inferior_innate.png",    img_5_src: "icon_discipline_fortitude_superior_innate.png",    img_6_src: "icon_discipline_fortitude_other_innate.png" },
      { id: "disciplineMaleficia",    label: "Maleficia",    img_1_src: "icon_discipline_maleficia_inferior.png",    img_2_src: "icon_discipline_maleficia_superior.png",    img_3_src: "icon_discipline_maleficia_other.png",    img_4_src: "icon_discipline_maleficia_inferior_innate.png",    img_5_src: "icon_discipline_maleficia_superior_innate.png",    img_6_src: "icon_discipline_maleficia_other_innate.png" },
      { id: "disciplineMelpominee",   label: "Melpominee",   img_1_src: "icon_discipline_melpominee_inferior.png",   img_2_src: "icon_discipline_melpominee_superior.png",   img_3_src: "icon_discipline_melpominee_other.png",   img_4_src: "icon_discipline_melpominee_inferior_innate.png",   img_5_src: "icon_discipline_melpominee_superior_innate.png",   img_6_src: "icon_discipline_melpominee_other_innate.png" },
      { id: "disciplineMytherceria",  label: "Mytherceria",  img_1_src: "icon_discipline_mytherceria_inferior.png",  img_2_src: "icon_discipline_mytherceria_superior.png",  img_3_src: "icon_discipline_mytherceria_other.png",  img_4_src: "icon_discipline_mytherceria_inferior_innate.png",  img_5_src: "icon_discipline_mytherceria_superior_innate.png",  img_6_src: "icon_discipline_mytherceria_other_innate.png" },
      { id: "disciplineNecromancy",   label: "Necromancy",   img_1_src: "icon_discipline_necromancy_inferior.png",   img_2_src: "icon_discipline_necromancy_superior.png",   img_3_src: "icon_discipline_necromancy_other.png",   img_4_src: "icon_discipline_necromancy_inferior_innate.png",   img_5_src: "icon_discipline_necromancy_superior_innate.png",   img_6_src: "icon_discipline_necromancy_other_innate.png" },
      { id: "disciplineObeah",        label: "Obeah",        img_1_src: "icon_discipline_obeah_inferior.png",        img_2_src: "icon_discipline_obeah_superior.png",        img_3_src: "icon_discipline_obeah_other.png",        img_4_src: "icon_discipline_obeah_inferior_innate.png",        img_5_src: "icon_discipline_obeah_superior_innate.png",        img_6_src: "icon_discipline_obeah_other_innate.png" },
      { id: "disciplineObfuscate",    label: "Obfuscate",    img_1_src: "icon_discipline_obfuscate_inferior.png",    img_2_src: "icon_discipline_obfuscate_superior.png",    img_3_src: "icon_discipline_obfuscate_other.png",    img_4_src: "icon_discipline_obfuscate_inferior_innate.png",    img_5_src: "icon_discipline_obfuscate_superior_innate.png",    img_6_src: "icon_discipline_obfuscate_other_innate.png" },
      { id: "disciplineObtenebration",label: "Obtenebration",img_1_src: "icon_discipline_obtenebration_inferior.png",img_2_src: "icon_discipline_obtenebration_superior.png",img_3_src: "icon_discipline_obtenebration_other.png",img_4_src: "icon_discipline_obtenebration_inferior_innate.png",img_5_src: "icon_discipline_obtenebration_superior_innate.png",img_6_src: "icon_discipline_obtenebration_other_innate.png" },
      { id: "disciplinePotence",      label: "Potence",      img_1_src: "icon_discipline_potence_inferior.png",      img_2_src: "icon_discipline_potence_superior.png",      img_3_src: "icon_discipline_potence_other.png",      img_4_src: "icon_discipline_potence_inferior_innate.png",      img_5_src: "icon_discipline_potence_superior_innate.png",      img_6_src: "icon_discipline_potence_other_innate.png" },
      { id: "disciplinePresence",     label: "Presence",     img_1_src: "icon_discipline_presence_inferior.png",     img_2_src: "icon_discipline_presence_superior.png",     img_3_src: "icon_discipline_presence_other.png",     img_4_src: "icon_discipline_presence_inferior_innate.png",     img_5_src: "icon_discipline_presence_superior_innate.png",     img_6_src: "icon_discipline_presence_other_innate.png" },
      { id: "disciplineProtean",      label: "Protean",      img_1_src: "icon_discipline_protean_inferior.png",      img_2_src: "icon_discipline_protean_superior.png",      img_3_src: "icon_discipline_protean_other.png",      img_4_src: "icon_discipline_protean_inferior_innate.png",      img_5_src: "icon_discipline_protean_superior_innate.png",      img_6_src: "icon_discipline_protean_other_innate.png" },
      { id: "disciplineQuietus",      label: "Quietus",      img_1_src: "icon_discipline_quietus_inferior.png",      img_2_src: "icon_discipline_quietus_superior.png",      img_3_src: "icon_discipline_quietus_other.png",      img_4_src: "icon_discipline_quietus_inferior_innate.png",      img_5_src: "icon_discipline_quietus_superior_innate.png",      img_6_src: "icon_discipline_quietus_other_innate.png" },
      { id: "disciplineSanguinus",    label: "Sanguinus",    img_1_src: "icon_discipline_sanguinus_inferior.png",    img_2_src: "icon_discipline_sanguinus_superior.png",    img_3_src: "icon_discipline_sanguinus_other.png",    img_4_src: "icon_discipline_sanguinus_inferior_innate.png",    img_5_src: "icon_discipline_sanguinus_superior_innate.png",    img_6_src: "icon_discipline_sanguinus_other_innate.png" },
      { id: "disciplineSerpentis",    label: "Serpentis",    img_1_src: "icon_discipline_serpentis_inferior.png",    img_2_src: "icon_discipline_serpentis_superior.png",    img_3_src: "icon_discipline_serpentis_other.png",    img_4_src: "icon_discipline_serpentis_inferior_innate.png",    img_5_src: "icon_discipline_serpentis_superior_innate.png",    img_6_src: "icon_discipline_serpentis_other_innate.png" },
      { id: "disciplineSpiritus",     label: "Spiritus",     img_1_src: "icon_discipline_spiritus_inferior.png",     img_2_src: "icon_discipline_spiritus_superior.png",     img_3_src: "icon_discipline_spiritus_other.png",     img_4_src: "icon_discipline_spiritus_inferior_innate.png",     img_5_src: "icon_discipline_spiritus_superior_innate.png",     img_6_src: "icon_discipline_spiritus_other_innate.png" },
      { id: "disciplineStriga",       label: "Striga",       img_1_src: "icon_discipline_striga_inferior.png",       img_2_src: "icon_discipline_striga_superior.png",       img_3_src: "icon_discipline_striga_other.png",       img_4_src: "icon_discipline_striga_inferior_innate.png",       img_5_src: "icon_discipline_striga_superior_innate.png",       img_6_src: "icon_discipline_striga_other_innate.png" },
      { id: "disciplineTemporis",     label: "Temporis",     img_1_src: "icon_discipline_temporis_inferior.png",     img_2_src: "icon_discipline_temporis_superior.png",     img_3_src: "icon_discipline_temporis_other.png",     img_4_src: "icon_discipline_temporis_inferior_innate.png",     img_5_src: "icon_discipline_temporis_superior_innate.png",     img_6_src: "icon_discipline_temporis_other_innate.png" },
      { id: "disciplineThanatosis",   label: "Thanatosis",   img_1_src: "icon_discipline_thanatosis_inferior.png",   img_2_src: "icon_discipline_thanatosis_superior.png",   img_3_src: "icon_discipline_thanatosis_other.png",   img_4_src: "icon_discipline_thanatosis_inferior_innate.png",   img_5_src: "icon_discipline_thanatosis_superior_innate.png",   img_6_src: "icon_discipline_thanatosis_other_innate.png" },
      { id: "disciplineThaumaturgy",  label: "Thaumaturgy",  img_1_src: "icon_discipline_thaumaturgy_inferior.png",  img_2_src: "icon_discipline_thaumaturgy_superior.png",  img_3_src: "icon_discipline_thaumaturgy_other.png",  img_4_src: "icon_discipline_thaumaturgy_inferior_innate.png",  img_5_src: "icon_discipline_thaumaturgy_superior_innate.png",  img_6_src: "icon_discipline_thaumaturgy_other_innate.png" },
      { id: "disciplineValeren",      label: "Valeren",      img_1_src: "icon_discipline_valeren_inferior.png",      img_2_src: "icon_discipline_valeren_superior.png",      img_3_src: "icon_discipline_valeren_other.png",      img_4_src: "icon_discipline_valeren_inferior_innate.png",      img_5_src: "icon_discipline_valeren_superior_innate.png",      img_6_src: "icon_discipline_valeren_other_innate.png" },
      { id: "disciplineVicissitude",  label: "Vicissitude",  img_1_src: "icon_discipline_vicissitude_inferior.png",  img_2_src: "icon_discipline_vicissitude_superior.png",  img_3_src: "icon_discipline_vicissitude_other.png",  img_4_src: "icon_discipline_vicissitude_inferior_innate.png",  img_5_src: "icon_discipline_vicissitude_superior_innate.png",  img_6_src: "icon_discipline_vicissitude_other_innate.png" },
      { id: "disciplineVisceratika",  label: "Visceratika",  img_1_src: "icon_discipline_visceratika_inferior.png",  img_2_src: "icon_discipline_visceratika_superior.png",  img_3_src: "icon_discipline_visceratika_other.png",  img_4_src: "icon_discipline_visceratika_inferior_innate.png",  img_5_src: "icon_discipline_visceratika_superior_innate.png",  img_6_src: "icon_discipline_visceratika_other_innate.png" }
  ];

const clanData = [
    { id: "clanAhrimanes",             label: "Ahrimanes",             imgSrc: "icon_clan_ahrimanes.png",             image: new Image() },
    { id: "clanAkunanse",              label: "Akunanse",              imgSrc: "icon_clan_akunanse.png",              image: new Image() },
    { id: "clanAnda",                  label: "Anda",                  imgSrc: "icon_clan_anda.png",                  image: new Image() },
    { id: "clanAssamite",              label: "Assamite",              imgSrc: "icon_clan_assamite.png",              image: new Image() },
    { id: "clanBaali",                 label: "Baali",                 imgSrc: "icon_clan_baali.png",                 image: new Image() },
    { id: "clanBanuHaqim",             label: "Banu Haqim",            imgSrc: "icon_clan_banu_haqim.png",            image: new Image() },
    { id: "clanBloodBrothers",         label: "Blood Brothers",        imgSrc: "icon_clan_blood_brothers.png",        image: new Image() },
    { id: "clanBrujah",                label: "Brujah",                imgSrc: "icon_clan_brujah.png",                image: new Image() },
    { id: "clanBrujahAntitribu",       label: "Brujah Antitribu",      imgSrc: "icon_clan_brujah_antitribu.png",      image: new Image() },
    { id: "clanCaitiff",               label: "Caitiff",               imgSrc: "icon_clan_caitiff.png",               image: new Image() },
    { id: "clanCappadocian",           label: "Cappadocian",           imgSrc: "icon_clan_cappadocian.png",           image: new Image() },
    { id: "clanDaughtersOfCacophony",  label: "Daughters of Cacophony",imgSrc: "icon_clan_daughters_of_cacophony.png",image: new Image() },
    { id: "clanFollowersOfSet",        label: "Followers of Set",      imgSrc: "icon_clan_followers_of_set.png",      image: new Image() },
    { id: "clanGangrel",               label: "Gangrel",               imgSrc: "icon_clan_gangrel.png",               image: new Image() },
    { id: "clanGangrelAntitribu",      label: "Gangrel Antitribu",     imgSrc: "icon_clan_gangrel_antitribu.png",     image: new Image() },
    { id: "clanGargoyles",             label: "Gargoyles",             imgSrc: "icon_clan_gargoyles.png",             image: new Image() },
    { id: "clanGiovanni",              label: "Giovanni",              imgSrc: "icon_clan_giovanni.png",              image: new Image() },
    { id: "clanGuruhi",                label: "Guruhi",                imgSrc: "icon_clan_guruhi.png",                image: new Image() },
    { id: "clanHecata",                label: "Hecata",                imgSrc: "icon_clan_hecata.png",                image: new Image() },
    { id: "clanHarbringersOfSkulls",   label: "Harbingers of Skulls",  imgSrc: "icon_clan_harbringers_of_skulls.png", image: new Image() },
    { id: "clanIshtarri",              label: "Ishtarri",              imgSrc: "icon_clan_ishtarri.png",              image: new Image() },
    { id: "clanKiasyd",                label: "Kiasyd",                imgSrc: "icon_clan_kiasyd.png",                image: new Image() },
    { id: "clanKinyonyi",              label: "Kinyonyi",              imgSrc: "icon_clan_kinyonyi.png",              image: new Image() },
    { id: "clanLamia",                 label: "Lamia",                 imgSrc: "icon_clan_lamia.png",                 image: new Image() },
    { id: "clanLasombra",              label: "Lasombra",              imgSrc: "icon_clan_lasombra.png",              image: new Image() },
    { id: "clanMalkavian",             label: "Malkavian",             imgSrc: "icon_clan_malkavian.png",             image: new Image() },
    { id: "clanMalkavianAntitribu",    label: "Malkavian Antitribu",   imgSrc: "icon_clan_malkavian_antitribu.png",   image: new Image() },
    { id: "clanMinistry",              label: "Ministry",              imgSrc: "icon_clan_ministry.png",              image: new Image() },
    { id: "clanNagaraja",              label: "Nagaraja",              imgSrc: "icon_clan_nagaraja.png",              image: new Image() },
    { id: "clanNagloper",              label: "Nagloper",              imgSrc: "icon_clan_nagloper.png",              image: new Image() },
    { id: "clanNoiad",                 label: "Noiad",                 imgSrc: "icon_clan_noiad.png",                 image: new Image() },
    { id: "clanNosferatu",             label: "Nosferatu",             imgSrc: "icon_clan_nosferatu.png",             image: new Image() },
    { id: "clanNosferatuAntitribu",    label: "Nosferatu Antitribu",   imgSrc: "icon_clan_nosferatu_antitribu.png",   image: new Image() },
    { id: "clanOsebo",                 label: "Osebo",                 imgSrc: "icon_clan_osebo.png",                 image: new Image() },
    { id: "clanPander",                label: "Pander",                imgSrc: "icon_clan_pander.png",                image: new Image() },
    { id: "clanRavnos",                label: "Ravnos",                imgSrc: "icon_clan_ravnos.png",                image: new Image() },
    { id: "clanSalubri",               label: "Salubri",               imgSrc: "icon_clan_salubri.png",               image: new Image() },
    { id: "clanSalubriAntitribu",      label: "Salubri Antitribu",     imgSrc: "icon_clan_salubri_antitribu.png",     image: new Image() },
    { id: "clanSamedi",                label: "Samedi",                imgSrc: "icon_clan_samedi.png",                image: new Image() },
    { id: "clanToreador",              label: "Toreador",              imgSrc: "icon_clan_toreador.png",              image: new Image() },
    { id: "clanToreadorAntitribu",     label: "Toreador Antitribu",    imgSrc: "icon_clan_toreador_antitribu.png",    image: new Image() },
    { id: "clanTremere",               label: "Tremere",               imgSrc: "icon_clan_tremere.png",               image: new Image() },
    { id: "clanTremereAntitribu",      label: "Tremere Antitribu",     imgSrc: "icon_clan_tremere_antitribu.png",     image: new Image() },
    { id: "clanTrueBrujah",            label: "True Brujah",           imgSrc: "icon_clan_true_brujah.png",           image: new Image() },
    { id: "clanTzimisce",              label: "Tzimisce",              imgSrc: "icon_clan_tzimisce.png",              image: new Image() },
    { id: "clanVentrue",               label: "Ventrue",               imgSrc: "icon_clan_ventrue.png",               image: new Image() },
    { id: "clanVentrueAntitribu",      label: "Ventrue Antitribu",     imgSrc: "icon_clan_ventrue_antitribu.png",     image: new Image() },
    { id: "clanVolgirre",              label: "Volgirre",              imgSrc: "icon_clan_volgirre.png",              image: new Image() }
];

  const frameMap = {
    // Main Frame Options
    "vampire_generic_1"       : "frame_vampire_generic_1.png",
    "vampire_generic_2"       : "frame_vampire_generic_2.png",
    "vampire_generic_3"       : "frame_vampire_generic_3.png",
    "clan_assamite"           : "frame_clan_assamite.png",
    "clan_brujah"             : "frame_clan_brujah.png",
    "clan_brujah_antitribu"   : "frame_clan_brujah_antitribu.png",
    "clan_cappadocian"        : "frame_clan_cappadocian.png",
    "clan_gangrel"            : "frame_clan_gangrel.png",
    "clan_gangrel_antitribu"  : "frame_clan_gangrel_antitribu.png",
    "clan_giovanni"           : "frame_clan_giovanni.png",
    "clan_lamia"              : "frame_clan_lamia.png",
    "clan_lasombra"           : "frame_clan_lasombra.png",
    "clan_malkavian"          : "frame_clan_malkavian.png",
    "clan_malkavian_antitribu": "frame_clan_malkavian_antitribu.png",
    "clan_nosferatu"          : "frame_clan_nosferatu.png",
    "clan_nosferatu_antitribu": "frame_clan_nosferatu_antitribu.png",
    "clan_ravnos"             : "frame_clan_ravnos.png",
    "clan_salubri"            : "frame_clan_salubri.png",
    "clan_salubri_antitribu"  : "frame_clan_salubri_antitribu.png",
    "clan_toreador"           : "frame_clan_toreador.png",
    "clan_toreador_antitribu" : "frame_clan_toreador_antitribu.png",
    "clan_tremere"            : "frame_clan_tremere.png",
    "clan_tremere_antitribu"  : "frame_clan_tremere_antitribu.png",
    "clan_tzimisce"           : "frame_clan_tzimisce.png",
    "clan_ventrue"            : "frame_clan_ventrue.png",
    "clan_ventrue_antitribu"  : "frame_clan_ventrue_antitribu.png",

    // Other Card Frame Options
    "modifier_card"           : "frame_modifier.png",
    "action_card"             : "frame_action.png",
    "political_action_card"   : "frame_political_action.png",
    "event_card"              : "frame_event.png",
    "master_card"             : "frame_master.png",
    "reaction_card"           : "frame_reaction.png",
    "combat_card"             : "frame_combat.png",
    "equipment_card"          : "frame_equipment.png",
    "ally_card"               : "frame_ally.png",

    // Side Panel Options
    "none"                          : null,
    "generic_green_marble"          : "sidepanel_generic_green_marble.png",
    "generic_black_marble"          : "sidepanel_generic_black_marble.png",
    "sidepanel_action"              : "sidepanel_action.png",
    "sidepanel_political_action"    : "sidepanel_political_action.png",
    "sidepanel_event"               : "sidepanel_event.png",
    "sidepanel_master"              : "sidepanel_master.png",
    "sidepanel_reaction"            : "sidepanel_reaction.png",
    "sidepanel_combat"              : "sidepanel_combat.png",
    "sidepanel_equipment"           : "sidepanel_equipment.png",
    "sidepanel_ally"                : "sidepanel_ally.png",
    "sidepanel_assamite"            : "sidepanel_assamite.png",
    "sidepanel_brujah"              : "sidepanel_brujah.png",
    "sidepanel_brujah_antitribu"    : "sidepanel_brujah_antitribu.png",
    "sidepanel_cappadocian"         : "sidepanel_cappadocian.png",
    "sidepanel_gangrel"             : "sidepanel_gangrel.png",
    "sidepanel_gangrel_antitribu"   : "sidepanel_gangrel_antitribu.png",
    "sidepanel_giovanni"            : "sidepanel_giovanni.png",
    "sidepanel_lamia"               : "sidepanel_lamia.png",
    "sidepanel_lasombra"            : "sidepanel_lasombra.png",
    "sidepanel_malkavian"           : "sidepanel_malkavian.png",
    "sidepanel_malkavian_antitribu" : "sidepanel_malkavian_antitribu.png",
    "sidepanel_nosferatu"           : "sidepanel_nosferatu.png",
    "sidepanel_nosferatu_antitribu" : "sidepanel_nosferatu_antitribu.png",
    "sidepanel_ravnos"              : "sidepanel_ravnos.png",
    "sidepanel_salubri"             : "sidepanel_salubri.png",
    "sidepanel_salubri_antitribu"   : "sidepanel_salubri_antitribu.png",
    "sidepanel_toreador"            : "sidepanel_toreador.png",
    "sidepanel_toreador_antitribu"  : "sidepanel_toreador_antitribu.png",
    "sidepanel_tremere"             : "sidepanel_tremere.png",
    "sidepanel_tremere_antitribu"   : "sidepanel_tremere_antitribu.png",
    "sidepanel_tzimisce"            : "sidepanel_tzimisce.png",
    "sidepanel_ventrue"             : "sidepanel_ventrue.png",
    "sidepanel_ventrue_antitribu"   : "sidepanel_ventrue_antitribu.png"
  };

const typeMap = [
  { id: "card_type_action",         label: "Action",         iconSrc: "symbol_action.png" },
  { id: "card_type_reaction",       label: "Reaction",       iconSrc: "symbol_reaction.png" },
  { id: "card_type_combat",         label: "Combat",         iconSrc: "symbol_combat.png" },
  { id: "card_type_equipment",      label: "Equipment",      iconSrc: "symbol_equipment.png" },
  { id: "card_type_ally",           label: "Ally",           iconSrc: "symbol_ally.png" },
  { id: "card_type_master",         label: "Master",         iconSrc: "symbol_master.png" },
  { id: "card_type_event",          label: "Event",          iconSrc: "symbol_event.png" },
  { id: "card_type_political",      label: "Political",      iconSrc: "symbol_political.png" }
];

  const symbolMap = {
    // Pool, Blood, Capacity, and Life
    "symbol_pool"              : "symbol_pool.png",
    "symbol_blood"             : "symbol_blood.png",
    "symbol_capacity"          : "symbol_capacity.png",
    "symbol_life"              : "symbol_life.png",

    // Other Useful Symbols
    "symbol_vote"              : "symbol_vote.png",

  };

  const costSymbolData = [
    { id: "poolCost",       label: "Pool Cost",   hasToggle: true },
    { id: "bloodCost",      label: "Blood Cost",  hasToggle: true },
    { id: "capacitySymbol", label: "Capacity",    hasToggle: false },
    { id: "lifeSymbol",     label: "Life",        hasToggle: false },
  ];

  const markdownTextMap = {
    "[b]": { open: "<strong>",                                   close: "</strong>" },    // Bold
    "[i]": { open: "<em>",                                       close: "</em>" }        // Italics
  };

  const markdownIconMap = {
      // Disciplines
      "[abo]": "icon_discipline_abombwe_inferior.png",
      "[ABO]": "icon_discipline_abombwe_superior.png",
      "[aus]": "icon_discipline_auspex_inferior.png",
      "[AUS]": "icon_discipline_auspex_superior.png",
      "[ani]": "icon_discipline_animalism_inferior.png",
      "[ANI]": "icon_discipline_animalism_superior.png",
      "[cel]": "icon_discipline_celerity_inferior.png",
      "[CEL]": "icon_discipline_celerity_superior.png",
      "[chi]": "icon_discipline_chimerstry_inferior.png",
      "[CHI]": "icon_discipline_chimerstry_superior.png",
      "[dai]": "icon_discipline_daimonion_inferior.png",
      "[DAI]": "icon_discipline_daimonion_superior.png",
      "[dem]": "icon_discipline_dementation_inferior.png",
      "[DEM]": "icon_discipline_dementation_superior.png",
      "[dom]": "icon_discipline_dominate_inferior.png",
      "[DOM]": "icon_discipline_dominate_superior.png",
      "[for]": "icon_discipline_fortitude_inferior.png",
      "[FOR]": "icon_discipline_fortitude_superior.png",
      "[mal]": "icon_discipline_maleficia_inferior.png",
      "[MAL]": "icon_discipline_maleficia_superior.png",
      "[mel]": "icon_discipline_melpominee_inferior.png",
      "[MEL]": "icon_discipline_melpominee_superior.png",
      "[myt]": "icon_discipline_mytherceria_inferior.png",
      "[MYT]": "icon_discipline_mytherceria_superior.png",
      "[nec]": "icon_discipline_necromancy_inferior.png",
      "[NEC]": "icon_discipline_necromancy_superior.png",
      "[obe]": "icon_discipline_obeah_inferior.png",
      "[OBE]": "icon_discipline_obeah_superior.png",
      "[obf]": "icon_discipline_obfuscate_inferior.png",
      "[OBF]": "icon_discipline_obfuscate_superior.png",
      "[obt]": "icon_discipline_obtenebration_inferior.png",
      "[OBT]": "icon_discipline_obtenebration_superior.png",
      "[pot]": "icon_discipline_potence_inferior.png",
      "[POT]": "icon_discipline_potence_superior.png",
      "[pre]": "icon_discipline_presence_inferior.png",
      "[PRE]": "icon_discipline_presence_superior.png",
      "[pro]": "icon_discipline_protean_inferior.png",
      "[PRO]": "icon_discipline_protean_superior.png",
      "[qui]": "icon_discipline_quietus_inferior.png",
      "[QUI]": "icon_discipline_quietus_superior.png",
      "[san]": "icon_discipline_sanguinus_inferior.png",
      "[SAN]": "icon_discipline_sanguinus_superior.png",
      "[ser]": "icon_discipline_serpentis_inferior.png",
      "[SER]": "icon_discipline_serpentis_superior.png",
      "[spi]": "icon_discipline_spiritus_inferior.png",
      "[SPI]": "icon_discipline_spiritus_superior.png",
      "[str]": "icon_discipline_striga_inferior.png",
      "[STR]": "icon_discipline_striga_superior.png",
      "[tem]": "icon_discipline_temporis_inferior.png",
      "[TEM]": "icon_discipline_temporis_superior.png",
      "[tha]": "icon_discipline_thaumaturgy_inferior.png",
      "[THA]": "icon_discipline_thaumaturgy_superior.png",
      "[thn]": "icon_discipline_thanatosis_inferior.png",
      "[THN]": "icon_discipline_thanatosis_superior.png",      
      "[val]": "icon_discipline_valeren_inferior.png",
      "[VAL]": "icon_discipline_valeren_superior.png",
      "[vic]": "icon_discipline_vicissitude_inferior.png",
      "[VIC]": "icon_discipline_vicissitude_superior.png",
      "[vis]": "icon_discipline_visceratika_inferior.png",
      "[VIS]": "icon_discipline_visceratika_superior.png",

      // Clans
      "[ahr]": "icon_clan_ahrimanes.png",
      "[aku]": "icon_clan_akunanse.png",
      "[and]": "icon_clan_anda.png",
      "[ass]": "icon_clan_assamite.png",
      "[baa]": "icon_clan_baali.png",
      "[ban]": "icon_clan_banu_haqim.png", 
      "[blo]": "icon_clan_blood_brothers.png",
      "[bru]": "icon_clan_brujah.png",
      "[!bru]": "icon_clan_brujah_antitribu.png",
      "[cai]": "icon_clan_caitiff.png",
      "[cap]": "icon_clan_cappadocian.png",
      "[dau]": "icon_clan_daughters_of_cacophony.png",
      "[fol]": "icon_clan_followers_of_set.png",
      "[gan]": "icon_clan_gangrel.png",
      "[!gan]": "icon_clan_gangrel_antitribu.png",
      "[gar]": "icon_clan_gargoyles.png",
      "[gio]": "icon_clan_giovanni.png",
      "[gur]": "icon_clan_guruhi.png",
      "[hec]": "icon_clan_hecata.png",
      "[har]": "icon_clan_harbringers_of_skulls.png",
      "[ish]": "icon_clan_isharri.png",
      "[kia]": "icon_clan_kiasyd.png",
      "[kin]": "icon_clan_kinyonyi.png",
      "[lam]": "icon_clan_lamia.png",
      "[las]": "icon_clan_lasombra.png",
      "[mal]": "icon_clan_malkavian.png",
      "[!mal]": "icon_clan_malkavian_antitribu.png",
      "[min]": "icon_clan_ministry.png",
      "[nag]": "icon_clan_nagaraja.png",
      "[nal]": "icon_clan_nagloper.png",
      "[noi]": "icon_clan_noiad.png",
      "[nos]": "icon_clan_nosferatu.png",
      "[!nos]": "icon_clan_nosferatu_antitribu.png",
      "[ose]": "icon_clan_osebo.png",
      "[pan]": "icon_clan_pander.png",
      "[rav]": "icon_clan_ravnos.png",
      "[sal]": "icon_clan_salubri.png",
      "[!sal]": "icon_clan_salubri_antitribu.png",
      "[sam]": "icon_clan_samedi.png",
      "[tor]": "icon_clan_toreador.png",
      "[!tor]": "icon_clan_toreador_antitribu.png",
      "[tre]": "icon_clan_tremere.png",
      "[!tre]": "icon_clan_tremere_antitribu.png",
      "[tru]": "icon_clan_true_brujah.png",
      "[tzi]": "icon_clan_tzimisce.png",
      "[ven]": "icon_clan_ventrue.png",
      "[!ven]": "icon_clan_ventrue_antitribu.png",
      "[vol]": "icon_clan_volgirre.png"
  };

  // END datatables & maps

  let tested = false;
  let testAllDisciplines = false;
  function testAllImages() {

      // Helper function to test a single image
      function testImage(src, label) {
          const img = new Image();
          img.onload = () => {
          };
          img.onerror = () => {
              showOnloadError(`Image failed to load: ${label} (${src})`);
          };
          img.src = src;
      }

      // Test discipline images
      disciplineData.forEach(discipline => {
          let nt = testAllDisciplines ? 6 : 2;
          for (let i = 1; i <= nt; i++) {
              const imgSrc = wrapImgPath(discipline[`img_${i}_src`]);
              if (imgSrc) {
                  testImage(imgSrc, `${discipline.label} (image ${i})`);
              }
          }
      });

      // Test clan images
      clanData.forEach(clan => {
          if (clan.imgSrc) {
              testImage(wrapImgPath(clan.imgSrc), clan.label);
          }
      });

      // Test symbol map images
      Object.entries(symbolMap).forEach(([key, src]) => {
          if (src) {
              testImage(wrapImgPath(src), key);
          }
      });

      console.log("Image testing completed.");
  }

  if (tested === false) { testAllImages(); tested = true; }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, antialias) {
    const words = text.split(" ");
    let line = "";

    if (antialias === "aa1") { ctx.lineWidth = 1; }
    if (antialias === "aa2") { ctx.lineWidth = 2; }
    if (antialias === "aa3") { ctx.lineWidth = 3; }

    ctx.strokeStyle = "black";

    const renderIcon = (iconSrc, x, y, size) => {
      const img = new Image();
      img.src = iconSrc;
      img.onload = () => {
        ctx.drawImage(img, x, y - size, size * 1.25, size * 1.25); // Adjust vertical alignment
      };
    };

    function renderLine(ctx, incoming_line, x, y, antialias) {
      const tokens = incoming_line.split(/(\[.*?\])/); // Split by markdown-like tokens
      let currentX = x;

    tokens.forEach(token => {
      if (markdownIconMap[token]) {
        // Render icon
        renderIcon(markdownIconMap[token], currentX, y, lineHeight);
        currentX += lineHeight; // Move the cursor forward by the icon size
      } else if (markdownTextMap[token]) {
        // Render styled text
        const style = markdownTextMap[token].open.replace(/<|>/g, "").trim(); // Extract style (e.g., "strong" -> "bold")
        renderStyledText(token.replace(/[\[\]]/g, ""), currentX, y, style, antialias); // Remove markdown brackets
        currentX += ctx.measureText(token.replace(/[\[\]]/g, "")).width;
      } else {
        // Render plain text
        if (antialias !== "none") { ctx.strokeText(token, currentX, y); }
        ctx.fillText(token, currentX, y);
        currentX += ctx.measureText(token).width;
      }
    });
    }

    const renderStyledText = (text, x, y, style, antialias) => {
      ctx.save();

      // Extract the current font size and family from ctx.font
      const fontParts = ctx.font.split(" ");
      const fontSize = fontParts[0]; // e.g., "16px"
      const fontFamily = fontParts.slice(1).join(" "); // e.g., "Arial"

      // Apply the style
      if (style === "bold") {
        ctx.font = `bold ${fontSize} ${fontFamily}`;
      } else if (style === "italic") {
        ctx.font = `italic ${fontSize} ${fontFamily}`;
 
      } else {
        // Default plain text
        if (antialias !== "none") { ctx.strokeText(text, x, y); }
        ctx.fillText(text, x, y);
      }

      ctx.restore();
    };

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        renderLine(ctx, line, x, y, antialias);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
      testLine = "";
    }

    renderLine(ctx, line, x, y, antialias);

  }


  // -------------------------------
  // Generate dark pack logo ui (unchecked by default).
  // -------------------------------
  
  // Variable declarations
  const destination               = document.getElementById("darkPackSection");
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
  darkPackXInput.value            = 314; // Default value
  darkPackXInput.min              = 0;

  // Y Position
  darkPackYLabel.htmlFor          = "darkPackY";
  darkPackYLabel.innerText        = "Y:";
  darkPackYInput.type             = "number";
  darkPackYInput.id               = "darkPackY";
  darkPackYInput.value            = 12; // Default value
  darkPackYInput.min              = 0;

  // Size Height
  darkPackHLabel.htmlFor          = "darkPackH";
  darkPackHLabel.innerText        = "H:";
  darkPackHInput.type             = "number";
  darkPackHInput.id               = "darkPackH";
  darkPackHInput.value            = 32; // Default value
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

  // Append the controls to the middle panel
  destination.appendChild(darkPackControls);
  


  // ------------------------------------
  // Generate HTML User Interace elements
  // ------------------------------------

  // Generate pool cost, blood cost, capacity, and life symbols
  const middlePanel = document.querySelector(".middle-panel");
  const costSymbolSection = document.createElement("div");
  costSymbolSection.className = "cost-symbol-section";
  costSymbolSection.innerHTML = "<h2>Costs and Symbols</h2>";

  const costSymbolGrid = document.createElement("div");
  costSymbolGrid.className = "cost-symbol-grid";
  costSymbolSection.appendChild(costSymbolGrid);

  // Generate the items
  costSymbolData.forEach(({ id, label, hasToggle }) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cost-symbol-item";

    // Create label
    const inputLabel = createLabel(id, label);
    itemDiv.appendChild(inputLabel);

    // Create a container for toggle and input
    const inputToggleContainer = document.createElement("div");
    inputToggleContainer.className = "input-toggle-container";

    // Add toggle if applicable
    if (hasToggle) {
      inputToggleContainer.appendChild(createToggle(id, createNumberInput(id)));
    }

    // Create input
    const input = createNumberInput(id);
    inputToggleContainer.appendChild(input);

    itemDiv.appendChild(inputToggleContainer);
    costSymbolGrid.appendChild(itemDiv);
  });

  // Append the cost and symbol section to the top of the middle panel
  middlePanel.prepend(costSymbolSection);



  // -------------------------------
  //  Generate card type settings
  // -------------------------------

  // Generate Card Type Icon Controls
  const typeHeader          = document.getElementById("typeHeader");
  const typeGrid            = document.getElementById("typeGrid"); 

  // Create the generic settings panel
  const genericSettingsDiv = document.createElement("div");
  genericSettingsDiv.className = "inline-selector";

  // Add global settings for X, Y, Size, Spacing, and Orientation
  const typeSettings = [
    { id: "typeX",        label: "X:",        defaultValue: 15, min: 0,   max: 358  },
    { id: "typeY",        label: "Y:",        defaultValue: 70, min: 0,   max: 500  },
    { id: "typeSize",     label: "Size:",     defaultValue: 36, min: 4,   max: 100  },
    { id: "typeSpacing",  label: "Gap:",      defaultValue: 13,  min: 0,   max: 20   }
  ];

  typeSettings.forEach(setting => {
    const label = document.createElement("label");
    label.htmlFor = setting.id;
    label.innerText = setting.label;

    const input = document.createElement("input");
    input.type = "number";
    input.id = setting.id;
    input.value = setting.defaultValue;
    if (setting.min !== undefined) input.min = setting.min;
    if (setting.max !== undefined) input.max = setting.max;

    genericSettingsDiv.appendChild(label);
    genericSettingsDiv.appendChild(input);
  });

  // Add orientation toggle
  const orientationLabel      = document.createElement("label");
  const orientationCheckbox   = document.createElement("input");

  orientationLabel.htmlFor    = "typeOrientation";
  orientationLabel.innerText  = "Orient.V/H:";
  
  orientationCheckbox.type    = "checkbox";
  orientationCheckbox.id      = "typeOrientation";
  orientationCheckbox.checked = false; // Default to vertical

  // Add event listener to toggle between vertical and horizontal
  orientationCheckbox.addEventListener("change", updateCard);


  genericSettingsDiv.appendChild(orientationLabel);
  genericSettingsDiv.appendChild(orientationCheckbox);

  // Append the generic settings panel to the typeHeader
  typeHeader.appendChild(genericSettingsDiv);

  // Generate controls for each card type
  typeMap.forEach(type => {
    const itemDiv       = document.createElement("div");
    itemDiv.className   = "card-type-item";

    // Create label
    const label         = document.createElement("label");
    label.htmlFor       = type.id;
    label.innerText     = type.label;
    label.className     = "card-type-label";
 
    // Create checkbox for toggling the icon
    const checkbox      = document.createElement("input");
    checkbox.type       = "checkbox";
    checkbox.id         = `${type.id}Toggle`;
    checkbox.checked    = false; // Default to unchecked

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(label);   
    typeGrid.appendChild(itemDiv);
  });



  // -----------------------------------------
  // Generate disciplines header with settings
  // -----------------------------------------

  function generateDisciplineSettings() {
    // Generate the settings header for the disciplines section
    const disciplinesHeader           = document.getElementById("disciplineHeader"); // Target the existing div

    // Create the settings panel
    const disciplinesSettingsDiv      = document.createElement("div");
    const disciplinesSettingsDiv2     = document.createElement("div");
    const disciplineToggle            = document.createElement("input");  
    const disciplineToggleLabel       = document.createElement("label"); 
    const disciplineToggleContainer   = document.createElement("div");

    disciplineToggle.type             = "checkbox";
    disciplineToggle.id               = "disciplineToggle";
    disciplineToggle.checked          = false; 
    disciplineToggleLabel.htmlFor     = "disciplineToggle";
    disciplineToggleLabel.innerText   = "Below settings are used when this is toggled";   

    disciplineToggleContainer.appendChild(disciplineToggle);
    disciplineToggleContainer.appendChild(disciplineToggleLabel);

    disciplineToggleContainer.className = "inline-selector";
    disciplinesSettingsDiv.className  = "inline-selector";
    disciplinesSettingsDiv2.className = "inline-selector";


    // Add global settings for X, Y, Size, Spacing, and Orientation
    const disciplineSettings = [
        { id: "disciplineX",              label: "X:",        defaultValue: 18,   min: 0,   max: 358 },
        { id: "disciplineY",              label: "Y:",        defaultValue: 400,  min: 0,   max: 500 },
        { id: "disciplineSize",           label: "Size:",     defaultValue: 30,   min: 10,  max: 100 },
        { id: "disciplineDiff",           label: "Diff:",     defaultValue: 8,    min: 0,   max: 20  },
        { id: "disciplineSpacing",        label: "Gap:",      defaultValue: 0,    min: 0,   max: 20  },
        { id: "disciplineSuperiorOffset", label: "Adjust:",   defaultValue: 3,    min: 0,   max: 20  }        
    ];
    const disciplineSettings2 = [
        { id: "disciplineToggleX",              label: "X:",        defaultValue: 18,   min: 0,   max: 358 },
        { id: "disciplineToggleY",              label: "Y:",        defaultValue: 240,  min: 0,   max: 500 },
        { id: "disciplineToggleSize",           label: "Size:",     defaultValue: 34,   min: 10,  max: 100 },
        { id: "disciplineToggleDiff",           label: "Diff:",     defaultValue: 8,    min: 0,   max: 20  },
        { id: "disciplineToggleSpacing",        label: "Gap:",      defaultValue: 2,    min: 0,   max: 20  },
        { id: "disciplineToggleSuperiorOffset", label: "Adjust:",   defaultValue: 4,    min: 0,   max: 20  }                
    ];    

    function createDiscSettings (setting, div) {
        const label                = document.createElement("label");
        label.htmlFor              = setting.id;
        label.innerText            = setting.label;

        const input                = document.createElement("input");
        input.type                 = "number";
        input.id                   = setting.id;
        input.value                = setting.defaultValue;
        if (setting.min !== undefined) input.min = setting.min;
        if (setting.max !== undefined) input.max = setting.max;

        div.appendChild(label);
        div.appendChild(input);
    };

    disciplineSettings.forEach(setting => createDiscSettings(setting, disciplinesSettingsDiv));
    disciplineSettings2.forEach(setting => createDiscSettings(setting, disciplinesSettingsDiv2));
    

    // Add orientation toggle
    const disciplineOrientationLabel        = document.createElement("label"); // Renamed to avoid conflict
    const disciplineOrientationCheckbox     = document.createElement("input");
    const disciplineOrientationLabel2       = document.createElement("label"); // Renamed to avoid conflict
    const disciplineOrientationCheckbox2    = document.createElement("input");    

    disciplineOrientationLabel.htmlFor      = "disciplineOrientation";
    disciplineOrientationLabel.innerText    = "V/H:";
    disciplineOrientationLabel2.htmlFor     = "disciplineOrientation";
    disciplineOrientationLabel2.innerText   = "V/H:";    

    disciplineOrientationCheckbox.type      = "checkbox";
    disciplineOrientationCheckbox.id        = "disciplineOrientation";
    disciplineOrientationCheckbox.checked   = false; // Default to vertical
    disciplineOrientationCheckbox2.type     = "checkbox";
    disciplineOrientationCheckbox2.id       = "disciplineToggleOrientation";
    disciplineOrientationCheckbox2.checked  = false; // Default to vertical    

    // Add event listener to toggle between vertical and horizontal
    disciplineOrientationCheckbox.addEventListener("change", updateCard);
    disciplineOrientationCheckbox2.addEventListener("change", updateCard);    

    disciplinesSettingsDiv.appendChild(disciplineOrientationLabel);
    disciplinesSettingsDiv.appendChild(disciplineOrientationCheckbox);

    disciplinesSettingsDiv2.appendChild(disciplineOrientationLabel2);
    disciplinesSettingsDiv2.appendChild(disciplineOrientationCheckbox2);    

    // Append the settings panel to the disciplines header
    disciplinesHeader.appendChild(disciplinesSettingsDiv);
    disciplinesHeader.appendChild(disciplineToggleContainer);
    disciplinesHeader.appendChild(disciplinesSettingsDiv2);
        
  }

  generateDisciplineSettings(); // Call the function to generate the settings panel



  // -------------------------------
  // Generate discipline toggles (unchecked by default).
  // -------------------------------

  // Generate discipline toggles to the grid below the header
  const disciplinesGrid = document.getElementById("disciplinesGrid");
  disciplineData.forEach(item => {
    const div = document.createElement("div");
    div.className = "discipline-item";

    // Discipline Label
    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerText = item.label;

    // Single Clickable Slider for Tiers (0, 1, 2, 3)
    const sliderDiv = document.createElement("div");
    sliderDiv.className = "discipline-slider tier-0"; // Default to tier 0
    sliderDiv.dataset.currentTier = 0; // Track the current tier
    sliderDiv.id = item.id; // Set the id to match the disciplineData entry

    // Create the color blocks for the slider
    for (let i = 0; i <= 3; i++) {
      const tierBlock = document.createElement("div");
      tierBlock.className = `tier-block tier-${i}`;
      sliderDiv.appendChild(tierBlock);
    }

    // Add click event to toggle between tiers
    sliderDiv.addEventListener("click", function () {
      let currentTier = parseInt(sliderDiv.dataset.currentTier, 10);
      currentTier = (currentTier + 1) % 4; // Cycle through 0, 1, 2, 3
      sliderDiv.dataset.currentTier = currentTier;

      // Update the visual state
      sliderDiv.className = `discipline-slider tier-${currentTier}`;
    });

    // Toggle for Additional Feature
    const featureToggleDiv = document.createElement("div");
    featureToggleDiv.className = "discipline-toggle";
    const featureLabel = document.createElement("label");
    featureLabel.htmlFor = `${item.id}Feature`;
    featureLabel.innerText = "I:";
    const featureCheckbox = document.createElement("input");
    featureCheckbox.type = "checkbox";
    featureCheckbox.id = `${item.id}Feature`;
    featureToggleDiv.appendChild(featureLabel);
    featureToggleDiv.appendChild(featureCheckbox);

    // Append all elements to the discipline item container
    div.appendChild(label);
    div.appendChild(sliderDiv);
    div.appendChild(featureToggleDiv);

    // Add the discipline item to the grid
    disciplinesGrid.appendChild(div);
  });


  // -------------------------------
  // Generate clan data HTML UI
  // -------------------------------

    clanData.forEach(symbol => {
      // Set the image source
      symbol.image.src = wrapImgPath(symbol.imgSrc);
      symbol.image.onload = updateCard;

      // Create a container for the clan toggle
      const clanToggleDiv = document.createElement("div");
      clanToggleDiv.className = "clan-toggle";

      // Create the checkbox for the clan
      const clanCheckbox  = document.createElement("input");
      const clanCheckbox2 = document.createElement("input");
      clanCheckbox.type   = "checkbox";
      clanCheckbox2.type  = "checkbox";
      clanCheckbox.id     = symbol.id;
      clanCheckbox2.id    = symbol.id + "-display";

      // Create the label for the clan
      const clanLabel = document.createElement("label");
      clanLabel.htmlFor = symbol.id;
      clanLabel.innerText = symbol.label;

      // Append the checkbox and label to the toggle container
      clanToggleDiv.appendChild(clanCheckbox);
      clanToggleDiv.appendChild(clanCheckbox2);
      clanToggleDiv.appendChild(clanLabel);

      // Append the toggle container to the clansGrid div
      const clansGrid = document.getElementById("clansGrid");
      if (clansGrid) {
          clansGrid.appendChild(clanToggleDiv);
      }
  });
  
  
  // -------------------------------
  // updateCard(): Renders the complete card.
  // -------------------------------

  function updateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";            

    // Reserve margin
    const margin = parseInt(document.getElementById("borderRadius").value);
    const innerX = margin;
    const innerY = margin;
    const innerWidth = canvas.width - (margin * 2);
    const innerHeight = canvas.height - (margin * 2);
  
    // --- Draw main art image within the inner rounded area.
    if (mainArtImage.complete && mainArtImage.naturalWidth > 0) {
      const offsetX = parseFloat(document.getElementById("offsetX").value) || 0;
      const offsetY = parseFloat(document.getElementById("offsetY").value) || 0;
      const cropTop = parseFloat(document.getElementById("cropTop").value) || 0;
      const cropRight = parseFloat(document.getElementById("cropRight").value) || 0;
      const cropBottom = parseFloat(document.getElementById("cropBottom").value) || 0;
      const cropLeft = parseFloat(document.getElementById("cropLeft").value) || 0;
      const scalePercent = parseFloat(document.getElementById("scalePercent").value) || 100;
  
      const srcX = cropLeft;
      const srcY = cropTop;
      const srcWidth = mainArtImage.naturalWidth - cropLeft - cropRight;
      const srcHeight = mainArtImage.naturalHeight - cropTop - cropBottom;
      const destWidth = srcWidth * (scalePercent / 100);
      const destHeight = srcHeight * (scalePercent / 100);
  
      ctx.save();
      ctx.drawImage(mainArtImage, srcX, srcY, srcWidth, srcHeight,
                    0 + offsetX, 0 + offsetY, destWidth, destHeight);
      ctx.restore();
    }
    
    // --- Vampire or Other Frame
    const mainFrameKey = document.getElementById("mainFrame").value;
    const mainFrameSrc = wrapImgPath(frameMap[mainFrameKey]);

    if (mainFrameSrc) {
      if (!frameBgImage || frameBgImage.src !== mainFrameSrc) {
        frameBgImage = new Image();
        frameBgImage.src = mainFrameSrc;
      }
    }
    
    ctx.save();
    if (frameBgImage && frameBgImage.complete && mainFrameKey !== "none") {
      ctx.drawImage(frameBgImage, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();
    
    // --- Frame Overlay: Draw the side panel overlay
    const sidePanelKey = document.getElementById("sidePanel").value;
    const sidePanelSrc = wrapImgPath(frameMap[sidePanelKey]);
    if (sidePanelSrc) {
      if (!frameImage || frameImage.src !== sidePanelSrc) {
        frameImage = new Image();
        frameImage.src = sidePanelSrc;
      }
    }

    ctx.save();
    if (frameImage && frameImage.complete && sidePanelKey !== "none") {
      ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();

    // Draw black border 
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



    // ------------------------------------
    // Render icons & symbols
    // ------------------------------------
    // ------------------------------------
    // Render Clan symbols
    // ------------------------------------

    const clan_location_1 = [ 12 , 48 ];
    const clan_location_2 = [ 12 , 220 ];

    function renderClanIcon(ctx, clanData, loc1, loc2) {
        // Track the current y-offset for each location to avoid overlaps
        let loc1YOffset = loc1[1];
        let loc2YOffset = loc2[1];
        let size = 38.0;

        // Keep track of missing icons to avoid duplicate error messages
        const missingIcons = new Set();

        clanData.forEach(symbol => {
            const checkbox1 = document.getElementById(symbol.id); // First checkbox
            const checkbox2 = document.getElementById(`${symbol.id}-display`); // Second checkbox
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            // Check if the image is loaded and not in a broken state
            if (symbol.image.complete && symbol.image.naturalWidth > 0) {
                if (checkbox1 && checkbox1.checked) {
                    // Render in the first location (upper left corner)
                    const [x1, y1] = loc1;
                    ctx.drawImage(symbol.image, x1, loc1YOffset, size, size); // Adjust size as needed
                    loc1YOffset += (size + 2); // Increment y-offset to avoid overlap
                }
                if (checkbox2 && checkbox2.checked) {
                    // Render in the second location (middle of the left panel)
                    const [x2, y2] = loc2;
                    ctx.drawImage(symbol.image, x2, loc2YOffset, size, size); // Adjust size as needed
                    loc2YOffset -= (size + 2); // Decrement y-offset to avoid overlap
                }
            } else {
                // If the image is not found or in a broken state
                if ((checkbox1 && checkbox1.checked) || (checkbox2 && checkbox2.checked)) {
                    // Log the error only if the user has selected the clan
                    if (!missingIcons.has(symbol.label)) {
                        showError(`Clan icon not found or failed to load for: ${symbol.label}`);
                        missingIcons.add(symbol.label);
                    }
                }
            }
        });

        // Optionally, display a summary of missing icons (only once)
        if (missingIcons.size > 0) {
            console.warn("Missing clan icons:", Array.from(missingIcons).join(", "));
        }
    }

    renderClanIcon(ctx, clanData, clan_location_1, clan_location_2);
    // END render clan symbol 



    // ------------------------------------
    // Render Discipline symbols
    // ------------------------------------

    function renderDisciplineIcons(ctx, disciplineData) {

        const activeDisciplines = [];
        const displayToggled = document.getElementById("disciplineToggle").checked;
        
        // Use ternary statements to set variables based on displayToggled
        const iconSize = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleSize").value) || 34
            : parseFloat(document.getElementById("disciplineSize").value) || 34;

        const iconSize2 = displayToggled
            ? iconSize + (parseFloat(document.getElementById("disciplineToggleDiff").value) || 6)
            : iconSize + (parseFloat(document.getElementById("disciplineDiff").value) || 6);

        const spacing = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleSpacing").value) || 4
            : parseFloat(document.getElementById("disciplineSpacing").value) || 4;

        const x = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleX").value) || 0
            : parseFloat(document.getElementById("disciplineX").value) || 0;

        const y = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleY").value) || 0
            : parseFloat(document.getElementById("disciplineY").value) || 0;

        const adjust = displayToggled
            ? parseFloat(document.getElementById("disciplineToggleSuperiorOffset").value) || 0
            : parseFloat(document.getElementById("disciplineSuperiorOffset").value) || 0;

        const isHorizontal = displayToggled
            ? document.getElementById("disciplineToggleOrientation").checked
            : document.getElementById("disciplineOrientation").checked;



        // Collect active disciplines with their tier and other properties
        disciplineData.forEach(symbol => {
            const slider = document.querySelector(`.discipline-slider[id="${symbol.id}"]`);
            const displayCheckbox = document.getElementById(`${symbol.id}Display`);
            const innateCheckbox = document.getElementById(`${symbol.id}Feature`);

            if (slider) {
                const tier = parseInt(slider.dataset.currentTier, 10);

                if (tier > 0) {
                    const imgSrc = innateCheckbox && innateCheckbox.checked
                        ? symbol[`img_${tier + 3}_src`]
                        : symbol[`img_${tier}_src`];

                    activeDisciplines.push({
                        id: symbol.id,
                        label: symbol.label,
                        tier: tier,
                        imgSrc: wrapImgPath(imgSrc),
                    });
                }
            }
        });

        // Sort by tier (descending), then alphabetically by label
        activeDisciplines.sort((a, b) => {
            if (b.tier !== a.tier) {
                return b.tier - a.tier; // Higher tier first
            }
            return a.label.localeCompare(b.label); // Alphabetical order for same tier
        });

        let y2 = 0;
        let x2 = 0;   

        activeDisciplines.forEach(symbol => {

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";            

            // Load and render the icon
            const img = new Image();
            img.src = symbol.imgSrc;
            img.onload = () => {

                // Directly draw the image onto the main canvas
                if         (symbol.tier == 1)                     { ctx.drawImage(img, x + x2         , y + y2          , iconSize, iconSize);
                } else if ((symbol.tier == 2) && (isHorizontal))  { ctx.drawImage(img, x + x2         , y + y2 - adjust , iconSize2, iconSize2);                  
                } else if ((symbol.tier == 2) && (!isHorizontal)) { ctx.drawImage(img, x + x2 - adjust, y + y2          , iconSize2, iconSize2);                 
                } 

            if (isHorizontal)   { x2 += iconSize + spacing; } 
            if (!isHorizontal)  { y2 -= iconSize + spacing; }

            }
        });
    }

    renderDisciplineIcons(ctx, disciplineData);

    // END render discipline symbols
    // Render blood cost symbol, pool cost symbol (logic)

    // Helper function to render a cost or capacity symbol
    function renderCostSymbol(ctx, symbol, value, x, y, size, symbolMap) {
        const symbolSrc = symbolMap[symbol];
        if (!symbolSrc || symbolSrc === "none") return;

        const symbolImage = new Image();
        symbolImage.src = wrapImgPath(symbolSrc);

        symbolImage.onload = function () {
            // Draw the symbol
            ctx.drawImage(symbolImage, x, y, size, size);

            // Draw the value or "X" on top of the symbol
            ctx.save();
            if (symbol == "symbol_capacity") { ctx.fillStyle = "#FFFFFF"; }
            if (symbol !== "symbol_capacity") { ctx.fillStyle = "#000000"; }
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Determine what to display: 'X' for pool/blood cost, or the number for capacity/life
            const displayValue = value === "X" ? "X" : parseInt(value, 10) || 0;
            ctx.fillText(displayValue, x + size / 2, y + size / 2);
            ctx.restore();
        };
    }

    function renderCostAndCapacitySymbols(ctx, symbolMap) {
        const lowerLeft = [12, 420]; // Coordinates for pool/blood cost
        const lowerRight = [304, 450]; // Coordinates for capacity/life symbol
        const iconSize = 40; // Size of the icons
        const capacity_size = 32;

        // Get user selections
        const poolCostToggle = document.getElementById("poolCostToggle");
        const bloodCostToggle = document.getElementById("bloodCostToggle");
        const capacityValue = parseInt(document.getElementById("capacitySymbol").value, 10);
        const lifeValue = parseInt(document.getElementById("lifeSymbol").value, 10);

        const poolCostValue = (poolCostToggle.checked) ? "X" : document.getElementById("poolCost").value;
        const bloodCostValue = (bloodCostToggle.checked) ? "X" : document.getElementById("bloodCost").value;
  
        // Ensure only one of pool or blood cost is rendered
        if ((poolCostToggle && poolCostToggle.checked) || (poolCostValue && poolCostValue !== "0")) {
            renderCostSymbol(ctx, "symbol_pool", poolCostValue, lowerLeft[0], lowerLeft[1], iconSize, symbolMap);
        } else if (bloodCostToggle && bloodCostToggle.checked && bloodCostValue && bloodCostValue !== "0") {
            renderCostSymbol(ctx, "symbol_blood", bloodCostValue, lowerLeft[0], lowerLeft[1], iconSize, symbolMap);
        }

        // Ensure only one of capacity or life symbol is rendered
        if (!isNaN(capacityValue) && capacityValue > 0) {
            renderCostSymbol(ctx, "symbol_capacity", capacityValue, lowerRight[0], lowerRight[1], capacity_size, symbolMap);
        } else if (!isNaN(lifeValue) && lifeValue > 0) {
            renderCostSymbol(ctx, "symbol_life", lifeValue, lowerRight[0], lowerRight[1], capacity_size, symbolMap);
        }
    }

    renderCostAndCapacitySymbols(ctx, symbolMap);

    // END of Render capacity symbol, life symbol (logic)


    
    // Render type icons (logic)
    
    function renderTypeIcons(ctx, typeMap) {
      // Get global settings
      const x             = parseFloat(document.getElementById("typeX").value) || 0;
      const y             = parseFloat(document.getElementById("typeY").value) || 0;
      const size          = parseFloat(document.getElementById("typeSize").value) || 40;
      const spacing       = parseFloat(document.getElementById("typeSpacing").value) || 0;
      const isHorizontal  = document.getElementById("typeOrientation").checked; // true = horizontal, false = vertical

      // Collect active type icons
      const activeIcons = typeMap
        .filter(type => document.getElementById(`${type.id}Toggle`).checked)
        .map(type => ({
          id: type.id,
          label: type.label,
          iconSrc: wrapImgPath(type.iconSrc)
        }));

      // Sort icons alphabetically by label
      activeIcons.sort((a, b) => a.label.localeCompare(b.label));

      // Render the icons
      let currentX = x;
      let currentY = y;

      activeIcons.forEach(icon => {
        const img = new Image();
        img.src = icon.iconSrc;

        img.onload = () => {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, currentX, currentY, size, size);

          // Update position for the next icon
          if (isHorizontal) {
            currentX += size + spacing; // Move right
          } else {
            currentY += size + spacing; // Move down
          }
        };

        img.onerror = () => {
          console.error(`Failed to load icon: ${icon.label} (${icon.iconSrc})`);
        };
      });
    }

    renderTypeIcons(ctx, typeMap);
    // ----------------------------------
    // Draw text field backgrounds
    // ----------------------------------

    // --- Header Background ---
    const nameBoxX        = parseFloat(document.getElementById("nameBoxX").value) || 20;
    const nameBoxY        = parseFloat(document.getElementById("nameBoxY").value) || 300;
    const nameBoxWidth    = parseFloat(document.getElementById("nameBoxWidth").value) || 318;
    const nameBoxHeight   = parseFloat(document.getElementById("nameBoxHeight").value) || 100;
    const nameBgColor     = document.getElementById("nameBgHex").value || document.getElementById("nameBgColor").value;
    const nameBgOpacity   = (parseFloat(document.getElementById("nameBgOpacity").value) || 0) * 0.01;
    const nameBgRgba      = hexToRgba(nameBgColor, nameBgOpacity);
    const nameBgBorder    = parseFloat(document.getElementById("nameBgBorder").value) || 0;
    ctx.fillStyle         = nameBgRgba;
    drawRoundedRect(ctx, nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight, 3, nameBgBorder);
    //ctx.fillRect(nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight);
    
    // --- Card Text Background ---
    const textBoxX        = parseFloat(document.getElementById("textBoxX").value) || 20;
    const textBoxY        = parseFloat(document.getElementById("textBoxY").value) || 300;
    const textBoxWidth    = parseFloat(document.getElementById("textBoxWidth").value) || 318;
    const textBoxHeight   = parseFloat(document.getElementById("textBoxHeight").value) || 100;
    const textBgColor     = document.getElementById("textBgHex").value || document.getElementById("textBgColor").value;
    const textBgOpacity   = (parseFloat(document.getElementById("textBgOpacity").value) || 0) * 0.01;
    const textBgRgba      = hexToRgba(textBgColor, textBgOpacity);
    const textBgBorder    = parseFloat(document.getElementById("textBgBorder").value) || 0;
    ctx.fillStyle         = textBgRgba;
    drawRoundedRect(ctx, textBoxX, textBoxY, textBoxWidth, textBoxHeight, 3, textBgBorder);
    // ctx.fillRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    
    // --- Flavour Text Background ---
    const flavourBoxX       = parseFloat(document.getElementById("flavourBoxX").value) || 20;
    const flavourBoxY       = parseFloat(document.getElementById("flavourBoxY").value) || (textBoxY + textBoxHeight + 20);
    const flavourBoxWidth   = parseFloat(document.getElementById("flavourBoxWidth").value) || (canvas.width - 40);
    const flavourBoxHeight  = parseFloat(document.getElementById("flavourBoxHeight").value) || 50;
    const flavourBgColor    = document.getElementById("flavourBgHex").value || document.getElementById("flavourBgColor").value;
    const flavourBgOpacity  = (parseFloat(document.getElementById("flavourBgOpacity").value) || 0) * 0.01;
    const flavourBgRgba     = hexToRgba(flavourBgColor, flavourBgOpacity);
    const flavourBgBorder   = parseFloat(document.getElementById("flavourBgBorder").value) || 0;
    ctx.fillStyle           = flavourBgRgba;
    drawRoundedRect(ctx, flavourBoxX, flavourBoxY, flavourBoxWidth, flavourBoxHeight, 3, flavourBgBorder);    
    // ctx.fillRect(flavourBoxX, flavourBoxY, flavourBoxWidth, flavourBoxHeight);
    
    // --- Artist Background ---
    const artistBoxX        = parseFloat(document.getElementById("artistBoxX").value) || (canvas.width - 110);
    const artistBoxY        = parseFloat(document.getElementById("artistBoxY").value) || (canvas.height - 30);
    const artistBoxWidth    = parseFloat(document.getElementById("artistBoxWidth").value) || 100;
    const artistBoxHeight   = parseFloat(document.getElementById("artistBoxHeight").value) || 20;
    const artistBgColor     = document.getElementById("artistBgHex").value || document.getElementById("artistBgColor").value;
    const artistBgOpacity   = (parseFloat(document.getElementById("artistBgOpacity").value) || 0) * 0.01;
    const artistBgRgba      = hexToRgba(artistBgColor, artistBgOpacity);
    const artistBgBorder    = parseFloat(document.getElementById("artistBgBorder").value) || 0;
    ctx.fillStyle           = artistBgRgba;
    drawRoundedRect(ctx, artistBoxX, artistBoxY, artistBoxWidth, artistBoxHeight, 3, artistBgBorder);  
    // ctx.fillRect(artistBoxX, artistBoxY, artistBoxWidth, artistBoxHeight);
    
    
    
    // ----------------------------------
    // Draw text on the backgrounds
    // ----------------------------------

    const nameRgba = hexToRgba(document.getElementById("nameHex").value, document.getElementById("nameOpacity").value);
    const textRgba = hexToRgba(document.getElementById("textHex").value, document.getElementById("textOpacity").value);
    const flavourRgba = hexToRgba(document.getElementById("flavourHex").value, document.getElementById("flavourOpacity").value);    
    const artistRgba = hexToRgba(document.getElementById("artistHex").value, document.getElementById("artistOpacity").value);    
    
    // --- Header Text (Card Name, Type, Subtype) ---
    ctx.save();
    ctx.fillStyle = hexToRgba(document.getElementById("nameHex").value, document.getElementById("nameOpacity").value) || "#000000";
    ctx.font = `${document.getElementById("nameFontSize").value}px ${document.getElementById("nameFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardName").value, parseFloat(document.getElementById("nameBoxX").value) + 5, parseFloat(document.getElementById("nameBoxY").value) + 20, parseFloat(document.getElementById("nameBoxWidth").value) - 10, 18, document.querySelector('input[name="nameEffect"]:checked').value);
    ctx.restore();

    // --- Card Text ---
    ctx.save();
    ctx.fillStyle = hexToRgba(document.getElementById("textHex").value, document.getElementById("textOpacity").value) || "#000000";
    ctx.font = `${document.getElementById("textFontSize").value}px ${document.getElementById("textFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardText").value, parseFloat(document.getElementById("textBoxX").value) + 5, parseFloat(document.getElementById("textBoxY").value) + 20, parseFloat(document.getElementById("textBoxWidth").value) - 10, 18, document.querySelector('input[name="textEffect"]:checked').value);
    ctx.restore();

    // --- Flavour Text ---
    ctx.save();
    ctx.fillStyle = hexToRgba(document.getElementById("flavourHex").value, document.getElementById("flavourOpacity").value) || "#000000";
    ctx.font = `${document.getElementById("flavourFontSize").value}px ${document.getElementById("flavourFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardFlavour").value, parseFloat(document.getElementById("flavourBoxX").value) + 5, parseFloat(document.getElementById("flavourBoxY").value) + 20, parseFloat(document.getElementById("flavourBoxWidth").value) - 10, 16, document.querySelector('input[name="flavourEffect"]:checked').value);
    ctx.restore();

    // --- Artist Text ---
    ctx.save();
    ctx.fillStyle = hexToRgba(document.getElementById("artistHex").value, document.getElementById("artistOpacity").value) || "#000000";
    ctx.font = `${document.getElementById("artistFontSize").value}px ${document.getElementById("artistFont").value}`;
    ctx.textAlign = "right";
    wrapText(ctx, document.getElementById("cardArtist").value, parseFloat(document.getElementById("artistBoxX").value) + parseFloat(document.getElementById("artistBoxWidth").value) - 5, parseFloat(document.getElementById("artistBoxY").value) + parseFloat(document.getElementById("artistBoxHeight").value) - 5, parseFloat(document.getElementById("artistBoxWidth").value) - 10, 16, document.querySelector('input[name="artistEffect"]:checked').value);
    ctx.restore();



  // -------------------------------
  // Render the Dark Pack logo
  // -------------------------------

  function renderDarkPackLogo(ctx, symbolMap) {
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
  }

  // Call the function to render the Dark Pack logo
  renderDarkPackLogo(ctx, symbolMap);

  }



  // -------------------------------
  // JSON Export/Import functions.
  // -------------------------------
  function saveAsJSON() {
      const template = {
          // General card properties
          cardName: document.getElementById("cardName").value,
          nameFont: document.getElementById("nameFont").value,
          nameFontSize: document.getElementById("nameFontSize").value,
          cardType: document.getElementById("cardType").value,
          cardSubtype: document.getElementById("cardSubtype").value,
          cardText: document.getElementById("cardText").value,
          textFont: document.getElementById("textFont").value,
          textFontSize: document.getElementById("textFontSize").value,
          offsetX: document.getElementById("offsetX").value,
          offsetY: document.getElementById("offsetY").value,
          cropTop: document.getElementById("cropTop").value,
          cropRight: document.getElementById("cropRight").value,
          cropBottom: document.getElementById("cropBottom").value,
          cropLeft: document.getElementById("cropLeft").value,
          scalePercent: document.getElementById("scalePercent").value,
          frameType: document.getElementById("frameType").value,
          canvasBgHex: document.getElementById("canvasBgHex")?.value || "",

          // Costs and symbols
          poolCost: document.getElementById("poolCost").value,
          poolCostToggle: document.getElementById("poolCostToggle").checked,
          bloodCost: document.getElementById("bloodCost").value,
          bloodCostToggle: document.getElementById("bloodCostToggle").checked,
          capacitySymbol: document.getElementById("capacitySymbol").value,
          lifeSymbol: document.getElementById("lifeSymbol").value,

          // Disciplines
          disciplines: disciplineData.reduce((acc, item) => {
              acc[item.id] = {
                  checked: document.getElementById(item.id).checked,
                  tier: parseInt(document.querySelector(`.discipline-slider[data-current-tier][id="${item.id}"]`)?.dataset.currentTier || "0", 10),
                  innate: document.getElementById(`${item.id}Feature`)?.checked || false
              };
              return acc;
          }, {}),

          // Clans
          clans: clanData.reduce((acc, item) => {
              acc[item.id] = {
                  checked: document.getElementById(item.id).checked,
                  display: document.getElementById(`${item.id}-display`)?.checked || false
              };
              return acc;
          }, {}),

          // Name box
          nameBoxX: document.getElementById("nameBoxX").value,
          nameBoxY: document.getElementById("nameBoxY").value,
          nameBoxWidth: document.getElementById("nameBoxWidth").value,
          nameBoxHeight: document.getElementById("nameBoxHeight").value,
          nameBgColor: document.getElementById("nameBgHex").value || document.getElementById("nameBgColor").value,
          nameBgOpacity: document.getElementById("nameBgOpacity").value,

          // Text box
          textBoxX: document.getElementById("textBoxX").value,
          textBoxY: document.getElementById("textBoxY").value,
          textBoxWidth: document.getElementById("textBoxWidth").value,
          textBoxHeight: document.getElementById("textBoxHeight").value,
          textBgColor: document.getElementById("textBgHex").value || document.getElementById("textBgColor").value,
          textBgOpacity: document.getElementById("textBgOpacity").value,

          // Flavour box
          flavourBoxX: document.getElementById("flavourBoxX").value,
          flavourBoxY: document.getElementById("flavourBoxY").value,
          flavourBoxWidth: document.getElementById("flavourBoxWidth").value,
          flavourBoxHeight: document.getElementById("flavourBoxHeight").value,
          flavourBgColor: document.getElementById("flavourBgHex").value || document.getElementById("flavourBgColor").value,
          flavourBgOpacity: document.getElementById("flavourBgOpacity").value,

          // Artist box
          artistBoxX: document.getElementById("artistBoxX").value,
          artistBoxY: document.getElementById("artistBoxY").value,
          artistBoxWidth: document.getElementById("artistBoxWidth").value,
          artistBoxHeight: document.getElementById("artistBoxHeight").value,
          artistBgColor: document.getElementById("artistBgHex").value || document.getElementById("artistBgColor").value,
          artistBgOpacity: document.getElementById("artistBgOpacity").value,

          // Original art source
          originalArtSrc: originalArtSrc
      };

      // Convert the template to JSON and trigger download
      const jsonStr = JSON.stringify(template, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "card_template.json";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
  }

  function importJSONFile(file) {
      const reader = new FileReader();
      reader.onload = function (event) {
          try {
              const template = JSON.parse(event.target.result);

              // Update general card properties
              document.getElementById("cardName").value = template.cardName || "";
              document.getElementById("nameFont").value = template.nameFont || "";
              document.getElementById("nameFontSize").value = template.nameFontSize || "";
              document.getElementById("cardType").value = template.cardType || "";
              document.getElementById("cardSubtype").value = template.cardSubtype || "";
              document.getElementById("cardText").value = template.cardText || "";
              document.getElementById("textFont").value = template.textFont || "";
              document.getElementById("textFontSize").value = template.textFontSize || "";
              document.getElementById("textBoxX").value = template.textBoxX || "";
              document.getElementById("textBoxY").value = template.textBoxY || "";
              document.getElementById("textBoxWidth").value = template.textBoxWidth || "";
              document.getElementById("textBoxHeight").value = template.textBoxHeight || "";
              document.getElementById("textBgHex").value = template.textBgColor || "";
              document.getElementById("textBgOpacity").value = template.textBgOpacity || "";
              document.getElementById("textHex").value = template.textColor || "";
              document.getElementById("flavourText").value = template.flavourText || "";
              document.getElementById("flavourFont").value = template.flavourFont || "";
              document.getElementById("flavourFontSize").value = template.flavourFontSize || "";
              document.getElementById("flavourTextHex").value = template.flavourTextColor || "";
              document.getElementById("artist").value = template.artist || "";
              document.getElementById("artistFont").value = template.artistFont || "";
              document.getElementById("artistFontSize").value = template.artistFontSize || "";
              document.getElementById("artistTextHex").value = template.artistTextColor || "";
              document.getElementById("offsetX").value = template.offsetX || "";
              document.getElementById("offsetY").value = template.offsetY || "";
              document.getElementById("cropTop").value = template.cropTop || "";
              document.getElementById("cropRight").value = template.cropRight || "";
              document.getElementById("cropBottom").value = template.cropBottom || "";
              document.getElementById("cropLeft").value = template.cropLeft || "";
              document.getElementById("scalePercent").value = template.scalePercent || "";
              document.getElementById("frameType").value = template.frameType || "";
              document.getElementById("canvasBgHex").value = template.canvasBgHex || "";

              // Update cost and capacity symbols
              document.getElementById("poolCost").value = template.poolCost || "";
              document.getElementById("poolCostToggle").checked = template.poolCostToggle || false;
              document.getElementById("bloodCost").value = template.bloodCost || "";
              document.getElementById("bloodCostToggle").checked = template.bloodCostToggle || false;
              document.getElementById("capacitySymbol").value = template.capacitySymbol || "";
              document.getElementById("lifeSymbol").value = template.lifeSymbol || "";

              // Update disciplines
              if (template.disciplines) {
                  Object.keys(template.disciplines).forEach(id => {
                      const discipline = template.disciplines[id];
                      const checkbox = document.getElementById(id);
                      const slider = document.querySelector(`.discipline-slider[data-current-tier][id="${id}"]`);
                      const displayCheckbox = document.getElementById(`${id}Display`);
                      const innateCheckbox = document.getElementById(`${id}Feature`);

                      if (checkbox) checkbox.checked = discipline.checked || false;
                      if (slider) slider.dataset.currentTier = discipline.tier || "0";
                      if (displayCheckbox) displayCheckbox.checked = discipline.display || false;
                      if (innateCheckbox) innateCheckbox.checked = discipline.innate || false;
                  });
              }

              // Update clans
              if (template.clans) {
                  Object.keys(template.clans).forEach(id => {
                      const clan = template.clans[id];
                      const checkbox = document.getElementById(id);
                      const displayCheckbox = document.getElementById(`${id}-display`);

                      if (checkbox) checkbox.checked = clan.checked || false;
                      if (displayCheckbox) displayCheckbox.checked = clan.display || false;
                  });
              }

              // Update name box
              document.getElementById("nameBoxX").value = template.nameBoxX || "";
              document.getElementById("nameBoxY").value = template.nameBoxY || "";
              document.getElementById("nameBoxWidth").value = template.nameBoxWidth || "";
              document.getElementById("nameBoxHeight").value = template.nameBoxHeight || "";
              document.getElementById("nameBgHex").value = template.nameBgColor || "";
              document.getElementById("nameBgOpacity").value = template.nameBgOpacity || "";

              // Update flavour box
              document.getElementById("flavourBoxX").value = template.flavourBoxX || "";
              document.getElementById("flavourBoxY").value = template.flavourBoxY || "";
              document.getElementById("flavourBoxWidth").value = template.flavourBoxWidth || "";
              document.getElementById("flavourBoxHeight").value = template.flavourBoxHeight || "";
              document.getElementById("flavourBgHex").value = template.flavourBgColor || "";
              document.getElementById("flavourBgOpacity").value = template.flavourBgOpacity || "";

              // Update artist box
              document.getElementById("artistBoxX").value = template.artistBoxX || "";
              document.getElementById("artistBoxY").value = template.artistBoxY || "";
              document.getElementById("artistBoxWidth").value = template.artistBoxWidth || "";
              document.getElementById("artistBoxHeight").value = template.artistBoxHeight || "";
              document.getElementById("artistBgHex").value = template.artistBgColor || "";
              document.getElementById("artistBgOpacity").value = template.artistBgOpacity || "";

              // Update the main art image
              if (template.originalArtSrc) {
                  originalArtSrc = template.wrapImgPath(originalArtSrc);
                  mainArtImage.src = originalArtSrc;
              }

              // Trigger a card update
              updateCard();
          } catch (error) {
              console.error("Error importing JSON:", error);
              alert("Failed to import JSON. Please check the file format.");
          }
      };
      reader.readAsText(file);
  } 
  
  // -------------------------------
  // Listen for changes on all form elements.
  // -------------------------------
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", updateCard);
    el.addEventListener("change", updateCard);
  });

  document.getElementById("updateCardButton").addEventListener("click", updateCard);
  
  // -------------------------------
  // Art Panel: File upload and URL load.
  // -------------------------------
  document.getElementById("artFile").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        originalArtSrc = event.target.result;
        mainArtImage.src = originalArtSrc;
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById("loadArtUrl").addEventListener("click", function () {
    const url = document.getElementById("artUrl").value;
    if (url) {
      originalArtSrc = url;
      mainArtImage.src = url;
    }
  });
  
  mainArtImage.onload = updateCard;
  
  // -------------------------------
  // Export the canvas as a PNG (preserving transparency).
  // -------------------------------
  document.getElementById("exportButton").addEventListener("click", function () {
    const canvas = document.getElementById("cardCanvas");
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "custom_card.png";
    link.href = dataURL;
    link.click();
  });
  
  // -------------------------------
  // JSON Save and Import events.
  // -------------------------------
  document.getElementById("saveJsonButton").addEventListener("click", saveAsJSON);
  
  document.getElementById("importJsonButton").addEventListener("click", function () {
    document.getElementById("jsonImport").click();
  });
  
  document.getElementById("jsonImport").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      importJSONFile(e.target.files[0]);
    }
  });

  // -------------------------------
  // Event listeners for colorpickers
  // -------------------------------
    const pickerDefName       = document.getElementById("nameColor");
    const pickerHexName       = document.getElementById("nameHex");
    const pickerDefBgName     = document.getElementById("nameBgColor");
    const pickerHexBgName     = document.getElementById("nameBgHex");
  
    const pickerDefCard       = document.getElementById("textColor");
    const pickerHexCard       = document.getElementById("textHex");
    const pickerDefBgCard     = document.getElementById("textBgColor");
    const pickerHexBgCard     = document.getElementById("textBgHex");  
  
    const pickerDefFlavour    = document.getElementById("flavourColor");
    const pickerHexFlavour    = document.getElementById("flavourHex"); 
    const pickerDefBgFlavour  = document.getElementById("flavourBgColor");
    const pickerHexBgFlavour  = document.getElementById("flavourBgHex");  
  
    const pickerDefArtist     = document.getElementById("artistColor");
    const pickerHexArtist     = document.getElementById("artistHex");  
    const pickerDefBgArtist   = document.getElementById("artistBgColor");
    const pickerHexBgArtist   = document.getElementById("artistBgHex");    

    // Function to update hex input when color picker changes
    function listenerPair(pick1,pick2) {
      pick1.addEventListener("input", () => { pick2.value = pick1.value; });
      pick2.addEventListener("input", () => {      
        let hex = pick2.value.trim();
        if (/^#([0-9A-Fa-f]{6})$/.test(hex)) { 
          pick1.value = hex; 
        }
      });
    }

    listenerPair(pickerDefName, pickerHexName);
    listenerPair(pickerDefBgName, pickerHexBgName);
    listenerPair(pickerDefCard, pickerHexCard);
    listenerPair(pickerDefBgCard, pickerHexBgCard);
    listenerPair(pickerDefFlavour, pickerHexFlavour);
    listenerPair(pickerDefBgFlavour, pickerHexBgFlavour);
    listenerPair(pickerDefArtist, pickerHexArtist);
    listenerPair(pickerDefBgArtist, pickerHexBgArtist);      

  
  // Initial render.
  updateCard();
});
