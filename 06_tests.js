




 // --------------
 // Image Testing
// --------------
 global.tests.testAllImages = function (wrapImgPath, testAllDisciplines) {

      // Helper function to test a single image
      function testImage(src, label) {
          const img = new Image();
          img.onload = () => {
          };
          img.onerror = () => {
              global.util.showOnloadError(`Image failed to load: ${label} (${src})`);
          };
          img.src = src;
      }

      // Test discipline images
      global.data.disciplineData.forEach(discipline => {
          let nt = testAllDisciplines ? 6 : 2;
          for (let i = 1; i <= nt; i++) {
              const imgSrc = wrapImgPath(discipline[`img_${i}_src`]);
              if (imgSrc) {
                  testImage(imgSrc, `${discipline.label} (image ${i})`);
              }
          }
      });

      // Test clan images
      global.data.clanData.forEach(clan => {
          if (clan.imgSrc) {
              testImage(wrapImgPath(clan.imgSrc), clan.label);
          }
      });

      // Test symbol map images
      Object.entries(global.data.symbolMap).forEach(([key, src]) => {
          if (src) {
              testImage(wrapImgPath(src), key);
          }
      });

      console.log("Image testing completed.");
  }



  global.tests.testAvailableFonts = function (fonts) {

      function testFont(font) {
        if (!document.fonts.check(`12px "${font.name}"`)) {
          global.util.showOnloadError(`Font not available or failed to load: ${font.displayName} (Family: ${font.name})`);
        }
      };

      if (!document.fonts || !document.fonts.check) {
        global.util.showOnloadError("Font checking API not available in this browser.");
        return;
      }

      fonts.forEach(font => testFont(font));
  };
