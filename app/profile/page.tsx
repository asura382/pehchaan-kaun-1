"use client"

import { useState, useEffect, useRef } from 'react'
import { toPng } from 'html-to-image'
import { ALL_BADGES, getRarityColor } from '@/lib/badges'
import { getStats } from '@/lib/statsUtils'
import { getOrCreatePlayerId } from '@/lib/playerUtils'

export default function ProfilePage() {
  const [stats, setStats] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Read fresh stats from localStorage
    const freshStats = getStats()
    console.log('Profile stats:', freshStats)
    setStats(freshStats)
    
    const name = localStorage.getItem('pkUsername') || 'Pehchaan Master'
    setUsername(name)
    setNewName(name)
    
    // Load Player ID using utility function
    const id = getOrCreatePlayerId()
    setPlayerId(id)
  }, [])

  const earnedBadges = stats
    ? ALL_BADGES.filter(b => 
        Array.isArray(stats.earnedBadges) && 
        stats.earnedBadges.includes(b.id)
      )
    : []

  console.log('Profile - stats:', stats)
  console.log('Profile - earnedBadges:', stats?.earnedBadges)

  const winRate = stats && stats.totalPlayed > 0
    ? Math.round((stats.totalWon / stats.totalPlayed) * 100)
    : 0

  const handleSaveName = () => {
    if (newName.trim().length >= 2) {
      setUsername(newName.trim())
      localStorage.setItem('pkUsername', newName.trim())
      setEditingName(false)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0, pixelRatio: 2,
        backgroundColor: '#0D0F1C'
      })
      const link = document.createElement('a')
      link.download = `${username}-pehchaan-profile.png`
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error(e)
    }
    setIsGenerating(false)
  }

  const handleShare = async () => {
    await handleDownload()
    const text = encodeURIComponent(
      `Dekho meri Pehchaan Kaun profile! 🇮🇳\n` +
      `${username} (${playerId})\n` +
      `🔥 Streak: ${stats?.currentStreak || 0} din\n` +
      `🏆 Win Rate: ${winRate}%\n` +
      `🎖️ Badges: ${earnedBadges.length}/${ALL_BADGES.length}\n` +
      `Play at: pehchaankaun.vercel.app`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (!stats) return (
    <div style={{
      minHeight: '100vh', background: '#0D0F1C',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#fff'
    }}>
      Loading...
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#0D0F1C',
      color: '#fff', fontFamily: 'Poppins, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Back button */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '8px 16px',
            color: '#aaa', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.85rem', marginBottom: '16px'
          }}
        >
          ← Wapas Jao
        </button>

        {/* THE PROFILE CARD - captured as image */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '20px',
            padding: '28px 24px',
            border: '1px solid #334155',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          {/* Top stripe */}
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #FF6B00, #ffffff, #138808)',
            borderRadius: '4px', marginBottom: '24px'
          }} />

          {/* Label */}
          <div style={{
            fontSize: '11px', color: '#94a3b8',
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            PEHCHAAN KAUN 🇮🇳 PROFILE
          </div>

          {/* Username */}
          <div style={{
            fontSize: '28px', fontWeight: '800',
            color: '#fff', marginBottom: '4px'
          }}>
            {username}
          </div>

          {/* Player ID */}
          <div style={{
            fontSize: '11px', color: '#94a3b8',
            fontFamily: 'monospace',
            background: 'rgba(255,255,255,0.05)',
            padding: '6px 12px',
            borderRadius: '6px',
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            🎮 {playerId}
          </div>

          <div style={{
            fontSize: '13px', color: '#64748b',
            marginBottom: '24px'
          }}>
            Daily Indian GK Player
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '10px', marginBottom: '24px'
          }}>
            {[
              { label: 'PLAYED', value: stats.totalPlayed || 0 },
              { label: 'WIN RATE', value: `${winRate}%` },
              { label: 'STREAK 🔥', value: stats.currentStreak || 0 },
              { label: 'BADGES', value: `${earnedBadges.length}` }
            ].map((s, i) => (
              <div key={i} style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '10px', padding: '12px 8px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '20px', fontWeight: '800',
                  color: '#FF6B00'
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '9px', color: '#64748b',
                  marginTop: '4px', letterSpacing: '0.05em'
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Badges section */}
          <div style={{
            fontSize: '11px', color: '#94a3b8',
            letterSpacing: '1px', marginBottom: '12px'
          }}>
            MY BADGES ({earnedBadges.length}/{ALL_BADGES.length})
          </div>

          {earnedBadges.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '8px', marginBottom: '20px'
            }}>
              {earnedBadges.map(badge => (
                <div key={badge.id} style={{
                  background: `${getRarityColor(badge.rarity)}15`,
                  border: `1.5px solid ${getRarityColor(badge.rarity)}`,
                  borderRadius: '10px', padding: '8px 4px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.4rem' }}>{badge.emoji}</div>
                  <div style={{
                    fontSize: '8px',
                    color: getRarityColor(badge.rarity),
                    fontWeight: '700', marginTop: '3px',
                    lineHeight: '1.2'
                  }}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', color: '#334155',
              padding: '16px', marginBottom: '20px',
              border: '1px dashed #334155', borderRadius: '10px',
              fontSize: '13px'
            }}>
              Abhi koi badge nahi mila
            </div>
          )}

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #334155',
            paddingTop: '14px', textAlign: 'center',
            fontSize: '11px', color: '#64748b'
          }}>
            pehchaankaun.vercel.app
          </div>
        </div>

        {/* Edit name */}
        <div style={{ marginTop: '16px' }}>
          {editingName ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSaveName()}
                style={{
                  flex: 1, padding: '12px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,107,0,0.4)',
                  borderRadius: '10px', color: '#fff',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.95rem', outline: 'none'
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  padding: '12px 18px',
                  background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
                  border: 'none', borderRadius: '10px',
                  color: '#fff', fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'Baloo 2, cursive'
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              style={{
                width: '100%', padding: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: '#888',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.88rem', cursor: 'pointer'
              }}
            >
              ✏️ Apna naam change karo
            </button>
          )}
        </div>

        {/* Share buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            style={{
              padding: '13px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', color: '#fff',
              fontFamily: 'Baloo 2, cursive',
              fontSize: '0.95rem', fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📸 Card Save Karo
          </button>
          <button
            onClick={handleShare}
            disabled={isGenerating}
            style={{
              padding: '13px',
              background: 'linear-gradient(135deg, #128C7E, #25D366)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontFamily: 'Baloo 2, cursive',
              fontSize: '0.95rem', fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            📱 WhatsApp Share
          </button>
        </div>

        {/* Challenge button */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            border: 'none', borderRadius: '12px',
            color: '#fff', fontFamily: 'Baloo 2, cursive',
            fontSize: '1rem', fontWeight: '700',
            cursor: 'pointer', marginTop: '10px',
            boxShadow: '0 6px 20px rgba(108,92,231,0.25)'
          }}
        >
          🎯 Dost Ko Challenge Karo!
        </button>
      </div>
    </div>
  )
}
