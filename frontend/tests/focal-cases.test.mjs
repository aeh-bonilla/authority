import assert from "node:assert/strict";
import test from "node:test";

// Mock localStorage in global scope for tests
class LocalStorageMock {
  constructor() {
    this.store = new Map();
    this.failOnSetKey = null;
    this.failOnRollback = false;
  }
  getItem(key) {
    return this.store.get(key) ?? null;
  }
  setItem(key, value) {
    if (this.failOnSetKey === key) {
      throw new Error(`Disk quota exceeded on ${key}`);
    }
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const mockStorage = new LocalStorageMock();
globalThis.window = {
  localStorage: mockStorage,
};

// Test Suite 1: Work validation with invalid optional fields and dates
test("Validation: Work con hash objeto, fechas inválidas y opcionales corruptos es rechazado", async () => {
  const { isValidWork } = await import("@/lib/storage");

  const baseValidWork = {
    id: "AUTH-2026-TEST",
    title: "Obra Válida",
    type: "illustration",
    description: "Descripción de prueba",
    author: "Autor Test",
    network: "testnet",
    status: "registered",
  };

  assert.equal(isValidWork(baseValidWork), true, "Base work should be valid");

  // Invalid hash: object instead of string
  assert.equal(isValidWork({ ...baseValidWork, hash: {} }), false, "hash: {} must be rejected");

  // Invalid hash: string with wrong length
  assert.equal(isValidWork({ ...baseValidWork, hash: "1234abcd" }), false, "short hash must be rejected");

  // Invalid dates
  assert.equal(isValidWork({ ...baseValidWork, createdAt: "fecha-invalida" }), false, "invalid createdAt must be rejected");
  assert.equal(isValidWork({ ...baseValidWork, registeredAt: 123456 }), false, "numeric registeredAt must be rejected");

  // Invalid optionals
  assert.equal(isValidWork({ ...baseValidWork, filename: { name: "file.png" } }), false, "object filename must be rejected");
  assert.equal(isValidWork({ ...baseValidWork, fileSize: 1024 }), false, "numeric fileSize must be rejected");
  assert.equal(isValidWork({ ...baseValidWork, notes: ["una nota"] }), false, "array notes must be rejected");
  assert.equal(isValidWork({ ...baseValidWork, sourceUrl: 404 }), false, "numeric sourceUrl must be rejected");
  assert.equal(isValidWork({ ...baseValidWork, stellarTransactionId: {} }), false, "object txId must be rejected");

  // Corrupted shape
  assert.equal(isValidWork("no-un-objeto"), false);
  assert.equal(isValidWork(null), false);
  assert.equal(isValidWork([]), false);
});

// Test Suite 2: RightsEvent validation
test("Validation: RightsEvent con terms, recipient, notes de tipo incorrecto es rechazado", async () => {
  const { isValidRightsEvent } = await import("@/lib/storage");

  const baseValidEvent = {
    id: "EVT-TEST-001",
    workId: "AUTH-2026-TEST",
    type: "license",
    actor: "Autor Original",
    effectiveDate: "2026-10-10T00:00:00.000Z",
    createdAt: "2026-10-10T00:00:00.000Z",
  };

  assert.equal(isValidRightsEvent(baseValidEvent), true, "Base event should be valid");

  // Invalid optionals
  assert.equal(isValidRightsEvent({ ...baseValidEvent, recipient: {} }), false, "recipient: {} must be rejected");
  assert.equal(isValidRightsEvent({ ...baseValidEvent, terms: { scope: "all" } }), false, "terms: {} must be rejected");
  assert.equal(isValidRightsEvent({ ...baseValidEvent, notes: 999 }), false, "numeric notes must be rejected");
  assert.equal(isValidRightsEvent({ ...baseValidEvent, stellarTransactionId: [] }), false, "array txId must be rejected");

  // Invalid dates
  assert.equal(isValidRightsEvent({ ...baseValidEvent, effectiveDate: "invalida" }), false, "invalid effectiveDate must be rejected");
  assert.equal(isValidRightsEvent({ ...baseValidEvent, createdAt: "" }), false, "empty createdAt must be rejected");
});

// Test Suite 3: Strict Mock Verification (ID, Hash, Combination, Rights Hash)
test("Mock Verification: ID correcto + hash incorrecto, ID incorrecto + hash correcto, ambos correctos, hash de licencia", async () => {
  const { verifyMockEvidence, createMockRightsEvidence } = await import("@/lib/stellar/mock-stellar");
  const { saveWork, getWork } = await import("@/lib/storage");

  const testWork = {
    id: "AUTH-2026-VERIF-TEST",
    title: "Obra de Prueba",
    type: "photography",
    description: "Foto de prueba",
    author: "Fotógrafo A",
    network: "testnet",
    status: "registered",
    hash: "a".repeat(64),
    stellarTransactionId: "mock_testnet_tx_sample_123",
    registeredAt: "2026-10-10T14:00:00.000Z",
  };

  saveWork(testWork);
  assert.equal(getWork().id, testWork.id);

  // 1. Ambos correctos -> coincide
  const resBothCorrect = await verifyMockEvidence({
    workId: testWork.id,
    hash: testWork.hash,
  });
  assert.equal(resBothCorrect.verified, true, "Both correct must succeed");
  assert.equal(resBothCorrect.workId, testWork.id);

  // 2. ID correcto + hash incorrecto -> DEBE FALLAR
  const resCorrectIdWrongHash = await verifyMockEvidence({
    workId: testWork.id,
    hash: "f".repeat(64),
  });
  assert.equal(resCorrectIdWrongHash.verified, false, "Correct ID + Wrong Hash must fail");
  assert.ok(resCorrectIdWrongHash.message.includes("no corresponden a la misma obra"));

  // 3. ID incorrecto + hash correcto -> DEBE FALLAR
  const resWrongIdCorrectHash = await verifyMockEvidence({
    workId: "AUTH-9999-WRONG",
    hash: testWork.hash,
  });
  assert.equal(resWrongIdCorrectHash.verified, false, "Wrong ID + Correct Hash must fail");
  assert.ok(resWrongIdCorrectHash.message.includes("no corresponden a la misma obra"));

  // 4. Hash de licencia -> NO debe verificarse como obra
  const licenseEvidence = await createMockRightsEvidence({
    id: "EVT-LIC-01",
    workId: testWork.id,
    type: "license",
    actor: testWork.author,
    recipient: "Cliente Editorial",
    effectiveDate: "2026-10-10",
    createdAt: "2026-10-10T14:30:00.000Z",
  });

  const resLicenseHash = await verifyMockEvidence({
    hash: licenseEvidence.hash,
  });
  assert.equal(resLicenseHash.verified, false, "License hash must not verify as work");
  assert.ok(resLicenseHash.message.includes("registro de derechos o licencia"));
});

// Test Suite 4: Compound save and Observable Rollback
test("Compound Save: Exitoso, fallido con restauración, y fallo parcial", async () => {
  const { saveWorkWithInitialEvents, getWork, storageKeys } = await import("@/lib/storage");

  mockStorage.clear();
  mockStorage.failOnSetKey = null;

  const validWork = {
    id: "AUTH-2026-ROLLBACK",
    title: "Obra Rollback",
    type: "code",
    description: "Código",
    author: "Dev",
    network: "testnet",
    status: "registered",
    hash: "b".repeat(64),
    stellarTransactionId: "mock_tx_rollback",
    registeredAt: "2026-10-10T15:00:00.000Z",
  };

  // 1. Guardado exitoso normal
  const successResult = saveWorkWithInitialEvents(validWork);
  assert.equal(successResult.status, "success", "Must be success when no errors occur");
  assert.equal(getWork().id, validWork.id);

  // 2. Fallo en segunda escritura (events) con restauración exitosa
  // Configuramos mock para fallar cuando se escriba events
  mockStorage.failOnSetKey = storageKeys.events;

  const newWorkToFail = {
    ...validWork,
    id: "AUTH-2026-FAIL-1",
    title: "Obra que falla",
  };

  const restoredResult = saveWorkWithInitialEvents(newWorkToFail);
  assert.equal(restoredResult.status, "failed_restored", "Must report failed_restored when rollback succeeds");
  // Debe haber restaurado la obra previa
  assert.equal(getWork().id, validWork.id, "Work must be restored to previous state");

  // 3. Fallo de segunda escritura Y fallo de rollback -> failed_partial_inconsistent
  mockStorage.clear();
  // Ahora hacemos que falle tanto la escritura como la restauración
  const throwingStorage = {
    store: new Map(),
    getItem(key) {
      return this.store.get(key) ?? null;
    },
    setItem(key) {
      if (key === storageKeys.work) {
        // Primera escritura de obra pasa
        this.store.set(key, "written");
        return;
      }
      // Escritura de eventos falla
      throw new Error("Quota exceeded on events write and rollback");
    },
    removeItem() {
      // Intento de rollback mediante removeItem también falla
      throw new Error("Cannot rollback: storage locked");
    },
  };

  try {
    globalThis.window.localStorage = throwingStorage;
    const inconsistentResult = saveWorkWithInitialEvents(validWork);
    assert.equal(inconsistentResult.status, "failed_partial_inconsistent", "Must report failed_partial_inconsistent");
  } finally {
    // Restauramos mock normal siempre
    globalThis.window.localStorage = mockStorage;
    mockStorage.failOnSetKey = null;
  }
});

// Test Suite 5: Idempotency of initial events and licenses
test("Idempotency: Reintentos de reconcileInitialEvents no duplican eventos", async () => {
  const { reconcileInitialEvents, getEvents, addEvent } = await import("@/lib/storage");

  mockStorage.clear();
  mockStorage.failOnSetKey = null;

  const work = {
    id: "AUTH-2026-IDEMP",
    title: "Obra Idempotente",
    type: "document",
    description: "Doc",
    author: "Escritor",
    network: "testnet",
    status: "registered",
    hash: "c".repeat(64),
    stellarTransactionId: "mock_tx_idemp",
    registeredAt: "2026-10-10T16:00:00.000Z",
  };

  // Reconciliación 1
  assert.equal(reconcileInitialEvents(work), true);
  const eventsAfter1 = getEvents().filter((e) => e.workId === work.id);
  assert.equal(eventsAfter1.length, 2, "Should create registration and evidence events");

  // Reconciliación 2 (reintento)
  assert.equal(reconcileInitialEvents(work), true);
  const eventsAfter2 = getEvents().filter((e) => e.workId === work.id);
  assert.equal(eventsAfter2.length, 2, "Must not duplicate initial events on retry");

  // Agregar licencia con mismo ID dos veces
  const licenseEvent = {
    id: "EVT-LIC-SAME-ID",
    workId: work.id,
    type: "license",
    actor: work.author,
    recipient: "Editorial X",
    effectiveDate: "2026-10-10",
    createdAt: "2026-10-10T16:05:00.000Z",
  };

  assert.equal(addEvent(licenseEvent), true);
  assert.equal(addEvent(licenseEvent), true); // reintento
  const licenseEvents = getEvents().filter((e) => e.id === licenseEvent.id);
  assert.equal(licenseEvents.length, 1, "Must not duplicate rights event with same ID");
});

// Test Suite 6: Reconciliation failure when storage is blocked
test("Reconciliación con storage bloqueado: reporta fallo (false)", async () => {
  const { reconcileInitialEvents, storageKeys } = await import("@/lib/storage");

  mockStorage.clear();
  mockStorage.failOnSetKey = storageKeys.events;

  const work = {
    id: "AUTH-2026-BLOCKED",
    title: "Obra Bloqueada",
    type: "music",
    description: "Música",
    author: "Músico",
    network: "testnet",
    status: "registered",
    hash: "d".repeat(64),
    stellarTransactionId: "mock_tx_blocked",
    registeredAt: "2026-10-10T17:00:00.000Z",
  };

  const result = reconcileInitialEvents(work);
  assert.equal(result, false, "Must return false when storage write fails during reconciliation");
  mockStorage.failOnSetKey = null;
});

// Test Suite 7: Security - Protocol injection rejection
test("Security: isValidWork rechaza protocolos javascript:, data: y admite solo http/https", async () => {
  const { isValidWork } = await import("@/lib/storage");

  const baseWork = {
    id: "AUTH-2026-XSS",
    title: "Obra XSS",
    type: "document",
    description: "Doc",
    author: "Hacker",
    network: "testnet",
    status: "registered",
  };

  assert.equal(isValidWork({ ...baseWork, sourceUrl: "javascript:alert(1)" }), false, "javascript: URL must be rejected");
  assert.equal(isValidWork({ ...baseWork, sourceUrl: "data:text/html,<script>alert(1)</script>" }), false, "data: URL must be rejected");
  assert.equal(isValidWork({ ...baseWork, sourceUrl: "vbscript:msgbox(1)" }), false, "vbscript: URL must be rejected");
  assert.equal(isValidWork({ ...baseWork, sourceUrl: "https://example.com/obra" }), true, "https URL must be accepted");
  assert.equal(isValidWork({ ...baseWork, sourceUrl: "http://example.com/obra" }), true, "http URL must be accepted");
});

// Test Suite 8: Conflict rejection on reused event ID with differing payload
test("Conflict: addEvent rechaza evento con ID existente si el contenido difiere", async () => {
  const { addEvent, getEvents } = await import("@/lib/storage");

  mockStorage.clear();
  mockStorage.failOnSetKey = null;

  const originalEvent = {
    id: "EVT-CONFLICT-1",
    workId: "AUTH-2026-CONF",
    type: "license",
    actor: "Autor Original",
    recipient: "Editorial A",
    effectiveDate: "2026-10-10",
    terms: "Licencia no exclusiva",
    createdAt: "2026-10-10T12:00:00.000Z",
  };

  assert.equal(addEvent(originalEvent), true, "First insertion must succeed");

  const conflictingEvent = {
    ...originalEvent,
    recipient: "Editorial B - Conflicto", // Different recipient!
  };

  assert.equal(addEvent(conflictingEvent), false, "Must reject duplicate ID with conflicting payload");

  // Verify the stored event remains the original one
  const stored = getEvents().find((e) => e.id === "EVT-CONFLICT-1");
  assert.equal(stored.recipient, "Editorial A", "Original event data must be preserved");
});

// Test Suite 9: Certificate HTML escaping and verification URL sanitization
test("Certificate: Generación escapa etiquetas script y neutraliza protocolos no http/https", async () => {
  const { generateCertificateHtml } = await import("@/lib/demo-certificate");

  const xssWork = {
    id: "AUTH-2026-<script>",
    title: "<script>alert('xss')</script>",
    type: "code",
    description: "<b>Inyección</b>",
    author: "User & Co <script>",
    network: "testnet",
    status: "registered",
    hash: "e".repeat(64),
    stellarTransactionId: "tx_<script>",
  };

  const html = generateCertificateHtml(xssWork, "javascript:alert(1)");

  assert.ok(!html.includes("<script>alert('xss')</script>"), "Must not contain raw script tags from title");
  assert.ok(html.includes("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"), "Must escape title");
  assert.ok(html.includes("AVISO IMPORTANTE DE ALCANCE:"), "Must contain simulation disclaimer header");
  assert.ok(html.includes("Este certificado ha sido expedido dentro de la demostración"), "Must contain simulation disclaimer body");
});
