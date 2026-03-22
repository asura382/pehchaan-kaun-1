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
    answer: "Reserve Bank of India",
    category: "Indian Institution",
    clues: [
      "I was established on April 1 1935",
      "I am the central bank of India",
      "I regulate money supply and credit in India",
      "My headquarters is in Mumbai",
      "I issue currency notes of all denominations except one rupee"
    ]
  },
  {
    answer: "ISRO",
    category: "Indian Institution",
    clues: [
      "I was established in 1969",
      "My full name is Indian Space Research Organisation",
      "My headquarters is in Bengaluru",
      "I successfully launched Chandrayaan and Mangalyaan missions",
      "I became the first space agency to reach Mars on first attempt"
    ]
  },
  {
    answer: "Article 370",
    category: "Indian Constitution",
    clues: [
      "I was a special provision in the Indian Constitution",
      "I granted special autonomous status to Jammu and Kashmir",
      "I was added to the Constitution in 1949",
      "I was abrogated by the Indian government in August 2019",
      "My removal made J&K a Union Territory"
    ]
  },
  {
    answer: "Panchayati Raj",
    category: "Indian Governance",
    clues: [
      "I am a system of local self government in rural India",
      "I was formally introduced by the 73rd Constitutional Amendment",
      "I was first introduced in Rajasthan in 1959",
      "I have three tiers gram panchayat panchayat samiti and zila parishad",
      "Balwant Rai Mehta Committee recommended my introduction"
    ]
  },
  {
    answer: "Green Revolution",
    category: "Indian History",
    clues: [
      "I transformed Indian agriculture in the 1960s",
      "I introduced high yielding variety seeds in India",
      "I was mainly successful in Punjab Haryana and western UP",
      "MS Swaminathan is called my father in India",
      "I made India self sufficient in food grain production"
    ]
  },
  {
    answer: "Operation Flood",
    category: "Indian History",
    clues: [
      "I was the world largest dairy development program",
      "I was launched in India in 1970",
      "I was implemented by the National Dairy Development Board",
      "Verghese Kurien is called my father",
      "I am also known as the White Revolution of India"
    ]
  },
  {
    answer: "Quit India Movement",
    category: "Indian History",
    clues: [
      "I was launched by Mahatma Gandhi in August 1942",
      "My slogan was Do or Die",
      "I demanded immediate independence from British rule",
      "I was launched at Gowalia Tank Maidan in Mumbai",
      "The British arrested all major Congress leaders immediately after"
    ]
  },
  {
    answer: "Dandi March",
    category: "Indian History",
    clues: [
      "I started on March 12 1930",
      "Mahatma Gandhi led me from Sabarmati Ashram",
      "I covered a distance of 241 miles to the coast",
      "I was a protest against the British salt tax",
      "I marked the beginning of the Civil Disobedience Movement"
    ]
  },
  {
    answer: "Battle of Plassey",
    category: "Indian History",
    clues: [
      "I was fought on June 23 1757",
      "I was fought between Robert Clive and Siraj ud Daulah",
      "I took place in Bengal near the Bhagirathi river",
      "I established British supremacy in Bengal",
      "Mir Jafar betrayed Siraj ud Daulah during me"
    ]
  },
  {
    answer: "Jallianwala Bagh",
    category: "Indian History",
    clues: [
      "I am a public garden in Amritsar Punjab",
      "A massacre took place here on April 13 1919",
      "General Reginald Dyer ordered firing on an unarmed crowd",
      "Hundreds of people were killed during Baisakhi celebrations",
      "Udham Singh later avenged this massacre by killing Michael O Dwyer"
    ]
  },
  {
    answer: "Indian National Congress",
    category: "Indian Institution",
    clues: [
      "I was founded in 1885 by Allan Octavian Hume",
      "My first session was held in Bombay",
      "Womesh Chandra Bonnerjee was my first president",
      "I led India's freedom struggle for decades",
      "I am one of India's oldest and largest political parties"
    ]
  },
  {
    answer: "Directive Principles",
    category: "Indian Constitution",
    clues: [
      "I am contained in Part IV of the Indian Constitution",
      "I provide guidelines for making laws in India",
      "I was inspired by the Irish Constitution",
      "I am non-justiciable meaning courts cannot enforce me",
      "I aim to establish social and economic democracy in India"
    ]
  },
  {
    answer: "Planning Commission",
    category: "Indian Institution",
    clues: [
      "I was established in India in 1950",
      "I was responsible for making Five Year Plans",
      "Jawaharlal Nehru was my first chairman",
      "I was dissolved in 2014 by Prime Minister Narendra Modi",
      "NITI Aayog replaced me in January 2015"
    ]
  },
  {
    answer: "Rowlatt Act",
    category: "Indian History",
    clues: [
      "I was passed by the British in March 1919",
      "I allows the government to imprison suspects without trial",
      "Mahatma Gandhi called me the Black Act",
      "My passage led to nationwide protests across India",
      "The Jallianwala Bagh massacre happened during protests against me"
    ]
  },
  {
    answer: "Fundamental Rights",
    category: "Indian Constitution",
    clues: [
      "I am contained in Part III of the Indian Constitution",
      "I guarantee six rights to all citizens of India",
      "I include Right to Equality and Right to Freedom",
      "I was inspired by the Bill of Rights in the US Constitution",
      "Courts can enforce me and strike down laws that violate me"
    ]
  },
  {
    answer: "NITI Aayog",
    category: "Indian Institution",
    clues: [
      "I was established on January 1 2015",
      "My full name is National Institution for Transforming India",
      "I replaced the Planning Commission of India",
      "The Prime Minister of India is my ex-officio chairman",
      "I focus on cooperative federalism and bottom up planning"
    ]
  },
  {
    answer: "Doctrine of Lapse",
    category: "Indian History",
    clues: [
      "I was a policy introduced by Lord Dalhousie",
      "I stated that if a ruler died without a natural heir his kingdom would be annexed",
      "I was applied to Satara Jhansi Nagpur and other states",
      "I caused great resentment among Indian rulers",
      "I was one of the causes of the 1857 revolt"
    ]
  },
  {
    answer: "Subsidiary Alliance",
    category: "Indian History",
    clues: [
      "I was introduced by Lord Wellesley in 1798",
      "Indian rulers who accepted me had to maintain British troops",
      "They had to pay for these troops from their own treasury",
      "They could not have foreign relations with other powers",
      "I helped the British expand their power across India"
    ]
  },
  {
    answer: "Indian Parliament",
    category: "Indian Governance",
    clues: [
      "I am the supreme legislative body of India",
      "I consist of two houses Lok Sabha and Rajya Sabha",
      "My building was inaugurated in 1927 during British rule",
      "A new Parliament building was inaugurated in May 2023",
      "I am located in New Delhi in Sansad Marg"
    ]
  },
  {
    answer: "Right to Information",
    category: "Indian Governance",
    clues: [
      "I am also known as RTI Act",
      "I was passed by Indian Parliament in 2005",
      "I allow citizens to request information from government offices",
      "I promote transparency and accountability in government",
      "Aruna Roy and Anna Hazare campaigned strongly for me"
    ]
  }
]
`;

// Append the new puzzles and closing bracket
content += newPuzzles;

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully added 20 new competitive exam GK puzzles!');
console.log('Total puzzles now: 160');
