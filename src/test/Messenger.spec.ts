import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, it, expect, beforeEach } from "vitest";
import { createI18n } from "vue-i18n";
import messages from "../i18n/messages";
import DesktopMessenger from "../views/messenger/desktop/DesktopMessenger.vue";

// Crear instancia de i18n
const i18n = createI18n({
  legacy: false,
  locale: "es",
  messages,
});

function renderMessenger() {
  return render(DesktopMessenger, {
    global: {
      plugins: [i18n],
    },
  });
}

describe("DesktopMessenger.vue", () => {
  beforeEach(() => {
    document.body.className = "";
  });

  it("cambia a la sección de grupos al hacer clic en el botón correspondiente", async () => {
    renderMessenger();
    const btn = screen.getByTestId("btn-section-grupos");
    await fireEvent.click(btn);
    expect(btn.classList.contains("active")).toBe(true);
  });

  it("cambia a la sección de docs al hacer clic en el botón correspondiente", async () => {
    renderMessenger();
    const btn = screen.getByTestId("btn-section-docs");
    await fireEvent.click(btn);
    expect(btn.classList.contains("active")).toBe(true);
  });

  it("envía un mensaje al hacer clic en el botón de enviar", async () => {
    renderMessenger();

    // Cambiar a sección de canales si es necesario
    const btnCanales = screen.getByTestId("btn-section-canales");
    await fireEvent.click(btnCanales);

    // Seleccionar canal "General"
    const canal = screen.getByText("Buzón");
    await fireEvent.click(canal);

    // Esperar al input de chat
    const input = await screen.findByTestId("chat-input");
    await fireEvent.update(input, "Mensaje de prueba");

    // Clic en botón de enviar
    const btnEnviar = screen.getByTestId("btn-send-message");
    await fireEvent.click(btnEnviar);

    // Comprobar que el mensaje aparece
    const mensaje = await screen.findByText("Mensaje de prueba");
    expect(mensaje).toBeInTheDocument();
  });

  it("cambia el idioma a inglés", async () => {
    renderMessenger();
    const btn = screen.getByTestId("btn-lang-en");
    await fireEvent.click(btn);
    expect(btn.classList.contains("active")).toBe(true);
  });

  it("cambia a modo oscuro", async () => {
    renderMessenger();
    const btn = screen.getByTestId("btn-toggle-theme");
    await fireEvent.click(btn);
    expect(btn.textContent?.includes("☀️")).toBe(true);
  });
});
