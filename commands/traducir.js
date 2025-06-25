const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const idiomaMap = {
  'Español': 'ES',
  'Inglés': 'EN',
  'Italiano': 'IT',
  'Neerlandés': 'NL',
  'Francés': 'FR',
  'Alemán': 'DE',
  'Portugués': 'PT'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('traducir')
    .setDescription('Traduce texto a otro idioma usando DeepL.')
    .addStringOption(option =>
      option.setName('texto')
        .setDescription('Texto a traducir (se detectará el idioma automáticamente).')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('idioma')
        .setDescription('Idioma al que quieres traducir el texto.')
        .setRequired(true)
        .addChoices(
          { name: 'Español', value: 'ES' },
          { name: 'Inglés', value: 'EN' },
          { name: 'Italiano', value: 'IT' },
          { name: 'Neerlandés', value: 'NL' },
          { name: 'Francés', value: 'FR' },
          { name: 'Alemán', value: 'DE' },
          { name: 'Portugués', value: 'PT' }
        )
    ),

  async execute(interaction) {
    const texto = interaction.options.getString('texto');
    const idiomaDestino = interaction.options.getString('idioma');

    await interaction.deferReply();

    try {
      const res = await axios.post('https://api-free.deepl.com/v2/translate', null, {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: texto,
          target_lang: idiomaDestino
        }
      });

      const traducido = res.data.translations[0].text;
      const idiomaFuente = res.data.translations[0].detected_source_language;

      await interaction.editReply(
        `📝 Traducción detectada desde **${idiomaFuente}** a **${idiomaDestino}**:\n\n**${traducido}**`
      );

    } catch (error) {
      console.error('❌ Error al traducir con DeepL:', error.response?.data || error.message);
      await interaction.editReply('❌ Ocurrió un error al traducir con DeepL.');
    }
  }
};
