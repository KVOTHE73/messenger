<template>
  <ion-page id="mobileMessenger">
    <!-- 1️⃣ VISTA LISTADO (no inChat) -->
    <template v-if="!inChat">
      <!-- 🔹 Barra superior extra con selector de idioma y tema -->
      <ion-header v-if="!inChat">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-avatar
              data-testid="user-avatar"
              class="mx-2"
              title="Nacho Rodriguez"
            >
              <img
                :src="currentMock.users['yo'].avatar"
                alt="avatar"
                class="avatar-header"
              />
            </ion-avatar>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button
              data-testid="btn-toggle-theme"
              @click="toggleDarkMode"
              >{{ isDarkMode ? "☀️" : "🌙" }}</ion-button
            >
            <ion-button
              :aria-label="t('lang.es')"
              :aria-pressed="isLangEs"
              :title="t('lang.es')"
              :class="{ active: isLangEs }"
              data-testid="btn-lang-es"
              @click="setLang('es')"
              ><img :src="flagEs" alt="Español" class="flag"
            /></ion-button>
            <ion-button
              :aria-label="t('lang.en')"
              :aria-pressed="isLangEn"
              :title="t('lang.en')"
              :class="{ active: isLangEn }"
              data-testid="btn-lang-en"
              @click="setLang('en')"
              ><img :src="flagEn" alt="Inglés" class="flag"
            /></ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- 🔹 CONTENIDO PRINCIPAL -->
      <ion-content id="mensajeria" :fullscreen="true">
        <!-- 🔹 REFRESCO DE LA INFO, SIMILAR AL BOTÓN REFRESCAR -->
        <ion-refresher
          data-testid="refresher"
          slot="fixed"
          @ionRefresh="handleRefresh"
        >
          <ion-refresher-content
            pulling-text="Desliza para recargar"
            refreshing-spinner="circles"
            refreshing-text="Actualizando..."
          />
        </ion-refresher>

        <!-- 🌀 SPINNER DE CARGA -->
        <div
          data-testid="loading-spinner"
          v-if="isLoading"
          class="spinner-container"
        >
          <ion-spinner name="lines-sharp" color="secondary" />
        </div>

        <div v-else>
          <!-- 🧭 VISTA DE LISTADO -->
          <ion-segment v-model="section" scrollable>
            <ion-segment-button data-testid="segment-canales" value="canales">{{
              t("messenger.channels")
            }}</ion-segment-button>
            <ion-segment-button data-testid="segment-grupos" value="grupos">{{
              t("messenger.groups")
            }}</ion-segment-button>
            <ion-segment-button data-testid="segment-privadas" value="privadas"
              >Chats</ion-segment-button
            >
            <ion-segment-button data-testid="segment-docs" value="docs"
              >Docs</ion-segment-button
            >
          </ion-segment>

          <!-- 📁 LISTA SEGÚN SECCIÓN -->
          <ion-list>
            <!-- 🔹 PRIVADAS -->
            <template v-if="section === 'privadas'">
              <ion-item
                data-testid="menu-item"
                v-for="item in menuItems"
                :key="item.id"
                button
                @click="openChat(item.id)"
              >
                <ion-avatar slot="start">
                  <img :src="(item as IPrivateItem).avatar" />
                </ion-avatar>
                <ion-label>
                  <h2>{{ item.name }}</h2>
                </ion-label>
              </ion-item>
            </template>

            <!-- 🔹 CANALES o GRUPOS -->
            <template v-else-if="section === 'canales' || section === 'grupos'">
              <ion-item
                v-for="item in menuItems"
                :key="item.id"
                button
                @click="openChat(item.id)"
                :data-testid="`channel-${item.name
                  ?.toLowerCase()
                  .replace(/\s/g, '-')}`"
              >
                <Icon
                  slot="start"
                  :icon="(item as IChannel).icon || 'mdi:chat'"
                  class="fs-24px"
                />
                <ion-label>
                  <h2>{{ item.name }}</h2>
                  <p>{{ (item as IChannel).description }}</p>
                </ion-label>
              </ion-item>
            </template>

            <!-- 🔹 DOCS -->
            <template v-else>
              <ion-item
                v-for="item in menuItems"
                :key="item.id"
                button
                @click="openChat(item.id)"
              >
                <Icon
                  slot="start"
                  :icon="
                    item.id === selectedId
                      ? 'solar:folder-open-bold'
                      : 'solar:folder-bold'
                  "
                  class="fs-24px text-warning"
                />
                <ion-label>
                  <h2>{{ item.name }}</h2>
                </ion-label>
              </ion-item>
            </template>
          </ion-list>
        </div>
      </ion-content>
    </template>

    <!-- 2️⃣ VISTA CHAT / DOCS (inChat) -->
    <template v-else>
      <!-- Toolbar con botón Atrás y título de la conversación -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="exitChat">
              <ion-icon slot="icon-only" :icon="arrowBackOutline" />
            </ion-button>
          </ion-buttons>
          <ion-title>{{ currentHeaderTitle }}</ion-title>
        </ion-toolbar>

        <!-- Campo de búsqueda dentro del header -->
        <ion-toolbar v-if="section !== 'docs'">
          <ion-item lines="none">
            <ion-input
              v-model="searchTerm"
              placeholder="Buscar en el canal..."
              clear-input
            />
            <ion-icon slot="end" :icon="searchOutline" />
          </ion-item>
        </ion-toolbar>
      </ion-header>

      <!-- Botón para mostrar/ocultar miembros (solo en canales/grupos) -->
      <ion-toolbar v-if="section === 'canales' || section === 'grupos'">
        <ion-button
          expand="block"
          fill="clear"
          @click="openMembersPopover($event)"
        >
          {{
            showMembers
              ? "Ocultar participantes en el canal"
              : "Mostrar participantes en el canal"
          }}
          <ion-icon
            slot="end"
            :icon="showMembers ? chevronUpOutline : chevronDownOutline"
          />
        </ion-button>
      </ion-toolbar>

      <!-- Lista desplegable de miembros -->
      <!-- Popover anclado al botón -->
      <ion-popover
        :is-open="showMembers"
        :event="popoverEvent"
        side="bottom"
        alignment="center"
        @didDismiss="
          () => {
            showMembers = false;
            popoverEvent = null;
          }
        "
        class="showMembersPopover"
      >
        <ion-content>
          <ion-list>
            <ion-item
              v-for="member in chatMembers"
              :key="member.id"
              lines="none"
              @click="openDirectChat(member.id)"
            >
              <ion-avatar slot="start">
                <img :src="member.avatar" />
              </ion-avatar>
              <ion-label>
                <h3>{{ member.name }}</h3>
                <p>{{ member.status }}</p>
              </ion-label>
              <!-- 📨 Icono de email -->
              <ion-button
                slot="end"
                fill="clear"
                class="member-action-btn"
                :href="`mailto:${member.email}`"
                @click.stop
              >
                <ion-icon slot="icon-only" :icon="mailOutline" />
              </ion-button>

              <!-- 📞 Icono de teléfono -->
              <ion-button
                slot="end"
                fill="clear"
                class="member-action-btn"
                :href="`tel:${member.phone}`"
                @click.stop
              >
                <ion-icon slot="icon-only" :icon="callOutline" />
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>

      <ion-content ref="chatContent" :fullscreen="true">
        <!-- 📂 Si estamos en Docs mostramos la lista de archivos -->
        <ion-list v-if="section === 'docs'">
          <ion-item
            v-for="file in fileList"
            :key="file.id"
            button
            @click="download(file.url)"
          >
            <ion-icon slot="start" :icon="documentOutline" />
            <ion-label>{{ file.name }}</ion-label>
          </ion-item>
        </ion-list>

        <!-- 💬 Si no es docs, mostramos los mensajes tipo globo -->
        <div v-if="section !== 'docs'" class="chat-container">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            :class="['chat-item', msg.senderId === 'yo' ? 'sent' : 'received']"
          >
            <!-- Avatar -->
            <ion-avatar
              class="chat-avatar"
              v-if="currentMock.users[msg.senderId]"
            >
              <img :src="currentMock.users[msg.senderId].avatar" />
            </ion-avatar>

            <!-- Burbuja de mensaje -->
            <div class="chat-bubble">
              <div class="bubble-author">
                {{ currentMock.users[msg.senderId]?.name }}
              </div>
              <!-- Si viene archivo -->
              <div class="bubble-content">
                <template v-if="msg.contentKey">
                  {{ t(msg.contentKey) }}
                </template>
                <template v-else-if="msg.fileUrl">
                  <a :href="msg.fileUrl" target="_blank">{{ msg.fileName }}</a>
                </template>
                <template v-else>
                  <span v-html="highlight(msg.content || '')"></span>
                </template>
              </div>
              <div class="bubble-time">{{ msg.timestamp }}</div>
            </div>
          </div>
        </div>
      </ion-content>

      <!-- 📝 INPUT DE MENSAJE -->
      <ion-footer v-if="canWrite && section !== 'docs'">
        <ion-toolbar>
          <ion-item lines="none">
            <!-- Input de texto -->
            <ion-textarea
              data-testid="chat-input"
              v-model="newMessage"
              placeholder="Escribe un mensaje…"
              :auto-grow="true"
              @focus="isTyping = true"
              @blur="isTyping = false"
              @keyup.enter="sendMessage"
              class="flex-grow"
            />
            <ion-button
              data-testid="btn-send-message"
              slot="end"
              fill="clear"
              v-if="isTyping || newMessage.trim()"
              @click="sendMessage"
            >
              <ion-icon :icon="sendOutline" />
            </ion-button>

            <!-- Botón adjuntar cuando NO hay foco -->
            <ion-button
              slot="end"
              fill="clear"
              v-else
              @click="triggerFileSelect"
            >
              <ion-icon :icon="attachOutline" />
            </ion-button>
            <input
              type="file"
              ref="fileInput"
              class="d-none"
              @change="onFileChange"
            />
          </ion-item>
        </ion-toolbar>
      </ion-footer>
    </template>

    <!-- ➕ botón para añadir nuevo canal o grupo -->
    <ion-fab
      v-if="!inChat"
      vertical="bottom"
      horizontal="end"
      slot="fixed"
      class="new-chat-fab"
      @click="showCreate = true"
    >
      <ion-fab-button>
        <ion-icon :icon="addOutline" />
      </ion-fab-button>
    </ion-fab>

    <!-- 
      ═══════════════════════════════════════════════════════════════════
      🧩 Componente: CreateChannelModal
      📌 Modal de creación de nuevo canal
      📦 Props necesarias:
            - visible                 → Maneja la visibilidad del modal
            - :type="section"         → Indica si es un canal o un grupo
      📡 Eventos emitidos:
          - @close                    → Cierra el modal
          - @create                   → Devuelve los datos del formulario para postearlos al backend      
      ═══════════════════════════════════════════════════════════════════
      -->
    <CreateChannelModal
      :visible="showCreate"
      :type="section"
      @close="showCreate = false"
      @create="handleNewItem"
    />

    <!-- Footer común -->
    <AppFooter
      v-if="!inChat"
      :buttons="footerButtons"
      :reset-active="resetFooterActive"
      @action="onFooterAction"
    />
  </ion-page>
</template>

<script setup lang="ts">
// ==============================================================================
// 🔹 VISTA MÓVIL DE MENSAJERÍA
//    💡 Adaptada a:
//       - Uso de useMessengerMock
//       - Traducción con contentKey + t()
//       - Modo oscuro/claro
//       - Soporte de idiomas
//       - Scroll dinámico y DEMO
// ==============================================================================

//─── 📌 Core ──────────────────────────────────────────────────────

import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";
import { useI18n } from "vue-i18n";
// 🌐 Flags
import flagEs from "@/assets/flags/es.png";
import flagEn from "@/assets/flags/en.png";

//─── 📌 Plugins ───────────────────────────────────────────────────

import {
  IonRefresher,
  IonRefresherContent,
  IonContent,
  IonSpinner,
  IonHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonButton,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonPopover,
  popoverController,
  IonAvatar,
  IonLabel,
  IonItem,
  IonList,
  IonInput,
  IonTextarea,
  IonFab,
  IonFabButton,
  IonFooter,
} from "@ionic/vue";
import {
  documentOutline,
  attachOutline,
  arrowBackOutline,
  searchOutline,
  chevronUpOutline,
  chevronDownOutline,
  sendOutline,
  mailOutline,
  callOutline,
  addOutline,
} from "ionicons/icons";
import { Icon } from "@iconify/vue";

//─── 📌 Componentes ──────────────────────────────────────────────
import AppFooter from "@/components/_common/ionic/AppFooter.vue";
import CreateChannelModal from "../components/CreateChannelModal.vue";

//─── 📌 Tipos  e interfaces ─────────────────────────────────────

import type {
  IDocFile,
  IMessage,
  IPrivateConversation,
  IChannel,
  IPrivateItem,
  IDocFolder,
} from "../../../interfaces/IMockMessengerData";

//─── 📌 Stores ──────────────────────────────────────────────────
import { useThemeStore } from "../../../stores/themeStore";
import { storeToRefs } from "pinia";

//─── 📌 Composables ─────────────────────────────────────────────
import { useMessengerMock } from "../../../composables/useMessengerMock";

//─── 📌 Instancias ──────────────────────────────────────────────
const router = useRouter();
const { t, locale } = useI18n();
const currentMock = useMessengerMock();
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

//─── 📌 Variables reactivas ─────────────────────────────────────

// 🔄 estado del spinner
const isLoading = ref<boolean>(true);

// 🔄 demo
const DEMO = true;

// 🔄 modo oscuro
const isDarkMode = computed(() => theme.value === "dark");
const toggleDarkMode = () => themeStore.toggleTheme();

// Datos del usuario logueado
const userName = ref<string>();
const userPic = ref<string>();
const userId = ref<number>();
const currentUser = ref({ id: "yo", roles: ["member"] }); // usuario logueado y roles (mock)
// UI reactivo
const resetFooterActive = ref(false);
const footerButtons = ref([
  {
    key: "back",
    icon: "arrow-back-outline",
    label: "Volver",
    action: "goBack",
  },
  {
    key: "add",
    icon: "checkmark-done-outline",
    label: "Marcar todo como leído",
    action: "add",
    class: "highlight-button add",
  },
  {
    key: "refresh",
    icon: "refresh-outline",
    label: "Refrescar",
    action: "refresh",
  },
]);

// navegación entre lista/chat
const section = ref<"canales" | "grupos" | "privadas" | "docs">("canales");
const selectedId = ref<string>("");
const inChat = ref(false); // modo listado vs chat
const searchTerm = ref<string>(""); // filtro para la lista de usuarios
// mensajes, docs, new message
const messageStore = ref<Record<string, IMessage[]>>({
  ...(currentMock.value?.conversationMessages ?? {}),
});
const newMessage = ref("");
const isTyping = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const showMembers = ref(false); // state para desplegar el acordeón de usuarios del canal
const popoverEvent = ref<Event | null>(null);
const chatContent = ref<any>(null);
const showCreate = ref<boolean>(false); // manejador de visibilidad del modal de creación de canal
const directConversations = ref<IPrivateConversation[]>([
  ...(currentMock.value?.privateConversations ?? []),
]);

//─── 📌 Computeds ───────────────────────────────────────────────

// 🔹 Idioma actual
const isLangEs = computed(() => locale.value === "es");
const isLangEn = computed(() => locale.value === "en");

// 🔹 Permisos de escritura (ejemplo: sólo admins en 'general')
const canWrite = computed(() => {
  return section.value !== "canales" || selectedId.value !== "general"
    ? true
    : currentUser.value.roles.includes("admin");
});

// 🔹 Mapea el valor de section a un título legible
const sectionLabel = computed(() => {
  switch (section.value) {
    case "canales":
      return t("messenger.channels");
    case "grupos":
      return t("messenger.groups");
    case "privadas":
      return t("messenger.private");
    case "docs":
      return "Docs";
    default:
      return "";
  }
});

// 🔹 CurrentHeaderTitle combina sección + nombre
const currentHeaderTitle = computed(() => {
  if (!inChat.value) return "";

  let name = "";
  if (section.value === "docs") {
    name =
      currentMock.value.docFolders.find((f) => f.id === selectedId.value)
        ?.name ?? "";
  } else {
    name = menuItems.value.find((i) => i.id === selectedId.value)?.name ?? "";
  }

  return `${sectionLabel.value} / ${name}`;
});

// 🔹 Carga los chats en cada canal
const menuItems = computed<(IPrivateItem | IChannel | IDocFolder)[]>(() => {
  if (section.value === "privadas") {
    return directConversations.value.map((conv) => {
      const otherId = conv.participants.find(
        (id) => id !== currentUser.value.id
      );
      const user = otherId ? currentMock.value.users[otherId] : null;
      const item: IPrivateItem = {
        id: conv.id,
        name: user?.name ?? "Desconocido",
        avatar: user?.avatar ?? "/assets/img/no-avatar.png",
      };
      return item;
    });
  }

  if (section.value === "canales")
    return currentMock.value.channels.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      description: c.description,
    })) as IChannel[];
  if (section.value === "grupos")
    return currentMock.value.groups.map((g) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      description: g.description,
    })) as IChannel[];
  return currentMock.value.docFolders.map((d) => ({
    id: d.id,
    name: d.name,
  })) as IDocFolder[];
});

// 🔹 Computed que nos da los usuarios del canal/grupo actual
const chatMembers = computed(() => {
  if (section.value === "canales" || section.value === "grupos") {
    return (
      currentMock.value.channelMembers[selectedId.value]?.map(
        (id) => currentMock.value.users[id]
      ) || []
    );
  }
  return [];
});

const messages = computed(() => messageStore.value[selectedId.value] || []);
const fileList = computed<IDocFile[]>(() => {
  const folder = currentMock.value.docFolders.find(
    (f) => f.id === selectedId.value
  );
  return folder?.files || [];
});

// 🔹 Computed filtra por el valor introducido en el campo de búsqueda del input
const filteredMessages = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return messages.value;
  return messages.value.filter((msg) => {
    const text = (msg.content || "").toLowerCase();
    const emoji = (msg.emoji || "").toLowerCase();
    const file = (msg.fileName || "").toLowerCase();
    const author = (
      currentMock.value.users[msg.senderId]?.name || ""
    ).toLowerCase();
    return (
      text.includes(term) ||
      emoji.includes(term) ||
      file.includes(term) ||
      author.includes(term)
    );
  });
});

//─── 📌 Funciones auxiliares ────────────────────────────────────

/**
 * @description – Carga los datos básicos del usuario desde el store de autenticación.
 * @returns {void} – No devuelve nada.
 */
const fetchEmployee = (): void => {
  userPic.value = undefined;
  userName.value = "Nacho Rodríguez";
  userId.value = 1;
};

/**
 * @description – Esta función se activa al hacer clic en un botón del pie de página y realiza la acción correspondiente.
 * @param action – acción a realizar (volver, añadir, refrescar).
 * @returns {void} – No devuelve nada.
 */
const onFooterAction = (action: string): void => {
  resetFooterActive.value = true;
  setTimeout(() => (resetFooterActive.value = false), 300);

  switch (action) {
    case "goBack":
      router.push("/inicio");
      break;
    case "add":
      break;
    case "refresh":
      break;
  }
};

/**
 * Abre el modal para crear nuevo canal o grupo
 */
const handleNewItem = ({ name, description, icon, type }: any) => {
  console.log("data to create", name, description, icon, type);
  // Lógica para POST al backend:
  // POST /api/{type} { name, description, icon }
  // Al recibir la respuesta, actualizar el store/local y cerrar modal
};

/**
 * Abre el popover con la lista de miembros de cada chat
 */
const openMembersPopover = (ev: Event): void => {
  popoverEvent.value = ev;
  showMembers.value = true;
};

/**
 * Abre o crea un chat privado con `memberId`
 */
async function openDirectChat(memberId: string) {
  await popoverController.dismiss().catch(() => {});
  showMembers.value = false;

  let conv = currentMock.value.privateConversations.find(
    (c) => c.participants.includes("yo") && c.participants.includes(memberId)
  );

  if (!conv) {
    const newId = `chat-${memberId}-${Date.now()}`;
    conv = { id: newId, participants: ["yo", memberId] };
    currentMock.value.privateConversations.push(conv);
    messageStore.value[newId] = [];
  }

  section.value = "privadas";
  selectedId.value = conv.id;
  inChat.value = true;
}

/**
 * Envía un mensaje al chat
 */
function sendMessage() {
  if (!newMessage.value.trim()) return;
  const ts = new Date().toLocaleTimeString(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const conv = (messageStore.value[selectedId.value] ||= []);
  conv.push({
    id: `${Date.now()}`,
    senderId: "yo",
    content: newMessage.value,
    timestamp: ts,
  });
  newMessage.value = "";
}

/**
 * Abre el diálogo de selección de archivos.
 */
const triggerFileSelect = (): void => {
  fileInput.value?.click();
};

/**
 * Maneja la selección de un archivo:
 * - Crea una URL temporal
 * - Genera timestamp
 * - Inserta un mensaje con fileUrl y fileName
 */
const onFileChange = (e: Event): void => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const file = input.files[0];
  const url = URL.createObjectURL(file);
  const ts = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // se asegura de que exista el array
  const conv = (messageStore.value[selectedId.value] ||= []);
  conv.push({
    id: `${Date.now()}`,
    senderId: "yo",
    content: "",
    timestamp: ts,
    fileUrl: url,
    fileName: file.name,
  });
  // limpia el input para poder volver a usarlo
  input.value = "";
};

/**
 * Maneja la selección apertura de un archivo enviado al chat
 */
const download = (url: string): void => {
  window.open(url, "_blank");
};

/**
 * Abre un chat/carpeta:
 * - fija el ID seleccionado
 * - pasa a modo inChat
 */
const openChat = (id: string): void => {
  selectedId.value = id;
  inChat.value = true;
};

/** Sale del chat y vuelve al listado */
const exitChat = (): void => {
  fetchEmployee();
  inChat.value = false;
};

/** Elimina todos los caracteres que tienen significado especial dentro de una expresión regular,
 * de modo que el texto resultante pueda insertarse literalmente en un new RegExp(...)
 * sin que esos caracteres rompan o alteren el patrón.
 * */
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/** Resalta el texto del resultado de la búsqueda en amarillo (por defecto el mark lo hace ya asi) */
const highlight = (text: string): string => {
  const term = searchTerm.value.trim();
  if (!term) return text;
  const escaped = escapeRegExp(term);
  const re = new RegExp(`(${escaped})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
};

