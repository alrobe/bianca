# 💌 Carta Interactiva con Google Sheets

Una carta interactiva tipo San Valentín que se abre solo con contraseña 💖  
El contenido del mensaje se carga dinámicamente desde **Google Sheets**, dependiendo de la fecha actual.

---

## ✨ Características

- 🔐 Protegida con contraseña  
- 📅 Mensajes especiales por fecha  
- 🎲 Mensajes aleatorios si no hay fecha especial  
- ☁️ Contenido administrado desde Google Sheets  
- ❤️ Animaciones y corazones flotantes  
- 🔄 Cada vez que presionas **OPEN** se carga un mensaje nuevo  
- ❌ Sin backend  
- ❌ Sin botón reset  
- ✅ Funciona solo con HTML + JavaScript  

---

## 🧠 ¿Cómo funciona?

1. El usuario presiona **OPEN**
2. Se solicita una contraseña
3. La contraseña se valida contra Google Sheets
4. Si es correcta:
   - Se compara la fecha actual
   - Si coincide con una fecha del Sheet → se muestra el mensaje especial
   - Si no coincide → se muestra un mensaje aleatorio
5. La carta se abre y muestra el mensaje 💌

---

## 📊 Estructura del Google Sheet

El Google Sheet debe estar **publicado en la web** y tener esta estructura:

| Columna | Descripción |
|-------|-------------|
| A | Fecha (`DD/MM/YYYY`) |
| B | Mensaje especial para esa fecha |
| C | Mensaje aleatorio |
| D | Contraseña (solo se usa la **primera fila**) |

### 📌 Ejemplo

| A | B | C | D |
|--|--|--|--|
| 14/02/2026 | Feliz San Valentín 💖 | Te pienso mucho | password |
| 15/02/2026 | Otro mensaje especial | Eres increíble | |
