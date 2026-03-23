"use client"
import { useState } from 'react'

interface UsernameModalProps {
  onSave: (name: string) => void
}

export default function UsernameModal({ onSave }: UsernameModalProps) {
  const [name, setName] = useState('')

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length < 2) return
    localStorage.setItem('pkUsername', trimmed)
    onSave(trimmed)
  }

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)',
        zIndex: 9998, backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #141728, #1e2340)',
          border: '1px solid rgba(255,107,0,0.3)',
          borderRadius: '20px', padding: '32px 24px',
          maxWidth: '380px', width: '100%',
          textAlign: 'center',
          animation: 'badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✏️</div>
          <div style={{
            fontFamily: 'Baloo 2, cursive',
            fontSize: '1.4rem', fontWeight: '800',
            color: '#fff', marginBottom: '8px'
          }}>
            Apna naam batao!
          </div>
          <div style={{
            fontSize: '0.85rem', color: '#888',
            marginBottom: '20px', lineHeight: '1.5'
          }}>
            Yeh naam challenge card pe dikhega
            jab tum doston ko challenge karoge
          </div>
          <input
            type="text"
            placeholder="Tumhara naam..."
            maxLength={20}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSave()}
            style={{
              width: '100%', padding: '14px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(255,107,0,0.3)',
              borderRadius: '12px', color: '#fff',
              fontSize: '1rem', marginBottom: '14px',
              fontFamily: 'Poppins, sans-serif',
              outline: 'none', boxSizing: 'border-box'
            }}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={name.trim().length < 2}
            style={{
              width: '100%', padding: '14px',
              background: name.trim().length >= 2
                ? 'linear-gradient(135deg, #FF6B00, #FF9F43)'
                : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontFamily: 'Baloo 2, cursive',
              fontSize: '1rem', fontWeight: '700',
              cursor: name.trim().length >= 2 ? 'pointer' : 'not-allowed'
            }}
          >
            Challenge Karne Do! 🎯
          </button>
        </div>
      </div>
    </>
  )
}
