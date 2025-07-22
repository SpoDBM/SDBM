document
  .getElementById("fileInputSplash")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const fs = require("fs");
    const path = require("path");

    // Lokalizacja docelowa — zmień na własną
    const targetDir =
      "C:/Program Files (x86)/Steam/steamapps/common/Discord Bot Maker/resources/app/style/img";
    const targetPath = path.join(targetDir, "Splash.png");

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const buffer = await file.arrayBuffer();
      fs.writeFileSync(targetPath, Buffer.from(buffer));
      alert("The file has been saved as Splash.png!");
    } catch (err) {
      console.error("File saving error:", err);
      alert("There was an error saving the file.");
    }
  });

///

document
  .getElementById("fileInputDBM")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const fs = require("fs");
    const path = require("path");

    // Lokalizacja docelowa — zmień na własną
    const targetDir =
      "C:/Program Files (x86)/Steam/steamapps/common/Discord Bot Maker/resources/app/style/img";

    // Ścieżki docelowe dla obu plików
    const targetPathIco = path.join(targetDir, "icon.ico");
    const targetPathPng = path.join(targetDir, "icon.png");

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Odczyt pliku do bufferu
      const buffer = Buffer.from(await file.arrayBuffer());

      // Zapis obu plików
      fs.writeFileSync(targetPathIco, buffer);
      fs.writeFileSync(targetPathPng, buffer);

      alert("Files were saved as icon.ico and icon.png!");
    } catch (err) {
      console.error("File saving error:", err);
      alert("There was an error saving files.");
    }
  });

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
