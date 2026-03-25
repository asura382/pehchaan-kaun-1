"use client"
export default function LeaderboardPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0F1C',
      color: '#fff',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
          🏆
        </div>
        <div style={{
          fontFamily: 'Baloo 2, cursive',
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '8px'
        }}>
          Leaderboard
        </div>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
          borderRadius: '20px',
          padding: '6px 18px',
          fontSize: '0.82rem',
          fontWeight: '700',
          color: '#fff',
          letterSpacing: '0.08em',
          marginBottom: '20px'
        }}>
          COMING SOON
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px',
          padding: '28px 24px',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '0.95rem',
            color: '#aaa',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}>
            Weekly rankings aa rahe hain jald hi! 🇮🇳
            <br/>
            Tab tak apna streak banate raho
            aur badges kamao.
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '10px'
          }}>
            {[
              { emoji: '🥇', label: 'Top Streak' },
              { emoji: '⚡', label: '1-Clue Wins' },
              { emoji: '🏆', label: 'Weekly Wins' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px 8px',
                opacity: 0.5
              }}>
                <div style={{
                  fontSize: '1.6rem',
                  marginBottom: '6px',
                  filter: 'grayscale(1)'
                }}>
                  {item.emoji}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#666',
                  fontWeight: '600'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontFamily: 'Baloo 2, cursive',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Wapas Khelne Jao 🎯
        </button>
      </div>
    </div>
  )
}
