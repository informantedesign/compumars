-- Migration: Document Studio (Report Builder v2)
-- Run this in your database console to enable the new features.

-- 1. Add new columns to report_templates
ALTER TABLE report_templates 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'OTRO',
ADD COLUMN IF NOT EXISTS preview_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_system_default BOOLEAN DEFAULT false;

-- 2. Update the category Check Constraint
-- Note: We drop the default if it exists to be safe, but usually adding a constraint handles it.
-- If the constraint report_templates_category_check already exists, drop it first:
-- ALTER TABLE report_templates DROP CONSTRAINT IF EXISTS report_templates_category_check;

ALTER TABLE report_templates 
ADD CONSTRAINT report_templates_category_check 
CHECK (category IN ('FORMATO_LEGAL', 'REPORTE_ESTADISTICO', 'OTRO'));

-- 3. (Optional) If you want to relax the 'type' constraint to allow new types without explicit checks each time:
-- ALTER TABLE report_templates DROP CONSTRAINT report_templates_type_check;
-- (Or just ensure your new types are added to the existing check if you prefer strict typing)
