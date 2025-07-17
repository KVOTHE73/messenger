<!-- PopoverContent.vue -->
<template>
    <ion-content>
      <ion-list>
        <ion-item button @click="selectOption('Perfil')">Ver Perfil</ion-item>
        <ion-item button @click="selectOption('Configuraciones')">Configuraciones</ion-item>
        <ion-item button @click="selectOption('Cerrar Sesión')">Cerrar Sesión</ion-item>
      </ion-list>
    </ion-content>
  </template>
  
  <script setup lang="ts">
  import {
  IonContent,
  IonList,
  IonItem,
  popoverController
} from "@ionic/vue";
  const selectOption = (option: string) => {
    console.log('Seleccionaste:', option);
    // Cierra el popover al seleccionar una opción
    popoverController.dismiss();
  };
  </script>
  