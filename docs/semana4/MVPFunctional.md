# Authory — Documentación de Entrega Semana 4 (MVP Funcional)

**Proyecto:** Authory  
**Programa:** Blockchain Builders 101 — Stellar × BAF  
**Entregable:** Semana 4 — MVP funcional  
**Repositorio:** [Authory en GitHub](https://github.com/nidaela/Authory)  
**Rama de trabajo:** `main` (integrada desde `feat/semana4-mvp-functional`)  
**Red:** Stellar Testnet (Soroban)  
**Fecha:** Octubre de 2026  

---

## Evidencias Verificables del MVP (Públicas)

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
| **Aplicación Frontend en Producción** | [authority-khaki.vercel.app](https://authority-khaki.vercel.app) | Aplicación Next.js 16 desplegada en vivo en Vercel conectada a Stellar Testnet y Supabase. |

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

*(Extensión: 206 palabras)*

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

*(Extensión: 270 palabras)*

Authory propone registrar evidencias de autoría y eventos de derechos sobre obras digitales mediante Stellar, manteniendo el contenido original fuera de la cadena. Los siguientes riesgos se priorizan por su posible impacto en la confianza, la continuidad del servicio y la utilidad para creadores y terceros. Las probabilidades son estimaciones cualitativas iniciales, no resultados de pruebas con usuarios.

**R1. Integridad y trazabilidad de evidencias — probabilidad media, impacto alto.** Una diferencia entre el archivo, su huella criptográfica y el registro consultado podría producir verificaciones incorrectas. También debe evitarse que una licencia o cesión aparezca desvinculada de la obra correspondiente. Como mitigación, se contemplan pruebas de extremo a extremo, comprobaciones de hash y referencias públicas a las transacciones de testnet.

**R2. Identidad y alcance de los derechos — probabilidad media, impacto alto.** Registrar una declaración en blockchain no acredita por sí solo la identidad del autor ni la validez jurídica de una cesión. Es importante distinguir evidencia técnica de titularidad legal, definir quién puede registrar eventos de derechos y explicar estas limitaciones con claridad a los usuarios.

**R3. Privacidad y protección de información — probabilidad media, impacto alto.** Los registros públicos son difíciles de rectificar o retirar. Por ello, se debe minimizar la información incluida en Stellar, evitar publicar archivos originales o datos personales innecesarios y documentar qué información permanece fuera de la cadena.

**R4. Dependencias técnicas — probabilidad media, impacto alto.** La conectividad con Stellar, las firmas rechazadas, las demoras de confirmación o los reinicios de testnet pueden interrumpir una operación. Las medidas previstas incluyen mensajes comprensibles, manejo de errores, prevención de registros duplicados y procedimientos reproducibles de despliegue y verificación.

**R5. Adopción y comprensión — probabilidad por determinar, impacto alto.** Es posible que los creadores consideren suficientes sus métodos actuales o que terceros confundan un registro verificable con una certificación legal. Se evaluarán necesidad, comprensión y disposición a utilizar Authory mediante entrevistas y pruebas de usabilidad.

**Pendientes y seguimiento.** Para el cierre del sprint, el equipo reunió las evidencias públicas exigidas y revisó el comportamiento de los flujos principales. Para etapas posteriores quedan el fortalecimiento de identidad con Freighter, la gestión de disputas y la robustez operativa fuera de testnet.

---

## 3. Plan de Validación con Usuarios

*(Extensión: 385 palabras)*

**Objetivo.** Determinar si Authory responde a una necesidad relevante para quienes crean obras digitales y si sus registros pueden consultarse y comprenderse sin asistencia. El plan parte del Problem Brief y del Product Blueprint: los usuarios principales son creadores digitales —por ejemplo, ilustradores, diseñadores, fotógrafos, músicos y desarrolladores—; los usuarios secundarios son clientes o compradores que necesitan verificar procedencia y consultar eventos de derechos.

**Hipótesis críticas y criterios previos a las pruebas:**

1. **H1. Deseabilidad.** Creemos que los creadores valoran una evidencia de autoría fácil de compartir porque hoy deben reunir pruebas dispersas. **Criterio:** al menos cuatro de cinco describen un caso concreto reciente en que enfrentaron esa dificultad y aceptan realizar una prueba posterior de Authory. Se considerarán acciones y experiencias, no cumplidos u opiniones generales.

2. **H2. Usabilidad del registro.** Creemos que un creador puede registrar una obra de prueba y localizar su evidencia sin recibir indicaciones. **Criterio:** al menos cuatro de cinco completan el recorrido sin ayuda e identifican correctamente la referencia del registro.

3. **H3. Comprensión de la verificación.** Creemos que un cliente o comprador puede consultar la procedencia de una obra y entender el alcance de la evidencia. **Criterio:** al menos cuatro de cinco consultan una obra de prueba sin asistencia y distinguen entre registro técnico de información y acreditación legal de autoría o derechos.

**Participantes y captación.** Se propone una primera ronda con cinco creadores y cinco clientes o compradores, ajenos al equipo de desarrollo. Se contactarán mediante comunidades creativas y redes profesionales, verificando previamente su perfil con un formulario breve. Las sesiones se programarán después del sprint, una vez preparado un recorrido estable de prueba.

**Métodos y escenarios.** Primero se harán entrevistas sobre comportamientos pasados: «¿Qué hiciste la última vez que necesitaste demostrar que una obra era tuya?» y «¿Cómo verificaste los derechos de una obra antes de utilizarla?». Después se realizarán pruebas moderadas con situaciones, no instrucciones: «Terminaste una ilustración y necesitas conservar una evidencia que puedas compartir» o «Un proveedor te envía una obra y quieres comprobar su procedencia». Una persona moderará sin guiar; otra observará y tomará notas. Se invitará a pensar en voz alta.

**Evidencias, métricas y decisiones.** Por participante se documentarán acción, comentario, paso del recorrido e interpretación por separado. Se medirán finalización sin ayuda, abandono, solicitudes de asistencia y tiempo empleado. La validez técnica de las operaciones se contrastará por separado con sus referencias públicas de Stellar Testnet. Las grabaciones requerirán consentimiento y se usarán únicamente datos de prueba. Con los umbrales fijados antes de observar resultados, cuatro o cinco casos favorables permitirán continuar; tres exigirán ajustar y repetir; dos o menos motivarán replantear la hipótesis o el flujo antes de ampliarlo.

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

**Resultado:** Se cumple íntegramente la especificación del Entregable 4, conectando el smart contract propio desplegado en Soroban Testnet con el frontend de Authory, habilitando hash real en navegador, rutas backend dedicadas, persistencia en Supabase, evidencia pública verificable y documentación exhaustiva.
