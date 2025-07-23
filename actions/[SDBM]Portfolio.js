module.exports = {
  // Stabilne nazwy, nie edytuj ich
  name: "Portfolio Mod",
  displayName: "Portfolio Mod",
  section: "###SDBM Mods",
  author: "euforia.44 (final version by Gemini)",
  version: "9.8.0", // Canvas Update
  short_description: "Generuje profesjonalną grafikę portfolio z licznymi opcjami personalizacji.",
  subtitle(data) {
    return `Tryb: ${data.backgroundMode === 'direct' ? 'Bezpośrednio w Embed' : 'Na płótnie (Canvas)'}`;
  },
  fields: [
    "targetChannelID", "embedTitle", "embedDesc", "embedColor", "realizatorField", "dlaKogoField",
    "backgroundMode", "enableMainText", "enableTopLayer", "enableTimestamp",
    "canvasBackgroundType", "gradientColor1", "gradientColor2", "gradientDirection",
    "fontPath", "fontSize", "fontColor", "textShadowColor", "textVerticalAlign", "textShadowBlur",
    "textShadowOffsetX", "textShadowOffsetY", "mainImageScale", "cornerRadius", "shadowColor",
    "shadowBlur", "shadowOffsetX", "shadowOffsetY", "watermarkTransparency", "watermark",
    "topLayerImageURL", "backgroundImageURL", "reaction1", "reaction2", "reaction3", "reaction4",
    "enableLinkButton", "buttonPosition", "buttonLabel", "buttonLinkURL", "secondMessageImageURL",
  ],

  html(isEvent, data) {
    return `
      <div style="padding: 10px;">
        <tab-system>
          <tab label="⚙️" icon="cogs">
            <div style="padding: 10px;">
              <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <div style="width: 50%;">
                  <label>Tryb Grafiki</label>
                  <select id="backgroundMode" class="round">
                    <option value="canvas" selected>Na Płótnie (Canvas)</option>
                    <option value="direct">Bezpośrednio w Embed</option>
                  </select>
                </div>
                <div style="width: 50%;">
                  <label>Dodaj stempel czasowy (Timestamp)</label>
                  <select id="enableTimestamp" class="round">
                    <option value="true" selected>Tak</option>
                    <option value="false">Nie</option>
                  </select>
                </div>
              </div>
              <div style="width: 100%; margin-bottom: 12px;">
                <label>ID Kanału do Wysyłki (zostaw puste, aby wysyłać na obecnym kanale)</label>
                <input id="targetChannelID" class="round" type="text" placeholder="Wklej tutaj ID kanału...">
              </div>
              <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <div style="width: 60%;"><label>Tytuł Embedu</label><input id="embedTitle" class="round" type="text" value="PORTFOLIO"></div>
                <div style="width: 40%;"><label>Kolor Embedu</label><input id="embedColor" class="round" type="text" value="#ea29d1"></div>
              </div>
              <div style="margin-bottom: 12px;">
                <label>Opis Embedu</label><textarea id="embedDesc" class="round" rows="2" style="width: 100%; resize: vertical;">Nowa praca już wleciała! Podoba się? Zostaw reakcję!</textarea>
              </div>
              <div style="display: flex; gap: 10px;">
                <div style="width: 50%;"><label>Pole "Wykonane przez"</label><input id="realizatorField" class="round" type="text" value="\${slashParams('Wykonawca')}"></div>
                <div style="width: 50%;"><label>Pole "Dla kogo"</label><input id="dlaKogoField" class="round" type="text" value="Automatycznie z parametrów slash" disabled></div>
              </div>
            </div>
          </tab>

          <tab label="🖼️" icon="image">
             <div style="padding: 10px;">
                <p style="font-size: 13px; margin-bottom: 15px;">Te opcje działają tylko w trybie "Na Płótnie (Canvas)".</p>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                  <div style="width: 50%;"><label>Skala Grafiki (%)</label><input id="mainImageScale" class="round" type="number" value="60"></div>
                  <div style="width: 50%;"><label>Zaokrąglenie (px)</label><input id="cornerRadius" class="round" type="number" value="50"></div>
                </div>
                <div style="margin-top: 8px;"><label><b>Cień dla Grafiki</b></label></div>
                <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                  <div style="width: 25%;"><label>Kolor</label><input id="shadowColor" class="round" type="text" value="#000000"></div>
                  <div style="width: 25%;"><label>Rozmycie</label><input id="shadowBlur" class="round" type="number" value="15"></div>
                  <div style="width: 25%;"><label>Offset X</label><input id="shadowOffsetX" class="round" type="number" value="0"></div>
                  <div style="width: 25%;"><label>Offset Y</label><input id="shadowOffsetY" class="round" type="number" value="10"></div>
                </div>
             </div>
          </tab>

          <tab label="✍️" icon="font">
            <div style="padding: 10px;">
                <p style="font-size: 13px; margin-bottom: 15px;">Te opcje działają tylko w trybie "Na Płótnie (Canvas)".</p>
                <div style="width: 50%; margin-bottom: 15px;">
                  <label>Włącz tekst główny na grafice</label>
                  <select id="enableMainText" class="round"><option value="true" selected>Tak</option><option value="false">Nie</option></select>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                    <div style="flex-grow: 1;"><label>Czcionka</label><input id="fontPath" class="round" type="text" value="fonts/proxima.otf"></div>
                    <div style="width: 90px;"><label>Maks. Rozmiar</label><input id="fontSize" class="round" type="number" value="180"></div>
                    <div style="width: 90px;"><label>Kolor</label><input id="fontColor" class="round" type="text" value="#FFFFFF"></div>
                </div>
                <hr><label><b>Znak Wodny</b></label>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    <div style="flex-grow: 1;"><label>Tekst znaku wodnego</label><input id="watermark" class="round" type="text" value="\${slashParams('watermark')}"></div>
                    <div style="width: 120px;"><label>Przezroczystość (%)</label><input id="watermarkTransparency" class="round" type="number" value="35"></div>
                </div>
            </div>
          </tab>

          <tab label="🏞️" icon="clone">
            <div style="padding: 10px;">
                <p style="font-size: 13px; margin-bottom: 15px;">Te opcje działają tylko w trybie "Na Płótnie (Canvas)".</p>
                <div style="width: 50%; margin-bottom: 12px;">
                  <label>Typ Tła</label>
                  <select id="canvasBackgroundType" class="round">
                    <option value="image" selected>Obraz</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
                <div style="margin-bottom: 15px;"><label><b>Tło Obraz (URL)</b></label><input id="backgroundImageURL" class="round" type="text" value="https://media.discordapp.net/attachments/1113880193892417646/1113912780289413210/tloportfolio.png"></div>
                <hr>
                <p style="font-size: 13px; margin-top: 15px; margin-bottom: 8px;"><b>Tło Gradient</b></p>
                <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                  <div style="width: 33%;"><label>Kolor 1</label><input id="gradientColor1" class="round" type="text" value="#7928a5"></div>
                  <div style="width: 33%;"><label>Kolor 2</label><input id="gradientColor2" class="round" type="text" value="#ea29d1"></div>
                  <div style="width: 34%;"><label>Kierunek</label><select id="gradientDirection" class="round"><option value="vertical" selected>Pionowy</option><option value="horizontal">Poziomy</option></select></div>
                </div>
                <hr>
                <div style="width: 50%; margin-bottom: 8px; margin-top: 15px;">
                    <label>Włącz Warstwę Ramki</label>
                    <select id="enableTopLayer" class="round"><option value="false" selected>Nie</option><option value="true">Tak</option></select>
                </div>
                <div style="margin-bottom: 15px;"><label><b>Warstwa Ramki (URL)</b></label><input id="topLayerImageURL" class="round" type="text" value="https://media.discordapp.net/attachments/1113880193892417646/1113912779937095830/fale.png"></div>
            </div>
          </tab>
          
          <tab label="👆" icon="hand pointer outline">
            <div style="padding: 10px;">
              <p style="font-size: 13px; margin-bottom: 10px;">Wpisz do czterech emoji, którymi bot ma zareagować.</p>
              <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <div style="width: 25%;"><label>Reakcja #1</label><input id="reaction1" class="round" type="text" value="🔥"></div>
                <div style="width: 25%;"><label>Reakcja #2</label><input id="reaction2" class="round" type="text"></div>
                <div style="width: 25%;"><label>Reakcja #3</label><input id="reaction3" class="round" type="text"></div>
                <div style="width: 25%;"><label>Reakcja #4</label><input id="reaction4" class="round" type="text"></div>
              </div>
              <hr><p style="font-size: 13px; margin-top: 20px; margin-bottom: 10px;">Dodaj przycisk z linkiem.</p>
              <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <div style="width: 50%;"><label>Włącz Przycisk</label><select id="enableLinkButton" class="round"><option value="false" selected>Nie</option><option value="true">Tak</option></select></div>
                <div style="width: 50%;"><label>Pozycja Przycisku</label><select id="buttonPosition" class="round"><option value="below" selected>Pod Embedem</option><option value="above">Nad Embedem</option></select></div>
              </div>
              <div style="margin-bottom: 12px;"><label>Etykieta Przycisku</label><input id="buttonLabel" class="round" type="text" value="Zobacz więcej"></div>
              <div><label>URL Linku Przycisku</label><input id="buttonLinkURL" class="round" type="text" value="https://cracko.lol"></div>
            </div>
          </tab>
          
          <tab label="➕" icon="plus square outline">
            <div style="padding: 10px;"><label>URL Obrazu w drugiej wiadomości</label><input id="secondMessageImageURL" class="round" type="text" value="https://media.discordapp.net/attachments/1113880193892417646/1113880228308258816/evbanner.png"></div>
          </tab>
        </tab-system>
      </div>
    `;
  },

  async action(cache) {
    const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
    const { createCanvas, loadImage, registerFont } = require("canvas");
    const path = require("path");
    const { interaction } = cache;
    const MOD_NAME = "[Portfolio Mod]";

    const getData = (fieldName) => {
        const actionData = cache.actions[cache.index];
        return this.evalMessage(actionData[fieldName], cache);
    };

    async function loadImageFromUrl(url) {
        if (!url) return null;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
            return await loadImage(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
            console.error(`${MOD_NAME} Failed to load image from ${url}:`, error);
            return null;
        }
    }

    if (!interaction || !interaction.isCommand()) {
      return this.callNextAction(cache);
    }
    
    try {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      }
    } catch (e) {
      console.log(`${MOD_NAME} Could not defer reply (likely already acknowledged): ${e.message}`);
    }

    try {
      const embed = new EmbedBuilder()
        .setColor(getData("embedColor") || "#ea29d1")
        .setTitle(getData("embedTitle") || null)
        .setDescription(getData("embedDesc") || null)
        .setThumbnail(interaction.guild.iconURL({ extension: "png", size: 128 }))
        .setFooter({ text: `${interaction.guild.name} • dc.euforia.fun`, iconURL: interaction.guild.iconURL() });
      
      // NOWA FUNKCJA: Stempel czasowy
      if (getData("enableTimestamp") === "true") {
        embed.setTimestamp();
      }

      const userForWhom = interaction.options.getUser('dla_uzytkownika');
      const textForWhom = interaction.options.getString('dla_tekst');
      let dlaKogoValue = '';
      if (userForWhom) { dlaKogoValue = `<@${userForWhom.id}> (${userForWhom.username})`; } 
      else if (textForWhom) { dlaKogoValue = textForWhom; }
      const realizatorField = getData("realizatorField");
      if (realizatorField || dlaKogoValue) {
        embed.addFields(
            { name: "Wykonane przez:", value: realizatorField || " ", inline: true },
            { name: "Dla kogo:", value: dlaKogoValue || " ", inline: true }
        );
      }
      
      const buttonRow = new ActionRowBuilder();
      if (getData("enableLinkButton") === "true" && getData("buttonLinkURL")) {
        buttonRow.addComponents(new ButtonBuilder().setLabel(getData("buttonLabel") || "Zobacz więcej").setURL(getData("buttonLinkURL")).setStyle(ButtonStyle.Link));
      }
      
      let messagePayload = { embeds: [embed] };
      if(buttonRow.components.length > 0) messagePayload.components = [buttonRow];

      const backgroundMode = getData("backgroundMode");

      if (backgroundMode === 'direct') {
        const attachment = interaction.options.getAttachment("zalacznik");
        if (!attachment || !attachment.url) {
          await interaction.editReply({ content: "Błąd: W trybie 'Bezpośrednio w Embed' musisz dodać załącznik."});
          return this.callNextAction(cache);
        }
        embed.setImage(attachment.url);

      } else {
        await interaction.editReply({ content: "Twoje polecenie zostało przyjęte. Generowanie grafiki..." });
        
        const CANVAS_WIDTH = 1920, CANVAS_HEIGHT = 1080;
        const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const ctx = canvas.getContext("2d");
        const defaults = { mainImageScale: 60, cornerRadius: 50, shadowColor: "#000000", shadowBlur: 15, shadowOffsetX: 0, shadowOffsetY: 10, fontPath: "fonts/proxima.otf", fontSize: 180, fontColor: "#FFFFFF", textVerticalAlign: "top", watermarkTransparency: 35, textShadowColor: "#000000", textShadowBlur: 5, textShadowOffsetX: 2, textShadowOffsetY: 2 };
        const parseNumber = (value, fallback) => { const num = parseInt(value, 10); return isNaN(num) ? fallback : num; };
        
        // NOWA FUNKCJA: Wybór tła (Obraz lub Gradient)
        const canvasBgType = getData("canvasBackgroundType");
        if(canvasBgType === "gradient") {
          const color1 = getData("gradientColor1") || "#7928a5";
          const color2 = getData("gradientColor2") || "#ea29d1";
          const direction = getData("gradientDirection");
          const gradient = direction === 'horizontal' 
              ? ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0)
              : ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
          gradient.addColorStop(0, color1);
          gradient.addColorStop(1, color2);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else {
          const backgroundImage = await loadImageFromUrl(getData("backgroundImageURL"));
          if (backgroundImage) ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        const attachment = interaction.options.getAttachment("zalacznik");
        if (attachment && attachment.url) {
          // ... reszta kodu canvas (rysowanie głównego obrazu) jest identyczna i stabilna ...
          const mainImage = await loadImageFromUrl(attachment.url);
          if (mainImage) {
              const mainImageScale = parseNumber(getData("mainImageScale"), defaults.mainImageScale) / 100;
              const cornerRadius = parseNumber(getData("cornerRadius"), defaults.cornerRadius);
              let w = CANVAS_WIDTH * mainImageScale, h = w / (mainImage.width / mainImage.height);
              if (h > CANVAS_HEIGHT * mainImageScale) { h = CANVAS_HEIGHT * mainImageScale; w = h * (mainImage.width / mainImage.height); }
              const x = (CANVAS_WIDTH - w) / 2, y = (CANVAS_HEIGHT - h) / 2;
              ctx.save();
              const shadowBlur = parseNumber(getData("shadowBlur"), defaults.shadowBlur);
              if (shadowBlur > 0) { ctx.shadowColor = getData("shadowColor") || defaults.shadowColor; ctx.shadowBlur = shadowBlur; ctx.shadowOffsetX = parseNumber(getData("shadowOffsetX"), defaults.shadowOffsetX); ctx.shadowOffsetY = parseNumber(getData("shadowOffsetY"), defaults.shadowOffsetY); }
              ctx.beginPath(); ctx.moveTo(x + cornerRadius, y); ctx.arcTo(x + w, y, x + w, y + cornerRadius, cornerRadius); ctx.arcTo(x + w, y + h, x + w - cornerRadius, y + h, cornerRadius); ctx.arcTo(x, y + h, x, y + h - cornerRadius, cornerRadius); ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius); ctx.closePath(); ctx.clip();
              ctx.drawImage(mainImage, x, y, w, h); ctx.restore();
          }
        }
        try {
            // ... reszta kodu canvas (rysowanie tekstu i znaku wodnego) jest identyczna i stabilna ...
            const fontPath = getData("fontPath") || defaults.fontPath;
            const FONT_FAMILY = "CustomFont"; const resolvedFontPath = path.resolve(process.cwd(), fontPath);
            registerFont(resolvedFontPath, { family: FONT_FAMILY });
            const mainText = this.evalMessage("\${slashParams('tekst_grafiki')}", cache);
            if (getData("enableMainText") === "true" && mainText) {
                ctx.save();
                const textShadowBlur = parseNumber(getData("textShadowBlur"), defaults.textShadowBlur);
                if(textShadowBlur > 0) { ctx.shadowColor = getData("textShadowColor") || defaults.textShadowColor; ctx.shadowBlur = textShadowBlur; ctx.shadowOffsetX = parseNumber(getData("textShadowOffsetX"), defaults.textShadowOffsetX); ctx.shadowOffsetY = parseNumber(getData("textShadowOffsetY"), defaults.textShadowOffsetY); }
                let fontSize = parseNumber(getData("fontSize"), defaults.fontSize);
                const maxTextWidth = CANVAS_WIDTH * 0.9; let imageCenterY = CANVAS_HEIGHT / 2, imageHeight = 0;
                do { ctx.font = `bold ${fontSize}px "${FONT_FAMILY}", sans-serif`; if (ctx.measureText(mainText).width <= maxTextWidth) break; fontSize -= 5; } while (fontSize > 10);
                ctx.fillStyle = getData("fontColor") || defaults.fontColor; ctx.textAlign = "center"; ctx.textBaseline = "middle";
                const verticalAlign = getData("textVerticalAlign") || defaults.textVerticalAlign;
                const textY = verticalAlign === "bottom" ? imageCenterY + imageHeight + (CANVAS_HEIGHT - (imageCenterY + imageHeight)) / 2 : imageCenterY / 2;
                ctx.fillText(mainText, CANVAS_WIDTH / 2, textY); ctx.restore();
            }
            const watermarkText = getData("watermark");
            if (watermarkText) {
                const transparency = parseNumber(getData("watermarkTransparency"), defaults.watermarkTransparency);
                ctx.globalAlpha = Math.max(0, Math.min(100, transparency)) / 100;
                ctx.font = `bold 30px "${FONT_FAMILY}", sans-serif`; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
                ctx.fillText(watermarkText, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20); ctx.globalAlpha = 1.0;
            }
        } catch (err) { console.error(`${MOD_NAME} Błąd operacji na tekście lub czcionce:`, err); }
        if(getData("enableTopLayer") === "true") { const topLayerImage = await loadImageFromUrl(getData("topLayerImageURL")); if (topLayerImage) ctx.drawImage(topLayerImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); }
        const finalAttachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "portfolio.png" });
        embed.setImage("attachment://portfolio.png"); messagePayload.files = [finalAttachment];
      }

      let targetChannel = interaction.channel;
      const targetChannelID = getData("targetChannelID");
      if (targetChannelID) {
        try {
            const fetchedChannel = await interaction.guild.channels.fetch(targetChannelID);
            if (fetchedChannel && fetchedChannel.isTextBased()) targetChannel = fetchedChannel;
        } catch(e) { console.log(`${MOD_NAME} Nie znaleziono kanału docelowego, wysyłanie na obecnym kanale.`); }
      }
      
      if (buttonRow.components.length > 0 && getData("buttonPosition") === 'above') await targetChannel.send({ components: [buttonRow] });
      const sentMessage = await targetChannel.send(messagePayload);
      if (buttonRow.components.length > 0 && getData("buttonPosition") === 'below') await targetChannel.send({ components: [buttonRow] });
      
      if (sentMessage) {
        const reactions = [getData("reaction1"), getData("reaction2"), getData("reaction3"), getData("reaction4")].filter(Boolean);
        for (const reaction of reactions) {
          try { await sentMessage.react(reaction); } catch (err) { console.error(`${MOD_NAME} Nie udało się dodać reakcji "${reaction}":`, err); }
        }
      }

      const secondMessageImageURL = getData("secondMessageImageURL");
      if (secondMessageImageURL) {
        try { await targetChannel.send({ content: secondMessageImageURL }); }
        catch (err) { console.error(`${MOD_NAME} Nie udało się wysłać drugiej wiadomości:`, err); }
      }
      
      await interaction.editReply({ content: `Gotowe! Twoje portfolio zostało wysłane na kanale ${targetChannel}.`, components: [], embeds: []});

    } catch (err) {
      console.error(`${MOD_NAME} Wystąpił krytyczny błąd:`, err);
      try {
        await interaction.editReply({ content: "Wystąpił nieoczekiwany błąd. Sprawdź konsolę bota.", components: [], embeds: [], files: [] });
      } catch (e) {
        console.error(`${MOD_NAME} Nie udało się nawet wysłać wiadomości o błędzie:`, e);
      }
    } finally {
      this.callNextAction(cache);
    }
  },
  mod() {},
};
