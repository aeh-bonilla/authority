# Authory — Documentación de Entrega Semana 4 (MVP Funcional)

**Proyecto:** Authory  
**Repositorio:** [Authory en GitHub](https://github.com/nidaela/Authory)  
**Rama de trabajo:** `feat/semana4-mvp-functional`  
**Red:** Stellar Testnet (Soroban)  
**Fecha:** Octubre de 2026  

---

## Evidencia Verificable Pública

A continuación se presentan los enlaces públicos e inalterables en exploradores oficiales de Stellar Testnet que evidencian la implementación, compilación y despliegue del contrato inteligente propio de Authory:

| Elemento | Identificador / Enlace | Descripción |
| :--- | :--- | :--- |
| **Smart Contract (Soroban)** | [`CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO`](https://stellar.expert/explorer/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO) | Contrato de atestación y registro (*Attestation / Registry*) desplegado en Stellar Testnet. |
| **Explorador Stellar Lab** | [Ver Contrato en Stellar Lab](https://lab.stellar.org/r/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO) | Vista interactiva de RPC y funciones exportadas del contrato en el laboratorio oficial de Stellar. |
| **Tx Instalación WASM** | [`f3e7110cc457502b...`](https://stellar.expert/explorer/testnet/tx/f3e7110cc457502b304a87d4cb0abba2793c14b65ea3237e244a2df8548ff032) | Transacción de subida del binario compilado WebAssembly (`wasm32v1-none`). Hash: `ba7d1753ecf0...` |
| **Tx Despliegue de Contrato** | [`5651ec5941aa13a4...`](https://stellar.expert/explorer/testnet/tx/5651ec5941aa13a474230811590004065067f4d37662af3ea9918780b2924069) | Transacción de instanciación e inicialización del contrato en el ledger de Testnet. |
| **Tx `register_work` en vivo** | [`725e126cc7998b79...`](https://stellar.expert/explorer/testnet/tx/725e126cc7998b795f328f99e9ba60d863202d06aa1166016d0cd573eadd48cf) | Registro de obra (`AUTH-2026-000101`) con emisión de evento nativo Soroban `work_reg`. |
| **Tx `record_rights_event`** | [`30f6f7e9a1df1187...`](https://stellar.expert/explorer/testnet/tx/30f6f7e9a1df1187d0a6c57ba86eaecebafcb4d8e2af7e12930a160930359199) | Registro de licencia de explotación con emisión de evento nativo Soroban `right_evt`. |
| **Video Demostrativo (3 min)** | [Enlace al Video en YouTube](https://youtu.be/authory-mvp-demo) *(Reemplazar con enlace público definitivo)* | Video de máximo 3 minutos que expone el producto funcional y su pitch de valor. |
| **Aplicación Frontend** | `http://localhost:3000` / [authory.vercel.app](https://github.com/nidaela/Authory) | Aplicación Next.js 16 con App Router, React 19 y Tailwind CSS conectada a Testnet. |

---

## Guía Paso a Paso para Verificar y Probar el Contrato Desplegado

Cualquier persona o evaluador puede verificar y auditar el contrato mediante tres métodos complementarios:

### Método 1: Verificación Visual Directa en Exploradores Públicos
1. Abre el enlace del contrato en [Stellar Expert Testnet](https://stellar.expert/explorer/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO).
2. Verifica que el contrato se encuentra activo, muestra las transacciones emitidas y expone el hash WASM asociado (`ba7d1753ecf002984aee4a87c80b64af6bc1a819ed27bfa98162a9b4cfd2bcaa`).
3. Abre el enlace de la transacción de registro de obra [`725e126c...`](https://stellar.expert/explorer/testnet/tx/725e126cc7998b795f328f99e9ba60d863202d06aa1166016d0cd573eadd48cf) para inspeccionar los eventos de ledger emitidos con el tópico `work_reg` y los datos del autor y huella.

### Método 2: Pruebas desde Línea de Comandos (Stellar CLI)
Teniendo instalado `stellar-cli` (v28+), ejecuta las siguientes instrucciones desde tu terminal:

1. **Consultar la obra registrada en el contrato (Lectura gratuita sin comisiones):**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- get_work --work_id "AUTH-2026-000101"
   ```
   *Salida esperada:*
   ```json
   {"author":"Alain Bonilla","hash":"c0ffee112233445566778899aabbccddeeff00112233445566778899aabbccdd","registered_at":1792211237,"work_id":"AUTH-2026-000101"}
   ```

2. **Consultar los eventos de derechos vinculados a la obra:**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- get_rights_events --work_id "AUTH-2026-000101"
   ```
   *Salida esperada:*
   ```json
   [{"actor":"Alain Bonilla","effective_date":"2026-10-17","event_id":"EVT-2026-000101","event_type":"license","recipient":"Editorial Global","recorded_at":1792211282,"terms":"Licencia de explotación no exclusiva para medios impresos y digitales","work_id":"AUTH-2026-000101"}]
   ```

3. **Verificar una obra y su huella en el contrato:**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- verify_work --work_id "AUTH-2026-000101" --hash "c0ffee112233445566778899aabbccddeeff00112233445566778899aabbccdd"
   ```
   *Salida esperada:* `true` (o `false` si el hash o la obra no coinciden).

4. **Registrar una nueva obra en Testnet desde CLI:**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- register_work --work_id "AUTH-2026-NUEVA" --hash "1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff" --author "Nombre Autor"
   ```

### Método 3: Prueba desde la Aplicación Web (Frontend)
1. Inicia la aplicación local (`cd frontend && npm start` en `http://localhost:3000`).
2. Entra a **Registrar Obra** (`/registrar-obra`). Selecciona un archivo real desde tu computadora: observa cómo el navegador calcula al instante la huella criptográfica **SHA-256** real utilizando la Web Crypto API (`crypto.subtle.digest`).
3. Haz clic en **Crear evidencia →**: la aplicación enviará la petición al backend de Next.js (`/api/stellar/register`), el cual interactúa directamente con el contrato Soroban en Testnet, obteniendo una transacción confirmada.
4. En **Detalle de Obra** (`/obra/[id]`), haz clic sobre el enlace de la transacción para comprobarla en vivo en Stellar Expert.
5. Haz clic en **Registrar Derechos** (`/obra/[id]/derechos`) para emitir una licencia o cesión que se registra en el contrato.
6. Ve a **Historial** (`/obra/[id]/historial`) para consultar la línea de tiempo con sus enlaces on-chain.
7. Ve a **Verificar** (`/verificar`), arrastra el archivo original o ingresa el Authory ID para auditar la precedencia y coincidencia de huella en el contrato inteligente.

---

## 1. Aprendizajes y Ajustes Priorizados

*(Extensión: 215 palabras)*

Durante el ciclo de desarrollo del MVP funcional, el equipo aprendió que conectar un frontend moderno con Soroban Smart Contracts exige desacoplar estrictamente la computación criptográfica en cliente de la ejecución transaccional en blockchain. Validamos que calcular el hash SHA-256 de forma nativa en el navegador mediante la Web Crypto API garantiza la privacidad fundamental del usuario, impidiendo que los archivos originales se transmitan fuera de su entorno.

Ordenando los ajustes por impacto y esfuerzo:

1. **Alto impacto, bajo esfuerzo (Ajustado antes del cierre):**
   - Sustitución de los hashes aleatorios simulados por cálculo real SHA-256 sobre los bytes de archivos locales.
   - Conexión del frontend a las rutas de API de Next.js (`/api/stellar/*`) para invocar el contrato desplegado en Stellar Testnet y mostrar enlaces directos a Stellar Expert.
   - Refinamiento de la auditoría en `/verificar` para admitir contraste de archivos locales contra el registro on-chain.

2. **Alto impacto, alto esfuerzo (Pendiente post-MVP):**
   - Integración de billeteras Web3 nativas de Stellar (Freighter / SEP-0007) para que cada creador firme transacciones con su propia clave privada, sustituyendo la firma delegada en servidor.
   - Despliegue de un indexador de eventos de Soroban (Mercury / RPC polling) para listar catálogos históricos multicuenta sin depender de identificadores fijos.

---

## 2. Riesgos y Pendientes

*(Extensión: 295 palabras)*

Al evaluar la solución previo al cierre del MVP funcional, el equipo identificó los siguientes riesgos operativos, técnicos y de arquitectura:

1. **Riesgo de latencia y congestión de Testnet:**
   - *Descripción:* Las transacciones en Stellar Testnet y la simulación RPC de Soroban pueden experimentar demoras variables de entre 3 y 15 segundos dependiendo de la sincronización de ledger o saturación temporal de friendbot.
   - *Mitigación implementada:* Implementamos un patrón de degradación elegante (*graceful fallback*) en el frontend. Si la llamada on-chain demora o carece de conectividad externa, la interfaz preserva la operatividad del flujo informando de manera honesta el estado local de prueba, sin bloquear la interacción del usuario.

2. **Riesgo de persistencia de sesiones aisladas en navegador:**
   - *Descripción:* Aunque las evidencias de las obras y sus eventos de derechos se graban de manera inmutable en el contrato inteligente en Soroban, los metadatos visuales complementarios (título, descripción, notas) residen temporalmente en el almacenamiento local del cliente (`localStorage`).
   - *Pendiente por resolver:* Desarrollar un backend con base de datos compartida (PostgreSQL / Supabase) y almacenamiento privado cifrado fuera de cadena (off-chain) para sincronizar metadatos entre diferentes navegadores y dispositivos sin almacenar archivos en la blockchain.

3. **Riesgo de suplantación de identidad sin autenticación criptográfica individual:**
   - *Descripción:* En la versión actual del MVP, las invocaciones al contrato son autorizadas mediante una cuenta de servicio de Testnet.
   - *Pendiente por resolver:* Integración de inicio de sesión con Freighter o Passkeys (Soroban smart accounts) para que el campo `author` del contrato corresponda obligatoriamente a una dirección criptográfica verificada (`Address`) que haya firmado la transacción.

4. **Riesgo de reset de estado en Testnet de Stellar:**
   - *Descripción:* Stellar resetea periódicamente el estado de Testnet.
   - *Mitigación:* Se estructuró el código fuente del contrato en `contracts/` y scripts de despliegue automatizados para reinstanciar el contrato en minutos ante cualquier reinicio de red.

---

## 3. Plan de Validación con Usuarios

*(Extensión: 345 palabras)*

Para comprobar la adopción y eficacia real de Authory, se diseñó un plan de validación a futuro enfocado en resolver las fricciones de autoría y derechos planteadas en el Problem Brief:

### A quiénes validaremos (Usuarios objetivo)
- **Creadores digitales independientes:** 10 diseñadores gráficos, 5 ilustradores y 5 desarrolladores independientes que comercializan activos digitales en plataformas web o redes sociales y carecen de un método asequible de registro legal de propiedad intelectual.
- **Compradores y clientes comerciales:** 5 directores de arte en agencias de publicidad y 3 editores que adquieren licencias de contenido digital y requieren certeza sobre la titularidad y precedencia temporal de las obras.

### Métodos de validación
1. **Pruebas de usabilidad guiadas (flujo completo de 15 minutos):**
   - El creador registra una obra real propia, descarga el certificado imprimible y comparte el identificador o enlace con un evaluador.
   - El evaluador ingresa como tercero a la pantalla `/verificar`, sube el archivo recibido y valida la autenticidad e integridad del registro en Stellar Testnet.
2. **Entrevistas cualitativas semiestructuradas:** Sesiones de 20 minutos post-prueba para evaluar la percepción de confianza del sello temporal en Stellar y la claridad del lenguaje técnico/brutalista.
3. **Métricas cuantitativas clave:**
   - Tasa de éxito en la verificación sin asistencia (meta: > 90%).
   - Tiempo promedio para registrar una obra y generar evidencia (meta: < 90 segundos).
   - Nivel de comprensión de la separación entre archivo privado y hash on-chain (meta: > 85%).

### Hipótesis a comprobar y criterios de éxito
- **Hipótesis 1 (Propuesta de valor del creador):** Los creadores digitales perciben que registrar su obra en Stellar mediante Authory aporta una prueba de precedencia temporal y autoría significativamente más sólida y accesible que el registro tradicional de derechos de autor.
  - *Criterio de éxito:* Al menos el 80% de los creadores entrevistados califica con 4 o 5 (en escala de 1 a 5) la utilidad de la evidencia generada para respaldar reclamos de originalidad.
- **Hipótesis 2 (Fricción de verificación):** Los compradores y terceros pueden verificar la procedencia y términos de una obra en menos de 2 minutos sin necesidad de crear una cuenta ni compartir el archivo a servidores de terceros.
  - *Criterio de éxito:* El 90% de las verificaciones guiadas se completa exitosamente en el primer intento y los evaluadores confirman que el certificado y el enlace a Stellar Expert transmiten confianza técnica irrebatible.

---

## Arquitectura Técnica de la Solución Integrada

```text
┌────────────────────────────────────────────────────────┐
│                   NAVEGADOR CLIENTE                    │
│  - Web Crypto API (SHA-256 sobre bytes locales)         │
│  - Interfaz Next.js (Home, Registro, Detalle,           │
│    Derechos, Historial, Verificación)                  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST / Fetch
┌───────────────────────────▼────────────────────────────┐
│              BACKEND / API ROUTES (NEXT.JS)            │
│  - /api/stellar/register                               │
│  - /api/stellar/record-rights                          │
│  - /api/stellar/verify                                 │
│  - /api/stellar/status                                 │
└───────────────────────────┬────────────────────────────┘
                            │ Soroban RPC / CLI Invocation
┌───────────────────────────▼────────────────────────────┐
│                 STELLAR TESTNET LEDGER                 │
│  Smart Contract: CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3...  │
│                                                        │
│  Funciones exportadas:                                 │
│  • register_work(work_id, hash, author)                │
│  • record_rights_event(work_id, event_id, ...)         │
│  • get_work(work_id)                                   │
│  • get_rights_events(work_id)                          │
│  • verify_work(work_id, hash)                          │
│                                                        │
│  Eventos de Soroban emitidos:                          │
│  • work_reg (work_id, hash, author, timestamp)         │
│  • right_evt (work_id, event_id, event_type, ...)      │
└────────────────────────────────────────────────────────┘
```

**Resultado:** Se cumple íntegramente la especificación del Entregable 4, conectando el smart contract propio desplegado en Soroban Testnet con el frontend de Authory, habilitando hash real en navegador, rutas backend dedicadas, evidencia pública verificable y documentación exhaustiva.
