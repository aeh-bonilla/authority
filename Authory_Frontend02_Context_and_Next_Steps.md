# Authory — Frontend Continuation Handoff

> Documento para continuar la implementación del frontend de Authory en Semana 3.
>
> Puede usarse de dos maneras:
>
> 1. Como guía de trabajo para la persona responsable de Frontend 02.
> 2. Como archivo de contexto para cargar en Cursor, Claude, ChatGPT u otro editor/agente y continuar sin reconstruir decisiones previas.

---

# 1. Objetivo

Continuar el frontend de Authory desde el estado actual de `main` y completar las pantallas restantes del Functional Proof de Semana 3 sin duplicar arquitectura, tipos, componentes o lógica ya implementada.

El trabajo pendiente es:

1. Verificación de obra
2. Derechos / Licencia
3. Historial de obra
4. QA del flujo completo
5. Deployment
6. Apoyo para documentación final de Semana 3 y README

La foundation, las primeras tres pantallas y los contratos principales ya existen y están mergeados a `main`.

---

# 2. Fuente de verdad

Antes de hacer cambios importantes, revisar en este orden:

1. `docs/semana2/ProductBlueprint.md`
2. `docs/semana1/ProblemBrief.md`
3. arquitectura definida durante Semana 2
4. implementación actual en `main`
5. este documento como handoff operativo

Si existe una diferencia entre una idea nueva y el Product Blueprint, el Product Blueprint tiene prioridad para el alcance de Semana 3.

No ampliar el MVP sin necesidad.

---

# 3. Qué es Authory

Authory es una propuesta para registrar evidencia verificable de autoría, fecha, integridad y eventos relacionados con derechos sobre obras digitales.

La arquitectura conceptual definida anteriormente es:

```text
Archivo original
    ↓
permanece privado / off-chain

Metadata operacional
    ↓
aplicación / almacenamiento tradicional

Hash + evidencia mínima verificable
    ↓
Stellar
```

Principio importante:

**El archivo original nunca debe tratarse como contenido on-chain.**

Para Semana 3, la integración Stellar es una simulación funcional. No hay transacciones reales.

---

# 4. Alcance del MVP de frontend

El flujo acordado tiene 6 pantallas funcionales:

1. Home
2. Registro de obra → Generación de evidencia
3. Detalle de obra
4. Verificación de obra
5. Derechos / Licencia
6. Historial

La pantalla 2 contiene varios estados internos, pero se considera una sola superficie funcional.

Flujo objetivo:

```text
HOME
  ↓
REGISTRAR OBRA
  ↓
GENERAR EVIDENCIA
  ↓
DETALLE DE OBRA
  ├── VERIFICAR OBRA
  ├── DERECHOS / LICENCIA
  └── HISTORIAL
```

---

# 5. Estado actual

## Ya implementado y mergeado

Frontend 01 ya dejó listo:

- scaffold y foundation de frontend;
- stack;
- sistema visual;
- navegación compartida;
- tipos de dominio;
- mock data;
- capa de persistencia con `localStorage`;
- mock Stellar Testnet;
- Home;
- Registro de obra;
- Generación de evidencia;
- Detalle de obra;
- rutas de salida hacia las pantallas pendientes.

Todo está mergeado a:

```text
main
```

La branch anterior:

```text
feat/frontend-foundation
```

ya fue eliminada después del merge.

Estado verificado al cierre:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

---

# 6. Stack implementado

**Runtime:** Node.js **22.23.3** con `nvm` y `.nvmrc`  
**Package manager:** npm  
**Framework:** Next.js **16.4.0**  
**UI runtime:** React **19.3.0**  
**Lenguaje:** TypeScript  
**Routing:** Next.js App Router  
**Estilos:** Tailwind CSS **4**  
**Build / Dev:** Turbopack  
**Formularios:** React Hook Form  
**Validación:** Zod + `@hookform/resolvers`  
**Persistencia:** Browser `localStorage` mediante `lib/storage.ts`  
**Datos:** Mock data tipado con TypeScript  
**Stellar:** Mock de Stellar Testnet mediante `lib/stellar/mock-stellar.ts`  
**Calidad:** ESLint + `tsc --noEmit` + `next build`

No añadir otro framework UI, otra librería de estado o una segunda capa de persistencia salvo que exista una necesidad clara y documentada.

---

# 7. Estructura relevante del repositorio

