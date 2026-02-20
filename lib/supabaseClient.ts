import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.com/dashboard/project/zsdrcurvastdegmdjdrk'
const supabaseKey = 'sb_publishable_1kRfQ9JJ8xHq4zBoMDND0w_2CqX25IV'

export const supabase = createClient(supabaseUrl, supabaseKey)
