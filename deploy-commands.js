const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];

// Cargar todos los comandos desde la carpeta /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Inicializar REST
const rest = new REST({ version: '10' }).setToken(token);

// Registrar comandos (global o local)
(async () => {
  try {
    console.log('🚀 Actualizando comandos...');

    if (guildId) {
      // Registro local para desarrollo
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`✅ Comandos actualizados en el servidor de pruebas (${guildId}).`);
    } else {
      // Registro global para todos los servidores
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log('✅ Comandos globales registrados. (Puede tardar hasta 1 hora en propagarse)');
    }
  } catch (error) {
    console.error('❌ Error al registrar los comandos:', error);
  }
})();
