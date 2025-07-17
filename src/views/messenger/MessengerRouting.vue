<template>
  <div>
    <DesktopMessenger v-if="!isMobile" />
    <MobileMessenger v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
// componentes
import DesktopMessenger from "./desktop/DesktopMessenger.vue";
import MobileMessenger from "./mobile/MobileMessenger.vue";
// variables
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
</script>
