<template>
  <!--
  ===================================================================================================================================================
  🔷 VISTA DE ESCRITORIO DE MENSAJERIA
      💡 esta vista gestiona lo siguiente:
          🔶 Permite crear un nuevo canal si se está autorizado para ello
          🔶 Muestra los canales, grupos, chats y docs a los que pertenece el usuario logueado
          🔶 Permite al usuario leer y escribir mensajes en los canales para los que tiene permiso, así como ver y descargar sus docs
  ===================================================================================================================================================
  -->
  <div class="messenger" id="messenger">
    <!-- 📌 Menú lateral con la imagen del usuario logueado y los canales, grupos, chats y docs -->
    <div class="messenger-menu">
      <!-- 🔹 Imagen del usuario -->
      <div class="messenger-menu-item my-2">
        <a
          href="#"
          @click.prevent
          class="messenger-menu-link"
          title="Usuario: Nacho Rodríguez"
        >
          <div class="m-n1">
            <img
              alt="avatar"
              src="/assets/img/user/user-8.jpg"
              class="w-100 d-block rounded-circle"
            />
          </div>
        </a>
      </div>

      <!-- 🔹 Canales -->
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="messenger-menu-item text-center my-2"
        :class="{ active: section === 'canales' && item.id === selectedId }"
        @click="
          () => {
            section = 'canales';
            selectedId = item.id;
          }
        "
        v-if="section === 'canales'"
      >
        <a
          href="#"
          @click.prevent
          class="messenger-menu-link"
          :title="item.description"
        >
          <Icon :icon="item.icon || 'mdi:chat'" class="iconify fs-30px" />
          <p class="menu-label">{{ item.name }}</p>
        </a>
      </div>

      <!-- 🔹 Grupos -->
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="messenger-menu-item text-center my-2"
        :class="{ active: section === 'grupos' && item.id === selectedId }"
        @click="
          () => {
            section = 'grupos';
            selectedId = item.id;
          }
        "
        v-if="section === 'grupos'"
      >
        <a
          href="#"
          @click.prevent
          class="messenger-menu-link"
          :title="item.description"
        >
          <Icon
            :icon="item.icon || 'mdi:account-group'"
            class="iconify fs-30px"
          />
          <p class="menu-label">{{ item.name }}</p>
        </a>
      </div>

      <!-- 🔹 Chats privados -->
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="messenger-menu-item text-center my-2"
        :class="{ active: section === 'privadas' && item.id === selectedId }"
        @click="
          () => {
            section = 'privadas';
            selectedId = item.id;
          }
        "
        v-if="section === 'privadas'"
      >
        <a
          href="#"
          @click.prevent
          class="messenger-menu-link"
          :title="item.name"
        >
          <img :src="item.avatar || ''" class="w-100 d-block rounded-circle" />
          <p class="menu-label">{{ item.name }}</p>
        </a>
      </div>

      <!-- 🔹 Selector de sección -->
      <div class="mt-auto mb-5 text-center text-muted small">
        <button
          data-testid="btn-section-canales"
          @click="section = 'canales'"
          :class="['btn btn-sm', { active: section === 'canales' }]"
        >
          {{ t("messenger.channels") }}
        </button>
        <button
          data-testid="btn-section-grupos"
          @click="section = 'grupos'"
          :class="['btn btn-sm', { active: section === 'grupos' }]"
        >
          {{ t("messenger.groups") }}
        </button>
        <button
          data-testid="btn-section-privadas"
          @click="section = 'privadas'"
          :class="['btn btn-sm', { active: section === 'privadas' }]"
        >
          Chats
        </button>
        <button
          data-testid="btn-section-docs"
          @click="section = 'docs'"
          :class="['btn btn-sm', { active: section === 'docs' }]"
        >
          Docs
        </button>
      </div>
    </div>

    <!-- 📌 Columna intermedia con búsqueda y listado -->
    <div class="messenger-chat">
      <div class="messenger-chat-header d-flex">
        <div class="flex-1 position-relative">
          <input
            type="text"
            class="form-control border-0 ps-30px"
            :placeholder="t('messenger.searchPlaceholder')"
          />
          <i
            class="fa fa-search position-absolute start-0 top-0 h-100 ps-2 ms-3px d-flex align-items-center justify-content-center"
          ></i>
        </div>

        <!-- Botón crear nuevo canal / grupo -->
        <div class="ps-2">
          <a
            href="#"
            class="btn border-0 shadow-none"
            @click="showCreate = true"
          >
            <i class="fa fa-plus"></i>
          </a>
        </div>
      </div>

      <!-- 🧩 Modal creación canal/grupo -->
      <CreateChannelModal
        :visible="showCreate"
        :type="section"
        @close="showCreate = false"
        @create="handleNewItem"
      />

      <!-- 🔹 Lista de carpetas (docs) o usuarios (chats) -->
      <div class="messenger-chat-body">
        <perfect-scrollbar class="h-100">
          <div class="messenger-chat-list">
            <!-- DOCS -->
            <template v-if="section === 'docs'">
              <div
                v-for="folder in chatList"
                :key="folder.id"
                class="messenger-chat-item"
              >
                <a
                  href="javascript:;"
                  class="messenger-chat-link"
                  :data-testid="'folder-' + folder.name"
                  @click="selectedId = folder.id"
                >
                  <div class="messenger-chat-media">
                    <Icon
                      :icon="
                        folder.id === selectedId
                          ? 'solar:folder-open-bold'
                          : 'solar:folder-bold'
                      "
                      class="fs-24px text-warning"
                    />
                  </div>
                  <div class="messenger-chat-content">
                    <div class="messenger-chat-title">{{ folder.name }}</div>
                  </div>
                </a>
              </div>
            </template>

            <!-- en otros casos: lista de usuarios -->
            <template v-else>
              <div
                v-for="user in chatList"
                :key="user.id"
                class="messenger-chat-item"
              >
                <a href="javascript:;" class="messenger-chat-link">
                  <div class="messenger-chat-media">
                    <img :src="(user as IUser).avatar" alt="" />
                  </div>
                  <div class="messenger-chat-content">
                    <div class="messenger-chat-title">
                      <div>{{ (user as IUser).name }}</div>
                      <div class="messenger-chat-time">--:--</div>
                    </div>
                    <div class="messenger-chat-desc">
                      {{ (user as IUser).status || "" }}
                    </div>
                  </div>
                </a>
              </div>
            </template>
          </div>
        </perfect-scrollbar>
      </div>
    </div>

    <!-- 🔹 Chat e input -->
    <div class="messenger-content">
      <div class="widget-chat">
        <div class="widget-chat-header">
          <div class="d-block d-lg-none">
            <button
              type="button"
              class="btn border-0 shadow-none"
              data-toggle-class="messenger-chat-content-mobile-toggled"
              data-target="#messenger"
            >
              <i class="fa fa-chevron-left fa-lg"></i>
            </button>
          </div>

          <!-- Nombre del chat o la carpeta -->
          <div class="widget-chat-header-content">
            <div class="fs-5 fw-bold header-text">
              {{
                section === "docs"
                  ? currentMock.docFolders.find((f) => f.id === selectedId)
                      ?.name
                  : menuItems.find((i) => i.id === selectedId)?.description
              }}
            </div>
          </div>

          <!-- Dropdown de acciones -->
          <div>
            <button
              type="button"
              class="btn border-0 shadow-none"
              data-bs-toggle="dropdown"
            >
              <i class="fa fa-ellipsis fa-lg"></i>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#" @click.prevent>{{
                  t("messenger.dropdownMenu.action")
                }}</a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent>{{
                  t("messenger.dropdownMenu.otherAction")
                }}</a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent>{{
                  t("messenger.dropdownMenu.somethingMore")
                }}</a>
              </li>
            </ul>
          </div>
          <!-- Selectores de tema y de idioma -->
          <div class="flags-container">
            <div class="lang-theme-switch text-start ms-3 mb-2 mt-2">
              <!-- 🌙 Cambio modo oscuro / claro -->
              <button
                type="button"
                class="theme-toggle-btn"
                @click="toggleDarkMode"
                :aria-label="isDarkMode ? 'Modo claro' : 'Modo oscuro'"
                :title="isDarkMode ? 'Modo claro' : 'Modo oscuro'"
                data-testid="btn-toggle-theme"
              >
                {{ isDarkMode ? "☀️" : "🌙" }}
              </button>

              <!-- 🌐 Selector de idioma -->
              <button
                @click="setLang('es')"
                :aria-label="t('lang.es')"
                :aria-pressed="isLangEs"
                :title="t('lang.es')"
                :class="{ active: isLangEs }"
                data-testid="btn-lang-es"
              >
                <img :src="flagEs" alt="Español" class="flag" />
              </button>
              <button
                @click="setLang('en')"
                :aria-label="t('lang.en')"
                :aria-pressed="isLangEn"
                :title="t('lang.en')"
                :class="{ active: isLangEn }"
                data-testid="btn-lang-en"
              >
                <img :src="flagEn" alt="English" class="flag" />
              </button>
            </div>
          </div>
        </div>

        <!-- 🔹 Ventana de mensajes o archivos e input de escritura -->
        <perfect-scrollbar ref="scrollRef" class="widget-chat-body">
          <!-- si Docs: listamos fileList -->
          <template v-if="section === 'docs'">
            <ul class="list-group">
              <li
                v-for="file in fileList"
                :key="file.id"
                class="list-group-item d-flex align-items-center"
                :data-testid="'file-' + file.name"
              >
                <Icon
                  icon="solar:document-bold"
                  class="fs-24px me-2 text-secondary"
                />
                <a :href="file.url" target="_blank">{{ file.name }}</a>
              </li>
            </ul>
          </template>

          <!-- si no, mensajes -->
          <template v-else>
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="[
                'widget-chat-item with-media',
                { end: msg.senderId === 'yo', start: msg.senderId !== 'yo' },
              ]"
            >
              <div class="widget-chat-media">
                <img
                  :src="
                    currentMock.users[msg.senderId]?.avatar ||
                    '/assets/img/default-avatar.jpg'
                  "
                  alt="avatar"
                />
              </div>
              <div class="widget-chat-info">
                <div class="widget-chat-info-container">
                  <div
                    v-if="msg.senderId !== 'yo'"
                    class="widget-chat-name"
                    :class="{
                      'text-blue': msg.senderId === 'daniel',
                      'text-indigo': msg.senderId === 'maría',
                      'text-cyan': msg.senderId === 'pedro',
                    }"
                  >
                    {{ currentMock.users[msg.senderId].name }}
                  </div>
                  <div v-if="msg.emoji" class="widget-chat-message">
                    {{ msg.emoji }}
                  </div>
                  <div v-else-if="msg.fileUrl" class="widget-chat-message">
                    <a :href="msg.fileUrl" target="_blank">{{
                      msg.fileName
                    }}</a>
                  </div>
                  <div v-else class="widget-chat-message">
                    {{ msg.contentKey ? t(msg.contentKey) : msg.content }}
                  </div>
                  <div class="widget-chat-time">{{ msg.timestamp }}</div>
                </div>
              </div>
            </div>
          </template>
        </perfect-scrollbar>

        <!-- 🔹 Input de escritura, si no estamos en docs -->
        <div v-if="canWrite && section !== 'docs'" class="widget-chat-input">
          <div
            class="widget-chat-toolbar d-flex align-items-center position-relative"
          >
            <a
              href="#"
              class="widget-chat-toolbar-link"
              @click.prevent="toggleEmojiPicker"
            >
              <Icon class="iconify fs-26px" icon="solar:smile-circle-outline" />
            </a>
            <transition name="fade">
              <div v-if="showEmojiPicker" class="emoji-picker-bubble">
                <emoji-picker locale="es" @emoji-click="onEmojiSelect" />
              </div>
            </transition>
            <a
              href="#"
              class="widget-chat-toolbar-link ms-3"
              @focus="showEmojiPicker = false"
              @click.prevent="triggerFileSelect"
            >
              <Icon
                class="iconify fs-26px"
                icon="solar:folder-with-files-outline"
              />
            </a>
            <input
              ref="fileInputRef"
              type="file"
              class="d-none"
              @change="onFileChange"
            />
            <!-- otros botones -->
            <a
              href="#"
              class="widget-chat-toolbar-link ms-auto"
              @focus="showEmojiPicker = false"
            >
              <Icon
                class="iconify fs-26px"
                icon="solar:phone-calling-outline"
              />
            </a>
            <a
              href="#"
              @click.prevent
              class="widget-chat-toolbar-link"
              @focus="showEmojiPicker = false"
            >
              <Icon
                class="iconify fs-26px"
                icon="solar:videocamera-record-outline"
              />
            </a>
          </div>

          <!-- 📝 Campo de entrada + botones flotantes -->
          <div class="position-relative">
            <textarea
              data-testid="chat-input"
              v-model="newMessage"
              @keydown.enter.prevent="sendMessage"
              @focus="showEmojiPicker = false"
              class="form-control pe-5"
              :placeholder="t('messenger.textareaPlaceholder')"
            />

            <!-- Botón borrar -->
            <button
              v-if="newMessage.trim()"
              @click="
                newMessage = '';
                showEmojiPicker = false;
              "
              class="btn btn-sm btn-danger position-absolute me-1"
              style="top: 8px; right: 40px"
              title="Borrar mensaje"
            >
              <Icon icon="mdi:close" class="fs-18px" />
            </button>

            <!-- Botón enviar -->
            <button
              v-if="newMessage.trim()"
              @click="sendMessage"
              class="btn btn-sm btn-primary position-absolute"
              style="top: 8px; right: 4px"
              title="Enviar"
              data-testid="btn-send-message"
            >
              <Icon icon="mdi:send" class="fs-18px" />
            </button>
          </div>
        </div>

        <!-- si no se tiene permiso para escribir se deshabilita -->
        <div
          v-if="!canWrite && section !== 'docs'"
          class="widget-chat-input disabled"
        >
          <textarea
            disabled
            class="form-control"
            :placeholder="t('messenger.noPermissionsPlaceholder')"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 🔹 Emoji Picker Modal -->
  <div
    v-if="showEmojiPicker"
    class="emoji-picker-modal-overlay"
    @click="toggleEmojiPicker"
  >
    <div class="emoji-picker-bubble" @click.stop>
      <emoji-picker locale="es" @emoji-click="onEmojiSelect"></emoji-picker>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==============================================================================
