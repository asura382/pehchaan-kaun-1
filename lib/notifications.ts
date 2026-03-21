// Notification utilities for PWA

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function subscribeToNotifications() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported')
    return
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    console.log('Service Worker registered:', registration.scope)

    // Request permission
    const hasPermission = await requestNotificationPermission()
    if (!hasPermission) {
      console.log('Notification permission denied')
      return
    }

    // For push notifications, you'd need to set up a push server
    // This is a basic implementation for local notifications
    
    console.log('Notifications enabled!')
    return registration
  } catch (error) {
    console.error('Failed to register service worker:', error)
  }
}

export function scheduleDailyNotification(hour: number = 0, minute: number = 0) {
  // Schedule notification at midnight (or specified time)
  if (!('Notification' in window)) return

  const now = new Date()
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)
  
  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime()

  setTimeout(() => {
    showNotification({
      title: 'Pehchaan Kaun? 🇮🇳',
      body: 'New puzzle is live! Can you guess today\'s personality?'
    })

    // Schedule next day's notification
    scheduleDailyNotification(hour, minute)
  }, timeUntilNotification)

  console.log(`Notification scheduled for ${scheduledTime.toLocaleString()}`)
}

export function showNotification({ title, body }: { title: string; body: string }) {
  if (!('Notification' in window)) return

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      tag: 'pehchaan-kaun-daily'
    })
  }
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
}
