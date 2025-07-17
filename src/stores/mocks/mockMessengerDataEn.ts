import type { IMockMessengerData } from "../../interfaces/IMockMessengerData";

const mockMessengerDataEn: IMockMessengerData = {
  channels: [
    {
      id: "general",
      name: "General",
      description: "Company's general channel",
      icon: "carbon:chat",
    },
    {
      id: "sugerencias",
      name: "Inbox",
      description: "Company's suggestions inbox",
      icon: "carbon:idea",
    },
  ],
  groups: [
    {
      id: "informatica",
      name: "IT",
      description: "IT Department channel",
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
      name: "Payslips",
      files: [
        {
          id: "n1",
          name: "Payslip January 2025.pdf",
          url: "/docs/nominas/ene2025.pdf",
        },
        {
          id: "n2",
          name: "Payslip February 2025.pdf",
          url: "/docs/nominas/feb2025.pdf",
        },
      ],
    },
    {
      id: "contratos",
      name: "Contracts",
      files: [
        {
          id: "c1",
          name: "Contract Juan Pérez.pdf",
          url: "/docs/contratos/juan.pdf",
        },
      ],
    },
  ],
  users: {
    daniel: {
      id: "daniel",
      name: "Daniel",
      status: "Administrator",
      email: "admin@testing.som",
      phone: "+34 111 11 11 11",
      roles: ["admin"],
      avatar: "/assets/img/user/user-1.jpg",
    },
    maría: {
      id: "maría",
      name: "Maria",
      status: "Accounting Dept.",
      email: "maria@testing.som",
      phone: "+34 222 22 22 22",
      roles: ["member"],
      avatar: "/assets/img/user/user-12.jpg",
    },
    pedro: {
      id: "pedro",
      name: "Pedro",
      status: "Administration Dept.",
      email: "pedro@testing.som",
      phone: "+34 444 44 44 44",
      roles: ["member"],
      avatar: "/assets/img/user/user-11.jpg",
    },
    yo: {
      id: "yo",
      name: "You",
      status: "IT Dept.",
      email: "yo@testing.som",
      phone: "+34 333 33 33 33",
      roles: ["member"],
      avatar: "/assets/img/user/user-8.jpg",
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
          "Welcome to the channel. Here you'll find relevant information about the company for all employees.",
        timestamp: "09:00 a. m.",
      },
    ],
    sugerencias: [
      {
        id: "s1",
        senderId: "daniel",
        content: "Welcome to the suggestion box channel.",
        timestamp: "09:00 a. m.",
      },
      {
        id: "s2",
        senderId: "yo",
        content: "Good morning, everyone.",
        timestamp: "09:05 a. m.",
      },
      {
        id: "s3",
        senderId: "daniel",
        content: "Hi Nacho, welcome.",
        timestamp: "09:15 a. m.",
      },
      {
        id: "s4",
        senderId: "maría",
        content: "Very good morning.",
        timestamp: "09:15 a. m.",
      },
      {
        id: "s5",
        senderId: "daniel",
        content: "Hi Maria, welcome.",
        timestamp: "09:15 AM",
      },
    ],
    informatica: [
      {
        id: "i1",
        senderId: "yo",
        content: "Has anyone formatted the PC in room 3?",
        timestamp: "10:00 a. m.",
      },
      {
        id: "i2",
        senderId: "daniel",
        content: "No, it's scheduled for tomorrow.",
        timestamp: "10:15 a. m.",
      },
    ],
    "chat-daniel": [
      {
        id: "c1",
        senderId: "daniel",
        content: "Hi, how are you?",
        timestamp: "11:00 a. m.",
      },
      {
        id: "c2",
        senderId: "yo",
        content: "Fine, thanks. And you?",
        timestamp: "11:02 a. m.",
      },
    ],
    "chat-maria": [
      {
        id: "c3",
        senderId: "maría",
        content: "Can we meet this afternoon?",
        timestamp: "12:00 p. m.",
      },
    ],
  },
};

export default mockMessengerDataEn;
