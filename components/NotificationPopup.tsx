"use client"

import { useState, useEffect } from 'react'

export default function NotificationPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Wait 3 seconds then check if should show
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return
      if (!('Notification' in window)) return
      if (Notification.permission === 'granted') return
      if (Notification.permission === 'denied') return
      if (localStorage.getItem('notifAsked') === 'true') return
      
      setShow(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleYes = async () => {
    localStorage.setItem('notifAsked', 'true')
    setShow(false)
    
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      new Notification('Pehchaan Kaun? 🇮🇳', {
        body: 'Kal se roz midnight pe naya puzzle reminder milega! 🔥',
        icon: '/icon-192.png'
      })
      // Schedule daily notification
      scheduleMidnightNotification()
    }
  }

  const handleLater = () => {
    localStorage.setItem('notifAsked', 'true')
    setShow(false)
  }

  function scheduleMidnightNotification() {
    const now = new Date()
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 5, 0  // 12:05 AM
    )
    const msUntilMidnight = midnight.getTime() - now.getTime()
    
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Pehchaan Kaun? 🇮🇳', {
          body: 'Aaj ka naya puzzle ready hai! Kya tum pehchaan sakte ho? 🔥',
          icon: '/icon-192.png'
        })
        scheduleMidnightNotification()
      }
    }, msUntilMidnight)
  }

  if (!show) return null

  return (
    <>
      {/* Dark overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 9998,
        backdropFilter: 'blur(4px)'
      }} />

      {/* Popup card */}
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
        {/* Bell icon */}
        <div style={{
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #FF6B00, #FF9F43)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          margin: '0 auto 16px',
          boxShadow: '0 8px 20px rgba(255,107,0,0.3)'
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
          Roz ka puzzle yaad rakhein?
        </div>

        {/* Description */}
        <div style={{
          fontSize: '0.88rem',
          color: '#aaa',
          textAlign: 'center',
          marginBottom: '22px',
          lineHeight: '1.6'
        }}>
          Har roz midnight pe naya puzzle aata hai 🇮🇳
          <br/>
          Notification on karo toh miss mat karo!
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
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.02em'
            }}
          >
            🔔 Haan, reminder chahiye!
          </button>

          <button
            onClick={handleLater}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#888',
              fontFamily: 'Baloo 2, cursive',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Baad mein
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0); 
          }
        }
      `}</style>
    </>
  )
}
