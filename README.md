# TlamatiK — Salvaguarda de Saberes Artesanales y Evidencia Stellar

TlamatiK (anteriormente Authory) es una herramienta y protocolo web para artesanos, artistas y promotores culturales que permite preservar el conocimiento de su oficio, generar pasaportes culturales inmutables anclados a la red Stellar, certificar procedencia con códigos QR y comercializar su trabajo con comercio justo sin intermediarios abusivos.

---

## Stack Tecnológico

La aplicación web está desarrollada con las siguientes tecnologías:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Biblioteca de UI:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Manejo y Validación de Formularios:** [React Hook Form](https://react-hook-form.com/) y [Zod](https://zod.dev/) (`@hookform/resolvers`)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Linter:** [ESLint](https://eslint.org/)
- **Integración Blockchain (Simulación):** Stellar Testnet (simulador conceptual en memoria y `localStorage`)

---

## Estructura del Repositorio

- **`frontend/`**: Aplicación web construida con Next.js 16 (App Router), React 19 y Tailwind CSS 4. Consulta el [Frontend README](frontend/README.md).
- **`docs/`**: Documentación del proyecto dividida por semanas:
  - **`docs/semana1/`**: Definición del problema y actores (`ProblemBrief.md`).
  - **`docs/semana2/`**: Arquitectura y especificación del producto (`ProductBlueprint.md`).
  - **`docs/semana3/`**: Documentación consolidada de la entrega funcional de Frontend 02 (`docs/semana3/Documentacion.md`) y bitácora de progreso (`docs/semana3/Frontend02_Progress.md`).

---

## Ejecución Rápida

La aplicación web se encuentra en el directorio `frontend/`. Para instalar las dependencias y ejecutar el servidor de desarrollo:

```bash
# 1. Navegar al directorio de la aplicación frontend
cd frontend

# 2. Instalar las dependencias del proyecto
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

> **Nota:** Para entornos de integración continua o instalaciones exactas basadas en el archivo lockfile, también puedes utilizar `npm ci`.

Una vez iniciado el servidor, accede a [http://localhost:3000](http://localhost:3000) en tu navegador.

