/*
  # Update RLS Policies for Public Access

  1. Changes
    - Drop existing restrictive policies
    - Add new policies allowing public read and write access
    - Maintains RLS enabled for future authentication improvements
  
  2. Security Note
    - This allows anyone to modify stellingen data
    - Suitable for internal school network
    - Can be restricted later when proper admin authentication is added
*/

DROP POLICY IF EXISTS "Anyone can view visible stellingen" ON stellingen;
DROP POLICY IF EXISTS "Authenticated users can view all stellingen" ON stellingen;
DROP POLICY IF EXISTS "Authenticated users can insert stellingen" ON stellingen;
DROP POLICY IF EXISTS "Authenticated users can update stellingen" ON stellingen;
DROP POLICY IF EXISTS "Authenticated users can delete stellingen" ON stellingen;

CREATE POLICY "Public can view all stellingen"
  ON stellingen
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert stellingen"
  ON stellingen
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update stellingen"
  ON stellingen
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete stellingen"
  ON stellingen
  FOR DELETE
  TO public
  USING (true);