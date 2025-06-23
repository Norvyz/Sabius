// 📦 Importaciones necesarias
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const express = require('express');
require('dotenv').config();

// 🤖 Crear cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Necesario si luego usas mensajes también
  ]
});

// 📁 Cargar comandos desde la carpeta /commands
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ✅ Evento al iniciar el bot
client.once('ready', () => {
  console.log(`✅ ${client.user.tag} está en línea.`);
});

// 🚀 Ejecutar comandos slash
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error al ejecutar ${interaction.commandName}:`, error);
    await interaction.reply({
      content: '❌ Hubo un error al ejecutar este comando.',
      ephemeral: true
    });
  }
});

// 🌐 Servidor Express para Render + UptimeRobot
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🌍 Bot activo y escuchando.');
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor Express activo en el puerto ${PORT}`);
});

// 🔐 Iniciar sesión con el token de Discord
client.login(process.env.TOKEN);