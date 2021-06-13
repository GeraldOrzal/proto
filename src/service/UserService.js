import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ossgwvlpjbcdxnhthoqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ3ODYyOSwiZXhwIjoxOTM5MDU0NjI5fQ.wo9pw98AA3HzoF4wdSV5zm0niohoJp9VEGTBbFmBtgI'
const supabase = createClient(supabaseUrl, supabaseKey)



export default supabase;
