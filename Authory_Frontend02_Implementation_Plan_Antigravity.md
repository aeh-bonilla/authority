# Authory — Plan de implementación Frontend 02

Fecha de análisis: 10 de octubre de 2026.

Entorno de ejecución previsto: IDE Antigravity, modelo Gemini 3.8 Flash, razonamiento medio, según la configuración solicitada. Este plan no depende de funciones particulares del IDE ni presupone la disponibilidad del modelo en la cuenta: seleccionar esa configuración en el IDE antes de ejecutar los prompts.

Este entregable es un plan. No se implementaron pantallas ni se modificó el código de la aplicación durante el análisis.

## 1. Fuentes revisadas y reglas de alcance

Rutas relativas a la raíz real del proyecto: `/Users/abonilla/Documents/stellar/authority`.

1. `docs/semana2/ProductBlueprint.md`: prioridad funcional, flujo, MVP y arquitectura futura.
2. `docs/semana1/ProblemBrief.md`: problema, actores, privacidad y límites de las afirmaciones sobre autoría.
3. `docs/semana2/arquitectura_inicial_con_red_stellar.png`: arquitectura prevista, con backend, storage privado y Stellar.
4. Implementación local: `frontend/types/`, `frontend/lib/`, componentes, rutas, configuración, manifiesto y README.
5. `Authory_Frontend02_Context_and_Next_Steps.md`: entrega operativa de Semana 3 y criterios de finalización.
6. `frontend/AGENTS.md` y documentación de Next instalada en `frontend/node_modules/next/dist/docs/`: contratos actuales de rutas y parámetros.
7. `docs/semana2/AlainBonilla.md`: contexto complementario sobre certificado y comparación por archivo; no sustituye el Blueprint.

El Blueprint define el producto; el handoff concreta una prueba funcional de Semana 3 con Stellar simulado. Backend, autenticación, blockchain real y almacenamiento privado del diagrama son arquitectura futura, no requisitos de implementación de este frontend. La privacidad del original sigue siendo obligatoria.

Hay divergencias que deben registrarse en la entrega:

| Requisito del Blueprint | Situación y decisión propuesta |
| --- | --- |
| Verificación por ID/hash en el flujo; por ID/archivo en la tabla del MVP | Implementar ID/hash en esta entrega. Comparar bytes de archivos requiere resolver la generación de hash real; es una brecha explícita, no una capacidad ya satisfecha por el mock. |
| Certificado descargable y enlace verificable | No está implementado ni aparece en los pendientes del handoff. Incluir certificado de demostración y acción para copiar enlace como fase delimitada, por prioridad del Blueprint. |
| Verificación pública por terceros | Las rutas no requieren cuenta, pero una obra creada localmente no existe en otro navegador. Explicar esta limitación; copiar la URL no la vuelve pública. |
| Evidencia inmutable en Stellar | En Semana 3 se demuestra el recorrido con un mock; no se prueba inmutabilidad, integridad del archivo ni identidad del autor. |

Si el equipo decide aplazar certificado o comparación por archivo, documentar responsable, motivo y siguiente paso. No declarar cumplimiento completo del Blueprint mientras existan esas brechas. La prueba funcional del handoff puede cerrarse con sus criterios específicos y las limitaciones declaradas.

## 2. Diagnóstico basado en el código

