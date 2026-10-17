import type { StellarNetwork } from "./stellar";

export type WorkType =
  | "photography"
  | "illustration"
  | "document"
  | "music"
  | "code"
  | "video"
  | "other";

export type WorkStatus = "draft" | "processing" | "registered" | "verified";

export interface Work {
  id: string;
  title: string;
  type: WorkType;
  description: string;
  author: string;
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
