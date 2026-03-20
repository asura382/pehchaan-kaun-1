# Pehchaan Kaun? 🇮🇳

**Daily Indian General Knowledge Puzzle Game**

Test your Indian general knowledge with daily puzzles inspired by Wordle. Guess the personality, place, or thing before using all clues!

## 🎮 How to Play

1. **One puzzle per day** - Available at midnight in your local timezone
2. **Up to 5 clues** - Revealed one at a time
3. **Guess the answer** - Type your guess and submit
4. **Score system** - Fewer clues used = better score
5. **Track your streak** - Play daily to build and maintain streaks

## 🚀 Features

- ✅ Daily Indian GK puzzles (personalities, culture, institutions)
- ✅ Progressive clue reveal system
- ✅ Streak tracking with localStorage
- ✅ Beautiful share cards with roasts/celebrations
- ✅ Mobile-first responsive design
- ✅ Offline support with Service Workers
- ✅ High-performance Next.js architecture

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.0 (App Router)
- **Language:** TypeScript
- **Styling:** CSS with mobile-first approach
- **Dependencies:**
  - React 19.2.4
  - canvas-confetti (for celebrations)
  - html-to-image (for share cards)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Project Structure

```
pehchan-kaun/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main game page
├── components/            # Reusable React components
│   └── ResultCard.tsx     # Share result card component
├── data/                  # Game data
│   └── puzzles.ts         # Daily puzzle database
├── lib/                   # Utility functions
│   ├── gameUtils.ts       # Game logic utilities
│   └── statsUtils.ts      # Statistics tracking
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎨 Game Mechanics

### Scoring System
- **1 clue:** 5 points ⭐⭐⭐⭐⭐
- **2 clues:** 4 points ⭐⭐⭐⭐
- **3 clues:** 3 points ⭐⭐⭐
- **4 clues:** 2 points ⭐⭐
- **5 clues:** 1 point ⭐

### Statistics Tracked
- Current streak
- Maximum streak
- Total games played
- Total games won
- Last played date

## 🌐 Deployment

The app is optimized for deployment on Vercel:

```bash
# Automatic deployment
vercel deploy

# Or build and deploy manually
npm run build
vercel --prod
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## 📄 License

ISC

## 👏 Acknowledgments

- Inspired by Wordle
- Built with ❤️ for Indian GK enthusiasts

---

**Made with Next.js and React**
