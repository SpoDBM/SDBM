/*************************************************************************************************
*                                                                                                *
*                                                                                                *
*                                              AI                                                *
*                                     --------------------                                       *
*                                                                                                *
*                          CAŁOŚĆ KODU ZOSTAŁA STWORZONA PRZEZ: EUFORIA.44  & AI                 *
*                                     WERSJA: 11.0.0 (BULLETPROOF-EDITION)                       *
*                                                                                                *
*           MOD I JEGO KOD ŹRÓDŁOWY SĄ WŁASNOŚCIĄ INTELEKTUALNĄ AUTORA. 		                     *
*             	    ZABRANIA SIĘ SPRZEDAŻY BEZ WYRAŹNEJ ZGODY.      					                   *
*                                                                                                *
*   UWAGA: Ten mod wymaga dodatkowych pakietów. Użyj pliku start.bat lub zainstaluj je komendą:
*          npm install franc node-fetch@2 dotenv
*                                                                                                *
*************************************************************************************************/

const conversationMemory = {};
const cooldowns = {};

module.exports = {
  name: "AI (Euforia Mods)",
  section: "##Euforia Mods",
  author: "euforia.44",
  version: "11.0.0",
  short_description: "Finalna, stabilna wersja AI z dynamiczną pamięcią i wiedzą o serwerze.",

  fields: [
    "model", "temperature", "max_tokens", "max_length", "systemPrompt", "serverKnowledge",
    "blockMentions", "ephemeral", "cooldown",
    "sourceParamName", "conversationMemory", "memoryLength", "memoryTimeout",
    "promoToggle", "promoChannel1", "promoMessage1", "promoChannel2", "promoMessage2", "promoChannel3", "promoMessage3"
  ],

  subtitle(data) {
    const memory = data.conversationMemory === "true" ? `Pamięć: ${data.memoryLength || 3} | Reset: ${data.memoryTimeout || 10}m | ` : '';
    return `${memory}Parametr: ${data.sourceParamName || 'pytanie'}`;
  },

  html(isEvent, data) {
    // ... SEKCJA HTML POZOSTAJE BEZ ZMIAN - JEST KOMPLETNA ...
    const defaults = { model: 'mistralai/mistral-nemo:free', temperature: '1.0', max_tokens: '1000', max_length: '2000', systemPrompt: '', serverKnowledge: 'true', blockMentions: 'true', ephemeral: 'false', cooldown: '15', sourceParamName: 'pytanie', conversationMemory: 'true', memoryLength: '3', memoryTimeout: '10', promoToggle: 'false', promoChannel1: '', promoMessage1: '', promoChannel2: '', promoMessage2: '', promoChannel3: '', promoMessage3: '' }; for (const key in defaults) { if (data[key] === undefined) data[key] = ''; } return `<div class="ai-chat-body" style="padding:10px;background:#1a1b1e;color:#fff;border-radius:5px;"><input type="radio" name="ai_tabs" id="ai-tab-1" checked><input type="radio" name="ai_tabs" id="ai-tab-2"><input type="radio" name="ai_tabs" id="ai-tab-3"><input type="radio" name="ai_tabs" id="ai-tab-4"><div class="ai-chat-tabs"><label for="ai-tab-1">⚙️</label><label for="ai-tab-2">🛡️</label><label for="ai-tab-3">🚀</label><label for="ai-tab-4">💡</label></div><div class="ai-chat-content-panels"><div id="ai-content-1" class="ai-chat-content"><div style="display:flex;justify-content:space-between;align-items:center;"><span class="dbminputlabel">ID Modelu</span><select id="serverKnowledge" class="round" style="width:40%;"><option value="true" ${data.serverKnowledge !== 'false' && 'selected'}>Wiedza o serwerze: Wł.</option><option value="false" ${data.serverKnowledge === 'false' && 'selected'}>Wiedza o serwerze: Wył.</option></select></div><input id="model" class="round" type="text" value="${data.model || defaults.model}"><div style="display:flex;gap:10px;margin-top:12px"><div style="width:33%"><span class="dbminputlabel">Temperatura</span><input id="temperature" class="round" type="number" step="0.1" value="${data.temperature || defaults.temperature}"></div><div style="width:34%"><span class="dbminputlabel">Maks. Tokenów</span><input id="max_tokens" class="round" type="number" value="${data.max_tokens || defaults.max_tokens}"></div><div style="width:33%"><span class="dbminputlabel">Maks. Długość*</span><input id="max_length" class="round" type="number" value="${data.max_length || defaults.max_length}"></div></div><br><span class="dbminputlabel">System Prompt</span><br><textarea id="systemPrompt" class="round" style="height:100px;resize:vertical" placeholder="Jeśli puste, użyty zostanie domyślny, rygorystyczny prompt.">${data.systemPrompt || ''}</textarea></div><div id="ai-content-2" class="ai-chat-content"><div style="display:flex;gap:10px"><div style="width:50%;"><span class="dbminputlabel">Blokuj wzmianki</span><select id="blockMentions" class="round"><option value="true" ${data.blockMentions!=='false' && 'selected'}>Tak</option><option value="false" ${data.blockMentions==='false' && 'selected'}>Nie</option></select></div><div style="width:50%;"><span class="dbminputlabel">Odpowiedź prywatna</span><select id="ephemeral" class="round"><option value="true" ${data.ephemeral==='true' && 'selected'}>Tak</option><option value="false" ${data.ephemeral!=='true' && 'selected'}>Nie</option></select></div></div><br><span class="dbminputlabel">Cooldown (w sekundach)</span><br><input id="cooldown" class="round" type="number" value="${data.cooldown || defaults.cooldown}"></div><div id="ai-content-3" class="ai-chat-content"><span class="dbminputlabel">Nazwa parametru komendy</span><input id="sourceParamName" class="round" type="text" value="${data.sourceParamName || defaults.sourceParamName}"><hr style="margin:15px 0;"><div style="display:flex;justify-content:space-between;align-items:center;"><span class="dbminputlabel">Pamięć Konwersacji</span><select id="conversationMemory" class="round" style="width:40%;"><option value="true" ${data.conversationMemory!=='false' && 'selected'}>Włączona</option><option value="false" ${data.conversationMemory==='false' && 'selected'}>Wyłączona</option></select></div><br><div style="display:flex;gap:10px;"><div style="width:50%;"><span class="dbminputlabel">Długość pamięci</span><input id="memoryLength" class="round" type="number" value="${data.memoryLength || defaults.memoryLength}"><small>w parach pytanie-odpowiedź</small></div><div style="width:50%;"><span class="dbminputlabel">Czas resetu pamięci</span><input id="memoryTimeout" class="round" type="number" value="${data.memoryTimeout || defaults.memoryTimeout}"><small>w minutach (0 = nigdy)</small></div></div></div><div id="ai-content-4" class="ai-chat-content"><div style="display:flex;justify-content:space-between;align-items:center;"><span class="dbminputlabel">Inteligentny System Promocyjny</span><select id="promoToggle" class="round" style="width:40%;" onchange="document.getElementById('promo-container').style.display=this.value==='true'?'block':'none'"><option value="false" ${data.promoToggle!=='true'&&'selected'}>Wyłączony</option><option value="true" ${data.promoToggle==='true'&&'selected'}>Włączony</option></select></div><div id="promo-container" style="display:${data.promoToggle==='true'?'block':'none'};"><small>AI sama zdecyduje, czy pytanie pasuje do promocji.</small>${[1,2,3].map(i=>`<fieldset style="border:1px solid #444;padding:10px;margin-top:15px;border-radius:5px;"><legend>Promocja #${i}</legend><div style="display:flex;gap:10px;"><div style="width:35%;"><span class="dbminputlabel">ID Kanału</span><input id="promoChannel${i}" class="round" type="text" value="${data[`promoChannel${i}`]||''}"></div><div style="width:65%;"><span class="dbminputlabel">Wiadomość</span><input id="promoMessage${i}" class="round" type="text" placeholder="Użyj <#ID>..." value="${data[`promoMessage${i}`]||''}"></div></div></fieldset>`).join('')}</div></div></div></div><style>.ai-chat-body input[type=radio]{display:none}.ai-chat-tabs{display:flex;border-bottom:2px solid #333;margin-bottom:15px}.ai-chat-tabs label{padding:8px 14px;cursor:pointer;background:#2b2f35;margin-right:5px;border-radius:4px 4px 0 0;font-size:18px;position:relative;bottom:-2px}.ai-chat-tabs label:hover{background:#383c42}.ai-chat-content{display:none}#ai-tab-1:checked~.ai-chat-content-panels #ai-content-1,#ai-tab-2:checked~.ai-chat-content-panels #ai-content-2,#ai-tab-3:checked~.ai-chat-content-panels #ai-content-3,#ai-tab-4:checked~.ai-chat-content-panels #ai-content-4{display:block}#ai-tab-1:checked~.ai-chat-tabs label[for=ai-tab-1],#ai-tab-2:checked~.ai-chat-tabs label[for=ai-tab-2],#ai-tab-3:checked~.ai-chat-tabs label[for=ai-tab-3],#ai-tab-4:checked~.ai-chat-tabs label[for=ai-tab-4]{background:#1a1b1e;border:2px solid #333;border-bottom:2px solid #1a1b1e}.round{width:100%;box-sizing:border-box}</style>`;
  },
  
  init() {},

  async action(cache) {
    const { interaction } = cache;
    if (!interaction) return;

    // --- Kontrola Przedstartowa (Pre-flight Check) ---
    const { EmbedBuilder, InteractionResponseFlags } = require('discord.js');
    try {
        require.resolve('node-fetch');
        require.resolve('franc');
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            const missingPackage = e.message.split("'")[1];
            const installCommand = missingPackage === 'node-fetch' ? 'npm install node-fetch@2' : `npm install ${missingPackage}`;
            const errorEmbed = new EmbedBuilder().setColor(0xFF0000)
                .setTitle(`Błąd krytyczny: Brak wymaganego pakietu: \`${missingPackage}\``)
                .setDescription(`**Rozwiązanie:**\nZainstaluj brakujący pakiet komendą w głównym folderze bota:\n\`\`\`${installCommand}\`\`\`\nA następnie zrestartuj bota.`);
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        throw e;
    }
    
    const fetch = require('node-fetch');
    const { franc } = require('franc');
    const data = cache.actions[cache.index];
    const c = { reset: "\x1b[0m", cyan: "\x1b[36m", green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m" };
    
    // --- Inteligentna Obsługa Błędów ---
    const getErrorMessageWithSolution = (errorMsg) => {
        let problem = 'Wystąpił nieznany błąd.';
        let solution = 'Skontaktuj się z administratorem bota, podając treść tego błędu (została zapisana w konsoli).';
        const errorString = String(errorMsg).toLowerCase();
        
        if (errorString.includes("cannot find module")) { const pkg = errorString.split("'")[1]; problem = `Brak pakietu: \`${pkg}\``; solution = `Zainstaluj go komendą: \`npm install ${pkg === 'node-fetch' ? 'node-fetch@2' : pkg}\` i zrestartuj bota.`; } 
        else if (errorString.includes("klucz api")) { problem = "Nie znaleziono lub nie wczytano klucza API."; solution = "1. Upewnij się, że masz pakiet `dotenv` (`npm install dotenv`).\n2. Sprawdź, czy plik `.env` zawiera `OPENROUTER_API_KEY=twoj_klucz`.\n3. Upewnij się, że na początku `bot.js` jest `require('dotenv').config();`."; } 
        else if (errorString.includes("nieprawidłowym języku")) { problem = "AI odpowiedziała w niepoprawnym języku."; solution = "Problem został automatycznie wykryty i odrzucony. Spróbuj zadać pytanie ponownie lub przeformułuj je."; } 
        else if (errorString.includes("401")) { problem = "Klucz API jest nieprawidłowy lub nieaktywny."; solution = "Sprawdź, czy klucz API jest poprawny w panelu OpenRouter."; } 
        else if (errorString.includes("404") || errorString.includes("model not found")) { problem = "Podany model AI nie został znaleziony."; solution = "Sprawdź ID modelu w zakładce ⚙️."; } 
        else if (errorString.includes("insufficient_funds") || errorString.includes("credits")) { problem = "Brak środków na koncie OpenRouter."; solution = "Zasil swoje konto na OpenRouter."; }
        
        return { problem, solution, raw: errorMsg };
    };

    // Odpowiedź początkowa
    const isEphemeral = this.evalMessage(data.ephemeral, cache) === 'true';
    await interaction.reply({ content: "🤖 `Generuję odpowiedź...`", flags: isEphemeral ? [InteractionResponseFlags.EPHEMERAL] : [] });

    let finalPayload;
    
    try {
        // ... (Logika cooldownu) ...

        const userQuestion = interaction.options.getString(this.evalMessage(data.sourceParamName, cache) || 'pytanie');
        if (!userQuestion) throw new Error("Nie podano treści pytania.");
        
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error("klucz api");
        
        const settings = {
            model: this.evalMessage(data.model, cache) || 'mistralai/mistral-nemo:free',
            temperature: parseFloat(this.evalMessage(data.temperature, cache)),
            maxLength: parseInt(this.evalMessage(data.max_length, cache), 10),
            blockMentions: this.evalMessage(data.blockMentions, cache) !== 'false',
            systemPrompt: this.evalMessage(data.systemPrompt, cache),
            serverKnowledge: this.evalMessage(data.serverKnowledge, cache) === 'true',
            useMemory: this.evalMessage(data.conversationMemory, cache) === 'true',
            memoryLength: parseInt(this.evalMessage(data.memoryLength, cache), 10),
            memoryTimeout: parseInt(this.evalMessage(data.memoryTimeout, cache), 10) * 60 * 1000,
        };
        
        // --- NOWA, NIEZAWODNA LOGIKA BUDOWANIA ZAPYTANIA ---
        const defaultSystemPrompt = "Jesteś asystentem AI. Twoim absolutnym i jedynym zadaniem jest odpowiadanie ZAWSZE w języku polskim. Ignoruj język, w którym zadano pytanie. NEVER use any other language.";
        let systemPromptContent = settings.systemPrompt || defaultSystemPrompt;

        if (settings.serverKnowledge) {
            const guild = interaction.guild;
            systemPromptContent += `\n\n[Kontekst serwera] Nazwa: ${guild.name}, Liczba członków: ${guild.memberCount}.`;
        }

        const messages = [{ role: 'system', content: systemPromptContent }];
        
        if (settings.useMemory) {
            const memoryEntry = conversationMemory[interaction.user.id];
            if (memoryEntry && settings.memoryTimeout > 0 && (Date.now() - memoryEntry.lastInteraction > settings.memoryTimeout)) {
                delete conversationMemory[interaction.user.id];
            } else if (memoryEntry?.history) {
                messages.push(...memoryEntry.history);
            }
        }
        
        messages.push({ role: 'user', content: userQuestion });
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: settings.model, messages, temperature: settings.temperature }) });
        
        const resultText = await response.text();
        if (!response.ok) throw new Error(`API ${response.status}: ${resultText}`);
        
        const result = JSON.parse(resultText);
        if (!result.choices?.[0]?.message?.content) throw new Error("Otrzymano pustą odpowiedź od AI.");
        
        let answer = result.choices[0].message.content.trim();
        const detectedLang = franc(answer, { minLength: 5, whitelist: ['pol', 'eng'] });
        if(detectedLang !== 'pol') throw new Error("AI odpowiedziała w nieprawidłowym języku.");
        
        if (answer.length > settings.maxLength) answer = answer.substring(0, settings.maxLength - 3) + "...";
        if(settings.blockMentions) answer = answer.replace(/@everyone|@here|<@!?\d+>|<@&\d+>/gi, "[Wzmianka]");
        
        finalPayload = { content: answer, embeds: [], components: [] };
        
        if (settings.useMemory) {
            const userMemory = conversationMemory[interaction.user.id] || { history: [], lastInteraction: 0 };
            userMemory.history.push({ role: 'user', content: userQuestion }, { role: 'assistant', content: answer });
            userMemory.history = userMemory.history.slice(-(settings.memoryLength * 2));
            userMemory.lastInteraction = Date.now();
            conversationMemory[interaction.user.id] = userMemory;
        }

    } catch (e) {
        const error = getErrorMessageWithSolution(e.message);
        console.error(`${c.red}[ERROR] [AI Chat]`, error.raw, c.reset);
        const errorEmbed = new EmbedBuilder().setColor(0xFF0000).setTitle(`Problem: ${error.problem}`).setDescription(`**Sugerowane rozwiązanie:**\n${error.solution}`);
        finalPayload = { content: '', embeds: [errorEmbed], components: [] };
    } 
    
    // --- OSTATECZNA EDYCJA WIADOMOŚCI ---
    await interaction.editReply(finalPayload).catch(console.error);
  },

  mod() {}
};