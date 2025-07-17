import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { PerfectScrollbarPlugin } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";

import "./scss/vue.scss";

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import router from "./router";
import messages from "./i18n/messages";
import { useThemeStore } from "./stores/themeStore";

import { IonicVue } from "@ionic/vue";
import { addIcons } from "ionicons";
import {
  addOutline,
  calendar,
  calendarOutline,
  todayOutline,
  arrowBackOutline,
  playOutline,
  pauseOutline,
  stopOutline,
  walkOutline,
  returnUpBackOutline,
  reload,
  search,
  closeOutline,
  checkmarkDoneOutline,
  alertCircleOutline,
} from "ionicons/icons"; // Importa los iconos necesarios

addIcons({
  "add-outline": addOutline, // icono "+"
  "arrow-back-outline": arrowBackOutline, // icono "volver"
  "play-outline": playOutline, // icono "play"
  "pause-outline": pauseOutline, // icono "pausa"
  "walk-outline": walkOutline, // icono "caminar (salir)"
  "return-up-back-outline": returnUpBackOutline, // icono "volver"
  "stop-outline": stopOutline, // icono "stop"
  "refresh-outline": reload, // icono refrescar
  search: search, // icono de búsqueda
  "calendar-outline": calendarOutline, // icono de calendario
  calendar: calendar, // icono de calendario
  "today-outline": todayOutline, // icono para "día"
  "close-outline": closeOutline, // icono para "cerrar"
  "alert-circle-outline": alertCircleOutline, // icono para alertas
  "checkmark-done-outline": checkmarkDoneOutline, // icono para marcar todo como leído
});

// IONIC
// Importar los estilos de Ionic
import "@ionic/vue/css/core.css";
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

const app = createApp(App);

app.use(IonicVue);
app.use(createPinia());
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(
  createI18n({
    legacy: false, // Para usar Composition API
    locale: "es",
    messages,
    numberFormats: {
      en: {
        currency: {
          style: "currency",
          currency: "USD",
          currencyDisplay: "symbol",
        },
      },
      es: {
        currency: {
          style: "currency",
          currency: "EUR",
          currencyDisplay: "symbol",
        },
      },
    },
  })
);

const themeStore = useThemeStore();
themeStore.applyTheme();

app.mount("#app");
