# TlamatiK — Frontend

Aplicación frontend de TlamatiK (anteriormente Authory) desarrollada con Next.js 16 (App Router, Turbopack), React 19, TypeScript y Tailwind CSS 4. Permite a artesanos, artistas y promotores culturales registrar su oficio y técnicas tradicionales, generar pasaportes culturales físico-digitales verificables, gestionar condiciones de comercio justo y auditar la trazabilidad en Stellar Testnet.

---

## Requisitos del Entorno

- **Node.js**: Versión `22.23.3` (fijada en el archivo `.nvmrc` en la raíz del proyecto).
- **Gestor de paquetes**: `npm` exclusivamente (evitar otros gestores para mantener consistencia con el lockfile).

---

## Instalación y Configuración

Desde la raíz del repositorio o dentro de `frontend`:

```bash
# Navegar al directorio frontend (si estás en la raíz)
cd frontend

# Instalar dependencias
npm install
```

> **Nota:** También puedes usar `npm ci` para instalaciones limpias basadas estrictamente en `package-lock.json`.

---

## Scripts Disponibles

- **`npm run dev`**: Inicia el servidor de desarrollo en `http://localhost:3000`.
- **`npm run build`**: Compila y optimiza la aplicación para producción utilizando Turbopack.
- **`npm start`**: Inicia el servidor optimizado de producción.
- **`npm run lint`**: Ejecuta las reglas de análisis estático con ESLint.
- **`npx tsc --noEmit`**: Comprueba la tipificación estricta de TypeScript.

---

## Estructura de Rutas y Funcionalidades

1. **`/`**: Inicio y presentación general.
2. **`/registrar-obra`**: Formulario de registro de obra, captura de metadatos (sin serializar archivos binarios) y generación de evidencia.
3. **`/obra/[id]`**: Detalle de obra registrada, consulta de evidencia simulada, descarga de certificado HTML y copia de enlace.
4. **`/verificar`**: Verificación pública por Authory ID o hash simulado de 64 caracteres.
5. **`/obra/[id]/derechos`**: Registro formal de licencias de uso y cesiones de derechos.
6. **`/obra/[id]/historial`**: Línea de tiempo cronológica auditable con todos los eventos de la obra.

---

## Alcance y Simulación (Mock)

- **Red Stellar**: La integración con Stellar Testnet opera como un simulador en memoria y `localStorage` para esta entrega de demostración.
- **Privacidad**: El contenido original de los archivos nunca se sube a servidores ni se serializa en el almacenamiento del navegador; únicamente se conservan metadatos.
- Para más detalles sobre decisiones de arquitectura y limitaciones, consulta `docs/semana3/Documentacion.md`.
