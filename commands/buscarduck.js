// 📁 commands/buscarDuck.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscarduck')
    .setDescription('Busca información general usando DuckDuckGo.')
    .addStringOption(option =>
      option.setName('consulta')
        .setDescription('¿Qué quieres buscar?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const consulta = interaction.options.getString('consulta');
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(consulta)}&format=json&no_html=1&skip_disambig=1`;

    await interaction.deferReply();

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.AbstractText && !data.RelatedTopics?.length) {
        return interaction.editReply(`❌ No se encontró información sobre **${consulta}**.`);
      }

      const embed = new EmbedBuilder()
        .setTitle(data.Heading || `Resultado para: ${consulta}`)
        .setDescription(data.AbstractText || data.RelatedTopics[0]?.Text || 'No se encontró una descripción clara.')
        .setURL(data.AbstractURL || data.RelatedTopics[0]?.FirstURL || `https://duckduckgo.com/?q=${encodeURIComponent(consulta)}`)
        .setColor(0xffcc00)
        .setFooter({ text: '🔎 Información obtenida de DuckDuckGo Instant Answer API' });

      if (data.Image) embed.setThumbnail(`https://duckduckgo.com${data.Image}`);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error al buscar con DuckDuckGo:', error);
      await interaction.editReply('❌ Ocurrió un error al buscar la información.');
    }
  }
};
