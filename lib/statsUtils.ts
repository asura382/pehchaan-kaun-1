import { Badge } from './badges'

export interface Stats {
  currentStreak: number
  maxStreak: number
  totalPlayed: number
  totalWon: number
  lastPlayedDate: string | null
  lastPuzzleIndex: number
  lastResult: { won: boolean; cluesUsed: number } | null
  lastStreakDate: string | null
  earnedBadges: string[]
  oneClueWins: number
  categoryWins: Record<string, number>
  consecutiveLosses: number
}

const STORAGE_KEY = 'pehchaanKaunStats'

function getDefaultStats(): Stats {
  return {
    currentStreak: 0,
    maxStreak: 0,
    totalPlayed: 0,
    totalWon: 0,
    lastPlayedDate: null,
    lastPuzzleIndex: -1,
    lastResult: null,
    lastStreakDate: null,
    earnedBadges: [],
    oneClueWins: 0,
    categoryWins: {},
    consecutiveLosses: 0
  }
}

export function getStats(): Stats {
  if (typeof window === 'undefined') {
    return getDefaultStats()
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return getDefaultStats()
    
    const parsed = JSON.parse(saved)
    // Validate required fields
    if (!parsed || typeof parsed !== 'object') {
      return getDefaultStats()
    }
    
    return {
      currentStreak: parsed.currentStreak ?? 0,
      maxStreak: parsed.maxStreak ?? 0,
      totalPlayed: parsed.totalPlayed ?? 0,
      totalWon: parsed.totalWon ?? 0,
      lastPlayedDate: parsed.lastPlayedDate ?? null,
      lastPuzzleIndex: parsed.lastPuzzleIndex ?? -1,
      lastResult: parsed.lastResult ?? null,
      lastStreakDate: parsed.lastStreakDate ?? null,
      earnedBadges: parsed.earnedBadges ?? [],
      oneClueWins: parsed.oneClueWins ?? 0,
      categoryWins: parsed.categoryWins ?? {},
      consecutiveLosses: parsed.consecutiveLosses ?? 0
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    return getDefaultStats()
  }
}

export function saveStats(stats: Stats): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded, clearing old data...')
      localStorage.removeItem(STORAGE_KEY)
    } else {
      console.error('Error saving stats:', error)
    }
  }
}

export function updateStatsAfterGame(
  won: boolean,
  cluesUsed: number, 
  puzzleIndex: number,
  puzzleCategory?: string,
  newBadges?: Badge[]
): Stats {
  const raw = localStorage.getItem('pehchaanKaunStats')
  const stats = raw ? JSON.parse(raw) : getDefaultStats()
  
  console.log('updateStatsAfterGame called:', {
    won, cluesUsed, puzzleIndex, puzzleCategory
  })
  console.log('Stats before update:', stats)
  
  const today = new Date().toDateString()
  
  // Prevent double save - check if already played this puzzle today
  if (stats.lastPlayedDate === today && 
      Number(stats.lastPuzzleIndex) === Number(puzzleIndex)) {
    console.log('Already played this puzzle today - skipping update')
    return stats
  }
  
  // Always increment totalPlayed
  stats.totalPlayed = (stats.totalPlayed || 0) + 1
  stats.lastPlayedDate = today
  stats.lastPuzzleIndex = Number(puzzleIndex)
  stats.lastResult = { won, cluesUsed }
  
  if (won) {
    stats.totalWon = (stats.totalWon || 0) + 1
    
    // Streak logic
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()
    
    if (stats.lastStreakDate === yesterdayString || stats.lastStreakDate === today) {
      stats.currentStreak = (stats.currentStreak || 0) + 1
    } else {
      stats.currentStreak = 1
    }
    stats.lastStreakDate = today
    
    if (stats.currentStreak > (stats.maxStreak || 0)) {
      stats.maxStreak = stats.currentStreak
    }
    
    // Track one clue wins
    if (cluesUsed === 1) {
      stats.oneClueWins = (stats.oneClueWins || 0) + 1
    }
    
    // Track category wins
    stats.categoryWins = stats.categoryWins || {}
    if (puzzleCategory) {
      const cat = puzzleCategory.toLowerCase()
      let key = 'other'
      if (cat.includes('freedom') || cat.includes('freedom fighter')) key = 'freedom'
      else if (cat.includes('cricket')) key = 'cricket'
      else if (cat.includes('bollywood')) key = 'bollywood'
      else if (cat.includes('scientist') || cat.includes('science')) key = 'science'
      else if (cat.includes('history') || cat.includes('ruler') || 
               cat.includes('ancient') || cat.includes('medieval')) key = 'history'
      else if (cat.includes('sport')) key = 'sports'
      else if (cat.includes('musician') || cat.includes('singer')) key = 'music'
      else if (cat.includes('politician')) key = 'politics'
      else if (cat.includes('filmmaker')) key = 'films'
      else if (cat.includes('governance') || cat.includes('constitution')) key = 'governance'
      
      stats.categoryWins[key] = (stats.categoryWins[key] || 0) + 1
    }
    
    // Consecutive losses reset on win
    stats.consecutiveLosses = 0
    
  } else {
    stats.currentStreak = 0
    stats.consecutiveLosses = (stats.consecutiveLosses || 0) + 1
  }
  
  // Save new badges
  if (newBadges && newBadges.length > 0) {
    stats.earnedBadges = stats.earnedBadges || []
    const newIds = newBadges.map(b => b.id)
    // Use Set to avoid duplicates
    stats.earnedBadges = [...new Set([...stats.earnedBadges, ...newIds])]
    console.log('New badges earned:', newIds)
    console.log('All badges now:', stats.earnedBadges)
  }
  
  console.log('Stats after update:', stats)
  
  // SAVE TO LOCALSTORAGE
  saveStats(stats)
  
  // Verify it saved
  const saved = localStorage.getItem('pehchaanKaunStats')
  console.log('Verified saved stats - totalPlayed:', JSON.parse(saved || '{}').totalPlayed)
  
  return stats
}

export function hasPlayedToday(puzzleIndex: number): boolean {
  try {
    if (typeof window === 'undefined') return false
    const raw = localStorage.getItem('pehchaanKaunStats')
    if (!raw) {
      console.log('No stats found in localStorage')
      return false
    }
    const stats = JSON.parse(raw)
    const today = new Date().toDateString()
    
    console.log('Checking hasPlayedToday:')
    console.log('today:', today)
    console.log('lastPlayedDate:', stats.lastPlayedDate)
    console.log('puzzleIndex:', puzzleIndex)
    console.log('lastPuzzleIndex:', stats.lastPuzzleIndex)
    
    const result = (
      stats.lastPlayedDate === today &&
      Number(stats.lastPuzzleIndex) === Number(puzzleIndex)
    )
    console.log('hasPlayedToday result:', result)
    return result
  } catch (e) {
    console.error('hasPlayedToday error:', e)
    return false
  }
}

export function getLastResult(): { won: boolean; cluesUsed: number } | null {
  const stats = getStats()
  return stats.lastResult
}
