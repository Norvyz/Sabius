# 📚 Sabius

**Tu Asistente de Estudios en Discord**

Sabius  es un bot educativo y completamente gratuito para Discord. Diseñado para estudiantes, profesores y curiosos, permite consultar información, traducir textos, resolver matemáticas y mucho más, sin salir de Discord.

---

## ✨ Funciones principales

* 🔍 **`/buscar`** — Consulta definiciones o temas desde **Wikipedia**, con opción de traducir al idioma que elijas.
* 🌐 **`/traducir`** — Traduce texto del español a otros idiomas y viceversa (Inglés, Italiano, Neerlandés, Francés, Alemán, Portugués).
* 🧐 **`/resolver`** — Resuelve expresiones matemáticas con **pasos explicados** (álgebra, derivadas, integrales, ecuaciones, etc.).
* 📖 **`/libros`** — Busca información de libros (autor, descripción, año, temas) desde **Open Library**.
* 📘 **`/diccionario`** — Consulta el significado, fonética y sinónimos de una palabra en inglés.
* 📜 **`/ayuda`** — Muestra los comandos disponibles y cómo usarlos.

---

## ⚙️ Tecnologías utilizadas

* [Discord.js v14](https://discord.js.org/)
* [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)
* [DeepL API](https://www.deepl.com/docs-api/)
* [Newton API](https://newton.now.sh/)
* [MetaDelta Solver API](https://github.com/metadelta/solver)
* [Open Library API](https://openlibrary.org/developers/api)

---

## 🚀 Instalación local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/WikiBot.git
   cd WikiBot
   ```

2. Crea un archivo `.env` basado en `env.example`:

   ```
   TOKEN=tu_token_de_discord
   CLIENT_ID=tu_client_id
   GUILD_ID=tu_guild_id  # opcional para pruebas locales
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

* Este bot fue creado con fines **educativos** y de **autoaprendizaje**.
* El comando `/resolver` prioriza mostrar **los pasos** en lugar de solo el resultado.
* No está diseñado para resolver problemas redactados como “Juan tiene 3 manzanas...”.
* Puedes usar herramientas como **CopyFish** para convertir texto de una imagen y luego usarlo con WikiBot.

---

## 🧠 Autor y créditos

Desarrollado por **Norvyz** con ayuda de APIs públicas:

* Newton API
* MetaDelta
* DeepL Translator
* Wikipedia
* Open Library

---

## 🗣 Licencia

Este proyecto está bajo la licencia **MIT**.

---

## 🚀 ¡Espero que WikiBot te ayude a aprender más y mejor!
