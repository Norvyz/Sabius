const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Muestra información útil sobre los comandos del bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📚 Sabius - Guía de Comandos')
      .setColor(0x5865F2)
      .setDescription('Aquí tienes una lista de comandos útiles que puedes usar con Sabius:')
      .addFields(
        {
          name: '🔍 /buscar [tema] [idioma]',
          value: 'Busca un resumen desde Wikipedia y traduce si es necesario.\nEjemplo: `/buscar Qué es la programación? español`'
        },
        {
          name: '🌐 /traducir [texto] [idioma]',
          value: 'Traduce cualquier texto del español a otros idiomas o viceversa.\nEjemplo: `/traducir Hello world español`'
        },
        {
          name: '📖 /libros [título]',
          value: 'Busca libros por título, muestra autor, año, temas y descripción.\nEjemplo: `/libros Cien años de soledad`'
        },
        {
          name: '📘 /diccionario [palabra]',
          value: 'Consulta el significado, fonética, sinónimos y ejemplo de una palabra en inglés.\nEjemplo: `/diccionario love`'
        },
        {
          name: '🧮 /resolver [operación] [expresión]',
          value:
            'Resuelve problemas matemáticos (simplificar, derivar, integrar, ecuaciones, etc).\nEjemplos:\n' +
            '`/resolver Simplificar (2x^2 + 4x)/2`\n' +
            '`/resolver Derivar x^2 + 3x`\n' +
            '`/resolver Integrar x^2`\n' +
            '`/resolver Ecuación 3x + 5 = 2x + 12`'
        },
        {
          name: 'ℹ️ Consejos útiles',
          value:
            '• Usa `^` para potencias (Ej: `x^2`)\n' +
            '• Usa palabras clave simples para obtener mejores resultados\n' +
            '• Puedes usar idiomas como `es`, `en`, `fr`, `pt`, etc.'
        }
      )
      .setFooter({ text: 'WikiBot • Tu asistente de estudio 📘' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
