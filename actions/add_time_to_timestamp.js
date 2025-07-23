module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Add Time To Timestamp",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "[SDBM] Discord",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    let dataType = "New Timestamp";
    return [data.varName2, dataType];
  },

  subtitle(data, presets) {
    return `Added time ${data.addtime} to new timestamp!`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["addtime", "storage", "varName2"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
  <div style="padding-top: 8px; width: 100%;">
    <span class="dbminputlabel">Time to add</span>
    <input id="addtime" class="round" placeholder="example: 1s / 1m / 1h / 1d" type="text">  
  </div>
  <br>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
  
  <div style="text-align: center; padding-top: 24px;">
    <p>Mod by Społeczność DBM - <a href="https://dc.gg/sdbm" target="_blank">Support Discord</a></p>
    <p style="font-size: 10px; color: #777;">euforia.44 x mamajek</p>
  </div>
      `;
  },

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    let duration = this.evalMessage(data.addtime, cache);

    if (duration.includes("s")) {
      duration = parseInt(duration.replace("s", ""), 10) * 1000;
    } else if (duration.includes("m")) {
      duration = parseInt(duration.replace("m", ""), 10) * 60000;
    } else if (duration.includes("h")) {
      duration = parseInt(duration.replace("h", ""), 10) * 3600000;
    } else if (duration.includes("d")) {
      duration = parseInt(duration.replace("d", ""), 10) * 86400000;
    } else {
      duration = parseInt(duration, 10) * 1000;
    }
    
    // --- IMPROVEMENT: Simplified timestamp calculation ---
    const result = Math.floor((Date.now() + duration) / 1000);

    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    this.storeValue(result, storage, varName2, cache);
    this.callNextAction(cache);
  },

  mod() {},
};