// Idioma actual
function setLang(lang: string) {
  locale.value = lang;
  localStorage.setItem("lang", lang);
}

// Modo oscuro
/* function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  const cls = document.body.classList;
  if (isDarkMode.value) {
    cls.add("theme-dark");
    cls.remove("theme-light");
    localStorage.setItem("theme", "dark");
  } else {
    cls.add("theme-light");
    cls.remove("theme-dark");
    localStorage.setItem("theme", "light");
  }
} */

// función reutilizable de scroll
const scrollToBottom = async (): Promise<void> => {
  if (!chatContent.value) return;
  const ionEl: any = chatContent.value.el || chatContent.value.$el;
  const scrollEl = await ionEl.getScrollElement();
  scrollEl.scrollTop = scrollEl.scrollHeight;
};

/**
 * @description – Esta función se activa al deslizar hacia abajo en la página y recarga los datos de gastos.
 * @param event – evento de solicitud de recarga de página.
 * @returns {Promise<void>} – Promesa que se resuelve cuando se completa la recarga.
 */
const handleRefresh = async (event: CustomEvent): Promise<void> => {
  console.log("refresh de la carga de la página");
  (event.target as HTMLIonRefresherElement).complete();
};

//─── 📌 Watchers ────────────────────────────────────────────────

// Al llegar mensajes nuevos, scroll final
watch(
  messages,
  async () => {
    await nextTick();
    await scrollToBottom();
  },
  { flush: "post", deep: true }
);

