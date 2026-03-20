# Pehchaan Kaun? 🇮🇳

A daily Indian GK guessing game built with Next.js - similar to Wordle but focused on Indian personalities, things, and culture.

## Features

- **Daily Puzzle**: Same puzzle for everyone globally, changes at local midnight
- **35 Puzzles**: Covering cricketers, actors, freedom fighters, scientists, IPL teams, and more
- **Smart Guess Validation**: Case-insensitive, partial matching, first-letter hints
- **Streak Tracking**: Current and max streak using localStorage
- **Share Cards**: Beautiful result cards with PNG download and WhatsApp sharing
- **Responsive Design**: Works perfectly on mobile and desktop

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **html-to-image** - Share card generation
- **canvas-confetti** - Celebration effects
- **localStorage** - Stats persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Game Rules

1. You get one puzzle per day
2. Clues are revealed one by one (maximum 5)
3. Guess after each clue
4. Fewer clues = better score
5. Wrong guesses shake red, then show next clue after 2.5 seconds
6. Correct guess triggers confetti celebration
7. Share your result card!

## Project Structure

```
pehchaan-kaun/
├── app/
│   ├── page.tsx          # Main game component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── ResultCard.tsx    # Share card component
├── data/
│   └── puzzles.ts        # All 35 puzzles
├── lib/
│   ├── gameUtils.ts      # Game logic helpers
│   └── statsUtils.ts     # localStorage helpers
└── package.json
```

## Puzzle Examples

### Sachin Tendulkar (Indian Cricketer)
- I have played more than 200 Test matches
- I am from Mumbai
- I made my debut at age 16
- I scored 100 international centuries
- They call me the God of Cricket

### Shah Rukh Khan (Bollywood Actor)
- I started my career on television
- I was born in New Delhi
- I own an IPL team
- I am known as the King of Romance
- My initials are SRK

## How Puzzles Work

The daily puzzle is calculated using:

```typescript
const localDay = Math.floor(
  (now.getTime() - now.getTimezoneOffset() * 60000) / 86400000
)
const puzzle = puzzles[localDay % puzzles.length]
```

This ensures:
- Same puzzle for everyone globally on the same date
- Automatic rotation at local midnight
- Cycles through all 35 puzzles

## Share Card Format

```
PEHCHAAN KAUN CARD 🔥
[Answer Name]
[Category] • Puzzle #[N]
─────────────────────────
TERA SCORE
[2/5 or 0/5]
clues mein pehchana / nahi pehchana

[🟥][🟥][🟩][⬜][⬜]

[🏆 Better than X%] [🔥 Streak: N]
[🧠 X/5 clues] [👥 X played]

[Roast/Celebration Line]

pehchaankaun.vercel.app
```

## Dependencies

```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "typescript": "latest",
  "html-to-image": "latest",
  "canvas-confetti": "latest"
}
```

## License

MIT