// 🔹 VISTA DE MENSAJERÍA: Script principal
//    💡 Este bloque gestiona:
//       - Datos mock localizados (es/en) vía useMessengerMock
//       - Estados y acciones del chat
//       - Mensajería reactiva, archivos, emojis, permisos y scroll
// ==============================================================================

// ⛳ Imports
import {
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useI18n } from "vue-i18n";
import { Icon } from "@iconify/vue";
import "emoji-picker-element";
import CreateChannelModal from "../components/CreateChannelModal.vue";
import { useMessengerMock } from "../../../composables/useMessengerMock";
import type { ComponentPublicInstance } from "vue";
import type {
  IMessage,
  IDocFile,
  IUser,
} from "../../../interfaces/IMockMessengerData";
interface IMenuItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  avatar?: string;
}

// 🌐 Flags
import flagEs from "@/assets/flags/es.png";
import flagEn from "@/assets/flags/en.png";

// ✅ Modo demo activo para portfolio
const DEMO = true;

// ⛳ Props & Emits → (ninguno en esta vista)

// ⛳ Refs y estados reactivos
const isDarkMode = ref<boolean>(false);
const { t, locale } = useI18n();
const currentMock = useMessengerMock();

const currentUser = ref({ id: "yo", roles: ["member"] });
const showCreate = ref(false);
const section = ref<"canales" | "grupos" | "privadas" | "docs">("canales");
const selectedId = ref<string>(currentMock.value.channels[0]?.id || "");
const scrollRef = ref<ComponentPublicInstance | null>(null);
const newMessage = ref("");
const showEmojiPicker = ref(false);
const fileInputRef = ref<HTMLInputElement>();

