<!-- header de la aplicación con botón hamburguesa que abre menú lateral, nombre de la app y botón de usuario con nombre e imagen, si existe  -->
<!-- el botón de usuario tiene un dropdown con opciones -->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title class="appHeaderTitle">{{ appName }}</ion-title>
      <ion-chip slot="end" @click="openPopover($event)">
        <ion-avatar v-if="userPhoto">
          <img alt="Usuario" :src="userPhoto" />
        </ion-avatar>
        <ion-label>{{ user }}</ion-label>
      </ion-chip>
    </ion-toolbar>
  </ion-header>

  <!-- Popover para el dropdown -->
  <ion-popover
    ref="popover"
    :is-open="showPopover"
    :event="popoverEvent"
    @didDismiss="handlePopoverClose"
  >
    <ion-content>
      <ion-list>
        <ion-item
          button
          :detail="false"
          v-for="employee in employees"
          :key="employee.id"
        >
          <!-- se usa :detail="false" para quitar el símbolo de mayor -->
          <ion-avatar
            @click="selectOption(employee)"
            slot="start"
            v-if="employee.foto"
          >
            <!-- se usa slot para alinear correctamente -->
            <img alt="" :src="`data:image/png;base64,` + employee.foto" />
          </ion-avatar>
          <!-- si no hay imagen, se carga por defecto -->
          <div v-else class="empty-avatar">
            <img src="@/assets/images/no-profile-picture.webp" />
          </div>
          <ion-label @click="selectOption(employee)">
            <h4>{{ employee.nombre }}</h4>
            <h6>{{ employee.eMail }}</h6>
            <h6>{{ employee.telefono1 }}</h6>
          </ion-label>
          <ion-label slot="end">
            <h6 class="emptyName"></h6>
            <h6 v-if="employee.eMail">
              <a :href="`mailto:${employee.eMail}`"
                ><ion-icon :icon="mail"></ion-icon
              ></a>
            </h6>
            <h6 v-if="employee.telefono1">
              <a :href="`tel:${employee.telefono1}`"
                ><ion-icon :icon="call"></ion-icon
              ></a>
            </h6>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonChip,
  IonAvatar,
  IonLabel,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  popoverController,
} from "@ionic/vue";

import { call, mail } from "ionicons/icons";

import { ref, watch } from "vue";

// tipos e interfaces
import type { IEmployees } from "@/interfaces/schedule/ISchedule.ts";
import type { PropType } from "vue";

const props = defineProps({
  appName: String,
  userName: String,
  userPic: String,
  employees: {
    type: Array as PropType<IEmployees[]>, // se usa PropType para especificar el tipo
  },
});

// Emitir evento
const emit = defineEmits<{
  (event: "employeeSelected", employee: any): void;
}>();

const showPopover = ref(false);
const popoverEvent = ref<Event | null>(null);
const user = ref<string>(props.userName ?? "");
const userPhoto = ref<string | undefined>(props.userPic);

// se escucha cuando cambian las props
watch(
  () => props.userName,
  (newVal) => {
    if (newVal) user.value = newVal; // Asignar el nuevo valor
  }
);

watch(
  () => props.userPic,
  (newVal) => {
    if (newVal) userPhoto.value = newVal; // Asignar el nuevo valor
  }
);

const openPopover = async (event: Event) => {
  // Asegúrate de cerrar el popover existente si ya está abierto antes de abrir uno nuevo
  await popoverController.dismiss().catch(() => {});
  // Asigna el evento para posicionar el popover
  popoverEvent.value = event;
  showPopover.value = true;
};

const handlePopoverClose = () => {
  console.log("Popover close");
  showPopover.value = false;
  popoverEvent.value = null;
};

const selectOption = (option: IEmployees) => {
  console.log("Seleccionaste:", option);
  const userConfirmed = confirm(
    `¿Seguro que quieres cargar la agenda de ${option.nombre}?`
  );

  if (userConfirmed) {
    user.value = option.nombre;
    userPhoto.value = option.foto
      ? `data:image/png;base64,` + option.foto
      : undefined;
    const data = {
      idEmpleado: option.id,
      fechaInicio: "2024-01-01T00:00:00.000Z",
      fechaFin: "2030-12-31T00:00:00.000Z",
    };
    // Emitir evento al seleccionar el empleado
    emit("employeeSelected", data);
    // después de emitir el evento, se cierra el popover
    showPopover.value = false;
  } else {
    return; // No hacer nada si el usuario cancela
  }
};
</script>

<style scoped>
ion-popover {
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  --color: white;
  --width: 350px;
}

.appHeaderTitle {
  text-align: center !important;
  justify-content: center !important;
  display: flex !important;
}

.empty-avatar {
  width: 50px; /* Ancho del avatar */
  height: 50px; /* Alto del avatar */
  background-color: transparent; /* Fondo transparente o el que prefieras */
  border-radius: 50%; /* Para que mantenga la forma redonda */
  margin-left: -2%;
  margin-top: 2%;
  margin-right: 2%;
}
.emptyName {
  margin-top: 22px;
}
</style>
