module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Add Embed Field",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "[SDBM] Embed Message",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    // --- IMPROVEMENT: More descriptive subtitle ---
    return `Add Field: "${data.fieldName}"`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["storage", "varName", "fieldName", "message", "inline"],

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
<retrieve-from-variable dropdownLabel="Source Embed Object" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Field Name</span><br>
		<input id="fieldName" class="round" type="text">
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Display Inline</span><br>
		<select id="inline" class="round">
			<option value="0">Yes</option>
			<option value="1" selected>No</option>
		</select>
	</div>
</div>

<br><br><br><br>

<hr class="subtlebar">

<br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Field Description</span><br>
	<textarea id="message" class="dbm_monospace"  rows="8" placeholder="Insert message here..." style="white-space: nowrap; resize: none;"></textarea>
</div>

<div style="text-align: center; padding-top: 24px;">
  <p>Mod by Społeczność DBM - <a href="https://dc.gg/sdbm" target="_blank">Support Discord</a></p>
  <p style="font-size: 10px; color: #777;">euforia.44 x mamajek</p>
</div>
`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const embed = this.getVariable(storage, varName, cache);

    if (embed?.addFields) {
      const name = this.evalMessage(data.fieldName, cache);
      const message = this.evalMessage(data.message, cache);
      
      // --- IMPROVEMENT: Prevents errors from empty fields ---
      if(name && message) {
        const inline = data.inline === "0";
        embed.addFields({ name: name, value: message, inline: inline });
      }
    }

    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod() {},
};
