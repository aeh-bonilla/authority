# Authory — Guion Técnico Sincronizado por Escenas para Video Demostrativo

**Proyecto:** Authory  
**Programa:** Blockchain Builders 101 — Stellar × BAF  
**Entregable:** Semana 4 — MVP Funcional  
**Duración Objetivo:** ~60 segundos (1 minuto)  
**Idioma:** Español Neutro / Latinoamericano  
**Formato de Salida Recomendado:** Audio MP3 o WAV (44.1 kHz / 16-bit)  

---

## 1. Tabla de Producción: Escenas y Locución Sincronizada

| Escena # | Rango de Tiempo | Referencia Visual en Pantalla | Guion de Locución Exacto | Dirección de Voz y Pausas |
| :---: | :---: | :--- | :--- | :--- |
| **01** | `00:00 - 00:13`<br>*(13 seg)* | **Home y Portada de Authory**<br>• Vista inicial de la landing en `authority-khaki.vercel.app`.<br>• Se observa el titular brutalista y el diagrama de arquitectura: *Archivo Original (Privado off-chain) → Hash SHA-256 → Red Stellar (Referencia verificable)*. | *"Bienvenidos a Authory. Authory es una solución de atestación digital que permite a creadores independientes proteger y demostrar la autoría de sus obras, generando evidencias inmutables en la blockchain de Stellar sin exponer sus archivos originales."* | **Tono:** Seguro, inspirador y profesional.<br>**Pausa:** 0.5s al final antes de cambiar de escena.<br>**Énfasis:** *"evidencias inmutables"*, *"Stellar"*, *"sin exponer sus archivos"*. |
| **02** | `00:13 - 00:28`<br>*(15 seg)* | **Formulario de Registro de Obra**<br>• Navegación a `/registrar-obra`.<br>• Llenado de campos obligatorios (`*`).<br>• Carga del archivo local (`.png`/`.svg`).<br>• Cálculo y despliegue instantáneo de la huella SHA-256 en memoria. | *"En el módulo de registro, el creador define los metadatos obligatorios de la obra: título, tipo de contenido, autor y fecha de creación. Al seleccionar el archivo original, Authory calcula su huella criptográfica SHA-256 directamente en la memoria del navegador mediante la Web Crypto API. Esto garantiza absoluta privacidad, ya que el archivo nunca se transmite a la red."* | **Tono:** Didáctico y técnico accesible.<br>**Pronunciación:** SHA-256 (*"ese hache a, dos cincuenta y seis"*).<br>**Énfasis:** *"directamente en la memoria del navegador"*, *"absoluta privacidad"*. |
| **03** | `00:28 - 00:38`<br>*(10 seg)* | **Validación y Reglas de Integridad**<br>• Selección del tipo de obra.<br>• Indicadores visuales de campos completados y botón *"CREAR EVIDENCIA →"*. | *"La interfaz valida el tipo de obra, la autoría y la fecha de creación obligatoria, asegurando la integridad de los datos antes de proceder con el registro en la blockchain."* | **Tono:** Preciso y estructurado.<br>**Ritmo:** Fluido y natural. |
| **04** | `00:38 - 00:50`<br>*(12 seg)* | **Invocación On-Chain en Stellar Testnet**<br>• Transición del *stepper* de progreso.<br>• Pantalla de confirmación *"EVIDENCIA CREADA"* con Authory ID (`AUTH-2026-423709`), hash y red. | *"Al crear la evidencia, nuestro contrato inteligente desarrollado en Soroban registra la huella en el ledger de Stellar Testnet emitiendo un evento auditable, sincronizando los metadatos con la nube."* | **Tono:** Enérgico y resolutivo.<br>**Pronunciación:** Soroban (*"So-ró-ban"*).<br>**Énfasis:** *"Stellar Testnet"*, *"evento auditable"*. |
| **05** | `00:50 - 01:05`<br>*(15 seg)* | **Ficha de Detalle y Verificación Pública**<br>• Página `/obra/[id]` con badge verde *REGISTRADA*.<br>• Enlace a la transacción en Stellar Expert.<br>• Sección del Certificado de Autoría imprimible. | *"Finalmente, la plataforma genera la ficha de detalle con el identificador único, enlace directo a la transacción en Stellar Expert y certificado de autoría listo para verificación pública. Cualquier tercero o comprador puede auditar la autenticidad e integridad de la obra en segundos."* | **Tono:** Conclusivo, sólido y de confianza.<br>**Pausa final:** 1.0s para cierre limpio. |

