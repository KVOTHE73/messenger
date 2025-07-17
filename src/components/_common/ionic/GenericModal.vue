<template>
  <ion-modal :is-open="state" @didDismiss="handleDidDismiss">
    <ion-header>
      <ion-toolbar :color="toolbarBgColor">
        <ion-title slot="start">{{ title }}</ion-title>
        <ion-buttons v-if="hasCloseButton" slot="end">
          <ion-button @click="handleDidDismiss">
            <ion-icon slot="icon-only" :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <slot>
        <!-- Aquí irá el contenido dinámico del modal -->
      </slot>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  toolbarBgColor: {
    type: String,
    required: false,
    default: "secondary",
  },
  title: {
    type: String,
    required: true,
  },
  hasCloseButton: {
    type: Boolean,
    default: true,
  },
} as const);

const emit = defineEmits(["close"]);

const state = ref<boolean>(props.isOpen);

watch(
  () => props.isOpen,
  (newVal) => {
    state.value = newVal;
  },
  { immediate: true }
);

const handleDidDismiss = () => {
  emit("close");
};
</script>

<style scoped>
/* Espaciado opcional aquí */
</style>
