const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

// 📦 Leer todos los comandos desde /commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ El comando en ${file} está incompleto o malformado.`);
  }
}

// 🚀 Subir comandos a la API de Discord (GLOBAL o GUILD)
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Usa Routes.applicationGuildCommands para pruebas rápidas (solo en 1 servidor)
rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), // Para un solo servidor
  // Routes.applicationCommands(process.env.CLIENT_ID), // Para todos los servidores (descomenta si lo quieres global)
  { body: commands }
)
  .then(() => console.log('✅ Comandos registrados correctamente.'))
  .catch(console.error);
