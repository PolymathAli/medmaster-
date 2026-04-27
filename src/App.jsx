import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Shuffle, RefreshCw, ChevronRight, Award, CheckCircle,
  XCircle, AlertCircle, BookOpen, Target, Filter, Zap, TrendingUp
} from 'lucide-react';

// ─────────────────────────────────────────────
//  STYLES — injected into <head> at mount
// ─────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #080b12;
  --surface:  #0e1219;
  --card:     #131925;
  --card-h:   #171e2c;
  --border:   rgba(255,255,255,0.06);
  --border-h: rgba(99,201,255,0.22);
  --sky:      #63c9ff;
  --sky-dim:  rgba(99,201,255,0.12);
  --mint:     #34d9b3;
  --mint-dim: rgba(52,217,179,0.12);
  --rose:     #f87171;
  --rose-dim: rgba(248,113,113,0.12);
  --amber:    #fbbf24;
  --purple:   #a78bfa;
  --text:     #e2e8f0;
  --text2:    #8a98b0;
  --text3:    #3d4d63;
  --r:        16px;
  --r-sm:     10px;
  --r-lg:     22px;
  --shadow:   0 4px 24px rgba(0,0,0,0.45);
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ── GRID NOISE BACKGROUND ── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(99,201,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,201,255,0.025) 1px, transparent 1px);
  background-size: 56px 56px;
}

/* ── GLOW BLOBS ── */
.glow-1, .glow-2 {
  position: fixed; border-radius: 50%;
  pointer-events: none; z-index: 0; filter: blur(90px);
}
.glow-1 {
  width: 500px; height: 500px;
  top: -120px; left: -120px;
  background: radial-gradient(circle, rgba(99,201,255,0.07) 0%, transparent 70%);
}
.glow-2 {
  width: 400px; height: 400px;
  bottom: -80px; right: -80px;
  background: radial-gradient(circle, rgba(52,217,179,0.06) 0%, transparent 70%);
}

/* ── LAYOUT ── */
.app-shell { position: relative; z-index: 1; }

.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(8,11,18,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1260px; margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-wrap: wrap;
}

.logo-wrap { display: flex; align-items: center; gap: 10px; }

.logo-icon {
  width: 38px; height: 38px; border-radius: 11px;
  background: linear-gradient(135deg, var(--sky), var(--mint));
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px rgba(99,201,255,0.35);
}

.logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 20px; font-weight: 800; letter-spacing: -0.3px;
  background: linear-gradient(135deg, var(--sky) 0%, var(--mint) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub { font-size: 11px; color: var(--text3); margin-top: 1px; letter-spacing: 0.04em; }

.header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.score-chip {
  display: flex; align-items: center; gap: 6px;
  background: var(--sky-dim);
  border: 1px solid rgba(99,201,255,0.22);
  border-radius: 100px; padding: 6px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; color: var(--sky); font-weight: 500;
  white-space: nowrap;
}

.pct-chip {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 100px; padding: 6px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: var(--text2);
  white-space: nowrap;
}

.icon-btn {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text2);
  transition: all 0.18s ease;
}
.icon-btn:hover { background: rgba(255,255,255,0.08); color: var(--text); border-color: rgba(255,255,255,0.12); }

/* ── PROGRESS BAR ── */
.progress-bar-wrap { padding: 0; }
.progress-track { height: 2.5px; background: rgba(255,255,255,0.05); }
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sky), var(--mint));
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── MAIN LAYOUT ── */
.main-layout {
  max-width: 1260px; margin: 0 auto;
  padding: 28px 28px 60px;
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 24px;
}
@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
  .header-inner { padding: 12px 18px; }
  .main-layout { padding: 18px 16px 60px; }
}

/* ── SIDEBAR ── */
.sidebar {
  position: sticky; top: 70px;
  height: fit-content; max-height: calc(100vh - 90px);
  overflow-y: auto; display: flex; flex-direction: column; gap: 14px;
  scrollbar-width: none;
}
.sidebar::-webkit-scrollbar { display: none; }

/* ── GLASS CARD ── */
.g-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 20px;
  transition: border-color 0.25s, box-shadow 0.25s;
}

/* ── SEARCH ── */
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
.search-input {
  width: 100%; padding: 10px 14px 10px 38px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  color: var(--text);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.search-input:focus { border-color: var(--border-h); background: rgba(99,201,255,0.04); }
.search-input::placeholder { color: var(--text3); }

/* ── SECTION LABEL ── */
.section-label {
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text3); margin-bottom: 10px;
}

/* ── CATEGORY PILLS (sidebar) ── */
.cat-list { display: flex; flex-direction: column; gap: 4px; }
.cat-btn {
  padding: 8px 12px; border-radius: var(--r-sm);
  border: none; background: transparent;
  color: var(--text2); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 500; text-align: left; cursor: pointer;
  transition: all 0.18s ease; display: flex; justify-content: space-between; align-items: center;
}
.cat-btn:hover { background: rgba(255,255,255,0.04); color: var(--text); }
.cat-btn.active { background: var(--sky-dim); color: var(--sky); }
.cat-count {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  background: rgba(255,255,255,0.06); border-radius: 100px;
  padding: 2px 8px; color: var(--text3);
}
.cat-btn.active .cat-count { background: rgba(99,201,255,0.15); color: var(--sky); }

/* ── STATS GRID ── */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.stat-cell {
  background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  border-radius: var(--r-sm); padding: 12px;
  text-align: center;
}
.stat-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: var(--text); }
.stat-lbl { font-size: 10.5px; color: var(--text3); margin-top: 2px; letter-spacing: 0.04em; }
.stat-val.sky { color: var(--sky); }
.stat-val.mint { color: var(--mint); }
.stat-val.rose { color: var(--rose); }

/* ── ACTION BTNS ── */
.action-btn {
  width: 100%; padding: 9px 14px; border-radius: var(--r-sm);
  border: 1px solid var(--border); background: rgba(255,255,255,0.03);
  color: var(--text2); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.18s;
}
.action-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); border-color: rgba(255,255,255,0.12); }
.action-btn.sky { background: var(--sky-dim); border-color: rgba(99,201,255,0.25); color: var(--sky); }
.action-btn.sky:hover { background: rgba(99,201,255,0.2); }
.action-btn.danger { background: var(--rose-dim); border-color: rgba(248,113,113,0.25); color: var(--rose); }
.action-btn.danger:hover { background: rgba(248,113,113,0.2); }

/* ── QUESTION AREA HEADER ── */
.q-area-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
}
.q-area-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
.q-count-badge {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  color: var(--text3); background: rgba(255,255,255,0.04);
  border: 1px solid var(--border); border-radius: 100px;
  padding: 4px 14px;
}

/* ── QUESTION CARDS ── */
.q-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 24px;
  transition: border-color 0.3s, box-shadow 0.3s;
  animation: cardIn 0.35s ease forwards;
}
.q-card:hover { border-color: rgba(255,255,255,0.09); }
.q-card.correct { border-color: rgba(52,217,179,0.35); box-shadow: 0 0 28px rgba(52,217,179,0.07); }
.q-card.incorrect { border-color: rgba(248,113,113,0.35); box-shadow: 0 0 28px rgba(248,113,113,0.07); }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.q-card-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 10px; margin-bottom: 16px;
}

.q-num-badge {
  min-width: 32px; height: 32px; border-radius: 9px;
  background: rgba(255,255,255,0.05); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--text3); font-weight: 500; flex-shrink: 0;
}

.q-cat-tag {
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
  background: rgba(255,255,255,0.05); color: var(--text3);
  white-space: nowrap; border: 1px solid var(--border);
}

.q-text {
  font-size: 15.5px; font-weight: 600; line-height: 1.6;
  color: var(--text); margin-bottom: 18px;
}

/* ── OPTIONS ── */
.options-list { display: flex; flex-direction: column; gap: 9px; }

.opt-btn {
  width: 100%; text-align: left;
  padding: 13px 16px; border-radius: 13px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
  color: var(--text2); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14.5px; font-weight: 500; cursor: pointer;
  display: flex; align-items: center; gap: 12px;
  transition: all 0.2s ease;
}
.opt-btn:not(:disabled):hover {
  border-color: var(--border-h);
  background: rgba(99,201,255,0.05);
  color: var(--text);
}
.opt-btn:disabled { cursor: default; }

.opt-letter {
  width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--text3); font-weight: 500; transition: all 0.2s;
}

.opt-btn.opt-correct {
  background: var(--mint-dim);
  border-color: rgba(52,217,179,0.45);
  color: var(--mint);
}
.opt-btn.opt-correct .opt-letter {
  background: rgba(52,217,179,0.2); border-color: rgba(52,217,179,0.4); color: var(--mint);
}

.opt-btn.opt-wrong {
  background: var(--rose-dim);
  border-color: rgba(248,113,113,0.45);
  color: var(--rose);
}
.opt-btn.opt-wrong .opt-letter {
  background: rgba(248,113,113,0.2); border-color: rgba(248,113,113,0.4); color: var(--rose);
}

.opt-btn.opt-dim { opacity: 0.28; }

/* ── EXPLANATION ── */
.explanation {
  margin-top: 14px; padding: 14px 16px;
  background: rgba(99,201,255,0.04);
  border: 1px solid rgba(99,201,255,0.12);
  border-radius: 13px;
  animation: slideDown 0.28s ease forwards;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.exp-label { font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 5px; }
.exp-label.correct { color: var(--mint); }
.exp-label.incorrect { color: var(--rose); }
.exp-text { font-size: 13.5px; line-height: 1.65; color: var(--text2); }

/* ── EMPTY STATE ── */
.empty-state {
  text-align: center; padding: 60px 20px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--r-lg);
}
.empty-icon { color: var(--text3); margin: 0 auto 16px; display: block; }
.empty-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.empty-sub { font-size: 14px; color: var(--text2); }