```text
Authory/
├── docs/
│   ├── semana1/
│   └── semana2/
│
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── registrar-obra/
    │   │   └── page.tsx
    │   └── obra/
    │       └── [id]/
    │           └── page.tsx
    │
    ├── components/
    │   ├── authory/
    │   ├── layout/
    │   └── ui/
    │
    ├── lib/
    │   ├── mock-data.ts
    │   ├── storage.ts
    │   └── stellar/
    │       └── mock-stellar.ts
    │
    ├── types/
    │   ├── rights-event.ts
    │   ├── stellar.ts
    │   └── work.ts
    │
    ├── package.json
    ├── package-lock.json
    ├── next.config.ts
    └── tsconfig.json
```

---

# 8. Componentes existentes que deben reutilizarse

## Layout

```text
frontend/components/layout/app-header.tsx
frontend/components/layout/page-shell.tsx
```

## UI

```text
frontend/components/ui/brutalist-button.tsx
frontend/components/ui/input.tsx
frontend/components/ui/panel.tsx
frontend/components/ui/section-label.tsx
frontend/components/ui/status-badge.tsx
frontend/components/ui/textarea.tsx
```

## Authory

```text
frontend/components/authory/privacy-notice.tsx
frontend/components/authory/progress-stepper.tsx
frontend/components/authory/register-work-flow.tsx
frontend/components/authory/stellar-evidence.tsx
frontend/components/authory/work-detail.tsx
frontend/components/authory/work-metadata.tsx
frontend/components/authory/work-summary.tsx
```

Antes de crear un componente nuevo, revisar si alguno de estos ya cubre el patrón necesario.

---

# 9. Sistema visual actual

El frontend usa una estética técnica / brutalista.

## Mantener

- fondo blanco;
- bordes negros;
- grids claros;
- bloques rectangulares;
- casi sin border radius;
- cyan para acciones principales;
- amarillo para estados/acciones de énfasis;
- tipografía técnica;
- layout responsive;
- sin decoraciones innecesarias.

## Evitar

- gradients;
- glassmorphism;
- sombras decorativas;
- cards redondeadas tipo SaaS genérico;
- un segundo sistema visual;
- estilos inconsistentes entre pantallas.

## Tipografías

- Space Grotesk para headings;
- IBM Plex Mono para metadata y UI técnica.

Se cargan mediante `next/font/google`.

## Decisión ya tomada

No reintroducir labels decorativos tipo:

```text
01 / HOME
02 / REGISTRAR OBRA
```

Se eliminaron deliberadamente.

---

# 10. Navegación actual

Header actual:

```text
INICIO
REGISTRAR OBRA
VERIFICAR OBRA
ENTRAR
```

Rutas implementadas:

```text
/
→ Home

/registrar-obra
→ Registro de obra / Generación de evidencia

/obra/<id>
→ Detalle de obra
```

Rutas pendientes ya definidas como contrato:

```text
/verificar?workId=<id>

/obra/<id>/derechos

/obra/<id>/historial
```

`ENTRAR` es sólo un placeholder visual. No hay autenticación real en Semana 3.

---

# 11. Flujo que ya funciona

Actualmente puede probarse:

```text
Home
  ↓
Registrar obra
  ↓
Completar formulario
  ↓
Generar evidencia
  ↓
Evidencia creada
  ↓
Continuar al detalle
  ↓
Detalle de obra
```

En Detalle ya aparecen:

```text
VERIFICAR OBRA
REGISTRAR LICENCIA
VER HISTORIAL
```

Estas acciones son el punto de entrada de Frontend 02.

---

# 12. Tipos de dominio existentes

## `Work`

Archivo:

```text
frontend/types/work.ts
```

Tipos principales:

```text
WorkType =
  photography
  illustration
  document
  music
  code
  video
  other
```

Estados:

```text
draft
processing
registered
verified
```

La entidad contiene campos como:

- `id`
- `title`
- `type`
- `description`
- `author`
- `createdAt`
- `registeredAt`
- `filename`
- `fileSize`
- `fileMimeType`
- `sourceUrl`
- `notes`
- `hash`
- `stellarTransactionId`
- `network`
- `status`

No crear otro tipo paralelo para representar una obra.

---

## `RightsEvent`

Archivo:

```text
frontend/types/rights-event.ts
```

Tipos de evento:

```text
registration
evidence
license
assignment
transfer
```

