// Unique player ID — generated once, stored forever
export function getOrCreatePlayerId(): string {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem('pkPlayerId')
  if (existing) return existing

  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36)
    .substring(2, 6).toUpperCase()
  const playerId = `PK-${timestamp}-${random}`
  localStorage.setItem('pkPlayerId', playerId)
  return playerId
}

// Display name — can be anything, not unique
export function getDisplayName(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('pkUsername') || ''
}

export function saveDisplayName(name: string): void {
  localStorage.setItem('pkUsername', name.trim())
}
