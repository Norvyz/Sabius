const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

// Limpia y normaliza la búsqueda
function limpiarConsulta(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/[¿?¡!]/g, '') // elimina signos
    .replace(/\b(que es|quien es|dime sobre|definicion de|definición de|hablame de|cuentame sobre)\b/gi, '')
    .trim();
}

// Busca usando sugerencias y luego trae el contenido completo
async function buscarWikipediaExtendida(consulta) {
  const urlBusqueda = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(consulta)}&format=json&origin=*`;
  const resBusqueda = await fetch(urlBusqueda);
  const dataBusqueda = await resBusqueda.json();

  const primerResultado = dataBusqueda.query.search[0];
  if (!primerResultado) return null;

  const titulo = primerResultado.title;

  const urlExtracto = `https://es.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=true&titles=${encodeURIComponent(titulo)}&origin=*`;
  const resExtracto = await fetch(urlExtracto);
  const dataExtracto = await resExtracto.json();

  const pageId = Object.keys(dataExtracto.query.pages)[0];
  const page = dataExtracto.query.pages[pageId];

  if (!page || !page.extract) return null;

  return {
    title: page.title,
    extract: page.extract,
    url: `https://es.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
  };
}

// Traduce el texto si el idioma no es español
async function traducirConDeepL(texto, idiomaObjetivo) {
  if (idiomaObjetivo === 'es') return texto; // No traducimos si el idioma es español

  const apiKey = process.env.DEEPL_API_KEY;
  const url = 'https://api-free.deepl.com/v2/translate';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth_key: apiKey,
      text: texto,
      source_lang: 'ES',
      target_lang: idiomaObjetivo.toUpperCase()
    })
  });

  const data = await res.json();
  return data.translations?.[0]?.text || null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar')
    .setDescription('Busca información en Wikipedia y tradúcela al idioma que desees.')
    .addStringOption(option =>
      option.setName('consulta')
        .setDescription('¿Qué quieres buscar?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('idioma')
        .setDescription('Idioma en el que quieres la respuesta')
        .setRequired(true)
        .addChoices(
          { name: 'Español', value: 'es' },
          { name: 'Inglés', value: 'en' },
          { name: 'Italiano', value: 'it' },
          { name: 'Neerlandés', value: 'nl' },
          { name: 'Francés', value: 'fr' },
          { name: 'Alemán', value: 'de' },
          { name: 'Portugués', value: 'pt' }
        )
    ),

  async execute(interaction) {
    const consultaOriginal = interaction.options.getString('consulta');
    const idioma = interaction.options.getString('idioma');
    const consulta = limpiarConsulta(consultaOriginal);

    await interaction.deferReply();

    try {
      let data = await buscarWikipediaExtendida(consulta);

      if (!data) {
        return interaction.editReply(`❌ No se encontró información sobre **${consultaOriginal}**.`);
      }

      let descripcion = data.extract;

      // Corta si es muy largo para Discord
      if (descripcion.length > 4000) {
        descripcion = descripcion.slice(0, 4000) + '\n\n📝 *Texto recortado por límite de Discord...*';
      }

      // Traduce si se pidió otro idioma
      if (idioma !== 'es') {
        const traduccion = await traducirConDeepL(descripcion, idioma);
        if (!traduccion) {
          return interaction.editReply('❌ No se pudo traducir el texto.');
        }
        descripcion = traduccion;
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setURL(data.url)
        .setDescription(descripcion)
        .setColor(0x1d66b8)
        .setFooter({ text: `🌍 Respuesta en ${idioma.toUpperCase()} - Wikipedia` });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Error al buscar o traducir:', error);
      await interaction.editReply('❌ Ocurrió un error inesperado al procesar la consulta.');
    }
  }
};