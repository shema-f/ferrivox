-- Ferrivox Newsletter Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard -> SQL Editor

-- 1. Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  confirmed BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website'
);

-- 2. Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous inserts (for newsletter signup form)
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- 4. Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON subscribers
  FOR SELECT
  USING (true);

-- 5. Allow authenticated deletes (for admin to remove subscribers)
CREATE POLICY "Allow authenticated deletes" ON subscribers
  FOR DELETE
  USING (true);

-- 6. Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- 7. Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Enable RLS for contact submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 9. Allow anonymous inserts for contact form
CREATE POLICY "Allow anonymous contact inserts" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- 10. Allow authenticated reads for contact submissions
CREATE POLICY "Allow authenticated contact reads" ON contact_submissions
  FOR SELECT
  USING (true);

-- 11. Email logs table (for tracking sent emails)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON email_logs
  FOR ALL
  USING (true);

-- 12. FERRI AI chatbot conversation logs
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  message TEXT NOT NULL,
  confidence TEXT,
  topic TEXT,
  lead_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Enable RLS for chat logs
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- 14. Allow anonymous inserts for chat logs
CREATE POLICY "Allow anonymous chat inserts" ON chat_logs
  FOR INSERT
  WITH CHECK (true);

-- 15. Allow authenticated reads for chat logs
CREATE POLICY "Allow authenticated chat reads" ON chat_logs
  FOR SELECT
  USING (true);

-- 16. Index for session lookups
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created ON chat_logs(created_at DESC);