// 📁 Estado general de mensajes (reactivo al idioma)
const messageStore = reactive<Record<string, IMessage[]>>({
  ...currentMock.value.conversationMessages,
});

// 🧮 Computeds

// 🌍 Idioma activo
const isLangEs = computed(() => locale.value === "es");
const isLangEn = computed(() => locale.value === "en");

// 🧩 Permisos
const canWrite = computed(() => {
  return section.value !== "canales" || selectedId.value !== "general"
    ? true
    : currentUser.value.roles.includes("admin");
});

// 🧩 Menú lateral según sección
const menuItems = computed<IMenuItem[]>(() => {
  if (section.value === "canales") {
    return currentMock.value.channels.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
    }));
  }

  if (section.value === "grupos") {
    return currentMock.value.groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      icon: g.icon,
    }));
  }

  if (section.value === "privadas") {
    return currentMock.value.privateConversations.map((conv) => {
      const other = conv.participants.find((id) => id !== "yo")!;
      const user = currentMock.value.users[other];
      return {
        id: conv.id,
        name: user.name,
        avatar: user.avatar,
        description: user.name,
      };
    });
  }

  if (section.value === "docs") {
    return currentMock.value.docFolders.map((folder) => ({
      id: folder.id,
      name: folder.name,
    }));
  }

  return [];
});