Usar estos valores estructurados para filtrar y renderizar historial.

Correcto:

```ts
event.type === "license"
```

Evitar:

```ts
event.label.includes("LICENCIA")
```

---

## Stellar

Archivo:

```text
frontend/types/stellar.ts
```

Incluye:

- `StellarNetwork`
- `StellarEvidence`
- `VerificationInput`
- `VerificationResult`

Estados internos de evidencia:

```text
pending
confirmed
failed
```

En UI, `confirmed` se presenta como:

```text
CONFIRMADO
```

No cambiar el valor interno sólo para traducir el copy.

---

# 13. Persistencia existente

Archivo:

```text
frontend/lib/storage.ts
```

Funciones disponibles:

```text
getWork()
saveWork()
getEvents()
saveEvents()
addEvent()
resetDemo()
```

Claves utilizadas:

```text
authory_work
authory_events
authory_rights
```

## Regla

No leer/escribir directamente a `localStorage` desde cada nueva pantalla si la operación puede centralizarse en `storage.ts`.

La intención es poder reemplazar esta capa más adelante por backend/API sin reescribir toda la UI.

---

# 14. Mock Stellar existente

Archivo:

```text
frontend/lib/stellar/mock-stellar.ts
```

Funciones principales existentes:

```text
createMockAuthoryId()
generateMockHash()
generateMockTransactionId()
createMockEvidence()
verifyMockEvidence()
createMockRightsEvidence()
```

La implementación actual simula:

- Authory ID;
- hash;
- transaction/reference ID;
- Stellar Testnet;
- confirmación;
- evidencia de derechos.

## Importante

No implementar otra lógica paralela de hashes, transaction IDs o verificación si esta capa puede extenderse.

No presentar estos IDs como transacciones blockchain reales.

---

# 15. Privacidad del archivo

Esta regla es parte central del producto.

El archivo original:

- no se guarda en `localStorage`;
- no se envía a Stellar;
- no se almacena on-chain;
- no se envía a una API en esta prueba;
- no debe serializarse en el estado persistido.

Sólo se conserva metadata como:

- nombre;
- tamaño;
- MIME type.

También puede existir una `sourceUrl`.

Frontend 02 debe conservar este comportamiento.

---

# 16. Pantalla pendiente 1 — Verificación de obra

## Ruta

```text
/verificar?workId=<id>
```

## Objetivo

Permitir verificar la evidencia de una obra usando la estructura ya existente.

Debe funcionar tanto como entrada desde:

- navbar;
- Detalle de obra.

## Contratos que deben reutilizarse

```text
VerificationInput
VerificationResult
verifyMockEvidence()
Work
StellarEvidence
```

## Comportamiento esperado

Una versión mínima debería permitir:

1. recibir `workId` desde query string cuando exista;
2. mostrar un campo para ingresar ID/hash si se entra desde navbar;
3. ejecutar la verificación mock;
4. mostrar resultado claro;
5. indicar si la evidencia coincide;
6. mostrar datos suficientes para entender qué se verificó;
7. mantener el diseño brutalista actual.

## Estados sugeridos

```text
idle
verifying
verified
not-found / invalid
```

No hace falta introducir un state machine formal.

## UI sugerida

Puede dividirse en:

```text
VERIFICAR OBRA

[ input Authory ID / hash ]
[ VERIFICAR ]

↓ resultado

OBRA
Autor
Tipo
Fecha

EVIDENCIA
Hash
Red
Transaction ID
Estado
```

## Acceptance criteria

- [ ] `/verificar` carga sin error.
- [ ] Si existe `?workId=...`, se prellena o usa ese valor.
- [ ] Puede verificar una obra registrada en la demo.
- [ ] Maneja un ID inválido sin romper la página.
- [ ] Usa `verifyMockEvidence()`.
- [ ] No duplica tipos.
- [ ] Responsive.
- [ ] Lint/TypeScript/build pasan.

---

# 17. Pantalla pendiente 2 — Derechos / Licencia

## Ruta

```text
/obra/<id>/derechos
```

## Objetivo

Registrar un evento de licencia/derechos asociado a una obra.

## Base existente

Reutilizar:

```text
RightsEvent
createMockRightsEvidence()
getWork()
getEvents()
addEvent()
```

## Alcance mínimo

No construir un sistema legal complejo.

Para Semana 3 basta con demostrar un evento estructurado de derechos.

