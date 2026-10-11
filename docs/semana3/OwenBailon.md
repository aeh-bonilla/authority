# Entregable Individual — Semana 3

**Nombre:** Owen Isaac Bailón Cruz  
**Usuario de GitHub:** OwenIBC  
**Proyecto:** Authory  

---

## Módulo de Verificación Pública de Obra (`/verificar`)

### 1. Contexto y Relación con el Product Blueprint
El módulo de verificación pública responde directamente a la historia de usuario priorizada del Product Blueprint:
> *"Como comprador o tercero, quiero verificar quién es el autor de una obra y cuándo la registró, sin tener que crear una cuenta, para confirmar su origen antes de comprarla o usarla."*

En la arquitectura de Authory, la verificación pública es la contraparte indispensable del registro: permite a cualquier persona auditar la precedencia y autenticidad de un registro digital sin necesidad de registro previo ni conexión de billetera.

---

### 2. Especificación Funcional del Módulo

El diseño de la pantalla `/verificar` contempla los siguientes criterios de experiencia y reglas de negocio:

1. **Entrada flexible de parámetros:**
   - **Búsqueda por Authory ID:** Permite consultar registros mediante el identificador canónico (`AUTH-YYYY-XXXXXX`).
   - **Búsqueda por Hash Simulado:** Permite consultar mediante la huella digital simulada de 64 caracteres hexadecimales.
   - **Búsqueda combinada (ID + Hash):** Exige coincidencia estricta de ambos parámetros sobre la misma obra activa, previniendo falsos positivos.
   - **Lectura desde Query Params:** Soporta la recepción automática del parámetro `?workId=[id]` al navegar desde el Detalle de Obra o desde enlaces compartidos.

2. **Aislamiento y consistencia de datos:**
   - **Rechazo de hashes de derechos:** Si un usuario introduce el hash correspondiente a una licencia o cesión, el verificador lo rechaza explícitamente indicando que pertenece a un evento de derechos y no a la evidencia de autoría de la obra.
   - **Anulación inmediata de consultas obsoletas:** Al editar cualquier campo o presionar el botón "Limpiar", se invalidan inmediatamente las búsquedas en curso y se ocultan resultados previos para evitar discrepancias visuales.

3. **Transparencia técnica y avisos de demostración:**
   - Se incluye una advertencia visible en la parte superior:
     > *"Demostración local: Evidencia simulada en entorno de prueba; no se consultó la red Stellar en vivo ni se calculó un hash criptográfico sobre el contenido del archivo original. Los registros creados en este navegador se verifican frente al almacenamiento local."*

4. **Navegabilidad y acciones posteriores:**
   - Al encontrar una obra coincidente, la interfaz despliega los metadatos esenciales (título, autor, tipo de obra, fecha de registro) y la tarjeta de evidencia en Stellar Testnet simulada.
   - Proporciona accesos directos hacia el **Detalle de la Obra** (`/obra/[id]`) y su **Historial Cronológico** (`/obra/[id]/historial`).

---

### 3. Criterios de Aceptación y Casos de Prueba Validados

| Caso de Prueba | Comportamiento Esperado | Resultado |
| :--- | :--- | :---: |
| **Acceso directo con `?workId=...`** | Prellena el campo de ID y permite ejecutar la verificación inmediata. | Aprobado |
| **Búsqueda individual por ID válido** | Localiza la obra activa y despliega metadatos y evidencia confirmada. | Aprobado |
| **Búsqueda individual por Hash válido** | Localiza la obra activa y confirma su correspondencia. | Aprobado |
| **Búsqueda combinada ID correcto + Hash correcto** | Confirma la obra satisfactoriamente. | Aprobado |
| **Búsqueda combinada ID correcto + Hash incorrecto** | Rechaza la consulta indicando que el ID y el hash no pertenecen a la misma obra. | Aprobado |
| **Consulta con Hash de licencia** | Notifica que el hash corresponde a un evento de derechos y no a la obra. | Aprobado |
| **Edición / Limpieza en tiempo real** | Restablece el estado a neutral sin mantener alertas anteriores. | Aprobado |
| **Responsividad móvil (390 px)** | Formulario, botones y tarjetas utilizables sin desbordamiento horizontal. | Aprobado |
