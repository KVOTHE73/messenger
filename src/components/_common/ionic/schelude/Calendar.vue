<!-- componente con el calendario -->
<template>
  <div class="spinner-container" v-if="isLoading">
    <ion-spinner color="primary" name="lines-sharp"></ion-spinner>
  </div>
  <!-- El calendario está oculto visualmente mientras carga -->
  <div :class="{ hidden: isLoading }">
    <FullCalendar
      ref="calendarRef"
      class="demo-app-calendar p-1"
      :options="calendarOptions"
    >
      <template v-slot:eventContent="arg">
        <i v-if="isFirstEventOfDay(new Date(arg.event.start))"></i>
      </template>
    </FullCalendar>
  </div>
</template>

<script setup>
import FullCalendar from "@fullcalendar/vue3";
import { ref, watch, onMounted } from "vue";
import { IonSpinner } from "@ionic/vue";

const props = defineProps({
  calendarOptions: Object,
  isFirstEventOfDay: Function,
});

const isLoading = ref(true);
const calendarRef = ref(null);

const updateEvent = () => {
  try {
    isLoading.value = true; // Mostrar el spinner antes de la operación

    console.log("Actualizando evento");

    // Refrescar los eventos del calendario
    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi();

      // Eliminar y volver a agregar la fuente de eventos
      calendarApi.removeAllEventSources();
      calendarApi.addEventSource(props.calendarOptions.events);

      calendarApi.refetchEvents(); // Vuelve a cargar los eventos
    }
  } catch (error) {
    console.error("Error al actualizar el evento", error);
  } finally {
    isLoading.value = true; // Ocultar el spinner después de la operación
  }
};

// se expone el objeto de referencia para que el padre pueda acceder a el
defineExpose({ calendarRef, updateEvent });

// detecta cambios en los eventos y los actualiza
watch(
  () => props.calendarOptions.events,
  (newEvents) => {
    if (calendarRef.value) {
      isLoading.value = true;
      const calendarApi = calendarRef.value.getApi();

      // 🔥 En lugar de reemplazar todo, actualiza los eventos sin perder opciones
      calendarApi.batchRendering(() => {
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(newEvents);
      });

      console.log("Eventos sincronizados con el calendario:", newEvents);
      isLoading.value = false;
    }
  }
);

onMounted(() => {
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    console.log("Calendar API está disponible", calendarApi);
    // Esperar al evento 'eventsSet' para asegurarse de que el calendario esté cargado
    calendarApi.on("eventsSet", () => {
      console.log("Eventos cargados");
      isLoading.value = false; // Ocultar el spinner una vez que los eventos se carguen
    });
  }
});
</script>

<style scoped lang="scss">
/* contenedor del spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupa toda la altura de la pantalla */
  width: 100vw; /* Ocupa todo el ancho de la pantalla */
}
/* tamaño del spinner */
ion-spinner {
  width: 10%;
  height: 10%;
}
/* Ocultar el calendario mientras está cargando */
.hidden {
  display: none;
}
/* estilos generales del calendario */
.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
  border-bottom-style: inset !important; /* borde inferior */
  font-size: var(
    --calendar-font-size,
    12px
  ); // tamaño de las fuentes (los números de dias)
}
/* ajuste de las celdas de cada dia del calendario */
:deep(.fc-daygrid-day) {
  height: 50px; /* Altura fija de las celdas */
  max-height: 50px; /* Altura máxima fija */
  overflow: hidden; /* Evita el desbordamiento */
  position: relative; /* Para posicionar el icono */
  padding: 0; /* Eliminar cualquier padding */
  margin: 0; /* Eliminar margen para evitar crecimiento */
}
:deep(.fc-daygrid-day-events) {
  display: flex;
  flex-direction: column; /* Coloca los eventos en una columna */
  max-height: 20px; /* Limita la altura del contenedor de eventos */
  overflow: hidden; /* Oculta eventos que no caben */
}
:deep(.fc-daygrid-event) {
  display: flex;
  max-height: 15px; /* Limita la altura de cada evento individual */
  margin: 0; /* Eliminar márgenes para evitar crecimiento */
  overflow: hidden; /* Evita desbordamiento de texto */
  white-space: nowrap; /* Mantiene el texto en una sola línea */
}

/* estilos y botones de la cabecera de encima del calendario */
:deep(.fc-header-toolbar) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap; /* Evita que los elementos se vayan a otra línea */
}
:deep(.fc-toolbar-chunk) {
  display: flex;
  align-items: center;
}
:deep(.btn-group) {
  display: flex;
  gap: 5px; /* Espaciado entre los botones */
}
:deep(button) {
  padding: 5px 10px; /* Tamaño de los botones */
  font-size: 14px; /* Ajusta el tamaño de la fuente */
}
:deep(h2.fc-toolbar-title) {
  margin: 0;
  font-size: 16px; /* Ajusta el tamaño del título */
}
:deep(.fc-today-button) {
  margin-left: 10px; /* Espaciado del botón "Hoy" */
}
:deep(.fc-myCustomButton-button) {
  padding: 5px 10px; /* Tamaño de los botones */
  font-size: 14px; /* Ajusta el tamaño de la fuente */
  margin-right: 5px;
}
:deep(.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events) {
  pointer-events: none !important; /* elimna el click sobre el contenido del día */
}
</style>