/* ── COMPLETION BANNER ── */
.completion-banner {
  background: linear-gradient(135deg, rgba(52,217,179,0.1), rgba(99,201,255,0.1));
  border: 1px solid rgba(52,217,179,0.3);
  border-radius: var(--r-lg); padding: 24px; text-align: center;
  margin-bottom: 24px; animation: cardIn 0.4s ease forwards;
}
.completion-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.completion-sub { font-size: 14px; color: var(--text2); }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }

/* ── DIVIDER ── */
.divider { height: 1px; background: var(--border); margin: 14px 0; }
`;

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────
const initialMcqData = [
  { id: 1, category: "Terminally Ill & Ethics", question: "What is the primary goal of end-of-life care for dying patients?", options: ["To artificially prolong life as much as possible using modern technology.", "To prevent or relieve suffering as much as possible while respecting the patients' desires.", "To protect the hospital from legal liabilities during the death process.", "To force the patient into acceptance of their condition."], correctAnswer: 1, explanation: "The goal of end-of-life care is to prevent or relieve suffering as much as possible while respecting the patients' desires, dignity, and vigor." },
  { id: 2, category: "Terminally Ill & Ethics", question: "According to the provided stages of grief, what typically follows the 'Denial' stage?", options: ["Depression", "Bargaining", "Anger", "Acceptance"], correctAnswer: 2, explanation: "The stages of grief are: Denial, Anger, Bargaining, Depression, and Acceptance." },
  { id: 3, category: "Terminally Ill & Ethics", question: "A 65-year-old man is diagnosed with metastatic pancreatic cancer right before a planned round-the-world cruise. Should the physician withhold the diagnosis to prevent psychological harm?", options: ["Yes, to protect his mental health during his well-deserved vacation.", "Yes, because the family surrogate can make decisions for him while he travels.", "No, sensitive disclosure is required so the patient and his wife can make informed decisions about their trip and healthcare.", "No, but the physician should only tell the wife so she can manage his symptoms secretly."], correctAnswer: 2, explanation: "Sensitive disclosure allows the patient to decide if the trip is still important, spares him the inconvenience of suffering advancing symptoms abroad, and allows him to arrange appropriate care." },
  { id: 4, category: "Human Essence in Practice", question: "How is 'Humanism' defined in the context of medical practice?", options: ["The rigorous application of the scientific method to human biology.", "A sincere concern for the interest of the patient as an embodiment of humanity.", "The corporatization of the healthcare sector to maximize efficiency.", "Prioritizing the physician's emotional well-being over the patient's."], correctAnswer: 1, explanation: "Humanism in medicine involves a sincere concern for the interest of the patient, prioritizing human interests, values, and dignity." },
  { id: 5, category: "Human Essence in Practice", question: "In Case Scenario 4, a resident commands a medical student to practice a rectal exam on a patient without introducing themselves or getting explicit, dignified consent. Which core principle was NOT violated?", options: ["Respect", "Communication", "Compassion", "Clinical Efficiency"], correctAnswer: 3, explanation: "While the exam may have been 'efficient' for the student's learning, it flagrantly violated Respect, Care, Compassion, and Communication." },
  { id: 6, category: "Domestic Violence & Child Abuse", question: "How does the UN define Gender-Based Violence (GBV)?", options: ["Violence occurring exclusively in public spaces.", "Violence directed against a woman because she is a woman or that affects women disproportionately.", "Any conflict between marital partners regarding finances.", "Violence perpetrated solely by strangers."], correctAnswer: 1, explanation: "GBV is violence directed against a woman because she is a woman or that affects women disproportionately, resulting in physical, sexual, or psychological harm." },
  { id: 7, category: "Domestic Violence & Child Abuse", question: "Criticism, humiliation, threats, and destruction of personal belongings fall under which category of Violence Against Women?", options: ["Physical Violence", "Sexual Violence", "Psychological Violence", "Financial Abuse"], correctAnswer: 2, explanation: "Psychological violence includes criticism, humiliation, threats, verbal abuse, destruction of belongings, and accusations of mental illness." },
  { id: 8, category: "Domestic Violence & Child Abuse", question: "Which of the following bruise patterns is typically inflicted by a belt?", options: ["Two curved elliptical rows", "Curvilinear bruises", "Loop mark bruises", "Parallel linear bruises"], correctAnswer: 1, explanation: "Curvilinear bruises are typically inflicted by a belt. Loop marks are from a doubled cord, parallel lines from a hand slap/stick, and elliptical rows are bite marks." },
  { id: 9, category: "Domestic Violence & Child Abuse", question: "Which of the following fractures is a strong physical indicator of Child Abuse?", options: ["Clavicle fracture from childbirth", "Bucket Handle Fracture", "Simple distal radius fracture from a playground fall", "Stress fracture of the tibia in a teenager"], correctAnswer: 1, explanation: "Bucket Handle fractures, multiple rib fractures, and unexplained diaphysial fractures are strong indicators of child abuse and maltreatment." },
  { id: 10, category: "Forensic Medicine & Age Estimation", question: "At what age does the First Permanent Molar typically erupt in the upper teeth?", options: ["10-12 months", "6-7 years", "10-12 years", "17-21 years"], correctAnswer: 1, explanation: "The first permanent molar typically erupts between 6-7 years of age." },
  { id: 11, category: "Patients' Rights", question: "What does the acronym DROIT stand for in the context of patient rights?", options: ["Diagnosis, Recovery, Observation, Intervention, Treatment", "Dignity, Respect, Obligation, Information, Trust", "Duty, Responsibility, Order, Integrity, Transparency", "Documentation, Research, Operation, Illness, Therapy"], correctAnswer: 1, explanation: "Derived from the French word for a right, DROIT stands for Dignity, Respect, Obligation, Information, and Trust." },
  { id: 12, category: "Patients' Rights", question: "Asking a patient for permission to enquire about sensitive matters or to conduct an uncomfortable examination is an example of respecting the patient's:", options: ["Dignity", "Information", "Financial status", "Medical records"], correctAnswer: 0, explanation: "Dignity recognizes the fundamental worth of every person. Examples include appropriate draping (physical privacy) and asking permission for sensitive exams." },
  { id: 13, category: "Patients' Rights", question: "According to the Arabic Patient Rights Charter (ح حقوق المريض), when can a patient be subjected to medical research or studies?", options: ["Whenever the hospital needs data for a publication.", "Only if the patient is receiving free treatment.", "Only after their explicit agreement/consent (موافقته علي ذلك).", "If the head of the department authorizes it."], correctAnswer: 2, explanation: "Item 7 of the charter states: 'ان لا يتم اخضاع المريض لبحوث طبية أو دراسات الا بعد موافقته علي ذلك' (The patient shall not be subjected to medical research or studies except after their consent)." },
  { id: 14, category: "Domestic Violence & Child Abuse", question: "According to the presentation, which of the following practices is classified specifically under 'Sexual Violence' against women?", options: ["Battering and hitting", "Female Genital Mutilation (FGM)", "Verbal abuse and humiliation", "Crimes of passion"], correctAnswer: 1, explanation: "FGM, along with incest, buggery, forced sex, marital rape, and child marriage, is classified as a form of Sexual Violence." },
  { id: 15, category: "Domestic Violence & Child Abuse", question: "Based on WHO statistics, what proportion of women worldwide have experienced physical and/or sexual intimate partner violence or non-partner sexual violence in their lifetime?", options: ["1 in 10", "1 in 5", "1 in 3", "1 in 2"], correctAnswer: 2, explanation: "According to the WHO, approximately 1 in 3 women worldwide experience physical and/or sexual violence in their lifetime." },
  { id: 16, category: "Domestic Violence & Child Abuse", question: "What is the estimated number of Egyptian women at risk of violence each year?", options: ["2 million", "5 million", "8 million", "12 million"], correctAnswer: 2, explanation: "The presentation states that about 8 million Egyptian women are at risk of violence each year." },
  { id: 17, category: "Domestic Violence & Child Abuse", question: "What is the estimated annual cost of violence against women to the Egyptian economy?", options: ["500 Million EGP", "1.5 Billion EGP", "2.17 Billion EGP", "4.2 Billion EGP"], correctAnswer: 2, explanation: "The economic burden of violence against women in Egypt is estimated at a massive 2.17 Billion EGP per year." },
  { id: 18, category: "Domestic Violence & Child Abuse", question: "Which of the following is NOT listed as one of the three main types of violence against women in the provided slides?", options: ["Physical Violence", "Sexual Violence", "Psychological Violence", "Occupational Violence"], correctAnswer: 3, explanation: "The three main types of violence against women discussed are Physical, Sexual, and Psychological. Occupational is not listed as one of the three primary categories." },
  { id: 19, category: "Domestic Violence & Child Abuse", question: "What are the three classic phases of the 'Cycle of Violence' typically seen in domestic abuse?", options: ["Physical, Sexual, and Psychological phases", "Anger, Denial, and Acceptance phases", "Tension building, Acute battering, and Honeymoon phases", "Argument, Silence, and Resolution phases"], correctAnswer: 2, explanation: "The cycle of violence consists of the Tension building phase, the Acute battering (or explosion) phase, and the Honeymoon (remorse/reconciliation) phase." },
  { id: 20, category: "Domestic Violence & Child Abuse", question: "During the 'Honeymoon phase' of the cycle of violence, what behavior is most characteristic of the abuser?", options: ["The abuser escalates physical violence significantly.", "The abuser isolates the victim from friends and family.", "The abuser apologizes, promises it won't happen again, and acts affectionately.", "The abuser becomes highly critical and verbally abusive."], correctAnswer: 2, explanation: "In the Honeymoon phase, the abuser often shows remorse, apologizes, buys gifts, and promises that the abuse will never happen again, giving the victim false hope." },
  { id: 21, category: "Domestic Violence & Child Abuse", question: "Which of the following is considered a primary barrier that prevents victims of domestic violence from leaving their abusers?", options: ["Financial independence and job security.", "Fear of retaliation or an escalation of violence.", "Overwhelming support from law enforcement.", "The victim's desire to be physically injured."], correctAnswer: 1, explanation: "Fear for their own safety or the safety of their children is a major barrier. Often, the risk of severe violence or death increases dramatically when a victim attempts to leave." },
  { id: 22, category: "Domestic Violence & Child Abuse", question: "When a physician suspects a patient is a victim of domestic violence, what is the most appropriate initial interviewing approach?", options: ["Ask leading questions while the partner is in the room to confront them.", "Interview the patient privately in a supportive, non-judgmental manner.", "Demand the patient reports the abuse to the police immediately.", "Minimize the patient's complaints to help reduce their anxiety."], correctAnswer: 1, explanation: "A physician should always ensure privacy (separating the patient from the partner) and use a non-judgmental, compassionate approach to make the patient feel safe enough to disclose the abuse." },
  { id: 23, category: "Domestic Violence & Child Abuse", question: "Which of the following is a very common long-term psychological consequence of chronic domestic violence?", options: ["Post-Traumatic Stress Disorder (PTSD)", "Schizophrenia", "Autism Spectrum Disorder", "Narcissistic Personality Disorder"], correctAnswer: 0, explanation: "Chronic domestic violence frequently leads to profound psychological consequences including depression, anxiety, suicidal ideation, and Post-Traumatic Stress Disorder (PTSD)." },
  { id: 24, category: "Domestic Violence & Child Abuse", question: "What is the most appropriate standard for documenting physical injuries in a suspected domestic violence or GBV case?", options: ["Relying solely on the patient's verbal history of the events.", "Writing vague descriptions like 'the patient looks bruised and battered'.", "Only documenting injuries if they are severe enough to require surgery.", "Precise descriptions using body maps and, if the patient consents, photographs."], correctAnswer: 3, explanation: "Accurate medicolegal documentation is crucial. Physicians should use body maps, exact measurements, precise descriptions of injuries, and consented photographs to properly document the abuse." },
  { id: 25, category: "Domestic Violence & Child Abuse", question: "What is the absolute first priority when a healthcare provider suspects a patient is experiencing domestic violence in the clinic?", options: ["Documenting the injuries thoroughly in the medical record.", "Ensuring the patient's immediate safety and separating them from the suspected abuser.", "Calling the police to immediately arrest the partner.", "Recommending couple's therapy and marriage counseling."], correctAnswer: 1, explanation: "Safety is the priority. The physician must separate the victim from the suspected abuser (husband/partner) immediately to ensure privacy and safety before asking any questions." },
  { id: 26, category: "Domestic Violence & Child Abuse", question: "Which pattern of physical injury is highly suspicious for domestic violence?", options: ["A single bruise on the shin from bumping into furniture.", "Injuries located primarily on the extremities like knees and elbows.", "Multiple injuries in different stages of healing, often on central areas (head, neck, torso).", "A clean, surgical incision."], correctAnswer: 2, explanation: "Multiple injuries in different stages of healing and injuries concentrated on central areas of the body (head, neck, chest, abdomen, genitals) rather than extremities are highly indicative of abuse." },
  { id: 27, category: "Domestic Violence & Child Abuse", question: "Where are 'defensive injuries' typically found on a victim of physical assault?", options: ["Back of the head and neck", "Forearms and hands", "Chest and abdomen", "Lower legs and feet"], correctAnswer: 1, explanation: "Defensive injuries are typically found on the forearms and hands as the victim attempts to protect their face, head, and body from blows." },
  { id: 28, category: "Domestic Violence & Child Abuse", question: "Besides obvious physical injuries, what are common clinical presentations of domestic violence in a medical setting?", options: ["Acute appendicitis or gallstones", "Vague, unexplained chronic complaints like headaches, pelvic pain, anxiety, and sleep disorders", "Highly specific and easily diagnosable infectious diseases", "Excellent adherence to medical advice and follow-up routines"], correctAnswer: 1, explanation: "Victims often present with vague physical complaints (headache, abdominal/pelvic pain, chronic pain) or psychological signs (depression, anxiety, sleep disorders, PTSD)." },
  { id: 29, category: "Domestic Violence & Child Abuse", question: "How does pregnancy generally affect the risk of domestic violence?", options: ["It usually stops the violence completely as the abuser protects the child.", "It has no impact on the frequency or severity of violence.", "It is a high-risk time where abuse may initiate or significantly escalate.", "It only increases psychological violence, but never physical violence."], correctAnswer: 2, explanation: "Pregnancy is a high-risk time. Abuse may start or escalate during pregnancy, leading to an increased risk of miscarriage, preterm labor, low birth weight, and fetal trauma." },
  { id: 30, category: "Domestic Violence & Child Abuse", question: "Which of the following is considered an INAPPROPRIATE role for a physician managing a domestic violence victim?", options: ["Referring the patient to social workers, legal aid, and shelters.", "Assessing the patient's immediate safety and risk level.", "Acting as a marriage counselor or mediator between the victim and the abuser.", "Documenting the injuries accurately using body maps and photography."], correctAnswer: 2, explanation: "Physicians should identify, assess safety, treat, document, and refer. They should NOT act as marriage counselors or try to mediate between the abuser and the victim." },
  { id: 31, category: "Domestic Violence & Child Abuse", question: "When documenting the history of a suspected domestic violence assault, how should the patient's account ideally be recorded?", options: ["Paraphrased heavily by the doctor to sound more medical.", "In the patient's own words, using quotation marks where possible.", "Only if the partner corroborates the story.", "Summarized briefly in a single sentence to save time."], correctAnswer: 1, explanation: "Medical records are legal documents. Physicians should record the patient's statement in their own words, using quotes, to preserve the accuracy of the testimony for potential legal proceedings." },
  { id: 32, category: "Domestic Violence & Child Abuse", question: "What is a crucial medicolegal requirement BEFORE taking photographic documentation of a domestic violence or assault survivor's injuries?", options: ["Wait until the injuries have started to heal so they are less gruesome.", "Obtain the patient's explicit written consent.", "Get permission from the suspected abuser.", "Apply bandages or sutures to the wounds."], correctAnswer: 1, explanation: "Photographs must be taken with a scale, ideally BEFORE treatment alters the appearance of the injuries, and ONLY after obtaining the patient's written consent." },
  { id: 33, category: "Domestic Violence & Child Abuse", question: "In cases of sexual assault, what is the primary purpose of utilizing a standardized 'Rape Kit' or sexual assault evidence collection kit?", options: ["To provide immediate psychological therapy to the victim.", "To properly collect, package, and preserve trace evidence like hair, fibers, and bodily fluids.", "To test the patient for pregnancy.", "To treat sexually transmitted infections."], correctAnswer: 1, explanation: "Standardized kits are used to meticulously collect and preserve trace evidence (hair, fibers, swabs for DNA) to maintain the chain of custody for legal investigations." },
  { id: 34, category: "Forensic Medicine & Age Estimation", question: "According to forensic ossification milestones, at approximately what age does the xiphoid process typically unite with the body of the sternum?", options: ["20 years", "30 years", "40 years", "60 years"], correctAnswer: 2, explanation: "At approximately 40 years of age, the xiphoid process unites with the body of the sternum. (Also at this age, the body of the hyoid unites with its greater cornu)." },
  { id: 35, category: "Forensic Medicine & Age Estimation", question: "At approximately what age does the body of the sternum typically unite with the manubrium?", options: ["25 years", "40 years", "60 years", "75 years"], correctAnswer: 2, explanation: "The body of the sternum typically unites with the manubrium at approximately 60 years of age." },
  { id: 36, category: "Domestic Violence & Child Abuse", question: "According to the guidelines for managing a domestic violence victim, which of the following is the most appropriate referral pathway?", options: ["A marriage counseling center to mediate between the victim and the abuser.", "Medical social workers, psychiatrists, and NGOs/Women's Shelters.", "The perpetrator's employer to report the behavior.", "A local community leader to intervene privately."], correctAnswer: 1, explanation: "Appropriate referrals include Medical social workers, Psychiatrists/psychologists, Legal aid/Police (if the patient chooses), and NGOs or Shelters for immediate safety." },
  { id: 37, category: "Domestic Violence & Child Abuse", question: "Which of the following types of burns is a strong physical indicator of child abuse or non-accidental trauma?", options: ["Irregular splash burns", "Sunburns on the shoulders", "Circumferential immersion burns", "Small, single contact burns on a fingertip"], correctAnswer: 2, explanation: "Circumferential immersion burns (often presenting in a glove or stocking distribution) strongly indicate that a child was forcibly held in hot water, making it a classic sign of child abuse." },
  { id: 38, category: "Domestic Violence & Child Abuse", question: "During a forensic examination, a physician notes 'Pinch bruises' on a patient. What is the characteristic appearance of these bruises?", options: ["Parallel linear lines", "Two similar rounded bruises", "A single large hematoma", "Two curved elliptical rows"], correctAnswer: 1, explanation: "Pinch bruises characteristically present as two similar rounded bruises adjacent to each other, caused by the compression of tissue between the thumb and another finger." },
  { id: 39, category: "Domestic Violence & Child Abuse", question: "If a child presents with parallel linear bruises, what is the most likely mechanism of injury according to forensic patterns?", options: ["A forceful hand slap", "Striking with a doubled cord", "Whipping with a belt", "Hitting with a wooden stick"], correctAnswer: 0, explanation: "Parallel linear bruises are typically produced by a forceful hand slap, where the force outlines the fingers. A stick causes single linear bruises, a doubled cord causes loop marks, and a belt causes curvilinear bruises." },
  { id: 40, category: "Domestic Violence & Child Abuse", question: "Which ophthalmologic finding is considered a critical, unexplained physical indicator often associated with severe child abuse (like Shaken Baby Syndrome)?", options: ["Bilateral cataracts", "Corneal abrasions", "Unexplained retinal hemorrhages", "Acute conjunctivitis"], correctAnswer: 2, explanation: "Unexplained retinal hemorrhages are a major red flag and a strong physical indicator of child abuse, particularly indicative of abusive head trauma or 'shaken baby syndrome'." },
  { id: 41, category: "Domestic Violence & Child Abuse", question: "Which of the following objects typically inflicts 'Loop mark' bruises?", options: ["A wooden stick", "A belt", "A doubled cord or wire", "Human teeth"], correctAnswer: 2, explanation: "Loop mark bruises are classically inflicted by a doubled cord, wire, or rope striking the skin." },
  { id: 42, category: "Domestic Violence & Child Abuse", question: "During a forensic examination, what characteristic pattern strongly suggests a human bite mark?", options: ["A single, deep puncture wound.", "Two curved elliptical rows of abrasions and bruises.", "Parallel linear bruises.", "A large, diffuse hematoma with no distinct borders."], correctAnswer: 1, explanation: "Human bite marks classically present as two curved elliptical (or U-shaped) rows of abrasions and bruises reflecting the human dental arches." },
  { id: 43, category: "Domestic Violence & Child Abuse", question: "According to forensic injury patterns, what object is most likely responsible for inflicting a single, distinct 'Linear bruise'?", options: ["A belt", "A doubled cord", "A wooden stick or rod", "A forceful hand slap"], correctAnswer: 2, explanation: "A single linear bruise is typically inflicted by a stick or rod. (A hand slap causes parallel lines, a belt causes curvilinear marks, and a cord causes loop marks)." },
  { id: 44, category: "Forensic Toxicology & Sexual Assault", question: "In cases where Drug-Facilitated Sexual Assault (DFSA) or rape is suspected, which biological samples are mandatory for toxicological screening?", options: ["Saliva and hair follicles only", "Gastric lavage fluid only", "Blood and urine samples", "Cerebrospinal fluid (CSF)"], correctAnswer: 2, explanation: "Blood and urine samples are the standard and most critical specimens to collect for screening toxins, drugs of abuse, and substances that facilitate rape." },
  { id: 45, category: "Forensic Toxicology & Sexual Assault", question: "Which of the following substances are routinely screened for in a 'Drugs of Abuse' panel for a suspected sexual assault survivor?", options: ["Routine antibiotics and vitamins", "Amphetamines, Barbiturates (e.g., Secobarbital), and Opiates", "Only over-the-counter NSAIDs like Ibuprofen", "Fasting blood glucose and HbA1c"], correctAnswer: 1, explanation: "Toxicological screening in these cases looks for drugs of abuse and incapacitating agents, including Amphetamines, Barbiturates (Secobarbital, Phenobarbital), Opiates (Morphine, Methadone), and other sedatives." },
  { id: 46, category: "Forensic Toxicology & Sexual Assault", question: "When collecting physical evidence and toxicological samples (like blood/urine or rape kits), what strict legal protocol must the physician follow to ensure the evidence is admissible in court?", options: ["Maintaining the 'Chain of Custody' with documented signatures at every handover.", "Storing the samples in their personal locker until the police arrive.", "Throwing away the samples if the patient seems unsure about pressing charges.", "Analyzing the blood themselves using a rapid ward test and discarding the rest."], correctAnswer: 0, explanation: "Maintaining the Chain of Custody is legally required. Every transfer of the evidence must be documented and signed to prove the samples were not tampered with before reaching the forensic lab." },
  { id: 47, category: "Forensic Toxicology & Sexual Assault", question: "What is the recommended timeframe for administering Post-Exposure Prophylaxis (PEP) for HIV following a sexual assault?", options: ["Within 12 hours", "Within 72 hours", "Within 1 week", "Within 1 month"], correctAnswer: 1, explanation: "Post-Exposure Prophylaxis (PEP) for HIV is most effective when initiated as soon as possible, and it must be started within 72 hours of the assault to be effective." },
  { id: 48, category: "Forensic Toxicology & Sexual Assault", question: "Which of the following is a key component of the medical management for a female survivor of sexual assault to prevent unintended pregnancy?", options: ["Routine appendectomy", "Emergency contraception (e.g., Levonorgestrel) ideally within 72-120 hours", "Delaying treatment until a pregnancy test is positive 2 weeks later", "Immediate surgical sterilization"], correctAnswer: 1, explanation: "Providing Emergency Contraception is a critical step in the post-assault protocol to prevent unintended pregnancy resulting from the assault. It should be given as soon as possible, ideally within 72 to 120 hours depending on the method." },
  { id: 49, category: "Domestic Violence & Child Abuse", question: "When a physician provides 'Psychological First Aid' to a survivor of domestic violence, what is the core guiding principle?", options: ["Forcing the victim to talk about the traumatic event in detail.", "Prescribing heavy sedatives to induce sleep.", "Listening without pressing the survivor to talk and ensuring their basic needs and safety are met.", "Confronting the abuser directly to provide closure."], correctAnswer: 2, explanation: "Psychological First Aid involves providing practical care, assessing needs and concerns, helping people to address basic needs, listening without pressuring them to talk, comforting them, and protecting them from further harm." },
  { id: 50, category: "Patients' Rights", question: "Regarding the legal reporting of domestic violence involving adult competent survivors, what is generally the best practice for physicians?", options: ["Report to the police immediately against the patient's wishes.", "Respect the patient's autonomy and only report with their informed consent (unless there is a legal mandate/imminent threat).", "Refuse to treat the patient unless they agree to file a police report.", "Only report if the injuries are life-threatening."], correctAnswer: 1, explanation: "For competent adults, respecting patient autonomy is paramount. Physicians should encourage reporting but generally must obtain informed consent before sharing information with law enforcement, unless specific mandatory reporting laws apply (like in child abuse or gunshot wounds) or there's an imminent threat to life." },
  { id: 51, category: "Domestic Violence & Child Abuse", question: "In the context of the National Protocol for the Management of Survivors of GBV, what is the importance of a multidisciplinary team approach?", options: ["It reduces the hospital's financial liability.", "It allows the doctor to delegate all responsibility to the police.", "It ensures the survivor receives comprehensive medical, psychological, social, and legal support seamlessly.", "It is only required for cases involving severe head trauma."], correctAnswer: 2, explanation: "GBV cases are complex and require more than just medical treatment. A multidisciplinary approach (doctors, nurses, social workers, psychologists, legal aid) ensures the survivor is supported holistically and safely." },
  { id: 52, category: "Forensic Medicine & Age Estimation", question: "According to the dental eruption chart, at what age does the Third Permanent Molar (wisdom tooth) typically erupt?", options: ["10-12 years", "12-14 years", "17-21 years", "25-30 years"], correctAnswer: 2, explanation: "The Third Permanent Molar, commonly known as the wisdom tooth, typically erupts between 17 and 21 years of age in both the upper and lower jaws." },
  { id: 53, category: "Forensic Medicine & Age Estimation", question: "At what age does the permanent Central Incisor typically erupt?", options: ["6-10 months", "6-7 years", "9-11 years", "12-14 years"], correctAnswer: 1, explanation: "The permanent Central Incisor typically erupts between 6 and 7 years of age, replacing the primary (deciduous) incisors." },
  { id: 54, category: "Forensic Toxicology & Sexual Assault", question: "Based on standard 'Drugs of Abuse Blood Test' chromatograms used in forensic screening, which of the following substances represents a barbiturate that is routinely checked?", options: ["Amphetamine", "Morphine", "Secobarbital", "Methadone"], correctAnswer: 2, explanation: "Secobarbital (along with Phenobarbital) is a common barbiturate routinely screened for in drugs of abuse panels, particularly in Drug-Facilitated Sexual Assault cases." },
  { id: 55, category: "Forensic Medicine & Age Estimation", question: "In cases of child abuse, human trafficking, or undocumented minors, what is the primary medicolegal purpose of evaluating tooth eruption and bone ossification milestones?", options: ["To determine the child's long-term nutritional status.", "To estimate the chronological age of the victim or perpetrator.", "To predict the child's final adult height.", "To diagnose genetic bone disorders."], correctAnswer: 1, explanation: "Forensic odontology and bone ossification centers are primarily utilized to estimate chronological age when a person lacks reliable birth documentation." },
  { id: 56, category: "Forensic Medicine & Age Estimation", question: "In forensic investigations involving sexual assault resulting in pregnancy, or in disputed parentage cases, laboratories utilize DNA profiling to compare the child's DNA with the mother and the:", options: ["Medical examiner", "Alleged father", "First responder", "Treating physician"], correctAnswer: 1, explanation: "DNA profiling (fingerprinting) is used to establish paternity by comparing the genetic markers of the child, the mother, and the 'Alleged father'." },
  { id: 57, category: "Human Essence in Practice", question: "Which of the following is specifically identified as a 'Dehumanizing Force' in modern medical practice?", options: ["A sincere concern for patient values", "The corporatization of the healthcare sector", "Active empathic listening", "Extended patient consultation times"], correctAnswer: 1, explanation: "The presentation explicitly highlights 'the corporatization of the healthcare sector' as a major dehumanizing force that prioritizes efficiency and profit over human connection." },
  { id: 58, category: "Human Essence in Practice", question: "An over-reliance on which of the following is highlighted as a factor that can dehumanize patient care?", options: ["Physical examinations", "Technology and computers", "Multidisciplinary team meetings", "Patient feedback"], correctAnswer: 1, explanation: "Relying excessively on technology and computers, often at the expense of face-to-face interaction and bedside manner, is a key driver of dehumanization in modern medicine." },
  { id: 59, category: "Human Essence in Practice", question: "What is a direct clinical consequence of dehumanizing patients in medical practice?", options: ["Increased treatment compliance", "Enhanced physician-patient trust", "Patient dissatisfaction and non-compliance", "Faster recovery times"], correctAnswer: 2, explanation: "When patients feel dehumanized, it directly leads to a loss of trust, profound patient dissatisfaction, and poor clinical outcomes due to non-compliance with medical advice." },
  { id: 60, category: "Forensic Medicine & Age Estimation", question: "In forensic DNA paternity testing, how is parentage confirmed using DNA profile bands?", options: ["The child's DNA bands must all match the alleged father only.", "Half of the child's DNA bands must align with the mother and the other half with the alleged father.", "The child's DNA will have entirely unique bands shared with neither.", "DNA is only compared using traditional blood typing (ABO)."], correctAnswer: 1, explanation: "A child inherits half of their DNA from their mother and half from their father. In a paternity test, every band in the child's DNA profile must match a band in either the mother's or the alleged father's profile." },
  { id: 61, category: "Human Essence in Practice", question: "Which behavior is a classic example of 'Objectification' (a dehumanizing force) in a clinical setting?", options: ["Asking the patient about their personal life and family.", "Referring to a patient by their disease or room number (e.g., 'The appendicitis in bed 3').", "Sitting at eye level with the patient during a consultation.", "Explaining medical jargon in simple terms."], correctAnswer: 1, explanation: "Objectification strips the patient of their humanity and reduces them to a mere diagnosis, organ, or room number, which is deeply dehumanizing." },
  { id: 62, category: "Human Essence in Practice", question: "In the context of humanizing medical practice, what is the critical difference between 'Empathy' and 'Sympathy'?", options: ["Sympathy is clinical, while empathy is purely emotional.", "Empathy involves objectively understanding the patient's feelings, whereas sympathy involves pitying them and potentially losing professional objectivity.", "There is no difference; they are interchangeable terms in medicine.", "Empathy is discouraged in medicine, while sympathy is encouraged."], correctAnswer: 1, explanation: "Empathy is the ability to understand and share the feelings of another while maintaining professional boundaries. Sympathy implies feeling pity or sorrow, which can cloud clinical judgment." },
  { id: 63, category: "Human Essence in Practice", question: "Which of the following non-verbal communication strategies is essential for humanizing the physician-patient interaction?", options: ["Standing over the patient's bed while talking to assert authority.", "Looking primarily at the computer screen to ensure accurate typing.", "Maintaining appropriate eye contact and sitting at the patient's eye level.", "Crossing arms to maintain a professional distance."], correctAnswer: 2, explanation: "Simple non-verbal cues like sitting down (being at eye level) and maintaining eye contact demonstrate active listening, presence, and respect, humanizing the interaction." },
  { id: 64, category: "Human Essence in Practice", question: "How does physician burnout typically impact the delivery of humanistic care?", options: ["It improves clinical efficiency and diagnostic accuracy.", "It leads to emotional exhaustion, depersonalization, and reduced empathy toward patients.", "It makes the physician more sympathetic to the patient's struggles.", "It has no impact on patient interaction."], correctAnswer: 1, explanation: "Burnout is a major dehumanizing force. It causes emotional exhaustion and depersonalization (cynicism), severely impairing the physician's ability to show empathy and compassion." },
  { id: 65, category: "Human Essence in Practice", question: "What is considered a primary benefit of integrating humanism into clinical practice for the physician?", options: ["Faster patient turnover rates.", "Decreased likelihood of burnout and fewer malpractice litigations.", "Elimination of the need for medical documentation.", "Increased billing capabilities."], correctAnswer: 1, explanation: "Practicing with humanism and empathy not only improves patient outcomes and compliance but also protects physicians by reducing burnout, increasing job satisfaction, and significantly lowering the risk of malpractice lawsuits." },
  { id: 66, category: "Clinical Communication Skills", question: "According to communication studies in clinical practice, how quickly do physicians typically interrupt patients after they begin explaining their concerns?", options: ["After 1 to 2 minutes", "After 3 to 5 minutes", "On average, between 11 to 18 seconds", "They rarely interrupt patients"], correctAnswer: 2, explanation: "Studies consistently show that physicians tend to interrupt patients very early in the consultation, typically within 11 to 18 seconds of the patient speaking, which hinders active listening and eliciting the full patient perspective." },
  { id: 67, category: "Clinical Communication Skills", question: "When a physician needs to deliver a poor prognosis or a difficult diagnosis, which widely recognized framework is recommended to ensure a compassionate and structured approach?", options: ["The DROIT framework", "The SPIKES protocol", "The ABCDE approach", "The 4 Habits Model"], correctAnswer: 1, explanation: "The SPIKES protocol (Setting, Perception, Invitation, Knowledge, Emotions, Strategy/Summary) is the gold standard framework taught in medicine for delivering bad news compassionately." },
  { id: 68, category: "Clinical Communication Skills", question: "Which of the following is one of the core components of 'The 4 Habits Model' for effective clinical interviewing?", options: ["Rushing the beginning of the interview to save time for physical examination.", "Eliciting the patient's perspective.", "Avoiding discussion of the patient's emotions.", "Delegating empathetic responses to nursing staff."], correctAnswer: 1, explanation: "The 4 Habits Model consists of: 1) Invest in the beginning, 2) Elicit the patient's perspective, 3) Demonstrate empathy, and 4) Invest in the end." },
  { id: 69, category: "Human Essence in Practice", question: "A physician conducts a consultation but spends the majority of the time typing and looking at the electronic health record (EHR) screen. What is the most likely outcome of this behavior?", options: ["The patient feels the physician is highly thorough and modern.", "The patient feels ignored and dehumanized, damaging trust.", "It significantly improves diagnostic accuracy without affecting the doctor-patient relationship.", "It satisfies the core principles of humanistic medicine."], correctAnswer: 1, explanation: "An over-reliance on computers during the consultation—without balancing it with eye contact and active listening—acts as a barrier. The patient often feels ignored and dehumanized, which breaks the therapeutic alliance." },
  { id: 70, category: "Clinical Communication Skills", question: "In the SPIKES protocol for delivering bad news, what does the 'E' stand for?", options: ["Efficiency", "Evidence", "Emotions/Empathy", "Evaluation"], correctAnswer: 2, explanation: "The 'E' in SPIKES stands for addressing the patient's Emotions with Empathy. It is a critical step where the physician acknowledges the patient's feelings before moving on to a treatment strategy." },
  { id: 71, category: "Human Essence in Practice", question: "What is the core principle of 'Shared Decision Making' in modern humanistic medical practice?", options: ["The physician makes the decision and convinces the patient.", "The patient makes the decision entirely on their own.", "A collaborative process where physician expertise and patient values are integrated.", "Deferring all complex decisions to a hospital ethics committee."], correctAnswer: 2, explanation: "Shared decision making bridges the gap between medical paternalism and extreme consumerism, integrating the doctor's clinical expertise with the patient's personal values and preferences." },
  { id: 72, category: "Human Essence in Practice", question: "How does cultural competence enhance the humanistic practice of medicine?", options: ["It allows doctors to stereotype patients for faster diagnosis.", "It demonstrates respect for patient diversity and reduces healthcare disparities.", "It eliminates the need for medical interpreters.", "It forces patients to adapt to the hospital's culture."], correctAnswer: 1, explanation: "Cultural competence involves recognizing, respecting, and accommodating the diverse cultural backgrounds of patients, which builds trust, reduces disparities, and is a pillar of humanistic care." },
  { id: 73, category: "Human Essence in Practice", question: "When encountering an angry or difficult patient, what is the most appropriate initial humanistic response from the physician?", options: ["Immediately discharge the patient from the clinic.", "Respond with matching anger to establish authority.", "Ignore the emotion and stick strictly to medical facts.", "Remain calm, acknowledge the patient's frustration, and explore the underlying cause."], correctAnswer: 3, explanation: "Anger is often a secondary emotion masking fear, pain, or frustration. A humanistic approach involves active listening, remaining calm, and validating the patient's feelings to de-escalate the situation." },
  { id: 74, category: "Human Essence in Practice", question: "Which of the following best describes 'Medical Paternalism,' a concept that modern humanistic medicine strives to move away from?", options: ["The physician deciding what is best for the patient without considering the patient's own values or choices.", "Respecting a competent patient's right to refuse life-saving treatment.", "Providing patients with full access to their medical records.", "Asking a colleague for a second opinion."], correctAnswer: 0, explanation: "Paternalism is the traditional 'doctor knows best' model where the physician overrides or ignores patient autonomy, contrasting sharply with modern humanistic, patient-centered care." },
  { id: 75, category: "Human Essence in Practice", question: "Which practice is strongly recommended for physicians to maintain their 'human essence' and prevent compassion fatigue?", options: ["Working longer shifts to see more patients.", "Suppressing all personal emotions while at work.", "Engaging in self-reflection, mindfulness, and maintaining a healthy work-life balance.", "Avoiding complex or severely ill patients entirely."], correctAnswer: 2, explanation: "Self-care, mindfulness, and reflective practice are essential tools for physicians to process the emotional toll of medicine, preventing burnout and compassion fatigue." },
  { id: 76, category: "Terminally Ill & Ethics", question: "What is the definition of 'medical futility' in the context of end-of-life care?", options: ["Interventions that are considered too expensive for the patient's insurance.", "Interventions that are unlikely to produce any significant benefit for the patient.", "The legal process of withholding pain medication.", "Active euthanasia requested by the patient."], correctAnswer: 1, explanation: "Medical futility refers to medical interventions or treatments that are unlikely to produce any significant benefit or meaningful improvement for the dying patient." },
  { id: 77, category: "Terminally Ill & Ethics", question: "A physician considers withholding a specific intervention because the statistical likelihood that it will benefit the patient is exceedingly poor. What ethical concept does this describe?", options: ["Qualitative futility", "Quantitative futility", "Patient autonomy", "Non-maleficence"], correctAnswer: 1, explanation: "Quantitative futility occurs when the statistical likelihood or probability that an intervention will benefit the patient is exceedingly poor." },
  { id: 78, category: "Terminally Ill & Ethics", question: "A patient is kept alive on life support but remains in a persistent vegetative state with no meaningful interaction with their environment. If a physician argues that further intervention only prolongs a state devoid of acceptable quality, what type of futility is being invoked?", options: ["Quantitative futility", "Qualitative futility", "Distributive justice", "Paternalism"], correctAnswer: 1, explanation: "Qualitative futility refers to situations where the quality of the benefit an intervention will produce is exceedingly poor (e.g., preserving permanent unconsciousness)." },
  { id: 79, category: "Terminally Ill & Ethics", question: "When a patient is diagnosed with a terminal illness, what is a common emotional response exhibited by their family members according to end-of-life care literature?", options: ["Immediate and total acceptance of the diagnosis.", "Complete emotional apathy and detachment.", "High stress manifested by anger, depression, and interpersonal conflict.", "Enhanced cognitive functioning and logical decision-making."], correctAnswer: 2, explanation: "The families of dying patients typically experience a period of high stress that can manifest as anger, depression, hopelessness, guilt, powerlessness, and severe interpersonal conflict." },
  { id: 80, category: "Terminally Ill & Ethics", question: "In the complex landscape of end-of-life care, who are the parties whose rights, dignity, and vigor must be protected during the clinical ethical decision-making process?", options: ["Only the hospital administration and legal team.", "Only the treating physician.", "All parties involved, including the patient, the family, and the healthcare team.", "Only the patient."], correctAnswer: 2, explanation: "Physicians face many ethical challenges in end-of-life care, and it is critical to protect the rights, dignity, and vigor of ALL parties involved (patient, family, and healthcare providers) in the decision-making process." },
  { id: 81, category: "Terminally Ill & Ethics", question: "What is the primary clinical advantage of a Healthcare Proxy (Durable Power of Attorney) over a standard Living Will?", options: ["A proxy guarantees the patient will recover from their illness.", "A proxy allows the appointed surrogate to adapt to unforeseen medical situations, whereas a living will only covers specific, predefined scenarios.", "A proxy overrides the patient's own decisions even if the patient is still competent.", "A proxy is cheaper to file legally than a living will."], correctAnswer: 1, explanation: "The major limitation of a Living Will is that it cannot anticipate every possible clinical scenario. A Healthcare Proxy designates a person who can interpret the patient's wishes and make decisions in real-time as unforeseen situations arise." },
  { id: 82, category: "Terminally Ill & Ethics", question: "What does a 'Do Not Resuscitate' (DNR) order specifically mandate for a hospitalized patient?", options: ["The withdrawal of all life-sustaining treatments, including feeding tubes.", "The cessation of pain management and palliative care.", "Withholding cardiopulmonary resuscitation (CPR) in the event of cardiac or respiratory arrest.", "A refusal to treat any new infections or complications."], correctAnswer: 2, explanation: "A DNR order is highly specific: it only means withholding CPR if the patient's heart stops or they stop breathing. It does NOT mean 'do not treat'—the patient can still receive antibiotics, pain meds, and other interventions." },
  { id: 83, category: "Terminally Ill & Ethics", question: "What is the key physiological distinction between Brain Death and a Persistent Vegetative State (PVS)?", options: ["Brain death implies a temporary coma, while PVS is permanent.", "In Brain Death, brainstem function is irreversibly lost; in PVS, the brainstem remains intact, preserving autonomic functions.", "Patients in Brain Death can still breathe on their own, while PVS patients cannot.", "There is no difference; they are synonymous legal terms."], correctAnswer: 1, explanation: "Brain Death is the irreversible cessation of ALL brain functions, including the brainstem (no spontaneous breathing, no autonomic reflexes). In PVS, the cerebral cortex is severely damaged, but the brainstem survives, meaning the patient can breathe and have sleep-wake cycles." },
  { id: 84, category: "Terminally Ill & Ethics", question: "What is the primary ethical and legal distinction between Active Euthanasia and Physician-Assisted Suicide (PAS)?", options: ["In Active Euthanasia, the physician directly administers the lethal agent, whereas in PAS, the physician provides the means, but the patient self-administers it.", "Active Euthanasia is legal worldwide, while PAS is illegal everywhere.", "PAS involves withholding treatment, while Active Euthanasia involves a lethal injection.", "PAS requires family consent, while Active Euthanasia only requires physician consent."], correctAnswer: 0, explanation: "The distinction lies in who performs the final act. In Active Euthanasia, the doctor gives the lethal injection. In PAS, the doctor prescribes the lethal medication, but the patient must take it themselves." },
  { id: 85, category: "Terminally Ill & Ethics", question: "Which of the following is considered a component of clinical 'Capacity' (determined by a physician) rather than legal 'Competence' (determined by a judge)?", options: ["A formal declaration of mental unfitness by a court of law.", "The assignment of a state-appointed guardian.", "The patient's ability to understand medical information, appreciate consequences, and communicate a choice.", "The legal drafting of a last will and testament regarding finances."], correctAnswer: 2, explanation: "Capacity is a clinical assessment made by a physician determining if a patient can understand, reason, and communicate regarding a specific medical decision. Competence is a global, legal status determined by a judge." },
  { id: 86, category: "Terminally Ill & Ethics", question: "The 'Rule of Double Effect' in end-of-life care justifies which of the following actions?", options: ["Administering a lethal injection to end suffering.", "Withholding food and water from a competent patient.", "Administering high doses of opioids to relieve severe pain, even if it foreseeably hastens death, because the primary intent is pain relief.", "Providing a patient with a prescription for a lethal dose of medication."], correctAnswer: 2, explanation: "The Rule of Double Effect states that an action with two possible effects (one good, one bad) is ethically permissible if the primary intent is the good effect (pain relief), even if the bad effect (hastening death) is a foreseeable consequence." },
  { id: 87, category: "Terminally Ill & Ethics", question: "Ethically and legally, how does *withdrawing* life-sustaining treatment (e.g., turning off a ventilator) compare to *withholding* it (e.g., not starting the ventilator)?", options: ["Withdrawing is considered active euthanasia, while withholding is passive.", "There is no ethical or legal distinction; both are considered allowing the underlying disease to take its natural course.", "Withdrawing is illegal, but withholding is legal.", "Withholding requires a court order, whereas withdrawing only requires family consent."], correctAnswer: 1, explanation: "Ethically and legally, there is no distinction between withholding and withdrawing life-sustaining treatment. Both are considered forms of allowing the patient to die from their underlying terminal illness." },
  { id: 88, category: "Terminally Ill & Ethics", question: "What is the defining characteristic of 'Passive Euthanasia'?", options: ["The physician administers a lethal dose of medication at the patient's request.", "The patient administers a lethal dose of medication prescribed by the physician.", "The intentional withholding or withdrawing of life-sustaining treatment, allowing the patient to die from their underlying illness.", "Ending the life of a patient without their explicit consent."], correctAnswer: 2, explanation: "Passive euthanasia (often simply called allowing natural death) involves stopping or not starting life-prolonging measures, letting the underlying disease process take its course." },
  { id: 89, category: "Terminally Ill & Ethics", question: "What is the primary focus of Palliative Care?", options: ["Providing aggressive, experimental curative treatments.", "Improving the quality of life and relieving suffering for patients with serious illnesses, regardless of their prognosis.", "Assisting patients in hastening their death.", "Restricting care to only the last 48 hours of life."], correctAnswer: 1, explanation: "Palliative care focuses on providing relief from the symptoms, pain, and stress of a serious illness to improve quality of life. It can be provided alongside curative treatments, unlike hospice care which generally requires stopping curative treatments." },
  { id: 90, category: "Terminally Ill & Ethics", question: "When a terminally ill patient who is fully competent requests that all life-sustaining treatments be stopped, what ethical principle requires the physician to honor this request?", options: ["Beneficence", "Non-maleficence", "Justice", "Patient Autonomy"], correctAnswer: 3, explanation: "Patient Autonomy is the principle that competent patients have the absolute right to make decisions about their own medical care, including the right to refuse any life-sustaining treatment." },
  { id: 91, category: "Terminally Ill & Ethics", question: "When an incapacitated patient has not left any advanced directives, what standard should a surrogate ideally use to make medical decisions?", options: ["The surrogate's own personal preference.", "The Best Interest standard (what would benefit the patient most).", "Substituted Judgment (what the patient would have chosen if they were competent).", "The physician's personal recommendation."], correctAnswer: 2, explanation: "Substituted Judgment is the gold standard for surrogate decision-making. It requires the surrogate to make the decision they believe the patient would have made based on the patient's known values, beliefs, and past statements." },
  { id: 92, category: "Terminally Ill & Ethics", question: "If a surrogate is unable to apply the 'Substituted Judgment' standard because the patient's wishes were never known, which secondary standard must they follow?", options: ["The substituted judgment of the closest family member.", "The Best Interest standard (weighing benefits vs burdens for the patient).", "The most cost-effective treatment available.", "The physician's religious beliefs."], correctAnswer: 1, explanation: "If the patient's specific wishes are unknown, the surrogate must use the 'Best Interest' standard, making the choice that most likely promotes the patient's well-being and minimizes suffering." },
  { id: 93, category: "Terminally Ill & Ethics", question: "According to the presentation, what is a valid 'No Benefit' criterion for deciding that CPR is medically futile?", options: ["The patient is over 70 years old.", "The patient has a low income.", "CPR has been attempted for 10 minutes without success.", "No physiological benefit is expected because the patient's vital functions are deteriorating despite maximal therapy."], correctAnswer: 3, explanation: "Medical futility for CPR is established when no physiological benefit is expected, often because multi-organ failure is present and death is imminent despite all efforts." },
  { id: 94, category: "Terminally Ill & Ethics", question: "Does a 'Do Not Resuscitate' (DNR) order automatically apply during a surgical procedure?", options: ["Yes, it must be honored strictly at all times.", "No, it is generally suspended during surgery because anesthesia-related arrest is often easily reversible.", "Yes, but only if the surgeon agrees.", "No, DNR orders are never valid in an operating room."], correctAnswer: 1, explanation: "In clinical practice (Case 1 discussion), DNR orders are often temporarily suspended or modified during surgery. This is because anesthesia can cause predictable, reversible cardiac issues that don't reflect the patient's underlying terminal state." },
  { id: 95, category: "Terminally Ill & Ethics", question: "In a case where a patient in a Persistent Vegetative State (PVS) develops pneumonia, the family requests antibiotics while the physician believes they are futile. Why is it difficult to label antibiotics 'futile' in this case?", options: ["Because the family is paying for them.", "Because they will likely cure the pneumonia (physiological benefit), even if they don't improve the neurologic state.", "Because PVS is always reversible.", "Because antibiotics are required by law in all cases."], correctAnswer: 1, explanation: "This is a conflict of 'Qualitative Futility' (Case 3 discussion). While antibiotics provide a physiological/quantitative benefit (curing infection), the physician argues they have no qualitative benefit because the underlying PVS remains unchanged." },
  { id: 96, category: "Terminally Ill & Ethics", question: "When a family is in high stress due to a terminal diagnosis and experiences interpersonal conflict, what is the physician's ethical responsibility?", options: ["To ignore the family and focus only on the patient's chart.", "To take a side in the family argument to speed up the decision.", "To facilitate communication, provide support, and involve a multidisciplinary team (social work/chaplaincy).", "To call the police to remove disruptive family members."], correctAnswer: 2, explanation: "Physicians must recognize that family stress is part of the clinical picture in end-of-life care and should act as facilitators to ensure decisions are made in a supportive environment." },
  { id: 97, category: "Terminally Ill & Ethics", question: "A patient with advanced Alzheimer's who is no longer competent needs a feeding tube. The family is divided. What is the first thing the medical team should search for to guide the decision?", options: ["A court order.", "The patient's insurance policy.", "An Advanced Directive or Healthcare Proxy document.", "The opinion of the hospital CEO."], correctAnswer: 2, explanation: "Advanced Directives are the primary legal and ethical tools for determining an incapacitated patient's treatment preferences." },
  { id: 98, category: "Terminally Ill & Ethics", question: "True or False: If a patient is Brain Dead, they can eventually wake up if kept on a ventilator long enough.", options: ["True", "False"], correctAnswer: 1, explanation: "False. Brain Death is defined as the *irreversible* loss of all brain functions. Once confirmed, there is no possibility of recovery. It is legally and medically equivalent to death." },
  { id: 99, category: "Terminally Ill & Ethics", question: "What should a physician do if a terminally ill patient asks, 'Am I going to die?'", options: ["Lie and say they will be fine to keep their spirits up.", "Avoid the question and change the subject.", "Give a sensitive, honest answer tailored to the patient's readiness to hear the truth.", "Tell them to ask their family instead."], correctAnswer: 2, explanation: "Honesty and sensitive disclosure (as seen in the Case 5 Discussion) are fundamental. Patients have a right to their diagnosis and prognosis to make informed life decisions." },
  { id: 100, category: "Terminally Ill & Ethics", question: "Which of the following is NOT a stage of grief according to the slides?", options: ["Anger", "Bargaining", "Retribution", "Acceptance"], correctAnswer: 2, explanation: "The stages of grief are Denial, Anger, Bargaining, Depression, and Acceptance. 'Retribution' is not one of the stages." },
  { id: 101, category: "Patients' Rights", question: "Asking a patient if they wish to have a family member present during a medical consultation is primarily an example of which component of the DROIT framework?", options: ["Dignity", "Respect", "Obligation", "Information"], correctAnswer: 1, explanation: "Respect involves taking into account the views and desires of the patient, such as inviting them to express preferences regarding their treatment or who they want present in the room." },
  { id: 102, category: "Patients' Rights", question: "In the context of patient rights, the physician's inherent duty to provide the best possible care and act in the patient's best interest is defined as:", options: ["Dignity", "Respect", "Obligation", "Trust"], correctAnswer: 2, explanation: "Obligation refers to the physician's 'duty of care' to the patient, ensuring they provide the best possible medical treatment and act in the patient's best interests." },
  { id: 103, category: "Patients' Rights", question: "While clinical teaching on 'interesting cases' is essential for medical education, it must never override the fundamental right of the patient to:", options: ["Receive financial compensation.", "Dignity, privacy, and informed consent.", "Dictate the curriculum of the medical school.", "Review the students' grades."], correctAnswer: 1, explanation: "Although patients with interesting conditions leave valuable legacies for clinical teaching, this must never come at the expense of their dignity, privacy, or their right to provide or refuse informed consent." },
  { id: 104, category: "Patients' Rights", question: "According to the DROIT principles, the information provided to a patient regarding their diagnosis and treatment must be:", options: ["Written entirely in complex Latin terminology.", "Withheld if the doctor thinks it will upset the family.", "Truthful, timely, and accessible.", "Provided only after the treatment is completed."], correctAnswer: 2, explanation: "The 'Information' pillar requires that physicians communicate with patients in a way that is truthful, timely (given when needed), and accessible (easy to understand)." },
  { id: 105, category: "Patients' Rights", question: "Maintaining strict confidentiality of a patient's medical records and acting as a fiduciary primarily upholds which pillar of the DROIT framework?", options: ["Dignity", "Respect", "Obligation", "Trust"], correctAnswer: 3, explanation: "Trust is built and maintained through confidentiality and the fiduciary duty of the physician to protect the patient's private health information." },
  { id: 106, category: "Patients' Rights", question: "When a medical student is assigned to examine a patient, what must be explicitly communicated regarding the patient's right to refuse?", options: ["Refusal means they will be discharged from the hospital.", "Refusal will not negatively affect the quality of their medical care.", "They can only refuse if the attending physician agrees.", "Refusal must be submitted in writing 24 hours in advance."], correctAnswer: 1, explanation: "Patients must be informed that their participation in clinical teaching is entirely voluntary and that a refusal will not prejudice or negatively affect their medical care in any way." },
  { id: 107, category: "Patients' Rights", question: "According to the Arabic Patient Rights Charter (ميثاق حقوق المريض), what is the very first right listed regarding the treating physician?", options: ["The right to choose a doctor of a specific gender.", "The right to know the name and specialty of the treating physician.", "The right to have the doctor's personal phone number.", "The right to demand a foreign consultant."], correctAnswer: 1, explanation: "Item 1 of the Arabic Charter states: 'معرفة اسم الطبيب المعالج وتخصصه' (Knowing the name and specialty of the treating physician)." },
  { id: 108, category: "Patients' Rights", question: "How often does the Arabic Patient Rights Charter mandate that a patient should be visited by their consultant or a specialized team member after initial evaluation?", options: ["Once a week.", "Only when complications arise.", "Within 24 hours of evaluation and on a daily basis.", "Every 12 hours."], correctAnswer: 2, explanation: "Item 5 of the charter mandates visiting the consultant or a specialist from their team within 24 hours of evaluation, and on a daily basis thereafter ('بصفة يومية')." },
  { id: 109, category: "Patients' Rights", question: "What is a major ethical concern when multiple medical students practice an uncomfortable physical examination (like a rectal or pelvic exam) on a single patient?", options: ["It wastes the students' time.", "It violates the principle of non-maleficence and patient dignity by causing unnecessary repeated discomfort.", "The hospital cannot bill the patient for student exams.", "It violates the principle of distributive justice."], correctAnswer: 1, explanation: "Subjecting a patient to repeated, uncomfortable examinations solely for teaching purposes (without clinical benefit to the patient) violates their dignity and the principle of non-maleficence (do no harm)." },
  { id: 110, category: "Patients' Rights", question: "Under the Arabic Patient Rights Charter, patient data must be kept completely confidential EXCEPT:", options: ["When medical students want to use it for a social media post.", "When family members demand to see it without the patient's consent.", "When requested by authorized legal entities or individuals the patient explicitly allows.", "When the hospital administration wants to sell data to a pharmaceutical company."], correctAnswer: 2, explanation: "Item 8 states that patient data is confidential except for those the patient wishes to inform, or when requested by legal authorities ('الا لمن يرغب المريض فقط باطلاعه عليها او عند طلبها من جهات قانونية')." },
];

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

// category → color accent token
const CAT_COLOR = {
  "Terminally Ill & Ethics":              { color: '#63c9ff', bg: 'rgba(99,201,255,0.09)'  },
  "Human Essence in Practice":            { color: '#a78bfa', bg: 'rgba(167,139,250,0.09)' },
  "Domestic Violence & Child Abuse":      { color: '#f87171', bg: 'rgba(248,113,113,0.09)' },
  "Forensic Medicine & Age Estimation":   { color: '#34d9b3', bg: 'rgba(52,217,179,0.09)'  },
  "Patients' Rights":                     { color: '#fbbf24', bg: 'rgba(251,191,36,0.09)'  },
  "Forensic Toxicology & Sexual Assault": { color: '#fb923c', bg: 'rgba(251,146,60,0.09)'  },
  "Clinical Communication Skills":        { color: '#4ade80', bg: 'rgba(74,222,128,0.09)'  },
};

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function App() {
  const [questions,        setQuestions]        = useState(initialMcqData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery,      setSearchQuery]      = useState('');
  const [userAnswers,      setUserAnswers]       = useState({});
  const [showExp,          setShowExp]           = useState({});

  // Inject global CSS once
  useEffect(() => {
    const tag = document.createElement('style');
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const map = {};
    initialMcqData.forEach(q => {
      map[q.category] = (map[q.category] || 0) + 1;
    });
    return map;
  }, []);

  const categories = useMemo(() =>
    ['All', ...new Set(initialMcqData.map(q => q.category))], []);

  const filteredQuestions = useMemo(() => {
    let r = questions;
    if (selectedCategory !== 'All') r = r.filter(q => q.category === selectedCategory);
    if (searchQuery.trim()) {
      const lq = searchQuery.toLowerCase();
      r = r.filter(q =>
        q.question.toLowerCase().includes(lq) ||
        q.explanation.toLowerCase().includes(lq) ||
        q.options.some(o => o.toLowerCase().includes(lq))
      );
    }
    return r;
  }, [questions, selectedCategory, searchQuery]);

  const score = useMemo(() => {
    let correct = 0, answered = 0;
    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] !== undefined) {
        answered++;
        if (userAnswers[q.id] === q.correctAnswer) correct++;
      }
    });
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const progress = filteredQuestions.length > 0
      ? Math.round((answered / filteredQuestions.length) * 100)
      : 0;
    return { correct, answered, total: filteredQuestions.length, pct, progress };
  }, [filteredQuestions, userAnswers]);

  const allDone = score.answered === score.total && score.total > 0;

  const handleAnswer = (qId, optIdx) => {
    if (userAnswers[qId] !== undefined) return;
    setUserAnswers(p => ({ ...p, [qId]: optIdx }));
    setShowExp(p => ({ ...p, [qId]: true }));
  };

  const handleShuffle = () => setQuestions(q => [...q].sort(() => Math.random() - 0.5));

  const handleReset = () => {
    setUserAnswers({});
    setShowExp({});
  };

  return (
    <div className="app-shell">
      {/* ambient blobs */}
      <div className="glow-1" />
      <div className="glow-2" />

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-inner">
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              <Award size={20} color="#080b12" strokeWidth={2.5} />
            </div>
            <div>
              <div className="logo-text">MedMaster</div>
              <div className="logo-sub">Medical Ethics & Forensics · 110 MCQs</div>
            </div>
          </div>

          {/* Right controls */}
          <div className="header-right">
            <div className="score-chip">
              <Target size={13} />
              {score.correct} / {score.answered} correct
            </div>
            {score.answered > 0 && (
              <div className="pct-chip">{score.pct}%</div>
            )}
            <button className="icon-btn" onClick={handleReset} title="Reset progress">
              <RefreshCw size={15} />
            </button>
            <button className="icon-btn" onClick={handleShuffle} title="Shuffle questions">
              <Shuffle size={15} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${score.progress}%` }} />
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="main-layout">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">

          {/* Search */}
          <div className="g-card" style={{ padding: '16px' }}>
            <div className="search-wrap">
              <Search size={14} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search questions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="g-card">
            <div className="section-label">Categories</div>
            <div className="cat-list">
              <button
                className={`cat-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All Topics
                <span className="cat-count">{initialMcqData.length}</span>
              </button>
              {categories.slice(1).map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat}
                  </span>
                  <span className="cat-count">{categoryCounts[cat]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="g-card">
            <div className="section-label">Your Stats</div>
            <div className="stats-grid">
              <div className="stat-cell">
                <div className="stat-val sky">{score.total}</div>
                <div className="stat-lbl">Total</div>
              </div>
              <div className="stat-cell">
                <div className="stat-val">{score.answered}</div>
                <div className="stat-lbl">Attempted</div>
              </div>
              <div className="stat-cell">
                <div className="stat-val mint">{score.correct}</div>
                <div className="stat-lbl">Correct</div>
              </div>
              <div className="stat-cell">
                <div className="stat-val rose">{score.answered - score.correct}</div>
                <div className="stat-lbl">Wrong</div>
              </div>
            </div>
            {score.answered > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
                  <span>Accuracy</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: score.pct >= 70 ? 'var(--mint)' : score.pct >= 50 ? 'var(--amber)' : 'var(--rose)' }}>
                    {score.pct}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${score.pct}%`, background: score.pct >= 70 ? 'linear-gradient(90deg,#34d9b3,#4ade80)' : score.pct >= 50 ? 'linear-gradient(90deg,#fbbf24,#f97316)' : 'linear-gradient(90deg,#f87171,#e11d48)' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="g-card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
            <button className="action-btn sky" onClick={handleShuffle}>
              <Shuffle size={14} /> Shuffle Order
            </button>
            <button className="action-btn danger" onClick={handleReset}>
              <RefreshCw size={14} /> Reset Progress
            </button>
          </div>
        </aside>

        {/* ── QUESTIONS ── */}
        <main>
          {/* Area header */}
          <div className="q-area-header">
            <div className="q-area-title">
              {selectedCategory === 'All' ? 'All Questions' : selectedCategory}
            </div>
            <div className="q-count-badge">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Completion banner */}
          {allDone && (
            <div className="completion-banner">
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {score.pct === 100 ? '🏆' : score.pct >= 70 ? '🎯' : '📚'}
              </div>
              <div className="completion-title" style={{ color: score.pct === 100 ? 'var(--mint)' : score.pct >= 70 ? 'var(--sky)' : 'var(--amber)' }}>
                {score.pct === 100 ? 'Perfect Score!' : score.pct >= 70 ? 'Well Done!' : 'Keep Studying!'}
              </div>
              <div className="completion-sub">
                You scored {score.correct} out of {score.total} — {score.pct}% accuracy.{' '}
                {score.pct < 100 && 'Review the explanations and try again.'}
              </div>
            </div>
          )}

          {/* Empty state */}
          {filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={44} className="empty-icon" />
              <div className="empty-title">No questions found</div>
              <div className="empty-sub">Try adjusting your search or select a different category.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredQuestions.map((q, idx) => {
                const answered  = userAnswers[q.id] !== undefined;
                const isCorrect = userAnswers[q.id] === q.correctAnswer;
                const cat       = CAT_COLOR[q.category] || { color: 'var(--sky)', bg: 'var(--sky-dim)' };

                return (
                  <div
                    key={q.id}
                    className={`q-card ${answered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                    style={{ animationDelay: `${Math.min(idx, 12) * 0.03}s`, opacity: 0, animationFillMode: 'forwards' }}
                  >
                    {/* Card header row */}
                    <div className="q-card-header">
                      <div className="q-num-badge">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div
                        className="q-cat-tag"
                        style={{ background: cat.bg, color: cat.color, borderColor: `${cat.color}22` }}
                      >
                        {q.category}
                      </div>
                    </div>

                    {/* Question */}
                    <p className="q-text">{q.question}</p>

                    {/* Options */}
                    <div className="options-list">
                      {q.options.map((opt, oi) => {
                        let cls = '';
                        if (answered) {
                          if (oi === q.correctAnswer) cls = 'opt-correct';
                          else if (oi === userAnswers[q.id]) cls = 'opt-wrong';
                          else cls = 'opt-dim';
                        }
                        return (
                          <button
                            key={oi}
                            className={`opt-btn ${cls}`}
                            onClick={() => handleAnswer(q.id, oi)}
                            disabled={answered}
                          >
                            <span className="opt-letter">{LETTERS[oi]}</span>
                            {opt}
                            {answered && oi === q.correctAnswer && (
                              <CheckCircle size={16} style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--mint)' }} />
                            )}
                            {answered && oi === userAnswers[q.id] && oi !== q.correctAnswer && (
                              <XCircle size={16} style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--rose)' }} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {showExp[q.id] && (
                      <div className="explanation">
                        <div className={`exp-label ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </div>
                        <p className="exp-text">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
