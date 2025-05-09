"use strict";

// Utility: Convert hex color to rgba string.
function hexToRgba(hex, opacity) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Utility: Draw a rounded rectangle path.
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

document.addEventListener("DOMContentLoaded", function () {
  // Global variable for the main art image and to store its original source.
  const mainArtImage = new Image();
  mainArtImage.crossOrigin = "anonymous";
  let originalArtSrc = "";

  // -------------------------------
  // 1. Define full discipline data (30 items), none selected by default.
  // -------------------------------
  const disciplineData = [
    { id: "disciplineAbombwe",      label: "Abombwe",       imgSrc: "https://via.placeholder.com/50?text=Abombwe",      image: new Image() },
    { id: "disciplineAuspex",        label: "Auspex",        imgSrc: "https://via.placeholder.com/50?text=Auspex",       image: new Image() },
    { id: "disciplineAnimalism",     label: "Animalism",     imgSrc: "https://via.placeholder.com/50?text=Animalism",    image: new Image() },
    { id: "disciplineCelerity",      label: "Celerity",      imgSrc: "https://via.placeholder.com/50?text=Celerity",     image: new Image() },
    { id: "disciplineChimerstry",    label: "Chimerstry",    imgSrc: "https://via.placeholder.com/50?text=Chimerstry",   image: new Image() },
    { id: "disciplineDaimonion",     label: "Daimonion",     imgSrc: "https://via.placeholder.com/50?text=Daimonion",    image: new Image() },
    { id: "disciplineDementation",   label: "Dementation",   imgSrc: "https://via.placeholder.com/50?text=Dementation",  image: new Image() },
    { id: "disciplineDominate",      label: "Dominate",      imgSrc: "https://via.placeholder.com/50?text=Dominate",     image: new Image() },
    { id: "disciplineFortitude",     label: "Fortitude",     imgSrc: "https://via.placeholder.com/50?text=Fortitude",    image: new Image() },
    { id: "disciplineMaleficia",     label: "Maleficia",     imgSrc: "https://via.placeholder.com/50?text=Maleficia",    image: new Image() },
    { id: "disciplineMelpominee",    label: "Melpominee",    imgSrc: "https://via.placeholder.com/50?text=Melpominee",   image: new Image() },
    { id: "disciplineMytherceria",   label: "Mytherceria",   imgSrc: "https://via.placeholder.com/50?text=Mytherceria",  image: new Image() },
    { id: "disciplineNecromancy",    label: "Necromancy",    imgSrc: "https://via.placeholder.com/50?text=Necromancy",   image: new Image() },
    { id: "disciplineObeah",         label: "Obeah",         imgSrc: "https://via.placeholder.com/50?text=Obeah",        image: new Image() },
    { id: "disciplineObfuscate",     label: "Obfuscate",     imgSrc: "https://via.placeholder.com/50?text=Obfuscate",    image: new Image() },
    { id: "disciplineObtenebration", label: "Obtenebration", imgSrc: "https://via.placeholder.com/50?text=Obtenebration",image: new Image() },
    { id: "disciplinePotence",       label: "Potence",       imgSrc: "https://via.placeholder.com/50?text=Potence",      image: new Image() },
    { id: "disciplinePresence",      label: "Presence",      imgSrc: "https://via.placeholder.com/50?text=Presence",     image: new Image() },
    { id: "disciplineProtean",       label: "Protean",       imgSrc: "https://via.placeholder.com/50?text=Protean",      image: new Image() },
    { id: "disciplineQuietus",       label: "Quietus",       imgSrc: "https://via.placeholder.com/50?text=Quietus",      image: new Image() },
    { id: "disciplineSanguinus",     label: "Sanguinus",     imgSrc: "https://via.placeholder.com/50?text=Sanguinus",    image: new Image() },
    { id: "disciplineSerpentis",     label: "Serpentis",     imgSrc: "https://via.placeholder.com/50?text=Serpentis",    image: new Image() },
    { id: "disciplineSpiritus",      label: "Spiritus",      imgSrc: "https://via.placeholder.com/50?text=Spiritus",     image: new Image() },
    { id: "disciplineStriga",        label: "Striga",        imgSrc: "https://via.placeholder.com/50?text=Striga",       image: new Image() },
    { id: "disciplineTemporis",      label: "Temporis",      imgSrc: "https://via.placeholder.com/50?text=Temporis",     image: new Image() },
    { id: "disciplineThanatosis",    label: "Thanatosis",    imgSrc: "https://via.placeholder.com/50?text=Thanatosis",   image: new Image() },
    { id: "disciplineThaumaturgy",   label: "Thaumaturgy",   imgSrc: "https://via.placeholder.com/50?text=Thaumaturgy",  image: new Image() },
    { id: "disciplineValeren",       label: "Valeren",       imgSrc: "https://via.placeholder.com/50?text=Valeren",      image: new Image() },
    { id: "disciplineVicissitude",   label: "Vicissitude",   imgSrc: "https://via.placeholder.com/50?text=Vicissitude",  image: new Image() },
    { id: "disciplineVisceratika",   label: "Visceratika",   imgSrc: "https://via.placeholder.com/50?text=Visceratika",  image: new Image() },
  ];
  
  disciplineData.forEach(symbol => {
    symbol.image.src = symbol.imgSrc;
    symbol.image.onload = updateCard;
  });
  
  // -------------------------------
  // 2. Generate discipline toggles (none checked by default)
  // -------------------------------
  const disciplinesGrid = document.getElementById("disciplinesGrid");
  disciplineData.forEach(item => {
    const div = document.createElement("div");
    div.className = "toggle-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item.id;
    checkbox.checked = false;
    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerText = item.label;
    div.appendChild(checkbox);
    div.appendChild(label);
    disciplinesGrid.appendChild(div);
  });
  
  // -------------------------------
  // 3. Define clan data (none checked by default)
  // -------------------------------
  const clanData = [
    { id: "clanAssamite",           label: "Assamite",           imgSrc: "https://via.placeholder.com/50?text=A",    image: new Image() },
    { id: "clanBrujah",             label: "Brujah",             imgSrc: "https://via.placeholder.com/50?text=B",    image: new Image() },
    { id: "clanBrujahAntitribu",    label: "Brujah Antitribu",   imgSrc: "https://via.placeholder.com/50?text=BA",   image: new Image() },
    { id: "clanGangrel",            label: "Gangrel",            imgSrc: "https://via.placeholder.com/50?text=G",    image: new Image() },
    { id: "clanGangrelAntitribu",   label: "Gangrel Antitribu",  imgSrc: "https://via.placeholder.com/50?text=GA",   image: new Image() },
    { id: "clanLasombra",           label: "Lasombra",           imgSrc: "https://via.placeholder.com/50?text=L",    image: new Image() },
    { id: "clanGiovanni",           label: "Giovanni",           imgSrc: "https://via.placeholder.com/50?text=Gio",  image: new Image() },
    { id: "clanCappadocian",        label: "Cappadocian",        imgSrc: "https://via.placeholder.com/50?text=C",    image: new Image() },
    { id: "clanAhrimane",           label: "Ahrimane",           imgSrc: "https://via.placeholder.com/50?text=AH",   image: new Image() },
    { id: "clanMalkavian",          label: "Malkavian",          imgSrc: "https://via.placeholder.com/50?text=M",    image: new Image() },
    { id: "clanMalkavianAntitribu", label: "Malkavian Antitribu",imgSrc: "https://via.placeholder.com/50?text=MA",   image: new Image() },
    { id: "clanFollowersOfSet",     label: "Followers of Set",   imgSrc: "https://via.placeholder.com/50?text=FoS",  image: new Image() },
    { id: "clanNosferatu",          label: "Nosferatu",          imgSrc: "https://via.placeholder.com/50?text=N",    image: new Image() },
    { id: "clanNosferatuAntitribu", label: "Nosferatu Antitribu", imgSrc: "https://via.placeholder.com/50?text=NA",   image: new Image() },
    { id: "clanRavnos",             label: "Ravnos",             imgSrc: "https://via.placeholder.com/50?text=R",    image: new Image() },
    { id: "clanSalubri",            label: "Salubri",            imgSrc: "https://via.placeholder.com/50?text=S",    image: new Image() },
    { id: "clanSalubriAntitribu",   label: "Salubri Antitribu",   imgSrc: "https://via.placeholder.com/50?text=SA",   image: new Image() },
    { id: "clanToreador",           label: "Toreador",           imgSrc: "https://via.placeholder.com/50?text=T",    image: new Image() },
    { id: "clanToreadorAntitribu",  label: "Toreador Antitribu",  imgSrc: "https://via.placeholder.com/50?text=TA",   image: new Image() },
    { id: "clanTremere",            label: "Tremere",            imgSrc: "https://via.placeholder.com/50?text=Tr",   image: new Image() },
    { id: "clanTremereAntitribu",   label: "Tremere Antitribu",   imgSrc: "https://via.placeholder.com/50?text=TrA",  image: new Image() },
    { id: "clanTzimisce",           label: "Tzimisce",           imgSrc: "https://via.placeholder.com/50?text=TZ",   image: new Image() },
    { id: "clanVentrue",            label: "Ventrue",            imgSrc: "https://via.placeholder.com/50?text=V",    image: new Image() },
    { id: "clanVentrueAntitribu",   label: "Ventrue Antitribu",   imgSrc: "https://via.placeholder.com/50?text=VA",   image: new Image() },
    { id: "clanHarbringersOfSkulls",label: "Harbringers of Skulls", imgSrc: "https://via.placeholder.com/50?text=HS", image: new Image() }
  ];
  
  clanData.forEach(symbol => {
    symbol.image.src = symbol.imgSrc;
    symbol.image.onload = updateCard;
  });
  
  // -------------------------------
  // Helper: Wrap text within a given width.
  // -------------------------------
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
  
  // -------------------------------
  // updateCard(): Renders the entire card.
  // -------------------------------
  function updateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Reserve a 4px margin. Inner area is 350x492.
    const margin = 4;
    const innerX = margin;
    const innerY = margin;
    const innerWidth = canvas.width - margin * 2;
    const innerHeight = canvas.height - margin * 2;
    const cornerRadius = 8;
  
    // --- Draw main art image within the inner rounded rectangle region.
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
      // Clip to inner area with rounded corners.
      roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
      ctx.clip();
      ctx.drawImage(
        mainArtImage,
        srcX,
        srcY,
        srcWidth,
        srcHeight,
        innerX + offsetX,
        innerY + offsetY,
        destWidth,
        destHeight
      );
      ctx.restore();
    }
  
    // --- Draw a 6px black rounded border around the inner area.
    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";
    roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
    ctx.stroke();
    ctx.restore();


      // --- Draw Frame Overlay if selected.
  const frameType = document.getElementById("frameType").value;
  if (frameType !== "none") {
    ctx.save();
    
    if (frameType === "simple") {
      // Create the image object for the overlay
      const overlayImage = new Image();
      overlayImage.src = "marble001_test.png";
  
      // Draw the image when it has fully loaded.
      overlayImage.onload = function () {
        // Draw image using the same dimensions used for the inner rectangle
        ctx.drawImage(overlayImage, innerX, innerY, innerWidth, innerHeight);
      };
    } else {
      ctx.lineWidth = 6;
      // Determine stroke color for "classic" and "modern"
      if (frameType === "classic") {
        ctx.strokeStyle = "gold";
      } else if (frameType === "modern") {
        ctx.strokeStyle = "#444";
      }
      // Draw the rounded rectangle frame
      roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
    // --- Draw Header Text (card name, type, subtype) on full canvas.
    ctx.fillStyle = document.getElementById("nameTextHex").value || "#000000";
    ctx.font = `${document.getElementById("nameFontSize").value}px ${document.getElementById("nameFont").value}`;
    ctx.textAlign = "center";
    ctx.fillText(document.getElementById("cardName").value, canvas.width / 2, 30);
    ctx.font = "italic 16px Arial";
    ctx.fillText(document.getElementById("cardType").value, canvas.width / 2, 50);
    ctx.fillText(document.getElementById("cardSubtype").value, canvas.width / 2, 70);
  
    // --- Draw Card Text Box Background & Card Text ---
    const boxX = parseFloat(document.getElementById("textBoxX").value) || 20;
    const boxY = parseFloat(document.getElementById("textBoxY").value) || 300;
    const boxWidth = parseFloat(document.getElementById("textBoxWidth").value) || 318;
    const boxHeight = parseFloat(document.getElementById("textBoxHeight").value) || 100;
    // Use hex from textBgHex field if available.
    const textBgColor = document.getElementById("textBgHex").value || document.getElementById("textBgColor").value;
    const textBgOpacity = (parseFloat(document.getElementById("textBgOpacity").value) || 50) / 100;
    const bgRgba = hexToRgba(textBgColor, textBgOpacity);
  
    ctx.fillStyle = bgRgba;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  
    ctx.fillStyle = document.getElementById("textHex").value || "#000000";
    ctx.font = `${document.getElementById("textFontSize").value}px ${document.getElementById("textFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardText").value, boxX + 5, boxY + 20, boxWidth - 10, 18);
  
    // --- Draw Flavour Text ---
    ctx.fillStyle = document.getElementById("flavourTextHex").value || "#000000";
    ctx.font = `${document.getElementById("flavourFontSize").value}px ${document.getElementById("flavourFont").value}`;
    wrapText(ctx, document.getElementById("flavourText").value, 20, boxY + boxHeight + 20, canvas.width - 40, 16);
  
    // --- Draw Artist ---
    ctx.fillStyle = document.getElementById("artistTextHex").value || "#000000";
    ctx.font = `${document.getElementById("artistFontSize").value}px ${document.getElementById("artistFont").value}`;
    ctx.textAlign = "right";
    ctx.fillText(document.getElementById("artist").value, canvas.width - 10, canvas.height - 10);
  
    // --- Draw Discipline Icons ---
    const activeDisciplines = disciplineData.filter(symbol => {
      const cb = document.getElementById(symbol.id);
      return cb && cb.checked && symbol.image.complete;
    });
  
    const iconSize = 50;
    const spacing = 10;
    const maxIconsPerRow = Math.floor((canvas.width - 20) / (iconSize + spacing));
    let currentRow = 0, countInRow = 0;
    activeDisciplines.forEach(symbol => {
      if (countInRow >= maxIconsPerRow) {
        countInRow = 0;
        currentRow++;
      }
      const x = 20 + countInRow * (iconSize + spacing);
      const y = 80 + currentRow * (iconSize + spacing);
      ctx.drawImage(symbol.image, x, y, iconSize, iconSize);
      countInRow++;
    });
  
    // --- Draw Clan Icons ---
    const clanMargin = 10;
    const clanSize = 50;
    const maxPerRowClan = Math.floor((canvas.width - clanMargin * 2) / (clanSize + clanMargin));
    let clanRow = 0, countInClanRow = 0;
    clanData.forEach(symbol => {
      const cb = document.getElementById(symbol.id);
      if (cb && cb.checked && symbol.image.complete) {
        const x = clanMargin + countInClanRow * (clanSize + clanMargin);
        const y = canvas.height - clanMargin - clanSize - (clanRow * (clanSize + clanMargin));
        ctx.drawImage(symbol.image, x, y, clanSize, clanSize);
        countInClanRow++;
        if (countInClanRow >= maxPerRowClan) {
          countInClanRow = 0;
          clanRow++;
        }
      }
    });
  }
  
  // -------------------------------
  // JSON Export/Import functions.
  // -------------------------------
  function saveAsJSON() {
    const template = {
      cardName: document.getElementById("cardName").value,
      nameFont: document.getElementById("nameFont").value,
      nameFontSize: document.getElementById("nameFontSize").value,
      cardType: document.getElementById("cardType").value,
      cardSubtype: document.getElementById("cardSubtype").value,
      cardText: document.getElementById("cardText").value,
      textFont: document.getElementById("textFont").value,
      textFontSize: document.getElementById("textFontSize").value,
      textBoxX: document.getElementById("textBoxX").value,
      textBoxY: document.getElementById("textBoxY").value,
      textBoxWidth: document.getElementById("textBoxWidth").value,
      textBoxHeight: document.getElementById("textBoxHeight").value,
      textBgColor: document.getElementById("textBgHex").value || document.getElementById("textBgColor").value,
      textBgOpacity: document.getElementById("textBgOpacity").value,
      textColor: document.getElementById("textHex").value,
      flavourText: document.getElementById("flavourText").value,
      flavourFont: document.getElementById("flavourFont").value,
      flavourFontSize: document.getElementById("flavourFontSize").value,
      flavourTextColor: document.getElementById("flavourTextHex").value,
      artist: document.getElementById("artist").value,
      artistFont: document.getElementById("artistFont").value,
      artistFontSize: document.getElementById("artistFontSize").value,
      artistTextColor: document.getElementById("artistTextHex").value,
      offsetX: document.getElementById("offsetX").value,
      offsetY: document.getElementById("offsetY").value,
      cropTop: document.getElementById("cropTop").value,
      cropRight: document.getElementById("cropRight").value,
      cropBottom: document.getElementById("cropBottom").value,
      cropLeft: document.getElementById("cropLeft").value,
      scalePercent: document.getElementById("scalePercent").value,
      frameType: document.getElementById("frameType").value,
      canvasBgHex: document.getElementById("canvasBgHex") ? document.getElementById("canvasBgHex").value : "",
      disciplines: disciplineData.reduce((acc, item) => {
        acc[item.id] = document.getElementById(item.id).checked;
        return acc;
      }, {}),
      clans: clanData.reduce((acc, item) => {
        acc[item.id] = document.getElementById(item.id).checked;
        return acc;
      }, {}),
      originalArtSrc: originalArtSrc
    };
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
    reader.onload = function(e) {
      try {
        const template = JSON.parse(e.target.result);
        document.getElementById("cardName").value = template.cardName || "";
        document.getElementById("nameFont").value = template.nameFont || "Arial";
        document.getElementById("nameFontSize").value = template.nameFontSize || "20";
        document.getElementById("cardType").value = template.cardType || "Crypt";
        document.getElementById("cardSubtype").value = template.cardSubtype || "Action";
        document.getElementById("cardText").value = template.cardText || "";
        document.getElementById("textFont").value = template.textFont || "Arial";
        document.getElementById("textFontSize").value = template.textFontSize || "14";
        document.getElementById("textBoxX").value = template.textBoxX || "20";
        document.getElementById("textBoxY").value = template.textBoxY || "300";
        document.getElementById("textBoxWidth").value = template.textBoxWidth || "318";
        document.getElementById("textBoxHeight").value = template.textBoxHeight || "100";
        document.getElementById("textBgColor").value = template.textBgColor || "#ffffff";
        document.getElementById("textBgHex").value = template.textBgColor || "#ffffff";
        document.getElementById("textBgOpacity").value = template.textBgOpacity || "50";
        if(template.canvasBgHex && document.getElementById("canvasBgHex")){
          document.getElementById("canvasBgHex").value = template.canvasBgHex;
        }
        document.getElementById("textHex").value = template.textColor || "#000000";
        document.getElementById("flavourText").value = template.flavourText || "";
        document.getElementById("flavourFont").value = template.flavourFont || "Arial";
        document.getElementById("flavourFontSize").value = template.flavourFontSize || "12";
        document.getElementById("flavourTextHex").value = template.flavourTextColor || "#000000";
        document.getElementById("artist").value = template.artist || "";
        document.getElementById("artistFont").value = template.artistFont || "Arial";
        document.getElementById("artistFontSize").value = template.artistFontSize || "12";
        document.getElementById("artistTextHex").value = template.artistTextColor || "#000000";
        document.getElementById("offsetX").value = template.offsetX || "0";
        document.getElementById("offsetY").value = template.offsetY || "0";
        document.getElementById("cropTop").value = template.cropTop || "0";
        document.getElementById("cropRight").value = template.cropRight || "0";
        document.getElementById("cropBottom").value = template.cropBottom || "0";
        document.getElementById("cropLeft").value = template.cropLeft || "0";
        document.getElementById("scalePercent").value = template.scalePercent || "100";
        document.getElementById("frameType").value = template.frameType || "none";
  
        for (let key in template.disciplines) {
          const cb = document.getElementById(key);
          if (cb) { cb.checked = template.disciplines[key]; }
        }
  
        for (let key in template.clans) {
          const cb = document.getElementById(key);
          if (cb) { cb.checked = template.clans[key]; }
        }
  
        if (template.originalArtSrc) {
          originalArtSrc = template.originalArtSrc;
          mainArtImage.src = originalArtSrc;
        }
  
        updateCard();
      } catch (err) {
        alert("Failed to parse JSON: " + err);
      }
    };
    reader.readAsText(file);
  }
  
  // -------------------------------
  // Event listeners for all inputs.
  // -------------------------------
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", updateCard);
    el.addEventListener("change", updateCard);
  });
  
  // -------------------------------
  // Art Panel: File upload & URL load.
  // -------------------------------
  document.getElementById("artFile").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      let reader = new FileReader();
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
  // Export as PNG.
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
  // JSON Save/Import events.
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
  
  // Initial render.
  updateCard();
});
