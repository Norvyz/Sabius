const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('diccionarioen')
    .setDescription('Busca definiciones y ejemplos de una palabra (solo en inglés).')
    .addStringOption(option =>
      option.setName('palabra')
        .setDescription('Palabra en inglés a consultar.')
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction) {
    const palabra = interaction.options.getString('palabra');
    await interaction.deferReply();

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(palabra)}`);
      const data = await res.json();

      if (data.title === "No Definitions Found") {
        return interaction.editReply(`❌ No se encontró la palabra **${palabra}**.`);
      }

      const def = data[0];
      const meaning = def.meanings[0].definitions[0];
      const audio = def.phonetics.find(p => p.audio)?.audio;

      const embed = new EmbedBuilder()
        .setTitle(`📖 Significado de: ${def.word}`)
        .addFields(
          { name: '🗣️ Fonética', value: def.phonetic || 'N/A', inline: true },
          { name: '📘 Definición', value: meaning.definition || 'N/A' },
          { name: '📚 Ejemplo', value: meaning.example || 'No hay ejemplo disponible.' },
          { name: '🔁 Sinónimos', value: meaning.synonyms?.join(', ') || 'Ninguno' }
        )
        .setColor(0x3498db)
        .setFooter({ text: 'Fuente: Free Dictionary API' });

      if (audio) {
        embed.addFields({ name: '🔊 Pronunciación', value: `[Escuchar audio](${audio})` });
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('❌ Error buscando la palabra:', err);
      await interaction.editReply('❌ Hubo un error al buscar la palabra.');
    }
  }
};
