import { NextResponse } from "next/server";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export async function GET() {
  return NextResponse.json({
    status: "online",
    network: STELLAR_CONFIG.network,
    contractId: STELLAR_CONFIG.contractId,
    wasmHash: STELLAR_CONFIG.wasmHash,
    contractExplorer: `${STELLAR_CONFIG.explorerContractBaseUrl}/${STELLAR_CONFIG.contractId}`,
    labExplorer: `${STELLAR_CONFIG.stellarLabContractUrl}/${STELLAR_CONFIG.contractId}`,
    sorobanRpcUrl: STELLAR_CONFIG.sorobanRpcUrl,
  });
}
