-- Add all missing fields to groups table
ALTER TABLE groups
ADD COLUMN IF NOT EXISTS age_group VARCHAR(50),
ADD COLUMN IF NOT EXISTS hours VARCHAR(100),
ADD COLUMN IF NOT EXISTS number_of_children INTEGER,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS contact_hours VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#E5E7EB';

-- Update existing groups with default values where needed
UPDATE groups SET 
  age_group = COALESCE(age_group, '3-6 lat'),
  hours = COALESCE(hours, '7:00 - 17:00'),
  number_of_children = COALESCE(number_of_children, 25),
  description = COALESCE(description, 'Grupa przedszkolna'),
  contact_hours = COALESCE(contact_hours, '7:30-8:00 i 15:30-16:30')
WHERE age_group IS NULL OR hours IS NULL OR number_of_children IS NULL OR description IS NULL OR contact_hours IS NULL;