// 🧩 Lista de usuarios (o carpetas en docs)
const chatList = computed(() => {
  if (section.value === "canales" || section.value === "grupos") {
    return (
      currentMock.value.channelMembers[selectedId.value]?.map(
        (id) => currentMock.value.users[id]
      ) || []
    );
  }
  if (section.value === "privadas") {
    const conv = currentMock.value.privateConversations.find(
      (c) => c.id === selectedId.value
    );
    return conv?.participants.map((id) => currentMock.value.users[id]) || [];
  }
  if (section.value === "docs") {
    return currentMock.value.docFolders;
  }
  return [];
});

// 🧩 Archivos por carpeta (solo si section === docs)
const fileList = computed<IDocFile[]>(() => {
  if (section.value === "docs") {
    const folder = currentMock.value.docFolders.find(
      (f) => f.id === selectedId.value
    );
    return folder?.files || [];
  }
  return [];
});

// 🧩 Mensajes por canal o conversación activa
const messages = computed<IMessage[]>(() => {
  return messageStore[selectedId.value] || [];
});

// 🧩 Cambio de idioma
function setLang(lang: string) {
  locale.value = lang;
  localStorage.setItem("lang", lang);
}

// 🔧 Handlers

/**
 * handleNewItem
 * @description Maneja la creación de un nuevo canal o grupo desde el modal
 */