// Al abrir un chat (inChat pasa a true) o cambias de canal
watch(
  () => [inChat.value, selectedId.value],
  async ([nowInChat]) => {
    if (nowInChat) {
      // esperar a que el template renderice la lista de mensajes
      await nextTick();
      await scrollToBottom();
    }
  }
);

// 🔄 Localización dinámica de mensajes
watch(locale, () => {
  const updated = currentMock.value.conversationMessages;
  for (const id in updated) {
    if (messageStore.value[id]) {
      messageStore.value[id] = messageStore.value[id].map((msg) => {
        const updatedMsg = updated[id].find((m) => m.id === msg.id);
        return updatedMsg ? { ...msg, content: updatedMsg.content } : msg;
      });
    } else {
      messageStore.value[id] = [...updated[id]];
    }
  }
});

//─── 📌 Ciclo de vida ───────────────────────────────────────────

onMounted(async () => {
  if (currentMock.value?.channels?.length) {
    selectedId.value = currentMock.value.channels[0].id;
  }

  fetchEmployee();

  const saved = localStorage.getItem("theme");
  if (saved === "dark") toggleDarkMode();
  themeStore.applyTheme();

  isLoading.value = false;

  await nextTick();
  await scrollToBottom();
  App.addListener("backButton", () => {
    // Deshabilita la acción por defecto del back button
  });

  if (DEMO) {
    setInterval(() => {
      if (section.value === "docs") return;

      const id = selectedId.value;
      let validUserIds: string[] = [];

      if (section.value === "canales" || section.value === "grupos") {
        validUserIds =
          currentMock.value.channelMembers[id]?.filter((u) => u !== "yo") || [];
      } else if (section.value === "privadas") {
        const conv = currentMock.value.privateConversations.find(
          (c) => c.id === id
        );
        validUserIds = conv?.participants.filter((u) => u !== "yo") || [];
      }

      const senderId =
        validUserIds[Math.floor(Math.random() * validUserIds.length)];
      const user = currentMock.value.users[senderId];
      if (!user) return;

      const contentKey = "messenger.demoMessages.demo-1"; // simplificado
      const ts = new Date().toLocaleTimeString(locale.value, {
        hour: "2-digit",
        minute: "2-digit",
      });

      const conv = (messageStore.value[id] ||= []);
      conv.push({
        id: `${Date.now()}`,
        senderId,
        contentKey,
        timestamp: ts,
      });
    }, 5000);
  }
});
</script>
<style>
.theme-dark {
  --ion-background-color: #121212;
  --ion-text-color: #ffffff;
  background-color: var(--ion-background-color);
  color: var(--ion-text-color);
}

