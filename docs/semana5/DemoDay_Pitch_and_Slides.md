# Authory — Pitch Deck & Speech para Demo Day
**Programa:** Blockchain Builders 101 — Stellar × BAF × Ruta N  
**Módulo:** Demostrar (Sesión #9 — Fer Tello)  
**Proyecto:** Authory (Plataforma de atestación de autoría y trazabilidad de derechos en Stellar)  
**Tiempo total asignado:** 4 minutos y 30 segundos (Pitch: 2 min | Demo: 1 min 30 s | Cierre: 30 s)  

---

## 1. Ficha del Guion y Roles del Equipo

Siguiendo las pautas de la Sesión #9, los roles durante la presentación se reparten claramente:
- **Quien narra (Orador principal):** Cuenta la historia de Mateo (el usuario), mantiene el contacto visual con los jurados y la audiencia, y **no toca la computadora ni la interfaz**.
- **Quien maneja (Driver de la demo):** Tiene el navegador abierto en `authority-khaki.vercel.app`, la pestaña de Stellar Expert lista, el archivo de prueba en el escritorio y ejecuta los clics en silencio y con calma mientras el narrador habla de resultados.
- **Quien vigila (Timekeeper y Plan B):** Lleva el cronómetro en mano. Si a los 15 segundos una transacción no confirma o hay falla de internet, activa de inmediato la reproducción del video de respaldo en segundo plano.

---

## 2. Las Frases que Unen (Estructura de Continuidad)

Para superar la **«Prueba del ¿Y entonces?»** y evitar saltos abruptos, el hilo conductor utiliza estas frases obligatorias:

1. **Del Problema a la Solución:**  
   > *«Para resolver esta asimetría y darle a los creadores una ventaja inmutable sin intermediarios, construimos Authory.»*
2. **De la Solución a la Demo:**  
   > *«Veamos exactamente cómo lo vive Mateo hoy en Authory.»*
3. **De la Demo a la Evidencia:**  
   > *«¿Cómo comprueba cualquier persona en el mundo que esto no es solo una base de datos nuestra? Aquí está el registro en la red pública de Stellar.»*
4. **De la Evidencia al Cierre:**  
   > *«Lo que sigue en los próximos 30 días es…»*

---

## 3. Matriz de Diapositivas (Slide by Slide)

### Diapositiva 1: Portada & Contexto
- **Título en pantalla:** AUTHORY
- **Subtítulo:** Atestación de autoría y trazabilidad inalterable de derechos en Stellar.
- **Metadatos visuales:** Blockchain Builders 101 · Stellar × BAF · Equipo: Alain Bonilla, Daniela Ramírez, Selene Escalona, Rodrigo Ramírez, Owen Bailón.
- **Look & Feel:** Fondo oscuro Abisal (`#071f38`), tipografía Space Grotesk en mayúsculas, bordes índigo con resplandor turquesa (`#0faec8`), tag de versión `v1.0-mvp`.
- **Tiempo:** 15 segundos.

---

### Diapositiva 2: El Problema con un Caso Concreto (No una abstracción)
- **Título en pantalla:** MATEO Y EL ROBO DE SU TRABAJO
- **Contenido visual:**
  - *Caso:* Mateo es ilustrador independiente en Medellín. Tras entregar un set de personajes a un cliente, los vio publicados en una campaña comercial sin su nombre y sin liquidarle sus regalías.
  - *Dato con peso:* **71%** de los creadores y freelancers han sufrido apropiación o impago de sus obras (*Fuente: Freelancers Union & WIPO Report*).
  - *Fricción:* Sus únicas pruebas eran bocetos locales y correos dispersos. Reclamar le costaba más tiempo y honorarios legales que lo que valía el proyecto.
- **Regla aplicada:** Caso + Dato + Fuente = Problema Creíble.
- **Tiempo:** 30 segundos.

---

### Diapositiva 3: El Usuario y las Dos Caras de la Historia
- **Título en pantalla:** DOS USUARIOS, UNA SOLA HISTORIA
- **Contenido visual:**
  - **Lado A (Mateo - Creador):** Necesita estampar una huella inalterable de su obra en cuanto la termina, sin exponer su archivo secreto ni pagar tarifas imposibles.
  - **Lado B (La Editorial / Comprador):** Necesita auditar en 5 segundos si quien le ofrece el arte es el autor original y si tiene los derechos para comercializarlo, sin pedirle contraseñas ni instalar nada.
  - *Regla:* La historia se cuenta desde Mateo; el comprador aparece en el momento de la verdad.
- **Tiempo:** 25 segundos.

---

### Diapositiva 4: La Propuesta de Valor y ¿Por qué Blockchain?
- **Título en pantalla:** LA PROPUESTA DE VALOR DE AUTHORY
- **Fórmula de valor en pantalla:**
  - **Para:** Creadores digitales y artistas independientes,
  - **Que:** No pueden comprobar la fecha original de sus obras ni la titularidad de sus licencias,
  - **Authory permite:** Generar un pasaporte y sello temporal inmutable en Stellar manteniendo el archivo 100% privado,
  - **A diferencia de:** Correos, capturas y discos duros que cualquiera puede manipular o falsificar.
- **Recuadro destacado — ¿Por qué Blockchain?:**
  > *«Porque la huella queda en un registro público descentralizado que ninguna de las partes puede modificar después y que cualquiera puede auditar sin pedir permiso.»*
- **Tiempo:** 30 segundos.

---

### Diapositiva 5: Demostración en Vivo (El Flujo de Punta a Punta)
- **Título en pantalla:** DEMOSTRACIÓN DEL FLUJO CENTRAL
- **Esquema de pasos proyectado (mientras el driver interactúa en vivo):**
  1. **Generación de huella local:** Cálculo SHA-256 en memoria RAM del navegador (el archivo nunca sale de la máquina).
  2. **Registro de Evidencia:** El smart contract en Soroban sella la obra con estampa temporal inmutable.
  3. **Auditoría Pública:** La editorial verifica la obra en `/verificar` subiendo el archivo o ingresando el ID.
  4. **Emisión de Derechos:** Registro de una licencia comercial no exclusiva vinculada a la obra original.
- **Tiempo:** 90 segundos (1 min 30 s).

---

### Diapositiva 6: Evidencia Técnica Verificable (Auditable en Vivo)
- **Título en pantalla:** EVIDENCIA EN LA RED STELLAR
- **Contenido visual (con código QR y enlaces activos):**
  - **Smart Contract Desplegado:** `CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO` (Soroban Testnet).
  - **Transacción de Registro:** `725e126c...` (Evento nativo `work_reg`).
  - **Transacción de Derechos:** `30f6f7e9...` (Evento nativo `right_evt`).
  - **Repositorio Abierto & Readme:** `github.com/nidaela/Authory` con suite de tests passing y arquitectura reproducible.
  - **Aplicación en Vivo:** `authority-khaki.vercel.app`
- **Tiempo:** 25 segundos.

---

### Diapositiva 7: Lo Aprendido y Validación con Usuarios
- **Título en pantalla:** LO OBSERVADO Y LO QUE FALTA COMPROBAR
- **Contenido en 3 columnas:**
  - **Creemos (Hipótesis crítica):** 4 de cada 5 creadores adoptarán un enlace público de atestación en sus presupuestos comerciales.
  - **Observamos (Ajuste del recorrido interno):** En la primera iteración descubrimos que exigir wallet y gas al creador en el onboarding mataba la conversión; ajustamos la arquitectura para calcular el hash SHA-256 localmente de forma instantánea.
  - **Comprobamos (Métrica dura):** Smart contract propio de 5 métodos en Soroban con almacenamiento atómico y verificación en menos de 3 segundos.
- **Tiempo:** 25 segundos.

---

### Diapositiva 8: Siguientes Pasos & Pedido Concreto (Volviendo al Usuario)
- **Título en pantalla:** EL FUTURO DE AUTHORY
- **Contenido visual:**
  - **Hoja de ruta (Próximos 30 días):** Conexión con Stellar Wallets Kit (Freighter) para firma de custodia propia y piloto beta en producción.
  - **Pedido concreto al jurado y comunidad:**
    > *«Buscamos 5 estudios creativos y 10 ilustradores independientes que quieran certificar sus próximas 3 entregas comerciales con Authory.»*
  - **Imagen de cierre:** Mateo entregando su carpeta con el código QR y pasaporte de verificación de Authory. *(Sin la pantalla vacía de "¿Preguntas?").*
- **Tiempo:** 20 segundos.

---

## 4. Guion de la Demo (Tabla Operativa de 90 Segundos)

| Paso | Qué se ve en pantalla | Qué dice el narrador (Resultados, NO clics) | Tiempo | Modo | Plan B (Si falla) |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1. Contexto** | Pestaña de `authority-khaki.vercel.app/registrar-obra`. El driver tiene listo un archivo `personaje_mateo.png`. | *«Vamos a ser Mateo. Acaba de terminar la ilustración final de su personaje y necesita protegerla antes de enviarla a revisión.»* | **15 s** | En vivo | Si Vercel no carga, switch a localhost:3000 ya corriendo. |
| **2. Registro & Hash** | El driver arrastra el archivo. Aparece al instante el cálculo de la huella SHA-256 y presiona "Crear evidencia". | *«En una fracción de segundo, el navegador calcula la huella digital matemática de la obra. Noten algo crucial: el archivo original nunca sale de la máquina de Mateo. Su arte sigue siendo 100% privado.»* | **25 s** | En vivo | Si el cálculo local falla, mostrar la obra demo precargada en `/obra/AUTH-2026-000101`. |
| **3. Confirmación Soroban** | Pantalla de animación de 4 pasos de Stellar. Se redirige a `/obra/[id]` con la tarjeta verde de confirmación y el ID de transacción. | *«Authory interactúa con nuestro contrato inteligente en Soroban y estampa la fecha y el hash en el ledger de Stellar. Mateo ya tiene su certificado inmutable.»* | **20 s** | En vivo | Si la llamada a Soroban supera 10 segundos: *«Mientras la red de pruebas cierra el consenso, veamos la transacción ya confirmada»* y switch a la pestaña de Stellar Expert. |
| **4. Auditoría Pública** | Driver abre pestaña de `/verificar`, arrastra el mismo archivo y el sistema marca "Obra Auténtica y Verificada". | *«Ahora cambiamos de rol. La editorial recibe el archivo y, sin necesidad de crear cuenta ni pedirle permisos a Mateo, lo audita en Authory. El sistema confirma: la obra es original, fue registrada por Mateo y no ha sido alterada en un solo pixel.»* | **20 s** | En vivo | Si la verificación remota se demora, mostrar el certificado HTML exportado previamente. |
| **5. Cierre de la Demo** | Driver muestra la pestaña de Stellar Expert con el contrato y el evento `work_reg`. | *«Y aquí está la prueba externa: no es nuestra base de datos, es el ledger público de Stellar.»* | **10 s** | En vivo | Video de YouTube (minuto 1:15) listo en pestaña oculta. |

---

## 5. Speech Completo del Demo Day (Palabra por Palabra)

*(El orador habla con ritmo tranquilo, seguro, con pausas marcadas y proyectando la voz hacia los jurados)*

> **[0:00 - 0:15 | Slide 1: Portada]**  
> *«Buenas tardes a todos. Mi nombre es [Tu Nombre], y hoy venimos a presentarles **Authory**: la infraestructura sobre la red Stellar para que los creadores independientes certifiquen su autoría y comercialicen sus derechos con total certeza.»*
>
> **[0:15 - 0:45 | Slide 2: El Problema con Mateo]**  
> *«Les presento a Mateo. Mateo es un ilustrador digital independiente. Hace tres meses, invirtió semanas creando una serie de personajes para una agencia. Entregó bocetos por correo, compartió carpetas en la nube y, cuando el proyecto se canceló supuestamente 'por presupuesto', vio sus ilustraciones impresas en vallas publicitarias sin su crédito y sin un solo centavo de pago.*  
> *El caso de Mateo no es un accidente aislado: según la Freelancers Union, más del **70% de los creadores independientes** han sufrido plagio o impago de sus trabajos. ¿Por qué no reclaman? Porque hoy sus únicas pruebas son fechas locales en archivos de Photoshop o cadenas de correos que cualquier peritaje puede disputar. Reclamar cuesta más que lo que les deben.»*
>
> **[0:45 - 1:10 | Slide 3: Dos Usuarios, Una Historia]**  
> *«Aquí intervienen dos partes con una fricción mutua: Mateo necesita una prueba de existencia inmutable desde el minuto cero; y del otro lado, las editoriales y compradores honestos necesitan comprobar que quien les vende una obra realmente tiene la titularidad legítima para licenciarla, sin tener que esperar semanas de trámites notariales.»*
>
> **[1:10 - 1:40 | Slide 4: Propuesta de Valor & ¿Por qué Blockchain?]**  
> *«**Para resolver esta asimetría y devolverle el control a los creadores, construimos Authory.**  
> Para creadores como Mateo, Authory permite generar un pasaporte digital y un sello temporal inmutable en Stellar manteniendo el archivo original estrictamente confidencial.  
> La audiencia y el jurado se preguntarán: **¿Por qué blockchain y no una base de datos normal?**  
> Porque si almacenamos esto en una base de datos tradicional, la confianza depende de nosotros. Si la empresa cierra o altera un registro, la prueba muere. En la red Stellar, el sello queda anclado en un ledger distribuido que ninguna de las partes puede modificar y que cualquier persona puede verificar de por vida de forma independiente.»*
>
> **[1:40 - 3:10 | Slide 5: Demostración en Vivo]**  
> *«**Veamos exactamente cómo lo vive Mateo hoy en Authory.**  
> *(El driver inicia la demo en pantalla compartida)*  
> Mateo entra a la plataforma y selecciona su archivo. En este preciso instante, el navegador ejecuta un cálculo criptográfico SHA-256 en su memoria local. Noten esto: el arte de Mateo no viaja por internet, su privacidad sigue intacta.  
> Al confirmar, Authory invoca nuestro contrato inteligente en Soroban Testnet. La transacción se procesa y el contrato emite un evento inmutable con la estampa de tiempo del bloque y la huella digital.  
> *(El driver va a la pantalla de verificación)*  
> Ahora pongámonos en los zapatos de la editorial. Llega el comprador a la pantalla de verificación pública. Sin necesidad de registrarse, sube el archivo recibido. En menos de tres segundos, Authory consulta la red: identifica que el hash coincide exactamente con el registrado por Mateo y muestra su historial de licencias.  
> La editorial tiene la certeza de contratar con el autor legítimo, y Mateo tiene una prueba irrefutable respaldándolo.»*
>
> **[3:10 - 3:35 | Slide 6: Evidencia Técnica]**  
> *«**¿Cómo comprueba cualquier persona en el mundo que esto no es un truco de interfaz? Aquí está el registro en la red pública de Stellar.**  
> Nuestro contrato inteligente está desplegado en Soroban Testnet con la dirección `CAOAFGP...`. Tenemos transacciones reales emitidas en vivo como `725e12...`, el código fuente está abierto y documentado en nuestro repositorio con guías de reproducción paso a paso, y la aplicación está desplegada y accesible hoy mismo en Vercel.»*
>
> **[3:35 - 4:00 | Slide 7: Aprendizajes y Validación]**  
> *«Durante estas semanas aprendimos algo fundamental: la tecnología no sirve si genera fricción. En nuestras primeras pruebas descubrimos que exigirle al creador conectar una billetera con saldo de gas antes de registrar su primer dibujo hacía que el 80% abandonara. Por eso rediseñamos la experiencia: generamos el cálculo en el cliente y la evidencia de forma transparente.  
> Lo que **observamos** es que el creador busca simplicidad; lo que **comprobamos** es que el contrato ejecuta las atestaciones en menos de 3 segundos; y lo que **vamos a validar** con nuestro protocolo de 10 usuarios es que 4 de cada 5 incluirán este sello en sus cotizaciones comerciales.»*
>
> **[4:00 - 4:30 | Slide 8: Cierre y Pedido Concreto]**  
> *«**Lo que sigue en los próximos 30 días es** integrar Stellar Wallets Kit para firma descentralizada nativa y lanzar nuestro primer piloto con comunidades creativas.  
> Por eso, hoy no venimos a decirles 'gracias, ¿alguna pregunta?'. Hoy venimos a hacerles un pedido concreto:  
> **Buscamos 5 agencias creativas y 10 creadores independientes que quieran proteger y certificar sus próximas 3 entregas con Authory.**  
> Ayúdennos a que ningún Mateo vuelva a perder los derechos sobre su propia obra. Muchas gracias.»*

---

## 6. Preparación para la Ronda de Preguntas (Q&A del Jurado)

Siguiendo las advertencias de la diapositiva 31 del taller:

### P1: «¿Por qué usar Stellar/Soroban y no una base de datos relacional tradicional (PostgreSQL)?»
> **Respuesta recomendada:**  
> *«Una base de datos tradicional requiere confiar ciegamente en quien administra el servidor. Si surge una disputa legal dentro de 3 años y el administrador puede editar una fila de la base de datos o si la empresa quiebra, la prueba pierde su validez probatoria ante terceros. Stellar nos da neutralidad: la estampa de tiempo y el hash son inmutables, la red es descentralizada, las comisiones son de centavos de dólar y la confirmación tarda 3 a 5 segundos, lo cual es ideal para usuarios de consumo.»*

### P2: «¿Y si alguien registra una obra que no es suya (fraude de origen o plagio previo)?»
> **Respuesta recomendada:**  
> *«Esa es una de las mayores trampas del sector y somos totalmente honestos: la blockchain certifica la precedencia y la existencia inmutable en un momento del tiempo, no la verdad absoluta del mundo físico. Authory no es un juez de derechos humanos ni un perito de arte; lo que Authory le otorga a Mateo es una estampa de tiempo neutra que demuestra que él tenía ese archivo en esa fecha exacta. Si un plagiador intenta registrarlo después, la marca de Mateo en Stellar tiene precedencia temporal verificable sobre cualquier registro posterior.»*

### P3: «¿Cuánto cuesta una atestación y quién paga las comisiones de red?»
> **Respuesta recomendada:**  
> *«En la red Stellar, el costo por transacción en Soroban es de fracciones minúsculas de centavo (menos de $0.001 USD). En nuestro modelo de onboarding actual, Authory puede subsidiar o patrocinar las primeras atestaciones mediante cuentas operativas para no frenar la adopción de usuarios Web2. Para usuarios avanzados e instituciones, cada entidad firma y paga desde su propia cuenta con lumens a un costo despreciable en comparación con los $50 o $100 dólares que cobra una notaría física.»*

### P4: «¿Cómo protegen el archivo original para que no sea pirateado desde su plataforma?»
> **Respuesta recomendada:**  
> *«El archivo original jamás se sube a la blockchain. En el navegador del usuario se ejecuta la Web Crypto API mediante la función SHA-256 sobre los bytes del archivo. A la red Stellar únicamente viaja una cadena hexadecimal de 64 caracteres. Es matemáticamente imposible reconstruir el dibujo o el archivo a partir del hash; por lo tanto, el contenido de la obra permanece 100% privado en posesión del creador.»*
