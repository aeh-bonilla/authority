-- ==============================================================================
-- Authory — Supabase Database Schema
-- Tablas y Storage para almacenamiento de obras, archivos (PDF/Imágenes) y derechos
-- ==============================================================================

-- 1. Tabla de Obras Registradas
CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  hash TEXT NOT NULL,
  stellar_transaction_id TEXT,
  network TEXT DEFAULT 'testnet',
  status TEXT DEFAULT 'registered',
  filename TEXT,
  file_size TEXT,
  file_mime_type TEXT,
  source_url TEXT,
  file_url TEXT,       -- URL pública del archivo PDF o imagen almacenado en Supabase Storage
  notes TEXT,
  preview_base64 TEXT, -- Opcional: miniatura en Base64 para carga instantánea (< 250 KB)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida por hash y autor
CREATE INDEX IF NOT EXISTS idx_works_hash ON works(hash);
CREATE INDEX IF NOT EXISTS idx_works_author ON works(author);
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);

-- 2. Tabla de Eventos de Derechos (Licencias y Cesiones vinculadas a la obra)
CREATE TABLE IF NOT EXISTS rights_events (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'registration', 'evidence', 'license', 'assignment', 'transfer'
  actor TEXT NOT NULL,
  recipient TEXT,
  terms TEXT,
  notes TEXT,
  effective_date TIMESTAMPTZ NOT NULL,
  stellar_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultar el historial de una obra
CREATE INDEX IF NOT EXISTS idx_rights_events_work_id ON rights_events(work_id, created_at ASC);

-- 3. Configuración de Seguridad por Filas (Row Level Security - RLS)
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE rights_events ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (cualquier auditor puede consultar obras y verificar evidencias)
DROP POLICY IF EXISTS "Lectura pública de obras" ON works;
CREATE POLICY "Lectura pública de obras"
  ON works FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Inserción de obras" ON works;
CREATE POLICY "Inserción de obras"
  ON works FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Lectura pública de eventos de derechos" ON rights_events;
CREATE POLICY "Lectura pública de eventos de derechos"
  ON rights_events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Inserción de eventos de derechos" ON rights_events;
CREATE POLICY "Inserción de eventos de derechos"
  ON rights_events FOR INSERT
  WITH CHECK (true);

-- 4. Configuración de Bucket en Supabase Storage para PDFs e Imágenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('authory-files', 'authory-files', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Acceso público de lectura a archivos de obras" ON storage.objects;
CREATE POLICY "Acceso público de lectura a archivos de obras"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'authory-files');

DROP POLICY IF EXISTS "Subida pública de archivos de obras" ON storage.objects;
CREATE POLICY "Subida pública de archivos de obras"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'authory-files');
