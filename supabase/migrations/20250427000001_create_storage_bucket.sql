
-- Create a storage bucket for company logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'Company Logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up a basic policy to allow authenticated users to read public files
CREATE POLICY "Public Access to Company Logos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'company-logos');

-- Set up a policy to allow users to upload their company logo
CREATE POLICY "Users can upload company logos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated'
);

-- Set up a policy to allow users to update their company logo
CREATE POLICY "Users can update their company logo" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated'
);