/* Todos los botones en modo oscuro → texto gris claro */
.theme-dark ion-segment-button::part(native) {
  color: #a8a8a8;
}

/* Excepto el botón activo → color por defecto (blanco, primario, etc.) */
.theme-dark ion-segment-button.segment-button-checked::part(native) {
  color: var(--ion-color-primary); /* o blanco: #fff */
  font-weight: bold;
}

.theme-light {
  --ion-background-color: #ffffff;
  --ion-text-color: #000000;
  background-color: var(--ion-background-color);
  color: var(--ion-text-color);
}
</style>

<style scoped lang="scss">
/* ─── 📌 Layout general de la vista ───────────────────────────────── */
// Clase para centrar el spinner vertical y horizontalmente
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Avatar del usuario en el header */
.avatar-header {
  width: 40px;
  height: 40px;
  margin-top: 0.8rem;
}

/* Banderas de cambio de isioma en el header */
.flag {
  width: 25px;
  height: 25px;
}

/* Popover de miembros de los canales y grupos */
.showMembersPopover {
  --width: 300px;
  --max-height: 400px;
}
.member-action-btn {
  /* reduce el padding por defecto */
  --padding-start: 4px;
  --padding-end: 4px;
  /* añade un pequeño margen lateral */
  margin-left: 4px;
  margin-right: 0px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.75rem;
}

