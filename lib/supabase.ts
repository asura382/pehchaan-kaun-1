import { createClient, SupabaseClient } from '@supabase/supabase-js'

console.log('supabase.ts loaded')
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'EXISTS' : 'MISSING')
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING')

let supabaseInstance: SupabaseClient | null = null

function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Supabase URL exists:', !!url)
  console.log('Supabase KEY exists:', !!key)
  
  if (!url || !key) {
    console.error('Missing env vars:', { url: !!url, key: !!key })
    return null
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key)
    console.log('Created new Supabase instance')
  }
  
  return supabaseInstance
}

export function getWeekKey(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 +
    startOfYear.getDay() + 1) / 7
  )
  return `${now.getFullYear()}_W${week}`
}

export async function submitToLeaderboard(
  playerId: string,
  displayName: string,
  stats: any
): Promise<void> {
  console.log('submitToLeaderboard called')
  
  const supabase = getSupabase()
  
  console.log('Supabase instance:', supabase ? 'OK' : 'NULL')
  console.log('Player ID:', playerId)
  
  if (!supabase) {
    console.error('Supabase client is null - check env vars')
    return
  }
  if (!playerId) {
    console.error('Player ID is empty')
    return
  }

  const weekKey = getWeekKey()
  console.log('Week key:', weekKey)
  
  const weeklyWins = stats.weeklyWins?.[weekKey] || 0
  
  const payload = {
    player_id: playerId,
    display_name: displayName || 'Anonymous',
    week_key: weekKey,
    current_streak: stats.currentStreak || 0,
    one_clue_wins: stats.oneClueWins || 0,
    total_wins_this_week: weeklyWins,
    badges_count: (stats.earnedBadges || []).length,
    updated_at: new Date().toISOString()
  }
  
  console.log('Payload to submit:', payload)

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert(payload, { onConflict: 'player_id,week_key' })
      .select()

    if (error) {
      console.error('Supabase upsert error:', error)
      console.error('Error details:', JSON.stringify(error))
    } else {
      console.log('Supabase upsert success:', data)
    }
  } catch (e) {
    console.error('Supabase exception:', e)
  }
}

export async function getLeaderboard(
  sortBy: 'streak' | 'wins' | 'clue' = 'streak'
): Promise<any[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const weekKey = getWeekKey()
  const sortColumn =
    sortBy === 'streak' ? 'current_streak' :
    sortBy === 'wins' ? 'total_wins_this_week' :
    'one_clue_wins'

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('week_key', weekKey)
      .order(sortColumn, { ascending: false })
      .limit(50)

    if (error) {
      console.error('Fetch error:', error)
      return []
    }
    return data || []
  } catch (e) {
    console.error('Fetch error:', e)
    return []
  }
}

export async function getMyRank(
  playerId: string,
  sortBy: 'streak' | 'wins' | 'clue' = 'streak'
): Promise<number> {
  const all = await getLeaderboard(sortBy)
  const index = all.findIndex(p => p.player_id === playerId)
  return index === -1 ? -1 : index + 1
}
