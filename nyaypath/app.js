/* NyayPath - Decision Tree Engine & Application Logic */
/* Pure Vanilla JavaScript - No Frameworks */

// DEBUG: Verify problems data is loaded
console.log('NyayPath app.js loaded. problemsData keys:', Object.keys(problemsData || {}).length);
console.log('Problem IDs in problemsData:', Object.keys(problemsData || {}));


// ============================================
// TRANSLATIONS (English / Hindi)
// ============================================
const translations = {
    en: {
        appName: "NyayPath", tagline: "Free step-by-step legal help for everyday Indians",
        searchPlaceholder: "Describe your problem... (e.g., landlord, salary, cheque, police)",
        footerDisclaimer: "NyayPath is for legal awareness only. For specific legal advice, consult a qualified lawyer.",
        about: "About", disclaimer: "Disclaimer", privacy: "Privacy Policy", madeWith: "Made with ❤ for every Indian",
        step1: "State", step2: "Questions", step3: "Action Plan", selectState: "Select Your State",
        chooseState: "-- Choose your state --", next: "Next →", back: "← Back", showActionPlan: "Show Action Plan",
        print: "📄 Print", share: "🔗 Share", backToHome: "← Back to Home", copy: "📋 Copy", printTemplate: "🖨️ Print",
        yourSituation: "Your Situation", urgency: "Urgency", actBefore: "Act before", legalBasis: "Legal Basis",
        steps: "Step-by-Step Guide", checklist: "Checklist", helplines: "Helpline Numbers",
        needLawyer: "Need a lawyer? Find one on:", lawyerDisclaimer: "NyayPath is not affiliated with these services",
        high: "HIGH", medium: "MEDIUM", low: "LOW"
    },
    hi: {
        appName: "न्यायपथ", tagline: "आम भारतीयों के लिए मुफ्त कानूनी मदद",
        searchPlaceholder: "अपनी समस्या बताएं... (जैसे, मकान मालिक, वेतन, चेक, पुलिस)",
        footerDisclaimer: "न्यायपथ केवल कानूनी जागरूकता के लिए है। विशिष्ट कानूनी सलाह के लिए योग्य वकील से परामर्श करें।",
        about: "हमारे बारे में", disclaimer: "अस्वीकरण", privacy: "गोपनीयता नीति", madeWith: "हर भारतीय के लिए ❤ से बना",
        step1: "राज्य", step2: "प्रश्न", step3: "कार्रवाई योजना", selectState: "अपना राज्य चुनें",
        chooseState: "-- अपना राज्य चुनें --", next: "आगे →", back: "← पीछे", showActionPlan: "कार्रवाई योजना दिखाएं",
        print: "📄 प्रिंट", share: "🔗 शेयर", backToHome: "← होम पेज पर वापस", copy: "📋 कॉपी", printTemplate: "🖨️ प्रिंट",
        yourSituation: "आपकी स्थिति", urgency: "तत्कालता", actBefore: "इससे पहले कार्रवाई करें",
        legalBasis: "कानूनी आधार", steps: "चरण-दर-चरण मार्गदर्शिका", checklist: "जांच सूची", helplines: "हेल्पलाइन नंबर",
        needLawyer: "वकील चाहिए? इन पर खोजें:", lawyerDisclaimer: "न्यायपथ इन सेवाओं से संबद्ध नहीं है",
        high: "उच्च", medium: "मध्यम", low: "निम्न"
    }
};

// States & UTs
const statesAndUTs = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
    "Lakshadweep", "Puducherry"
];

// National Helplines
const nationalHelplines = {
    police: { label: "Police Emergency", number: "100" },
    women: { label: "Women Helpline", number: "1091" },
    child: { label: "Child Helpline", number: "1098" },
    senior: { label: "Senior Citizen Helpline", number: "14567" },
    consumer: { label: "National Consumer Helpline", number: "1800-11-4000" },
    labour: { label: "Labour Helpline", number: "155300" }
};

