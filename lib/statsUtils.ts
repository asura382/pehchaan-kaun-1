export interface Stats {
  currentStreak: number
  maxStreak: number
  totalPlayed: number
  totalWon: number
  lastPlayedDate: string | null
  lastPuzzleIndex: number
  lastResult: { won: boolean; cluesUsed: number } | null
  lastStreakDate: string | null
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
    lastStreakDate: null
  }
}

export function getStats(): Stats {
  if (typeof window === 'undefined') {
    return getDefaultStats()
  }
  
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : getDefaultStats()
}

export function saveStats(stats: Stats): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function updateStatsAfterGame(
  won: boolean,
  cluesUsed: number,
  puzzleIndex: number
): Stats {
  const stats = getStats()
  const today = new Date().toDateString()
  
  // Prevent double counting if called twice
  if (stats.lastPlayedDate === today && stats.lastPuzzleIndex === puzzleIndex) {
    return stats
  }
  
  // Always increment totalPlayed
  stats.totalPlayed++
  
  // Save played info immediately
  stats.lastPlayedDate = today
  stats.lastPuzzleIndex = puzzleIndex
  stats.lastResult = { won, cluesUsed }
  
  if (won) {
    stats.totalWon++
    // Check consecutive streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()
    
    if (stats.lastStreakDate === yesterdayString) {
      stats.currentStreak++
    } else {
      stats.currentStreak = 1
    }
    stats.lastStreakDate = today
    
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak
    }
  } else {
    stats.currentStreak = 0
  }
  
  saveStats(stats)
  return stats
}

export function hasPlayedToday(puzzleIndex: number): boolean {
  try {
    const stats = getStats()
    const today = new Date().toDateString()
    return (
      stats.lastPlayedDate === today && 
      stats.lastPuzzleIndex === puzzleIndex
    )
  } catch {
    return false
  }
}

export function getLastResult(): { won: boolean; cluesUsed: number } | null {
  const stats = getStats()
  return stats.lastResult
}