/* Cada fila de mensaje */
.chat-item {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

/* Avatar junto a la burbuja */
.chat-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

/* Mensajes propios: avatar a la derecha */
.chat-item.sent {
  flex-direction: row-reverse;
}

/* Burbuja genérica */
.chat-bubble {
  max-width: 70%;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  position: relative;
  word-break: break-word;
}

/* Flecha/cola de burbuja */
.chat-item.sent .chat-bubble::after,
.chat-item.received .chat-bubble::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}
.chat-item.sent .chat-bubble::after {
  right: -16px;
  border-left-color: var(--ion-color-primary);
}
.chat-item.received .chat-bubble::after {
  left: -16px;
  border-right-color: var(--ion-color-light);
}

/* Autor encima del mensaje */
.bubble-author {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

/* Contenido */
.bubble-content {
  white-space: pre-wrap;
}

/* color del texto del nombre del enlace de los archivos subidos al chat */
.fileUpload-text {
  color: white;
}
/* Hora en pequeño */
.bubble-time {
  font-size: 0.65rem;
  opacity: 0.6;
  text-align: right;
  margin-top: 0.25rem;
}

/* Estilos específicos para enviados y recibidos */
.chat-item.sent .chat-bubble {
  background: var(--ion-color-secondary);
  color: #fff;
  border-bottom-right-radius: 0;
}

.chat-item.received .chat-bubble {
  background: var(--ion-color-light);
  color: var(--ion-color-dark);
  border-bottom-left-radius: 0;
}

.new-chat-fab {
  bottom: calc(var(--ion-safe-area-bottom) + 70px);
}

.text-theme {
  color: var(--ion-color-theme);
}

ion-fab-button {
  --background: #00acac;
  --background-hover: #00acac;
  --background-activated: #00acac;
  --background-focused: #00acac;
}
</style>
