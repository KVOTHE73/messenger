import type { IMockMessengerData } from "../../interfaces/IMockMessengerData";

const mockMessengerDataEs: IMockMessengerData = {
  channels: [
    {
      id: "general",
      name: "General",
      description: "Canal general de la empresa",
      icon: "carbon:chat",
    },
    {
      id: "sugerencias",
      name: "Buzón",
      description: "Buzón de sugerencias de la empresa",
      icon: "carbon:idea",
    },
  ],
  groups: [
    {
      id: "informatica",
      name: "Informática",
      description: "Canal del Departamento de Informática",
      icon: "carbon:cloud-app",
    },
  ],
  privateConversations: [
    { id: "chat-daniel", participants: ["daniel", "yo"] },
    { id: "chat-maria", participants: ["maría", "yo"] },
  ],
  docFolders: [
    {
      id: "nominas",
      name: "Nóminas",
      files: [
        {
          id: "n1",
          name: "Nómina Enero 2025.pdf",
          url: `${import.meta.env.BASE_URL}assets/docs/nominas/ene2025.pdf`,
        },
        {
          id: "n2",
          name: "Nómina Febrero 2025.pdf",
          url: `${import.meta.env.BASE_URL}assets/docs/nominas/feb2025.pdf`,
        },
      ],
    },
    {
      id: "contratos",
      name: "Contratos",
      files: [
        {
          id: "c1",
          name: "Contrato Juan Pérez.pdf",
          url: `${import.meta.env.BASE_URL}assets/docs/contratos/juan.pdf`,
        },
      ],
    },
  ],
  users: {
    daniel: {
      id: "daniel",
      name: "Daniel",
      status: "Administrador",
      email: "admin@testing.som",
      phone: "+34 111 11 11 11",
      roles: ["admin"],
      avatar: `${import.meta.env.BASE_URL}assets/img/user/user-1.jpg`,
    },
    maría: {
      id: "maría",
      name: "María",
      status: "Dpto.Contabilidad",
      email: "maria@testing.som",
      phone: "+34 222 22 22 22",
      roles: ["member"],
      avatar: `${import.meta.env.BASE_URL}assets/img/user/user-12.jpg`,
    },
    pedro: {
      id: "pedro",
      name: "Pedro",
      status: "Dpto.Administración",
      email: "pedro@testing.som",
      phone: "+34 444 44 44 44",
      roles: ["member"],
      avatar: `${import.meta.env.BASE_URL}assets/img/user/user-11.jpg`,
    },
    yo: {
      id: "yo",
      name: "Tú",
      status: "Dpto.Informática",
      email: "yo@testing.som",
      phone: "+34 333 33 33 33",
      roles: ["member"],
      avatar: `${import.meta.env.BASE_URL}assets/img/user/user-8.jpg`,
    },
  },
  channelMembers: {
    general: ["daniel", "maría", "pedro", "yo"],
    sugerencias: ["daniel", "maría", "yo"],
    informatica: ["daniel", "yo"],
  },
  conversationMessages: {
    general: [
      {
        id: "g1",
        senderId: "daniel",
        content:
          "Bienvenidos al canal. Aquí podréis encontrar información relevante sobre la empresa para todos los trabajadores.",
        timestamp: "09:00 a. m.",
      },
    ],
    sugerencias: [
      {
        id: "s1",
        senderId: "daniel",
        content: "Bienvenidos al canal para enviar sugerencias.",
        timestamp: "09:00 a. m.",
      },
      {
        id: "s2",
        senderId: "yo",
        content: "Buen día a todos.",
        timestamp: "09:05 a. m.",
      },
      {
        id: "s3",
        senderId: "daniel",
        content: "Hola Nacho, bienvenido.",
        timestamp: "09:15 a. m.",
      },
      {
        id: "s4",
        senderId: "maría",
        content: "Muy buenos días.",
        timestamp: "09:15 a. m.",
      },
      {
        id: "s5",
        senderId: "daniel",
        content: "Hola María, bienvenida.",
        timestamp: "09:15 a. m.",
      },
    ],
    informatica: [
      {
        id: "i1",
        senderId: "yo",
        content: "¿Alguien ha fomateado el pc de la sala 3?",
        timestamp: "10:00 a. m.",
      },
      {
        id: "i2",
        senderId: "daniel",
        content: "No, esta previsto hacerlo mañana.",
        timestamp: "10:15 a. m.",
      },
    ],
    "chat-daniel": [
      {
        id: "c1",
        senderId: "daniel",
        content: "Hola, ¿cómo estás?",
        timestamp: "11:00 a. m.",
      },
      {
        id: "c2",
        senderId: "yo",
        content: "Bien, gracias. ¿Y tú?",
        timestamp: "11:02 a. m.",
      },
    ],
    "chat-maria": [
      {
        id: "c3",
        senderId: "maría",
        content: "¿Podemos vernos esta tarde?",
        timestamp: "12:00 p. m.",
      },
    ],
  },
};

export default mockMessengerDataEs;
