document.addEventListener("DOMContentLoaded", function () {
  // Global variable for main art image
  const mainArtImage = new Image();
  mainArtImage.crossOrigin = "anonymous";

  // -------------------------------
  // 1. Define full discipline data (30 items)
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
  // 2. Dynamically generate discipline toggles
  // -------------------------------
  const disciplinesGrid = document.getElementById("disciplinesGrid");
  disciplineData.forEach(item => {
    const div = document.createElement("div");
    div.className = "toggle-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item.id;
    checkbox.checked = true;
    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerText = item.label;
    div.appendChild(checkbox);
    div.appendChild(label);
    disciplinesGrid.appendChild(div);
  });
  
  // -------------------------------
  // 3. Define clan data (statically defined; matching HTML)
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
  // Helper: Text wrapping within a given width.
  // -------------------------------
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }
  
  // -------------------------------
  // updateCard(): Composite drawing function.
  // -------------------------------
  function updateCard() {
    const canvas = document.getElementById("cardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // --- Draw Main Art Image (if loaded) ---
    if (mainArtImage.complete && mainArtImage.naturalWidth > 0) {
      const offsetX = parseFloat(document.getElementById("offsetX").value) || 0;
      const offsetY = parseFloat(document.getElementById("offsetY").value) || 0;
      const cropTop = parseFloat(document.getElementById("cropTop").value) || 0;
      const cropRight = parseFloat(document.getElementById("cropRight").value) || 0;
      const cropBottom = parseFloat(document.getElementById("cropBottom").value) || 0;
      const cropLeft = parseFloat(document.getElementById("cropLeft").value) || 0;
      const scalePercent = parseFloat(document.getElementById("scalePercent").value) || 100;
      
      // Compute source rectangle from the image
      const srcX = cropLeft;
      const srcY = cropTop;
      const srcWidth = mainArtImage.naturalWidth - cropLeft - cropRight;
      const srcHeight = mainArtImage.naturalHeight - cropTop - cropBottom;
      
      // Destination width/height after applying scale
      const destWidth = srcWidth * (scalePercent / 100);
      const destHeight = srcHeight * (scalePercent / 100);
      
      // Clip to the canvas size (if the resulting image is larger than 358x500)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.clip();
      
      ctx.drawImage(mainArtImage, srcX, srcY, srcWidth, srcHeight,
                      offsetX, offsetY, destWidth, destHeight);
      ctx.restore();
    }
    
    // --- Draw Header Text ---
    ctx.fillStyle = "#000";
    // Card Name
    ctx.font = `${document.getElementById("nameFontSize").value}px ${document.getElementById("nameFont").value}`;
    ctx.textAlign = "center";
    ctx.fillText(document.getElementById("cardName").value, canvas.width / 2, 30);
    // Type and Subtype (using fixed font for simplicity)
    ctx.font = "italic 16px Arial";
    ctx.fillText(document.getElementById("cardType").value, canvas.width / 2, 50);
    ctx.fillText(document.getElementById("cardSubtype").value, canvas.width / 2, 70);
    
    // --- Render Discipline Icons (wrapped rows) ---
    const activeDisciplines = disciplineData.filter(symbol => {
      const checkbox = document.getElementById(symbol.id);
      return checkbox && checkbox.checked && symbol.image.complete;
    });
    const leftMargin = 20;
    const iconSize = 50;
    const spacing = 10;
    const maxIconsPerRow = Math.floor((canvas.width - leftMargin * 2) / (iconSize + spacing));
    const disciplineStartY = 80; // just below header
    let currentRow = 0;
    let countInRow = 0;
    activeDisciplines.forEach(symbol => {
      if (countInRow >= maxIconsPerRow) {
        countInRow = 0;
        currentRow++;
      }
      const x = leftMargin + countInRow * (iconSize + spacing);
      const y = disciplineStartY + currentRow * (iconSize + spacing);
      ctx.drawImage(symbol.image, x, y, iconSize, iconSize);
      countInRow++;
    });
    const disciplineBlockHeight = activeDisciplines.length > 0 
      ? (currentRow + 1) * (iconSize + spacing) 
      : 0;
    const cardTextStartY = disciplineStartY + disciplineBlockHeight + spacing;
    
    // --- Draw Card Text ---
    ctx.font = `${document.getElementById("textFontSize").value}px ${document.getElementById("textFont").value}`;
    ctx.textAlign = "left";
    wrapText(ctx, document.getElementById("cardText").value, 20, cardTextStartY, canvas.width - 40, 18);
    
    // --- Draw Flavour Text ---
    ctx.font = `${document.getElementById("flavourFontSize").value}px ${document.getElementById("flavourFont").value}`;
    wrapText(ctx, document.getElementById("flavourText").value, 20, cardTextStartY + 80, canvas.width - 40, 16);
    
    // --- Draw Artist ---
    ctx.font = `${document.getElementById("artistFontSize").value}px ${document.getElementById("artistFont").value}`;
    ctx.textAlign = "right";
    ctx.fillText(document.getElementById("artist").value, canvas.width - 10, canvas.height - 10);
    
    // --- Draw Clan Symbols in a grid at bottom ---
    const clanMargin = 10;
    const clanSize = 50;
    const maxPerRow = Math.floor((canvas.width - clanMargin * 2) / (clanSize + clanMargin));
    let clanRow = 0;
    let countInClanRow = 0;
    clanData.forEach(symbol => {
      const checkbox = document.getElementById(symbol.id);
      if (checkbox && checkbox.checked && symbol.image.complete) {
        const x = clanMargin + countInClanRow * (clanSize + clanMargin);
        const y = canvas.height - clanMargin - clanSize - (clanRow * (clanSize + clanMargin));
        ctx.drawImage(symbol.image, x, y, clanSize, clanSize);
        countInClanRow++;
        if (countInClanRow >= maxPerRow) {
          countInClanRow = 0;
          clanRow++;
        }
      }
    });
    
    // --- Draw Frame Overlay if selected ---
    const frameType = document.getElementById("frameType").value;
    if (frameType !== "none") {
      ctx.save();
      if (frameType === "simple") {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      } else if (frameType === "classic") {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "gold";
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      } else if (frameType === "modern") {
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#444";
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      }
      ctx.restore();
    }
  }
  
  // -------------------------------
  // Event Listeners for all inputs and toggles.
  // -------------------------------
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", updateCard);
    el.addEventListener("change", updateCard);
  });
  
  // -------------------------------
  // Art Panel: File upload & URL load
  // -------------------------------
  document.getElementById("artFile").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (event) {
        mainArtImage.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  
  document.getElementById("loadArtUrl").addEventListener("click", function () {
    const url = document.getElementById("artUrl").value;
    if (url) {
      mainArtImage.src = url;
    }
  });
  
  mainArtImage.onload = updateCard;
  
  // -------------------------------
  // Export: Download canvas as JPEG.
  // -------------------------------
  document.getElementById("exportButton").addEventListener("click", function () {
    const canvas = document.getElementById("cardCanvas");
    const dataURL = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.download = "custom_card.jpeg";
    link.href = dataURL;
    link.click();
  });
  
  // Initial render.
  updateCard();
});