---

## 2. Guía Fonética y de Pronunciación para Modelos de IA

Para evitar que los motores de Text-to-Speech cometan errores con términos en inglés o técnicos:

| Término | Cómo escribirlo en el prompt si la IA se equivoca | Pronunciación recomendada |
| :--- | :--- | :--- |
| **Authory** | `Authory` o `Ótori` | *Ó-to-ri* |
| **SHA-256** | `S-H-A 256` o `ese-hache-a doscientos cincuenta y seis` | *ese hache a doscientos cincuenta y seis* |
| **Soroban** | `Soroban` | *So-ró-ban* |
| **Stellar** | `Stellar` | *Es-té-lar* |
| **Testnet** | `Testnet` | *Test-net* |
| **Web Crypto API** | `Web Crypto A-P-I` | *Gueb Cripto A-P-I* |
| **Blockchain** | `blockchain` o `blók-chein` | *Blok-chein* |
| **Ledger** | `ledger` o `léd-yer` | *Léd-yer* |

---

## 3. Texto Segmentado para Copiar y Pegar Bloque por Bloque

Si tu herramienta de IA genera audios escena por escena (como en ElevenLabs VoiceLab o Murf Studio):

### Bloque 1 (00:00 - 00:13):
```text
Bienvenidos a Authory. Authory es una solución de atestación digital que permite a creadores independientes proteger y demostrar la autoría de sus obras, generando evidencias inmutables en la blockchain de Stellar sin exponer sus archivos originales.
```

### Bloque 2 (00:13 - 00:28):
```text
En el módulo de registro, el creador define los metadatos obligatorios de la obra: título, tipo de contenido, autor y fecha de creación. Al seleccionar el archivo original, Authory calcula su huella criptográfica SHA-256 directamente en la memoria del navegador mediante la Web Crypto API. Esto garantiza absoluta privacidad, ya que el archivo nunca se transmite a la red.
```

### Bloque 3 (00:28 - 00:38):
```text
La interfaz valida el tipo de obra, la autoría y la fecha de creación obligatoria, asegurando la integridad de los datos antes de proceder con el registro en la blockchain.
```

### Bloque 4 (00:38 - 00:50):
```text
Al crear la evidencia, nuestro contrato inteligente desarrollado en Soroban registra la huella en el ledger de Stellar Testnet emitiendo un evento auditable, sincronizando los metadatos con la nube.
```

### Bloque 5 (00:50 - 01:05):
```text
Finalmente, la plataforma genera la ficha de detalle con el identificador único, enlace directo a la transacción en Stellar Expert y certificado de autoría listo para verificación pública. Cualquier tercero o comprador puede auditar la autenticidad e integridad de la obra en segundos.
```

---

## 4. Instrucción para Ensamblar el Audio Final

Una vez que descargues el archivo de audio generado (`locucion.mp3` o `locucion.wav`):

1. Guárdalo en la carpeta del proyecto o compártemelo.
2. Ejecutaremos el montaje directo sobre el video con `ffmpeg`:
   ```bash
   ffmpeg -y -i docs/semana4/demo-mvp-authory.mp4 -i locucion.mp3 -c:v copy -c:a aac -b:a 192k -shortest docs/semana4/demo-mvp-authory-final.mp4
   ```
