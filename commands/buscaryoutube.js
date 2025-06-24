const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscaryoutube')
    .setDescription('Busca un video en YouTube.')
    .addStringOption(option =>
      option.setName('consulta')
        .setDescription('Tema o nombre del video')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('consulta');
    await interaction.deferReply();

    try {
      const apiKey = process.env.YOUTUBE_API_KEY;
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`);
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        return interaction.editReply(`❌ No se encontró un video para **${query}**.`);
      }

      const video = data.items[0];
      const videoId = video.id.videoId;
      const url = `https://www.youtube.com/watch?v=${videoId}`;

      const embed = new EmbedBuilder()
        .setTitle(`🎬 ${video.snippet.title}`)
        .setURL(url)
        .setDescription(video.snippet.description || 'Sin descripción.')
        .setThumbnail(video.snippet.thumbnails.high.url)
        .setFooter({ text: 'Fuente: YouTube Data API' })
        .setColor(0xff0000);

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('❌ Error al buscar en YouTube:', err);
      await interaction.editReply('❌ Hubo un error al buscar en YouTube.');
    }
  }
};
