-- Update access_type constraint to include new values
-- Values: 'personal', 'receive', 'group', 'third_party'
-- Migrating old 'shared' values to 'receive'

-- First, update existing 'shared' values to 'receive'
UPDATE gift_lists SET access_type = 'receive' WHERE access_type = 'shared';

-- Drop the old constraint
ALTER TABLE gift_lists DROP CONSTRAINT IF EXISTS gift_lists_access_type_check;

-- Add new constraint with updated values
ALTER TABLE gift_lists 
ADD CONSTRAINT gift_lists_access_type_check 
CHECK (access_type IN ('personal', 'receive', 'group', 'third_party'));
