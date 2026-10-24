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
  const safeNetwork = escapeHtml(work.network ? `Stellar ${work.network.toUpperCase()}` : "Stellar Testnet");
  const safeVerificationUrl = sanitizeUrl(verificationUrl);
  const safeTechnique = escapeHtml(work.technique ?? "Técnica tradicional");
  const safeOrigin = escapeHtml(work.originCommunity ?? "No especificada");
  const safeMaterials = escapeHtml(work.materials ?? "No especificados");
  const safeMaster = escapeHtml(work.masterTeacher ?? "Tradición oral / Linaje familiar");
  const safePrice = escapeHtml(work.price ?? "Consultar con creador");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pasaporte Cultural TolteK — ${safeId}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .cert-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 3px solid #000000;
      box-shadow: 8px 8px 0px #000000;
      padding: 48px;
    }
    .header {
      border-bottom: 2px solid #000000;
      padding-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .brand {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.06em;
      color: #0f172a;
    }
    .badge-demo {
      display: inline-block;
      background: #00f0ff;
      border: 2px solid #000000;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 5px 12px;
      text-transform: uppercase;
    }
    .cert-title {
      margin-top: 28px;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.04em;
      text-transform: uppercase;
    }
    .cert-subtitle {
      margin-top: 4px;
      font-size: 13px;
      color: #475569;
    }
    .cultural-strip {
      margin-top: 20px;
      background: #fef08a;
      border: 2px solid #000000;
      padding: 12px 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
      font-weight: 700;
    }
    .grid {
      margin-top: 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: 2px solid #000000;
      border-left: 2px solid #000000;
    }
    .grid-cell {
      border-right: 2px solid #000000;
      border-bottom: 2px solid #000000;
      padding: 12px 14px;
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
      margin-bottom: 3px;
    }
    .value {
      font-size: 13px;
      font-weight: 600;
      word-break: break-word;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    .notice-box {
      margin-top: 28px;
      border: 2px solid #000000;
      background: #f1f5f9;
      padding: 14px;
      font-size: 11px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 24px;
      border-top: 2px solid #000000;
      padding-top: 16px;
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
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="header">
      <div>
        <div class="brand">TolteK</div>
        <p style="font-size: 12px; color: #475569; font-weight: 600; margin-top: 2px;">
          Salvaguarda de Saberes de Oficio & Comercio Justo en Stellar
        </p>
      </div>
      <div class="badge-demo">PASAPORTE CULTURAL VERIFICABLE</div>
    </div>

    <h1 class="cert-title">Pasaporte de Autenticidad y Técnica de Oficio</h1>
    <p class="cert-subtitle">Acreditación inalterable del saber hacer artesanal anclada criptográficamente a la red Stellar.</p>

    <div class="cultural-strip">
      <span>🏺 COMUNIDAD: ${safeOrigin}</span>
      <span>🧵 TÉCNICA: ${safeTechnique}</span>
      <span>🪙 PRECIO ESTIMADO: ${safePrice}</span>
    </div>

    <div class="grid">
      <div class="grid-cell">
        <div class="label">TolteK ID</div>
        <div class="value mono">${safeId}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Fecha de Registro</div>
        <div class="value">${safeRegisteredAt}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Nombre de la Pieza</div>
        <div class="value">${safeTitle}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Artesano / Autor Declarado</div>
        <div class="value">${safeAuthor}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Rama u Oficio Artesanal</div>
        <div class="value" style="text-transform: capitalize;">${safeType}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Fecha de Creación</div>
        <div class="value">${safeCreatedAt}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Materiales e Insumos</div>
        <div class="value">${safeMaterials}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Linaje Formativo / Maestro</div>
        <div class="value">${safeMaster}</div>
      </div>
      <div class="grid-cell full">
        <div class="label">Descripción y Simbolismo Cultural</div>
        <div class="value">${safeDescription}</div>
      </div>
      <div class="grid-cell full">
        <div class="label">Huella Criptográfica SHA-256 (Proceso & Obra)</div>
        <div class="value mono">${safeHash}</div>
      </div>
      <div class="grid-cell full">
        <div class="label">Registro Inmutable en Stellar Testnet (Tx ID)</div>
        <div class="value mono">${safeTxId}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Red Blockchain</div>
        <div class="value">${safeNetwork}</div>
      </div>
      <div class="grid-cell">
        <div class="label">Estado de Autenticidad</div>
        <div class="value">CONFIRMADA EN STELLAR</div>
      </div>
      ${
        safeVerificationUrl
          ? `<div class="grid-cell full">
        <div class="label">Enlace de Verificación Pública (Escanear o Consultar)</div>
        <div class="value mono"><a href="${safeVerificationUrl}" style="color: #0f172a; text-decoration: underline;">${safeVerificationUrl}</a></div>
      </div>`
          : ""
      }
    </div>

    <div class="notice-box">
      <strong>SALVAGUARDA CONTRA LA APROPIACIÓN CULTURAL:</strong> Este pasaporte cultural TolteK certifica la técnica tradicional, los materiales originarios y el linaje formativo del artesano frente a falsificaciones industriales o apropiación indebida, garantizando la trazabilidad de autoría y el comercio justo.
      <br><br>
      <strong>AVISO IMPORTANTE DE ALCANCE:</strong> Este certificado ha sido expedido dentro de la demostración. Los datos se validan frente al almacenamiento y la red Stellar Testnet.
    </div>

    <div class="footer">
      <span>TolteK · Red Stellar × Hackathon Cultural</span>
      <span>Imprimible para adjuntar a la pieza artesanal física</span>
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
  anchor.download = `Pasaporte_Cultural_TolteK_${work.id}.html`;
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  window.setTimeout(() => {
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(objectUrl);
  }, 100);
}
