'use client'

import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIosDevice)

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Check if user hasn't dismissed before
      const dismissed = localStorage.getItem('install-prompt-dismissed')
      if (!dismissed) {
        setShowInstall(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstall(false)
      console.log('User accepted the install prompt')
    }
    
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstall(false)
    localStorage.setItem('install-prompt-dismissed', 'true')
  }

  if (!showInstall) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
      padding: '15px 25px',
      borderRadius: '15px',
      boxShadow: '0 10px 40px rgba(255, 153, 51, 0.4)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      maxWidth: '90%',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, flex: 1 }}>
        📱 Install Pehchaan Kaun? for better experience!
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          style={{
            background: '#fff',
            border: 'none',
            color: '#FF9933',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700
          }}
        >
          Install
        </button>
      </div>
    </div>
  )
}
