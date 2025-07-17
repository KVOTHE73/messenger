// ======================================================================================================
// 📦 COMPOSABLE: useMessengerMock
//    💡 Devuelve dinámicamente los datos de mock (en inglés o español) según el idioma activo
// ======================================================================================================

import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { IMockMessengerData } from "../interfaces/IMockMessengerData";

// 🔹 Mocks localizados
import mockEn from "../stores/mocks/mockMessengerDataEn";
import mockEs from "../stores/mocks/mockMessengerDataEs";

/**
 * useMessengerMock
 *
 * @description Devuelve el mock de datos de mensajería adaptado al idioma actual.
 * Internamente selecciona `mockEs` o `mockEn` en base a `locale.value`.
 *
 * ✅ Totalmente tipado con `IMockMessengerData`
 * ✅ Reactivo y compatible con `watchEffect`, `computed`, etc.
 * ✅ No importa propiedades individuales: usa el objeto entero para consistencia
 *
 * @returns {ComputedRef<IMockMessengerData>} – Mock localizado completo
 */
export function useMessengerMock() {
  const { locale } = useI18n();

  const mock = computed<IMockMessengerData>(() => {
    return locale.value === "es" ? mockEs : mockEn;
  });

  return mock;
}
