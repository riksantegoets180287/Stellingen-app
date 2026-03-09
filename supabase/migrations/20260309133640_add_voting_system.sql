/*
  # Add Voting System to Stellingen

  1. Changes
    - Add class_voting_enabled (boolean) to stellingen table
    - Add class_voting_live_results (boolean) to stellingen table
    - Add class_voting_closed (boolean) to stellingen table
    - Add votes_accept (integer) to stellingen table
    - Add votes_unsure (integer) to stellingen table
    - Add votes_no (integer) to stellingen table
  
  2. Security
    - Public can read stellingen (already exists)
    - Public can update vote counts (new policy for voting)
*/

-- Add voting columns to stellingen table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stellingen' AND column_name = 'class_voting_enabled'
  ) THEN
    ALTER TABLE stellingen ADD COLUMN class_voting_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stellingen' AND column_name = 'class_voting_live_results'
  ) THEN
    ALTER TABLE stellingen ADD COLUMN class_voting_live_results boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stellingen' AND column_name = 'class_voting_closed'
  ) THEN
    ALTER TABLE stellingen ADD COLUMN class_voting_closed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stellingen' AND column_name = 'votes_accept'
  ) THEN
    ALTER TABLE stellingen ADD COLUMN votes_accept integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stellingen' AND column_name = 'votes_unsure'
  ) THEN
    ALTER TABLE stellingen ADD COLUMN votes_unsure integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stellingen' AND column_name = 'votes_no'
  ) THEN
    ALTER TABLE stellingen ADD COLUMN votes_no integer DEFAULT 0;
  END IF;
END $$;

-- Allow public to update vote counts (for anonymous voting)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stellingen' 
    AND policyname = 'Public can update vote counts'
  ) THEN
    CREATE POLICY "Public can update vote counts"
      ON stellingen
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;