Campos razonables para el Functional Proof:

- tipo de evento;
- titular / receptor;
- descripción o alcance;
- fecha;
- notas opcionales.

Si el tipo actual o la estructura existente ya define campos concretos, usar esa implementación como fuente antes de inventar nuevos.

## Flujo sugerido

```text
Detalle
  ↓
Registrar licencia
  ↓
Formulario de derechos
  ↓
Crear evidencia mock
  ↓
Guardar RightsEvent
  ↓
Confirmación
  ↓
Ver historial
```

## Acceptance criteria

- [ ] Carga la obra correcta por `[id]`.
- [ ] Maneja obra inexistente.
- [ ] Permite registrar al menos un evento de licencia.
- [ ] Usa `RightsEvent`.
- [ ] Usa la capa de storage existente.
- [ ] Usa mock Stellar existente cuando corresponda.
- [ ] No almacena archivo original.
- [ ] Al terminar, el evento aparece en Historial.
- [ ] Responsive.
- [ ] Lint/TypeScript/build pasan.

---

# 18. Pantalla pendiente 3 — Historial

## Ruta

```text
/obra/<id>/historial
```

## Objetivo

Mostrar los eventos asociados con la obra en orden cronológico.

## Base

Reutilizar:

```text
RightsEvent
getEvents()
Work
```

## Debe poder representar

- registro;
- evidencia;
- licencia;
- assignment;
- transfer.

No es necesario que todos los tipos tengan UI compleja. El objetivo es demostrar que el modelo puede representar el historial.

## UI sugerida

Un timeline/listado brutalista simple:

```text
HISTORIAL DE LA OBRA

[ REGISTRO ]
fecha
detalle

[ EVIDENCIA ]
fecha
tx / hash

[ LICENCIA ]
fecha
titular / receptor
detalle
```

## Acceptance criteria

- [ ] Carga por `workId`.
- [ ] Maneja obra inexistente.
- [ ] Usa `getEvents()`.
- [ ] Filtra por propiedades estructuradas.
- [ ] Muestra al menos registro/evidencia y licencias existentes.
- [ ] Orden cronológico claro.
- [ ] Responsive.
- [ ] Lint/TypeScript/build pasan.

---

# 19. Orden recomendado de implementación

Trabajar en este orden:

## Paso 1 — Preparar branch

```bash
cd ~/Authory

git switch main
git pull origin main
git switch -c feat/frontend-completion
```

Confirmar:

```bash
git status
```

Debe estar limpio.

---

## Paso 2 — Instalar / levantar frontend

```bash
cd ~/Authory/frontend

nvm use
npm install
npm run dev
```

Abrir el sitio y probar el flujo actual antes de modificarlo.

---

## Paso 3 — Revisar contratos existentes

Leer:

```text
frontend/types/work.ts
frontend/types/rights-event.ts
frontend/types/stellar.ts

frontend/lib/storage.ts
frontend/lib/mock-data.ts
frontend/lib/stellar/mock-stellar.ts

frontend/components/authory/
frontend/components/ui/
frontend/components/layout/
```

No comenzar una pantalla nueva antes de entender estos archivos.

---

## Paso 4 — Implementar Verificación

Crear la ruta:

```text
frontend/app/verificar/page.tsx
```

y uno o más componentes dentro de:

```text
frontend/components/authory/
```

si hace falta.

No colocar toda la lógica en `page.tsx`.

---

## Paso 5 — Validar Verificación

Probar:

```text
/verificar
/verificar?workId=<id-válido>
/verificar?workId=AUTH-INVALIDO
```

Luego:

```bash
npm run lint
npx tsc --noEmit
```

---

## Paso 6 — Implementar Derechos / Licencia

Crear:

```text
frontend/app/obra/[id]/derechos/page.tsx
```

Separar formulario en componente si crece.

Usar el `id` de la ruta y cargar la obra existente.

---

## Paso 7 — Implementar Historial

Crear:

```text
frontend/app/obra/[id]/historial/page.tsx
```

Reutilizar eventos persistidos.

---

## Paso 8 — Probar integración entre las tres pantallas

Flujo principal:

```text
Registrar obra
→ Generar evidencia
→ Detalle
→ Registrar licencia
→ Historial
→ Verificar
```

Refrescar páginas durante el flujo para confirmar que el uso de `localStorage` sigue funcionando.

---

## Paso 9 — QA técnico