| Hallazgo | Evidencia | Implicación |
| --- | --- | --- |
| Faltan las tres rutas | No existen `app/verificar`, `app/obra/[id]/derechos` ni `app/obra/[id]/historial` | Implementar las superficies y conectar el flujo. |
| Solo se persiste una obra | `getWork()` no recibe ID; `saveWork()` sobrescribe `authory_work` | Mantener una demo de una obra activa; no construir un catálogo. Comparar siempre el ID solicitado con `getWork().id`. |
| El registro no crea eventos | `register-work-flow.tsx` importa y llama `saveWork()`, no `addEvent()`/`saveEvents()` | Una obra nueva tendría historial sin registro ni evidencia propios. Corregir antes de Historial. |
| Los eventos iniciales pertenecen a la obra demo | `demoEvents` usa `AUTH-2026-001234`; `getEvents()` devuelve esos eventos si no hay almacenamiento | Filtrar siempre por `event.workId`; crear eventos para obras nuevas. No mostrar eventos ajenos. |
| El guardado puede fallar silenciosamente | `writeStoredValue()` captura errores y devuelve `void` | La UI podría anunciar éxito sin persistencia. Añadir resultado de escritura y confirmación verificable. |
| JSON válido puede tener estructura inválida | `readStoredValue<T>()` hace un cast sin validación de forma | Validar las estructuras recuperadas antes de consumir arrays/campos; conservar fallback seguro. |
| Hash y transacción son simulados | `generateMockHash()` genera hexadecimal aleatorio | Cambiar copy `HASH SHA-256` por `HASH SIMULADO` en las superficies de demo. |
| La verificación tiene dos fuentes | Mapas en memoria y reconstrucción desde `getWork()` | Probar tras refresh. Evitar validar obras anteriores que solo sobreviven en memoria. |
| Una consulta combinada podría aceptar coincidencia parcial | `getStoredWorkEvidence()` compara ID **o** hash; los mapas priorizan ID | Si se entregan ambos campos, exigir coincidencia de ambos con la misma evidencia. |
| Evidencia de derechos también entra al mapa por hash | `createMockRightsEvidence()` usa `storeEvidence(..., false)` | Verificación de obra debe rechazar un hash de licencia como si fuese el hash de la obra. |
| Fechas y actor ya están modelados | `RightsEvent` tiene `actor`, `recipient`, `effectiveDate`, `terms`, `notes`, `createdAt` | Mapear formulario a estos campos; no inventar un tipo paralelo. |
| `.nvmrc` está en la raíz | `authority/.nvmrc` contiene `22.23.3` | No crear otro archivo en frontend por asumir que falta. |
| README y documentación necesitan cierre | README raíz es plantilla; frontend conserva texto de scaffold; `docs/semana3/Documentacion.md` no existe | Actualizar README y crear documentación consolidada. No sobrescribir la plantilla individual. |

Estado local observado: rama `main`, cambios previos en `.DS_Store` y `frontend/package-lock.json`; handoff sin seguimiento Git. No asumir un árbol limpio ni revertir/stashear esos cambios automáticamente. No se comprobó que `origin/main` refleje el remoto más reciente mediante fetch.

Validación ejecutada durante el análisis:

- `npm run lint`: exit code 0.
- `npx --no-install tsc --noEmit --incremental false`: exit code 0.
- Runtime disponible durante esas comprobaciones: Node `v26.0.0`, distinto del fijado en `.nvmrc`. Repetir con el runtime del proyecto durante implementación.
- No se ejecutaron build, servidor, QA de navegador ni deployment. Los resultados anteriores no demuestran el flujo funcional.

## 3. Estrategia para Antigravity y razonamiento medio

Ejecutar una fase por interacción. Cada instrucción tendrá objetivo único, archivos permitidos, contratos, casos de prueba y condición de cierre. Esto hace el avance revisable y reduce cambios fuera de alcance, sin asumir capacidades particulares del modelo.

Crear `docs/semana3/Frontend02_Progress.md` durante implementación con una tabla: fase, estado, archivos, comandos y resultado, QA manual, bloqueos y próxima acción. Leerla al reanudar una sesión. Registrar fallos literalmente y evitar marcar como probado lo que solo se inspeccionó.

Al terminar cada fase: revisar diff, reportar resultado y pasar a la siguiente únicamente cuando sus comprobaciones pasen. Las decisiones rutinarias ya definidas aquí no requieren nuevas consultas. Un cambio de alcance, proveedor con costo o publicación externa sí debe resolverse con el equipo antes de ejecutarse.

No pedir al modelo que implemente todo el plan en un solo turno. No delegar a otros agentes ni reestructurar arquitectura sana.

## 4. Fase 0 — Preparación y baseline

**Objetivo:** comenzar desde un estado conocido sin perder trabajo existente.

