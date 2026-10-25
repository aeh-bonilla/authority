import { getWork } from "@/lib/storage";
import type { RightsEvent } from "@/types/rights-event";
import type {
  StellarEvidence,
  VerificationInput,
  VerificationResult,
} from "@/types/stellar";
import type { Work } from "@/types/work";

const testnet = "testnet" as const;
const mockDelayMs = 350;
let sequence = 0;

const evidenceByWorkId = new Map<string, StellarEvidence>();
const evidenceByHash = new Map<string, StellarEvidence>();
const rightsEvidenceByHash = new Map<string, StellarEvidence>();

function createHexValue(length: number): string {
  sequence += 1;
  const seed = `${Date.now().toString(16)}${sequence.toString(16)}${Math.random()
    .toString(16)
    .slice(2)}`;
  let value = "";

  while (value.length < length) {
    value += seed;
  }

  return value.slice(0, length);
}

function storeEvidence(
  evidence: StellarEvidence,
  setWorkReference = true,
): StellarEvidence {
  if (setWorkReference) {
    evidenceByWorkId.set(evidence.workId, evidence);
  }

  evidenceByHash.set(evidence.hash, evidence);
  return evidence;
}

function waitForMockLedger(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, mockDelayMs);
  });
}

function getVerificationInput(input: string | VerificationInput): VerificationInput {
  if (typeof input === "string") {
    const trimmed = input.trim();
    return trimmed.length === 64 ? { hash: trimmed.toLowerCase() } : { workId: trimmed };
  }

  return {
    ...(input.workId ? { workId: input.workId.trim() } : {}),
    ...(input.hash ? { hash: input.hash.trim().toLowerCase() } : {}),
  };
}

export function createMockTlamatikId(): string {
  const year = new Date().getUTCFullYear();
  sequence += 1;
  const suffix = ((Date.now() + sequence) % 1_000_000)
    .toString()
    .padStart(6, "0");
  return `TLM-${year}-${suffix}`;
}

export const createMockToltekId = createMockTlamatikId;
export const createMockAuthoryId = createMockTlamatikId;

export function generateMockHash(): string {
  return createHexValue(64);
}

export function generateMockTransactionId(): string {
  return `mock_testnet_tx_${createHexValue(64)}`;
}

export async function createMockEvidence(work: Work): Promise<StellarEvidence> {
  await waitForMockLedger();

  const evidence = storeEvidence({
    workId: work.id,
    hash: work.hash ?? generateMockHash(),
    transactionId: generateMockTransactionId(),
    network: testnet,
    registeredAt: new Date().toISOString(),
    status: "confirmed",
  });

  return evidence;
}

export async function verifyMockEvidence(
  input: string | VerificationInput,
): Promise<VerificationResult> {
  await waitForMockLedger();
  const { workId, hash } = getVerificationInput(input);

  // Reject rights event hashes when verifying works
  if (hash && rightsEvidenceByHash.has(hash)) {
    return {
      verified: false,
      hash,
      message:
        "El hash ingresado corresponde a un registro de derechos o licencia, no a la evidencia principal de una obra.",
    };
  }

  const work = getWork();

  // Strict match rules:
  // If both workId and hash are supplied, BOTH must match the active work.
  if (workId && hash) {
    if (work.id !== workId || work.hash?.toLowerCase() !== hash) {
      return {
        verified: false,
        workId,
        hash,
        message:
          "El identificador y el hash no corresponden a la misma obra en el registro local.",
      };
    }
  } else if (workId) {
    if (work.id !== workId) {
      return {
        verified: false,
        workId,
        message:
          "No se encontró evidencia para el Authory ID proporcionado en el registro local.",
      };
    }
  } else if (hash) {
    if (work.hash?.toLowerCase() !== hash) {
      return {
        verified: false,
        hash,
        message:
          "No se encontró evidencia para el hash simulado proporcionado en el registro local.",
      };
    }
  } else {
    return {
      verified: false,
      message: "Indica un Authory ID o un hash simulado para verificar.",
    };
  }

  if (!work.hash || !work.stellarTransactionId || !work.registeredAt) {
    return {
      verified: false,
      workId: work.id,
      message: "La obra no cuenta con evidencia completa registrada en el entorno simulado.",
    };
  }

  const evidence: StellarEvidence = {
    workId: work.id,
    hash: work.hash,
    transactionId: work.stellarTransactionId,
    network: work.network,
    registeredAt: work.registeredAt,
    status: "confirmed",
  };

  return {
    verified: true,
    workId: work.id,
    hash: work.hash,
    evidence,
    message: "Evidencia verificada exitosamente en la simulación de Stellar Testnet.",
  };
}

export async function createMockRightsEvidence(
  event: RightsEvent,
): Promise<StellarEvidence> {
  await waitForMockLedger();

  const hash = generateMockHash();
  const evidence: StellarEvidence = {
    workId: event.workId,
    hash,
    transactionId: generateMockTransactionId(),
    network: testnet,
    registeredAt: new Date().toISOString(),
    status: "confirmed",
  };

  rightsEvidenceByHash.set(hash, evidence);
  return evidence;
}
