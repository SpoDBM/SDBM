module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Set Channel Permissions",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "[SDBM] Channel Control",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getChannelText(data.storage, data.varName)}`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["storage", "varName", "permission", "state", "reason"],

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
<channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: calc(50% - 12px);">
    <span class="dbminputlabel">Permission</span><br>
    <select id="permission" class="round">
      <optgroup label="Text Channel Permissions">
        <option value="ViewChannel">View Channel</option>
        <option value="SendMessages">Send Messages</option>
        <option value="SendTTSMessages">Send TTS Messages</option>
        <option value="ManageMessages">Manage Messages</option>
        <option value="EmbedLinks">Embed Links</option>
        <option value="AttachFiles">Attach Files</option>
        <option value="ReadMessageHistory">Read Message History</option>
        <option value="MentionEveryone">Mention Everyone</option>
        <option value="UseExternalEmojis">Use External Emojis</option>
        <option value="ManageThreads">Manage Threads</option>
        <option value="CreatePublicThreads">Create Public Threads</option>
        <option value="CreatePrivateThreads">Create Private Threads</option>
        <option value="UseExternalStickers">Use External Stickers</option>
        <option value="SendMessagesInThreads">Send Messages in Threads</option>
      </optgroup>
      <optgroup label="Voice Channel Permissions">
        <option value="Connect">Connect</option>
        <option value="Speak">Speak</option>
        <option value="Stream">Stream</option>
        <option value="UseVAD">Use Voice Activity</option>
        <option value="MuteMembers">Mute Members</option>
        <option value="DeafenMembers">Deafen Members</option>
        <option value="MoveMembers">Move Members</option>
        <option value="PrioritySpeaker">Priority Speaker</option>
      </optgroup>
    </select>
  
  </div>
  <div style="float: right; width: calc(50% - 12px);">
    <span class="dbminputlabel">Change To</span><br>
    <select id="state" class="round">
      <option value="0" selected>Allow</option>
      <option value="1">Disallow</option>
      <option value="2">Inherit</option>
    </select>
  </div>
</div>

<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>

<div style="text-align:center; margin-top:2px; font-size:10px;">
  Mod by Społeczność DBM - <a href="https://dc.gg/sdbm" target="_blank" style="color: #0077ff; text-decoration: none">Support Discord</a><br>
  <span style="font-size:8px; opacity:0.4;">euforia.44 x mamajek</span>
</div>`;
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

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    if (!server) {
      this.callNextAction(cache);
      return;
    }
    const channel = await this.getChannelFromData(
      data.storage,
      data.varName,
      cache
    );
    const reason = this.evalMessage(data.reason, cache);
    const options = {
      [data.permission]: [true, false, null][parseInt(data.state, 10)],
    };

    if (Array.isArray(channel)) {
      this.callListFunc(channel.permissionOverwrites, "edit", [
        server.id,
        options,
        { reason, type: 0 },
      ]).then(() => this.callNextAction(cache));
    } else if (channel?.permissionOverwrites) {
      channel.permissionOverwrites
        .edit(server.id, options, { reason, type: 0 })
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
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
