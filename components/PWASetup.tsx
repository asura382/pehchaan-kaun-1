'use client'

import { useEffect, useState } from 'react'
import { subscribeToNotifications, scheduleDailyNotification, isIOS } from '../lib/notifications'
import IOSInstructionsModal from './IOSInstructionsModal'

export default function PWASetup() {
  const [showIOSSetup, setShowIOSSetup] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    // Auto-enable notifications if permission already granted
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true)
      scheduleDailyNotification(0, 0) // Midnight
    }
  }, [])

  const handleEnableNotifications = async () => {
    if (isIOS()) {
      setShowIOSSetup(true)
      return
    }

    await subscribeToNotifications()
    setNotificationsEnabled(true)
    scheduleDailyNotification(0, 0) // Schedule for midnight
  }

  return (
    <>
      <div style={{ 
        textAlign: 'center',
        padding: '20px',
        background: 'rgba(255, 153, 51, 0.1)',
        borderRadius: '15px',
        border: '2px solid #FF9933',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#FFD700',
          marginBottom: '15px'
        }}>
          📱 Install App & Get Notified
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleEnableNotifications}
            disabled={notificationsEnabled}
            style={{
              padding: '12px 20px',
              background: notificationsEnabled ? '#10b981' : 'linear-gradient(135deg, #FF9933, #FF6B00)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: notificationsEnabled ? 'default' : 'pointer',
              fontSize: '14px',
              opacity: notificationsEnabled ? 0.7 : 1
            }}
          >
            {notificationsEnabled ? '✅ Notifications Enabled' : '🔔 Enable Daily Notifications'}
          </button>

          {isIOS() && (
            <button
              onClick={() => setShowIOSSetup(true)}
              style={{
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #FF9933',
                borderRadius: '10px',
                color: '#FF9933',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📖 iOS Install Guide
            </button>
          )}
        </div>

        <p style={{ 
          fontSize: '12px', 
          color: '#94a3b8', 
          marginTop: '15px',
          lineHeight: 1.5
        }}>
          💡 Install Pehchaan Kaun? to your home screen for a native app experience!
        </p>
      </div>

      <IOSInstructionsModal 
        isOpen={showIOSSetup} 
        onClose={() => setShowIOSSetup(false)} 
      />
    </>
  )
}
