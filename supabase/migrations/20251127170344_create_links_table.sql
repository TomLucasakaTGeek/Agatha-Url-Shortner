/*
  # Create TinyLink URL Shortener Schema

  1. New Tables
    - `links`
      - `id` (uuid, primary key) - Unique identifier for each link
      - `code` (text, unique, not null) - Short code for the URL (6-8 alphanumeric characters)
      - `target_url` (text, not null) - The original long URL to redirect to
      - `total_clicks` (integer, default 0) - Count of total redirects
      - `last_clicked_at` (timestamptz, nullable) - Timestamp of most recent click
      - `created_at` (timestamptz, default now()) - When the link was created
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on `links` table
    - Add policy for public read access (anyone can view links)
    - Add policy for public insert access (anyone can create links)
    - Add policy for public delete access (anyone can delete links)
    - Add policy for public update access (for click tracking)

  3. Indexes
    - Index on `code` for fast lookups during redirects
    - Index on `created_at` for sorting

  4. Notes
    - All operations are public since this is an open URL shortener
    - The `code` column has a unique constraint to prevent duplicates
    - Click tracking updates happen on redirect
*/

CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  target_url text NOT NULL,
  total_clicks integer DEFAULT 0 NOT NULL,
  last_clicked_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT code_format CHECK (code ~ '^[A-Za-z0-9]{6,8}$')
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view links"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create links"
  ON links FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update links"
  ON links FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete links"
  ON links FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);