Ejecutar:

```bash
cd ~/Authory/frontend

npm run lint
npx tsc --noEmit
npm run build
```

Los tres deben pasar antes del PR.

---

## Paso 10 — Smoke test final

Probar manualmente:

### Home

- carga;
- CTA Register;
- CTA Verify.

### Registro

- campos;
- validaciones;
- archivo;
- URL;
- generación;
- evidencia creada.

### Detalle

- metadata;
- evidencia;
- botones.

### Verificación

- válido;
- inválido;
- acceso desde navbar;
- acceso desde Detalle.

### Derechos

- obra válida;
- obra inválida;
- creación de evento.

### Historial

- carga eventos;
- orden;
- estado vacío si aplica.

### Responsive

Revisar al menos:

- desktop;
- viewport móvil.

---

# 20. Estrategia de Git recomendada

Usar una branch nueva desde `main`.

```text
feat/frontend-completion
```

Commits recomendados por bloque:

```text
feat: implement work verification screen
feat: implement rights registration flow
feat: implement work history screen
chore: finalize frontend QA and handoff
```

No es obligatorio usar exactamente estos mensajes, pero conviene mantener commits pequeños y claros.

Antes de cada commit:

```bash
git status --short
git diff
```

Después:

```bash
git add <archivos-específicos>
git diff --cached
git commit -m "..."
git push
```

No usar `git add .` automáticamente si hay archivos que no pertenecen a la tarea.

---

# 21. Deployment

Frontend 01 no decidió proveedor.

Frontend 02 puede elegir el mecanismo de deployment.

Antes de desplegar:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

El deployment debe apuntar a la versión final mergeada o a la branch acordada por el equipo.

Una vez disponible, guardar la URL para:

- QA;
- documentación de Semana 3;
- entrega.

---

# 22. README

El README final debe ser simple.

Debe incluir principalmente:

```text
Requirements
Installation
How to run
```

Información sugerida:

## Requirements

```text
Node.js 22.23.3
npm
```

## Installation

```bash
cd frontend
nvm use
npm install
```

## Run

```bash
npm run dev
```

## Production build

```bash
npm run build
npm start
```

No convertir el README en la documentación larga del proyecto.

---

# 23. Documentación de Semana 3

Este handoff no sustituye:

```text
docs/semana3/Documentacion.md
```

La documentación final debería cubrir al menos:

## Front construido

- las 6 pantallas;
- recorrido;
- screenshots;
- URL desplegada si existe;
- conexión con Product Blueprint.

## Decisión técnica

- estrategia Stellar;
- justificación;
- qué está mock;
- siguiente paso hacia integración real.

## Participación

- GitHub username;
- contribución de cada integrante.

## Bloqueos / siguiente paso

- backend;
- Stellar real;
- storage real;
- contratos;
- autenticación;
- otros elementos fuera del Functional Proof.

---

# 24. Fuera del MVP

No implementar ahora salvo decisión explícita del equipo:

- colaboración entre autores;
- coautoría compleja;
- porcentajes de ownership;
- multisig;
- árbol completo de versiones;
- marketplace;
- pagos;
- notificaciones;
- workflows enterprise;
- autenticación real;
- mainnet;
- almacenamiento on-chain de originales.

No convertir la entrega de Semana 3 en una plataforma productiva completa.

---

# 25. Fuera de la implementación técnica actual

Actualmente tampoco existen:

- backend real;
- API real;
- base de datos;
- storage real;
- Stellar SDK integrado;
- Stellar RPC;
- Soroban;
- contratos desplegados;
- transacciones reales.

La UI debe ser honesta respecto a esta condición.

---

# 26. Detalles de Next.js que ya se resolvieron

La ruta dinámica actual:

```text
/obra/[id]
```

usa una configuración que evita problemas de prerender con los params:

```ts
export const instant = false;
```

No eliminar esto sin comprobar primero que el route sigue construyendo correctamente.

El build actual reconoce la ruta como Partial Prerender.

También puede aparecer este warning:

```text
Next.js ignored package-lock.json in /Users/daniela because it is outside the current Git repository
```

Es un warning de entorno local y no bloqueó:

```text
lint
tsc
build
```

No ejecutar cambios grandes sólo para eliminarlo durante la entrega si no afecta la aplicación.

---

# 27. Consideraciones de hidratación

El Detalle de obra lee `localStorage` en cliente después del mount.

