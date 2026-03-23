"use client"

import { useState, useEffect } from 'react'
import { getLeaderboard, getMyRank } from '@/lib/supabase'
import { getOrCreatePlayerId, getDisplayName } from '@/lib/playerUtils'

type SortTab = 'streak' | 'wins' | 'clue'

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<SortTab>('streak')
  const [myPlayerId, setMyPlayerId] = useState('')
  const [myRank, setMyRank] = useState(-1)
  const [myDisplayName, setMyDisplayName] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    const id = getOrCreatePlayerId()
    const name = getDisplayName()
    setMyPlayerId(id)
    setMyDisplayName(name)
    loadData(id, 'streak')
  }, [])

  const loadData = async (id: string, tab: SortTab) => {
    setLoading(true)
    const [data, rank] = await Promise.all([
      getLeaderboard(tab),
      getMyRank(id, tab)
    ])
    setPlayers(data)
    setMyRank(rank)
    setLastUpdated(new Date().toLocaleTimeString('en-IN'))
    setLoading(false)
  }

  const handleTabChange = (tab: SortTab) => {
    setActiveTab(tab)
    loadData(myPlayerId, tab)
  }

  const getMedal = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}`
  }

  const getScore = (player: any) => {
    if (activeTab === 'streak') return player.current_streak
    if (activeTab === 'wins') return player.total_wins_this_week
    return player.one_clue_wins
  }

  const getScoreLabel = () => {
    if (activeTab === 'streak') return 'din streak'
    if (activeTab === 'wins') return 'wins this week'
    return '1-clue wins'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0F1C',
      color: '#fff',
      fontFamily: 'Poppins, sans-serif',
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

        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px', padding: '20px 20px 16px',
          textAlign: 'center', marginBottom: '14px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>
            🏆
          </div>
          <div style={{
            fontFamily: 'Baloo 2, cursive',
            fontSize: '1.5rem', fontWeight: '800', color: '#fff'
          }}>
            Weekly Leaderboard
          </div>
          <div style={{
            fontSize: '0.78rem', color: '#555', marginTop: '4px'
          }}>
            Har Somwar reset • Is hafte ke top players
          </div>
        </div>

        {/* My rank card */}
        {myPlayerId && (
          <div style={{
            background: 'rgba(255,107,0,0.08)',
            border: '1.5px solid rgba(255,107,0,0.25)',
            borderRadius: '14px', padding: '14px 16px',
            marginBottom: '14px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                fontSize: '0.72rem', color: '#FF9F43',
                fontWeight: '700', letterSpacing: '0.06em',
                marginBottom: '3px'
              }}>
                TERI RANK THIS WEEK
              </div>
              <div style={{
                fontFamily: 'Baloo 2, cursive',
                fontSize: '1rem', fontWeight: '700', color: '#fff'
              }}>
                {myDisplayName || 'Tu'}
              </div>
              <div style={{
                fontSize: '0.68rem', color: '#555',
                fontFamily: 'monospace'
              }}>
                {myPlayerId}
              </div>
            </div>
            <div style={{
              fontFamily: 'Baloo 2, cursive',
              fontSize: '2rem', fontWeight: '800',
              color: '#FF6B00'
            }}>
              {myRank === -1 ? '—' : `#${myRank}`}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px', marginBottom: '14px'
        }}>
          {([
            { key: 'streak', label: '🔥 Streak' },
            { key: 'wins',   label: '🏆 Wins' },
            { key: 'clue',   label: '⚡ 1-Clue' }
          ] as { key: SortTab, label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={{
                padding: '10px',
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg, #FF6B00, #FF9F43)'
                  : 'rgba(255,255,255,0.05)',
                border: activeTab === tab.key
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#fff',
                fontFamily: 'Baloo 2, cursive',
                fontSize: '0.82rem', fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '50px 20px',
            color: '#555'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
              ⏳
            </div>
            <div>Loading leaderboard...</div>
          </div>
        ) : players.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '50px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.06)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
              😔
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              Abhi koi player nahi hai
            </div>
            <div style={{
              color: '#444', fontSize: '0.78rem', marginTop: '6px'
            }}>
              Pehle puzzle khelo, phir leaderboard aayega!
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            {players.map((player, index) => {
              const isMe = player.player_id === myPlayerId
              return (
                <div
                  key={player.id}
                  style={{
                    background: isMe
                      ? 'rgba(255,107,0,0.1)'
                      : index < 3
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.03)',
                    border: isMe
                      ? '1.5px solid rgba(255,107,0,0.4)'
                      : index === 0
                      ? '1px solid rgba(255,212,59,0.2)'
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    width: '32px',
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    color: index < 3 ? '#FFD700' : '#888'
                  }}>
                    {getMedal(index)}
                  </div>

                  {/* Player info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Baloo 2, cursive',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: isMe ? '#FF9F43' : '#fff'
                    }}>
                      {player.display_name}
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#666',
                      fontFamily: 'monospace',
                      marginTop: '2px'
                    }}>
                      {player.player_id}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{
                    textAlign: 'right',
                    minWidth: '80px'
                  }}>
                    <div style={{
                      fontFamily: 'Baloo 2, cursive',
                      fontSize: '1.4rem',
                      fontWeight: '800',
                      color: '#FF6B00'
                    }}>
                      {getScore(player)}
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#666'
                    }}>
                      {getScoreLabel()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Last updated */}
        {!loading && players.length > 0 && (
          <div style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#444',
            marginTop: '16px'
          }}>
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
    </div>
  )
}
