document.getElementById("updatebtn").addEventListener("click", async () => {
  const spinner = document.getElementById("loadingSpinner");
  const button = document.getElementById("updatebtn");

  try {
    spinner.style.display = "inline-block";
    button.disabled = true;
    button.style.cursor = "not-allowed";

    const selectedValue = document.getElementById("updatePackageSelect").value;
    const fs = require("fs");
    const path = require("path");

    const actLoc = this.DBM.actLocs.toString();
    const evtLoc = this.DBM.evtLocs.toString();
    const baseDir = path.dirname(actLoc);
    const extensionsDir = path.join(baseDir, "extensions");
    const dbmResourcesPath = path.join(
      "C:",
      "Program Files (x86)",
      "Steam",
      "steamapps",
      "common",
      "Discord Bot Maker",
      "resources",
      "app"
    );

    const endpoints = {
      actions:
        "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/bot-files/actions",
      events:
        "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/bot-files/events",
      extensions:
        "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/bot-files/extensions",
      botJS:
        "https://raw.githubusercontent.com/DBM-POLSKA/DBM-14/main/bot-files/bot.js",
    };

    const downloadAndWriteFiles = async (url, targetPath) => {
      const res = await fetch(url);
      const files = await res.json();

      if (!Array.isArray(files)) {
        throw new Error("Incorrect response from GitHub.");
      }

      for (const file of files) {
        if (file.type === "file" && file.download_url) {
          const content = await fetch(file.download_url).then((res) =>
            res.text()
          );
          const finalPath = path.join(targetPath, file.name);
          saveFileLocally(finalPath, content);
        }
      }
    };

    const downloadSingleFile = async (url, fileName, targetDir) => {
      const content = await fetch(url).then((res) => res.text());
      const finalPath = path.join(targetDir, fileName);
      saveFileLocally(finalPath, content);
    };

    switch (selectedValue) {
      case "0":
        await downloadAndWriteFiles(endpoints.actions, actLoc);
        alert("Actions have been updated!");
        break;

      case "1":
        await downloadAndWriteFiles(endpoints.events, evtLoc);
        alert("Events have been updated!");
        break;

      case "2":
        await downloadSingleFile(
          `${endpoints.extensions}/bot_intents.js`,
          "bot_intents.js",
          extensionsDir
        );
        alert("Intents have been updated!");
        break;

      case "3":
        await downloadSingleFile(
          `${endpoints.extensions}/bot_partials.js`,
          "bot_partials.js",
          extensionsDir
        );
        alert("Partials have been updated!");
        break;

      case "4":
        await downloadAndWriteFiles(endpoints.extensions, extensionsDir);
        alert("All extensions have been updated!");
        break;

      case "5":
        await downloadSingleFile(endpoints.botJS, "bot.js", baseDir);
        alert("bot.js have been updated!");
        break;

      case "6":
        {
          await downloadAndWriteFiles(
            "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/dbm-files/resources/app/html",
            path.join(dbmResourcesPath, "html")
          );

          await downloadAndWriteFiles(
            "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/dbm-files/resources/app/html/dbm_enhanced/css",
            path.join(dbmResourcesPath, "html", "dbm_enhanced", "css")
          );

          await downloadAndWriteFiles(
            "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/dbm-files/resources/app/html/dbm_enhanced/img",
            path.join(dbmResourcesPath, "html", "dbm_enhanced", "img")
          );

          await downloadAndWriteFiles(
            "https://api.github.com/repos/DBM-POLSKA/DBM-14/contents/dbm-files/resources/app/html/dbm_enhanced/js",
            path.join(dbmResourcesPath, "html", "dbm_enhanced", "js")
          );

          alert("DBM Enhanced interface has been updated!");
        }
        break;

      default:
        alert("Unsupported option.");
        break;
    }
  } catch (err) {
    console.error("Update error:", err);
    alert("An error occurred while updating.");
  } finally {
    spinner.style.display = "none";
    button.disabled = false;
    button.style.cursor = "pointer";
  }
});

function saveFileLocally(filePath, content) {
  const fs = require("fs");
  const path = require("path");

  const fullPath = path.resolve(filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, "utf8");
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
