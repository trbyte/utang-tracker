import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ypbhlsgrpvcvgadcvexh.supabase.co'
const supabaseKey = 'sb_publishable_HIc8Q8cuAyvGv6iRA-tMEQ_TaedU-I1'

export const supabase = createClient(supabaseUrl, supabaseKey)