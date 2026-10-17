import { NextResponse } from "next/server";
import { recordRightsOnChain } from "@/lib/stellar/soroban-backend";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      workId,
      eventId,
      eventType,
      actor,
      recipient,
      terms,
      effectiveDate,
    } = body;

    if (!workId || !eventId || !eventType || !actor) {
      return NextResponse.json(
        { error: "workId, eventId, eventType y actor son obligatorios." },
        { status: 400 },
      );
    }

    const result = await recordRightsOnChain({
      workId,
      eventId,
      eventType,
      actor,
      recipient: recipient || "No especificado",
      terms: terms || "Sin términos adicionales",
      effectiveDate: effectiveDate || new Date().toISOString().split("T")[0],
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "No se pudo registrar el evento de derechos en Soroban.",
          contractId: STELLAR_CONFIG.contractId,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      explorerUrl: result.explorerUrl,
      contractId: STELLAR_CONFIG.contractId,
      contractData: result.data,
      network: STELLAR_CONFIG.network,
      timestamp: result.data?.recorded_at
        ? new Date(result.data.recorded_at * 1000).toISOString()
        : new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
