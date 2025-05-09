"use strict";

// --- Utility: Convert a hex color (e.g. "#ff0000") to an rgba string.
function hexToRgba(hex, opacity) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// --- Utility: Draw a rounded rectangle path.
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

// --- Wait for DOM loaded.
document.addEventListener("DOMContentLoaded", function () {
  // Global variables for the main art image & its original source.
  const mainArtImage = new Image();
  mainArtImage.crossOrigin = "anonymous";
  let originalArtSrc = "";
  // Global frame image for overlay when "normal" is selected.
  let frameImage = null;

  // -------------------------------
  // 1. Define discipline data (30 items) – none are selected by default.
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
    { id: "disciplineVisceratika",   label: "Visceratika",   imgSrc: "https://via.placeholder.com/50?text=Visceratika",  image: new Image() }
  ];
  
  disciplineData.forEach(symbol => {
    symbol.image.src = symbol.imgSrc;
    symbol.image.onload = updateCard;
  });
  
  // -------------------------------
  // 2. Generate discipline toggles (unchecked by default).
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
  // 3. Define clan data (unchecked by default).
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
  // updateCard(): Renders the complete card.
  // -------------------------------
  function updateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Reserve 4px margin; inner area is 350x492.
    const margin = 4;
    const innerX = margin;
    const innerY = margin;
    const innerWidth = canvas.width - margin * 2;
    const innerHeight = canvas.height - margin * 2;
    const cornerRadius = 4;
  
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
      roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
      ctx.clip();
      ctx.drawImage(mainArtImage, srcX, srcY, srcWidth, srcHeight,
                    innerX + offsetX, innerY + offsetY, destWidth, destHeight);
      ctx.restore();
    }
  
    // --- Draw a 6px black rounded border around the inner area.
    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";
    roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
    ctx.stroke();
    ctx.restore();


    // --- Vampire frame
    const frameType = document.getElementById("cardType").value;    
    if (frameType === "Crypt") {
        frameBgImage = new Image();
        frameBgImage.src = "ellise_frame.png";
        frameBgImage.onload = updateCard;
    }
    
    // --- Frame Overlay: if frame type is "normal", draw the marble image overlay.
    const frameType = document.getElementById("frameType").value;
    if (frameType === "normal") {
      if (!frameImage) {
        frameImage = new Image();
        frameImage.src = "marble_001_test.png";
        frameImage.onload = updateCard;
      }
      ctx.save();
      roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
      ctx.clip();
      ctx.drawImage(frameBgImage, innerX, innerY, innerWidth, innerHeight);      
      ctx.drawImage(frameImage, innerX, innerY, innerWidth, innerHeight);
      ctx.restore();
    } else if (frameType !== "none") {
      ctx.save();
      ctx.lineWidth = 6;
      if (frameType === "simple") {
        ctx.strokeStyle = "black";
      } else if (frameType === "classic") {
        ctx.strokeStyle = "gold";
      } else if (frameType === "modern") {
        ctx.strokeStyle = "#444";
      }
      roundRect(ctx, innerX, innerY, innerWidth, innerHeight, cornerRadius);
      ctx.stroke();
      ctx.restore();
    }

    // === DRAW ALL BACKGROUNDS FIRST ===
    
    // --- Header Background ---
    const nameBoxX = parseFloat(document.getElementById("nameBoxX").value) || 20;
    const nameBoxY = parseFloat(document.getElementById("nameBoxY").value) || 300;
    const nameBoxWidth = parseFloat(document.getElementById("nameBoxWidth").value) || 318;
    const nameBoxHeight = parseFloat(document.getElementById("nameBoxHeight").value) || 100;
    const nameBgColor = document.getElementById("nameBgHex").value || document.getElementById("nameBgColor").value;
    const nameBgOpacity = (parseFloat(document.getElementById("nameBgOpacity").value) || 50) / 100;
    const nameBgRgba = hexToRgba(nameBgColor, nameBgOpacity);
    ctx.fillStyle = nameBgRgba;
    ctx.fillRect(nameBoxX, nameBoxY, nameBoxWidth, nameBoxHeight);
    
    // --- Card Text Background ---
    const textBoxX = parseFloat(document.getElementById("textBoxX").value) || 20;
    const textBoxY = parseFloat(document.getElementById("textBoxY").value) || 300;
    const textBoxWidth = parseFloat(document.getElementById("textBoxWidth").value) || 318;
    const textBoxHeight = parseFloat(document.getElementById("textBoxHeight").value) || 100;
    const textBgColor = document.getElementById("textBgHex").value || document.getElementById("textBgColor").value;
    const textBgOpacity = (parseFloat(document.getElementById("textBgOpacity").value) || 50) / 100;
    const textBgRgba = hexToRgba(textBgColor, textBgOpacity);
    ctx.fillStyle = textBgRgba;
    ctx.fillRect(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
    
    // --- Flavour Text Background ---
    const flavourBoxX = parseFloat(document.getElementById("flavourBoxX").value) || 20;
    const flavourBoxY = parseFloat(document.getElementById("flavourBoxY").value) || (textBoxY + textBoxHeight + 20);
    const flavourBoxWidth = parseFloat(document.getElementById("flavourBoxWidth").value) || (canvas.width - 40);
    const flavourBoxHeight = parseFloat(document.getElementById("flavourBoxHeight").value) || 50;
    const flavourBgColor = document.getElementById("flavourBgHex").value || document.getElementById("flavourBgColor").value;
    const flavourBgOpacity = (parseFloat(document.getElementById("flavourBgOpacity").value) || 50) / 100;
    const flavourBgRgba = hexToRgba(flavourBgColor, flavourBgOpacity);
    ctx.fillStyle = flavourBgRgba;
    ctx.fillRect(flavourBoxX, flavourBoxY, flavourBoxWidth, flavourBoxHeight);
    
    // --- Artist Background ---
    const artistBoxX = parseFloat(document.getElementById("artistBoxX").value) || (canvas.width - 110);
    const artistBoxY = parseFloat(document.getElementById("artistBoxY").value) || (canvas.height - 30);
    const artistBoxWidth = parseFloat(document.getElementById("artistBoxWidth").value) || 100;
    const artistBoxHeight = parseFloat(document.getElementById("artistBoxHeight").value) || 20;
    const artistBgColor = document.getElementById("artistBgHex").value || document.getElementById("artistBgColor").value;
    const artistBgOpacity = (parseFloat(document.getElementById("artistBgOpacity").value) || 50) / 100;
    const artistBgRgba = hexToRgba(artistBgColor, artistBgOpacity);
    ctx.fillStyle = artistBgRgba;
    ctx.fillRect(artistBoxX, artistBoxY, artistBoxWidth, artistBoxHeight);
    
    
    
    // === DRAW ALL TEXT ON TOP OF THE BACKGROUNDS ===
    
    // --- Header Text (Card Name, Type, Subtype) ---
    ctx.save();
    ctx.fillStyle = document.getElementById("nameHex").value || "#000000";
    ctx.font = `${document.getElementById("nameFontSize").value}px ${document.getElementById("nameFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardName").value, nameBoxX + 5, nameBoxY + 20, nameBoxWidth - 10, 18);
    ctx.restore();
    
    // --- Card Text ---
    ctx.save();
    ctx.fillStyle = document.getElementById("textHex").value || "#000000";
    ctx.font = `${document.getElementById("textFontSize").value}px ${document.getElementById("textFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardText").value, textBoxX + 5, textBoxY + 20, textBoxWidth - 10, 18);
    ctx.restore();
    
    // --- Flavour Text ---
    ctx.save();
    ctx.fillStyle = document.getElementById("flavourHex").value || "#000000";
    ctx.font = `${document.getElementById("flavourFontSize").value}px ${document.getElementById("flavourFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardFlavour").value, flavourBoxX + 5, flavourBoxY + 20, flavourBoxWidth - 10, 16);
    ctx.restore();
    
    // --- Artist Text ---
    ctx.save();
    ctx.fillStyle = document.getElementById("artistHex").value || "#000000";
    ctx.font = `${document.getElementById("artistFontSize").value}px ${document.getElementById("artistFont").value}`;
    ctx.textAlign = "right";
    ctx.fillText(
      document.getElementById("cardArtist").value,
      artistBoxX + artistBoxWidth - 5,
      artistBoxY + artistBoxHeight - 5
    );
    ctx.restore();


    // --- Draw Discipline Icons.
    const activeDisciplines = disciplineData.filter(symbol => {
      const cb = document.getElementById(symbol.id);
      return cb && cb.checked && symbol.image.complete;
    });
    const iconSize = 50;
    const spacing = 10;
    const maxIconsPerRow = Math.floor((canvas.width - 20) / (iconSize + spacing));
    let currentRow2 = 0, countInRow2 = 0;
    activeDisciplines.forEach(symbol => {
      if (countInRow2 >= maxIconsPerRow) {
        countInRow2 = 0;
        currentRow2++;
      }
      const x = 20 + countInRow2 * (iconSize + spacing);
      const y = 80 + currentRow2 * (iconSize + spacing);
      ctx.drawImage(symbol.image, x, y, iconSize, iconSize);
      countInRow2++;
    });
  
    // --- Draw Clan Icons.
    const clanMargin = 10;
    const clanSize = 50;
    const maxPerRowClan = Math.floor((canvas.width - clanMargin*2) / (clanSize + clanMargin));
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
        if (template.canvasBgHex && document.getElementById("canvasBgHex")) {
          document.getElementById("canvasBgHex").value = template.canvasBgHex;
        }
        document.getElementById("textHex").value = template.textColor || "#000000";
        document.getElementById("flavourText").value = template.flavourText || "";
        document.getElementById("flavourFont").value = template.flavourFont || "Arial";
        document.getElementById("flavourFontSize").value = template.flavourFontSize || "12";
        document.getElementById("flavourHex").value = template.flavourTextColor || "#000000";
        document.getElementById("artist").value = template.artist || "";
        document.getElementById("artistFont").value = template.artistFont || "Arial";
        document.getElementById("artistFontSize").value = template.artistFontSize || "12";
        document.getElementById("artistHex").value = template.artistTextColor || "#000000";
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
  // Listen for changes on all form elements.
  // -------------------------------
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", updateCard);
    el.addEventListener("change", updateCard);
  });
  
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
    const pickerDefName = document.getElementById("nameColor");
    const pickerHexName = document.getElementById("nameHex");
    const pickerDefBgName = document.getElementById("nameBgColor");
    const pickerHexBgName = document.getElementById("nameBgHex");
  
    const pickerDefCard = document.getElementById("textColor");
    const pickerHexCard = document.getElementById("textHex");
    const pickerDefBgCard = document.getElementById("textBgColor");
    const pickerHexBgCard = document.getElementById("textBgHex");  
  
    const pickerDefFlavour = document.getElementById("flavourColor");
    const pickerHexFlavour = document.getElementById("flavourHex"); 
    const pickerDefBgFlavour = document.getElementById("flavourBgColor");
    const pickerHexBgFlavour = document.getElementById("flavourBgHex");  
  
    const pickerDefArtist = document.getElementById("artistColor");
    const pickerHexArtist = document.getElementById("artistHex");  
    const pickerDefBgArtist = document.getElementById("artistBgColor");
    const pickerHexBgArtist = document.getElementById("artistBgHex");    

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
