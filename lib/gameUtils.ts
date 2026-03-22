import { Puzzle } from '../data/puzzles'

export function getTodayPuzzle(puzzles: Puzzle[]) {
  const now = new Date()
  const localDay = Math.floor(
    (now.getTime() - now.getTimezoneOffset() * 60000) / 86400000
  )
  return { puzzle: puzzles[localDay % puzzles.length], index: localDay % puzzles.length }
}

export function checkGuess(guess: string, answer: string): 'correct' | 'hint' | 'wrong' {
  // Input validation and sanitization
  if (!guess || !answer || typeof guess !== 'string' || typeof answer !== 'string') {
    return 'wrong'
  }
  
  const g = guess.toLowerCase().trim()
  const a = answer.toLowerCase().trim()
  
  // Prevent empty string comparisons
  if (!g || !a) return 'wrong'
  
  if (g === a) return 'correct'
  if (g.includes(a) || a.includes(g)) return 'correct'
  
  const gWords = g.split(' ').filter(w => w.length > 2)
  const aWords = a.split(' ').filter(w => w.length > 2)
  const matches = gWords.filter(w => aWords.includes(w)).length
  
  if (matches >= 1) return 'correct'
  if (g[0] === a[0]) return 'hint'
  
  return 'wrong'
}

export function getEmojiGrid(won: boolean, cluesUsed: number): string {
  let grid = ''
  for (let i = 0; i < 5; i++) {
    if (won && i === cluesUsed - 1) {
      grid += '🟩'
    } else if (i < cluesUsed - (won ? 1 : 0)) {
      grid += '🟥'
    } else {
      grid += '⬜'
    }
  }
  return grid
}

export function getNextPuzzleTime(): number {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return tomorrow.getTime() - now.getTime()
}

export function formatTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  return `${hours}h ${minutes}m ${seconds}s`
}
