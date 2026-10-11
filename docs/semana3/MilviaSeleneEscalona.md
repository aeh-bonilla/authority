# Decisión Técnica Individual — Semana 3

**Nombre:** Milvia Selene Escalona Ángeles  
**Usuario de GitHub:** mescalona16-creator  
**Proyecto:** Authory  

---

## Stellar / Decisión Técnica: Contrato Propio vs. Solución Existente del Ecosistema

### 1. Opción Seleccionada
Desarrollar un **Smart Contract propio y minimalista en Soroban (Rust)** especializado en el registro inmutable de evidencias y la trazabilidad de derechos (patrón *Attestation / Registry Contract*).

---

### 2. Qué hará el contrato
El contrato actuará como un registro público inmutable y auditable sobre Soroban (Stellar Testnet), exponiendo principalmente dos funciones:
- `register_work(work_id, hash, author)`: Registra la huella criptográfica de una obra digital, vinculando su identificador con la clave pública de la cuenta del autor y la estampa de tiempo del ledger de Stellar.
- `record_rights_event(work_id, event_id, event_type, actor, recipient, effective_date)`: Añade un evento auditable de derechos (licencia de uso o cesión patrimonial) asociado al `work_id` histórico, registrando al titular otorgante, al beneficiario y la fecha de vigencia.
- **Emisión de eventos nativos:** Utiliza `env.events().publish(...)` para emitir eventos en el ledger, permitiendo indexar y consultar el historial desde la aplicación web sin sobrecargar el storage del contrato.

---

### 3. Por qué se eligió esta opción
1. **Facilidad y rapidez de implementación:** Al no manejar balances de tokens, lógica de acuñación (*minting*), quemado ni transferencias de activos financieros, el contrato requiere menos de 100 líneas de código en Rust. Esto reduce la superficie de errores y hace que las pruebas en Soroban Testnet sean rápidas y sencillas.
2. **Alineación con el modelo de dominio de Authory:** Los parámetros del contrato coinciden de manera directa (1:1) con las interfaces TypeScript ya definidas y probadas en el frontend (`Work` y `RightsEvent`).
3. **Optimización de costos y storage:** Solo se almacenan los identificadores, la huella criptográfica y los metadatos esenciales de derechos, lo que minimiza el consumo de storage en Soroban y reduce las comisiones de gas.

---

### 4. Cómo se relaciona con el uso de Stellar en Authory
Esta decisión respeta estrictamente los principios de arquitectura definidos en el **Product Blueprint**:
- **El archivo original permanece privado y off-chain:** El contrato nunca recibe ni almacena el contenido binario del archivo original.
- **Stellar como capa de confianza y trazabilidad:** La red Stellar interviene exclusivamente para garantizar la inmutabilidad de la huella, certificar la fecha de registro y mantener un historial público no manipulable de las licencias y cesiones otorgadas.

---

### 5. Alternativas descartadas y motivos

1. **Estándares de tokens / NFT existentes del ecosistema (SEP-41 / Soroban Token Interface):**
   - *Motivo del descarte:* Los contratos de NFT existentes están diseñados para transferir propiedad financiera exclusiva sobre un activo (un solo *owner* a la vez). En Authory, la autoría original es moral e inalienable, y los eventos incluyen **licencias de uso no exclusivas**, donde el autor conserva la titularidad y autoriza a múltiples personas en simultáneo. Adaptar un estándar de NFT para soportar licencias no exclusivas requeriría sobreescribir y complejizar el contrato innecesariamente, aumentando el tiempo de desarrollo.
2. **Transacciones tradicionales de Stellar con `ManageData` o Memo (sin Soroban):**
   - *Motivo del descarte:* Aunque es fácil de emitir, carece de programabilidad y validación de reglas de negocio, y no cumple con la arquitectura pactada en el Product Blueprint de utilizar Soroban para la lógica de derechos.
