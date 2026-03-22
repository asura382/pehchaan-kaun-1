"use client"

import { useState, useEffect, useRef } from 'react'

interface NotificationPopupProps {
  show: boolean  // controlled by parent after game ends
}

export default function NotificationPopup({ show }: NotificationPopupProps) {
  const [visible, setVisible] = useState(false)
  const midnightTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!show) return
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') return
    if (Notification.permission === 'denied') return

    // Check if user already said yes
    const notifGranted = localStorage.getItem('notifGranted')
    if (notifGranted === 'true') return

    // Check if user said baad mein and 3 days haven't passed
    const baadMeinDate = localStorage.getItem('notifBaadMein')
    if (baadMeinDate) {
      const daysSince = (Date.now() - parseInt(baadMeinDate)) / (1000 * 60 * 60 * 24)
      if (daysSince < 3) return  // less than 3 days, don't show
    }

    // Show after 1.5 seconds of result screen appearing
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [show])

  const handleYes = async () => {
    localStorage.setItem('notifGranted', 'true')
    localStorage.removeItem('notifBaadMein')
    setVisible(false)

    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      new Notification('Pehchaan Kaun? 🇮🇳', {
        body: 'Kal se roz midnight pe naya puzzle reminder milega! 🔥',
        icon: '/icon-192.png'
      })
      scheduleMidnightNotification()
    }
  }

  const handleLater = () => {
    // Save current timestamp
    localStorage.setItem('notifBaadMein', Date.now().toString())
    setVisible(false)
  }

  function scheduleMidnightNotification() {
    // Clear any existing timeout to prevent memory leaks
    if (midnightTimeoutRef.current) {
      clearTimeout(midnightTimeoutRef.current)
    }
    
    const now = new Date()
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 5, 0
    )
    const ms = midnight.getTime() - now.getTime()

    midnightTimeoutRef.current = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Pehchaan Kaun? 🇮🇳', {
          body: 'Aaj ka naya puzzle ready hai! Kya tum pehchaan sakte ho? 🔥',
          icon: '/icon-192.png'
        })
        scheduleMidnightNotification()
      }
    }, ms)
  }

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (midnightTimeoutRef.current) {
        clearTimeout(midnightTimeoutRef.current)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 9998,
        backdropFilter: 'blur(4px)'
      }} />

      {/* Popup */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '480px',
        background: 'linear-gradient(135deg, #141728, #1e2340)',
        border: '1px solid rgba(255,107,0,0.3)',
        borderRadius: '20px',
        padding: '24px 20px',
        zIndex: 9999,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)'
      }}>

        {/* Bell */}
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          margin: '0 auto 16px',
          boxShadow: '0 8px 20px rgba(255,107,0,0.35)'
        }}>
          🔔
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'Baloo 2, cursive',
          fontSize: '1.3rem',
          fontWeight: '800',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Kal ka puzzle miss mat karna!
        </div>

        {/* Description */}
        <div style={{
          fontSize: '0.88rem',
          color: '#aaa',
          textAlign: 'center',
          marginBottom: '22px',
          lineHeight: '1.7'
        }}>
          Har roz midnight pe naya puzzle aata hai 🇮🇳<br/>
          Notification on karo toh hum yaad dilayenge!
        </div>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={handleYes}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: 'Baloo 2, cursive',
              fontSize: '1.05rem',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: '0 6px 20px rgba(255,107,0,0.3)'
            }}
          >
            🔔 Haan, bilkul! Yaad dilao
          </button>

          <button
            onClick={handleLater}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#777',
              fontFamily: 'Baloo 2, cursive',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Baad mein poochna
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(50px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0) scale(1); 
          }
        }
      `}</style>
    </>
  )
}
