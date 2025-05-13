-- Add prompt_sdr column to kaisan_systemprompt table
ALTER TABLE kaisan_systemprompt
ADD COLUMN prompt_sdr TEXT NOT NULL DEFAULT '';

-- Comment: This column was added to store SDR-specific prompts
-- The column is set as NOT NULL with a default empty string value
-- to ensure all existing rows have a valid value
