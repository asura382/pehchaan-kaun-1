"use client"

import { ALL_BADGES, getRarityColor } from '@/lib/badges'

interface BadgeShelfProps {
  earnedBadgeIds: string[]
}

export default function BadgeShelf({ earnedBadgeIds }: BadgeShelfProps) {
  const earned = ALL_BADGES.filter(b => earnedBadgeIds.includes(b.id))
  const locked = ALL_BADGES.filter(b => !earnedBadgeIds.includes(b.id))

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#FF9F43',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
        🎖️ Tere Badges ({earned.length}/{ALL_BADGES.length})
      </div>

      {earned.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          marginBottom: '16px'
        }}>
          {earned.map(badge => (
            <div
              key={badge.id}
              title={badge.description}
              style={{
                background: `${getRarityColor(badge.rarity)}15`,
                border: `1.5px solid ${getRarityColor(badge.rarity)}`,
                borderRadius: '12px',
                padding: '10px 6px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                {badge.emoji}
              </div>
              <div style={{
                fontSize: '0.62rem',
                color: getRarityColor(badge.rarity),
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                {badge.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <>
          <div style={{
            fontSize: '0.75rem',
            color: '#555',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            🔒 Locked ({locked.length})
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {locked.map(badge => (
              <div
                key={badge.id}
                title={badge.description}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1.5px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '10px 6px',
                  textAlign: 'center',
                  opacity: 0.35,
                  filter: 'grayscale(1)'
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                  {badge.emoji}
                </div>
                <div style={{
                  fontSize: '0.62rem',
                  color: '#555',
                  fontWeight: '600',
                  lineHeight: '1.2'
                }}>
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {earned.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#555',
          fontSize: '0.85rem',
          padding: '20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.08)'
        }}>
          Abhi koi badge nahi mila 😔
          <br />
          <span style={{ fontSize: '0.78rem', color: '#444' }}>
            Puzzles khelo aur badges kamao!
          </span>
        </div>
      )}
    </div>
  )
}
