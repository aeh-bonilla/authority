import { NextResponse } from "next/server";
import { registerWorkOnChain } from "@/lib/stellar/soroban-backend";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workId, hash, author } = body;

    if (!workId || !hash || !author) {
      return NextResponse.json(
        { error: "workId, hash y author son requeridos." },
        { status: 400 },
      );
    }

    const result = await registerWorkOnChain({ workId, hash, author });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "No se pudo registrar la obra en el contrato Soroban.",
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
      timestamp: result.data?.registered_at
        ? new Date(result.data.registered_at * 1000).toISOString()
        : new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
