import type { Work } from "@/types/work";

function escapeHtml(str: string | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeUrl(url: string | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return "";
}

export function generateCertificateHtml(work: Work, verificationUrl: string): string {
  const safeTitle = escapeHtml(work.title);
  const safeAuthor = escapeHtml(work.author);
  const safeId = escapeHtml(work.id);
  const safeType = escapeHtml(work.type);
  const safeDescription = escapeHtml(work.description);
  const safeCreatedAt = escapeHtml(work.createdAt ?? "No especificada");
  const safeRegisteredAt = escapeHtml(work.registeredAt ?? new Date().toISOString());
  const safeHash = escapeHtml(work.hash ?? "No disponible");
  const safeTxId = escapeHtml(work.stellarTransactionId ?? "No disponible");
  const safeNetwork = escapeHtml(work.network ? `Stellar ${work.network.toUpperCase()} (Mock)` : "Stellar Testnet (Mock)");
  const safeVerificationUrl = sanitizeUrl(verificationUrl);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado Authory — ${safeId}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f7f7f7;
      color: #0f172a;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .cert-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 3px solid #000000;
      box-shadow: 8px 8px 0px #000000;
      padding: 48px;
    }
    .header {
      border-bottom: 2px solid #000000;
      padding-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .brand {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.05em;
    }
    .badge-demo {
      display: inline-block;
      background: #00f0ff;
      border: 2px solid #000000;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      text-transform: uppercase;
    }
    .cert-title {
      margin-top: 32px;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.03em;
      text-transform: uppercase;
    }
    .cert-subtitle {
      margin-top: 6px;
      font-size: 13px;
      color: #475569;
    }
    .grid {
      margin-top: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: 2px solid #000000;
      border-left: 2px solid #000000;
    }
    .grid-cell {
      border-right: 2px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 14px 16px;
    }
    .grid-cell.full {
      grid-column: span 2;
    }
    .label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .value {
      font-size: 13px;
      font-weight: 600;
      word-break: break-all;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    .notice-box {
      margin-top: 36px;
      border: 2px solid #000000;
      background: #fef08a;
      padding: 16px;
      font-size: 11px;
      line-height: 1.6;
    }
    .notice-box strong {
      font-weight: 800;
    }
    .footer {
      margin-top: 32px;
      border-top: 2px solid #000000;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .cert-container {
        border: 2px solid #000000;
        box-shadow: none;
        padding: 30px;
      }
      .notice-box {
        background: #f1f5f9;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="header">
      <div>
        <div class="brand">AUTHORY</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Protocolo de Prueba de Autoría y Trazabilidad</p>
      </div>
      <div class="badge-demo">CERTIFICADO DE DEMOSTRACIÓN</div>
    </div>

    <h1 class="cert-title">Certificado de Registro y Evidencia</h1>
    <p class="cert-subtitle">Acreditación local generada para la obra referenciada a continuación.</p>

    <div class="grid">
      <div class="grid-cell">
        <div class="label">Authory ID</div>
        <div class="value">${safeId}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Fecha de Registro</div>
        <div class="value">${safeRegisteredAt}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Título de la Obra</div>
        <div class="value">${safeTitle}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Autor / Titular Declarado</div>
        <div class="value">${safeAuthor}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Tipo de Obra</div>
        <div class="value" style="text-transform: capitalize;">${safeType}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Fecha Declarada de Creación</div>
        <div class="value">${safeCreatedAt}</div>
      </div>
      <div class="grid-cell full">
        <div class="label">Descripción de la Obra</div>
        <div class="value">${safeDescription}</div>
      </div>
      <div class="grid-cell full">
        <div class="label">Hash Criptográfico Simulado</div>
        <div class="value mono">${safeHash}</div>
      </div>
      <div class="grid-cell full">
        <div class="label">Transacción Simulado en Stellar</div>
        <div class="value mono">${safeTxId}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Red de Registro</div>
        <div class="value">${safeNetwork}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Estado de Evidencia</div>
        <div class="value">CONFIRMADA (SIMULADA)</div>
      </div>
      ${
        safeVerificationUrl
          ? `<div class="grid-cell full">
        <div class="label">Enlace de Verificación Local</div>
        <div class="value mono"><a href="${safeVerificationUrl}" style="color: #0f172a; text-decoration: underline;">${safeVerificationUrl}</a></div>
      </div>`
          : ""
      }
    </div>

    <div class="notice-box">
      <strong>AVISO IMPORTANTE DE ALCANCE:</strong> Este certificado ha sido expedido dentro de la demostración funcional local de Authory. Los datos provienen del almacenamiento local del navegador y la transacción en Stellar Testnet es una simulación. Este documento no constituye una certificación notarial, no prueba identidad civil del autor ni garantiza inmutabilidad en una red descentralizada pública.
    </div>

    <div class="footer">
      <span>Authory Demo · Semana 3</span>
      <span>Imprimible o guardable en PDF mediante el navegador</span>
    </div>
  </div>
</body>
</html>`;
}

export function downloadDemoCertificate(work: Work, verificationUrl: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const html = generateCertificateHtml(work, verificationUrl);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const objectUrl = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `Certificado_Authory_${work.id}.html`;
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  window.setTimeout(() => {
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(objectUrl);
  }, 100);
}
