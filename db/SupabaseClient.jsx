/* eslint-disable prettier/prettier */
// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jtosqqkglbqtajdoicvr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0b3NxcWtnbGJxdGFqZG9pY3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTYwNTksImV4cCI6MjA0NjU5MjA1OX0.marYrDHmuG8fCreio-XWtwAu05TIQCGywHR_nXjHUFQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
