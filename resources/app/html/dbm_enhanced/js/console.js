const { exec } = require("child_process");
const { dialog } = require("@electron/remote");

const input = document.getElementById("consoleInput");
const output = document.getElementById("consoleOutput");
const enterBtn = document.getElementById("consoleEnterBtn");
const selectFolderBtn = document.getElementById("selectFolderBtn");
const selectedFolderPathSpan = document.getElementById("selectedFolderPath");

let currentProjectPath = ""; // zaczynamy pusto

function printToConsole(text) {
  output.textContent += text + "\n";
  const container = document.getElementById("consoleContainer");
  container.scrollTop = container.scrollHeight;
}

// Start
printToConsole("---------------------");
printToConsole("🔄 Console launched.");
printToConsole("---------------------");

selectFolderBtn.addEventListener("click", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select the bot folder",
  });

  if (!result.canceled && result.filePaths.length > 0) {
    currentProjectPath = result.filePaths[0];
    selectedFolderPathSpan.textContent = currentProjectPath;
    printToConsole(`📁 Working directory selected: ${currentProjectPath}`);
  }
});

function runCommand() {
  if (!currentProjectPath) {
    printToConsole("⚠️ No working folder selected! Please select bot folder.");
    return;
  }

  const cmd = input.value.trim();
  if (!cmd) {
    printToConsole("⚠️ Command not entered.");
    return;
  }

  printToConsole(`> ${cmd}`);
  input.value = "";

  exec(
    cmd,
    { cwd: currentProjectPath, shell: true },
    (error, stdout, stderr) => {
      if (error) printToConsole(`❌ Error: ${error.message}`);
      if (stderr) printToConsole(`⚠️ stderr: ${stderr}`);
      if (stdout) printToConsole(stdout);
      if (!error && !stdout && !stderr)
        printToConsole("Command executed, no exit.");
    }
  );
}

enterBtn.addEventListener("click", runCommand);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runCommand();
  }
});

const clearConsoleBtn = document.getElementById("clearConsoleBtn");

clearConsoleBtn.addEventListener("click", () => {
  output.textContent = ""; // czyścimy zawartość konsoli
  printToConsole("🧹 Console cleaned.");
});