// Problem Categories Data
const problemsList = [
    { id: "landlord_deposit", title: "Landlord not returning security deposit", category: "property", description: "Get your full deposit back with legal notice and consumer court" },
    { id: "salary_dues", title: "Employer not paying salary or dues", category: "employment", description: "Recover unpaid wages through labour commissioner" },
    { id: "cheque_bounce", title: "Cheque bounce / dishonoured cheque", category: "criminal", description: "File criminal case under Section 138" },
    { id: "consumer_defect", title: "Consumer product defect or poor service", category: "consumer", description: "Get refund, replacement or compensation" },
    { id: "bank_fraud", title: "Bank account fraud or unauthorized transaction", category: "consumer", description: "Report fraud and recover money from bank" },
    { id: "police_fir", title: "Police not registering FIR (Zero FIR)", category: "criminal", description: "Force police to register your FIR legally" },
    { id: "domestic_violence", title: "Domestic violence or harassment", category: "family", description: "Protection under Domestic Violence Act" },
    { id: "property_dispute", title: "Property dispute with neighbour", category: "property", description: "Resolve boundary and ownership disputes" },
    { id: "online_fraud", title: "Online shopping fraud / e-commerce complaint", category: "consumer", description: "Get refund for fake/undelivered products" },
    { id: "pf_dues", title: "Employer not depositing PF (Provident Fund)", category: "employment", description: "Recover PF through EPFO" },
    { id: "road_accident", title: "Road accident and insurance claim", category: "criminal", description: "Claim compensation from MCTP" },
    { id: "noise_pollution", title: "Noise pollution complaint against neighbour", category: "government", description: "File complaint with PCB" },
    { id: "workplace_harassment", title: "Workplace sexual harassment (POSH)", category: "employment", description: "File complaint with ICC" },
    { id: "rent_dispute", title: "Rent agreement dispute with landlord", category: "property", description: "Tenant rights and eviction protection" },
    { id: "electricity_bill", title: "Electricity department overcharging or wrong bill", category: "government", description: "Appeal to electricity ombudsman" },
    { id: "mobile_service", title: "Mobile or internet service provider complaint", category: "consumer", description: "Complain against telecom companies" },
    { id: "fee_refund", title: "School or college fee refund dispute", category: "consumer", description: "Claim unfair fee refund" },
    { id: "medical_negligence", title: "Medical negligence by doctor or hospital", category: "consumer", description: "File medical negligence case" },
    { id: "food_adulteration", title: "Food adulteration or restaurant complaint", category: "consumer", description: "Report to FSSAI" },
    { id: "builder_possession", title: "Builder not giving possession of flat", category: "property", description: "RERA complaint for delayed possession" },
    { id: "banking_service", title: "Deficiency in banking service (loan, FD, account)", category: "consumer", description: "Banking ombudsman complaint" },
    { id: "ration_card", title: "Ration card / government scheme denial", category: "government", description: "RTI and grievance redressal" },
    { id: "discrimination", title: "Caste or religion based discrimination", category: "criminal", description: "SC/ST Act and IPC remedies" },
    { id: "child_custody", title: "Child custody dispute", category: "family", description: "Guardianship and custody rights" },
    { id: "senior_abuse", title: "Senior citizen abuse or neglect", category: "family", description: "Protection under Senior Citizens Act" },
    { id: "cyber_crime", title: "Cyber crime — hacking, morphed photos, threats", category: "criminal", description: "File cyber crime complaint" },
    { id: "environmental", title: "Environmental pollution complaint", category: "government", description: "NGT and PCB complaints" },
    { id: "rti", title: "RTI (Right to Information) application guide", category: "government", description: "File RTI effectively" },
    { id: "passport", title: "Passport delay or rejection", category: "government", description: "Escalate to passport authorities" },
    { id: "driving_licence", title: "Driving licence or vehicle RC dispute", category: "government", description: "RTO complaint and appeal" }
];

// SVG Icons for categories
const categoryIcons = {
    property: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
    employment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
    criminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/></svg>`,
    consumer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
    government: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
    family: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`
};

// Current language state
let currentLang = 'en';
let currentProblem = null;
let userAnswers = {};
let selectedState = '';

// ════════════════════════════════════════════════════
// WIZARD STATE MANAGEMENT (BUG FIX #3)
// ════════════════════════════════════════════════════
const wizardState = {
  problemId: null,
  problem: null,
  currentStep: 1,
  selectedState: '',
  answers: {},
  reset() {
    this.currentStep = 1;
    this.selectedState = '';
    this.answers = {};
    this.problemId = null;
    this.problem = null;
  }
};

// ════════════════════════════════════════════════════
// UNIVERSAL FALLBACK ACTION PLAN (BUG FIX #2)
// ════════════════════════════════════════════════════
function getDefaultActionPlan(problemTitle, state, answers) {
  return {
    summary: `For "${problemTitle}" in ${state}, you have legal options available. Here are the key steps to take.`,
    urgency: "medium",
    deadline: "Act within 30 days of the incident",
    legalBasis: "Indian law provides remedies for this situation. Specific provisions depend on the nature of your issue.",
    steps: [
      {
        stepNumber: 1,
        title: "Document Everything",
        description: `Write down all details of your "${problemTitle}" issue with dates, amounts, and names of people involved. Take photos of any physical evidence. Save all communications (emails, messages, letters).`,
        timeframe: "Do this today",
        cost: "Free",
        tip: "Evidence collected early is always stronger. Create a timeline document with all events in chronological order."
      },
      {
        stepNumber: 2,
        title: "Send a Written Complaint",
        description: `Write a formal complaint letter to the other party stating the problem clearly, what resolution you want (refund/compensation/action), and give them a 15-day deadline to respond.`,
        timeframe: "Within 7 days of documenting the issue",
        cost: "Free (send via WhatsApp + Registered Post AD)",
        template: generateGenericLegalNotice(problemTitle, state),
        tip: "Always send via registered post AND WhatsApp/email — keeps both digital and physical proof of delivery."
      },
      {
        stepNumber: 3,
        title: "Escalate if No Response",
        description: `If no resolution within 15 days, file a formal complaint at the relevant authority: District Consumer Forum (for consumer issues), Labour Commissioner office (for employment disputes), or local Police Station (for criminal matters like fraud/theft).`,
        timeframe: "After the 15-day notice period expires",
        cost: "₹0–₹200 court fee depending on the forum and claim amount",
        tip: "Free legal aid is available at your District Legal Services Authority (DLSA). Visit the nearest court complex."
      }
    ],
    importantNumbers: [
      { label: "Legal Aid Helpline (NALSA)", number: "15100" },
      { label: "Police Emergency", number: "100" },
      { label: "National Consumer Helpline", number: "1800-11-4000" }
    ],
    downloadableChecklist: [
      "□ Write down all incident details with dates and times",
      "□ Collect photos, screenshots, receipts, and all evidence",
      "□ Get witness contact information if applicable",
      "□ Send formal written complaint with 15-day deadline",
      "□ Keep copies of ALL communications (physical + digital)",
      "□ Visit relevant government office if no response received"
    ],
    faqs: [
      { 
        q: "Do I need a lawyer for this?", 
        a: "Not immediately. Try self-resolution first through the steps above. Free legal aid is available at DLSA (District Legal Services Authority) if you need a lawyer later." 
      },
      { 
        q: "What if the other party ignores my complaint?", 
        a: "Ignoring a legal notice is itself evidence against them. Escalate to the relevant government authority or forum as mentioned in Step 3. They have powers to enforce compliance." 
      },
      { 
        q: "How long will this process take?", 
        a: "Self-resolution often works within 15-30 days. Government forums typically take 6 months to 2 years for final decisions, but many cases settle earlier through mediation." 
      }
    ]
  };
}