function handleNewItem({ name, description, icon, type }: any): void {
  console.log("data to create", name, description, icon, type);
  // → Aquí se haría el POST al backend si no fuera mock
}

/**
 * sendMessage
 * @description Envía un nuevo mensaje al chat actual
 */
function sendMessage(): void {
  if (!newMessage.value.trim()) return;
  const ts = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  safePushMessage(selectedId.value, {
    id: Date.now().toString(),
    senderId: "yo",
    content: newMessage.value,
    timestamp: ts,
  });
  newMessage.value = "";
  showEmojiPicker.value = false;
}

/**
 * toggleEmojiPicker
 * @description Abre o cierra el selector de emojis
 */
function toggleEmojiPicker(): void {
  showEmojiPicker.value = !showEmojiPicker.value;
}

/**
 * onEmojiSelect
 * @description Añade el emoji seleccionado al input de mensaje
 */
function onEmojiSelect(event: CustomEvent): void {
  newMessage.value += event.detail.unicode;
}

/**
 * triggerFileSelect
 * @description Dispara el input de archivos oculto
 */
function triggerFileSelect(): void {
  fileInputRef.value?.click();
}

/**
 * onFileChange
 * @description Maneja la subida de un archivo como mensaje
 */
function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    const ts = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    safePushMessage(selectedId.value, {
      id: Date.now().toString(),
      senderId: "yo",
      content: "",
      timestamp: ts,
      fileUrl: url,
      fileName: file.name,
    });
    input.value = "";
  }
}

/**
 * handleEscapeKey
 * @description Cierra el emoji picker al pulsar ESC
 */
function handleEscapeKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    showEmojiPicker.value = false;
  }
}

/**
 * scrollToBottom
 * @description Desplaza el chat hacia el último mensaje
 */
function scrollToBottom(): void {
  const wrapper = (scrollRef.value as any)?.$el || scrollRef.value;
  if (!wrapper) return;
  const content = wrapper.querySelector?.(".ps__content") || wrapper;
  if (content) content.scrollTop = content.scrollHeight;
}

/**
 * toggleDarkMode
 * @description Cambia entre modo claro / oscuro
 */
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;

  const classList = document.body.classList;
  if (isDarkMode.value) {
    classList.add("theme-dark");
    classList.remove("theme-light");
    localStorage.setItem("theme", "dark");
  } else {
    classList.add("theme-light");
    classList.remove("theme-dark");
    localStorage.setItem("theme", "light");
  }
}

/**
 * safePushMessage
 * @description Añade un mensaje al chat sin romper reactividad
 */
function safePushMessage(sectionId: string, msg: IMessage): void {
  if (!messageStore[sectionId]) messageStore[sectionId] = [];
  messageStore[sectionId].push(msg);
}

// 🧩 Watchers

// 🔄 Resetea `selectedId` al cambiar de sección
watch(section, () => {
  const items = menuItems.value;
  if (items.length) selectedId.value = items[0].id;
});

// 🔄 Auto-scroll al fondo al recibir nuevos mensajes
watch(
  messages,
  async () => {
    await nextTick();
    scrollToBottom();
  },
  { flush: "post", deep: true }
);

