export interface Badge {
  id: string
  name: string
  nameHindi: string
  description: string
  emoji: string
  category: 'streak' | 'score' | 'knowledge' | 'persistence' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ALL_BADGES: Badge[] = [
  // PERSISTENCE BADGES
  {
    id: 'pehla_kadam',
    name: 'Pehla Kadam',
    nameHindi: 'पहला कदम',
    description: 'Play your first puzzle',
    emoji: '👣',
    category: 'persistence',
    rarity: 'common'
  },
  {
    id: 'dimag_ki_batti',
    name: 'Dimag Ki Batti',
    nameHindi: 'दिमाग की बत्ती',
    description: 'Win 10 puzzles total',
    emoji: '🧠',
    category: 'persistence',
    rarity: 'common'
  },
  {
    id: 'gk_king',
    name: 'GK King',
    nameHindi: 'जीके किंग',
    description: 'Win 25 puzzles total',
    emoji: '📚',
    category: 'persistence',
    rarity: 'rare'
  },
  {
    id: 'legend',
    name: 'Legend',
    nameHindi: 'लेजेंड',
    description: 'Win 50 puzzles total',
    emoji: '🏆',
    category: 'persistence',
    rarity: 'epic'
  },
  {
    id: 'pehchaan_master',
    name: 'Pehchaan Master',
    nameHindi: 'पहचान मास्टर',
    description: 'Win 100 puzzles total',
    emoji: '🥇',
    category: 'persistence',
    rarity: 'legendary'
  },

  // SCORE BADGES
  {
    id: 'bijli',
    name: 'Bijli',
    nameHindi: 'बिजली',
    description: 'Guess correctly in 1 clue',
    emoji: '⚡',
    category: 'score',
    rarity: 'common'
  },
  {
    id: 'nishanebaaz',
    name: 'Nishanebaaz',
    nameHindi: 'निशानेबाज',
    description: 'Guess in 1 clue 3 times',
    emoji: '🎯',
    category: 'score',
    rarity: 'rare'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    nameHindi: 'परफेक्शनिस्ट',
    description: 'Guess in 1 clue 5 times total',
    emoji: '🌟',
    category: 'score',
    rarity: 'epic'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    nameHindi: 'स्पीड डेमन',
    description: 'Guess in 1 clue 10 times total',
    emoji: '🚀',
    category: 'score',
    rarity: 'legendary'
  },
  {
    id: 'cool_head',
    name: 'Cool Head',
    nameHindi: 'कूल हेड',
    description: 'Win after using all 5 clues',
    emoji: '😎',
    category: 'score',
    rarity: 'common'
  },
  {
    id: 'comeback_king',
    name: 'Comeback King',
    nameHindi: 'कमबैक किंग',
    description: 'Win after 3 losses in a row',
    emoji: '🎪',
    category: 'special',
    rarity: 'rare'
  },

  // STREAK BADGES
  {
    id: 'hafte_ka_hero',
    name: 'Hafte Ka Hero',
    nameHindi: 'हफ्ते का हीरो',
    description: '7 day streak',
    emoji: '🔥',
    category: 'streak',
    rarity: 'rare'
  },
  {
    id: 'maheena_maar',
    name: 'Maheena Maar',
    nameHindi: 'महीना मार',
    description: '30 day streak',
    emoji: '💪',
    category: 'streak',
    rarity: 'legendary'
  },

  // KNOWLEDGE BADGES - Category specific
  {
    id: 'desh_bhakt',
    name: 'Desh Bhakt',
    nameHindi: 'देश भक्त',
    description: 'Win 5 Freedom Fighter puzzles',
    emoji: '🇮🇳',
    category: 'knowledge',
    rarity: 'rare'
  },
  {
    id: 'cricket_gyani',
    name: 'Cricket Gyani',
    nameHindi: 'क्रिकेट ज्ञानी',
    description: 'Win 5 Cricket puzzles',
    emoji: '🏏',
    category: 'knowledge',
    rarity: 'rare'
  },
  {
    id: 'bollywood_fan',
    name: 'Bollywood Ka Fan',
    nameHindi: 'बॉलीवुड का फैन',
    description: 'Win 5 Bollywood puzzles',
    emoji: '🎬',
    category: 'knowledge',
    rarity: 'rare'
  },
  {
    id: 'scientist',
    name: 'Scientist',
    nameHindi: 'वैज्ञानिक',
    description: 'Win 5 Science puzzles',
    emoji: '🔬',
    category: 'knowledge',
    rarity: 'rare'
  },
  {
    id: 'itihaas_raja',
    name: 'Itihaas Ka Raja',
    nameHindi: 'इतिहास का राजा',
    description: 'Win 5 History puzzles',
    emoji: '👑',
    category: 'knowledge',
    rarity: 'rare'
  },
  {
    id: 'scholar',
    name: 'Scholar',
    nameHindi: 'विद्वान',
    description: 'Win puzzles in 5 different categories',
    emoji: '📖',
    category: 'knowledge',
    rarity: 'epic'
  },

  // SPECIAL BADGE - Sunday Challenge
  {
    id: 'sunday_champion',
    name: 'Sunday Champion',
    nameHindi: 'रविवार का चैंपियन',
    description: 'Complete a Sunday Special Challenge',
    emoji: '🌟',
    category: 'special',
    rarity: 'legendary'
  }
]

// Badge groups — for showing highest badge per category
// Only show the highest earned badge per group on share card
export const BADGE_GROUPS = {
  score_clue: ['speed_demon', 'perfectionist', 'nishanebaaz', 'bijli'],
  persistence_wins: ['pehchaan_master', 'legend', 'gk_king', 'dimag_ki_batti', 'pehla_kadam'],
  streak: ['maheena_maar', 'hafte_ka_hero'],
}

// Get highest badge earned in a group
export function getHighestBadgeInGroup(
  earnedBadgeIds: string[],
  group: string[]
): Badge | null {
  for (const badgeId of group) {
    if (earnedBadgeIds.includes(badgeId)) {
      return ALL_BADGES.find(b => b.id === badgeId) || null
    }
  }
  return null
}

// Check which new badges were earned after a game
export function checkNewBadges(
  stats: any,
  cluesUsed: number,
  won: boolean,
  puzzleCategory: string
): Badge[] {
  const newBadges: Badge[] = []
  const earned = stats.earnedBadges || []

  const addIfNew = (id: string) => {
    if (!earned.includes(id)) {
      const badge = ALL_BADGES.find(b => b.id === id)
      if (badge) newBadges.push(badge)
    }
  }

  // First game ever
  if (stats.totalPlayed === 1) addIfNew('pehla_kadam')

  if (won) {
    // Persistence badges
    if (stats.totalWon >= 10) addIfNew('dimag_ki_batti')
    if (stats.totalWon >= 25) addIfNew('gk_king')
    if (stats.totalWon >= 50) addIfNew('legend')
    if (stats.totalWon >= 100) addIfNew('pehchaan_master')

    // Score badges - 1 clue wins
    const oneClueWins = (stats.oneClueWins || 0)
    if (cluesUsed === 1) {
      addIfNew('bijli')
      if (oneClueWins >= 3) addIfNew('nishanebaaz')
      if (oneClueWins >= 5) addIfNew('perfectionist')
      if (oneClueWins >= 10) addIfNew('speed_demon')
    }

    // 5 clue win
    if (cluesUsed === 5) addIfNew('cool_head')

    // Streak badges
    if (stats.currentStreak >= 7) addIfNew('hafte_ka_hero')
    if (stats.currentStreak >= 30) addIfNew('maheena_maar')

    // Category wins
    const catWins = stats.categoryWins || {}
    const cat = puzzleCategory.toLowerCase()

    if (cat.includes('freedom fighter') || cat.includes('freedom')) {
      if ((catWins['freedom'] || 0) >= 5) addIfNew('desh_bhakt')
    }
    if (cat.includes('cricketer') || cat.includes('cricket')) {
      if ((catWins['cricket'] || 0) >= 5) addIfNew('cricket_gyani')
    }
    if (cat.includes('bollywood')) {
      if ((catWins['bollywood'] || 0) >= 5) addIfNew('bollywood_fan')
    }
    if (cat.includes('scientist') || cat.includes('science')) {
      if ((catWins['science'] || 0) >= 5) addIfNew('scientist')
    }
    if (cat.includes('history') || cat.includes('ruler') || cat.includes('ancient') || cat.includes('medieval')) {
      if ((catWins['history'] || 0) >= 5) addIfNew('itihaas_raja')
    }

    // Scholar - 5 different categories
    const uniqueCats = Object.keys(catWins).filter(k => catWins[k] >= 1)
    if (uniqueCats.length >= 5) addIfNew('scholar')

    // Comeback king - win after 3 losses
    if ((stats.consecutiveLosses || 0) >= 3) addIfNew('comeback_king')

    // Sunday Champion - complete Sunday challenge
    if (won && puzzleCategory.includes('Sunday Special')) {
      addIfNew('sunday_champion')
    }
  }

  return newBadges
}

// Get rarity color
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return '#aaaaaa'
    case 'rare': return '#4dabf7'
    case 'epic': return '#cc5de8'
    case 'legendary': return '#ffd43b'
    default: return '#aaaaaa'
  }
}
