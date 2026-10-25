import type { StellarNetwork } from "./stellar";

export type WorkType =
  // Categorías de oficio tradicional y arte
  | "textile"
  | "pottery"
  | "woodwork"
  | "metalwork"
  | "painting"
  | "sculpture"
  | "music_dance"
  | "traditional_cuisine"
  | "craft_other"
  // Categorías generales / digitales
  | "photography"
  | "illustration"
  | "document"
  | "music"
  | "code"
  | "video"
  | "other";

export type AuthorRole =
  | "artisan"           // Artesano o artista directo
  | "collective"        // Taller familiar o cooperativa comunitaria
  | "cultural_promoter"; // Promotor cultural en representación del creador

export type CommercialStatus =
  | "available"   // Disponible para venta inmediata
  | "on_order"    // Elaboración sobre pedido
  | "private"     // Pieza patrimonial / Fuera de venta
  | "sold";       // Vendida / En colección

export type WorkStatus = "draft" | "processing" | "registered" | "verified";

export interface Work {
  id: string;
  title: string;
  type: WorkType;
  description: string;
  author: string;
  // Campos de Salvaguarda del Oficio y Patrimonio Cultural
  authorRole?: AuthorRole;
  technique?: string;        // ej: "Telar de cintura con urdimbre ancestral"
  originCommunity?: string;  // ej: "San Bartolo Coyotepec, Oaxaca"
  materials?: string;        // ej: "Barro negro, bruñido con cuarzo"
  masterTeacher?: string;    // Linaje / Maestro de quien aprendió el oficio
  // Campos de Comercialización y Comercio Justo
  commercialStatus?: CommercialStatus;
  price?: string;            // ej: "250 XLM" o "$3,200 MXN"
  artisanContact?: string;   // WhatsApp / Correo / Enlace de contacto
  artisanWallet?: string;    // Llave pública Stellar para pago directo sin comisiones
  // Metadatos de archivo y sistema
  createdAt?: string;
  registeredAt?: string;
  filename?: string;
  fileSize?: string;
  fileMimeType?: string;
  sourceUrl?: string;
  fileUrl?: string;
  notes?: string;
  hash?: string;
  stellarTransactionId?: string;
  network: StellarNetwork;
  status: WorkStatus;
}
