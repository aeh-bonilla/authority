# Authory — MVP Functional

**Proyecto:** Authory  
**Programa:** Blockchain Builders 101 — Stellar × BAF  
**Entregable:** Semana 4 — MVP funcional

## 1. Aprendizajes y ajustes priorizados

> Extensión requerida: 150–300 palabras.
>
> Esta sección debe describir qué aprendió el equipo durante el desarrollo e integración del MVP, qué ajustes se identificaron, cómo se priorizan según impacto y esfuerzo, cuáles se realizarán antes del cierre y cuáles quedarán pendientes.


## 2. Riesgos y pendientes

Authory propone registrar evidencias de autoría y eventos de derechos sobre obras digitales mediante Stellar, manteniendo el contenido original fuera de la cadena. Los siguientes riesgos se priorizan por su posible impacto en la confianza, la continuidad del servicio y la utilidad para creadores y terceros. Las probabilidades son estimaciones cualitativas iniciales, no resultados de pruebas con usuarios.

**R1. Integridad y trazabilidad de evidencias — probabilidad media, impacto alto.** Una diferencia entre el archivo, su huella criptográfica y el registro consultado podría producir verificaciones incorrectas. También debe evitarse que una licencia o cesión aparezca desvinculada de la obra correspondiente. Como mitigación, se contemplan pruebas de extremo a extremo, comprobaciones de hash y referencias públicas a las transacciones de testnet.

**R2. Identidad y alcance de los derechos — probabilidad media, impacto alto.** Registrar una declaración en blockchain no acredita por sí solo la identidad del autor ni la validez jurídica de una cesión. Es importante distinguir evidencia técnica de titularidad legal, definir quién puede registrar eventos de derechos y explicar estas limitaciones con claridad a los usuarios.

**R3. Privacidad y protección de información — probabilidad media, impacto alto.** Los registros públicos son difíciles de rectificar o retirar. Por ello, se debe minimizar la información incluida en Stellar, evitar publicar archivos originales o datos personales innecesarios y documentar qué información permanece fuera de la cadena.

**R4. Dependencias técnicas — probabilidad media, impacto alto.** La conectividad con Stellar, las firmas rechazadas, las demoras de confirmación o los reinicios de testnet pueden interrumpir una operación. Las medidas previstas incluyen mensajes comprensibles, manejo de errores, prevención de registros duplicados y procedimientos reproducibles de despliegue y verificación.

**R5. Adopción y comprensión — probabilidad por determinar, impacto alto.** Es posible que los creadores consideren suficientes sus métodos actuales o que terceros confundan un registro verificable con una certificación legal. Se evaluarán necesidad, comprensión y disposición a utilizar Authory mediante entrevistas y pruebas de usabilidad.

**Pendientes y seguimiento.** Para el cierre del sprint, el equipo deberá reunir las evidencias públicas exigidas y revisar el comportamiento de los flujos principales y sus errores. Para etapas posteriores quedan el fortalecimiento de identidad y autorización, la gestión de disputas, la robustez operativa fuera de testnet y la validación de adopción con usuarios reales. Su prioridad se ajustará según impacto y esfuerzo, utilizando la evidencia recogida durante las pruebas.

## 3. Plan de validación con usuarios

**Objetivo.** Determinar si Authory responde a una necesidad relevante para quienes crean obras digitales y si sus registros pueden consultarse y comprenderse sin asistencia. El plan parte del Problem Brief y del Product Blueprint: los usuarios principales son creadores digitales —por ejemplo, ilustradores, diseñadores, fotógrafos, músicos y desarrolladores—; los usuarios secundarios son clientes o compradores que necesitan verificar procedencia y consultar eventos de derechos.

**Hipótesis críticas y criterios previos a las pruebas:**

1. **H1. Deseabilidad.** Creemos que los creadores valoran una evidencia de autoría fácil de compartir porque hoy deben reunir pruebas dispersas. **Criterio:** al menos cuatro de cinco describen un caso concreto reciente en que enfrentaron esa dificultad y aceptan realizar una prueba posterior de Authory. Se considerarán acciones y experiencias, no cumplidos u opiniones generales.

2. **H2. Usabilidad del registro.** Creemos que un creador puede registrar una obra de prueba y localizar su evidencia sin recibir indicaciones. **Criterio:** al menos cuatro de cinco completan el recorrido sin ayuda e identifican correctamente la referencia del registro.

3. **H3. Comprensión de la verificación.** Creemos que un cliente o comprador puede consultar la procedencia de una obra y entender el alcance de la evidencia. **Criterio:** al menos cuatro de cinco consultan una obra de prueba sin asistencia y distinguen entre registro técnico de información y acreditación legal de autoría o derechos.

**Participantes y captación.** Se propone una primera ronda con cinco creadores y cinco clientes o compradores, ajenos al equipo de desarrollo. Se contactarán mediante comunidades creativas y redes profesionales, verificando previamente su perfil con un formulario breve. Las sesiones se programarán después del sprint, una vez preparado un recorrido estable de prueba.

**Métodos y escenarios.** Primero se harán entrevistas sobre comportamientos pasados: «¿Qué hiciste la última vez que necesitaste demostrar que una obra era tuya?» y «¿Cómo verificaste los derechos de una obra antes de utilizarla?». Después se realizarán pruebas moderadas con situaciones, no instrucciones: «Terminaste una ilustración y necesitas conservar una evidencia que puedas compartir» o «Un proveedor te envía una obra y quieres comprobar su procedencia». Una persona moderará sin guiar; otra observará y tomará notas. Se invitará a pensar en voz alta.

**Evidencias, métricas y decisiones.** Por participante se documentarán acción, comentario, paso del recorrido e interpretación por separado. Se medirán finalización sin ayuda, abandono, solicitudes de asistencia y tiempo empleado. La validez técnica de las operaciones se contrastará por separado con sus referencias públicas de Stellar Testnet. Las grabaciones requerirán consentimiento y se usarán únicamente datos de prueba. Con los umbrales fijados antes de observar resultados, cuatro o cinco casos favorables permitirán continuar; tres exigirán ajustar y repetir; dos o menos motivarán replantear la hipótesis o el flujo antes de ampliarlo.

## 4. Evidencias verificables del MVP

> Pendiente de completar por el equipo durante el cierre del Sprint 4.
>
> Esta sección deberá incorporar únicamente enlaces públicos reales y comprobados:
>
> - Repositorio de Authory.
> - Contrato inteligente desplegado en Stellar Testnet.
> - Transacciones verificables en el explorador de Stellar.
> - Video público del MVP funcional, de máximo 3 minutos.

---
