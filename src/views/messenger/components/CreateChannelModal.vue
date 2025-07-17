<template>
  <GenericModal
    :is-open="visible"
    :title="`Creación de nuevo ${capitalizedType}`"
    @close="close"
  >
    <form @submit.prevent="onSubmit" class="p-2">
      <ion-item>
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input v-model="form.name" required />
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Descripción</ion-label>
        <ion-input v-model="form.description" />
      </ion-item>

      <!-- Popover con grid de iconos -->
      <ion-item button detail-lines="none" @click="showIconPicker = true">
        <ion-label position="stacked">Icono</ion-label>
        <ion-text class="d-flex align-items-center">
          <Icon :icon="`solar:${selectedIcon}`" class="fs-24px me-1" />
          {{ selectedIcon }}
        </ion-text>
      </ion-item>
      <ion-popover
        :is-open="showIconPicker"
        @didDismiss="showIconPicker = false"
      >
        <!-- Header del popover -->
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>Escoge un icono</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showIconPicker = false">
                <ion-icon slot="icon-only" name="close-outline" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <!-- Grid de iconos -->
        <div class="icon-grid">
          <div
            v-for="name in iconNames"
            :key="name"
            class="icon-item"
            @click="selectIcon(name)"
          >
            <Icon :icon="`solar:${name}`" class="fs-24px" />
          </div>
        </div>
      </ion-popover>

      <div class="ion-padding-top text-end">
        <ion-button type="button" fill="outline" @click="close">
          Cancelar
        </ion-button>
        <ion-button type="submit" color="primary">
          Crear {{ capitalizedType }}
        </ion-button>
      </div>
    </form>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import GenericModal from "@/components/_common/ionic/GenericModal.vue";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonPopover,
  IonToolbar,
  IonHeader,
  IonIcon,
  IonButtons,
  IonTitle,
  IonText,
} from "@ionic/vue";
import { Icon } from "@iconify/vue";
import solarData from "@iconify-json/solar/icons.json";

interface FormState {
  name: string;
  description: string;
  icon: string;
}

const props = defineProps<{
  visible: boolean;
  type: "canales" | "grupos" | "privadas" | "docs";
}>();
const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "create",
    payload: { name: string; description: string; icon: string; type: string }
  ): void;
}>();

const form = reactive<FormState>({ name: "", description: "", icon: "" });

// extraemos la lista de iconos
const iconNames = Object.keys((solarData as any).icons) as string[];
const selectedIcon = ref(iconNames[0]);

const showIconPicker = ref(false);
function selectIcon(name: string) {
  selectedIcon.value = name;
  showIconPicker.value = false;
}

const capitalizedType = computed(() =>
  props.type === "canales" ? "Canal" : "Grupo"
);

function close() {
  emit("close");
}

function onSubmit() {
  form.icon = selectedIcon.value;
  emit("create", { ...form, type: props.type });
  form.name = "";
  form.description = "";
  selectedIcon.value = iconNames[0];
  close();
}
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 8px;
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}
.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
}
.icon-item:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