// Generic template generator for fallback notices
function generateGenericLegalNotice(issueType, state) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return `LEGAL NOTICE

Date: ${today}

To,
The Concerned Authority/Person
[Complete Address]

Subject: Legal Notice regarding ${issueType}

Respected Sir/Madam,

I, [YOUR FULL NAME], resident of [YOUR COMPLETE ADDRESS], wish to bring the following to your notice:

1. That I am facing an issue regarding ${issueType} in ${state}.

2. The details of the incident are as follows:
   [DESCRIBE IN DETAIL - dates, amounts, people involved, what happened]

3. That this situation has caused me loss/harassment and is violative of my legal rights under Indian law.

4. That I request you to:
   [STATE YOUR DEMANDS CLEARLY - refund/compensation/action required]

5. That I request you to resolve this matter within 15 days of receipt of this notice, failing which I shall be constrained to initiate appropriate legal proceedings against you at your own risk and cost.

Please treat this as a final notice.

Yours faithfully,

[YOUR SIGNATURE]
[YOUR FULL NAME]
[CONTACT NUMBER]
[EMAIL]

---
SEND VIA REGISTERED POST WITH ACKNOWLEDGEMENT DUE
Keep postal receipt safely as proof of delivery`;
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('ALL KEYS:', Object.keys(problemsData));
    loadLanguage();
    renderProblemCards(problemsList);
    populateStateDropdown();
    setupEventListeners();
    setupSearch();
    registerServiceWorker();
});

// Register Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// Load saved language preference
function loadLanguage() {
    const saved = localStorage.getItem('nyaypath_lang');
    if (saved) currentLang = saved;
    updatePageLanguage();
}

// Update all UI text to selected language
function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.setAttribute('placeholder', translations[currentLang][key]);
        }
    });
    document.documentElement.setAttribute('lang', currentLang === 'hi' ? 'hi' : 'en');
}

// Populate states dropdown
function populateStateDropdown() {
    const select = document.getElementById('stateSelect');
    if (!select) return;
    select.innerHTML = `<option value="">${translations[currentLang].chooseState}</option>`;
    statesAndUTs.forEach(state => {
        select.innerHTML += `<option value="${state}">${state}</option>`;
    });
}

// Render problem cards
function renderProblemCards(problems) {
  const grid = document.getElementById('problemsGrid');
  if (!grid) return;
  
  // Use problemsData object directly to get the correct keys
  grid.innerHTML = Object.keys(problemsData).map(function(key) {
    var problem = problemsData[key];
    return `
      <div class="problem-card ${problem.category || ''}" data-problem-id="${key}" tabindex="0" role="button" aria-label="${problem.title}">
        <div class="card-icon">${categoryIcons[problem.category] || categoryIcons.consumer}</div>
        <h3 class="card-title">${problem.title}</h3>
        <p class="card-description">${problem.description || ''}</p>
        <button class="card-button">${currentLang === 'hi' ? 'अपने अधिकार जानें →' : 'Know your rights →'}</button>
      </div>
    `;
  }).join('');
  
  // Add click listeners with event delegation
  grid.querySelectorAll('.problem-card').forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.dataset.problemId;  // This is now the KEY (e.g., "traffic_challan")
      console.log('BUTTON CLICKED, ID =', pid);
      openWizard(pid);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const pid = card.dataset.problemId;
        openWizard(pid);
      }
    });
  });
}

// Search functionality
function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    let debounceTimer;
    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderProblemCards(problemsList);
                return;
            }
            const filtered = problemsList.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
            renderProblemCards(filtered);
        }, 200);
    });
}

// Setup event listeners
function setupEventListeners() {
  // Language toggle
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
  
  // Wizard close buttons - BUG FIX #1: Use event delegation
  document.addEventListener('click', function(e) {
    // Close wizard
    if (e.target.matches('#wizardClose') || e.target.closest('#wizardClose')) {
      e.preventDefault();
      closeWizard();
    }
    
    // Close template modal
    if (e.target.matches('#templateClose') || e.target.closest('#templateClose')) {
      e.preventDefault();
      closeTemplateModal();
    }
    
    // Back to home
    if (e.target.matches('#backToHome') || e.target.closest('#backToHome')) {
      e.preventDefault();
      closeWizard();
    }
    
    // Next button Step 1 - BUG FIX #1
    if (e.target.matches('#step1Next') || e.target.closest('#step1Next')) {
      e.preventDefault();
      try {
        goToStep2();
      } catch(err) {
        console.error('Step 1 Next error:', err);
        alert(currentLang === 'hi' ? 
          'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 
          'An error occurred. Please try again.');
      }
    }
    
    // Back button Step 2
    if (e.target.matches('#step2Back') || e.target.closest('#step2Back')) {
      e.preventDefault();
      renderWizardStep(1);
    }
    
    // Next button Step 2 - BUG FIX #1
    if (e.target.matches('#step2Next') || e.target.closest('#step2Next')) {
      e.preventDefault();
      try {
        goToStep3();
      } catch(err) {
        console.error('Step 2 Next error:', err);
        alert(currentLang === 'hi' ? 
          'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 
          'An error occurred. Please try again.');
      }
    }
    
    // Print action plan
    if (e.target.matches('#printActionPlan') || e.target.closest('#printActionPlan')) {
      e.preventDefault();
      printActionPlan();
    }
    
    // Share action plan
    if (e.target.matches('#shareActionPlan') || e.target.closest('#shareActionPlan')) {
      e.preventDefault();
      shareActionPlan();
    }
    
    // Copy template
    if (e.target.matches('#copyTemplate') || e.target.closest('#copyTemplate')) {
      e.preventDefault();
      copyTemplate();
    }
    
    // Print template
    if (e.target.matches('#printTemplate') || e.target.closest('#printTemplate')) {
      e.preventDefault();
      window.print();
    }
  });
  
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeWizard();
        closeTemplateModal();
      }
    });
  });
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    localStorage.setItem('nyaypath_lang', currentLang);
    updatePageLanguage();
    renderProblemCards(problemsList);
    document.querySelector('.lang-current').textContent = currentLang === 'en' ? 'English' : 'हिन्दी';
    document.querySelector('.lang-other').textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
}

