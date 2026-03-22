import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current puzzles file
const filePath = path.join(__dirname, 'data', 'puzzles.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the closing bracket
content = content.trim().replace(/\n]$/, '');

// Add the new puzzles
const newPuzzles = `  },
  {
    answer: "Prithviraj Chauhan",
    category: "Indian Ruler",
    clues: [
      "I was born in Ajmer Rajasthan in 1149",
      "I was the last Hindu emperor of Delhi",
      "I defeated Muhammad of Ghor in the First Battle of Tarain",
      "I was defeated in the Second Battle of Tarain in 1192",
      "A famous epic poem Prithviraj Raso was written about me"
    ]
  },
  {
    answer: "Rani Padmavati",
    category: "Indian Ruler",
    clues: [
      "I was the queen of Chittor in Rajasthan",
      "I was married to Rawal Ratan Singh",
      "Alauddin Khalji attacked Chittor to capture me",
      "I performed Jauhar to protect my honor",
      "The 2018 Bollywood film Padmaavat is based on my story"
    ]
  },
  {
    answer: "Aurangzeb",
    category: "Indian Ruler",
    clues: [
      "I was born in Dahod Gujarat in 1618",
      "I was the sixth Mughal Emperor",
      "I expanded the Mughal Empire to its largest extent",
      "I imprisoned my own father Shah Jahan",
      "I ruled for 49 years the longest of any Mughal emperor"
    ]
  },
  {
    answer: "Babur",
    category: "Indian Ruler",
    clues: [
      "I was born in Fergana now Uzbekistan in 1483",
      "I founded the Mughal Empire in India",
      "I defeated Ibrahim Lodi in the First Battle of Panipat in 1526",
      "I was a descendant of both Timur and Genghis Khan",
      "I wrote my autobiography called Baburnama"
    ]
  },
  {
    answer: "Maharana Pratap",
    category: "Indian Ruler",
    clues: [
      "I was born in Kumbhalgarh Rajasthan in 1540",
      "I was the ruler of Mewar kingdom",
      "I fought the Battle of Haldighati against Akbar in 1576",
      "I never surrendered to the Mughal Empire",
      "My horse Chetak is as famous as me in Indian history"
    ]
  },
  {
    answer: "Durgavati",
    category: "Indian Ruler",
    clues: [
      "I was born in Banda Uttar Pradesh in 1524",
      "I was the queen of Gondwana kingdom",
      "I ruled as regent for my young son",
      "I fought bravely against the Mughal general Asaf Khan",
      "I killed myself rather than surrender to the Mughals"
    ]
  },
  {
    answer: "Hyder Ali",
    category: "Indian Ruler",
    clues: [
      "I was born in Budikote Karnataka in 1720",
      "I was the ruler of Mysore kingdom",
      "I was the father of Tipu Sultan",
      "I fought two wars against the British East India Company",
      "I built the first modern army in South India"
    ]
  },
  {
    answer: "Ranjit Singh",
    category: "Indian Ruler",
    clues: [
      "I was born in Gujranwala now Pakistan in 1780",
      "I founded the Sikh Empire",
      "I captured Lahore at age 19",
      "I united all Sikh misls under one kingdom",
      "They call me the Lion of Punjab or Sher-e-Punjab"
    ]
  },
  {
    answer: "Nana Saheb",
    category: "Freedom Fighter",
    clues: [
      "My real name was Dhondu Pant",
      "I was the adopted son of Peshwa Baji Rao II",
      "I led the revolt at Kanpur during 1857 uprising",
      "The British denied me my father's pension",
      "I disappeared after the 1857 revolt and was never captured"
    ]
  },
  {
    answer: "Mangal Pandey",
    category: "Freedom Fighter",
    clues: [
      "I was born in Nagwa Uttar Pradesh in 1827",
      "I was a sepoy in the British East India Company army",
      "I fired the first shot of the 1857 revolt",
      "I attacked British officers at Barrackpore Bengal",
      "I was hanged on April 8 1857 and became a martyr"
    ]
  },
  {
    answer: "Tatya Tope",
    category: "Freedom Fighter",
    clues: [
      "My real name was Ramchandra Pandurang Tope",
      "I was a general in the 1857 Indian uprising",
      "I was a close associate of Nana Saheb",
      "I fought guerrilla warfare against the British for years",
      "I was captured and hanged by the British in 1859"
    ]
  },
  {
    answer: "Gopal Krishna Gokhale",
    category: "Freedom Fighter",
    clues: [
      "I was born in Kotluk Maharashtra in 1866",
      "I was a social reformer and political leader",
      "I founded the Servants of India Society",
      "I was Mahatma Gandhi's political mentor",
      "I believed in achieving freedom through constitutional means"
    ]
  },
  {
    answer: "Bipin Chandra Pal",
    category: "Freedom Fighter",
    clues: [
      "I was born in Poil now Bangladesh in 1858",
      "I was one of the trio Lal Bal Pal",
      "I was known as the Father of Revolutionary Thought in India",
      "I strongly supported the Swadeshi movement",
      "I worked with Bal Gangadhar Tilak and Lala Lajpat Rai"
    ]
  },
  {
    answer: "Lala Lajpat Rai",
    category: "Freedom Fighter",
    clues: [
      "I was born in Dhudike Punjab in 1865",
      "I was one of the trio Lal Bal Pal",
      "I led protests against the Simon Commission in 1928",
      "I was lathi charged by British police and died from injuries",
      "They call me Punjab Kesari meaning Lion of Punjab"
    ]
  },
  {
    answer: "Sarojini Naidu",
    category: "Freedom Fighter",
    clues: [
      "I was born in Hyderabad in 1879",
      "I was a poet and political activist",
      "I was the first woman President of Indian National Congress",
      "I participated in the Salt March with Mahatma Gandhi",
      "They call me the Nightingale of India"
    ]
  },
  {
    answer: "Vinayak Damodar Savarkar",
    category: "Freedom Fighter",
    clues: [
      "I was born in Bhagur Maharashtra in 1883",
      "I was a lawyer poet and political activist",
      "I was imprisoned in the Cellular Jail in Andaman",
      "I coined the term Hindutva",
      "They call me Veer Savarkar"
    ]
  },
  {
    answer: "Maulana Abul Kalam Azad",
    category: "Freedom Fighter",
    clues: [
      "I was born in Mecca Saudi Arabia in 1888",
      "I was a scholar journalist and senior Congress leader",
      "I became India first Education Minister after independence",
      "I strongly opposed the partition of India",
      "National Education Day is celebrated on my birthday"
    ]
  },
  {
    answer: "Ashfaqulla Khan",
    category: "Freedom Fighter",
    clues: [
      "I was born in Shahjahanpur Uttar Pradesh in 1900",
      "I was a close friend of Ram Prasad Bismil",
      "I participated in the Kakori Train Robbery of 1925",
      "I was hanged by the British at Faizabad in 1927",
      "I was one of the youngest martyrs of the freedom struggle"
    ]
  },
  {
    answer: "Ram Prasad Bismil",
    category: "Freedom Fighter",
    clues: [
      "I was born in Shahjahanpur Uttar Pradesh in 1897",
      "I was a revolutionary poet and freedom fighter",
      "I led the Kakori Train Robbery in 1925",
      "I wrote the famous patriotic song Sarfaroshi Ki Tamanna",
      "I was hanged by the British at age 30 in 1927"
    ]
  },
  {
    answer: "Udham Singh",
    category: "Freedom Fighter",
    clues: [
      "I was born in Sunam Punjab in 1899",
      "I witnessed the Jallianwala Bagh massacre as a child",
      "I traveled to England to avenge the massacre",
      "I shot and killed Michael O Dwyer in London in 1940",
      "They call me Shaheed-e-Azam Udham Singh"
    ]
  }
]
`;

// Append the new puzzles and closing bracket
content += newPuzzles;

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully added 20 new puzzles!');
console.log('Total puzzles now: 140');
