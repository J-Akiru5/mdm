-- Supabase Storage Policies for "portfolio" bucket
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- 2. Allow public read access to portfolio files
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'portfolio');

-- 3. Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');

-- 4. Allow authenticated users to update (overwrite) files
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio');
