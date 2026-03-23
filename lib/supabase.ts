import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.error('Supabase env variables missing')
    return null
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key)
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
  const supabase = getSupabase()
  if (!supabase || !playerId) return

  const weekKey = getWeekKey()
  const weeklyWins = stats.weeklyWins?.[weekKey] || 0

  try {
    const { error } = await supabase
      .from('leaderboard')
      .upsert(
        {
          player_id: playerId,
          display_name: displayName || 'Anonymous',
          week_key: weekKey,
          current_streak: stats.currentStreak || 0,
          one_clue_wins: stats.oneClueWins || 0,
          total_wins_this_week: weeklyWins,
          badges_count: (stats.earnedBadges || []).length,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'player_id,week_key' }
      )
    if (error) console.error('Submit error:', error)
    else console.log('Score submitted successfully')
  } catch (e) {
    console.error('Submit error:', e)
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
