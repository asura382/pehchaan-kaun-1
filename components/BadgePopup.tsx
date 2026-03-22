"use client"

import { useState, useEffect } from 'react'
import { Badge, getRarityColor } from '@/lib/badges'

interface BadgePopupProps {
  badges: Badge[]
  onClose: () => void
}

export default function BadgePopup({ badges, onClose }: BadgePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (badges.length === 0) return
    setTimeout(() => setVisible(true), 300)
  }, [badges])

  if (badges.length === 0 || !visible) return null

  const badge = badges[currentIndex]
  const rarityColor = getRarityColor(badge.rarity)
  const isLast = currentIndex === badges.length - 1

  const handleNext = () => {
    if (isLast) {
      onClose()
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleNext}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        {/* Badge Card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: `linear-gradient(135deg, #141728, #1e2340)`,
            border: `2px solid ${rarityColor}`,
            borderRadius: '24px',
            padding: '36px 28px',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            boxShadow: `0 0 40px ${rarityColor}40, 0 20px 60px rgba(0,0,0,0.5)`,
            animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Glow background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, ${rarityColor}20 0%, transparent 70%)`,
            pointerEvents: 'none'
          }} />

          {/* Emoji */}
          <div style={{
            fontSize: '72px',
            marginBottom: '16px',
            filter: `drop-shadow(0 0 20px ${rarityColor})`,
            animation: 'emojiPulse 1.5s ease-in-out infinite'
          }}>
            {badge.emoji}
          </div>

          {/* Name */}
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: rarityColor,
            textShadow: `0 0 20px ${rarityColor}80`
          }}>
            {badge.name}
          </h2>

          {/* Hindi Name */}
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            color: '#ffffff90',
            fontFamily: 'system-ui'
          }}>
            {badge.nameHindi}
          </p>

          {/* Description */}
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#ffffffcc',
            lineHeight: '1.5'
          }}>
            {badge.description}
          </p>

          {/* Rarity Badge */}
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            background: `${rarityColor}20`,
            border: `1px solid ${rarityColor}`,
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: rarityColor,
            textTransform: 'uppercase'
          }}>
            {badge.rarity}
          </div>

          {/* Progress indicator */}
          {badges.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px'
            }}>
              {badges.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === currentIndex ? rarityColor : '#ffffff40',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}

          {/* Click hint */}
          <p style={{
            position: 'absolute',
            bottom: '8px',
            left: 0,
            right: 0,
            fontSize: '12px',
            color: '#ffffff60',
            textAlign: 'center'
          }}>
            {isLast ? 'Click anywhere to continue' : 'Click for next badge'}
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes badgePop {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-10deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes emojiPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  )
}
