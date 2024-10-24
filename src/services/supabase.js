import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://jdubtzuraqlszrmefmgi.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdWJ0enVyYXFsc3pybWVmbWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzNTExNjMsImV4cCI6MjAzOTkyNzE2M30.sho4m5xEyhdlj4v818MLLv6nre9GyAtq0QtVGNrU7uA"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;