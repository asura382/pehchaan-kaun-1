'use client'

import React from 'react'

interface IOSInstructionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function IOSInstructionsModal({ isOpen, onClose }: IOSInstructionsModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div 
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
          border: '2px solid #FF9933',
          boxShadow: '0 20px 60px rgba(255, 153, 51, 0.3)'
        }}
      >
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#FFD700',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          📱 Install on iPhone
        </h2>

        <div style={{ marginBottom: '25px' }}>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '15px', lineHeight: 1.6 }}>
            To install Pehchaan Kaun? on your iPhone:
          </p>

          <ol style={{ 
            color: '#fff', 
            fontSize: '14px', 
            lineHeight: 2,
            paddingLeft: '20px'
          }}>
            <li style={{ marginBottom: '10px' }}>
              Tap the <strong style={{ color: '#FF9933' }}>Share button</strong> in Safari
              <span style={{ display: 'block', marginTop: '5px', fontSize: '24px' }}>📤</span>
            </li>
            
            <li style={{ marginBottom: '10px' }}>
              Scroll down and tap{' '}
              <strong style={{ color: '#FF9933' }}>&quot;Add to Home Screen&quot;</strong>
              <span style={{ display: 'block', marginTop: '5px', fontSize: '24px' }}>⬇️</span>
            </li>

            <li style={{ marginBottom: '10px' }}>
              Tap <strong style={{ color: '#FF9933' }}>&quot;Add&quot;</strong> in the top right corner
              <span style={{ display: 'block', marginTop: '5px', fontSize: '24px' }}>➕</span>
            </li>
          </ol>
        </div>

        <div style={{ 
          background: 'rgba(255, 153, 51, 0.1)',
          border: '1px solid rgba(255, 153, 51, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#FFD700', fontSize: '13px', margin: 0 }}>
            ℹ️ <strong>Note:</strong> iOS 16.4+ supports notifications. You&apos;ll be able to receive daily puzzle reminders!
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  )
}
