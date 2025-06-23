const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const idiomaMap = {
  'inglés': 'EN',
  'italiano': 'IT',
  'neerlandés': 'NL',
  'francés': 'FR',
  'alemán': 'DE',
  'portugués': 'PT'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('traducir')
    .setDescription('Traduce texto del español a otro idioma usando DeepL.')
    .addStringOption(option =>
      option.setName('texto')
        .setDescription('Texto en español para traducir')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('idioma')
        .setDescription('Idioma de destino')
        .setRequired(true)
        .addChoices(
          { name: 'Inglés', value: 'inglés' },
          { name: 'Italiano', value: 'italiano' },
          { name: 'Neerlandés', value: 'neerlandés' },
          { name: 'Francés', value: 'francés' },
          { name: 'Alemán', value: 'alemán' },
          { name: 'Portugués', value: 'portugués' }
        )
    ),

  async execute(interaction) {
    const texto = interaction.options.getString('texto');
    const idiomaElegido = interaction.options.getString('idioma');
    const codigoIdioma = idiomaMap[idiomaElegido];

    if (!codigoIdioma) {
      return interaction.reply('❌ Idioma no válido.');
    }

    await interaction.deferReply();

    try {
      const res = await axios.post('https://api-free.deepl.com/v2/translate', null, {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: texto,
          source_lang: 'ES',
          target_lang: codigoIdioma
        }
      });

      const traducido = res.data.translations[0].text;

      await interaction.editReply(`✅ Traducción al ${idiomaElegido}:\n**${traducido}**`);
    } catch (error) {
      console.error('❌ Error al traducir con DeepL:', error.response?.data || error.message);
      await interaction.editReply('❌ Ocurrió un error al traducir con DeepL.');
    }
  }
};