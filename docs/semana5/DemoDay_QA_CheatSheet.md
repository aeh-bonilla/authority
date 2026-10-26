# Authory — Banco de Preguntas y Respuestas para el Demo Day (Cheat Sheet)

**Proyecto:** Authory  
**Posición en el Evento:** Proyecto Finalista #1 de México (Stellar × BAF × Ruta N)  
**Tiempo del Bloque:** **2 Minutos Estrictos de Preguntas del Jurado** (Minutos 5:00 a 7:00)  
**Estrategia Clave:** Respuestas concisas de **máximo 30 a 35 segundos** para permitir responder de 2 a 3 preguntas completas del comité evaluador.

---

## ⚡ Reglas de Oro para el Bloque de Preguntas (Fer Tello)

1. **Evita muletillas de relleno:** Nunca digas *«Esa es una muy buena pregunta»*; consume entre 3 y 5 segundos valiosos. Entra directo con la tesis de la respuesta.
2. **Responde primero la consecuencia, luego el mecanismo:** Da el resultado concreto para el usuario en la primera frase y fundamenta técnicamente en la segunda.
3. **Aplica la fórmula de honestidad técnica:** Si te preguntan algo que aún no ha sido probado en producción, usa siempre esta estructura:  
   > *«Todavía no lo hemos medido en producción, y el experimento que tenemos diseñado para comprobarlo en los próximos 30 días es [X].»*

---

## Bloque 1: Propiedad Intelectual y Aspectos Legales
*(Preguntas recurrentes de creadores, abogados y público general)*

### P1. «¿Tiene esto validez legal ante un juez o instituciones como Indautor (México) o DNDA (Colombia)?»
* **Lo que buscan evaluar:** Si vendes falsas promesas diciendo que la blockchain sustituye al Estado o si entiendes el marco probatorio de los derechos de autor.
* **Respuesta directa (35 s):**  
  > *«Authory no sustituye el registro formal ante las oficinas estatales de derechos de autor, sino que actúa como una **prueba pericial de precedencia temporal inalterable**.  
  > En la mayoría de las legislaciones (incluyendo el Convenio de Berna), los derechos de autor nacen con la creación de la obra, no con el registro gubernamental. Si surge un litigio, el juez exige probar quién tenía la obra primero. Mientras que un correo o una fecha en un disco duro pueden adulterarse, el hash sellado en el ledger de Stellar demuestra matemáticamente que Mateo poseía ese archivo en ese segundo exacto.»*
* **Idea clave para resumir:** Es una prueba pericial de precedencia cronológica inmutable, no un trámite burocrático.

---

### P2. «¿Y si alguien descarga una obra ajena de Instagram o Pinterest y la registra en Authory como suya?»
* **Lo que buscan evaluar:** Si reconoces el problema clásico de *«Garbage In, Garbage Out»* (registrar algo falso en la blockchain no lo convierte en verdad).
* **Respuesta directa (35 s):**  
  > *«Ese es el límite fundamental que siempre aclaramos con rigor: **la red garantiza la inmutabilidad del registro, no que lo registrado sea verdad en el mundo físico**.  
  > Si un plagiador sube una obra ajena hoy, la red certifica que la registró hoy. Pero si el creador legítimo la registró al terminarla hace un mes, la marca de tiempo de Stellar desmiente automáticamente al plagiador por estricta precedencia temporal. Por eso nuestro llamado al creador es: registra tu obra en cuanto la termines, antes de enviarla a clientes o publicarla en redes.»*
* **Idea clave para resumir:** La blockchain da precedencia matemática; quien registra primero tiene la estampa temporal que desmiente registros posteriores.

---

### P3. «¿Registrar una licencia o cesión en Authory sustituye un contrato comercial firmado?»
* **Lo que buscan evaluar:** Si distingues entre acuerdos contractuales y atestaciones públicas de eventos.
* **Respuesta directa (30 s):**  
  > *«Funciona como el **respaldo técnico auditable** de ese acuerdo. Las cláusulas comerciales se pactan entre las partes, y en Authory se estampa la atestación pública de ese derecho: quién es el beneficiario, qué alcance tiene y desde qué fecha. Si un intermediario revende la obra o la explota fuera de los términos acordados, cualquier comprador o cliente puede auditar en la red si existía o no una licencia vigente.»*