1. Abrir la raíz `authority`, no el directorio padre `stellar`.
2. Leer `frontend/AGENTS.md`, las fuentes de la sección 1 y los contratos antes de editar.
3. Inspeccionar `git status --short --branch` y los cambios previos. Aislarlos del trabajo nuevo sin descartarlos. Crear `feat/frontend-completion` desde la base acordada, comprobando antes si ya existe. Actualizar desde remoto solo cuando se pueda hacer sin sobrescribir cambios locales.
4. Ejecutar `nvm use` desde la raíz; comprobar Node y npm. Usar dependencias instaladas si son coherentes. Para instalación reproducible, preferir `npm ci` tras revisar el lockfile modificado; no sustituirlo ni regenerarlo por preferencia.
5. Desde `frontend`, ejecutar lint, TypeScript y build; iniciar dev y recorrer Home → Registro → Evidencia → Detalle.
6. Registrar baseline, capturas y errores previos. No atribuir problemas del entorno a las nuevas pantallas.

**Salida:** entorno confirmado, baseline documentado y cambios previos identificados. Un build que falla por red/fuentes debe quedar como no verificado hasta resolverlo; no desactivar comprobaciones para forzar éxito.

## 5. Fase 1 — Persistencia y eventos iniciales

**Archivos principales:** `frontend/lib/storage.ts`, `frontend/components/authory/register-work-flow.tsx`. Solo si se necesitan esquemas compartidos, añadirlos dentro de `frontend/lib/`, derivados de los contratos existentes.

1. Mantener `Work`, `RightsEvent`, claves actuales y las funciones existentes. La demo sigue conservando una sola obra activa.
2. Añadir validación de forma al recuperar datos: obra con campos obligatorios y enums válidos; array de eventos con campos obligatorios válidos. Tratar corrupción sin hacer crash ni inventar datos de éxito.
3. Hacer observable el resultado de las escrituras en storage; adaptar consumidores afectados. Puede ser un retorno booleano compatible con llamadas existentes, sin una segunda capa de persistencia.
4. Tras confirmar evidencia de una obra, persistir dos eventos de su `workId`: `registration` y `evidence`. Incluir actor, timestamps y referencia de la evidencia. Usar campos disponibles; `RightsEvent` no tiene campo hash.
5. Asegurar idempotencia por `(workId, type)` para estos dos eventos iniciales: un reintento no debe duplicarlos. No aplicar esa regla a licencias, donde varias son legítimas.
6. Centralizar la operación compuesta en un helper de `storage.ts` que conserve eventos anteriores y agregue solo los que faltan. Capturar estado previo y manejar fallos parciales; las escrituras a dos claves de localStorage no son una transacción atómica.
7. No mostrar confirmación persistente hasta comprobar éxito de los guardados necesarios. Si falla, conservar valores del formulario y ofrecer reintento; no crear otro ID en cada reintento del mismo registro.
8. Para una obra local ya registrada sin eventos iniciales, ejecutar la misma reconciliación idempotente desde Historial. Mantener timestamps de la obra y documentar que son reconstruidos desde datos locales, no nuevos eventos blockchain.

**Aceptación:** obra nueva conserva metadata y ambos eventos tras refresh; reintento no duplica eventos; JSON malformado/forma inválida no rompe la pantalla; storage bloqueado/cuota agotada muestra error; ningún `File`, blob, base64 o contenido original se serializa.

## 6. Fase 2 — Verificación por ID/hash

**Crear:** `frontend/app/verificar/page.tsx` y `frontend/components/authory/work-verification.tsx`.

**Modificar solo si es necesario:** `frontend/lib/stellar/mock-stellar.ts`, componentes de evidencia y copy del registro.

