const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('libros')
    .setDescription('Busca información de un libro en Open Library.')
    .addStringOption(option =>
      option.setName('titulo')
        .setDescription('Título del libro')
        .setRequired(true)
    ),

  async execute(interaction) {
    const titulo = interaction.options.getString('titulo');
    await interaction.deferReply();

    try {
      const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(titulo)}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (!searchData.docs.length) {
        return interaction.editReply(`❌ No se encontró información sobre **${titulo}**.`);
      }

      const libro = searchData.docs[0];
      const bookUrl = `https://openlibrary.org${libro.key}`;

      const title = libro.title || 'Sin título';
      const authors = libro.author_name?.join(', ') || 'Desconocido';
      const publishYear = libro.first_publish_year || 'Desconocido';
      const subjects = libro.subject?.slice(0, 5).join(', ') || 'No disponible';
      const pages = libro.number_of_pages_median || 'No disponible';
      const cover = libro.cover_i
        ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-L.jpg`
        : null;

      let description = 'No disponible.';
      try {
        const detailsRes = await fetch(`https://openlibrary.org${libro.key}.json`);
        const details = await detailsRes.json();

        if (details.description) {
          if (typeof details.description === 'string') {
            description = details.description;
          } else if (details.description?.value) {
            description = details.description.value;
          }

          // Eliminar texto duplicado o bilingüe si tiene separadores
          description = description.split('\n\n').filter(line => line.trim().length > 40)[0] || description;

          if (description.length > 1024) {
            description = description.slice(0, 422) + '...\n\n✂️ *Texto recortado. Usa el botón para leer más.*';
          }
        }
      } catch (e) {
        console.warn('No se pudo obtener descripción extendida.');
      }

      const embed = new EmbedBuilder()
        .setTitle(`📘 ${title}`)
        .setURL(bookUrl)
        .addFields(
          { name: '✍️ Autor(es)', value: authors, inline: true },
          { name: '📅 Año de publicación', value: String(publishYear), inline: true },
          { name: '📄 Páginas', value: String(pages), inline: true },
          { name: '🏷️ Temas', value: subjects },
          { name: '📖 Descripción', value: description }
        )
        .setColor(0x1d66b8)
        .setFooter({ text: '📚 Fuente: Open Library' });

      if (cover) embed.setThumbnail(cover);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('🔎 Ver más en Open Library')
          .setStyle(ButtonStyle.Link)
          .setURL(bookUrl)
      );

      await interaction.editReply({ embeds: [embed], components: [row] });

    } catch (err) {
      console.error('❌ Error en /libros:', err);
      await interaction.editReply('❌ Ocurrió un error al buscar el libro.');
    }
  }
};
