import type { RightsEvent } from "@/types/rights-event";
import type { Work } from "@/types/work";

const demoHash = "6f0a7c2d47e19b3a8c5d20f6e14a9b73d8c21f5a96e0b4c7d13a8f2e5b79c046";
const demoRegistrationTransactionId =
  "mock_testnet_tx_8c1e7a4d90b3f2e65a1c8d47b9e0f326c5a8d14e7f2b90c36a5e18d4f7b2c609";

export const demoWork: Work = {
  id: "TLM-2026-001234",
  title: "Rebozo Tradicional en Telar de Cintura y Tintes Naturales",
  type: "textile",
  author: "Maestra María Elena Gómez",
  authorRole: "artisan",
  technique: "Telar de cintura con urdimbre tradicional y teñido en grana cochinilla y añil",
  originCommunity: "Santa María del Río, San Luis Potosí, México",
  materials: "Seda criolla, tintes de grana cochinilla silvestre, cáscara de nogal y añil",
  masterTeacher: "Linaje familiar Gómez — 4ª generación de maestras tejedoras",
  commercialStatus: "available",
  price: "320 XLM",
  artisanContact: "contacto@tallergomez.mx / WhatsApp +52 444 812 3456",
  artisanWallet: "GBZXN7PIRZGNMHGA728R3U25XVTY2NM8VCL6QW3J7Z5X4C6V9B1K2L3M",
  description:
    "Pieza textil elaborada durante 6 meses mediante técnica ancestral de telar de cintura. Preserva el patrón iconográfico 'Flor de Granada', transmitido por tradición oral.",
  createdAt: "2026-09-27T14:30:00.000Z",
  registeredAt: "2026-09-27T14:32:00.000Z",
  filename: "rebozo_seda_telar_cintura.jpg",
  fileSize: "8.4 MB",
  fileMimeType: "image/jpeg",
  hash: demoHash,
  stellarTransactionId: demoRegistrationTransactionId,
  network: "testnet",
  status: "registered",
  notes: "Cápsula de saberes registrada con autorización de la asamblea del taller familiar.",
};

export const demoEvents: RightsEvent[] = [
  {
    id: "EVENT-2026-000001",
    workId: demoWork.id,
    type: "registration",
    actor: demoWork.author,
    effectiveDate: "2026-09-27T14:32:00.000Z",
    notes: "Registro de origen comunitario, técnica ancestral y metadatos de autoría artesanal.",
    stellarTransactionId: demoRegistrationTransactionId,
    createdAt: "2026-09-27T14:32:00.000Z",
  },
  {
    id: "EVENT-2026-000002",
    workId: demoWork.id,
    type: "evidence",
    actor: "TlamatiK",
    effectiveDate: "2026-09-27T14:33:00.000Z",
    notes: "Pasaporte cultural y huella criptográfica anclada a Stellar Testnet.",
    stellarTransactionId:
      "mock_testnet_tx_4a8e1c72d9b3f065e2a7c14d8f90b36c5e1a72d4f8b09c63e5a1d7f2c84b6903",
    createdAt: "2026-09-27T14:33:00.000Z",
  },
];