1. Mantener `page.tsx` pequeño con layout compartido. Leer `workId` de la URL y pasarlo al componente de flujo. Elegir una sola estrategia acorde a las guías instaladas: `searchParams` como Promise con frontera de Suspense adecuada, o `useSearchParams()` en cliente dentro de Suspense. Comprobar prerender mediante build.
2. Para rutas dinámicas, conservar el patrón de `params: Promise<{ id: string }>` y revisar `instant = false` conforme a la implementación y guías locales. No cambiar `cacheComponents`/`partialPrefetching` para ocultar errores.
3. Input etiquetado `Authory ID o hash simulado`; prellenar desde query y esperar envío explícito. Normalizar espacios; validar hash hexadecimal de 64 caracteres y formato ID sin limitar al año 2026. Hash puede normalizarse a minúsculas.
4. Construir `VerificationInput`; usar `verifyMockEvidence()`. Mantener `VerificationResult`, sin tipos paralelos ni un nuevo generador de hash.
5. Estados: inicial, verificando, coincidencia, sin coincidencia y error técnico. Deshabilitar envío durante operación y evitar que un resultado anterior sobrescriba una búsqueda más reciente o sobreviva incorrectamente al cambio de input.
6. Hacer que el mock de verificación de obra sea coherente con la obra activa persistida: validar ID/hash y evidencia de esa obra. No devolver como obra verificable un hash de derechos o una obra reemplazada que únicamente permanezca en los mapas. Si llegan ID y hash juntos, ambos deben coincidir.
7. Mostrar metadata solo cuando `getWork().id` coincida con el resultado. Reutilizar `WorkMetadata` y `StellarEvidence` cuando cubran el patrón. Mostrar mensajes de UI en español sin cambiar enums internos.
8. Añadir aviso visible: `Demostración local. Evidencia simulada; no se consultó Stellar ni se comparó el contenido del archivo.` Cambiar los labels SHA-256 engañosos en registro/detalle.
9. Ofrecer enlaces a Detalle e Historial de la obra encontrada. La consulta no necesita modificar `Work.status` ni crear un evento: no es una operación de derechos.

**Aceptación:** `/verificar`, query válida/inválida/vacía, ID/hash válidos, hash inválido, sin resultado, doble envío, búsqueda repetida, refresh y hash de licencia. No hay 404 de ruta, hydration mismatch ni promesa de verificación real.

## 7. Fase 3 — Derechos / Licencia

**Crear:** `frontend/app/obra/[id]/derechos/page.tsx` y `frontend/components/authory/rights-registration-flow.tsx`.

1. Pasar el ID de ruta al componente cliente y cargar `getWork()` después de mount. Estado inicial neutral; comparar el ID antes de permitir operaciones.
2. Implementar formulario con React Hook Form y Zod. Ofrecer `license` y `assignment` como tipos de captura; dejar `transfer` soportado por Historial sin añadir un workflow adicional.
3. Mapeo concreto:

| Campo UI | Campo de RightsEvent | Regla |
| --- | --- | --- |
| Tipo | `type` | `license` o `assignment`; license por defecto |
| Declarante/titular | `actor` | Obligatorio; prellenar autor y permitir corrección. No equivale a identidad autenticada |
| Receptor | `recipient` | Obligatorio para el formulario de licencia/cesión |
| Alcance/condiciones | `terms` | Texto obligatorio con trim |
| Fecha efectiva | `effectiveDate` | Fecha calendario válida y conversión explícita a ISO |
| Notas | `notes` | Opcional; omitir si está vacío |

4. Generar `id`, `createdAt` y `workId` en la aplicación; identificador de evento con UUID del navegador o utilidad existente apropiada, sin un nuevo generador de hashes.
5. Crear `RightsEvent`, llamar `createMockRightsEvidence(event)` y agregar `stellarTransactionId` devuelto. Solo ejecutar `addEvent()` al completar evidencia y validar que siga activa la misma obra.
6. Bloquear doble submit. Conservar el mismo ID del evento durante reintentos; storage debe impedir agregar dos veces el mismo ID, sin impedir licencias distintas.
7. Confirmar únicamente tras persistencia exitosa. Mostrar error recuperable si falla mock o storage; conservar formulario. No modificar el autor original ni inferir automáticamente al titular legal actual a partir del evento.
8. Confirmación con tipo, receptor, fecha, ID del evento y referencia simulada; acciones a Historial y Detalle. No presentar un contrato legal ni una transferencia ejecutada en blockchain.

**Aceptación:** obra inexistente no habilita formulario; validaciones por campo; licencia y cesión válidas aparecen tras refresh; doble click/reintento no duplica el mismo evento; falla de storage no muestra éxito; el original nunca se solicita ni se persiste en este flujo.

## 8. Fase 4 — Historial

**Crear:** `frontend/app/obra/[id]/historial/page.tsx` y `frontend/components/authory/work-history.tsx`.

