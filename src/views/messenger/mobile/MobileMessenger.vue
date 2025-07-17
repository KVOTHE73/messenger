<template>
  <ion-page id="mobileMessenger">
    <!-- 1️⃣ VISTA LISTADO (no inChat) -->
    <template v-if="!inChat">
      <!-- Menú y Header principales -->
      <AppSideMenu appName="mensajeria" />
      <AppHeader
        appName="SofyMensajería"
        :userName="userName"
        :userPic="userPic"
      />

      <ion-content id="mensajeria" :fullscreen="true">
        <!-- 🔹 REFRESCO DE LA INFO, SIMILAR AL BOTÓN REFRESCAR -->
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
          <ion-refresher-content
            pulling-text="Desliza para recargar"
            refreshing-spinner="circles"
            refreshing-text="Actualizando..."
          />
        </ion-refresher>

        <!-- 🔹 SPINNER DE CARGA -->
        <div v-if="isLoading" class="spinner-container">
          <ion-spinner name="lines-sharp" color="secondary" />
        </div>

        <div v-else>
          <!-- Segment control -->
          <ion-segment v-model="section" scrollable>
            <ion-segment-button value="canales">Canales</ion-segment-button>
            <ion-segment-button value="grupos">Grupos</ion-segment-button>
            <ion-segment-button value="privadas">Chats</ion-segment-button>
            <ion-segment-button value="docs">Docs</ion-segment-button>
          </ion-segment>

          <!-- Lista de items según sección -->
          <!-- Si estamos en Docs, mostramos carpetas -->
          <template v-if="section === 'docs'">
            <ion-item
              v-for="folder in menuItems"
              :key="folder.id"
              button
              @click="openChat(folder.id)"
            >
              <Icon
                slot="start"
                :icon="
                  folder.id === selectedId
                    ? 'solar:folder-open-bold'
                    : 'solar:folder-bold'
                "
                class="fs-24px text-warning"
              />
              <ion-label>
                <h2>{{ folder.name }}</h2>
              </ion-label>
            </ion-item>
          </template>

          <!-- En los demás casos -->
          <template v-else>
            <ion-item
              v-for="item in menuItems"
              :key="item.id"
              button
              @click="openChat(item.id)"
            >
              <ion-avatar slot="start" v-if="section === 'privadas'">
                <img :src="item.avatar" />
              </ion-avatar>
              <Icon
                slot="start"
                v-else
                :icon="item.icon"
                class="fs-24px text-theme"
              />
              <ion-label>
                <h2>{{ item.name }}</h2>
                <p>{{ item.description }}</p>
              </ion-label>
            </ion-item>
          </template>
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
            <ion-avatar class="chat-avatar" v-if="users[msg.senderId]">
              <img :src="users[msg.senderId].avatar" />
            </ion-avatar>

            <!-- Burbuja de mensaje -->
            <div class="chat-bubble">
              <div class="bubble-author">{{ users[msg.senderId].name }}</div>
              <!-- Si viene archivo -->
              <div v-if="msg.fileUrl" class="bubble-content">
                <a
                  :href="msg.fileUrl"
                  class="fileUpload-text"
                  target="_blank"
                  v-html="highlight(msg.fileName || '')"
                ></a>
              </div>
              <!-- Si viene texto -->
              <div
                v-else
                class="bubble-content"
                v-html="highlight(msg.content || '')"
              ></div>
              <div class="bubble-time">{{ msg.timestamp }}</div>
            </div>
          </div>
        </div>
      </ion-content>

      <!-- Input Bar -->
      <ion-footer v-if="canWrite && section !== 'docs'">
        <ion-toolbar>
          <ion-item lines="none">
            <!-- Input de texto -->
            <ion-textarea
              v-model="newMessage"
              placeholder="Escribe un mensaje…"
              :auto-grow="true"
              @focus="isTyping = true"
              @blur="isTyping = false"
              @keyup.enter="sendMessage"
              class="flex-grow"
            />
            <ion-button
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

    <!-- botón para añadir nuevo canal o grupo -->
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
//─── 📌 Core ──────────────────────────────────────────────────────

import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app";

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

import AppSideMenu from "@/components/_common/ionic/AppSideMenu.vue";
import AppHeader from "@/components/_common/ionic/AppHeader.vue";
import AppFooter from "@/components/_common/ionic/AppFooter.vue";
import CreateChannelModal from "../components/CreateChannelModal.vue";

//─── 📌 Tipos  e interfaces ─────────────────────────────────────

import type {
  IDocFile,
  IMessage,
  IPrivateConversation,
} from "../../../interfaces/IMockMessengerData";

//─── 📌 Stores ───────────────────────────────────────────────────
/* import {
  channels,
  groups,
  privateConversations,
  docFolders,
  users,
  channelMembers,
  conversationMessages,
} from "../../../stores/mocks/mockMessengerDataEn"; // mock de datos */

// Estado de la vista y stores
const router = useRouter();

//─── 📌 Variables reactivas ─────────────────────────────────────

