-- Create public media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "public read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow service_role to upload/delete
CREATE POLICY "service upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "service delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media');