1. Cargar obra y eventos en cliente después de mount. Resolver obra inexistente antes de mostrar eventos.
2. Reconciliar eventos iniciales ausentes con el helper de fase 1 y manejar su fallo. No generar transacciones nuevas para rellenar el historial.
3. Leer `getEvents()` y filtrar por igualdad exacta de `workId`.
4. Ordenar una copia por `createdAt` ascendente, del registro más antiguo al más reciente; desempatar por `id`. Mostrar `effectiveDate` por separado cuando difiera: fecha de registro del evento y vigencia significan cosas distintas.
5. Usar un mapa exhaustivo de labels por `RightsEventType`: Registro, Evidencia, Licencia, Cesión y Transferencia. Filtrar por `type` si se incorpora filtro, nunca por texto de labels.
6. Mostrar actor, receptor si existe, términos, notas, fechas y referencia simulada. No intentar leer `event.hash`, que no existe en el contrato.
7. Estados: cargando, obra inexistente, sin eventos, lista y error. Si una fecha histórica no se puede interpretar, mostrar un fallback claro sin romper orden/render.
8. Mantener enlaces a Detalle, Derechos y Verificación. Releer datos al volver al flujo cuando corresponda; no conservar una lista obsoleta tras registrar una licencia.

**Aceptación:** eventos de obra demo y nueva; licencias/cesiones recién creadas; render de los cinco tipos mediante fixtures temporales; ausencia de eventos ajenos; orden determinista; refresh y regreso mediante navegación.

## 9. Fase 5 — Certificado y enlace del Blueprint

**Objetivo:** cubrir la omisión del handoff sin nuevas pantallas ni librerías.

**Archivos propuestos:** `frontend/components/authory/work-detail.tsx` y `frontend/lib/demo-certificate.ts`.

1. Agregar `DESCARGAR CERTIFICADO DE DEMOSTRACIÓN` en Detalle. Descargar un archivo HTML autónomo imprimible con título, autor, ID, fechas, hash, referencia, red y URL de verificación. No requiere PDF ni una dependencia adicional.
2. Escapar todos los campos introducidos por el usuario antes de construir HTML y validar URLs. No incluir scripts ni archivo original; liberar el object URL tras la descarga.
3. Aviso prominente: documento de demostración basado en datos locales, evidencia simulada, sin acreditación de identidad ni consulta de blockchain.
4. Acción `COPIAR ENLACE DE VERIFICACIÓN`: URL del origen actual más `/verificar?workId=...`; manejar fallo de clipboard con campo seleccionable.
5. Aclarar junto a la acción que los registros nuevos solo se consultan en el mismo navegador/origen. Una URL desplegada no sincroniza localStorage.
6. Registrar certificado HTML como formato de prueba; PDF y publicación real por terceros requieren una decisión posterior si el equipo los exige.

**Aceptación:** archivo descargado abre sin red, imprime legiblemente, presenta los datos correctos y el aviso; caracteres especiales no se convierten en HTML ejecutable; enlace respeta el origen y codifica el ID; error de clipboard recuperable.

### Brecha separada: comparación por archivo

No implementarla como una comparación contra hashes aleatorios: daría una demostración falsa. Para incorporarla se necesitaría una decisión explícita que amplíe el handoff con hash criptográfico real calculado localmente en el registro y la verificación, conservando Stellar como mock. Eso exige definir obras con URL sin bytes disponibles, compatibilidad con registros previos, límites de tamaño y UX de archivos distintos. Registrar esta dependencia en Semana 3. No guardar ni enviar los bytes al persistir metadata.

## 10. Fase 6 — QA integral y accesibilidad

Mantener blanco, bordes negros, cyan/amarillo y las tipografías actuales. Reutilizar UI y layout; no añadir librerías de estado ni otro sistema visual. Usar labels, errores asociados a inputs, foco visible, estados con `aria-live` y navegación por teclado. Hashes e IDs largos deben poder consultarse completos y ajustarse a móvil.

