"use client"
import { useState } from 'react'
import UsernameModal from './UsernameModal'

interface ChallengeButtonProps {
  puzzleIndex: number
  cluesUsed: number
  won: boolean
  username: string
  playerId?: string
  onUsernameSet: (name: string) => void
}

export default function ChallengeButton({
  puzzleIndex, cluesUsed, won, username, playerId, onUsernameSet
}: ChallengeButtonProps) {
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateChallengeUrl = (name: string) => {
    const base = window.location.origin
    const params = new URLSearchParams({
      challenge: puzzleIndex.toString(),
      challenger: name,
      challengerId: playerId || '',
      score: cluesUsed.toString(),
      won: won ? '1' : '0'
    })
    return `${base}?${params.toString()}`
  }

  const handleChallenge = () => {
    if (!username) {
      setShowUsernameModal(true)
      return
    }
    shareChallenge(username)
  }

  const shareChallenge = (name: string) => {
    const url = generateChallengeUrl(name)
    const scoreText = won
      ? `${cluesUsed}/5 clues mein pehchana 🎯`
      : 'nahi pehchana 😔'
    const playerIdText = playerId ? ` (${playerId})` : ''
    const text = `${name}${playerIdText} ne tumhe Pehchaan Kaun challenge kiya! 🇮🇳\n\nUnhone Puzzle #${puzzleIndex + 1} ko ${scoreText}\nKya tum beat kar sakte ho? 👇\n${url}`

    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  return (
    <>
      <button
        onClick={handleChallenge}
        style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
          border: 'none', borderRadius: '12px',
          color: '#fff', fontFamily: 'Baloo 2, cursive',
          fontSize: '1rem', fontWeight: '700',
          cursor: 'pointer', marginTop: '10px',
          boxShadow: '0 6px 20px rgba(108,92,231,0.3)',
          transition: 'all 0.2s'
        }}
      >
        {copied ? '✅ Link Copy Ho Gaya!' : '🎯 Dost Ko Challenge Karo!'}
      </button>

      {showUsernameModal && (
        <UsernameModal
          onSave={(name) => {
            onUsernameSet(name)
            setShowUsernameModal(false)
            shareChallenge(name)
          }}
        />
      )}
    </>
  )
}
