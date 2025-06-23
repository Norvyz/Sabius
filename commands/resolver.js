const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const solver = require('@metadelta/solver');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resolver')
    .setDescription('Resuelve problemas matemáticos paso a paso o con resultado.')
    .addStringOption(option =>
      option.setName('tipo')
        .setDescription('Tipo de operación')
        .setRequired(true)
        .addChoices(
          { name: 'Ecuación', value: 'equation' },
          { name: 'Simplificar', value: 'simplify' },
          { name: 'Derivar', value: 'derive' },
          { name: 'Integrar', value: 'integrate' },
          { name: 'Factorizar', value: 'factor' },
          { name: 'Seno', value: 'sin' },
          { name: 'Coseno', value: 'cos' },
          { name: 'Tangente', value: 'tan' }     
        )
    )
    .addStringOption(option =>
      option.setName('expresion')
        .setDescription('Expresión matemática a resolver')
        .setRequired(true)
    ),

  async execute(interaction) {
    const tipo = interaction.options.getString('tipo');
    const expresion = interaction.options.getString('expresion');
    await interaction.deferReply();

    // 1️⃣ Resolver con MetaDelta si es ecuación
    if (tipo === 'equation') {
      try {
        const steps = solver.solveEquation(expresion);
        if (steps.length > 0) {
          const embed = new EmbedBuilder()
            .setTitle('📐 Resolución paso a paso')
            .addFields(
              { name: '📘 Operación', value: 'Ecuación' },
              { name: '🧮 Expresión', value: `\`${expresion}\`` },
              {
                name: '📊 Pasos',
                value: steps.map((s, i) => `**Paso ${i + 1}:** ${s.oldEquation.print()} → ${s.newEquation.print()}`).join('\n')
              }
            )
            .setColor(0x00bfff)
            .setFooter({ text: 'Resuelto con MetaDelta' });

          return interaction.editReply({ embeds: [embed] });
        }
      } catch (err) {
        console.log('⚠️ MetaDelta no pudo resolver, usando Newton como respaldo.');
      }
    }

    // 2️⃣ Si no es ecuación o MetaDelta falla, usar Newton API
    try {
      const res = await fetch(`https://newton.now.sh/api/v2/${tipo}/${encodeURIComponent(expresion)}`);
      const data = await res.json();

      if (!data || !data.result || data.result === 'NaN') {
        return interaction.editReply('❌ No se pudo resolver la expresión. Asegúrate de que esté bien escrita.');
      }

      const embed = new EmbedBuilder()
        .setTitle('📐 Resultado Matemático')
        .addFields(
          { name: '📘 Operación', value: data.operation || tipo },
          { name: '🧮 Expresión', value: `\`${data.expression || expresion}\`` },
          { name: '✅ Resultado', value: `\`${data.result}\`` }
        )
        .setColor(0x1d66b8)
        .setFooter({ text: 'Resuelto con Newton API' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error al resolver con Newton:', error);
      await interaction.editReply('❌ Ocurrió un error al procesar la expresión.');
    }
  }
};