| Caso | Resultado esperado |
| --- | --- |
| Demo sin datos locales | ID `AUTH-2026-001234` y sus eventos, evidencia declarada simulada |
| Registrar archivo | Solo nombre/tamaño/MIME persistidos; eventos propios de registro/evidencia |
| Registrar mediante URL | Metadata y evidencia mock; no afirmar lectura/hash de contenido remoto |
| Detalle → Derechos → Historial → Verificación | Datos consistentes de la misma obra |
| ID válido por query y entrada manual | Coincidencia mock sin cuenta |
| ID/hash inválidos y query repetida | Mensaje claro, sin crash ni metadata de otra obra |
| Crear licencia/cesión y refrescar | Evento aparece una vez con receptor y condiciones |
| Registrar una segunda obra | Obra activa reemplazada; ninguna pantalla muestra eventos de la anterior como propios |
| Hash de derechos introducido como obra | No se acepta como evidencia de la obra |
| JSON roto/forma inválida/storage denegado | Fallback o error claro, sin confirmación falsa de guardado |
| Otro navegador u origen | Limitación local documentada; no prometer acceso compartido a obras nuevas |
| Certificado y enlace | Descarga correcta, aviso visible y copia/fallback funcional |
| Desktop 1440 px y móvil 390 px | Sin overflow; formulario, botones y timeline utilizables |
| Teclado y lectores de pantalla | Labels, foco y resultados anunciados |

Ejecutar desde `frontend`, con Node del proyecto:

```bash
npm run lint
npx --no-install tsc --noEmit
npm run build
```

Después probar `npm start` y las nuevas rutas con acceso directo y navegación interna. Hacer build al introducir `/verificar` y las rutas dinámicas; repetirlo al final o si cambia su comportamiento. El QA de producción es obligatorio aunque dev funcione.

Pruebas automatizadas focalizadas: idempotencia de eventos iniciales y licencia por ID, aislamiento por `workId`, coincidencia estricta ID/hash, rechazo del hash de derechos y reporte de escritura fallida. Usar infraestructura existente si está disponible; no introducir un framework grande solo para esta entrega. Registrar pruebas manuales si no existe runner y no atribuirles cobertura automatizada.

## 11. Fase 7 — Documentación, revisión y deployment

1. Actualizar `frontend/README.md`: Requirements, Installation, Run, Production build. Runtime desde `.nvmrc` raíz; npm como único gestor; mencionar demo local y mock. Actualizar README raíz brevemente con enlace al frontend y documentación.
2. Crear `docs/semana3/Documentacion.md`: seis pantallas, recorrido, capturas con rutas relativas, decisiones mock, brechas del Blueprint, URL si existe y contribuciones reales. No inventar usernames, capturas, resultados o participación.
3. Guardar evidencias de QA y actualizar el progreso. Separar fallos previos del trabajo nuevo.
4. Revisar diff y archivos específicos; no incluir `.DS_Store` ni cambios ajenos del lockfile. Preparar commits por persistencia, verificación, derechos, historial, certificado y documentación.
5. Preparar PR con alcance, limitaciones y resultados de QA. Push, publicación y merge se ejecutarán cuando el equipo los autorice en la sesión de implementación; este pedido solo autoriza elaborar el plan.
6. Dejar build y documentación preparados antes de elegir/publicar hosting. Acordar proveedor y rama/commit a desplegar; no asumir una cuenta, un costo ni desplegar una rama arbitraria.
7. Validar que el hosting soporte la configuración actual de Next. No convertir a static export ni quitar flags para facilitar deployment sin revisión.
8. Tras publicación autorizada, repetir smoke test en URL real, en móvil y desktop; distinguir datos locales de localhost y del dominio desplegado. Registrar URL, commit, fecha y resultado.

**Cierre:** criterios del handoff comprobados, errores abiertos documentados, PR/merge y deployment reales cuando procedan. Si no hay autorización/cuenta de deployment, dejar entrega preparada y estado pendiente con responsable; no marcar despliegue realizado.

## 12. Prompts para ejecutar el plan

### Prompt inicial

```text
Continúa Authory en este repositorio con Antigravity y la configuración solicitada
Gemini 3.8 Flash / razonamiento medio.

Lee Authory_Frontend02_Implementation_Plan_Antigravity.md y las fuentes que enumera.
Respeta frontend/AGENTS.md y consulta las guías de la versión instalada de Next
antes de escribir código de rutas. El plan es la guía operativa; el Blueprint
define el producto y el handoff define la prueba funcional de Semana 3.

Ejecuta SOLO la fase 0. Inspecciona cambios locales y no los reviertas ni stashees
automáticamente. Confirma runtime, contratos, baseline y flujo existente.
Crea docs/semana3/Frontend02_Progress.md con evidencias reales.
No implementes pantallas en este turno, no publiques ni hagas merge.
Al terminar informa hallazgos, comandos y resultados, archivos cambiados,
bloqueos y la próxima fase. No declares pruebas que no ejecutaste.
```

