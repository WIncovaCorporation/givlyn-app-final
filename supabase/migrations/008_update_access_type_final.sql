-- Final access_type migration
-- Values: 'private', 'shared', 'group_event', 'managed'
-- Migrating old values to new schema

-- First, update existing values to new schema
UPDATE gift_lists SET access_type = 'private' WHERE access_type = 'personal';
UPDATE gift_lists SET access_type = 'shared' WHERE access_type IN ('shared', 'receive');
UPDATE gift_lists SET access_type = 'group_event' WHERE access_type = 'group';
UPDATE gift_lists SET access_type = 'managed' WHERE access_type = 'third_party';

-- Drop the old constraint
ALTER TABLE gift_lists DROP CONSTRAINT IF EXISTS gift_lists_access_type_check;

-- Add new constraint with final values
ALTER TABLE gift_lists 
ADD CONSTRAINT gift_lists_access_type_check 
CHECK (access_type IN ('private', 'shared', 'group_event', 'managed'));
