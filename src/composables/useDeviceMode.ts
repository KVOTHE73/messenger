// ============================================================================
// 📁 useDeviceMode.ts
//    💡 Composable para detectar si el usuario está en modo móvil según ancho
//       de ventana. Permite renderizar dinámicamente vistas según tamaño.
// ============================================================================

import { ref, onMounted, onUnmounted } from "vue";

// 📱 Umbral estándar para detectar dispositivos móviles en cuanto a su ancho
const MOBILE_BREAKPOINT = 768;

// ─────────────────────────────────────────────────────────────────────────────
export function useDeviceMode() {
  const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT);

  // 📦 Función de actualización reactiva
  const update = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
  };

  // 🔄 Al montar, escuchar cambios de tamaño
  onMounted(() => {
    window.addEventListener("resize", update);
    update(); // Inicial
  });

  // 🧹 Limpiar al desmontar
  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return { isMobile };
}
