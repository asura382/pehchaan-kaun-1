/* NyayPath - Complete Indian Laws Database */
/* Searchable database of important Indian legislation */

var indianLaws = {
  // ════════════════════════════════════════════════════
  // CRIMINAL LAWS
  // ════════════════════════════════════════════════════
  
  ipc_420: {
    id: "ipc_420",
    name: "Section 420 IPC — Cheating",
    category: "criminal",
    tags: ["cheating", "fraud", "IPC 420", "धारा 420", "dishonest inducement"],
    description: "Punishment for cheating and dishonestly inducing delivery of property",
    fullText: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to 7 years + Fine",
    cognizable: true,
    bailable: false,
    relatedSections: ["IPC 406", "IPC 409", "IPC 415"]
  },
  
  ipc_302: {
    id: "ipc_302",
    name: "Section 302 IPC — Murder",
    category: "criminal",
    tags: ["murder", "homicide", "killing", "IPC 302"],
    description: "Punishment for murder",
    fullText: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or Life Imprisonment + Fine",
    cognizable: true,
    bailable: false,
    relatedSections: ["IPC 304", "IPC 307", "IPC 308"]
  },
  
  ipc_304: {
    id: "ipc_304",
    name: "Section 304 IPC — Culpable Homicide not amounting to Murder",
    category: "criminal",
    tags: ["culpable homicide", "rash driving", "death by negligence"],
    description: "Punishment for culpable homicide not amounting to murder",
    fullText: "Whoever commits culpable homicide not amounting to murder, shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine, if the act by which the death is caused is done with the intention of causing death, or of causing such bodily injury as is likely to cause death.",
    punishment: "Life imprisonment or 10 years + Fine",
    cognizable: true,
    bailable: false,
    relatedSections: ["IPC 304A", "IPC 279", "IPC 338"]
  },
  
  ipc_304a: {
    id: "ipc_304a",
    name: "Section 304A IPC — Death by Negligence",
    category: "criminal",
    tags: ["negligence", "accident", "rash driving", "medical negligence"],
    description: "Causing death by doing any rash or negligent act",
    fullText: "Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    punishment: "Imprisonment up to 2 years or Fine or Both",
    cognizable: true,
    bailable: true,
    relatedSections: ["IPC 304", "IPC 279", "IPC 336", "IPC 337", "IPC 338"]
  },
  
  ipc_279: {
    id: "ipc_279",
    name: "Section 279 IPC — Rash Driving",
    category: "criminal",
    tags: ["rash driving", "dangerous driving", "traffic offence"],
    description: "Rash driving or riding on a public way",
    fullText: "Whoever drives any vehicle, or rides, on any public way in a manner so rash or negligent as to endanger human life, or to be likely to cause hurt or injury to any other person, shall be punished with imprisonment of either description for a term which may extend to six months, or with fine which may extend to one thousand rupees, or with both.",
    punishment: "6 months or ₹1000 or Both",
    cognizable: true,
    bailable: true,
    relatedSections: ["IPC 304A", "MV Act 181-183"]
  },
  
  ipc_323: {
    id: "ipc_323",
    name: "Section 323 IPC — Voluntarily Causing Hurt",
    category: "criminal",
    tags: ["assault", "hurt", "beating", "violence"],
    description: "Punishment for voluntarily causing hurt",
    fullText: "Whoever, except in the case provided for by section 334, voluntarily causes hurt, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both.",
    punishment: "1 year or ₹1000 or Both",
    cognizable: false,
    bailable: true,
    relatedSections: ["IPC 324", "IPC 325", "IPC 326"]
  },
  
  ipc_498a: {
    id: "ipc_498a",
    name: "Section 498A IPC — Cruelty by Husband/Relatives",
    category: "criminal",
    tags: ["domestic violence", "cruelty", "dowry", "husband", "498A"],
    description: "Husband or relative of husband of a woman subjecting her to cruelty",
    fullText: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine.",
    punishment: "3 years + Fine",
    cognizable: true,
    bailable: false,
    relatedSections: ["DV Act", "Dowry Prohibition Act"]
  },
  
  ipc_376: {
    id: "ipc_376",
    name: "Section 376 IPC — Rape",
    category: "criminal",
    tags: ["rape", "sexual assault", "POCSO"],
    description: "Punishment for rape",
    fullText: "Whoever, except in the cases provided for by sub-section (2), commits rape, shall be punished with rigorous imprisonment of either description for a term which shall not be less than seven years, but which may extend to imprisonment for life, and shall also be liable to fine.",
    punishment: "Minimum 7 years (can extend to Life)",
    cognizable: true,
    bailable: false,
    relatedSections: ["IPC 376A", "IPC 376D", "POCSO Act"]
  },
  
  // ════════════════════════════════════════════════════
  // MOTOR VEHICLES LAW
  // ════════════════════════════════════════════════════
  
  mv_act_181: {
    id: "mv_act_181",
    name: "Motor Vehicles Act Section 181 — Disobedience of Order",
    category: "traffic",
    tags: ["disobedience", "traffic order", "challan", "MV Act"],
    description: "Penalty for disobedience of orders of public servants",
    fullText: "Whoever contravenes any provision of this Act or of any rule made thereunder or of any notification issued under section 111 shall, on first conviction, be punished with fine which may extend to one hundred rupees, and, if having been previously convicted of an offence under this section he is again convicted of an offence under this section, with fine which may extend to three hundred rupees.",
    punishment: "₹100 first offence, ₹300 repeat",
    cognizable: false,
    bailable: true,
    relatedSections: ["MV Act 182", "MV Act 183", "IPC 186"]
  },
  
  mv_act_182: {
    id: "mv_act_182",
    name: "MV Act Section 182 — False Information",
    category: "traffic",
    tags: ["false info", "fake documents", "MV Act"],
    description: "Penalty for false information",
    fullText: "Whoever furnishes any false information or makes a false statement which, to his knowledge or belief, is false in any material particular for the purpose of obtaining a licence or certificate of registration or badge or permit or any other document under this Act shall be punishable with imprisonment for a term which may extend to three months, or with fine which may extend to five hundred rupees, or with both.",
    punishment: "3 months or ₹500 or Both",
    cognizable: false,
    bailable: true,
    relatedSections: ["MV Act 181", "IPC 177"]
  },
  
  mv_act_183: {
    id: "mv_act_183",
    name: "MV Act Section 183 — First Conviction for Dangerous Driving",
    category: "traffic",
    tags: ["dangerous driving", "first offence", "MV Act"],
    description: "Penalty for first conviction for driving at excessive speed",
    fullText: "Whoever drives a motor vehicle in contravention of section 112 (speed limits) shall be punished with fine which may extend to five hundred rupees.",
    punishment: "₹500",
    cognizable: false,
    bailable: true,
    relatedSections: ["MV Act 184", "MV Act 185"]
  },
  
  mv_act_185: {
    id: "mv_act_185",
    name: "MV Act Section 185 — Drunk Driving",
    category: "traffic",
    tags: ["drunk driving", "DUI", "alcohol", "driving offence"],
    description: "Driving by a drunken person or by a person who is under the influence of a drug",
    fullText: "Whoever, while driving, or attempting to drive, a motor vehicle— (a) has, in his blood, alcohol exceeding 30 mg per 100 ml of blood detected in a test by a breath analyser, or (b) is under the influence of a drug to such an extent as to be incapable of exercising proper control over the vehicle, shall be punished for the first offence with imprisonment for a term which may extend to six months, or with fine which may extend to ten thousand rupees, or with both.",
    punishment: "First offence: 6 months or ₹10,000 or Both. Repeat: 2 years or ₹15,000",
    cognizable: true,
    bailable: true,
    relatedSections: ["IPC 279", "MV Act 186"]
  },
  
  mv_act_194: {
    id: "mv_act_194",
    name: "MV Act Section 194 — Dangerous Driving",
    category: "traffic",
    tags: ["dangerous driving", "racing", "overspeeding"],
    description: "Dangerous driving",
    fullText: "Whoever drives a motor vehicle, or causes or allows a vehicle to be driven, in contravention of section 184 shall be punished with imprisonment for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both, and for any subsequent offence with imprisonment which may extend to two years, or with fine which may extend to two thousand rupees, or with both.",
    punishment: "1st: 1 year or ₹1000. Repeat: 2 years or ₹2000",
    cognizable: true,
    bailable: true,
    relatedSections: ["MV Act 183", "MV Act 184", "IPC 279", "IPC 304A"]
  },
  
  mv_act_196: {
    id: "mv_act_196",
    name: "MV Act Section 196 — Driving Without Insurance",
    category: "traffic",
    tags: ["no insurance", "third party", "mandatory insurance"],
    description: "Driving without insurance",
    fullText: "Whoever drives a motor vehicle in contravention of section 146 (insurance requirement) shall be punished with imprisonment which may extend to three months, or with fine which may extend to one thousand rupees, or with both.",
    punishment: "3 months or ₹1000 or Both",
    cognizable: false,
    bailable: true,
    relatedSections: ["MV Act 146", "MV Act 197"]
  },
  
  // ════════════════════════════════════════════════════
  // CONSUMER PROTECTION
  // ════════════════════════════════════════════════════
  
  consumer_act_2_7: {
    id: "consumer_act_2_7",
    name: "Consumer Protection Act Section 2(7) — Consumer",
    category: "consumer",
    tags: ["consumer rights", "defective goods", "deficiency service"],
    description: "Definition of 'consumer' under CPA 2019",
    fullText: "'Consumer' means any person who— (i) buys any goods for a consideration which has been paid or promised or partly paid and partly promised, or under any system of deferred payment and includes any user of such goods other than the person who buys such goods for consideration paid or promised or partly paid or partly promised; (ii) hires or avails of any service for a consideration which has been paid or promised or partly paid and partly promised.",
    punishment: "N/A (Definitional section)",
    cognizable: false,
    bailable: false,
    relatedSections: ["CPA 2(11)", "CPA 49", "CPA 50"]
  },
  
  consumer_act_2_11: {
    id: "consumer_act_2_11",
    name: "Consumer Protection Act Section 2(11) — Defect",
    category: "consumer",
    tags: ["defect", "fault", "imperfection"],
    description: "Definition of 'defect' under CPA 2019",
    fullText: "'Defect' means any fault, imperfection or shortcoming in the quality, quantity, potency, purity or standard which is required to be maintained by or under any law for the time being in force or under any contract, express or implied, or as is claimed by the trader in any manner whatsoever in relation to any goods.",
    punishment: "N/A (Definitional)",
    cognizable: false,
    bailable: false,
    relatedSections: ["CPA 2(7)", "CPA 2(16)", "CPA 49"]
  },
  
  // ════════════════════════════════════════════════════
  // LABOUR LAWS
  // ════════════════════════════════════════════════════
  
  industrial_disputes_act_33c: {
    id: "industrial_disputes_act_33c",
    name: "Industrial Disputes Act Section 33C — Recovery of Money Due",
    category: "labour",
    tags: ["salary recovery", "wages due", "labour rights", "ID Act"],
    description: "Recovery of money due from employer",
    fullText: "Where any money is due to a workman from an employer under a settlement or an award or under the provisions of Chapters VA and VB, the workman himself or any other person authorised by him in writing in this behalf, or, in the case of the death of the workman, his assignee or heirs may, make an application to the appropriate Government for the recovery of the money due to him.",
    punishment: "N/A (Recovery provision)",
    cognizable: false,
    bailable: false,
    relatedSections: ["Payment of Wages Act", "Shops & Establishments Act"]
  },
  
  payment_of_wages_act_3: {
    id: "payment_of_wages_act_3",
    name: "Payment of Wages Act Section 3 — Responsibility for Payment",
    category: "labour",
    tags: ["wages", "salary payment", "employer responsibility"],
    description: "Responsibility for payment of wages",
    fullText: "Every employer shall be responsible for the payment to persons employed by him of all wages required to be paid under this Act.",
    punishment: "Violation: Fine up to ₹5000",
    cognizable: false,
    bailable: true,
    relatedSections: ["Industrial Disputes Act", "Minimum Wages Act"]
  },
  
  // ════════════════════════════════════════════════════
  // NEGOTIABLE INSTRUMENTS ACT
  // ════════════════════════════════════════════════════
  
  ni_act_138: {
    id: "ni_act_138",
    name: "Negotiable Instruments Act Section 138 — Cheque Bounce",
    category: "criminal",
    tags: ["cheque bounce", "dishonour", "NI Act 138", "cheque fraud"],
    description: "Dishonour of cheque for insufficiency of funds",
    fullText: "Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid, either because of the amount of money standing to the credit of that account is insufficient to honour the cheque or that it exceeds the amount arranged to be paid from that account by an agreement made with that bank, such person shall be deemed to have committed an offence.",
    punishment: "Up to 2 years or twice the cheque amount or Both",
    cognizable: false,
    bailable: true,
    relatedSections: ["NI Act 139", "NI Act 141", "NI Act 142"]
  },
  
  // ════════════════════════════════════════════════════
  // SPECIAL CRIMINAL LAWS
  // ════════════════════════════════════════════════════
  
  ndps_act_20: {
    id: "ndps_act_20",
    name: "NDPS Act Section 20 — Cannabis Preparations",
    category: "criminal",
    tags: ["drugs", "cannabis", "ganja", "charas", "NDPS"],
    description: "Punishment for production, manufacture, possession, sale, purchase, transport, import inter-State, export inter-State or use of cannabis (hemp) plant",
    fullText: "Contravention relating to cannabis plant: Whoever, in contravention of any provision of this Act or any rule or order made or condition of licence granted thereunder, cultivates any cannabis plant; or produces, manufactures, possesses, sells, purchases, transports, imports inter-State, exports inter-State or uses cannabis plant shall be punished with rigorous imprisonment for a term which may extend to six months, or with fine which may extend to ten thousand rupees, or with both.",
    punishment: "Small quantity: 6 months or ₹10,000. Commercial: 10-20 years + ₹1-2 lakh",
    cognizable: true,
    bailable: false,
    relatedSections: ["NDPS Act 21", "NDPS Act 22", "NDPS Act 23"]
  },
  
  arms_act_25: {
    id: "arms_act_25",
    name: "Arms Act Section 25 — Offences and Punishment",
    category: "criminal",
    tags: ["arms", "weapons", "gun", "firearm"],
    description: "Offences and punishments under Arms Act",
    fullText: "Whoever contravenes any provision of this Act or of any rule or order made thereunder shall be punished with imprisonment for a term which shall not be less than one year but which may extend to three years and with fine.",
    punishment: "1-3 years + Fine",
    cognizable: true,
    bailable: false,
    relatedSections: ["Arms Act 26", "Arms Act 27"]
  },
  
  // ════════════════════════════════════════════════════
  // INFORMATION TECHNOLOGY ACT
  // ════════════════════════════════════════════════════
  
  it_act_66: {
    id: "it_act_66",
    name: "IT Act Section 66 — Computer Related Offences",
    category: "criminal",
    tags: ["cyber crime", "hacking", "computer offence", "IT Act"],
    description: "Computer related offences — hacking, data theft, etc.",
    fullText: "If any person, fraudulently or dishonestly does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine which may extend to five lakh rupees or with both.",
    punishment: "3 years or ₹5 lakh or Both",
    cognizable: true,
    bailable: true,
    relatedSections: ["IT Act 43", "IT Act 66A", "IT Act 66B", "IT Act 66C"]
  },
  
  it_act_66c: {
    id: "it_act_66c",
    name: "IT Act Section 66C — Identity Theft",
    category: "criminal",
    tags: ["identity theft", "password theft", "electronic signature"],
    description: "Punishment for identity theft",
    fullText: "Whoever, fraudulently or dishonestly make use of the electronic signature, password or any other unique identification feature of any other person, known as identity theft, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to rupees one lakh.",
    punishment: "3 years + ₹1 lakh",
    cognizable: true,
    bailable: true,
    relatedSections: ["IT Act 66", "IT Act 66D", "IPC 420"]
  },
  
  // ════════════════════════════════════════════════════
  // DOMESTIC VIOLENCE ACT
  // ════════════════════════════════════════════════════
  
  dv_act_12: {
    id: "dv_act_12",
    name: "Protection of Women from Domestic Violence Act Section 12",
    category: "family",
    tags: ["domestic violence", "protection order", "DV Act", "women rights"],
    description: "Application to Magistrate for reliefs",
    fullText: "An aggrieved person or a Protection Officer or any other person on behalf of the aggrieved person may present an application to the Magistrate seeking one or more reliefs under this Act.",
    punishment: "N/A (Procedural)",
    cognizable: false,
    bailable: false,
    relatedSections: ["DV Act 17", "DV Act 18", "DV Act 19", "DV Act 20"]
  },
  
  dv_act_17: {
    id: "dv_act_17",
    name: "DV Act Section 17 — Right to Residence",
    category: "family",
    tags: ["right to residence", "shared household", "eviction protection"],
    description: "Right to residence in shared household",
    fullText: "Notwithstanding anything contained in any other law for the time being in force, every woman in a domestic relationship shall have right to reside in the shared household, whether or not she has any right, title or beneficial interest in the same.",
    punishment: "N/A (Substantive right)",
    cognizable: false,
    bailable: false,
    relatedSections: ["DV Act 12", "DV Act 19"]
  }
};

// Search function
function searchLaws(query) {
  const results = [];
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  Object.values(indianLaws).forEach(law => {
    const searchText = `${law.name} ${law.description} ${law.tags.join(' ')} ${law.fullText}`.toLowerCase();
    const relevanceScore = searchTerms.filter(term => searchText.includes(term)).length;
    
    if (relevanceScore > 0) {
      results.push({ ...law, relevanceScore });
    }
  });
  
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { indianLaws, searchLaws };
}