* **Idea clave para resumir:** Es la atestación técnica pública de los derechos que respalda y hace auditable el contrato privado.

---

## Bloque 2: Arquitectura y Tecnología Stellar / Soroban
*(Preguntas de mentores técnicos, evaluadores Web3 y desarrolladores)*

### P4. «¿Por qué decidieron programar un Smart Contract propio en Soroban en lugar de emitir un NFT tradicional (SEP-41) o transacciones clásicas con Memo?»
* **Lo que buscan evaluar:** La justificación técnica detrás de la decisión de arquitectura tomada en Semana 3 y 4.
* **Respuesta directa (35 s):**  
  > *«Evaluamos los estándares de tokens y NFTs, pero un NFT fuerza a modelar la obra como un activo con un único dueño financiero en cada momento. En la realidad creativa, **la autoría original es inalienable** (siempre le pertenece al autor) y lo que se otorgan son licencias de uso a múltiples clientes en paralelo.  
  > Crear un contrato propio de atestación (*Registry Pattern*) en Rust nos permitió desacoplar la obra de sus derechos derivados, con menos de 100 líneas de código, sin comisiones de gas infladas ni la fricción de un marketplace financiero.»*
* **Idea clave para resumir:** La autoría no se transfiere como una moneda; se atesta. Los NFTs no permiten licencias no exclusivas múltiples de forma nativa.

---

### P5. «¿Qué pasa si un archivo pesa 2 GB (un video 4K o un proyecto de Blender)? ¿Se satura la plataforma o la red?»
* **Lo que buscan evaluar:** Si los archivos viajan por internet o si realmente comprenden el procesamiento criptográfico en el cliente.
* **Respuesta directa (30 s):**  
  > *«El peso del archivo no afecta a la red ni a nuestros servidores porque **el archivo original nunca se sube a internet**.  
  > La Web Crypto API del navegador lee los bytes en la memoria RAM del usuario por bloques y calcula el hash SHA-256 de 64 caracteres. Ya sea una ilustración de 2 megas o un video de 5 gigas, lo único que viaja a Stellar es una cadena de texto minúscula. El costo de transacción y el tiempo de confirmación en Soroban son exactamente los mismos.»*
* **Idea clave para resumir:** Procesamiento 100% off-chain en RAM; a Stellar solo viaja un hash de 64 caracteres.

---

### P6. «En el MVP actual el backend patrocina la firma. ¿Cómo van a garantizar la descentralización para que el usuario sea el dueño de su clave?»
* **Lo que buscan evaluar:** Si reconocen la deuda técnica actual y si tienen trazada la ruta hacia la no custodia.
* **Respuesta directa (30 s):**  
  > *«En el MVP priorizamos eliminar la fricción del creador Web2 para que pudiera registrarse sin instalar extensiones ni comprar cripto.  
  > En nuestra hoja de ruta a 30 días, el siguiente paso es integrar **Stellar Wallets Kit** para soportar Freighter, Lobstr y xBull. Esto habilitará un modelo híbrido: el usuario casual inicia sin fricción, pero el creador profesional o el estudio puede firmar sus propias atestaciones de forma 100% descentralizada y no custodial.»*
* **Idea clave para resumir:** Modelo híbrido: onboarding accesible Web2 hoy, firma con Stellar Wallets Kit en los próximos 30 días.

---

## Bloque 3: Negocio, Adopción y Producto
*(Preguntas de la comunidad emprendedora, evaluadores de negocio y mentores)*

### P7. «¿Cómo piensan monetizar Authory si registrar en Stellar cuesta fracciones de centavo?»
* **Lo que buscan evaluar:** Si el proyecto tiene modelo de negocio sostenible o si es solo un experimento técnico.
* **Respuesta directa (35 s):**  
  > *«Planteamos un modelo **Freemium B2B/B2C**:  
  > 1. **Creadores independientes (B2C):** Un paquete de atestaciones gratuitas al mes para adopción orgánica, con suscripciones pro para catálogos masivos y certificados personalizados descargables.  
  > 2. **Agencias, editoriales y plataformas de contenido (B2B):** Cobro por API empresarial para verificación masiva de activos y auditoría automatizada de derechos antes de publicar campañas comerciales.»*
