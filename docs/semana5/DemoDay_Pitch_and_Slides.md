# Authory — Pitch Deck & Speech para Demo Day (7 Minutos Oficiales)

**Programa:** Blockchain Builders 101 — Stellar × BAF × Ruta N  
**Módulo:** Demostrar (Sesión #9 — Fer Tello)  
**Proyecto:** Authory (Plataforma de atestación de autoría y trazabilidad de derechos en Stellar)  
**Posición en el Evento:** **Proyecto Finalista #1 de México** (Apertura del bloque de México tras los 10 proyectos de Colombia)  
**Tiempo Total Asignado:** **7 Minutos Estrictos**  
- **Bloque 1: Presentación / Pitch:** 3 minutos (180 s)  
- **Bloque 2: Demostración en Vivo:** 2 minutos (120 s)  
- **Bloque 3: Preguntas del Jurado:** 2 minutos (120 s)  

---

## 1. Asignación Operativa de Roles y Logística

Siguiendo las pautas de la Sesión #9 y los requerimientos del comité evaluador:
- **Cámaras encendidas:** Todos los integrantes que intervengan deben mantener su cámara encendida y estar en un espacio libre de ruidos.
- **Quien narra (Orador principal):** Habla con claridad, proyecta la voz, mantiene contacto visual con la cámara y **no toca la computadora ni la interfaz** durante el pitch.
- **Quien maneja (Driver de la demo):** Tiene preparado el navegador en `authority-khaki.vercel.app/registrar-obra`, una pestaña con `/verificar`, otra pestaña con Stellar Expert en el contrato `CAOAFGP...`, y el archivo de prueba en el escritorio. Ejecuta las acciones en silencio, con calma y en perfecta sincronía con el narrador.
- **Quien vigila (Timekeeper y Plan B):** Lleva el cronómetro en mano:
  - Avisa al llegar al **minuto 2:45** para cerrar el pitch.
  - Avisa al conductor de la demo en el **minuto 4:45** para cerrar la pantalla compartida.
  - Si una transacción tarda más de 15 segundos o falla el internet, activa de inmediato la reproducción del video de respaldo en segundo plano.

---

## 2. «Las Frases que Unen» (Estructura de Continuidad)

Para superar la **«Prueba del ¿Y entonces?»** de Fer Tello y evitar saltos abruptos:

1. **Del Problema a la Solución:**  
   > *«Para resolver esta asimetría y darle a los creadores una ventaja inmutable sin intermediarios, construimos Authory.»*
2. **De la Solución a la Evidencia:**  
   > *«¿Cómo comprueba cualquier persona en el mundo que esto no es una base de datos nuestra? Aquí está el registro en la red pública de Stellar.»*
3. **De la Evidencia a la Validación:**  
   > *«Durante este camino aprendimos que la tecnología no sirve si genera fricción…»*
4. **Del Cierre a la Demo (Transición de Bloque a los 3:00 min):**  
   > *«Y para ver exactamente cómo lo vive Mateo en tiempo real, pasemos a nuestra demostración en vivo.»*
5. **De la Demo al Jurado (Transición de Bloque a los 5:00 min):**  
   > *«Esta es la certeza que Authory le brinda a los creadores. Quedamos a disposición del jurado para sus preguntas.»*

---

## 3. Matriz de Diapositivas — Bloque 1: Pitch (3 Minutos)

### Diapositiva 1: Portada & Contexto (0:00 - 0:15 | 15 s)
- **Titular:** **AUTHORY** — Memoria inalterable y derechos en Stellar.
- **Subtítulo:** Atestación criptográfica de autoría y licencias sin intermediarios.
- **Insignia:** PROYECTO FINALISTA #1 DE MÉXICO · STELLAR × BAF · SESIÓN #9 DEMOSTRAR
- **Equipo:** Alain Bonilla, Daniela Ramírez, Selene Escalona, Rodrigo Ramírez, Owen Isaac Bailón.

### Diapositiva 2: El Problema con Mateo (0:15 - 0:50 | 35 s)
- **Titular:** MATEO Y EL ROBO DE SU OBRA: CONSTRUIDO NO ES DEMOSTRADO
- **Caso Real:** Mateo, ilustrador independiente en Medellín/CDMX. Entregó personajes para revisión comercial; la agencia canceló por "presupuesto" y al mes siguiente vio sus ilustraciones en vallas comerciales sin pago ni crédito.
- **El Dato de Peso:** **71% de los creadores independientes** han sufrido plagio o impago de sus trabajos (*Fuente: Freelancers Union & WIPO Creative Survey*).
- **La Fricción Central:** Fechas locales en archivos de Photoshop o cadenas de correo. Cualquier peritaje judicial cuesta más que el proyecto mismo.

### Diapositiva 3: Dos Actores, Una Sola Historia (0:50 - 1:20 | 30 s)
- **Titular:** DOS ACTORES, UNA SOLA HISTORIA
- **Actor 1: Mateo (Registra):** Necesita un sello de existencia inmutable desde el minuto cero, manteniendo su archivo original privado y sin pagar costos notariales.
- **Actor 2: La Editorial / Comprador (Consulta):** Necesita auditar en 5 segundos si quien le vende tiene la titularidad legítima para licenciar la obra, sin requerir cuentas ni instalar extensiones.
- *Regla:* La historia se cuenta desde Mateo; la editorial aparece cuando se necesita.

### Diapositiva 4: La Propuesta de Valor & ¿Por qué Blockchain? (1:20 - 1:55 | 35 s)
- **Titular:** LA PROPUESTA DE VALOR: ¿POR QUÉ BLOCKCHAIN?
- **Fórmula de Valor:**  
  - **Para:** Creadores digitales e ilustradores independientes,  
  - **Que:** No pueden comprobar la precedencia ni licencias de sus obras,  
  - **Authory permite:** Generar un pasaporte digital y un sello temporal inmutable en Stellar manteniendo el archivo confidencial,  
  - **A diferencia de:** Archivos y correos que cualquiera puede manipular o plataformas cerradas.
- **¿Por qué Blockchain en una sola frase?:**  
  > *«Porque la huella queda en un registro público descentralizado que ninguna de las partes puede modificar después y que cualquiera puede auditar sin pedir permiso.»*

### Diapositiva 5: Evidencia Técnica en Stellar (1:55 - 2:25 | 30 s)
- **Titular:** EVIDENCIA QUE SÍ VA EN STELLAR
- **Smart Contract Desplegado en Soroban Testnet:**  
  `CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO`  
  Wasm Hash: `ba7d1753ecf002984aee4a87c80b64af...`
- **Transacciones en Vivo con Eventos Nativos:**  
  - Registro de obra: `725e126cc799...` (Evento nativo `work_reg`).  
  - Registro de licencia: `30f6f7e9a1df...` (Evento nativo `right_evt`).
- **Repositorio y Despliegue:** `github.com/nidaela/Authory` (9/9 suites de pruebas passing) | App en producción en Vercel: `authority-khaki.vercel.app`.

### Diapositiva 6: Validación Honesta & Aprendizajes (2:25 - 2:45 | 20 s)
- **Titular:** LO COMPROBADO Y LO POR COMPROBAR
- **«Creemos» (Hipótesis Crítica):** 4 de cada 5 creadores incluirán el sello de Authory en sus presupuestos comerciales para protegerse del plagio.
- **«Observamos» (Ajuste Interno):** Exigir wallet y gas en el onboarding expulsaba a creadores Web2. Ajustamos la UX para calcular SHA-256 en RAM instantáneamente sin barreras de entrada.
- **«Comprobamos» (Evidencia Técnica):** Smart contract propio de 5 métodos en Soroban ejecutando atestaciones inmutables en menos de 3 segundos sobre Testnet.

### Diapositiva 7: Cierre del Pitch & Pedido Concreto (2:45 - 3:00 | 15 s)
- **Titular:** EL FUTURO DE AUTHORY: PEDIDO CONCRETO
- **Hoja de ruta (Próximos 30 días):** Integrar Stellar Wallets Kit (Freighter) para firma de custodia propia y piloto con 10 ilustradores independientes.
- **Pedido Concreto al Jurado:**  
  > *«Buscamos 5 agencias creativas y 10 creadores independientes que quieran proteger y certificar sus próximas 3 entregas comerciales con Authory.»*
- **Frase de Transición a la Demo:** *«Y para ver exactamente cómo lo vive Mateo, pasemos a la demostración en vivo.»*

---

## 4. Guion Operativo — Bloque 2: Demostración en Vivo (2 Minutos | 3:00 - 5:00)

| Tiempo | Paso del Flujo | Qué se ve en pantalla | Qué dice el narrador (Resultados, NO clics) | Qué hace el Driver | Plan B (Si falla) |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **0:00 - 0:30**<br>(30 s) | **1. Hash Local** | Pestaña de `/registrar-obra`. El driver arrastra el archivo de ilustración de Mateo. Aparece al instante el cálculo SHA-256 de 64 caracteres. | *«Vamos a ponernos en los zapatos de Mateo. Acaba de terminar su ilustración y necesita protegerla antes de enviarla a la agencia. Al seleccionarla, la Web Crypto API en su navegador calcula instantáneamente la huella digital matemática de la obra. Noten algo crucial: el archivo original jamás viaja por internet; su arte sigue siendo 100% privado en su máquina.»* | Arrastra el archivo, verifica que el hash se calcule y hace clic en 'Crear evidencia →'. | Si el cálculo local falla, abrir directamente la obra demo precargada `AUTH-2026-000101`. |
| **0:30 - 1:00**<br>(30 s) | **2. Soroban** | Animación de emisión en 4 pasos y redirección a `/obra/[id]` con la tarjeta de confirmación verde y el ID de transacción. | *«En este momento, Authory invoca nuestro contrato inteligente en Soroban Testnet. La red estampa de manera inalterable la huella digital y la fecha en el ledger de Stellar, emitiendo el evento nativo de registro. Mateo ya tiene su evidencia de autoría legalmente auditable.»* | Muestra la ficha de detalle, el ID de obra y copia el enlace de verificación pública. | Si la red de pruebas tarda >10 s: *«Mientras el ledger confirma el bloque, veamos el registro ya verificado»* y switch a pestaña de respaldo. |
| **1:00 - 1:35**<br>(35 s) | **3. Auditoría Pública** | Driver abre pestaña de `/verificar`, arrastra el mismo archivo recibido por la editorial y el sistema marca "Obra Auténtica y Verificada". | *«Ahora cambiamos de rol y nos ponemos en el lugar de la editorial. Llega el comprador a la pantalla de verificación pública y, sin necesidad de crear cuenta, contraseñas ni pedirle permiso a Mateo, sube el archivo recibido. En menos de 3 segundos, Authory contrasta los bytes contra Stellar: confirma que el arte es original de Mateo, que la fecha precede a la campaña y que no ha sido alterado ni un solo pixel.»* | Arrastra el archivo a `/verificar` y muestra el badge verde de autenticidad y el historial de derechos. | Si la verificación remota se demora, mostrar el certificado HTML exportado previamente. |
| **1:35 - 2:00**<br>(25 s) | **4. Explorador Oficial** | Pestaña de Stellar Expert con el contrato `CAOAFGP...`, la transacción y el evento nativo `work_reg`. | *«¿Y cómo sabe la editorial que esto no es un truco de nuestra aplicación? Porque aquí está la transacción en el explorador oficial de Stellar Expert: el contrato CAOAFGP... registró la huella de forma pública e inalterable. Esta es la certeza técnica que Authory le devuelve a los creadores. Quedamos a disposición del jurado para sus preguntas.»* | Hace scroll suave sobre la pestaña de Stellar Expert mostrando los tópicos del evento. | Si se corta el internet, reproducir el video de respaldo (minuto 1:15) en YouTube o local. |

---

## 5. Speech Completo para el Orador (Bloques 1 y 2 | 5:00 min)

### Bloque 1: Pitch (0:00 - 3:00)

> **[0:00 - 0:15 | Slide 1: Portada]**  
> *«Buenas tardes a todos, miembros del jurado y comunidad. Somos el equipo de **Authory**, proyecto finalista de México, y hoy venimos a presentarles la infraestructura sobre la red Stellar para que los creadores independientes certifiquen su autoría y comercialicen sus derechos con total certeza.»*
>
> **[0:15 - 0:50 | Slide 2: El Problema de Mateo]**  
> *«Les presento a Mateo. Mateo es un ilustrador independiente. Hace tres meses, invirtió semanas creando una serie de personajes para una agencia comercial. Entregó bocetos por correo, compartió carpetas en la nube y, cuando el proyecto se canceló supuestamente 'por presupuesto', vio sus ilustraciones impresas en vallas publicitarias sin su crédito y sin un solo centavo de pago.*  
> *El caso de Mateo no es un accidente aislado: según la Freelancers Union y la OMPI, más del **71% de los creadores independientes** han sufrido apropiación o impago de sus trabajos. ¿Por qué no reclaman? Porque hoy sus únicas pruebas son fechas locales de Photoshop o cadenas de correo que cualquier peritaje puede descartar. Reclamar cuesta más dinero y tiempo que lo que vale el proyecto.»*
>
> **[0:50 - 1:20 | Slide 3: Dos Actores, Una Historia]**  
> *«Aquí intervienen dos partes con una fricción mutua: Mateo necesita una prueba de existencia inmutable desde el minuto cero; y del otro lado, las editoriales y compradores honestos necesitan comprobar que quien les vende una obra realmente tiene la titularidad legítima para licenciarla, sin tener que esperar semanas de trámites notariales.»*
>
> **[1:20 - 1:55 | Slide 4: Propuesta de Valor & ¿Por qué Blockchain?]**  
> *«**Para resolver esta asimetría y devolverle el control a los creadores, construimos Authory.**  
> Para ilustradores como Mateo, Authory permite generar un pasaporte digital y un sello temporal inmutable en Stellar manteniendo el archivo original estrictamente confidencial.  
> La audiencia y el jurado se preguntarán: **¿Por qué blockchain y no una base de datos normal?**  
> Porque si almacenamos esto en una base de datos tradicional, la confianza depende del administrador. Si la empresa quiebra o altera un registro, la prueba muere. En la red Stellar, el sello queda anclado en un ledger distribuido que ninguna de las partes puede modificar y que cualquier persona puede verificar de por vida de forma independiente.»*
>
> **[1:55 - 2:25 | Slide 5: Evidencia Técnica]**  
> *«**¿Cómo comprueba cualquier persona en el mundo que esto no es un truco de interfaz? Aquí está el registro en la red pública de Stellar.**  
> Nuestro contrato inteligente está desplegado en Soroban Testnet con la dirección `CAOAFGP...`. Tenemos transacciones reales emitidas en vivo como `725e12...`, el código fuente está abierto y documentado en nuestro repositorio con guías de reproducción paso a paso, y la aplicación está desplegada y accesible hoy mismo en Vercel.»*
>
> **[2:25 - 2:45 | Slide 6: Aprendizajes y Validación]**  
> *«Durante estas semanas aprendimos algo fundamental: la tecnología no sirve si genera fricción. En nuestras primeras pruebas descubrimos que exigirle al creador conectar una billetera con saldo de gas antes de registrar su primer dibujo hacía que el 80% abandonara. Por eso rediseñamos la experiencia: generamos el cálculo criptográfico en el cliente y la evidencia de forma transparente.  
> Lo que **observamos** es que el creador busca simplicidad; lo que **comprobamos** es que el contrato ejecuta las atestaciones en menos de 3 segundos; y lo que **vamos a validar** con nuestro protocolo de 10 usuarios es que 4 de cada 5 incluirán este sello en sus cotizaciones comerciales.»*
>
> **[2:45 - 3:00 | Slide 7: Cierre del Pitch & Transición]**  
> *«Lo que sigue en los próximos 30 días es integrar Stellar Wallets Kit para firma descentralizada nativa y lanzar nuestro primer piloto con comunidades creativas.  
> Por eso, hoy venimos a hacerles un pedido concreto:  
> **Buscamos 5 agencias creativas y 10 creadores independientes que quieran proteger y certificar sus próximas 3 entregas con Authory.**  
> **Y para ver exactamente cómo lo vive Mateo en tiempo real, pasemos a nuestra demostración en vivo.**»*

---

### Bloque 2: Demostración en Vivo (3:00 - 5:00)

> **[3:00 - 3:30 | Demo Paso 1: Hash Local]**  
> *(El driver comparte pantalla en `/registrar-obra`)*  
> *«Vamos a ponernos en los zapatos de Mateo. Acaba de terminar su ilustración y necesita protegerla antes de enviarla a la agencia. Al seleccionarla, la Web Crypto API en su navegador calcula instantáneamente la huella digital matemática de la obra. Noten algo crucial: el archivo original jamás viaja por internet; su arte sigue siendo 100% privado en su máquina.»*
>
> **[3:30 - 4:00 | Demo Paso 2: Atestación en Soroban]**  
> *(El driver presiona 'Crear evidencia →' y muestra la confirmación)*  
> *«En este momento, Authory invoca nuestro contrato inteligente en Soroban Testnet. La red estampa de manera inalterable la huella digital y la fecha en el ledger de Stellar, emitiendo el evento nativo de registro. Mateo ya tiene su evidencia de autoría legalmente auditable.»*
>
> **[4:00 - 4:35 | Demo Paso 3: Verificación Pública]**  
> *(El driver pasa a `/verificar` y arrastra el archivo)*  
> *«Ahora cambiamos de rol y nos ponemos en el lugar de la editorial. Llega el comprador a la pantalla de verificación pública y, sin necesidad de crear cuenta, contraseñas ni pedirle permiso a Mateo, sube el archivo recibido. En menos de 3 segundos, Authory contrasta los bytes contra Stellar: confirma que el arte es original de Mateo, que la fecha precede a la campaña y que no ha sido alterado ni un solo pixel.»*
>
> **[4:35 - 5:00 | Demo Paso 4: Explorador Stellar Expert]**  
> *(El driver muestra la pestaña de Stellar Expert)*  
> *«¿Y cómo sabe la editorial que esto no es un truco de nuestra aplicación? Porque aquí está la transacción en el explorador oficial de Stellar Expert: el contrato `CAOAFGP...` registró la huella de forma pública e inalterable. Esta es la certeza técnica que Authory le devuelve a los creadores. Quedamos a disposición del jurado para sus preguntas.»*

---

## 6. Banco de Respuestas — Bloque 3: Preguntas del Jurado (2 Minutos | 5:00 - 7:00)

### P1: «¿Por qué usar Stellar/Soroban y no una base de datos relacional tradicional (PostgreSQL)?»
> **Respuesta directa (35 segundos):**  
> *«Una base de datos tradicional requiere confiar ciegamente en quien administra el servidor. Si surge una disputa legal dentro de tres años y el administrador puede editar una fila de la base de datos o si la empresa quiebra, la prueba pierde su validez probatoria ante terceros. Stellar nos da neutralidad: la estampa de tiempo y el hash son inmutables, la red es descentralizada, las comisiones son de menos de $0.001 USD y la confirmación tarda 3 a 5 segundos, lo cual es ideal para una experiencia ágil de usuario.»*

### P2: «¿Y si alguien registra una obra que no es suya (fraude de origen o plagio previo)?»
> **Respuesta directa (35 segundos):**  
> *«Esa es una de las mayores trampas del sector y somos totalmente honestos: la blockchain certifica la precedencia y la existencia inmutable en un momento del tiempo, no la verdad absoluta del mundo físico. Authory no es un perito de arte ni un juez; lo que Authory le otorga a Mateo es una estampa de tiempo neutra que demuestra que él poseía ese archivo en esa fecha exacta. Si un plagiador intenta registrarlo después, la marca de Mateo en Stellar tiene precedencia temporal verificable sobre cualquier reclamo posterior.»*

### P3: «¿Cuánto cuesta una atestación y quién paga las comisiones de red?»
> **Respuesta directa (30 segundos):**  
> *«En la red Stellar, el costo por transacción en Soroban es de fracciones minúsculas de centavo. En nuestro modelo de onboarding actual, Authory patrocina las primeras atestaciones mediante cuentas operativas para no frenar la adopción de usuarios Web2. Para usuarios avanzados y empresas, cada entidad firma desde su propia cuenta con lumens a un costo despreciable en comparación con los $50 o $100 dólares que cobra un trámite notarial tradicional.»*

### P4: «¿Cómo protegen el archivo original para que no sea pirateado desde su plataforma?»
> **Respuesta directa (25 segundos):**  
> *«El archivo original jamás se sube a la blockchain. En el navegador del usuario se ejecuta la Web Crypto API nativa mediante la función SHA-256 sobre los bytes del archivo. A la red Stellar únicamente viaja una cadena hexadecimal de 64 caracteres. Es matemáticamente imposible reconstruir el dibujo a partir del hash; por lo tanto, el contenido de la obra permanece 100% privado en posesión del creador.»*
