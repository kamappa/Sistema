import { createClient } from '@supabase/supabase-js';

// Cliente Supabase (Missão 25 · Fase 1). Substitui o window.supabase do CDN
// (legacy/js/auth.js:10-13) pelo pacote npm. URL + chave anónima são as mesmas
// (a anon key é pública por desenho — RLS protege os dados).
export const SUPABASE_URL = 'https://zybrgnhepspledkjbllo.supabase.co';
export const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5YnJnbmhlcHNwbGVka2pibGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDAyMjksImV4cCI6MjA5ODUxNjIyOX0.J9nKTp38Wff-0MuqS5mVZs5-XZKRlVYxY9BQOQP_cUM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