// estado del spinner
const isLoading = ref<boolean>(true);
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
const selectedId = ref<string>(channels[0].id);
const inChat = ref(false); // modo listado vs chat
const searchTerm = ref<string>(""); // filtro para la lista de usuarios
// convierte el mock en algo reactivo
const directConversations = ref<IPrivateConversation[]>([
  ...privateConversations,
]);
// mensajes, docs, new message
const messageStore = ref(conversationMessages);
const newMessage = ref("");
const isTyping = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const showMembers = ref(false); // state para desplegar el acordeón de usuarios del canal
const popoverEvent = ref<Event | null>(null);
const chatContent = ref<any>(null);
const showCreate = ref<boolean>(false); // manejador de visibilidad del modal de creación de canal

//─── 📌 Computeds ───────────────────────────────────────────────

// 🔹 Permisos de escritura (ejemplo: sólo admins en 'general')
const canWrite = computed(() => {
  if (section.value === "canales" && selectedId.value === "general") {
    return currentUser.value.roles.includes("admin");
  }
  return true;
});

// 🔹 Mapea el valor de section a un título legible
const sectionLabel = computed(() => {
  switch (section.value) {
    case "canales":
      return "Canales";
    case "grupos":
      return "Grupos";
    case "privadas":
      return "Chats";
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
    name = docFolders.find((f) => f.id === selectedId.value)?.name ?? "";
  } else {
    name = menuItems.value.find((i) => i.id === selectedId.value)?.name ?? "";
  }

  return `${sectionLabel.value}/${name}`;
});

// 🔹 Carga los chats en cada canal
const menuItems = computed<any[]>(() => {
  if (section.value === "canales") return channels;
  if (section.value === "grupos") return groups;
  if (section.value === "privadas")
    return directConversations.value.map((conv) => {
      // Intento de encontrar al otro participante
      const otherId = conv.participants.find(
        (id) => id !== currentUser.value.id
      );
      if (!otherId) {
        console.warn(`Conversación ${conv.id} sin otro participante`);
        // Devuelvo un fallback para que no rompa el render
        return {
          id: conv.id,
          avatar: "/assets/img/no-avatar.png",
          name: "Desconocido",
        };
      }
      const u = users[otherId];
      if (!u) {
        console.warn(`No hay datos de usuario para el id "${otherId}"`);
        return {
          id: conv.id,
          avatar: "/assets/img/no-avatar.png",
          name: "Desconocido",
        };
      }
      // Ahora que sé que otherId es string y users[otherId] existe, TS me deja indexar
      return {
        id: conv.id,
        avatar: u.avatar,
        name: u.name,
      };
    });
  return docFolders;
});

// 🔹 Computed que nos da los usuarios del canal/grupo actual
const chatMembers = computed(() => {
  if (section.value === "canales" || section.value === "grupos") {
    return channelMembers[selectedId.value].map((id) => users[id]);
  }
  return [];
});

const messages = computed<IMessage[]>(
  () => messageStore.value[selectedId.value] || []
);
const fileList = computed<IDocFile[]>(() => {
  const f = docFolders.find((f) => f.id === selectedId.value);
  return f ? f.files : [];
});

// 🔹 Computed filtra por el valor introducido en el campo de búsqueda del input
const filteredMessages = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return messages.value;
  return messages.value.filter((msg) => {
    // todo en minúsculas para comparar
    const text = (msg.content || "").toLowerCase();
    const emoji = (msg.emoji || "").toLowerCase();
    const file = (msg.fileName || "").toLowerCase();
    const author = (users[msg.senderId]?.name || "").toLowerCase();
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
const openDirectChat = async (memberId: string): Promise<void> => {
  // 1️⃣ Cierra el popover de miembros para que Ionic desmont
  await popoverController.dismiss().catch(() => {});
  showMembers.value = false;

  // 2️⃣ Ahora puedes buscar o crear la conversación
  let conv = directConversations.value.find(
    (c) => c.participants.includes("yo") && c.participants.includes(memberId)
  );
  if (!conv) {
    const newId = `chat-${memberId}-${Date.now()}`;
    conv = { id: newId, participants: ["yo", memberId] };
    directConversations.value.push(conv);
    messageStore.value[newId] = [];
  }

  // 3️⃣ Navega al chat
  section.value = "privadas";
  selectedId.value = conv.id;
  inChat.value = true;
};

/**
 * Envía un mensaje al chat
 */
const sendMessage = (): void => {
  if (!newMessage.value.trim()) return;
  const ts = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const conv = (messageStore.value[selectedId.value] ||= []);
  conv.push({
    id: `${Date.now()}`,
    senderId: "yo",
    content: newMessage.value,
    timestamp: ts,
  });
  newMessage.value = "";
};

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

//─── 📌 Ciclo de vida ───────────────────────────────────────────

onMounted(async () => {
  fetchEmployee();
  isLoading.value = false;

  await nextTick();
  await scrollToBottom();
  App.addListener("backButton", () => {
    // Deshabilita la acción por defecto del back button
  });
});
</script>

<style scoped lang="scss">
/* ─── 📌 Layout general de la vista ───────────────────────────────── */
// Clase para centrar el spinner vertical y horizontalmente
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
