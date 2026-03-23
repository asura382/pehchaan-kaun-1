'use client'

import React, { useState, useEffect, useRef } from 'react'
import { puzzles, Puzzle } from '../data/puzzles'
import { getTodayPuzzle, checkGuess, getNextPuzzleTime, formatTime, getEmojiGrid } from '../lib/gameUtils'
import { sundayPuzzles, getSundayPuzzle, isSunday } from '../data/specialPuzzles'
import { Stats, getStats, updateStatsAfterGame, hasPlayedToday } from '../lib/statsUtils'
import { Badge, checkNewBadges } from '../lib/badges'
import { submitToLeaderboard } from '@/lib/supabase'
import { getOrCreatePlayerId, getDisplayName } from '@/lib/playerUtils'
import ResultCard from '../components/ResultCard'
import InstallPrompt from '../components/InstallPrompt'
import NotificationPopup from '../components/NotificationPopup'
import BadgePopup from '../components/BadgePopup'
import BadgeShelf from '../components/BadgeShelf'
import ChallengeButton from '@/components/ChallengeButton'
import ChallengeBanner from '@/components/ChallengeBanner'
import UsernameModal from '@/components/UsernameModal'
import confetti from 'canvas-confetti'

export default function Home() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0)
  const [isSpecialPuzzle, setIsSpecialPuzzle] = useState(false)
  const [specialPuzzleData, setSpecialPuzzleData] = useState<{ puzzle: any; index: number } | null>(null)
  const [currentClueIndex, setCurrentClueIndex] = useState(0)
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | 'hint'; message: string } | null>(null)
  const [showLoadingText, setShowLoadingText] = useState(false)
  const [stats, setStats] = useState<Stats>({ currentStreak: 0, maxStreak: 0, totalPlayed: 0, totalWon: 0, lastPlayedDate: null, lastPuzzleIndex: -1, lastResult: null, lastStreakDate: null, earnedBadges: [], oneClueWins: 0, categoryWins: {}, consecutiveLosses: 0 })
  const [timeUntilNext, setTimeUntilNext] = useState(getNextPuzzleTime())
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [showBadgePopup, setShowBadgePopup] = useState(false)
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [challengeData, setChallengeData] = useState<{
    challengerName: string
    challengerScore: number
    challengerWon: boolean
    puzzleIndex: number
    challengerId?: string
  } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Load username from localStorage
    const saved = localStorage.getItem('pkUsername')
    if (saved) setUsername(saved)
    
    // Load or generate unique Player ID
    const savedPlayerId = localStorage.getItem('pkPlayerId')
    if (savedPlayerId) {
      setPlayerId(savedPlayerId)
    } else {
      // Generate new unique Player ID: PK-M9B2K4-X3F7
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let id = 'PK-'
      
      // First part: 6 characters
      for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      id += '-'
      
      // Second part: 4 characters
      for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      setPlayerId(id)
      localStorage.setItem('pkPlayerId', id)
      console.log('Generated new Player ID:', id)
    }

    // Check for challenge URL params
    const params = new URLSearchParams(window.location.search)
    const challenge = params.get('challenge')
    const challenger = params.get('challenger')
    const score = params.get('score')
    const won = params.get('won')
    const challengerId = params.get('challengerId')

    if (challenge && challenger && score) {
      setChallengeData({
        challengerName: challenger,
        challengerScore: parseInt(score),
        challengerWon: won === '1',
        puzzleIndex: parseInt(challenge),
        challengerId: challengerId || undefined
      })
      // Clear URL params without reload
      window.history.replaceState({}, '', window.location.pathname)
    }

    // Check if today is Sunday and load special puzzle
    if (isSunday()) {
      const { puzzle, index } = getSundayPuzzle()
      setCurrentPuzzle(puzzle as Puzzle)
      setPuzzleIndex(index)
      setIsSpecialPuzzle(true)
      setSpecialPuzzleData({ puzzle, index })
      
      console.log('Loaded Sunday puzzle:', puzzle.answer)
      console.log('Sunday puzzle index:', index)
      
      const played = hasPlayedToday(index)
      console.log('Has played today (Sunday):', played, 'Index:', index)
      
      if (played) {
        const savedStats = getStats()
        if (savedStats.lastResult) {
          setGameWon(savedStats.lastResult.won)
          setGameOver(true)
        }
      }
    } else {
      // Regular daily puzzle
      const { puzzle, index } = getTodayPuzzle(puzzles)
      setCurrentPuzzle(puzzle)
      setPuzzleIndex(index)
      setIsSpecialPuzzle(false)
      setSpecialPuzzleData(null)
      
      console.log('Loaded puzzle:', puzzle.answer)
      console.log('Puzzle index:', index)
      
      const played = hasPlayedToday(index)
      console.log('Has played today:', played, 'Index:', index)
      
      if (played) {
        const savedStats = getStats()
        if (savedStats.lastResult) {
          setGameWon(savedStats.lastResult.won)
          setGameOver(true)
        }
      }
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilNext(getNextPuzzleTime())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (gameWon) {
      triggerConfetti()
    }
  }, [gameWon])

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF9933', '#ffffff', '#138808', '#FFD700']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF9933', '#ffffff', '#138808', '#FFD700']
      })
    }, 250)
  }

  const handleGameEnd = async (won: boolean, cluesUsed: number) => {
    console.log('=== GAME ENDED ===')
    console.log('Won:', won)
    console.log('Clues used:', cluesUsed)
    console.log('Current puzzle:', currentPuzzle?.answer)
    console.log('Puzzle index:', puzzleIndex)

    // Update stats
    const updatedStats = updateStatsAfterGame(
      won, cluesUsed, puzzleIndex,
      currentPuzzle?.category || '', []
    )
    console.log('Stats updated:', updatedStats)

    // Check badges
    const newBadges = checkNewBadges(
      updatedStats, cluesUsed, won,
      currentPuzzle?.category || ''
    )
    console.log('New badges:', newBadges)

    if (newBadges.length > 0) {
      updatedStats.earnedBadges = [
        ...(updatedStats.earnedBadges || []),
        ...newBadges.map((b: any) => b.id)
      ]
      localStorage.setItem(
        'pehchaanKaunStats',
        JSON.stringify(updatedStats)
      )
      setTimeout(() => setNewBadges(newBadges), 2000)
    }

    // Submit to leaderboard
    try {
      const { getOrCreatePlayerId, getDisplayName } = 
        await import('@/lib/playerUtils')
      const { submitToLeaderboard } = 
        await import('@/lib/supabase')
      
      const playerId = getOrCreatePlayerId()
      const displayName = getDisplayName() || 'Anonymous'
      
      console.log('=== LEADERBOARD SUBMIT ===')
      console.log('Player ID:', playerId)
      console.log('Display Name:', displayName)
      
      await submitToLeaderboard(
        playerId, displayName, updatedStats
      )
      console.log('Leaderboard submit completed')
    } catch (e) {
      console.error('Leaderboard submit error:', e)
    }

    setGameFinished(true)
  }

  const handleSubmitGuess = async () => {
    if (!currentPuzzle || isLoading || !guess.trim()) return

    setIsLoading(true)
    const normalizedGuess = guess.trim()
    setGuesses([...guesses, normalizedGuess])
    
    const result = checkGuess(normalizedGuess, currentPuzzle.answer)

    if (result === 'correct') {
      setFeedback({ type: 'correct', message: `✅ Sahi Jawab! It's ${currentPuzzle.answer}!` })
      setGameWon(true)
      setGameOver(true)
      
      // Call centralized game end handler
      await handleGameEnd(true, currentClueIndex + 1)
      
      // Show badge popup after 2 seconds if new badges earned
      const earnedBadges = checkNewBadges(
        getStats(), currentClueIndex + 1, true, currentPuzzle.category
      )
      if (earnedBadges.length > 0) {
        setTimeout(() => {
          setNewBadges(earnedBadges)
          setShowBadgePopup(true)
        }, 2000)
      }
      
      setTimeout(() => {
        setFeedback(null)
      }, 2000)
    } else if (result === 'hint') {
      setFeedback({ type: 'hint', message: 'Bahut close! Pehla letter sahi hai!' })
      setGuess('')
      inputRef.current?.focus()
      setIsLoading(false)
      
      setTimeout(() => {
        setFeedback(null)
      }, 2000)
    } else {
      // Wrong guess
      if (inputRef.current) {
        inputRef.current.classList.add('shake')
        setTimeout(() => {
          inputRef.current?.classList.remove('shake')
        }, 500)
      }
      
      setFeedback({ type: 'wrong', message: 'Galat! Agla clue dekho...' })
      
      setTimeout(() => {
        setShowLoadingText(true)
        
        const nextClueIndex = currentClueIndex + 1
        
        if (nextClueIndex >= 5) {
          // Game over
          setTimeout(async () => {
            setGameOver(true)
            
            // Call centralized game end handler
            await handleGameEnd(false, 5)
            
            // Show badge popup if new badges earned
            const earnedBadges = checkNewBadges(
              getStats(), 5, false, currentPuzzle.category
            )
            if (earnedBadges.length > 0) {
              setNewBadges(earnedBadges)
              setShowBadgePopup(true)
            }
          }, 1000)
        } else {
          // Show next clue
          setTimeout(() => {
            setShowLoadingText(false)
            setCurrentClueIndex(nextClueIndex)
            setGuess('')
            setFeedback(null)
            setIsLoading(false)
            inputRef.current?.focus()
          }, 1000)
        }
      }, 1500)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmitGuess()
    }
  }

  const openHowToPlay = () => setShowHowToPlay(true)
  const closeHowToPlay = () => setShowHowToPlay(false)
  const openStats = () => {
    // Read fresh stats from localStorage every time modal opens
    const raw = localStorage.getItem('pehchaanKaunStats')
    const freshStats = raw ? JSON.parse(raw) : {
      totalPlayed: 0,
      totalWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      earnedBadges: [],
      oneClueWins: 0,
      categoryWins: {},
      consecutiveLosses: 0
    }
    console.log('Stats modal - Stats from localStorage:', freshStats)
    setStats(freshStats)
    setShowStats(true)
  }
  const closeStats = () => setShowStats(false)

  const handleNotificationRequest = async () => {
    if (!('Notification' in window)) {
      alert('Tera browser notifications support nahi karta')
      return
    }
    if (Notification.permission === 'granted') {
      alert('Notifications pehle se on hain! ✅')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      new Notification('Pehchaan Kaun? 🇮🇳', {
        body: 'Notifications on! Roz midnight pe puzzle reminder milega 🔥',
        icon: '/icon-192.png'
      })
    }
  }

  if (!currentPuzzle) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
  }

  const winPercentage = stats.totalPlayed > 0 ? Math.round((stats.totalWon / stats.totalPlayed) * 100) : 0

  return (
    <div className="container">
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '25px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 900,
            background: 'linear-gradient(45deg, #FF9933, #ffffff, #138808)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Pehchaan Kaun? 🇮🇳
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '5px' }}>Daily Indian GK Challenge</div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            background: 'rgba(255, 153, 51, 0.2)',
            padding: '8px 15px',
            borderRadius: '20px',
            border: '2px solid #FF9933',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            <span style={{ fontSize: '1.3rem', animation: 'pulse 1s infinite' }}>🔥</span>
            <span>{stats.currentStreak}</span>
          </div>
          
          <button onClick={handleNotificationRequest} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
          }} title="Enable Notifications">🔔</button>
          
          <button onClick={openHowToPlay} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
          }}>📖</button>
          
          <button onClick={openStats} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
          }}>📊</button>
          
          <button
            onClick={() => window.location.href = '/profile'}
            title="My Profile"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
          >👤</button>
          
          <button
            onClick={() => window.location.href = '/leaderboard'}
            title="Leaderboard"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
          >🏆</button>
        </div>
      </header>

      <InstallPrompt />
      <NotificationPopup show={gameFinished} />
      {showBadgePopup && (
        <BadgePopup 
          badges={newBadges} 
          onClose={() => {
            setShowBadgePopup(false)
            setNewBadges([])
          }} 
        />
      )}

      {/* Challenge Banner */}
      {challengeData && (
        <ChallengeBanner {...challengeData} />
      )}

      {/* Sunday Special Banner */}
      {isSpecialPuzzle && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '16px',
          padding: '18px 20px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)',
          animation: 'goldenGlow 2s ease-in-out infinite'
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🌟</div>
          <div style={{
            fontFamily: 'Baloo 2, cursive',
            fontSize: '1.3rem',
            fontWeight: '800',
            color: '#FFD700',
            marginBottom: '6px',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }}>
            SPECIAL SUNDAY CHALLENGE 🎯
          </div>
          <div style={{ fontSize: '0.9rem', color: '#FFF8DC', marginBottom: '8px' }}>
            Extra cryptic clues • Harder puzzle • Special badge on win!
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: '#FFA500',
            fontWeight: '600',
            fontStyle: 'italic'
          }}>
            💡 Hint: Think beyond the obvious - connections are deeper!
          </div>
        </div>
      )}

      {/* Puzzle Info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFD700' }}>
          Puzzle #{puzzleIndex + 1}
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '0.95rem',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(255, 153, 51, 0.4)'
        }}>
          {currentPuzzle.category}
        </div>
      </div>

      {/* Timer */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '20px',
        padding: '12px',
        background: 'linear-gradient(90deg, rgba(255, 153, 51, 0.15), rgba(255, 255, 255, 0.1), rgba(19, 136, 8, 0.15))',
        borderRadius: '12px',
        fontSize: '0.95rem',
        color: '#FFD700',
        fontWeight: 600,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        Next puzzle in: <span id="countdown">{formatTime(timeUntilNext)}</span>
      </div>

      {/* Game Area */}
      {!gameOver ? (
        <>
          {/* Clues */}
          <div style={{ marginBottom: '25px' }}>
            {currentPuzzle.clues.slice(0, currentClueIndex + 1).map((clue, index) => (
              <div key={index} className="slide-in" style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                padding: '25px',
                borderRadius: '15px',
                marginBottom: '15px',
                borderLeft: '5px solid #FF9933',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#FFD700', marginBottom: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Clue {index + 1}
                </div>
                <div style={{ fontSize: '1.15rem', lineHeight: 1.6 }}>
                  {clue}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ marginBottom: '25px' }}>
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your guess..."
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.2rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '2px solid rgba(255, 153, 51, 0.3)',
                borderRadius: '15px',
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
                marginBottom: '15px',
                transition: 'all 0.3s ease',
                fontWeight: 600,
                outline: 'none'
              }}
            />
            <button
              ref={btnRef}
              onClick={handleSubmitGuess}
              disabled={isLoading || !guess.trim()}
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '1.2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                border: 'none',
                borderRadius: '15px',
                color: '#fff',
                cursor: isLoading || !guess.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(255, 153, 51, 0.4)',
                opacity: isLoading || !guess.trim() ? 0.5 : 1
              }}
            >
              {isLoading ? 'Processing...' : 'Submit Guess'}
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="bounce" style={{
              padding: feedback.type === 'correct' ? '20px' : '18px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: feedback.type === 'correct' ? '1.2rem' : '1.1rem',
              background: feedback.type === 'correct' 
                ? 'linear-gradient(135deg, rgba(46, 213, 115, 0.3), rgba(46, 213, 115, 0.1))'
                : feedback.type === 'hint'
                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.1))'
                : 'linear-gradient(135deg, rgba(255, 71, 87, 0.3), rgba(255, 71, 87, 0.1))',
              border: feedback.type === 'correct' 
                ? '3px solid #2ed573'
                : feedback.type === 'hint'
                ? '3px solid #FFD700'
                : '3px solid #ff4757',
              color: feedback.type === 'correct'
                ? '#2ed573'
                : feedback.type === 'hint'
                ? '#FFD700'
                : '#ff4757'
            }}>
              {feedback.message}
              {showLoadingText && <div className="pulse" style={{ marginTop: '10px' }}>Loading next clue...</div>}
            </div>
          )}
        </>
      ) : (
        /* Result */
        <>
          <ResultCard
            answer={currentPuzzle.answer}
            category={currentPuzzle.category}
            puzzleIndex={puzzleIndex}
            won={gameWon}
            cluesUsed={gameWon ? currentClueIndex + 1 : 5}
            stats={stats}
          />
          
          {/* Challenge Friend Button */}
          <div style={{ maxWidth: '480px', margin: '20px auto' }}>
            <ChallengeButton
              puzzleIndex={puzzleIndex}
              cluesUsed={gameWon ? currentClueIndex + 1 : 5}
              won={gameWon}
              username={username}
              playerId={playerId}
              onUsernameSet={(name) => setUsername(name)}
            />
          </div>
        </>
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className={`modal-overlay ${showHowToPlay ? 'active' : ''}`} onClick={closeHowToPlay}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #FF9933, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 900
            }}>
              How to Play / कैसे खेलें
            </h2>
            <div style={{ lineHeight: 1.8, color: '#ddd' }}>
              <p>🎯 <strong>Har roz ek naya puzzle</strong> - Every day a new puzzle</p>
              <br />
              <p>💡 <strong>Clues dekho, naam guess karo</strong> - Watch clues and guess the name</p>
              <br />
              <p>⭐ <strong>Jitne kam clues utna better score</strong> - Fewer clues = better score</p>
              <br />
              <p>📤 <strong>Apna score share karo</strong> - Share your score with friends</p>
              <br />
              <p><strong>Rules:</strong></p>
              <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                <li>You get 5 clues maximum</li>
                <li>Type your guess after each clue</li>
                <li>Correct answer = Game won! 🎉</li>
                <li>5 wrong guesses = Game over 😔</li>
                <li>Same puzzle for everyone today</li>
                <li>Puzzle changes at local midnight</li>
              </ul>
            </div>
            <button onClick={closeHowToPlay} style={{
              marginTop: '20px',
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(255, 153, 51, 0.4)'
            }}>Got it!</button>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className={`modal-overlay ${showStats ? 'active' : ''}`} onClick={closeStats}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #FF9933, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 900
            }}>
              📊 Your Stats
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', margin: '20px 0' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(45deg, #FF9933, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {stats.totalPlayed}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>Games Played</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(45deg, #FF9933, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {winPercentage}%
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>Win Rate</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(45deg, #FF9933, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  🔥 {stats.currentStreak}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>Current Streak</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(45deg, #FF9933, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  🏆 {stats.maxStreak}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '5px' }}>Max Streak</div>
              </div>
            </div>
            
            <BadgeShelf earnedBadgeIds={stats.earnedBadges || []} />
            
            <button onClick={closeStats} style={{
              marginTop: '20px',
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(255, 153, 51, 0.4)'
            }}>Close</button>
          </div>
        </div>
      )}
      
      <NotificationPopup show={gameFinished} />

      <style jsx global>{`
        @keyframes goldenGlow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 40px rgba(255, 215, 0, 0.2);
          }
        }
      `}</style>
    </div>
  )
}
