<!--
==========================================================================================================================
🔷 MESSENGER ROUTING
   💡 Esta vista es la encargada de decidir qué interfaz mostrar (escritorio o móvil) según el dispositivo del usuario:
       - Si el usuario está en móvil, carga automáticamente la vista MobileMessenger.vue
       - Si el usuario está en escritorio, carga DesktopMessenger.vue
       - Esta lógica es reactiva, se actualiza si se cambia el tamaño de pantalla (por ejemplo, girar el dispositivo)
==========================================================================================================================
-->
<template>
  <!-- 🔀 Componente dinámico que cambia según el tipo de dispositivo -->
  <component :is="isMobile ? MobileMessenger : DesktopMessenger" />
</template>

<script setup lang="ts">
// ==============================================================================
// ⛳ IMPORTS
// ==============================================================================
import { useDeviceMode } from "../../composables/useDeviceMode";
import DesktopMessenger from "./desktop/DesktopMessenger.vue";
import MobileMessenger from "./mobile/MobileMessenger.vue";

// ==============================================================================
// 📱 DETECCIÓN DINÁMICA DE DISPOSITIVO
// ==============================================================================
const { isMobile } = useDeviceMode();
</script>
