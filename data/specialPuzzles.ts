export interface SpecialPuzzle {
  answer: string
  category: string
  clues: string[]
  difficulty: 'hard' | 'extreme'
  funFact: string
}

export const sundayPuzzles: SpecialPuzzle[] = [
  {
    answer: "Chandragupta Maurya",
    category: "Ancient Indian Ruler",
    difficulty: "hard",
    funFact: "Chandragupta renounced his empire at its peak and became a Jain monk, eventually fasting to death in Karnataka.",
    clues: [
      "A great mentor guided me from obscurity to power",
      "I built an empire that stretched from Afghanistan to Bengal",
      "I defeated the generals left behind by a famous Greek conqueror",
      "I gave up everything at the height of my glory for spiritual peace",
      "My advisor wrote the most famous book on statecraft in ancient India"
    ]
  },
  {
    answer: "Aryabhata",
    category: "Ancient Indian Scientist",
    difficulty: "hard",
    funFact: "Aryabhata calculated the length of a year as 365.358 days - just 3 minutes and 20 seconds off from the modern calculation.",
    clues: [
      "I was born in 476 CE and worked at a great ancient university",
      "I explained why the moon has no light of its own",
      "I calculated something to 4 decimal places that mathematicians still use",
      "I said the Earth spins on its axis 1000 years before Europeans believed it",
      "India's first satellite was named after me"
    ]
  },
  {
    answer: "Dara Shikoh",
    category: "Mughal Prince",
    difficulty: "extreme",
    funFact: "Dara Shikoh translated 52 Upanishads into Persian, calling it the Sirr-e-Akbar. He believed the Quran referred to the Upanishads as the 'hidden book'.",
    clues: [
      "I was the eldest son of a Mughal emperor who built a famous monument",
      "I translated ancient Hindu texts into Persian to find common truth",
      "My younger brother defeated me in a war of succession",
      "I was executed on charges of apostasy in 1659",
      "Historians say had I won India's history might have been very different"
    ]
  },
  {
    answer: "Razia Sultana",
    category: "Medieval Indian Ruler",
    difficulty: "hard",
    funFact: "Razia Sultana refused to wear a veil, rode elephants in open court, and held public audiences without purdah - all extraordinary for a ruler of her time.",
    clues: [
      "My father chose me over my brothers to succeed him",
      "I was the first and only woman to rule the Delhi Sultanate",
      "I refused to follow the customs expected of women rulers",
      "Turkish nobles conspired against me because of my policies",
      "I ruled for about 3 years before being overthrown in 1240"
    ]
  },
  {
    answer: "Vikramaditya",
    category: "Ancient Indian Ruler",
    difficulty: "extreme",
    funFact: "The Vikram Samvat calendar still used in India today was started by Vikramaditya after he defeated the Shakas in 57 BCE.",
    clues: [
      "A calendar system used in India today is named after my era",
      "Nine great scholars called Navaratnas adorned my court",
      "Kalidasa the great poet was one of my court gems",
      "I ruled from Ujjain and was known for wisdom and justice",
      "My name became a title meaning Sun of Valor in Sanskrit"
    ]
  },
  {
    answer: "Kalpana Chawla",
    category: "Indian-American Astronaut",
    difficulty: "hard",
    funFact: "Kalpana Chawla logged 376 hours in space. An asteroid, a NASA supercomputer, a meteorological satellite and countless schools are named after her in India.",
    clues: [
      "I grew up watching small aircraft take off from a nearby airstrip",
      "I was the first woman of Indian origin to go to space",
      "I completed my first mission in 1997 spending 376 hours in orbit",
      "My second mission ended in tragedy over Texas in February 2003",
      "I told students: the path from dreams to success exists and you have the strength to walk it"
    ]
  },
  {
    answer: "Tipu Sultan",
    category: "Indian Ruler",
    difficulty: "hard",
    funFact: "Tipu Sultan's rocket technology was so advanced that it inspired William Congreve to develop the Congreve rocket used by British forces for decades after.",
    clues: [
      "My father built an army that shocked the British East India Company",
      "I developed iron-cased rockets that inspired European military technology",
      "I sent ambassadors to France seeking alliance against the British",
      "I died defending my capital Srirangapatna in 1799",
      "They call me the Tiger of a southern Indian kingdom"
    ]
  },
  {
    answer: "Savitribai Phule",
    category: "Indian Social Reformer",
    difficulty: "hard",
    funFact: "Savitribai Phule is considered the first female teacher of India. She would carry an extra sari to school because upper caste people would throw dung and stones at her.",
    clues: [
      "I was born in Maharashtra in 1831 into a lower caste family",
      "My husband and I opened the first school for girls in India in 1848",
      "People threw stones and dung at me as I walked to school",
      "I was the first woman teacher in modern India",
      "I wrote poetry about equality and fought against caste discrimination"
    ]
  },
  {
    answer: "Birsa Munda",
    category: "Freedom Fighter",
    difficulty: "hard",
    funFact: "Birsa Munda was just 25 years old when he died in British custody. The Jharkhand state of India was created on his birth anniversary - November 15.",
    clues: [
      "I was born in 1875 in what is now Jharkhand",
      "I led the Munda tribe in revolt against British land policies",
      "I was called Dharti Abba meaning Father of the Earth",
      "I declared myself a divine messenger and gathered thousands",
      "Jharkhand state was created on my birth anniversary"
    ]
  },
  {
    answer: "Maharshi Karve",
    category: "Indian Social Reformer",
    difficulty: "extreme",
    funFact: "Dhondo Keshav Karve married a widow in 1893 when it was considered a sin. He then dedicated his entire life to widow remarriage and women's education, working until age 104.",
    clues: [
      "I was born in Maharashtra in 1858",
      "I married a widow at a time when it was considered deeply shameful",
      "I founded a university for women near Pune",
      "I received the Bharat Ratna on my 100th birthday",
      "I worked for women's rights until I was over 100 years old"
    ]
  },
  {
    answer: "Sister Nivedita",
    category: "Indian Social Reformer",
    difficulty: "extreme",
    funFact: "Margaret Noble gave up her life in Ireland to come to India, became Swami Vivekananda's disciple, and designed the emblem of the Ramakrishna Mission still used today.",
    clues: [
      "I was born Margaret Elizabeth Noble in Ireland in 1867",
      "I came to India after hearing Swami Vivekananda speak in London",
      "I opened a school for girls in Kolkata in a poor neighborhood",
      "I designed the emblem of the Ramakrishna Mission",
      "Vivekananda named me Nivedita meaning the dedicated one"
    ]
  },
  {
    answer: "Prafulla Chandra Ray",
    category: "Indian Scientist",
    difficulty: "hard",
    funFact: "PC Ray founded the first pharmaceutical company in India in 1901 - Bengal Chemicals. Despite being a world famous scientist he lived in one room at Presidency College for most of his life.",
    clues: [
      "I was born in Bengal in 1861",
      "I founded India's first pharmaceutical company in 1901",
      "I discovered mercurous nitrite a new chemical compound",
      "I lived simply in one room despite being a famous professor",
      "They call me the father of Indian chemistry"
    ]
  },
  {
    answer: "EV Ramasamy Periyar",
    category: "Indian Social Reformer",
    difficulty: "hard",
    funFact: "Periyar burned images of Rama in public to protest caste discrimination and later organized the first self-respect marriages in Tamil Nadu without priests or rituals.",
    clues: [
      "I was born in Tamil Nadu in 1879",
      "I started the Self-Respect Movement in 1925",
      "I burned images of gods to protest caste discrimination",
      "I organized marriages without priests called self-respect marriages",
      "UNESCO called me the Prophet of the New Age and Socrates of Southeast Asia"
    ]
  },
  {
    answer: "Jamsetji Tata",
    category: "Indian Businessman",
    difficulty: "hard",
    funFact: "Jamsetji Tata planned three institutions before he died - the Tata Iron and Steel Company, the Indian Institute of Science, and a hydroelectric project. None were complete when he died but all three became reality.",
    clues: [
      "I was born in Navsari Gujarat in 1839",
      "I founded the Tata Group which became India's largest conglomerate",
      "I built Jamshedpur the first planned industrial city in India",
      "I planned IISc Bangalore before I died though I never saw it built",
      "They call me the Father of Indian Industry"
    ]
  },
  {
    answer: "Bal Gangadhar Tilak",
    category: "Freedom Fighter",
    difficulty: "hard",
    funFact: "Tilak started the Ganesh Chaturthi public festival specifically to bypass British ban on political gatherings - using religion as cover to unite Indians.",
    clues: [
      "I was born in Ratnagiri Maharashtra in 1856",
      "I turned a religious festival into a tool for political mobilization",
      "I was imprisoned multiple times including for 6 years in Burma",
      "I wrote Gita Rahasya in prison which became a celebrated commentary",
      "My slogan Swaraj is my birthright became the cry of a generation"
    ]
  },
  {
    answer: "Subramanya Bharati",
    category: "Indian Poet",
    difficulty: "extreme",
    funFact: "Subramania Bharati was the first to write about women's liberation, nuclear energy and air travel in Tamil poetry - decades before they became mainstream concepts.",
    clues: [
      "I was born in Ettayapuram Tamil Nadu in 1882",
      "I was a poet journalist and freedom fighter from Tamil Nadu",
      "I wrote revolutionary poems about women's freedom and national pride",
      "I went into exile in Pondicherry to escape British arrest",
      "They call me Mahakavi meaning the great poet of Tamil literature"
    ]
  },
  {
    answer: "Vinoba Bhave",
    category: "Indian Social Reformer",
    difficulty: "hard",
    funFact: "Vinoba Bhave walked across India on foot for 13 years and convinced landlords to donate 4.4 million acres of land to landless poor - entirely through moral persuasion.",
    clues: [
      "I was born in Maharashtra in 1895",
      "Gandhi called me his spiritual successor",
      "I started the Bhoodan movement walking across India on foot",
      "I convinced landlords to voluntarily donate millions of acres",
      "I was the first recipient of the Ramon Magsaysay Award in 1958"
    ]
  }
]

// Get Sunday puzzle for a given week (uses week number to ensure consistency)
export function getSundayPuzzle(date: Date = new Date()): { puzzle: SpecialPuzzle; index: number } {
  // Check if it's Sunday
  if (date.getDay() !== 0) {
    // If not Sunday, return the puzzle from the most recent Sunday
    const daysSinceSunday = date.getDay()
    const lastSunday = new Date(date)
    lastSunday.setDate(date.getDate() - daysSinceSunday)
    return getSundayPuzzle(lastSunday)
  }

  // Calculate week number since epoch for consistent puzzle selection
  const epoch = new Date('1970-01-01')
  const diff = date.getTime() - epoch.getTime()
  const daysSinceEpoch = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeksSinceEpoch = Math.floor(daysSinceEpoch / 7)
  
  // Use modulo to cycle through puzzles
  const index = weeksSinceEpoch % sundayPuzzles.length
  return {
    puzzle: sundayPuzzles[index],
    index
  }
}

// Check if today is Sunday
export function isSunday(): boolean {
  return new Date().getDay() === 0
}
