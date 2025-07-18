/// <reference types="vitest" />
// ============================================================================
// 🔹 TEST: MobileMessenger.spec.ts
//    💡 Verifica comportamiento de segmentación, envío, idioma y tema
// ============================================================================

import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import messages from "../i18n/messages";
import MobileMessenger from "../views/messenger/mobile/MobileMessenger.vue";
import { defineCustomElements } from "@ionic/core/loader";

// 🌐 i18n real
const i18n = createI18n({
  legacy: false,
  locale: "es",
  messages,
});

// 🛠️ Activar Ionic Web Components
beforeAll(() => {
  defineCustomElements(window);
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = () => {};
  }
});

// 🧪 Render común
function renderMobileMessenger() {
  return render(MobileMessenger, {
    global: {
      plugins: [createPinia(), i18n],
    },
  });
}

describe("MobileMessenger.vue", () => {
  beforeEach(() => {
    document.body.className = "";
  });

  it("cambia el idioma a inglés", async () => {
    renderMobileMessenger();

    const btn = await screen.findByTestId("btn-lang-en");
    await fireEvent.click(btn);

    expect(btn.classList.contains("active")).toBe(true);
  });

  it("cambia a modo oscuro", async () => {
    renderMobileMessenger();

    const btn = await screen.findByTestId("btn-toggle-theme");
    await fireEvent.click(btn);

    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  it("muestra los botones de segmentos al iniciar", async () => {
    renderMobileMessenger();

    expect(await screen.findByTestId("segment-canales")).toBeInTheDocument();
    expect(await screen.findByTestId("segment-grupos")).toBeInTheDocument();
    expect(await screen.findByTestId("segment-docs")).toBeInTheDocument();
  });
});
