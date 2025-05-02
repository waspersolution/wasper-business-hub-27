
-- Create a storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'Company Logos', true)
ON CONFLICT DO NOTHING;

-- Set up CORS configuration for the bucket
UPDATE storage.buckets 
SET cors = '[{"origin": "*", "headers": ["*"], "method": ["GET"], "maxAgeSeconds": 3600}]'
WHERE id = 'company-logos';

-- RLS policies for company logos: Allow users to access public company logos
CREATE POLICY "Public Access to Company Logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'company-logos');

-- Allow authenticated users to upload company logos
CREATE POLICY "Authenticated Users Can Upload Company Logos" 
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-logos');

-- Allow company admin to update their own company's logo
CREATE POLICY "Company Admins Can Update Their Company's Logo" 
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'company-logos' AND (storage.foldername(name))[1] = (
  SELECT id::text FROM user_role_assignments 
  WHERE user_id = auth.uid() AND role = 'company_admin'
  LIMIT 1
));
