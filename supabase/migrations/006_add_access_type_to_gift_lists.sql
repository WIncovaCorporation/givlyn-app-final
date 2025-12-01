-- Add access_type column to gift_lists table
-- Values: 'personal', 'shared', 'third_party'
-- Default: 'personal'

ALTER TABLE gift_lists 
ADD COLUMN IF NOT EXISTS access_type VARCHAR(20) DEFAULT 'personal' NOT NULL;

-- Add check constraint to ensure valid values
ALTER TABLE gift_lists 
ADD CONSTRAINT gift_lists_access_type_check 
CHECK (access_type IN ('personal', 'shared', 'third_party'));

-- Update existing rows to have 'personal' as default (already handled by DEFAULT)
UPDATE gift_lists SET access_type = 'personal' WHERE access_type IS NULL;