* **Idea clave para resumir:** Freemium para creadores (volumen) y API de auditoría B2B para agencias y editoriales (monetización).

---

### P8. «¿Por qué un creador usaría Authory en vez de ponerle una marca de agua a su dibujo o subirlo a Behance/ArtStation?»
* **Lo que buscan evaluar:** Diferenciador real frente a alternativas cotidianas.
* **Respuesta directa (30 s):**  
  > *«Una marca de agua se borra hoy con herramientas de inteligencia artificial en dos segundos. Y subir la obra a Behance o redes sociales te sujeta a plataformas cerradas que pueden cambiar sus políticas o borrar cuentas sin previo aviso.  
  > Authory no compite con Behance como vitrina de exposición; es la **infraestructura de certeza previa**. El creador registra su huella en Stellar antes de publicarla; si alguien se apropia del arte, la fecha del ledger demuestra de forma independiente quién fue el creador original.»*
* **Idea clave para resumir:** La marca de agua se borra con IA; Behance es una vitrina privada. Authory es la prueba inmutable previa.

---

## Bloque 4: «Lo que Falta por Comprobar» (Honestidad Radical)
*(Preguntas para medir la madurez y sinceridad del equipo)*

### P9. «¿Esto ya lo está usando alguien en producción o tienen métricas de creadores que hayan ganado disputas?»
* **Lo que buscan evaluar:** Si inventan métricas ficticias o si son transparentes con la etapa del MVP.
* **Respuesta directa (30 s):**  
  > *«**Todavía no tenemos litigios resueltos y seríamos deshonestos si dijéramos lo contrario.**  
  > Lo que tenemos hoy es el protocolo funcional desplegado en Soroban Testnet, las 6 pantallas probadas y el cálculo criptográfico operativo. Lo que estamos validando en esta fase con 10 ilustradores es la **adopción del certificado** en sus presupuestos comerciales. Nuestro siguiente hito es acompañar las primeras 3 entregas de contratos con agencias aliadas para medir la reacción del comprador.»*
* **Idea clave para resumir:** Transparencia total: MVP funcional validado técnicamente; la validación de mercado inicia con el piloto de 10 creadores.

---

### P10. «¿Y si Mateo vende una licencia exclusiva a un cliente y después por error le vende la misma licencia a otro?»
* **Lo que buscan evaluar:** Coherencia en la trazabilidad del historial de derechos.
* **Respuesta directa (30 s):**  
  > *«Precisamente para evitar eso existe la línea de tiempo inmutable de derechos. El contrato registra la estampa temporal de cada evento. Si Mateo otorgó una licencia exclusiva el 1 de octubre y luego intenta otorgar otra el 15 de octubre, el segundo comprador, al auditar la obra en `/verificar`, verá inmediatamente en el historial que ya existía una cesión exclusiva previa. El comprador queda protegido contra fraudes de doble venta.»*
* **Idea clave para resumir:** El historial público cronológico previene la doble venta y protege al comprador antes de pagar.

---

## 📋 Resumen Rápido de Datos Duros (Para Tener en la Mente)

* **Dirección del Contrato Soroban:** `CAOAFGPATXWJ6KKGXFYHY42Q4N75NOWSR3NH3K2DT7QR3YSMDGT5P2HO`
* **Transacciones de prueba en vivo:** `725e12...` (Registro de obra) y `30f6f7...` (Evento de licencia).
* **Costo por transacción:** Menos de `$0.001 USD` en Stellar Testnet.
* **Tiempo de respuesta en Stellar:** Entre 3 y 5 segundos por bloque.
* **Dato estadístico clave:** **71%** de freelancers y creadores independientes sufren impago o apropiación indebida (*Freelancers Union & WIPO*).
