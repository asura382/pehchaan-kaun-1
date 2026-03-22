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
    answer: "Champaran Satyagraha",
    category: "Indian History",
    clues: [
      "I was Gandhi's first Satyagraha in India in 1917",
      "I took place in Bihar against British indigo planters",
      "Farmers were forced to grow indigo on 3/20th of their land",
      "I was the first civil disobedience movement in India",
      "My success made Gandhi a national leader in India"
    ]
  },
  {
    answer: "Simon Commission",
    category: "Indian History",
    clues: [
      "I was a statutory commission sent to India in 1928",
      "I had seven British members and no Indian members",
      "Indians protested against me with Simon Go Back slogans",
      "Lala Lajpat Rai was lathi charged during protests against me",
      "My report eventually led to the Government of India Act 1935"
    ]
  },
  {
    answer: "Cabinet Mission",
    category: "Indian History",
    clues: [
      "I was sent to India by British government in 1946",
      "I consisted of three British cabinet ministers",
      "I proposed a plan for united independent India",
      "I proposed a three tier federal structure for India",
      "My plan was accepted by Congress but ultimately failed"
    ]
  },
  {
    answer: "Poona Pact",
    category: "Indian History",
    clues: [
      "I was signed in September 1932",
      "I was an agreement between Gandhi and BR Ambedkar",
      "I was signed in Yerwada Jail Pune",
      "Gandhi went on fast unto death to prevent it from Communal Award",
      "I gave reserved seats to depressed classes in provincial legislatures"
    ]
  },
  {
    answer: "Lucknow Pact",
    category: "Indian History",
    clues: [
      "I was signed in 1916 between Congress and Muslim League",
      "I was the result of cooperation between Tilak and Jinnah",
      "I agreed on separate electorates for Muslims",
      "I united two major political organizations temporarily",
      "I was seen as a moment of Hindu Muslim unity"
    ]
  },
  {
    answer: "Morley Minto Reforms",
    category: "Indian History",
    clues: [
      "I was passed in 1909 by British government",
      "I introduced separate electorates for Muslims in India",
      "I was named after Secretary of State Morley and Viceroy Minto",
      "I allowed Indians into legislative councils for first time",
      "I sowed seeds of communal division in Indian politics"
    ]
  },
  {
    answer: "Montagu Chelmsford Reforms",
    category: "Indian History",
    clues: [
      "I was passed as Government of India Act in 1919",
      "I introduced the system of dyarchy in provinces",
      "I was named after Secretary Montagu and Viceroy Chelmsford",
      "I gave limited self government to Indians in provinces",
      "I was criticized by nationalists as inadequate"
    ]
  },
  {
    answer: "Cripps Mission",
    category: "Indian History",
    clues: [
      "I was sent to India by British in March 1942",
      "Sir Stafford Cripps led me",
      "I offered dominion status to India after World War II",
      "Congress rejected me calling it a post dated cheque",
      "My failure led to the launch of Quit India Movement"
    ]
  },
  {
    answer: "Wavell Plan",
    category: "Indian History",
    clues: [
      "I was proposed by Viceroy Wavell in 1945",
      "I proposed an executive council with equal Hindu Muslim representation",
      "I was discussed at the Shimla Conference",
      "I failed because Jinnah insisted on Muslim League nominees only",
      "I was the last major British attempt before 1946 elections"
    ]
  },
  {
    answer: "Mountbatten Plan",
    category: "Indian History",
    clues: [
      "I was announced on June 3 1947",
      "Lord Mountbatten was the last Viceroy of India",
      "I proposed partition of India into two dominions",
      "I set August 15 1947 as the date of independence",
      "I led to the creation of India and Pakistan"
    ]
  },
  {
    answer: "Indian Independence Act",
    category: "Indian History",
    clues: [
      "I was passed by British Parliament in July 1947",
      "I granted independence to India and Pakistan",
      "I set August 14 and 15 1947 as independence dates",
      "I ended British paramountcy over princely states",
      "I made India and Pakistan independent dominions"
    ]
  },
  {
    answer: "Constituent Assembly",
    category: "Indian Governance",
    clues: [
      "I was formed in December 1946 to write India's Constitution",
      "Dr Rajendra Prasad was my president",
      "BR Ambedkar was the chairman of my drafting committee",
      "I took 2 years 11 months and 18 days to write the Constitution",
      "I adopted the Constitution on November 26 1949"
    ]
  },
  {
    answer: "Supreme Court of India",
    category: "Indian Governance",
    clues: [
      "I was established on January 28 1950",
      "I am the highest court in India",
      "My headquarters is in New Delhi",
      "I have original appellate and advisory jurisdiction",
      "The Chief Justice of India heads me"
    ]
  },
  {
    answer: "Election Commission",
    category: "Indian Institution",
    clues: [
      "I was established on January 25 1950",
      "I am an autonomous constitutional body",
      "I conduct free and fair elections in India",
      "Sukumar Sen was my first Chief Election Commissioner",
      "TN Seshan reformed me significantly in the 1990s"
    ]
  },
  {
    answer: "Comptroller and Auditor General",
    category: "Indian Governance",
    clues: [
      "I am also known as CAG of India",
      "I audit all receipts and expenditure of Government of India",
      "I am appointed by the President of India",
      "I am described as guardian of public purse",
      "Article 148 of Constitution establishes my office"
    ]
  },
  {
    answer: "Finance Commission",
    category: "Indian Governance",
    clues: [
      "I am a constitutional body established under Article 280",
      "I am constituted every five years by the President",
      "I recommend distribution of tax revenues between Centre and States",
      "KC Neogy headed my first commission in 1951",
      "I help maintain fiscal federalism in India"
    ]
  },
  {
    answer: "National Emergency",
    category: "Indian Constitution",
    clues: [
      "I can be proclaimed under Article 352 of Constitution",
      "I can be declared during war external aggression or armed rebellion",
      "I was proclaimed in India in 1962 1971 and 1975",
      "During me Fundamental Rights can be suspended",
      "The 1975 Emergency proclaimed by Indira Gandhi was most controversial"
    ]
  },
  {
    answer: "Zero Hour",
    category: "Indian Governance",
    clues: [
      "I am a parliamentary procedure unique to India",
      "I start at 12 noon in Indian Parliament every day",
      "Members can raise urgent matters of public importance during me",
      "I am not mentioned in Rules of Procedure of Parliament",
      "I was introduced informally in 1960s in Indian Parliament"
    ]
  },
  {
    answer: "Question Hour",
    category: "Indian Governance",
    clues: [
      "I am the first hour of every parliamentary sitting in India",
      "Members of Parliament ask questions to ministers during me",
      "I have starred unstarred and short notice questions",
      "Starred questions require oral answers from ministers",
      "I is considered the best device of parliamentary control"
    ]
  },
  {
    answer: "Rajya Sabha",
    category: "Indian Governance",
    clues: [
      "I am the upper house of Indian Parliament",
      "I am also known as the Council of States",
      "I have a maximum strength of 250 members",
      "The Vice President of India is my ex-officio chairman",
      "I am a permanent body and cannot be dissolved"
    ]
  },
  {
    answer: "Lok Sabha",
    category: "Indian Governance",
    clues: [
      "I am the lower house of Indian Parliament",
      "I am also known as the House of the People",
      "I have a maximum strength of 552 members",
      "The Speaker of India presides over me",
      "I have a normal term of five years"
    ]
  },
  {
    answer: "Bharat Ratna",
    category: "Indian Honours",
    clues: [
      "I am India's highest civilian honour",
      "I was established in 1954",
      "I am awarded for exceptional service to India",
      "Dr Sarvepalli Radhakrishnan was among my first recipients",
      "I can be awarded posthumously and to non citizens too"
    ]
  },
  {
    answer: "Padma Vibhushan",
    category: "Indian Honours",
    clues: [
      "I am India's second highest civilian award",
      "I was established in 1954",
      "I am awarded for exceptional and distinguished service to India",
      "I is higher than Padma Bhushan but lower than Bharat Ratna",
      "I is announced every year on Republic Day"
    ]
  },
  {
    answer: "National Human Rights Commission",
    category: "Indian Institution",
    clues: [
      "I was established in October 1993",
      "I protect and promote human rights in India",
      "A retired Chief Justice of India heads me",
      "I was established under Protection of Human Rights Act 1993",
      "I can investigate complaints of human rights violations"
    ]
  },
  {
    answer: "Goods and Services Tax",
    category: "Indian Governance",
    clues: [
      "I am also known as GST",
      "I was implemented in India on July 1 2017",
      "I replaced multiple indirect taxes in India",
      "I follows the principle of one nation one tax",
      "I is a destination based consumption tax"
    ]
  }
]
`;

// Append the new puzzles and closing bracket
content += newPuzzles;

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully added 25 competitive exam GK puzzles!');
console.log('Total puzzles now: 185');