// 🔄 Sincroniza mensajes con el idioma
watch(locale, () => {
  // 🔄 Al cambiar de idioma, tomamos los nuevos mensajes localizados desde el mock actualizado
  const updatedMockMessages = currentMock.value.conversationMessages;

  // 🔁 Recorremos cada canal/chat/conversación del mock
  for (const chatId in updatedMockMessages) {
    const incomingMessages = updatedMockMessages[chatId];
    // Si no corresponde a un canal/conversación válida, salta esta iteración
    if (!incomingMessages || !Array.isArray(incomingMessages)) continue;
    // Si ya tenemos mensajes en ese chat, actualizamos solo los coincidentes
    if (messageStore[chatId]) {
      messageStore[chatId] = messageStore[chatId].map((existingMsg) => {
        // Buscamos si este mensaje también existe en el nuevo idioma (por ID)
        const updatedMsg = incomingMessages.find(
          (m) => m.id === existingMsg.id
        );

        // Si existe, reemplazamos el contenido traducido
        return updatedMsg
          ? { ...existingMsg, content: updatedMsg.content }
          : existingMsg;
      });
    } else {
      // Si no había mensajes antes en este chat, los añadimos todos
      messageStore[chatId] = [...incomingMessages];
    }
  }
});

// 🔄 Lifecycle
onMounted(() => {
  window.addEventListener("keydown", handleEscapeKey);

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDarkMode.value = true;
    document.body.classList.add("theme-dark");
  } else {
    document.body.classList.add("theme-light");
  }

  nextTick().then(scrollToBottom);

  // 🧪 DEMO: añade mensajes falsos cada 5s
  if (DEMO) {
    setInterval(() => {
      // ✅ Cancelar todo si estás en la vista de documentos
      if (section.value === "docs") return;

      const sectionId = selectedId.value;

      let validUserIds: string[] = [];

      if (section.value === "canales" || section.value === "grupos") {
        validUserIds =
          currentMock.value.channelMembers[sectionId]?.filter(
            (id) => id !== "yo"
          ) || [];

        if (sectionId === "general") {
          validUserIds = validUserIds.filter((id) =>
            currentMock.value.users[id]?.roles.includes("admin")
          );
        }
      } else if (section.value === "privadas") {
        const conv = currentMock.value.privateConversations.find(
          (c) => c.id === sectionId
        );
        validUserIds = conv?.participants.filter((id) => id !== "yo") || [];
      }

      if (validUserIds.length === 0) return;

      const senderId =
        validUserIds[Math.floor(Math.random() * validUserIds.length)];

      const user = currentMock.value.users[senderId];
      if (!user || !user.name) return;

      // 🎯 CLAVES según tipo de canal
      let contentKey = "";
      if (sectionId === "general") {
        const generalKeys = ["greet-1", "greet-2", "greet-3", "greet-4"];
        const random =
          generalKeys[Math.floor(Math.random() * generalKeys.length)];
        contentKey = `messenger.demoMessagesGeneral.${random}`;
      } else {
        const demoKeys = ["demo-1", "demo-2", "demo-3", "demo-4", "demo-5"];
        const random = demoKeys[Math.floor(Math.random() * demoKeys.length)];
        contentKey = `messenger.demoMessages.${random}`;
      }

      const ts = new Date().toLocaleTimeString(
        locale.value === "es" ? "es-ES" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

      safePushMessage(sectionId, {
        id: Date.now().toString(),
        senderId,
        contentKey,
        timestamp: ts,
      });
    }, 5000);
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscapeKey);
});
</script>

<style scoped>
/* Contenedor principal del messenger: ocupa todo el alto de la ventana y distribuye su contenido en fila */
.messenger {
  display: flex;
  height: 100vh; /* Altura completa del viewport */
}

/* Sidebar de navegación lateral */
.messenger-menu {
  width: 70px; /* Ancho fijo */
  background: var(
    --bs-light
  ); /* Color de fondo definido en variables de Bootstrap */
  display: flex;
  flex-direction: column; /* Elementos apilados verticalmente */
  align-items: center; /* Centrado horizontal de los items */
}

/* Cada elemento dentro del menú lateral */
.messenger-menu-item {
  margin-bottom: 0.5rem; /* Separación inferior */
  cursor: pointer; /* Cursor indicador de elemento clickable */
}

/* Estado activo de un menú o botón pequeño */
.messenger-menu-item.active,
.btn-sm.active {
  background: rgba(77, 50, 197, 0.377); /* Fondo ligeramente gris */
  border-radius: 0.5rem; /* Bordes redondeados */
}

/* Panel intermedio que muestra usuarios o carpetas */
.messenger-chat {
  flex: 0 0 320px; /* Ancho fijo de 320px */
  display: flex;
  flex-direction: column; /* Elementos apilados verticalmente */
  border-right: 1px solid #e5e5e5; /* Línea divisoria derecha */
}

/* Cuerpo de la lista de chat: ocupa todo el espacio disponible */
.messenger-chat-body {
  flex: 1;
}