Esto fue intencional para evitar mismatch SSR/client.

Si se añaden nuevas rutas que dependan de `localStorage`:

- no intentar leerlo durante SSR;
- usar guards client-side;
- usar `useEffect` cuando sea necesario;
- mantener un estado inicial neutral.

Si aparece un hydration mismatch después de muchos cambios en dev, antes de rediseñar la arquitectura:

```bash
rm -rf .next
npm run dev
```

Se detectó anteriormente que HMR/Turbopack podía conservar estado stale.

---

# 28. Reglas para mantener coherencia

## Hacer

- reutilizar tipos;
- reutilizar storage;
- reutilizar mock Stellar;
- reutilizar componentes;
- mantener rutas acordadas;
- mantener el mismo sistema visual;
- validar cada bloque antes de avanzar;
- mantener los textos principales en español.

## No hacer

- crear un segundo objeto `Work`;
- crear otra abstracción de storage sin razón;
- crear otro generador de hashes mock;
- guardar `File` en localStorage;
- subir archivos originales a Stellar;
- añadir autenticación;
- introducir una UI completamente distinta;
- añadir funcionalidades Post-MVP;
- presentar Testnet mock como blockchain real.

---

# 29. Definition of Done de Frontend 02

Frontend 02 puede considerarse terminado cuando:

- [ ] `/verificar` está implementado;
- [ ] `/verificar?workId=<id>` funciona;
- [ ] `/obra/[id]/derechos` funciona;
- [ ] puede registrarse un evento de licencia/derechos;
- [ ] `/obra/[id]/historial` funciona;
- [ ] los eventos se reflejan en historial;
- [ ] el flujo completo funciona tras refresh;
- [ ] las 6 pantallas comparten identidad visual;
- [ ] no se duplicaron contratos principales;
- [ ] no se persiste el archivo original;
- [ ] `npm run lint` pasa;
- [ ] `npx tsc --noEmit` pasa;
- [ ] `npm run build` pasa;
- [ ] QA manual completado;
- [ ] deployment final realizado o decisión documentada;
- [ ] PR mergeado a `main`;
- [ ] README actualizado;
- [ ] documentación de Semana 3 actualizada.

---

# 30. Checklist antes de abrir PR

```text
[ ] git status limpio antes de empezar
[ ] main actualizado
[ ] branch propia
[ ] Verificación terminada
[ ] Derechos terminados
[ ] Historial terminado
[ ] navegación probada
[ ] refresh probado
[ ] error states probados
[ ] mobile probado
[ ] lint
[ ] tsc
[ ] build
[ ] diff revisado
[ ] no archivos accidentales
[ ] mocks claramente identificados
```

---

# 31. Prompt listo para cargar en Cursor / Claude / ChatGPT

Copiar el bloque siguiente como instrucción inicial junto con este archivo o con acceso al repositorio.

---

## PROMPT DE CONTINUACIÓN

Estás continuando el frontend de un proyecto llamado **Authory**, desarrollado para la Semana 3 de Blockchain Builders 101 de Stellar x BAF.

Tu tarea es completar el frontend restante del Functional Proof sin rehacer la foundation existente.

### Fuente de verdad

Revisa primero:

1. `docs/semana2/ProductBlueprint.md`
2. `docs/semana1/ProblemBrief.md`
3. este archivo de handoff
4. implementación actual de `main`

No amplíes el MVP sin necesidad.

### Estado actual

Ya están implementados y mergeados a `main`:

- Home
- Registro de obra
- Generación de evidencia
- Detalle de obra
- foundation Next.js
- TypeScript
- Tailwind
- React Hook Form
- Zod
- componentes compartidos
- tipos de dominio
- localStorage abstraction
- mock Stellar Testnet

### Stack

- Node.js 22.23.3
- npm
- Next.js 16.4.0
- React 19.3.0
- TypeScript
- App Router
- Tailwind CSS 4
- Turbopack
- React Hook Form
- Zod

### Pantallas que faltan

Implementa exactamente:

1. `/verificar`
2. `/obra/[id]/derechos`
3. `/obra/[id]/historial`

### Rutas ya esperadas

```text
/verificar?workId=<id>
/obra/<id>/derechos
/obra/<id>/historial
```

### Reutiliza

Antes de crear código, inspecciona:

