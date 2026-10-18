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

## Guía Exhaustiva: Verificación Operativa del Smart Contract en Stellar Testnet

Cualquier evaluador o integrante del equipo puede auditar y comprobar que el contrato inteligente está **desplegado, activo y respondiendo consultas** mediante los siguientes métodos independientes:

### Método A: Auditoría Visual en Exploradores Oficiales de Stellar
1. **Inspección de Contrato en Stellar Expert:**
   * Ingresa a: [`https://stellar.expert/explorer/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO`](https://stellar.expert/explorer/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO)
   * Comprueba que el estado es válido y que el Wasm Bytecode Hash coincide exactamente con:
     `ba7d1753ecf002984aee4a87c80b64af6bc1a819ed27bfa98162a9b4cfd2bcaa`.
2. **Inspección de Contrato en Stellar Lab:**
   * Ingresa a: [`https://lab.stellar.org/r/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO`](https://lab.stellar.org/r/testnet/contract/CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO)
   * Podrás ver las 5 funciones exportadas del contrato: `register_work`, `record_rights_event`, `get_work`, `get_rights_events` y `verify_work`.
3. **Auditoría de Eventos de Ledger en Transacciones Reales:**
   * Abre la transacción de registro de obra [`725e126c...`](https://stellar.expert/explorer/testnet/tx/725e126cc7998b795f328f99e9ba60d863202d06aa1166016d0cd573eadd48cf).
   * En la pestaña **Events**, verifica la emisión del evento con topic `work_reg` conteniendo la huella SHA-256 `c0ffee1122...` y el autor `Alain Bonilla`.
   * Abre la transacción de derechos [`30f6f7e9...`](https://stellar.expert/explorer/testnet/tx/30f6f7e9a1df1187d0a6c57ba86eaecebafcb4d8e2af7e12930a160930359199).
   * Verifica la emisión del evento con topic `right_evt` vinculando la licencia con `Editorial Global`.

### Método B: Verificación por Línea de Comandos (Stellar CLI)
Con `stellar-cli` instalado en tu sistema, ejecuta directamente las funciones del contrato en Testnet:

1. **Consultar una obra registrada (`get_work` - Simulación gratuita sin costo de gas):**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- get_work --work_id "AUTH-2026-000101"
   ```
   *Respuesta esperada:*
   ```json
   {"author":"Alain Bonilla","hash":"c0ffee112233445566778899aabbccddeeff00112233445566778899aabbccdd","registered_at":1792211237,"work_id":"AUTH-2026-000101"}
   ```

2. **Consultar los eventos de derechos vinculados (`get_rights_events`):**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- get_rights_events --work_id "AUTH-2026-000101"
   ```
   *Respuesta esperada:*
   ```json
   [{"actor":"Alain Bonilla","effective_date":"2026-10-17","event_id":"EVT-2026-000101","event_type":"license","recipient":"Editorial Global","recorded_at":1792211282,"terms":"Licencia de explotación no exclusiva para medios impresos y digitales","work_id":"AUTH-2026-000101"}]
   ```

3. **Verificar concordancia de hash directamente en blockchain (`verify_work`):**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- verify_work --work_id "AUTH-2026-000101" --hash "c0ffee112233445566778899aabbccddeeff00112233445566778899aabbccdd"
   ```
   *Respuesta esperada:* `true` (o `false` si el hash es alterado).

4. **Registrar una obra nueva en vivo sobre Testnet:**
   ```bash
   stellar contract invoke \
     --id CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO \
     --source alice \
     --network testnet \
     -- register_work --work_id "AUTH-2026-TEST-CLI" --hash "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0" --author "Nombre Evaluador"
   ```

### Método C: Verificación vía Soroban RPC con `curl` (Sin herramientas locales)
Puedes enviar una petición JSON-RPC estándar directamente al servidor RPC oficial de Stellar Testnet para auditar la salud de la red y el protocolo:
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getNetwork"}' \
  https://soroban-testnet.stellar.org
```
*Respuesta:* `{"jsonrpc":"2.0","id":1,"result":{"passphrase":"Test SDF Network ; September 2015", ...}}`

### Método D: Verificación Interactiva desde la Aplicación Web
1. Levanta el proyecto (`cd frontend && npm run dev` o `npm start`).
2. Entra a `/registrar-obra`, selecciona cualquier archivo de tu máquina: la interfaz calculará la huella **SHA-256** en tu navegador y la registrará en el contrato de Soroban al presionar **Crear evidencia →**.
3. En la ficha de detalle (`/obra/[id]`), presiona el enlace a la transacción en **Stellar Expert** para verla reflejada en el explorador oficial.
4. En `/verificar`, audita la obra subiendo el mismo archivo original para confirmar que coincide con la huella inmutable del ledger.

---

## Guía Paso a Paso: Despliegue y Configuración de Supabase

Para habilitar la persistencia compartida en la nube (catálogo multi-navegador, metadatos y almacenamiento de PDFs/imágenes en Supabase Storage), sigue estos sencillos pasos:

### Opción 1: Configuración Manual en Supabase Dashboard (Recomendada — 2 minutos)

1. **Crear Proyecto:**
   * Ingresa a [https://supabase.com](https://supabase.com) con tu cuenta (gratuita).
   * Haz clic en **New project**, asigna un nombre (ej. `authory-mvp`), elige una contraseña para la base de datos y selecciona la región más cercana.

2. **Ejecutar el Script SQL de la Base de Datos:**
   * En el menú lateral izquierdo de tu proyecto en Supabase, entra a **SQL Editor**.
   * Haz clic en **New query**, copia íntegramente el contenido del archivo [`supabase/schema.sql`](file:///Users/abonilla/Documents/stellar/authority/supabase/schema.sql) de este repositorio y presiona **Run**.
   * Este script crea:
     * La tabla `works` (con columnas de metadatos, huella SHA-256, transacción de Stellar y `file_url`).
     * La tabla `rights_events` (historial cronológico de licencias y cesiones).
     * Los índices de rendimiento para búsquedas por hash y autor.
     * Las políticas de seguridad RLS (*Row Level Security*) para permitir lectura y verificación pública sin requerir login.
     * El bucket público de almacenamiento `authory-files` para persistir PDFs e imágenes.

3. **Obtener Credenciales de Conexión:**
   * En el panel de Supabase, ve a **Project Settings** (ícono de engranaje) -> **API**.
   * Copia tu **Project URL** (ej. `https://abcdefghijkl.supabase.co`).
   * Copia la clave **anon public** (la clave `eyJhbGciOi...`).

4. **Configurar el Entorno en el Frontend:**
   * En la carpeta `frontend/`, crea un archivo `.env.local` con tus credenciales:
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
     ```
   * Reinicia el servidor de desarrollo (`npm run dev`) o ejecuta `npm run build`.

5. **Verificar que la Persistencia esté Activa:**
   * Registra una obra nueva en `/registrar-obra` adjuntando una imagen o PDF.
   * Abre tu panel de Supabase en **Table Editor** -> `works`: verás la fila creada con su metadata y su `file_url`.
   * En **Storage** -> `authory-files`: verás el archivo binario almacenado en la nube.
   * Ahora, abre el enlace `/verificar?workId=AUTH-...` en una **ventana de incógnito u otro dispositivo**: la obra se cargará de inmediato desde Supabase y se verificará con Stellar Testnet.

### Opción 2: Despliegue Automatizado vía Supabase CLI

Si cuentas con tu `SUPABASE_ACCESS_TOKEN` (generado en [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)), puedes realizar el enlace y migración desde tu terminal:

```bash
# 1. Iniciar sesión en la CLI
npx -y supabase login --token <TU_ACCESS_TOKEN>

# 2. Vincular con tu proyecto remoto
npx -y supabase link --project-ref <TU_PROJECT_REF>

# 3. Aplicar el esquema directamente a la base de datos remota
npx -y supabase db push
```

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
┌─────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR CLIENTE                         │
│  - Web Crypto API (Cálculo instantáneo SHA-256 en memoria RAM) │
│  - Interfaz Next.js (Home, Registro, Detalle, Derechos,        │
│    Historial, Verificación pública con selector de archivos)   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP POST / JSON Fetch
┌───────────────────────────────▼─────────────────────────────────┐
│                 BACKEND / API ROUTES (NEXT.JS)                  │
│  • /api/stellar/register       • /api/stellar/record-rights     │
│  • /api/stellar/verify         • /api/stellar/status            │
│  • /api/works (CRUD Supabase)  • /api/events (CRUD Derechos)    │
│  • /api/storage/upload (Carga de PDF e Imágenes a Storage)      │
└───────────────┬─────────────────────────────────┬───────────────┘
                │                                 │
     Soroban RPC / CLI Invocation                 │ Supabase JS Client / REST
                │                                 │
┌───────────────▼───────────────┐ ┌───────────────▼───────────────┐
│     STELLAR TESTNET LEDGER    │ │     SUPABASE (POSTGRESQL)     │
│                               │ │                               │
│  Smart Contract Registry:     │ │  • Tabla `works`:             │
│  CAOAFGPATXWJ6KKGXFYHY42Q4... │ │    id, title, author, hash,   │
│                               │ │    filename, file_url...      │
│  Funciones exportadas:        │ │                               │
│  • register_work(...)         │ │  • Tabla `rights_events`:     │
│  • record_rights_event(...)   │ │    id, work_id, type, terms.. │
│  • get_work(...)              │ │                               │
│  • get_rights_events(...)     │ │  • Storage Bucket:            │
│  • verify_work(...)           │ │    authory-files (PDFs/Fotos) │
│                               │ │                               │
│  Eventos Soroban emitidos:    │ │  • Políticas RLS Públicas:    │
│  • work_reg   • right_evt     │ │    Auditoría sin cuenta       │
└───────────────────────────────┘ └───────────────────────────────┘
```

**Resultado:** Se cumple íntegramente la especificación del Entregable 4, conectando el smart contract propio desplegado en Soroban Testnet con el frontend de Authory, habilitando hash real en navegador, rutas backend dedicadas, evidencia pública verificable y documentación exhaustiva.
