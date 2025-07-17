# 📬 Messenger

[![CI](https://github.com/KVOTHE73/messenger/actions/workflows/ci.yml/badge.svg)](https://github.com/KVOTHE73/messenger/actions/workflows/ci.yml)

🔶 Una interfaz de mensajería tipo Slack o Discord, construida con **Vue 3**, pensada para escritorio.

🔶 Permite navegar entre canales, grupos, chats privados y documentos organizados en carpetas.

🔶 Los mensajes pueden incluir emojis, archivos y son persistentes durante la sesión.

🔶 Incluye selector de idioma (es/en), cambio de tema (claro/oscuro) y vista completamente responsive.

🔶 Este proyecto forma parte de mi portfolio y está diseñado para mostrar una implementación profesional de una aplicación Vue estructurada, con una UI rica y pruebas unitarias.

![GitHub repo size](https://img.shields.io/github/repo-size/KVOTHE73/messenger)
![GitHub last commit](https://img.shields.io/github/last-commit/KVOTHE73/messenger)
![GitHub license](https://img.shields.io/github/license/KVOTHE73/messenger)

---

## 🔐 Acceso simulado

💡 La app está preconfigurada con datos mock. No requiere login real.

🔹 Usuarios disponibles (ficticios):

- **Nacho Rodríguez** (yo)
- **Pedro** (admin del canal)

🔹 Canales disponibles:

- `#general`
- `#buzón`
- `#proyectos`

🔹 Carpeta de documentos:

- `Recibos` → contiene archivos PDF de ejemplo

---

## 📸 Vista previa

![Vista de messenger](./public/messengerPreview.png)

---

## 🚀 Tecnologías utilizadas

- [Vue 3](https://vuejs.org/) + Composition API
- [Typescript](https://www.typescriptlang.org/)
- [Bootstrap](https://getbootstrap.com/)
- [SASS](https://sass-lang.com/)
- [vue-i18n](https://github.com/intlify/vue-i18n-next)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/vue-testing-library/intro)

---

## 🗂️ Estructura principal

```
src/
├── views/
│ └── messenger/
│ └── desktop/DesktopMessenger.vue      # Vista principal de mensajería
├── composables/
│ └── useMessengerMock.ts               # Datos mock localizados (i18n-ready)
├── i18n/
│ └── messages.ts                       # Textos en español e inglés
├── stores/
│ └── themeStore.ts                     # Store para modo oscuro/claro
├── test/
│ └── Messenger.spec.ts                 # Tests unitarios con Testing Library
├── App.vue                             # Componente raíz
├── main.ts                             # Punto de entrada
└── ...
```

---

## ✨ Funcionalidades

- 🎨 Tema claro / oscuro persistente
- 🌐 Soporte multilenguaje (Español / Inglés)
- 💬 Sistema de mensajería con emojis y archivos
- 📁 Navegación por canales, grupos y carpetas
- 📦 Visualización de documentos
- 📱 Responsive en pantallas pequeñas

---

## 🧩 Estructura del componente principal

- `template`: Contiene la interfaz completa dividida en menú lateral, zona de mensajes y documentos
- `script setup`: Lógica organizada por secciones (mensajes, navegación, temas, idioma)
- `style`: Estilos SCSS locales, sin dependencias externas adicionales

---

## ✅ Cobertura de tests

- 🔹src/test/Messenger.spec.ts (5 tests) 5332ms

  - ✓ cambia a la sección de grupos al hacer clic en el botón correspondiente 93ms
  - ✓ cambia a la sección de docs al hacer clic en el botón correspondiente 28ms
  - ✓ envía un mensaje al hacer clic en el botón de enviar 65ms
  - ✓ cambia el idioma a inglés al hacer clic en el botón de la bandera 22ms
  - ✓ cambia a modo oscuro al hacer clic en el botón de toggle de tema 16ms

- 🔹 Test Files 1 passed (1)
- 🔹 Tests 5 passed (5)
- 🔹 Start at 20:16:49
- 🧪 Duration 5.58s

---

## 🛠️ Instalación y uso

```bash
# Clona el repositorio
git clone https://github.com/KVOTHE73/messenger.git
cd messenger

# Instala dependencias
npm install

# Ejecuta en modo desarrollo
npm run dev
```

---

## 📅 Metainformación

📁 Proyecto: Login

🧠 Autor: [Nacho Rodríguez](https://www.nacho-rodriguez.com)

📦 Tipo: Aplicación Vue 3 con UI completa

🎯 Finalidad: Portfolio personal / Demostración de arquitectura de frontend

🔗 Licencia: MIT

📣 Puedes ver una demo del proyecto en vivo aquí:
🟢 **[Ver demo online](https://kvothe73.github.io/messenger)**