/* Zona principal del chat con mensajes e input */
.messenger-content {
  flex: 1; /* Ocupa el espacio restante */
  display: flex;
  flex-direction: column; /* Disposición vertical */
}

/* Contenedor del widget de chat completo */
.widget-chat {
  flex: 1;
  display: flex;
  flex-direction: column; /* Header, body y footer en vertical */
}

/* Área de mensajes con scroll interno */
.widget-chat-body {
  flex: 1; /* Crece para llenar el espacio */
  overflow-y: auto; /* Scroll vertical cuando supera altura */
  padding: 1rem; /* Espacio interno */
}

/* Contenedor del input de chat */
.widget-chat-input {
  flex-shrink: 0; /* No se encoge */
  padding: 0.5rem 1rem; /* Espacio interno */
  border-top: 1px solid #e5e5e5; /* Línea divisoria superior */
  background: #fff; /* Fondo blanco */
}

/* Estilos para el textarea del input */
.widget-chat-input textarea {
  width: 100%; /* Ancho completo */
  resize: none; /* Desactiva el redimensionado manual */
}

/* Etiquetas de menú (texto bajo iconos) */
.menu-label {
  font-size: 0.75rem; /* Tamaño de fuente reducido */
  margin: 0; /* Sin márgenes */
  white-space: nowrap; /* Texto en una sola línea */
}

/* Glóbulo emergente para el selector de emojis */
.emoji-picker-bubble {
  position: absolute; /* Posicionado relativo al padre */
  bottom: 100%; /* Se sitúa justo encima */
  left: 0; /* Alineado a la izquierda */
  margin-bottom: 8px; /* Separación del elemento padre */
  background: #fff; /* Fondo blanco */
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Sombra suave */
  padding: 8px; /* Espacio interno */
  z-index: 1000; /* Por encima de otros elementos */
}

/* Corrección para mensajes largos: fuerza salto de línea y evita desbordes */
.widget-chat-message {
  display: block;
  max-width: 100%; /* No excede ancho del contenedor */
  white-space: normal; /* Permite saltos de línea */
  word-break: break-word; /* Rompe palabras largas */
  overflow-wrap: break-word; /* Ajuste de palabras muy largas */
}

/* Refuerzo de las reglas anteriores para navegadores específicos */
.widget-chat-message {
  display: inline-block;
  white-space: pre-wrap; /* Respeta saltos de línea preexistentes */
  word-wrap: break-word; /* Ajuste de palabras */
  overflow-wrap: break-word; /* Ajuste adicional */
}

.widget-chat-item.end .widget-chat-message {
  border-radius: 16px;
  padding: 8px 12px;
  display: inline-block;
  margin-top: 4px;
}

