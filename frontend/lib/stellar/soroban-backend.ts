import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { STELLAR_CONFIG } from "./config";

const execFileAsync = promisify(execFile);

// Resolved path to stellar CLI executable
const STELLAR_BIN =
  process.env.STELLAR_BIN_PATH ||
  `${process.env.HOME || ""}/.local/bin/stellar` ||
  "stellar";

export interface RegisterWorkParams {
  workId: string;
  hash: string;
  author: string;
}

export interface RecordRightsParams {
  workId: string;
  eventId: string;
  eventType: string;
  actor: string;
  recipient: string;
  terms: string;
  effectiveDate: string;
}

export interface ContractWorkResult {
  author: string;
  hash: string;
  registered_at: number;
  work_id: string;
}

export interface ContractRightsEventResult {
  actor: string;
  effective_date: string;
  event_id: string;
  event_type: string;
  recipient: string;
  recorded_at: number;
  terms: string;
  work_id: string;
}

export interface ContractExecutionResult<T> {
  success: boolean;
  transactionId?: string;
  explorerUrl?: string;
  data?: T;
  error?: string;
}

/**
 * Executes a Stellar CLI contract invocation on Testnet
 */
export async function invokeContract<T>(
  fnName: string,
  args: Record<string, string>,
  sendTx = false,
): Promise<ContractExecutionResult<T>> {
  const cliArgs = [
    "contract",
    "invoke",
    "--id",
    STELLAR_CONFIG.contractId,
    "--source",
    "alice",
    "--network",
    STELLAR_CONFIG.network,
  ];

  if (sendTx) {
    cliArgs.push("--send=yes");
  }

  cliArgs.push("--", fnName);

  for (const [key, val] of Object.entries(args)) {
    cliArgs.push(`--${key}`, val);
  }

  try {
    const { stdout, stderr } = await execFileAsync(STELLAR_BIN, cliArgs, {
      env: {
        ...process.env,
        PATH: `${process.env.HOME}/.cargo/bin:${process.env.HOME}/.local/bin:${process.env.PATH}`,
      },
      timeout: 30000,
    });

    const combinedOutput = `${stdout}\n${stderr}`;

    // Extract transaction hash if present
    const txMatch =
      combinedOutput.match(/Signing transaction:\s*([a-f0-9]{64})/i) ||
      combinedOutput.match(/explorer\/testnet\/tx\/([a-f0-9]{64})/i);

    const transactionId = txMatch ? txMatch[1] : undefined;
    const explorerUrl = transactionId
      ? `${STELLAR_CONFIG.explorerTxBaseUrl}/${transactionId}`
      : undefined;

    // Parse JSON output from stdout
    let data: T | undefined;
    const lines = stdout.trim().split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.startsWith("{") || line.startsWith("[")) {
        try {
          data = JSON.parse(line) as T;
          break;
        } catch {
          // continue searching backwards
        }
      }
    }

    return {
      success: true,
      transactionId,
      explorerUrl,
      data,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Error invoking ${fnName}:`, errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Register a work on Soroban contract
 */
export async function registerWorkOnChain(
  params: RegisterWorkParams,
): Promise<ContractExecutionResult<ContractWorkResult>> {
  return invokeContract<ContractWorkResult>(
    "register_work",
    {
      work_id: params.workId,
      hash: params.hash,
      author: params.author,
    },
    true,
  );
}

/**
 * Record a rights event on Soroban contract
 */
export async function recordRightsOnChain(
  params: RecordRightsParams,
): Promise<ContractExecutionResult<ContractRightsEventResult>> {
  return invokeContract<ContractRightsEventResult>(
    "record_rights_event",
    {
      work_id: params.workId,
      event_id: params.eventId,
      event_type: params.eventType,
      actor: params.actor,
      recipient: params.recipient,
      terms: params.terms,
      effective_date: params.effectiveDate,
    },
    true,
  );
}

/**
 * Query a work from Soroban contract
 */
export async function getWorkFromChain(
  workId: string,
): Promise<ContractExecutionResult<ContractWorkResult | null>> {
  return invokeContract<ContractWorkResult | null>("get_work", {
    work_id: workId,
  });
}

/**
 * Query rights events from Soroban contract
 */
export async function getRightsEventsFromChain(
  workId: string,
): Promise<ContractExecutionResult<ContractRightsEventResult[]>> {
  return invokeContract<ContractRightsEventResult[]>("get_rights_events", {
    work_id: workId,
  });
}

/**
 * Verify a work on Soroban contract
 */
export async function verifyWorkOnChain(
  workId: string,
  hash: string,
): Promise<ContractExecutionResult<boolean>> {
  return invokeContract<boolean>("verify_work", {
    work_id: workId,
    hash,
  });
}
