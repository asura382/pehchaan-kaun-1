"use client"

interface ChallengeBannerProps {
  challengerName: string
  challengerScore: number
  challengerWon: boolean
  puzzleIndex: number
}

export default function ChallengeBanner({
  challengerName, challengerScore,
  challengerWon, puzzleIndex
}: ChallengeBannerProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(162,155,254,0.1))',
      border: '1px solid rgba(108,92,231,0.4)',
      borderRadius: '16px', padding: '16px 18px',
      marginBottom: '16px', textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🎯</div>
      <div style={{
        fontFamily: 'Baloo 2, cursive',
        fontSize: '1.1rem', fontWeight: '800',
        color: '#fff', marginBottom: '4px'
      }}>
        {challengerName} ne challenge kiya!
      </div>
      <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
        Unhone Puzzle #{puzzleIndex + 1} ko{' '}
        {challengerWon
          ? <span style={{ color: '#2ed573' }}>{challengerScore}/5 clues mein pehchana 🎯</span>
          : <span style={{ color: '#ff4757' }}>nahi pehchana 😔</span>
        }
      </div>
      <div style={{
        fontSize: '0.9rem', color: '#FF9F43',
        fontWeight: '700', marginTop: '8px'
      }}>
        Kya tum beat kar sakte ho? 💪
      </div>
    </div>
  )
}