```text
frontend/types/work.ts
frontend/types/rights-event.ts
frontend/types/stellar.ts

frontend/lib/storage.ts
frontend/lib/mock-data.ts
frontend/lib/stellar/mock-stellar.ts

frontend/components/layout/
frontend/components/ui/
frontend/components/authory/
```

No crees un segundo modelo de `Work`, `RightsEvent`, storage o mock Stellar.

### Privacidad

Nunca persistas el archivo original.

Sólo metadata:

- filename
- fileSize
- fileMimeType
- sourceUrl cuando exista

No envíes archivos on-chain.

### Blockchain

La integración de Semana 3 es mock.

No implementes Stellar SDK, RPC, Soroban o transacciones reales salvo que el usuario lo solicite explícitamente.

No presentes hashes/transaction IDs mock como evidencia blockchain real.

### Diseño

Mantén el diseño actual:

- brutalista;
- fondo blanco;
- bordes negros;
- cyan;
- amarillo;
- sin gradients;
- sin glassmorphism;
- sin sombras decorativas;
- casi sin border-radius;
- Space Grotesk + IBM Plex Mono.

No reintroduzcas labels como `01 / HOME`.

### Implementación

Trabaja en este orden:

1. inspeccionar repo;
2. comprobar flujo actual;
3. implementar Verificación;
4. validar;
5. implementar Derechos/Licencia;
6. validar;
7. implementar Historial;
8. conectar navegación;
9. QA integral;
10. lint;
11. TypeScript;
12. build;
13. revisar diff;
14. preparar PR.

### Verificación

Debe reutilizar:

- `VerificationInput`
- `VerificationResult`
- `verifyMockEvidence()`

Debe manejar:

- query `workId`;
- ID válido;
- ID inválido;
- estado de loading;
- resultado.

### Derechos

Debe reutilizar:

- `RightsEvent`
- `createMockRightsEvidence()`
- storage actual

Debe permitir registrar al menos un evento de licencia/derechos para una obra existente.

### Historial

Debe:

- leer eventos existentes;
- filtrar por propiedades estructuradas;
- mostrar eventos en orden;
- reflejar el evento creado en Derechos.

### QA obligatorio

Ejecuta:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

No consideres la tarea terminada si alguno falla.

### Flujo final esperado

```text
Home
→ Registrar obra
→ Generar evidencia
→ Detalle
→ Registrar licencia
→ Historial
→ Verificar obra
```

### Fuera de alcance

No implementar:

- auth real;
- backend;
- DB;
- collaboration;
- multisig;
- marketplace;
- payments;
- notifications;
- Stellar real;
- Soroban;
- mainnet.

### Modo de trabajo

Antes de modificar archivos:

1. explica brevemente qué encontraste;
2. indica qué archivos modificarás;
3. haz cambios mínimos;
4. no reestructures código sano sin necesidad;
5. no cambies rutas existentes;
6. no cambies contracts internos sólo por preferencias de estilo;
7. reporta cualquier incompatibilidad antes de inventar una solución paralela.

Cuando termines cada pantalla, informa:

- archivos cambiados;
- flujo implementado;
- validaciones realizadas;
- pendientes reales.

---

# 32. Primeros comandos para la persona que continúa

```bash
cd ~/Authory

git switch main
git pull origin main
git status
```

Crear branch:

```bash
git switch -c feat/frontend-completion
```

Frontend:

```bash
cd frontend
nvm use
npm install
npm run dev
```

Antes de escribir código, probar:

```text
/
→ /registrar-obra
→ generar evidencia
→ /obra/<id>
```

Después comenzar con:

```text
/verificar
```

---

# 33. Resultado esperado al final de la semana

El proyecto debería quedar navegable como una prueba funcional coherente:

```text
HOME
│
├── REGISTRAR OBRA
│      │
│      └── GENERAR EVIDENCIA
│              │
│              └── DETALLE DE OBRA
│                     ├── VERIFICAR OBRA
│                     ├── DERECHOS / LICENCIA
│                     └── HISTORIAL
│
└── VERIFICAR OBRA
```

La meta no es demostrar una infraestructura blockchain productiva todavía.

La meta es demostrar claramente:

- qué problema resuelve Authory;
- cómo un creador registra una obra;
- cómo se genera evidencia;
- cómo se consulta;
- cómo un tercero la verifica;
- cómo se registra un evento de derechos;
- cómo se consulta la trazabilidad.

Mantener el scope pequeño, coherente y demostrable.
