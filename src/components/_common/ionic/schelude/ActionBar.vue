<template>
    <div class="d-flex align-items-center justify-content-between mt-2 me-3 ms-3">
      <div class="d-flex">
        <ion-button
          shape="round"
          title="Añadir un nueva entrada a la agenda"
          @click="openModal"
          :disabled="!selectedDateInfo || showAllEvents"
        >
          <ion-icon slot="icon-only" :icon="add"></ion-icon>
        </ion-button>
      </div>
      <div class="ion-text-center flex-grow-1 mt-2 bg-light">
        <div
          v-if="selectedDateFormatted !== null && !showTodayEvents && !showAllEvents"
          class="text-theme fs-15px"
        >
          {{ selectedDateFormatted }}
        </div>
      </div>
      <div class="d-flex">
        <ion-button
          shape="round"
          title="Abrir / cerrar cuadro de búsqueda"
          @click="openSearchBar"
          :disabled="!selectedDateInfo"
        >
          <ion-icon slot="icon-only" :icon="search"></ion-icon>
        </ion-button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    selectedDateFormatted: String,
    selectedDateInfo: Boolean,
    showAllEvents: Boolean,
    add: Object,
    search: Object,
    openModal: Function,
    openSearchBar: Function,
    showTodayEvents: Boolean
  });
  </script>
  