// ============================================
// WIZARD FUNCTIONS (BUG-FIXED)
// ============================================

// ── OPEN WIZARD (BUG FIX #1, #3) ─────────────────────────────
function openWizard(problemId) {
  console.log('openWizard called with:', problemId);
  
  if (!problemId) {
    console.error('openWizard: no problemId passed');
    return;  // ← ADDED GUARD - silently return if no ID
  }
  
  if (typeof problemsData === 'undefined') {
    console.error('problemsData is not loaded');
    alert('Data not loaded. Reload the page.');
    return;
  }
  
  var problem = problemsData[problemId];
  
  if (!problem) {
    console.error('Problem not found:', problemId);
    console.log('Available IDs:', Object.keys(problemsData));
    return;  // ← REMOVED the alert, just return silently
  }
  
  // Reset wizard state completely
  wizardState.reset();
  wizardState.problemId = problemId;
  wizardState.problem = problem;
  
  // Show modal
  const modal = document.getElementById('wizardModal');
  if (modal) {
    modal.classList.add('active');
  }
  
  // Set title
  const titleEl = document.getElementById('questionTitle');
  if (titleEl) {
    titleEl.textContent = problem.title || 'Legal Issue';
  }
  
  // Render first step
  renderWizardStep(1);
}

// ── RENDER WIZARD STEP (BUG FIX #4) ───────────────────────────
function renderWizardStep(step) {
  wizardState.currentStep = step;
  
  // Update progress indicators
  updateWizardProgress(step);
  
  if (step === 1) {
    renderStateSelection();
  } else if (step === 2) {
    renderQuestions();
  } else if (step === 3) {
    renderActionPlanFinal();
  }
}

// ── UPDATE PROGRESS INDICATOR ─────────────────────────────────
function updateWizardProgress(step) {
  [1, 2, 3].forEach(n => {
    const stepEl = document.querySelector(`[data-step="${n}"]`);
    if (stepEl) {
      stepEl.classList.toggle('active', n === step);
      stepEl.classList.toggle('completed', n < step);
    }
  });
}

// ── STEP 1: STATE SELECTION ───────────────────────────────────
function renderStateSelection() {
  // Hide all steps first
  hideAllWizardSteps();
  
  const step1El = document.getElementById('step1');
  if (!step1El) return;
  
  step1El.style.display = 'block';
  
  const selectEl = document.getElementById('stateSelect');
  if (selectEl) {
    // Pre-select if already chosen
    if (wizardState.selectedState) {
      selectEl.value = wizardState.selectedState;
    } else {
      selectEl.value = '';
    }
  }
}

// ── STEP 2: QUESTIONS (BUG FIX #4) ────────────────────────────
function renderQuestions() {
  hideAllWizardSteps();
  
  const step2El = document.getElementById('step2');
  if (!step2El) return;
  
  step2El.style.display = 'block';
  
  const problem = wizardState.problem;
  const questions = (problem && problem.questions) ? problem.questions : [];
  
  // BUG FIX #4: If no questions, skip to step 3 directly
  if (questions.length === 0) {
    console.log('No questions for this problem, skipping to action plan');
    renderActionPlanFinal();
    return;
  }
  
  const container = document.getElementById('questionsContainer');
  if (!container) return;
  
  container.innerHTML = questions.map((q, i) => `
    <div class="question-group">
      <label class="question-label">${i + 1}. ${q.text}</label>
      <select class="question-select" data-question-id="${q.id}">
        <option value="">${currentLang === 'hi' ? 'चुनें...' : 'Select...'}</option>
        ${q.options ? q.options.map(opt => 
          `<option value="${opt}" ${wizardState.answers[q.id] === opt ? 'selected' : ''}>${opt}</option>`
        ).join('') : ''}
      </select>
    </div>
  `).join('');
}

// ── HELPER: HIDE ALL STEPS ────────────────────────────────────
function hideAllWizardSteps() {
  [1, 2, 3].forEach(n => {
    const el = document.getElementById(`step${n}`);
    if (el) el.style.display = 'none';
  });
}

// ── GO TO STEP 2 (BUG FIX #1) ─────────────────────────────────
function goToStep2() {
  try {
    const selectEl = document.getElementById('stateSelect');
    const selectedState = selectEl ? selectEl.value : '';
    
    if (!selectedState) {
      alert(currentLang === 'hi' ? 'कृपया अपना राज्य चुनें' : 'Please select your state');
      return;
    }
    
    // Save to persistent state
    wizardState.selectedState = selectedState;
    
    // Move to next step
    renderWizardStep(2);
    
  } catch (error) {
    console.error('goToStep2 error:', error);
    alert(currentLang === 'hi' ? 
      'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 
      'An error occurred. Please try again.');
  }
}

// ── GO TO STEP 3 (BUG FIX #1, #2) ─────────────────────────────
function goToStep3() {
  try {
    // Collect answers
    const selects = document.querySelectorAll('#questionsContainer .question-select');
    let allAnswered = true;
    
    selects.forEach(select => {
      const answer = select.value;
      const qId = select.dataset.questionId;
      
      if (!answer) {
        allAnswered = false;
        select.style.borderColor = 'var(--danger)';
      } else {
        wizardState.answers[qId] = answer;
        select.style.borderColor = 'var(--border)';
      }
    });
    
    if (!allAnswered) {
      alert(currentLang === 'hi' ? 'कृपया सभी प्रश्नों के उत्तर दें' : 'Please answer all questions');
      return;
    }
    
    // Move to action plan
    renderWizardStep(3);
    
  } catch (error) {
    console.error('goToStep3 error:', error);
    alert(currentLang === 'hi' ? 
      'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 
      'An error occurred. Please try again.');
  }
}

