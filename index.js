import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { GoogleGenAI } from '@google/genai';
require('dotenv').config();

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' })
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Bot pronto!');
});

client.on('message', async msg => {
  // Atende pelo prefixo "!" nas mensagens 
  if (msg.body.startsWith('!')) {
    const prompt = msg.body.slice(1).trim();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY});
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      await msg.reply(response.text);
    } catch (err) {
      await msg.reply('Erro ao consultar Gemini.');
      console.error(err);
    }
  }
});

client.initialize();