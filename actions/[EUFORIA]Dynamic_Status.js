module.exports = {
  name: "Dynamic Status",
  displayName: "Dynamic Status v3",
  section: "##Euforia Mods",
  author: "euforia.44 (v3.2.1 by Assistant)",
  version: "3.2.1",
  short_description: "Ustawia dynamiczny status bota na podstawie zdefiniowanej listy.",

  fields: ["statusList", "interval"],
  
  html(isEvent, data) {
    return `
      <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
        <p>Użyj tej akcji w evencie <u>On Bot Initialization</u>, aby status ustawił się po starcie bota. <b style="color: #FF5555;">Pamiętaj, aby dodać akcje "Wait" między ciężkimi zadaniami startowymi!</b></p>
        
        <div style="padding: 10px;">
          <h2 style="margin-top: 0;">Konfiguracja Statusów</h2>
          <label for="statusList" style="font-weight: 500;">Lista Statusów</label>
          <p style="font-size: 12px; margin: 2px 0 8px 0; color: #888;">
            Jeśli wpiszesz jedną linię, status będzie stały. Przy wielu liniach, statusy będą się rotować.
          </p>
          <textarea id="statusList" class="round" style="width: 100%; resize: vertical;" rows="8">Euforia Agency;Playing;online
Zobacz Nasze Portfolio!;Watching;dnd
ZEYU - SMAŻ;Streaming;idle;https://www.youtube.com/watch?v=sV-ZvT-JBQs</textarea>
          
          <div style="margin-top: 10px;">
            <h3 style="margin-top: 15px; margin-bottom: 5px;">Format Wpisów</h3>
            <p style="font-size: 13px; margin: 0;">Każdy wpis umieść w nowej linii, używając średników jako separatorów.</p>
            <ul>
              <li><b>Standard:</b> <code>Tekst;Typ;Widoczność</code></li>
              <li><b>Streaming:</b> <code>Tekst;Streaming;Widoczność;URL</code></li>
            </ul>
            <p style="font-size: 12px; margin-top: 10px; color: #888;">
              <b>Dostępne Typy:</b> <code>Playing</code>, <code>Listening</code>, <code>Watching</code>, <code>Competing</code>, <code>Streaming</code>.<br>
              <b>Dostępne Widoczności:</b> <code>online</code>, <code>idle</code> (zaraz wracam), <code>dnd</code> (nie przeszkadzać).
            </p>
          </div>

          <div style="width: 60%; margin-top: 15px;">
            <label for="interval" style="font-weight: 500;">Interwał Zmiany (w sekundach, min. 12)</label>
            <p style="font-size: 12px; margin: 2px 0 8px 0; color: #888;">Używany, gdy jest więcej niż jeden status. Wartość poniżej 12s zostanie zignorowana.</p>
            <input id="interval" class="round" type="number" value="15" min="12">
          </div>

          <div style="margin-top: 20px;">
            <h3 style="margin-bottom: 5px;">Dostępne Zmienne</h3>
            <p style="font-size: 12px; margin: 0;">
              <code>{servers}</code>, <code>{users}</code>, <code>{channels}</code>, <code>{emojis}</code>, <code>{ping}</code>, <code>{bot_tag}</code>, <code>{random_user}</code>
            </p>
          </div>
        </div>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        </style>
      </div>
    `;
  },

  action(cache) {
    const DBM = this.getDBM();
    const bot = DBM.Bot.bot;
    const { ActivityType } = require('discord.js');

    if (!bot || !bot.user) {
      console.error("[Dynamic Status] Bot nie jest gotowy.");
      return this.callNextAction(cache);
    }
    
    if (DBM.Mods?.EuforiaDynamicStatusV3Initialized) {
      return this.callNextAction(cache);
    }

    const listRaw = this.evalMessage(cache.actions[cache.index].statusList, cache);
    const intervalInput = parseInt(this.evalMessage(cache.actions[cache.index].interval, cache) || "15", 10);
    const interval = Math.max(intervalInput, 12) * 1000;
    
    if (intervalInput < 12) {
      console.warn(`[Dynamic Status] Ustawiony interwał (${intervalInput}s) jest zbyt krótki. Użyto bezpiecznej wartości 12s, aby uniknąć problemów z API Discorda.`);
    }

    if (!listRaw || typeof listRaw !== 'string' || listRaw.trim() === '') {
      console.error("[Dynamic Status] Lista statusów jest pusta.");
      return this.callNextAction(cache);
    }

    const parsePlaceholders = (text) => {
      if (typeof text !== 'string') return '';
      return text.replace(/{servers}/g, bot.guilds.cache.size).replace(/{users}/g, bot.users.cache.size).replace(/{ping}/g, Math.round(bot.ws.ping)).replace(/{channels}/g, bot.channels.cache.size).replace(/{emojis}/g, bot.emojis.cache.size).replace(/{bot_tag}/g, bot.user.tag).replace(/{random_user}/g, bot.users.cache.random()?.username ?? 'ktoś');
    };
    
    const validPresences = ['online', 'idle', 'dnd'];
    
    const lines = listRaw.split(/\r?\n/);
    
    const statuses = lines.filter(Boolean).map((line, index) => {
      const parts = line.split(';').map(p => p.trim());
      const [text, type, presence, streamUrl] = parts;

      if (!text || !type || !presence) {
        console.warn(`[Dynamic Status] Linia ${index + 1} jest niekompletna. Pomijanie. ("${line}")`);
        return null;
      }
      
      const correctedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      const activityTypeEnum = ActivityType[correctedType];

      if (activityTypeEnum === undefined) {
        console.warn(`[Dynamic Status] Nieznany typ aktywności w linii ${index + 1}: '${type}'. Pomijanie.`);
        return null;
      }
      
      if (!validPresences.includes(presence.toLowerCase())) {
        console.warn(`[Dynamic Status] Nieprawidłowa widoczność w linii ${index + 1}: '${presence}'. Pomijanie.`);
        return null;
      }

      const activityObject = { name: text, type: activityTypeEnum };
      if (activityTypeEnum === ActivityType.Streaming) {
        if (streamUrl && streamUrl.startsWith('http')) {
          activityObject.url = streamUrl;
        } else {
          console.warn(`[Dynamic Status] Typ 'Streaming' w linii ${index + 1} nie ma poprawnego URL.`);
        }
      }
      
      return { presence: presence.toLowerCase(), activity: activityObject };
    }).filter(Boolean);

    if (statuses.length === 0) {
      console.error("[Dynamic Status] Nie znaleziono żadnych prawidłowych wpisów na liście. Sprawdź format.");
      return this.callNextAction(cache);
    }

    const setStatus = (statusData) => {
      try {
        const activity = { ...statusData.activity };
        activity.name = parsePlaceholders(activity.name);
        
        bot.user.setStatus(statusData.presence);
        bot.user.setActivity(activity);
        
        // POPRAWKA LOGOWANIA
        const activityTypeName = Object.keys(ActivityType).find(key => ActivityType[key] === activity.type);
        console.log(`[Dynamic Status] Ustawiono: Widoczność='${statusData.presence}', Aktywność='${activityTypeName} ${activity.name}'`);
      } catch(e) {
        // Zabezpieczenie przed błędem 503
        if (e.status === 503) {
            console.warn("[Dynamic Status] Nie udało się ustawić statusu z powodu błędu 503 (API Discorda jest tymczasowo niedostępne).");
        } else {
            console.error("[Dynamic Status] Wystąpił błąd podczas ustawiania statusu:", e);
        }
      }
    };

    if (statuses.length === 1) {
      setStatus(statuses[0]);
      console.log(`[Dynamic Status] Uruchomiono w trybie pojedynczym.`);
    } else {
      let currentIndex = 0;
      const updateStatus = () => {
        const statusData = statuses[currentIndex++ % statuses.length];
        setStatus(statusData);
      };
      
      updateStatus();
      setInterval(updateStatus, interval);
      console.log(`[Dynamic Status] Uruchomiono w trybie rotacyjnym z ${statuses.length} wpisami. Zmiana co ${interval / 1000}s.`);
    }

    if (!DBM.Mods) DBM.Mods = {};
    DBM.Mods.EuforiaDynamicStatusV3Initialized = true;

    this.callNextAction(cache);
  },
  
  mod() {},
};module.exports = {
  name: "Dynamic Status",
  displayName: "Dynamic Status v3",
  section: "##Euforia Mods",
  author: "euforia.44 (v3.2.2 by Assistant)",
  version: "3.2.2",
  short_description: "Ustawia dynamiczny status bota na podstawie zdefiniowanej listy.",

  fields: ["statusList", "interval"],
  
  html(isEvent, data) {
    return `
      <div style="padding: 10px; font-family: 'Poppins', sans-serif;">
        <p>Użyj tej akcji w evencie <u>On Bot Initialization</u>, aby status ustawił się po starcie bota. <b style="color: #FF5555;">Pamiętaj, aby dodać akcje "Wait" między ciężkimi zadaniami startowymi!</b></p>
        
        <div style="padding: 10px;">
          <h2 style="margin-top: 0;">Konfiguracja Statusów</h2>
          <label for="statusList" style="font-weight: 500;">Lista Statusów</label>
          <p style="font-size: 12px; margin: 2px 0 8px 0; color: #888;">
            Jeśli wpiszesz jedną linię, status będzie stały. Przy wielu liniach, statusy będą się rotować.
          </p>
          <textarea id="statusList" class="round" style="width: 100%; resize: vertical;" rows="8">Euforia Agency;Playing;online
Zobacz Nasze Portfolio!;Watching;dnd
ZEYU - SMAŻ;Streaming;idle;https://www.youtube.com/watch?v=sV-ZvT-JBQs</textarea>
          
          <div style="margin-top: 10px;">
            <h3 style="margin-top: 15px; margin-bottom: 5px;">Format Wpisów</h3>
            <p style="font-size: 13px; margin: 0;">Każdy wpis umieść w nowej linii, używając średników jako separatorów.</p>
            <ul>
              <li><b>Standard:</b> <code>Tekst;Typ;Widoczność</code></li>
              <li><b>Streaming:</b> <code>Tekst;Streaming;Widoczność;URL</code></li>
            </ul>
            <p style="font-size: 12px; margin-top: 10px; color: #888;">
              <b>Dostępne Typy:</b> <code>Playing</code>, <code>Listening</code>, <code>Watching</code>, <code>Competing</code>, <code>Streaming</code>.<br>
              <b>Dostępne Widoczności:</b> <code>online</code>, <code>idle</code> (zaraz wracam), <code>dnd</code> (nie przeszkadzać).
            </p>
          </div>

          <div style="width: 60%; margin-top: 15px;">
            <label for="interval" style="font-weight: 500;">Interwał Zmiany (w sekundach, min. 12)</label>
            <p style="font-size: 12px; margin: 2px 0 8px 0; color: #888;">Używany, gdy jest więcej niż jeden status. Wartość poniżej 12s zostanie zignorowana.</p>
            <input id="interval" class="round" type="number" value="15" min="12">
          </div>

          <div style="margin-top: 20px;">
            <h3 style="margin-bottom: 5px;">Dostępne Zmienne</h3>
            <p style="font-size: 12px; margin: 0;">
              <code>{servers}</code>, <code>{users}</code>, <code>{channels}</code>, <code>{emojis}</code>, <code>{ping}</code>, <code>{bot_tag}</code>, <code>{random_user}</code>
            </p>
          </div>
        </div>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        </style>
      </div>
    `;
  },

  action(cache) {
    const DBM = this.getDBM();
    const bot = DBM.Bot.bot;
    const { ActivityType } = require('discord.js');

    if (!bot || !bot.user) {
      console.error("[Dynamic Status] Bot nie jest gotowy.");
      return this.callNextAction(cache);
    }
    
    if (DBM.Mods?.EuforiaDynamicStatusV3Initialized) {
      return this.callNextAction(cache);
    }

    const listRaw = this.evalMessage(cache.actions[cache.index].statusList, cache);
    const intervalInput = parseInt(this.evalMessage(cache.actions[cache.index].interval, cache) || "15", 10);
    const interval = Math.max(intervalInput, 12) * 1000;
    
    if (intervalInput < 12) {
      console.warn(`[Dynamic Status] Ustawiony interwał (${intervalInput}s) jest zbyt krótki. Użyto bezpiecznej wartości 12s, aby uniknąć problemów z API Discorda.`);
    }

    if (!listRaw || typeof listRaw !== 'string' || listRaw.trim() === '') {
      console.error("[Dynamic Status] Lista statusów jest pusta.");
      return this.callNextAction(cache);
    }

    const parsePlaceholders = (text) => {
      if (typeof text !== 'string') return '';
      return text.replace(/{servers}/g, bot.guilds.cache.size).replace(/{users}/g, bot.users.cache.size).replace(/{ping}/g, Math.round(bot.ws.ping)).replace(/{channels}/g, bot.channels.cache.size).replace(/{emojis}/g, bot.emojis.cache.size).replace(/{bot_tag}/g, bot.user.tag).replace(/{random_user}/g, bot.users.cache.random()?.username ?? 'ktoś');
    };
    
    const validPresences = ['online', 'idle', 'dnd'];
    
    const lines = listRaw.split(/\r?\n/);
    
    const statuses = lines.filter(Boolean).map((line, index) => {
      const parts = line.split(';').map(p => p.trim());
      const [text, type, presence, streamUrl] = parts;

      if (!text || !type || !presence) {
        console.warn(`[Dynamic Status] Linia ${index + 1} jest niekompletna. Pomijanie. ("${line}")`);
        return null;
      }
      
      const correctedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      const activityTypeEnum = ActivityType[correctedType];

      if (activityTypeEnum === undefined) {
        console.warn(`[Dynamic Status] Nieznany typ aktywności w linii ${index + 1}: '${type}'. Pomijanie.`);
        return null;
      }
      
      if (!validPresences.includes(presence.toLowerCase())) {
        console.warn(`[Dynamic Status] Nieprawidłowa widoczność w linii ${index + 1}: '${presence}'. Pomijanie.`);
        return null;
      }

      const activityObject = { name: text, type: activityTypeEnum };
      if (activityTypeEnum === ActivityType.Streaming) {
        if (streamUrl && streamUrl.startsWith('http')) {
          activityObject.url = streamUrl;
        } else {
          console.warn(`[Dynamic Status] Typ 'Streaming' w linii ${index + 1} nie ma poprawnego URL.`);
        }
      }
      
      return { presence: presence.toLowerCase(), activity: activityObject };
    }).filter(Boolean);

    if (statuses.length === 0) {
      console.error("[Dynamic Status] Nie znaleziono żadnych prawidłowych wpisów na liście. Sprawdź format.");
      return this.callNextAction(cache);
    }

    const setStatus = (statusData) => {
      try {
        const activity = { ...statusData.activity };
        activity.name = parsePlaceholders(activity.name);
        
        bot.user.setStatus(statusData.presence);
        bot.user.setActivity(activity);
        
        // Ta linia została usunięta, aby konsola była czysta
        // console.log(`[Dynamic Status] Ustawiono...`);

      } catch(e) {
        if (e.status === 503) {
            console.warn("[Dynamic Status] Nie udało się ustawić statusu z powodu błędu 503 (API Discorda jest tymczasowo niedostępne).");
        } else {
            console.error("[Dynamic Status] Wystąpił błąd podczas ustawiania statusu:", e);
        }
      }
    };

    if (statuses.length === 1) {
      setStatus(statuses[0]);
      console.log(`[Dynamic Status] Uruchomiono w trybie pojedynczym.`);
    } else {
      let currentIndex = 0;
      const updateStatus = () => {
        const statusData = statuses[currentIndex++ % statuses.length];
        setStatus(statusData);
      };
      
      updateStatus();
      setInterval(updateStatus, interval);
      console.log(`[Dynamic Status] Uruchomiono w trybie rotacyjnym z ${statuses.length} wpisami. Zmiana co ${interval / 1000}s.`);
    }

    if (!DBM.Mods) DBM.Mods = {};
    DBM.Mods.EuforiaDynamicStatusV3Initialized = true;

    this.callNextAction(cache);
  },
  
  mod() {},
};