/* Botón de envío de nuevo mensaje */
.widget-chat-input .btn {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-chat .widget-chat-header {
  padding: 0.8rem;
}
/* 🟢 Estilo del globo completo para mensajes enviados por otros usuarios */
.widget-chat-item.start .widget-chat-info-container {
  border-radius: 16px;
  padding: 10px 14px;
  display: inline-block;
  max-width: 80%;
  margin-top: 6px;
}
.widget-chat-item.start .widget-chat-info-container .widget-chat-time {
  text-align: right;
  display: block;
}

/* 🟢 Estilo del globo completo para mensajes enviados por el usuario ('yo') */
.widget-chat-item.end .widget-chat-info-container {
  background-color: #d4f0d2 !important; /* cambia el color a lo que quieras */
  border-radius: 16px;
  padding: 10px 14px;
  display: inline-block;
  max-width: 80%;
  margin-top: 6px;
}

.widget-chat-item.end .widget-chat-time {
  text-align: right;
  display: block;
}

.widget-chat-message::before {
  border-left-color: #d4f0d2 !important; /* mismo color de fondo que el globo */
}

/* 
===============================================================================
TRANSICION DEL EMOJI PICKER
===============================================================================
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 
===============================================================================
🌍 ESTILO BANDERAS
===============================================================================
*/
.lang-theme-switch button {
  background: none;
  border: none;
  padding: 0;
  margin: 0 0.25rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.flag {
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
  transition: filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  background-color: transparent;
}
.lang-theme-switch button:hover .flag {
  filter: brightness(90%);
}
.lang-theme-switch button.active .flag {
  box-shadow: 0 0 0 2px #00b4b6;
  transform: scale(1.05);
}

/* Aplica a tu botón de cambio de tema */
.lang-theme-switch .theme-toggle-btn {
  /* Ajusta el tamaño del emoji para que sea similar a la bandera */
  font-size: 18px;
  /* Forzamos que ocupe exactamente esa altura */
  line-height: 18px;
  /* Para que el emoji se alinee con el centro de la línea */
  vertical-align: top;
}

/* ================================
   🎨 MODO OSCURO: AJUSTES VISUALES
   Corrige colores de texto en elementos clave
   ================================ */

/* 🟤 Mensajes de otros usuarios */
body.theme-dark .widget-chat-item.start .widget-chat-info .widget-chat-message {
  color: #f0f0f0 !important;
}

/* ⛔️ No tocar los mensajes propios (posición derecha) */
body.theme-dark .widget-chat-item.end .widget-chat-info .widget-chat-message {
  color: inherit !important; /* mensaje */
}
body.theme-dark .widget-chat-item.end .widget-chat-info .widget-chat-time {
  color: inherit !important; /* hora */
}

/* 🔵 Botones de canales y grupos */
body.theme-dark .messenger-menu-link,
body.theme-dark .list-group-item {
  color: #f0f0f0 !important;
}

/* Hover en botones del sidebar */
body.theme-dark .list-group-item:hover,
body.theme-dark .messenger-menu-link:hover {
  color: #fff !important;
  background-color: #2a2a2a !important;
}

/* 🟠 Lista de usuarios en columna intermedia */
body.theme-dark .messenger-chat-link,
body.theme-dark .messenger-chat-user,
body.theme-dark .messenger-chat-title {
  color: #f0f0f0 !important;
}

/* color del texto del título del chat en el header */
body.theme-dark .header-text {
  color: #f0f0f0 !important;
}
/* descripción del usuario (cargo) */
body.theme-dark .messenger-chat-desc {
  color: #686767 !important;
}
/* Iconos secundarios y clases Bootstrap conflictivas */
body.theme-dark .text-muted,
body.theme-dark .text-secondary {
  color: #cccccc !important;
}

body.theme-dark {
  background-color: #121212;
  color: #f0f0f0;
}

/* Forzamos color de texto base */
body.theme-dark,
body.theme-dark * {
  color: #f0f0f0 !important;
}

/* Fondo del sidebar */
body.theme-dark .messenger-menu {
  background-color: #1e1e1e !important;
}

/* Fondo columna de usuarios/docs */
body.theme-dark .messenger-chat {
  background-color: #181818 !important;
  border-color: #2a2a2a !important;
}

/* Fondo del área de chat */
body.theme-dark .widget-chat {
  background-color: #101010 !important;
}

/* Fondo del área de mensajes (chat) */
body.theme-dark .widget-chat-body {
  background-color: #101010 !important;
}

/* Fondo del input */
body.theme-dark .widget-chat-input {
  background-color: #1b1b1b !important;
  border-top: 1px solid #2a2a2a !important;
}

/* Textarea input */
body.theme-dark .form-control,
body.theme-dark textarea {
  background-color: #2a2a2a !important;
  color: #f0f0f0 !important;
  border: none;
}

/* Botones */
body.theme-dark .btn {
  color: #f0f0f0 !important;
  border: none;
}
/* Estado activo */
body.theme-dark .btn-sm.active {
  background: rgba(77, 50, 197, 0.377) !important; /* Fondo ligeramente gris */
}

/* Iconos dentro del chat input */
body.theme-dark .widget-chat-toolbar-link {
  color: #f0f0f0 !important;
}

/* Estilo de mensajes del otro usuario */
body.theme-dark .widget-chat-item.start .widget-chat-info-container {
  background-color: #2a2a2a !important;
  border-radius: 16px;
  padding: 10px 14px;
  display: inline-block;
  max-width: 80%;
  margin-top: 6px;
}
body.theme-dark
  .widget-chat-item.start
  .widget-chat-info-container
  .widget-chat-time {
  text-align: right;
  display: block;
}
body.theme-dark .widget-chat-item.start .widget-chat-message::before {
  border-inline-end-color: #2a2a2a !important; /* mismo color de fondo que el globo */
}

/* Selector de emoji */
body.theme-dark .emoji-picker-bubble {
  background-color: #1a1a1a !important;
  color: #fff !important;
  border: 1px solid #333 !important;
}

/* Lista de carpetas en modo docs */
body.theme-dark .messenger-chat-link,
body.theme-dark .list-group-item {
  background-color: transparent !important;
  color: #f0f0f0 !important;
  border: none !important;
}

/* Iconos secundarios (como carpetas) */
body.theme-dark .text-secondary {
  color: #ccc !important;
}
</style>
