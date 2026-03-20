'use client'

import React, { useRef } from 'react'
import { toPng } from 'html-to-image'
import confetti from 'canvas-confetti'
import { Stats } from '../lib/statsUtils'
import { getEmojiGrid } from '../lib/gameUtils'

interface ResultCardProps {
  answer: string
  category: string
  puzzleIndex: number
  won: boolean
  cluesUsed: number
  stats: Stats
}

export default function ResultCard({ 
  answer, 
  category, 
  puzzleIndex, 
  won, 
  cluesUsed, 
  stats 
}: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const emojiGrid = getEmojiGrid(won, cluesUsed)
  const scoreDisplay = won ? `${cluesUsed}/5` : '0/5'
  const scoreColor = won ? '#10b981' : '#ef4444'
  const scoreText = won ? 'clues mein pehchana' : 'nahi pehchana 😔'
  
  const winPercentage = stats.totalPlayed > 0 ? Math.round((stats.totalWon / stats.totalPlayed) * 100) : 0
  const betterThan = won ? Math.max(10, Math.min(95, winPercentage + Math.floor(Math.random() * 20))) : Math.floor(Math.random() * 30)
  
  let roastLine = ''
  if (won) {
    if (cluesUsed === 1) {
      roastLine = '🔥 LEGENDARY! Pehle hi clue mein pehchana! Genius hai bhai!'
    } else if (cluesUsed <= 3) {
      roastLine = '🎯 Badhiya performance! Sachchi Indian GK ki knowledge hai!'
    } else {
      roastLine = '✅ Chalta hai! Last moment mein sahi jawab diya!'
    }
  } else {
    roastLine = '😔 Arre yaar! Kal phir try karna. Practice makes perfect!'
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      })
      
      const link = document.createElement('a')
      link.download = `pehchaan-kaun-${puzzleIndex + 1}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to download card:', error)
    }
  }

  const shareWhatsApp = async () => {
    if (!cardRef.current) return
    
    try {
      // Convert card to image
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      })
      
      // Convert dataURL to Blob
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `pehchaan-kaun-${puzzleIndex + 1}.png`, { type: 'image/png' })
      
      // Prepare share text (NO ANSWER - prevent spoilers)
      const scoreMsg = won ? `Got it in ${cluesUsed} clue${cluesUsed > 1 ? 's' : ''}! 🎉` : 'Game Over 😔'
      const shareText = `Pehchaan Kaun? 🇮🇳 #${puzzleIndex + 1}
Category: ${category}
${emojiGrid}
${scoreMsg}
Kya tum pehchaan sakte ho? 🤔
Play at: pehchaankaun.vercel.app`
      
      // Check if Web Share API is supported (mobile)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        // MOBILE: Direct share sheet with image
        await navigator.share({
          title: 'Pehchaan Kaun?',
          text: shareText,
          files: [file]
        })
      } else {
        // DESKTOP: Download PNG first, then open WhatsApp Web
        // Step 1: Download the image
        const link = document.createElement('a')
        link.download = `pehchaan-kaun-${puzzleIndex + 1}.png`
        link.href = dataUrl
        link.click()
        
        // Step 2: Wait a bit for download to start, then open WhatsApp Web
        setTimeout(() => {
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
        }, 1500)
      }
    } catch (error) {
      console.error('Failed to share:', error)
      // Fallback: Just download the image
      await handleDownload()
    }
  }

  const copyText = () => {
    const scoreMsg = won ? `Got it in ${cluesUsed} clue${cluesUsed > 1 ? 's' : ''}! 🎉` : 'Game Over 😔'
    const shareText = `Pehchaan Kaun? 🇮🇳 #${puzzleIndex + 1}
Category: ${category}
${emojiGrid}
${scoreMsg}
Kya tum pehchaan sakte ho? 🤔
Play at: pehchaankaun.vercel.app`
    
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Copied to clipboard! 📋')
    }).catch(() => {
      alert('Failed to copy. Please try manually.')
    })
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      {/* Card */}
      <div
        ref={cardRef}
        style={{
          width: '480px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '30px',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#ffffff'
        }}
      >
        {/* Header Stripe */}
        <div style={{ display: 'flex', height: '8px', marginBottom: '20px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: '#ffffff' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* Title */}
        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', marginBottom: '15px' }}>
          PEHCHAAN KAUN CARD 🔥
        </div>

        {/* Puzzle Number - BIG BOLD (replaces answer) */}
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', margin: '10px 0 15px 0' }}>
          Puzzle #{puzzleIndex + 1}
        </div>

        {/* Category Badge */}
        <div style={{ 
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(100, 116, 139, 0.1))',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '13px',
          color: '#cbd5e1',
          fontWeight: '600',
          marginBottom: '15px'
        }}>
          {category}
        </div>

        {/* Mystery Line */}
        <div style={{ 
          fontSize: '14px', 
          color: '#FF9933', 
          fontWeight: '600', 
          margin: '10px 0 20px 0',
          fontStyle: 'italic'
        }}>
          Kya tum pehchaan sakte ho? 🤔
        </div>

        {/* Divider */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #334155, transparent)', margin: '20px 0' }} />

        {/* Score Label */}
        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', marginBottom: '10px' }}>
          TERA SCORE
        </div>

        {/* Score Value */}
        <div style={{ fontSize: '80px', fontWeight: 'bold', color: scoreColor, marginBottom: '5px', lineHeight: 1 }}>
          {scoreDisplay}
        </div>

        {/* Score Text */}
        <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '20px' }}>
          {scoreText}
        </div>

        {/* Emoji Grid */}
        <div style={{ fontSize: '40px', letterSpacing: '8px', margin: '20px 0', fontWeight: '700' }}>
          {emojiGrid}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: '20px 0' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🏆</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Better than {betterThan}%</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Players</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔥</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Streak: {stats.currentStreak}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Current</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🧠</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{won ? cluesUsed : '5'}/5</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Clues Used</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>👥</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{stats.totalPlayed}</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Played</div>
          </div>
        </div>

        {/* Roast Box */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.15), rgba(255, 107, 0, 0.1))',
          border: '2px solid rgba(255, 153, 51, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          margin: '20px 0',
          fontSize: '14px',
          color: '#FFD700',
          fontWeight: '600',
          lineHeight: 1.6
        }}>
          {roastLine}
        </div>

        {/* Footer */}
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '1px', marginTop: '25px' }}>
          pehchaankaun.vercel.app
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '25px', maxWidth: '480px', margin: '25px auto 0 auto' }}>
        <button
          onClick={copyText}
          style={{
            flex: 1,
            padding: '15px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s ease'
          }}
        >
          📋 Copy Text
        </button>
        <button
          onClick={shareWhatsApp}
          style={{
            flex: 1,
            padding: '15px',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          📱 WhatsApp
        </button>
      </div>
    </div>
  )
}
