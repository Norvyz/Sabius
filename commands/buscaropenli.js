const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscaropenli')
    .setDescription('🔍 Busca libros por título, autor o ISBN en Open Library.')
    .addStringOption(option =>
      option.setName('consulta')
        .setDescription('Título, autor o ISBN')
        .setRequired(true)
    ),

  async execute(interaction) {
    const consulta = interaction.options.getString('consulta');
    await interaction.deferReply();

    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(consulta)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        return interaction.editReply(`❌ No se encontraron resultados para: **${consulta}**`);
      }

      const libro = data.docs[0]; // Primer resultado

      const embed = new EmbedBuilder()
        .setTitle(libro.title || 'Sin título')
        .setDescription(`📖 *${libro.author_name?.join(', ') || 'Autor desconocido'}*`)
        .setURL(`https://openlibrary.org${libro.key}`)
        .setColor(0x5e9cff)
        .addFields(
          { name: '📅 Año de publicación', value: libro.first_publish_year?.toString() || 'Desconocido', inline: true },
          { name: '📚 Ediciones', value: libro.edition_count?.toString() || 'Desconocidas', inline: true }
        )
        .setFooter({ text: 'Fuente: Open Library' });

      if (libro.cover_i) {
        embed.setThumbnail(`https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`);
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error al buscar en Open Library:', error);
      await interaction.editReply('❌ Hubo un error al buscar el libro.');
    }
  }
};
