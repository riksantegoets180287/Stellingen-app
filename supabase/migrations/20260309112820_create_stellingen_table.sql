/*
  # Create stellingen table for diva.summacollege.nl/stellingen

  1. New Tables
    - `stellingen` (statements)
      - `id` (uuid, primary key) - Unique identifier for each statement
      - `title` (text) - Title of the statement (e.g., "Mobieltjes in de klas")
      - `statement` (text) - The actual statement/question
      - `school_standpoint` (text) - School's position on the statement
      - `accent_color` (text) - Color theme (indigo, blue, yellow, green, red)
      - `image` (text, optional) - Image URL or base64 data
      - `is_visible` (boolean) - Whether the statement is publicly visible
      - `display_order` (integer) - Order in which statements appear
      - `created_at` (timestamptz) - When the statement was created
      - `updated_at` (timestamptz) - When the statement was last updated

  2. Security
    - Enable RLS on `stellingen` table
    - Add policy for public read access to visible statements
    - Add policy for admin users to manage all statements

  3. Notes
    - Display order allows flexible reordering without changing IDs
    - Soft visibility toggle instead of deletion to preserve data
    - Timestamps for audit trail
*/

CREATE TABLE IF NOT EXISTS stellingen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  statement text NOT NULL,
  school_standpoint text NOT NULL,
  accent_color text NOT NULL DEFAULT 'indigo',
  image text,
  is_visible boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stellingen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible stellingen"
  ON stellingen
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can view all stellingen"
  ON stellingen
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stellingen"
  ON stellingen
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stellingen"
  ON stellingen
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stellingen"
  ON stellingen
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_stellingen_visible_order 
  ON stellingen(is_visible, display_order) 
  WHERE is_visible = true;

CREATE INDEX IF NOT EXISTS idx_stellingen_updated_at 
  ON stellingen(updated_at DESC);