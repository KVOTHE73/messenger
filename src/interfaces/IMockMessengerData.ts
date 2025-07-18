// ===================================================================================
// 🔷 INTERFACE: IMockMessengerData
//    💡 Define la estructura completa de los datos de mensajería usados como mock
// ===================================================================================

/**
 * Representa un mensaje individual dentro de una conversación.
 */
export interface IMessage {
  /** ID único del mensaje */
  id: string;
  /** ID del usuario que lo envió (ej: "yo", "daniel", etc.) */
  senderId: string;
  /** Texto del mensaje (si es mensaje normal) */
  content?: string;
  /** Texto del mensaje (si es mensaje mockeado aleatorio) */
  contentKey?: string;
  /** Emoji enviado (si es solo un emoji) */
  emoji?: string;
  /** Hora del mensaje en formato "HH:mm" */
  timestamp: string;
  /** URL del archivo enviado, si lo hay */
  fileUrl?: string;
  /** Nombre del archivo enviado */
  fileName?: string;
}

/**
 * Representa un archivo dentro de una carpeta de documentos.
 */
export interface IDocFile {
  /** ID único del archivo */
  id: string;
  /** Nombre del archivo */
  name: string;
  /** Ruta del archivo para descarga o visualización */
  url: string;
}

/**
 * Representa una carpeta de documentos, que contiene archivos adjuntos.
 */
export interface IDocFolder {
  /** ID único de la carpeta */
  id: string;
  /** Nombre de la carpeta */
  name: string;
  /** Archivos dentro de la carpeta */
  files: IDocFile[];
}

/**
 * Representa un usuario que puede participar en canales o chats.
 */
export interface IUser {
  /** ID del usuario */
  id: string;
  /** Nombre mostrado del usuario */
  name: string;
  /** Email mostrado del usuario */
  email: string;
  /** Teéfono mostrado del usuario */
  phone: string;
  /** Rol mostrado del usuario */
  roles: [string];
  /** URL del avatar o imagen de perfil */
  avatar: string;
  /** Estado opcional del usuario (ej: "Disponible", "Ocupado") */
  status?: string;
}

/**
 * Representa una conversación privada entre dos usuarios.
 */
export interface IPrivateConversation {
  /** ID único de la conversación */
  id: string;
  /** Array de IDs de participantes (siempre 2 en privado) */
  participants: string[];
}

/**
 * Representa un canal o grupo (estructura común).
 */
export interface IChannel {
  /** ID único del canal o grupo */
  id: string;
  /** Nombre del canal/grupo */
  name: string;
  /** Descripción breve o tooltip */
  description: string;
  /** Icono asociado (nombre de icono Iconify) */
  icon: string;
}

/**
 * Estructura general del mock de datos de mensajería.
 * Este objeto es devuelto por `mockMessengerDataEs.ts` y `mockMessengerDataEn.ts`.
 */
export interface IMockMessengerData {
  /** Lista de canales disponibles */
  channels: IChannel[];

  /** Lista de grupos disponibles */
  groups: IChannel[];

  /** Conversaciones privadas del usuario actual */
  privateConversations: IPrivateConversation[];

  /** Carpetas de documentos compartidos */
  docFolders: IDocFolder[];

  /** Mapa de usuarios indexado por ID */
  users: Record<string, IUser>;

  /** Mapa de miembros por canal/grupo (IDs de usuario) */
  channelMembers: Record<string, string[]>;

  /** Mapa de mensajes por ID de canal/conversación */
  conversationMessages: Record<string, IMessage[]>;
}

/**
 * Representa al usuario de una conversación privada.
 */
export interface IPrivateItem {
  /** ID único del canal o grupo */
  id: string;
  /** Nombre del canal/grupo */
  name: string;
  /** URL del avatar o imagen de perfil */
  avatar: string;
}

/**
 * Representa al canal de docs.
 */
export interface IDocFolder {
  /** ID único del canal o grupo */
  id: string;
  /** Nombre del canal/grupo */
  name: string;
}
