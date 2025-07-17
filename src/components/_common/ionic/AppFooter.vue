<template>
  <ion-footer>
    <ion-toolbar>
      <div class="tabs-container mb-2">
        <ion-buttons>
          <ion-button
            v-for="button in buttons"
            :key="button.key"
            :class="[
              'custom-button',
              button.class,
              { active: activeKey === button.key },
            ]"
            @click="handleClick(button.key, button.action)"
          >
            <div class="button-content">
              <ion-icon :name="button.icon" />
              <ion-label>{{ button.label }}</ion-label>
              <ion-ripple-effect />
            </div>
          </ion-button>
        </ion-buttons>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import {
  IonFooter,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonRippleEffect,
} from "@ionic/vue";

interface FooterButton {
  key: string;
  icon: string;
  label: string;
  action: string;
  class?: string;
}

const props = defineProps<{
  buttons: FooterButton[];
  resetActive?: boolean;
}>();

const emit = defineEmits<{
  (e: "action", action: string): void;
}>();

const activeKey = ref<string | null>(null);

function handleClick(key: string, action: string) {
  activeKey.value = activeKey.value === key ? null : key;
  emit("action", action);
}

// 💥 cuando resetActive sea true, se limpia activeKey
watch(
  () => props.resetActive,
  (newVal) => {
    if (newVal) activeKey.value = null;
  }
);
</script>

<style scoped>
.tabs-container {
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.custom-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  --color: gray;
  --icon-size: 24px;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 0;
  --padding-bottom: 0;
}
.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.custom-button.active {
  --background: transparent;
  --color: #0b5ed7;
}
.custom-button ion-label {
  font-size: 12px;
}
.custom-button ion-icon {
  font-size: 25px;
  margin-bottom: 4px;
}
</style>
