module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Set Bot Username",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "[SDBM] Bot Client Control",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.username}`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["username"],

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
<p>Changing usernames in Discord is heavily rate limited, with only 2 requests every hour. Use this sparingly!</p>

<div style="width: 90%;">
	<span class="dbminputlabel">Username</span><br>
	<input id="username" class="round" type="text">
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

  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const username = this.evalMessage(data.username, cache);
    botClient
      .setUsername(username)
      .then(() => this.callNextAction(cache))
      .catch((err) => this.displayError(data, cache, err));
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