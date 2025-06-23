# WikiBot

-Tu Asistente de Estudios en Discord 📚-

WikiBot es un bot de Discord educativo y totalmente gratuito diseñado para estudiantes, profesores y amantes del conocimiento. Resuelve operaciones matemáticas, busca información de Wikipedia, traduce textos y mucho más, todo sin salir de Discord.

---

## ✨ Funciones principales

* 🔍 **/buscar** — Consulta definiciones o temas directamente desde Wikipedia.
* 🌐 **/traducir** — Traduce texto del español a varios idiomas (inglés, italiano, neerlandés, francés, alemán, portugués).
* 🧠 **/resolver** — Resuelve expresiones matemáticas con pasos explicados (suma, resta, álgebra, derivadas, integrales, trigonometría, etc.).
* 📌 **/ayuda** — Muestra los comandos disponibles y cómo usarlos.

---

## ⚙️ Tecnologías usadas

* `Discord.js v14`
* API de `Wikipedia`
* API de `DeepL` para traducción
* `Newton API` y `MetaDelta` para resolución matemática paso a paso

---

## 🚀 Instalación y uso local

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/WikiBot.git
   cd WikiBot
   ```

2. Crea un archivo `.env` basado en `env.example` con las siguientes variables:

   ```env
   TOKEN=tu_token_de_discord
   CLIENT_ID=tu_client_id
   GUILD_ID=tu_guild_id (opcional para pruebas locales)
   DEEPL_API_KEY=tu_api_key_de_deepl
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Ejecuta el bot:

   ```bash
   node index.js
   ```

---

## 📌 Notas importantes

* Este bot fue creado con fines educativos.
* En algunos comandos, como **/resolver**, se intenta dar prioridad a mostrar los pasos con claridad antes que solo el resultado.
* El bot no resuelve problemas matemáticos redactados en texto como "Luis compró 3 cuadernos...", pero está en evolución.
* Si quieres extraer texto desde una imagen, puedes usar extensiones como **CopyFish** para convertir la imagen en texto antes de usar el bot.

---

## 🧠 Autor y créditos

Desarrollado con pasión por [Norvyz](https://github.com/Norvyz) y la ayuda de APIs públicas como:

* [Newton API](https://newton.now.sh/)
* [MetaDelta](https://github.com/metadelta/solver)
* [DeepL Translator](https://www.deepl.com/)
* [Wikipedia](https://es.wikipedia.org/w/api.php)

---

## 🗣 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

🚀 ¡Espero que WikiBot te ayude a aprender más y mejor!
