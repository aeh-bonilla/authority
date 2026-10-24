import { NextResponse } from "next/server";
import {
  getWorkFromChain,
  getRightsEventsFromChain,
} from "@/lib/stellar/soroban-backend";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workId, hash } = body;

    if (!workId && !hash) {
      return NextResponse.json(
        { verified: false, message: "Debe ingresar al menos un Authory ID o un Hash." },
        { status: 400 },
      );
    }

    if (workId) {
      const workResult = await getWorkFromChain(workId);
      if (!workResult.success || !workResult.data) {
        return NextResponse.json({
          verified: false,
          workId,
          hash,
          contractId: STELLAR_CONFIG.contractId,
          message: "No se encontró registro para el identificador en el contrato inteligente de Stellar.",
        });
      }

      const onChainRecord = workResult.data;
      if (hash && onChainRecord.hash.toLowerCase() !== hash.toLowerCase()) {
        return NextResponse.json({
          verified: false,
          workId,
          hash,
          contractId: STELLAR_CONFIG.contractId,
          message: "El hash ingresado no coincide con la huella registrada en el ledger de Stellar para esta obra.",
        });
      }

      // Fetch rights events for full audit
      const eventsResult = await getRightsEventsFromChain(workId);
      const registeredAtIso = onChainRecord.registered_at
        ? new Date(onChainRecord.registered_at * 1000).toISOString()
        : new Date().toISOString();

      return NextResponse.json({
        verified: true,
        workId: onChainRecord.work_id,
        hash: onChainRecord.hash,
        contractId: STELLAR_CONFIG.contractId,
        author: onChainRecord.author,
        registeredAt: registeredAtIso,
        rightsEvents: eventsResult.data || [],
        evidence: {
          workId: onChainRecord.work_id,
          hash: onChainRecord.hash,
          contractId: STELLAR_CONFIG.contractId,
          network: STELLAR_CONFIG.network,
          registeredAt: registeredAtIso,
          status: "confirmed",
        },
        message: "Evidencia verificada exitosamente en el Smart Contract de Soroban (Stellar Testnet).",
      });
    }

    // Only hash provided: we can't iterate all storage without an indexer, but report verifiable notice
    return NextResponse.json({
      verified: false,
      hash,
      contractId: STELLAR_CONFIG.contractId,
      message: "Para auditar en el Smart Contract de Soroban, proporcione el Authory ID de la obra junto al hash o archivo.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ verified: false, error: message }, { status: 500 });
  }
}
