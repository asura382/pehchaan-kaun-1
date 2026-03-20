export interface Stats {
  currentStreak: number
  maxStreak: number
  totalPlayed: number
  totalWon: number
  lastPlayedDate: string | null
  lastPuzzleIndex: number
  lastResult: { won: boolean; cluesUsed: number } | null
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
    lastResult: null
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

export function updateStatsAfterGame(won: boolean, cluesUsed: number, puzzleIndex: number): Stats {
  const stats = getStats()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString()
  
  // If already played today with same puzzle, don't update
  if (stats.lastPlayedDate === today && stats.lastPuzzleIndex === puzzleIndex) {
    return stats
  }
  
  stats.totalPlayed++
  stats.lastPlayedDate = today
  stats.lastPuzzleIndex = puzzleIndex
  stats.lastResult = { won, cluesUsed }
  
  if (won) {
    stats.totalWon++
    
    // Check if consecutive day
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toDateString()
    
    if (stats.lastPlayedDate === yesterdayStr) {
      stats.currentStreak++
    } else {
      stats.currentStreak = 1
    }
    
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
  if (typeof window === 'undefined') return false
  
  const stats = getStats()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString()
  
  return stats.lastPlayedDate === today && stats.lastPuzzleIndex === puzzleIndex
}

export function getLastResult(): { won: boolean; cluesUsed: number } | null {
  const stats = getStats()
  return stats.lastResult
}