### Plantilla para cada fase de implementación

```text
Lee el plan y docs/semana3/Frontend02_Progress.md.
Ejecuta SOLO la fase [N]: [nombre de la fase].

Antes de editar, revisa los archivos indicados y reporta brevemente el cambio
concreto. Reutiliza Work, RightsEvent, VerificationInput, VerificationResult,
storage, mock Stellar y UI existentes. No cambies dependencias ni arquitectura
fuera de lo necesario. No persistas File/bytes/base64 ni simules blockchain real.

Respeta las decisiones y aceptación de esta fase. Corrige los errores derivados
de ella, verifica sus casos, ejecuta lint y TypeScript; realiza build cuando la
fase cambie rutas/prerender. Actualiza progreso con resultados verificables.
No avances a otra fase, publiques ni hagas merge en este turno.

Devuelve: archivos cambiados, comportamiento resultante, comandos y resultados,
QA manual realizado, brechas pendientes y siguiente acción.
```

Secuencia de instrucciones para esa plantilla:

| Turno | Sustitución de fase |
| --- | --- |
| 1 | Fase 1: persistencia y eventos iniciales |
| 2 | Fase 2: verificación por ID/hash y copy honesto |
| 3 | Fase 3: licencia/cesión con evidencia y persistencia |
| 4 | Fase 4: historial filtrado y ordenado |
| 5 | Fase 5: certificado HTML de demo y enlace |
| 6 | Fase 6: QA integral, producción y accesibilidad |
| 7 | Fase 7: documentación y preparación de entrega; publicar solo con autorización |

### Prompt de auditoría final

```text
Audita el diff de Frontend 02 frente al plan, el handoff y ProductBlueprint.
Revisa aislamiento por workId, eventos iniciales, idempotencia, fallos de storage,
privacidad del archivo, verificación estricta y copy de simulación.
Comprueba las tres rutas nuevas, el certificado y las acciones de navegación.
Ejecuta lint, TypeScript y build con el runtime correcto; prueba el flujo en
producción local y documenta qué QA pudiste ejecutar.
Corrige defectos dentro del alcance. No añadas backend, autenticación, Stellar
real ni hash de archivo real sin decisión explícita de alcance.
Reporta separado: funcionalidad comprobada, limitaciones del Blueprint,
validación pendiente y estado de PR/deployment. No publiques ni hagas merge.
```

## 13. Definition of Done verificable

- [ ] Tres rutas nuevas cargan y manejan IDs inexistentes.
- [ ] Verificación por ID/hash funciona tras refresh y distingue evidencia de derechos.
- [ ] Registro nuevo crea eventos iniciales de su obra sin duplicados por reintento.
- [ ] Licencia/cesión conserva evento y referencia simulada; errores no muestran éxito.
- [ ] Historial filtra por `workId`, representa los cinco tipos y ordena determinísticamente.
- [ ] Certificado de demo y copia de enlace funcionan, o su aplazamiento queda acordado y documentado.
- [ ] No se persiste contenido original ni se afirma que un hash aleatorio sea SHA-256 del archivo.
- [ ] Limitación de una obra activa, acceso local y verificación por archivo pendiente documentadas.
- [ ] UI coherente, responsive y accesible; flujo completo probado con refresh.
- [ ] Lint, TypeScript, build y smoke de producción pasan con el runtime fijado.
- [ ] README, progreso y documentación de Semana 3 reflejan resultados reales.
- [ ] Diff sin cambios ajenos; PR/merge verificados cuando se autoricen.
- [ ] Deployment validado o decisión pendiente registrada con responsable.

La aprobación de la prueba funcional no implica que la arquitectura futura o todas las promesas del Blueprint estén implementadas. La documentación debe permitir distinguir ambas cosas.
