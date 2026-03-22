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
    answer: "Indus Valley Civilisation",
    category: "Ancient Indian History",
    clues: [
      "I flourished between 3300 BCE and 1300 BCE",
      "I was discovered in 1921 at Harappa in Punjab",
      "My major cities included Mohenjo-daro and Harappa",
      "I had advanced drainage and sewage systems",
      "I am also called the Harappan Civilisation"
    ]
  },
  {
    answer: "Mohenjo-daro",
    category: "Ancient Indian History",
    clues: [
      "I am an ancient city of the Indus Valley Civilisation",
      "My name means Mound of the Dead in Sindhi",
      "I was discovered in 1922 by RD Banerji",
      "I am located in present day Sindh Pakistan",
      "I had a famous Great Bath used for ritual bathing"
    ]
  },
  {
    answer: "Vedic Period",
    category: "Ancient Indian History",
    clues: [
      "I refer to the period when Vedas were composed in India",
      "I lasted roughly from 1500 BCE to 500 BCE",
      "The Rigveda is the oldest text from my early phase",
      "I saw the development of Sanskrit language",
      "I laid the foundation of Hinduism in India"
    ]
  },
  {
    answer: "Maurya Empire",
    category: "Ancient Indian History",
    clues: [
      "I was founded by Chandragupta Maurya in 321 BCE",
      "I was the first pan-Indian empire",
      "Ashoka was my most famous emperor",
      "Pataliputra modern Patna was my capital",
      "Kautilya also known as Chanakya was my chief minister"
    ]
  },
  {
    answer: "Gupta Empire",
    category: "Ancient Indian History",
    clues: [
      "I am known as the Golden Age of India",
      "I was founded by Sri Gupta around 240 CE",
      "Chandragupta II Vikramaditya was my greatest ruler",
      "Literature science and arts flourished during me",
      "Kalidasa the great poet lived during my period"
    ]
  },
  {
    answer: "Kalidasa",
    category: "Ancient Indian History",
    clues: [
      "I was a Sanskrit poet and playwright",
      "I lived during the Gupta period around 4th century CE",
      "I wrote Abhijnanasakuntalam considered my masterpiece",
      "I also wrote the epic poems Raghuvamsa and Kumarasambhava",
      "They call me the Shakespeare of India"
    ]
  },
  {
    answer: "Nalanda University",
    category: "Ancient Indian History",
    clues: [
      "I was an ancient center of higher learning in Bihar",
      "I was established in the 5th century CE during Gupta period",
      "I attracted students from China Korea Japan and Central Asia",
      "Xuanzang the Chinese traveler studied at me",
      "I was destroyed by Bakhtiyar Khilji in 1193 CE"
    ]
  },
  {
    answer: "Delhi Sultanate",
    category: "Medieval Indian History",
    clues: [
      "I ruled over large parts of India from 1206 to 1526",
      "I consisted of five dynasties Slave Khilji Tughlaq Sayyid and Lodi",
      "Qutb ud Din Aibak founded me after Muhammad of Ghor",
      "The Qutb Minar in Delhi was built during my period",
      "I ended when Babur defeated Ibrahim Lodi at Panipat in 1526"
    ]
  },
  {
    answer: "Mughal Empire",
    category: "Medieval Indian History",
    clues: [
      "I was founded by Babur in 1526 after Battle of Panipat",
      "I ruled most of the Indian subcontinent for over 300 years",
      "Akbar was my greatest ruler known for religious tolerance",
      "The Taj Mahal was built during my period by Shah Jahan",
      "I ended formally in 1857 when British exiled Bahadur Shah Zafar"
    ]
  },
  {
    answer: "Taj Mahal",
    category: "Indian Heritage",
    clues: [
      "I am a white marble mausoleum in Agra",
      "I was built by Mughal Emperor Shah Jahan",
      "I was built in memory of his wife Mumtaz Mahal",
      "I was completed in 1653 taking 22 years to build",
      "I am one of the Seven Wonders of the Modern World"
    ]
  },
  {
    answer: "Khilafat Movement",
    category: "Indian History",
    clues: [
      "I was launched in India in 1919",
      "I was led by Ali Brothers Muhammad Ali and Shaukat Ali",
      "I protested against British treatment of Ottoman Caliph",
      "Mahatma Gandhi supported me to achieve Hindu Muslim unity",
      "I collapsed in 1924 when Turkey abolished the Caliphate"
    ]
  },
  {
    answer: "Non Cooperation Movement",
    category: "Indian History",
    clues: [
      "I was launched by Gandhi in September 1920",
      "I asked Indians to boycott British goods and institutions",
      "I was the first mass movement Gandhi led in India",
      "I was withdrawn after Chauri Chaura violence in 1922",
      "I marked the beginning of mass participation in freedom struggle"
    ]
  },
  {
    answer: "Civil Disobedience Movement",
    category: "Indian History",
    clues: [
      "I was launched by Gandhi in 1930",
      "I began with the famous Dandi Salt March",
      "I asked Indians to break unjust British laws openly",
      "I was suspended due to Gandhi Irwin Pact in 1931",
      "I was the most successful mass movement against British rule"
    ]
  },
  {
    answer: "Indian National Army",
    category: "Indian History",
    clues: [
      "I was also known as Azad Hind Fauj",
      "I was formed in 1942 in Singapore",
      "Subhas Chandra Bose was my Supreme Commander",
      "I consisted of Indian prisoners of war and civilians in Southeast Asia",
      "My motto was Ittehad Itmad aur Qurbani meaning Unity Faith and Sacrifice"
    ]
  },
  {
    answer: "Government of India Act 1935",
    category: "Indian History",
    clues: [
      "I was the longest act passed by British Parliament",
      "I proposed an All India Federation including princely states",
      "I introduced provincial autonomy in British India",
      "I abolished dyarchy in provinces and introduced it at centre",
      "The Constitution of India borrowed many provisions from me"
    ]
  },
  {
    answer: "Vernacular Press Act",
    category: "Indian History",
    clues: [
      "I was passed by Lord Lytton in 1878",
      "I imposed restrictions on Indian language newspapers",
      "I was also called the Gagging Act by Indian nationalists",
      "I tried to suppress nationalist sentiments in Indian press",
      "I was repealed by Lord Ripon in 1882"
    ]
  },
  {
    answer: "Permanent Settlement",
    category: "Indian History",
    clues: [
      "I was introduced by Lord Cornwallis in 1793",
      "I fixed land revenue permanently in Bengal Bihar and Orissa",
      "I created a class of zamindars as permanent owners of land",
      "I was also known as Zamindari System",
      "I caused great hardship to peasants who could be evicted"
    ]
  },
  {
    answer: "Ryotwari System",
    category: "Indian History",
    clues: [
      "I was introduced by Thomas Munro in Madras in 1820",
      "I settled land revenue directly with individual peasants",
      "I was also extended to Bombay presidency",
      "Under me peasants paid revenue directly to the government",
      "I was different from Zamindari and Mahalwari systems"
    ]
  },
  {
    answer: "Wood's Despatch",
    category: "Indian History",
    clues: [
      "I was issued in 1854 by Charles Wood Secretary of State",
      "I laid the foundation of modern education in India",
      "I recommended establishing universities in Bombay Calcutta and Madras",
      "I promoted English as medium of instruction in higher education",
      "I am called the Magna Carta of English Education in India"
    ]
  },
  {
    answer: "Ilbert Bill",
    category: "Indian History",
    clues: [
      "I was introduced in 1883 by Viceroy Ripon",
      "I allowed Indian judges to try European criminals in India",
      "Europeans strongly opposed me causing the White Mutiny",
      "I was eventually amended and diluted due to European pressure",
      "My controversy led to formation of Indian National Congress"
    ]
  },
  {
    answer: "Regulating Act",
    category: "Indian History",
    clues: [
      "I was passed by British Parliament in 1773",
      "I was the first step by British to control East India Company",
      "I established the post of Governor General of Bengal",
      "Warren Hastings became the first Governor General under me",
      "I established a Supreme Court at Calcutta"
    ]
  },
  {
    answer: "Pitt's India Act",
    category: "Indian History",
    clues: [
      "I was passed by British Parliament in 1784",
      "I was named after Prime Minister William Pitt the Younger",
      "I established a Board of Control to supervise East India Company",
      "I distinguished between commercial and political functions of Company",
      "I gave British government supervisory control over Indian affairs"
    ]
  },
  {
    answer: "Charter Act 1833",
    category: "Indian History",
    clues: [
      "I was passed by British Parliament in 1833",
      "I made the Governor General of Bengal the Governor General of India",
      "William Bentinck became the first Governor General of India under me",
      "I ended the East India Company's trade monopoly completely",
      "I allowed any British subject to settle in India"
    ]
  },
  {
    answer: "Queen's Proclamation",
    category: "Indian History",
    clues: [
      "I was issued by Queen Victoria on November 1 1858",
      "I transferred control of India from East India Company to Crown",
      "I promised non interference in Indian religious matters",
      "I promised equal opportunity to Indians in government service",
      "I marked the beginning of the British Raj in India"
    ]
  },
  {
    answer: "Hunter Commission",
    category: "Indian History",
    clues: [
      "I was appointed in 1882 by Viceroy Ripon",
      "I was formally called the Indian Education Commission",
      "I reviewed the state of education in India",
      "I recommended development of primary education",
      "I suggested handing over secondary education to private bodies"
    ]
  }
]
`;

// Append the new puzzles and closing bracket
content += newPuzzles;

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully added 25 competitive exam GK puzzles!');
console.log('Total puzzles now: 210');
