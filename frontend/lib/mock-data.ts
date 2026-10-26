import type { RightsEvent } from "@/types/rights-event";
import type { Work } from "@/types/work";

const demoHash = "6f0a7c2d47e19b3a8c5d20f6e14a9b73d8c21f5a96e0b4c7d13a8f2e5b79c046";
const demoRegistrationTransactionId =
  "mock_testnet_tx_8c1e7a4d90b3f2e65a1c8d47b9e0f326c5a8d14e7f2b90c36a5e18d4f7b2c609";

export const demoWork: Work = {
  id: "AUTH-2026-001234",
  title: "Horizontes de la Ciudad",
  type: "photography",
  author: "Daniela Ramírez Cortés",
  description:
    "Serie fotográfica que explora la relación entre la arquitectura urbana y la vida cotidiana en la ciudad.",
  createdAt: "2026-09-27T14:30:00.000Z",
  registeredAt: "2026-09-27T14:32:00.000Z",
  filename: "horizontes_ciudad.jpg",
  fileSize: "12.4 MB",
  fileMimeType: "image/jpeg",
  hash: demoHash,
  stellarTransactionId: demoRegistrationTransactionId,
  network: "testnet",
  status: "registered",
};

export const demoEvents: RightsEvent[] = [
  {
    id: "EVENT-2026-000001",
    workId: demoWork.id,
    type: "registration",
    actor: demoWork.author,
    effectiveDate: "2026-09-27T14:32:00.000Z",
    notes: "Registro inicial de la obra y de sus metadatos de autoría.",
    stellarTransactionId: demoRegistrationTransactionId,
    createdAt: "2026-09-27T14:32:00.000Z",
  },
  {
    id: "EVENT-2026-000002",
    workId: demoWork.id,
    type: "evidence",
    actor: "Authory",
    effectiveDate: "2026-09-27T14:33:00.000Z",
    notes: "Evidencia de huella criptográfica confirmada en Stellar Testnet simulada.",
    stellarTransactionId:
      "mock_testnet_tx_4a8e1c72d9b3f065e2a7c14d8f90b36c5e1a72d4f8b09c63e5a1d7f2c84b6903",
    createdAt: "2026-09-27T14:33:00.000Z",
  },
];
