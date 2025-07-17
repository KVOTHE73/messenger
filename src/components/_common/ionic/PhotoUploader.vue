<template>
  <!-- Fallback input para web/PWA -->
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    multiple
    @change="onFileChange"
    style="display: none"
  />

  <ion-item>
    <ion-label>{{ label }}</ion-label>
    <ion-button
      slot="end"
      fill="outline"
      :disabled="!allowMultiple && photos.length > 0"
      @click="handleAddPhoto"
    >
      <ion-icon slot="icon-only" color="secondary" :icon="cameraOutline" />
    </ion-button>
  </ion-item>

  <ion-grid class="photo-grid" v-if="photos.length">
    <ion-row>
      <ion-col size="4" v-for="(p, i) in photos" :key="i">
        <div class="photo-wrapper">
          <ion-thumbnail>
            <img
              :src="p.preview"
              loading="lazy"
              :alt="`Vista previa de ${p.filename}`"
            />
          </ion-thumbnail>
          <button class="remove-button" @click="removePhoto(i)">
            <ion-icon :icon="closeCircleOutline" />
          </button>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  toastController,
} from "@ionic/vue";
import { cameraOutline, closeCircleOutline } from "ionicons/icons";

export interface Photo {
  preview: string;
  blob: Blob;
  filename: string;
}

const props = defineProps<{
  modelValue: Photo[];
  label?: string;
  allowMultiple?: boolean;
}>();
const { label = "Subir fotos", allowMultiple = true } = props;
const emit = defineEmits<{ (e: "update:modelValue", val: Photo[]): void }>();
const photos = computed<Photo[]>({
  get: () => props.modelValue ?? [],
  set: (val: Photo[]) => emit("update:modelValue", val),
});
const fileInput = ref<HTMLInputElement | null>(null);

onBeforeUnmount(() => {
  photos.value.forEach((p) => URL.revokeObjectURL(p.preview));
});

async function showToast(message: string) {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: "bottom",
  });
  await toast.present();
}

async function handleAddPhoto() {
  if (Capacitor.getPlatform() === "web") {
    fileInput.value?.click();
    return;
  }
  try {
    const photo = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
    });
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const newPhoto: Photo = {
      preview: photo.webPath!,
      blob,
      filename: `photo_${Date.now()}.jpeg`,
    };
    photos.value = [...photos.value, newPhoto];
  } catch (err) {
    console.warn("Camera plugin error:", err);
    await showToast("No se pudo abrir la cámara. Usa el selector de archivos.");
    fileInput.value?.click();
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  const newPhotos: Photo[] = [];
  Array.from(input.files).forEach((file) => {
    const url = URL.createObjectURL(file);
    newPhotos.push({ preview: url, blob: file, filename: file.name });
  });
  photos.value = [...photos.value, ...newPhotos];
  input.value = "";
}

function removePhoto(index: number) {
  const removed = photos.value[index];
  URL.revokeObjectURL(removed.preview);
  photos.value = photos.value.filter((_, i) => i !== index);
}
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
}

.photo-wrapper {
  position: relative;
  width: 100%;
  display: block;
  margin-bottom: 5rem;
}
ion-thumbnail {
  display: block;
  width: 100%;
}
ion-thumbnail img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
}
.remove-button {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(15%, -50%);
  z-index: 10;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(207, 20, 20, 0.5);
  color: white;
  border-radius: 50%;
}
.remove-button ion-icon {
  font-size: 1.2rem;
  line-height: 1;
}
</style>
