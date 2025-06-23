const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Muestra información útil sobre los comandos del bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📚 WikiBot - Guía de Comandos')
      .setColor(0x5865F2)
      .setDescription('Aquí tienes una lista de comandos útiles que puedes usar con WikiBot:')
      .addFields(
        {
          name: '🔎 /buscar [tema]',
          value: 'Busca un resumen desde Wikipedia.\nEjemplo: `/buscar Qué es la programación?`'
        },
        {
          name: '🌍 /traducir [texto] [idioma]',
          value: 'Traduce un texto del español a otro idioma disponible.\nEjemplo: `/traducir Hola mundo inglés`'
        },
        {
          name: '🧮 /resolver [operación] [expresión]',
          value:
            'Resuelve problemas matemáticos y muestra pasos si es posible.\nEjemplos:\n' +
            '`/resolver Simplificar (2x^2 + 4x)/2`\n' +
            '`/resolver Derivar x^2 + 3x`\n' +
            '`/resolver Integrar x^2`\n' +
            '`/resolver Ecuación 3x + 5 = 2x + 12`'
        },
        {
          name: 'ℹ️ Consejos útiles',
          value:
            '• Usa `^` para potencias (Ej: `x^2`)\n' +
            '• Evita problemas escritos con texto (Ej: "Luis tenía 8 manzanas...")\n' +
            '• Usa herramientas como **CopyFish** para extraer texto de imágenes'
        }
      )
      .setFooter({ text: 'WikiBot • Tu asistente de estudio 📘' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};