<template>
  <ion-menu :content-id="appName">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menú</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item
          button
          @click="navigate('/agenda')"
          :disabled="isActive('/agenda')"
          :class="{ active: isActive('/agenda') }"
        >
          <ion-icon :icon="calendarOutline" class="menu-icon text-theme" />
          <ion-label>Agenda</ion-label>
        </ion-item>

        <ion-item
          button
          @click="navigate('/fichajes')"
          :disabled="isActive('/fichajes')"
          :class="{ active: isActive('/fichajes') }"
        >
          <ion-icon :icon="timeOutline" class="menu-icon text-theme" />
          <ion-label>Fichajes</ion-label>
        </ion-item>

        <ion-item
          button
          @click="navigate('/contactos')"
          :disabled="isActive('/contactos')"
          :class="{ active: isActive('/contactos') }"
        >
          <ion-icon :icon="peopleOutline" class="menu-icon text-theme" />
          <ion-label>Contactos</ion-label>
        </ion-item>
        <ion-item
          button
          @click="navigate('/gastos')"
          :disabled="isActive('/gastos')"
          :class="{ active: isActive('/gastos') }"
        >
          <ion-icon :icon="cashOutline" class="menu-icon text-theme" />
          <ion-label>Gastos</ion-label>
        </ion-item>
        <ion-item
          button
          @click="navigate('/transporte')"
          :disabled="isActive('/transporte')"
          :class="{ active: isActive('/transporte') }"
        >
          <ion-icon :icon="busOutline" class="menu-icon text-theme" />
          <ion-label>Transporte</ion-label>
        </ion-item>
        <ion-item
          button
          @click="navigate('/mensajeria')"
          :disabled="isActive('/mensajeria')"
          :class="{ active: isActive('/mensajeria') }"
        >
          <ion-icon
            :icon="chatbubbleEllipsesOutline"
            class="menu-icon text-theme"
          />
          <ion-label>Mensajería</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/vue";
import { useRouter, useRoute } from "vue-router";
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  cashOutline,
  busOutline,
  chatbubbleEllipsesOutline,
} from "ionicons/icons";
import { computed } from "vue";

const props = defineProps<{ appName: string }>();
const router = useRouter();
const route = useRoute();

// Computed para verificar la ruta actual y evitar errores
const isActive = (path: string) => {
  return computed(() => route.path === path).value;
};

// Función para navegar si la opción no está deshabilitada
const navigate = (path: string) => {
  if (!isActive(path)) {
    router.push(path);
  }
};
</script>

<style scoped lang="scss">
.menu-icon {
  margin-right: 10px;
  font-size: 1.4rem;
}

.active {
  opacity: 0.5; /* Se verá desactivado visualmente */
  pointer-events: none; /* Evita clicks en el elemento */
  color: gray !important;
}
</style>
