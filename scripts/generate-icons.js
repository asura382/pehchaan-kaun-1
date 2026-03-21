import fs from 'fs'
import path from 'path'
import { createCanvas } from 'canvas'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Function to create icon with Indian flag colors
function createIcon(size, filename) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background - dark blue
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, size, size)

  // Outer circle
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  gradient.addColorStop(0, '#FF9933')
  gradient.addColorStop(1, '#FF6B00')
  
  ctx.beginPath()
  ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Inner text - "PK" in white
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${size * 0.4}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('PK', size/2, size/2)

  // Add small Indian flag at bottom
  const stripeHeight = size * 0.15
  const startY = size - stripeHeight - 5
  
  // Saffron stripe
  ctx.fillStyle = '#FF9933'
  ctx.fillRect(10, startY, size - 20, stripeHeight / 3)
  
  // White stripe
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(10, startY + stripeHeight / 3, size - 20, stripeHeight / 3)
  
  // Green stripe
  ctx.fillStyle = '#138808'
  ctx.fillRect(10, startY + (stripeHeight / 3) * 2, size - 20, stripeHeight / 3)

  // Save the file
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(publicDir, filename), buffer)
  console.log(`Created ${filename} (${size}x${size})`)
}

// Create both icon sizes
createIcon(192, 'icon-192.png')
createIcon(512, 'icon-512.png')

console.log('\n✅ Icons created successfully!')
console.log('📍 Location: public/icon-192.png and public/icon-512.png')