// ── STEP 3: ACTION PLAN (BUG FIX #2, #5) ──────────────────────
function renderActionPlanFinal() {
  hideAllWizardSteps();
  
  const step3El = document.getElementById('step3');
  if (!step3El) return;
  
  step3El.style.display = 'block';
  
  const problem = wizardState.problem;
  const state = wizardState.selectedState || 'Your State';
  const answers = wizardState.answers;
  
  let plan;
  
  // BUG FIX #2: Try to get action plan, fallback to default
  try {
    if (problem && typeof problem.getActionPlan === 'function') {
      plan = problem.getActionPlan(state, answers);
    }
  } catch (error) {
    console.error('getActionPlan error:', error);
  }
  
  // Always use fallback if plan is missing or incomplete
  if (!plan || !plan.steps || plan.steps.length === 0) {
    console.log('Using default action plan for:', problem ? problem.title : 'Unknown');
    plan = getDefaultActionPlan(
      problem ? problem.title : 'Your Legal Issue',
      state,
      answers
    );
  }
  
  // Render the full action plan
  renderFullActionPlanInModal(plan);
}

// ── RENDER FULL ACTION PLAN IN MODAL (BUG FIX #5) ────────────
function renderFullActionPlanInModal(plan) {
  const container = document.getElementById('actionPlanContent');
  if (!container) return;
  
  // BUG FIX #5: Add optional chaining and defaults for ALL properties
  const steps = plan.steps || [];
  const checklist = plan.downloadableChecklist || [];
  const numbers = plan.importantNumbers || [];
  const faqs = plan.faqs || [];
  const urgency = plan.urgency || 'medium';
  const deadline = plan.deadline || 'Act as soon as possible';
  const legalBasis = plan.legalBasis || '';
  const summary = plan.summary || 'Steps to resolve this issue:';
  
  const urgencyClass = {
    high: 'urgency-high',
    medium: 'urgency-medium', 
    low: 'urgency-low'
  }[urgency] || 'urgency-medium';
  
  const urgencyText = translations[currentLang][urgency] || urgency.toUpperCase();
  
  const deadlineDate = new Date();
  deadlineDate.setMonth(deadlineDate.getMonth() + 2);
  
  container.innerHTML = `
    <div class="action-header">
      <h2 class="action-title">${wizardState.problem ? wizardState.problem.title : 'Legal Issue'} — ${wizardState.selectedState || 'Your State'}</h2>
      <div class="action-meta">
        <span class="urgency-badge ${urgencyClass}">${urgencyText}</span>
        <span class="deadline-info">${translations[currentLang].actBefore}: ${deadlineDate.toLocaleDateString()}</span>
      </div>
      <p class="action-summary">${summary}</p>
      ${legalBasis ? `<p class="legal-basis"><strong>${translations[currentLang].legalBasis}:</strong> ${legalBasis}</p>` : ''}
    </div>
    
    <div class="steps-section">
      <h3 class="section-title">${translations[currentLang].steps}</h3>
      ${steps.map((step, i) => `
        <div class="step-accordion">
          <button class="step-header" aria-expanded="false" onclick="toggleStep(this)">
            <span><span class="step-number-badge">${step.stepNumber || (i+1)}</span>${step.title || ''}</span>
            <span class="step-chevron">▼</span>
          </button>
          <div class="step-content">
            <div class="step-body">
              <p class="step-detail-text">${step.description || ''}</p>
              ${step.timeframe ? `
                <div class="step-detail">
                  <div class="step-detail-label">${currentLang === 'hi' ? 'समय:' : 'Timeframe:'}</div>
                  <div class="step-detail-text">${step.timeframe}</div>
                </div>
              ` : ''}
              ${step.cost ? `
                <div class="step-detail">
                  <div class="step-detail-label">${currentLang === 'hi' ? 'लागत:' : 'Cost:'}</div>
                  <div class="step-detail-text">${step.cost}</div>
                </div>
              ` : ''}
              ${step.template ? `
                <button class="btn btn-secondary template-btn" onclick="showTemplateFromPlan(${i})">
                  ${currentLang === 'hi' ? '📄 टेम्पलेट देखें' : '📄 View Template'}
                </button>
              ` : ''}
              ${step.link ? `
                <a href="${step.link}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-link">
                  🔗 Official Website ↗
                </a>
              ` : ''}
              ${step.tip ? `<div class="step-tip">💡 ${step.tip}</div>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    
    ${checklist.length > 0 ? `
      <div class="checklist-section">
        <h3 class="section-title">${translations[currentLang].checklist}</h3>
        <ul class="checklist">
          ${checklist.map((item, idx) => `
            <li class="checklist-item" onclick="toggleChecklist(this)" data-checklist-id="${idx}">
              <input type="checkbox" class="checklist-checkbox" ${localStorage.getItem(`checklist_${wizardState.problemId || 'unknown'}_${idx}`) === 'true' ? 'checked' : ''}>
              <span class="checklist-text">${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${numbers.length > 0 ? `
      <div class="helpline-section">
        <h3 class="section-title">${translations[currentLang].helplines}</h3>
        <div class="helpline-numbers">
          ${numbers.map(num => `
            <div class="helpline-item">
              <span class="helpline-label">${num.label || ''}</span>
              <a href="tel:${num.number || ''}" class="helpline-link">${num.number || ''}</a>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div class="lawyer-section">
      <h3 class="section-title">${translations[currentLang].needLawyer}</h3>
      <div class="lawyer-cards">
        <div class="lawyer-card"><div class="lawyer-name">Vakil.com</div><a href="https://vakil.com" target="_blank" rel="noopener noreferrer" class="lawyer-link">Visit Website →</a></div>
        <div class="lawyer-card"><div class="lawyer-name">LawRato.com</div><a href="https://lawrato.com" target="_blank" rel="noopener noreferrer" class="lawyer-link">Visit Website →</a></div>
        <div class="lawyer-card"><div class="lawyer-name">VidhiKarya.com</div><a href="https://vidhikarya.com" target="_blank" rel="noopener noreferrer" class="lawyer-link">Visit Website →</a></div>
      </div>
      <p class="lawyer-disclaimer">${translations[currentLang].lawyerDisclaimer}</p>
    </div>
  `;
  
  // Store current plan for templates
  window.currentActionPlan = plan;
}

// Toggle accordion step
function toggleStep(header) {
  const content = header.nextElementSibling;
  const isExpanded = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', !isExpanded);
  if (!isExpanded) {
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    content.style.maxHeight = '0';
  }
}

// Toggle checklist item
function toggleChecklist(item) {
  const checkbox = item.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    item.classList.toggle('checked', checkbox.checked);
    localStorage.setItem(`checklist_${wizardState.problemId || 'unknown'}_${item.dataset.checklistId}`, checkbox.checked);
  }
}

// Show template from plan
function showTemplateFromPlan(stepIndex) {
  const plan = window.currentActionPlan;
  if (!plan || !plan.steps) return;
  
  const step = plan.steps[stepIndex];
  if (!step || !step.template) return;
  
  const modal = document.getElementById('templateModal');
  const titleEl = document.getElementById('templateTitle');
  const contentEl = document.getElementById('templateContent');
  
  if (titleEl) titleEl.textContent = step.title + ' - Template';
  if (contentEl) contentEl.textContent = step.template;
  if (modal) modal.classList.add('active');
}

// Copy template to clipboard
function copyTemplate() {
  const content = document.getElementById('templateContent');
  if (content && content.textContent) {
    navigator.clipboard.writeText(content.textContent).then(() => {
      alert(currentLang === 'hi' ? 'टेम्पलेट कॉपी कर दिया गया!' : 'Template copied to clipboard!');
    }).catch(() => {
      alert(currentLang === 'hi' ? 'कॉपी करने में विफल' : 'Failed to copy');
    });
  }
}

// Print action plan
function printActionPlan() {
  window.print();
}

// Share action plan
async function shareActionPlan() {
  const plan = window.currentActionPlan;
  if (!plan) return;
  
  const shareData = {
    title: wizardState.problem ? wizardState.problem.title : 'Legal Issue',
    text: `${wizardState.problem ? wizardState.problem.title : 'Legal Issue'}\n\n${plan.summary}\n\n${translations[currentLang].actBefore}: ${new Date().toLocaleDateString()}`,
    url: window.location.href
  };
  
  try {
    await navigator.share(shareData);
  } catch {
    alert(currentLang === 'hi' ? 'शेयरिंग समर्थित नहीं है' : 'Sharing not supported');
  }
}

// Close wizard
function closeWizard() {
  const modal = document.getElementById('wizardModal');
  if (modal) modal.classList.remove('active');
  wizardState.reset();
}

// Close template modal
function closeTemplateModal() {
  const modal = document.getElementById('templateModal');
  if (modal) modal.classList.remove('active');
}

// ============================================
// SIMPLIFIED DATA FOR ALL 30 PROBLEMS
// ============================================
const legalData = {
    landlord_deposit: {
        id: "landlord_deposit",
        title: "Landlord not returning security deposit",
        category: "property",
        icon: categoryIcons.property,
        questions: [
            { id: "amount", text: "How much is the security deposit?", type: "select", options: ["Under ₹1 lakh", "₹1–5 lakh", "Above ₹5 lakh"] },
            { id: "duration", text: "How long since you vacated?", type: "select", options: ["Less than 30 days", "1–3 months", "More than 3 months"] },
            { id: "agreement", text: "Do you have a written rent agreement?", type: "select", options: ["Yes", "No", "Verbal only"] }
        ],
        getActionPlan: function(state, answers) {
            return {
                summary: `Send legal notice within 7 days demanding deposit return. If no response in 30 days, file at District Consumer Forum. You can claim full amount plus 18% interest and harassment compensation.`,
                urgency: answers.duration === "More than 3 months" ? "high" : "medium",
                deadline: "Act within 24 months of vacating (Limitation Act)",
                legalBasis: "Consumer Protection Act, 2019 - Deficiency in service. Security deposit must be returned as per agreement terms.",
                steps: [
                    { stepNumber: 1, title: "Send Legal Notice", description: "Draft formal notice demanding deposit return with all details. Send via registered post.", timeframe: "Within 7 days", cost: "₹0 self-drafted / ₹500-2000 via lawyer", template: generateSimpleNotice("Security Deposit Return", state), tip: "Keep postal receipt safely" },
                    { stepNumber: 2, title: "Wait 30 Days", description: "Give landlord 30 days to respond after receiving notice.", timeframe: "30 days", cost: "₹0", tip: "Many landlords comply after legal notice" },
                    { stepNumber: 3, title: "File Consumer Complaint", description: "If no response, file at District Consumer Forum. Claims under ₹5 lakh have no court fee.", timeframe: "After 30 days", cost: "₹0 (under ₹5 lakh)", tip: "File online free at edaakhil.nic.in" }
                ],
                importantNumbers: [{ label: "National Consumer Helpline", number: "1800-11-4000" }],
                downloadableChecklist: ["Collect rent receipts and agreement", "Note landlord contact details", "Write legal notice", "Send via registered post", "File consumer complaint if needed"],
                faqs: [{ q: "Do I need a lawyer?", a: "No, you can represent yourself in consumer court." }]
            };
        }
    },
    
    salary_dues: {
        id: "salary_dues",
        title: "Employer not paying salary or dues",
        category: "employment",
        icon: categoryIcons.employment,
        questions: [
            { id: "amount", text: "How much salary is owed?", type: "select", options: ["Under ₹50,000", "₹50,000 - ₹2 lakh", "Above ₹2 lakh"] },
            { id: "months", text: "For how many months pending?", type: "select", options: ["1 month", "2-3 months", "More than 3 months"] },
            { id: "contract", text: "Do you have employment contract?", type: "select", options: ["Yes", "Appointment letter", "Verbal only"] }
        ],
        getActionPlan: function(state, answers) {
            return {
                summary: `Approach Labour Commissioner for conciliation first. If that fails, file in Labour Court. Non-payment of salary violates Industrial Disputes Act and Payment of Wages Act.`,
                urgency: answers.months === "More than 3 months" ? "high" : "medium",
                deadline: "File within 3 years from due date",
                legalBasis: "Industrial Disputes Act, 1947 Section 33C; Payment of Wages Act, 1936",
                steps: [
                    { stepNumber: 1, title: "Gather Evidence", description: "Collect appointment letter, salary slips, bank statements, attendance records.", timeframe: "Immediately", cost: "₹0", tip: "Screenshot all communications" },
                    { stepNumber: 2, title: "Send Legal Notice", description: "Demand payment within 15 days via legal notice.", timeframe: "Within 7 days", cost: "₹1000-3000", tip: "Many employers settle after notice" },
                    { stepNumber: 3, title: "Approach Labour Commissioner", description: "File complaint for conciliation. Commissioner will call both parties.", timeframe: "After 15 days", cost: "₹0", tip: "Usually resolves in 1-2 months" }
                ],
                importantNumbers: [{ label: "Labour Helpline", number: "155300" }],
                downloadableChecklist: ["Collect employment proofs", "Note exact dues amount", "Send legal notice", "File at Labour Commissioner"],
                faqs: [{ q: "Can I file without written contract?", a: "Yes, with salary slips and bank statements." }]
            };
        }
    },
    
    cheque_bounce: {
        id: "cheque_bounce",
        title: "Cheque bounce / dishonoured cheque",
        category: "criminal",
        icon: categoryIcons.criminal,
        questions: [
            { id: "amount", text: "What is the cheque amount?", type: "select", options: ["Under ₹1 lakh", "₹1-10 lakh", "Above ₹10 lakh"] },
            { id: "reason", text: "Reason for bounce?", type: "select", options: ["Insufficient funds", "Signature mismatch", "Account closed"] },
            { id: "notice", text: "Sent notice to issuer?", type: "select", options: ["No", "Yes, legal notice", "Yes, ordinary letter"] }
        ],
        getActionPlan: function(state, answers) {
            return {
                summary: `Cheque bounce is criminal offence under Section 138. Send legal notice within 30 DAYS (mandatory deadline). If no payment in 15 days after notice, file criminal complaint. Punishable with up to 2 years jail.`,
                urgency: "high",
                deadline: "CRITICAL: Send notice within 30 days of bounce memo",
                legalBasis: "Section 138 Negotiable Instruments Act, 1881",
                steps: [
                    { stepNumber: 1, title: "Get Bank Return Memo", description: "Collect stamped return memo from bank. Keep original cheque safely.", timeframe: "Immediately", cost: "₹0", tip: "Take photos of cheque" },
                    { stepNumber: 2, title: "Send Legal Notice (30 DAY DEADLINE)", description: "MANDATORY: Send notice within 30 days of bounce. Demand payment in 15 days.", timeframe: "WITHIN 30 DAYS - CRITICAL!", cost: "₹1500-5000", tip: "This deadline is EXTREMELY important" },
                    { stepNumber: 3, title: "File Criminal Complaint", description: "If no payment in 15 days, file case before Magistrate within next 30 days.", timeframe: "Within 30 days after 15-day period", cost: "₹10,000-50,000 with lawyer", tip: "Threat of jail ensures payment" }
                ],
                importantNumbers: [{ label: "Bank Customer Care", number: "Check bank website" }],
                downloadableChecklist: ["Get bank return memo", "Calculate 30-day deadline", "Send legal notice ASAP", "Track delivery", "File case if no payment"],
                faqs: [{ q: "What if I miss 30-day deadline?", a: "You lose criminal remedy. Can only file civil suit." }]
            };
        }
    },
    
    consumer_defect: {
        id: "consumer_defect",
        title: "Consumer product defect or poor service",
        category: "consumer",
        icon: categoryIcons.consumer,
        questions: [
            { id: "value", text: "Product/service value?", type: "select", options: ["Under ₹5 lakh", "₹5-10 lakh", "Above ₹10 lakh"] },
            { id: "age", text: "Purchase date?", type: "select", options: ["Within 30 days", "1-6 months", "6 months - 2 years", "Over 2 years"] },
            { id: "defect", text: "Defect type?", type: "select", options: ["Manufacturing defect", "Not as described", "Poor service", "Warranty issue"] }
        ],
        getActionPlan: function(state, answers) {
            return {
                summary: `File complaint at edaakhil.nic.in (free online portal). You can get refund, replacement, repair, or compensation. No lawyer needed. Fast resolution compared to regular courts.`,
                urgency: "medium",
                deadline: "File within 2 years of purchase",
                legalBasis: "Consumer Protection Act, 2019",
                steps: [
                    { stepNumber: 1, title: "Gather Documents", description: "Collect invoice, warranty card, photos of defect, communications with company.", timeframe: "Immediately", cost: "₹0", tip: "Take clear photos/videos" },
                    { stepNumber: 2, title: "Complain to Company", description: "Send formal complaint to company customer care. Give 15 days to resolve.", timeframe: "15 days", cost: "₹0", tip: "Tag them on Twitter for quick response" },
                    { stepNumber: 3, title: "File at E-Daakhil", description: "Register at edaakhil.nic.in and file Form-I. Upload documents. Attend hearing via video conference.", timeframe: "After 15 days", cost: "₹0 (under ₹5 lakh)", tip: "Completely free and online" }
                ],
                importantNumbers: [{ label: "Consumer Helpline", number: "1800-11-4000" }],
                downloadableChecklist: ["Find invoice", "Photograph defect", "Email company", "Register on edaakhil.nic.in", "File complaint online"],
                faqs: [{ q: "Need lawyer?", a: "No! File yourself easily." }]
            };
        }
    },
    
    police_fir: {
        id: "police_fir",
        title: "Police not registering FIR (Zero FIR)",
        category: "criminal",
        icon: categoryIcons.criminal,
        questions: [
            { id: "crime", text: "Crime type?", type: "select", options: ["Theft/Cheating", "Assault", "Fraud", "Harassment", "Other"] },
            { id: "attempts", text: "How many times tried?", type: "select", options: ["Once", "2-3 times", "More than 3 times"] },
            { id: "urgent", text: "Emergency?", type: "select", options: ["Yes, urgent", "Moderately urgent", "Not urgent"] }
        ],
        getActionPlan: function(state, answers) {
            return {
                summary: `Police MUST register FIR for cognizable offences (Section 154 CrPC). If refused: (1) Meet SHO, (2) Send to SP/Commissioner, (3) File before Magistrate u/s 156(3), (4) Approach Human Rights Commission. Zero FIR can be filed at any police station.`,
                urgency: answers.urgent.includes("Yes") ? "high" : "medium",
                deadline: "File immediately - delay weakens case",
                legalBasis: "Section 154 CrPC; Lalita Kumari vs State (2014) Supreme Court judgment",
                steps: [
                    { stepNumber: 1, title: "Write Detailed Complaint", description: "Draft complaint with all facts: date, time, place, accused details, what happened, witnesses.", timeframe: "Immediately", cost: "₹0", tip: "Make 2-3 copies" },
                    { stepNumber: 2, title: "Meet SHO", description: "Take complaint to police station. Meet SHO directly. Cite Section 154 CrPC and Lalita Kumari case.", timeframe: "Same day", cost: "₹0", tip: "Be firm but respectful" },
                    { stepNumber: 3, title: "Send to SP/Commissioner", description: "If SHO refuses, send complaint to SP via registered post with acknowledgement.", timeframe: "Within 24-48 hours", cost: "₹50-100", tip: "Keep postal receipt" },
                    { stepNumber: 4, title: "File Before Magistrate", description: "File private complaint u/s 156(3) CrPC before Judicial Magistrate. Magistrate can order FIR registration.", timeframe: "Within reasonable time", cost: "₹2000-5000", tip: "Very effective remedy" }
                ],
                importantNumbers: [{ label: "Police Emergency", number: "100" }, { label: "Women Helpline", number: "1091" }],
                downloadableChecklist: ["Write detailed complaint", "Meet SHO", "If refused, send to SP", "File before Magistrate u/s 156(3)"],
                faqs: [{ q: "What is Zero FIR?", a: "FIR at any police station regardless of jurisdiction. Mandatory for serious crimes." }]
            };
        }
    }
};

// Simplified templates for other problems
function generateSimpleNotice(type, state) {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    return `LEGAL NOTICE

Date: ${today}

To,
[Opposite Party Name]
[Complete Address]

Subject: Legal Notice for ${type}

Respected Sir/Madam,

Under instructions from my client Mr./Ms. [YOUR NAME], resident of [ADDRESS], I serve you this notice:

My client has suffered ${type.toLowerCase()} due to your actions/inactions causing loss and harassment.

Details: [DESCRIBE YOUR SITUATION IN DETAIL]

This is illegal and violative of legal rights.

I call upon you to rectify this within 15 days failing which legal action shall be initiated.

Yours faithfully,

[YOUR NAME]
[CONTACT]

Send via Registered Post AD`;
}

// Add simplified entries for remaining 25 problems (coming soon - structure ready)
// These will be expanded progressively
problemsList.slice(4).forEach(p => {
    if (!legalData[p.id]) {
        legalData[p.id] = {
            id: p.id,
            title: p.title,
            category: p.category,
            icon: categoryIcons[p.category],
            questions: [
                { id: "q1", text: "Briefly describe your situation", type: "text" },
                { id: "q2", text: "When did this occur?", type: "select", options: ["Within 30 days", "1-6 months ago", "More than 6 months ago"] },
                { id: "q3", text: "Do you have supporting documents?", type: "select", options: ["Yes", "Some", "No"] }
            ],
            getActionPlan: function(state, answers) {
                return {
                    summary: `Detailed guide for ${p.title} coming soon. Meanwhile, gather all relevant documents and consult with a legal expert. This feature is under development.`,
                    urgency: "medium",
                    deadline: "Consult lawyer within 30 days",
                    legalBasis: "Applicable laws depend on specifics",
                    steps: [
                        { stepNumber: 1, title: "Gather Documents", description: "Collect all relevant papers, communications, and evidence.", timeframe: "Immediately", cost: "₹0", tip: "Organize chronologically" },
                        { stepNumber: 2, title: "Consult Lawyer", description: "Seek professional legal advice for your specific situation.", timeframe: "Within 15 days", cost: "₹500-2000", tip: "Bring all documents" },
                        { stepNumber: 3, title: "Send Legal Notice", description: "Most disputes resolve after formal legal notice.", timeframe: "As advised by lawyer", cost: "₹1000-3000", tip: "Keep proof of delivery" }
                    ],
                    importantNumbers: [{ label: "Legal Aid", number: "Contact District Legal Services Authority" }],
                    downloadableChecklist: ["Gather all documents", "Note down timeline", "Consult lawyer", "Send legal notice"],
                    faqs: [{ q: "When will full guide be available?", a: "We're adding detailed guides regularly. Check back soon!" }]
                };
            }
        };
    }
});
