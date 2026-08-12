import { db, firebaseReady } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Used until you add real questions in /admin.html, or if Firestore can't be reached.
const fallbackQs = [['The workability of fresh concrete is measured by?',['Slump test','CBR test','Los Angeles test','Sieve analysis'],0,'The slump test is the common site measure of workability.'],['Which instrument measures horizontal and vertical angles?',['Level','Theodolite','Planimeter','Chain'],1,'A theodolite precisely measures both angles.'],['The usual binding material in RCC is?',['Bitumen','Cement','Lime','Gypsum'],1,'Cement binds the concrete matrix.'],['CBR is used in pavement design to assess?',['Concrete strength','Soil bearing capacity','Steel grade','Water quality'],1,'CBR evaluates subgrade strength.'],['The SI unit of stress is?',['Newton','Pascal','Joule','Watt'],1,'One Pascal equals one Newton per square metre.'],['Contour lines connect points of equal?',['Slope','Elevation','Distance','Pressure'],1,'They represent equal elevations.'],['A BOQ primarily lists?',['Workers','Quantities of work','Equipment','Drawings'],1,'A bill of quantities describes and quantifies work.'],['Which is a common cement soundness test?',['Le Chatelier','Slump','Vicat flow','CBR'],0,'Le Chatelier apparatus checks expansion.'],['Revit is widely used for?',['BIM','Road rolling','Concrete mixing','Soil drilling'],0,'Revit supports Building Information Modelling.'],['The foundation transfers building load to?',['Roof','Soil','Plaster','Beam'],1,'Foundations safely transfer loads to ground.'],['Camber is provided on roads for?',['Drainage','Lighting','Parking','Speed'],0,'It drains surface water.'],['The main tensile reinforcement in a simply supported slab lies near?',['Top','Bottom','Centre','Sides'],1,'Bottom fibres are generally in tension under gravity load.'],['A benchmark in surveying has known?',['Elevation','Area','Cost','Speed'],0,'A benchmark provides a reference elevation.'],['Which material improves concrete tensile capacity?',['Reinforcement steel','Sand','Water','Aggregate'],0,'Steel carries tensile forces in RCC.'],['Hydraulic gradient is the loss of head per?',['Unit length','Unit volume','Unit time','Unit weight'],0,'It is head loss divided by flow path length.'],['A tender document supports?',['Procurement','Painting','Excavation only','Survey calibration'],0,'It defines requirements for competitive procurement.'],['The ratio of water to cement is called?',['W/C ratio','Fineness modulus','Void ratio','Poisson ratio'],0,'Water-cement ratio strongly influences strength and workability.'],['ETABS is used mainly for?',['Building analysis','Land valuation','Water testing','Road signage'],0,'ETABS analyses and designs building structures.'],['Retaining walls resist?',['Lateral earth pressure','Rainfall only','Wind only','Heat'],0,'They hold soil where grade changes.'],['The purpose of curing concrete is?',['Maintain moisture','Increase sand','Remove steel','Add colour'],0,'Curing supports cement hydration and strength development.']];

let qs = fallbackQs;
let i = 0, answers = [];

async function loadQuestions() {
  if (!firebaseReady) return fallbackQs;
  try {
    const q = query(collection(db, 'mcqQuestions'), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackQs;
    return snap.docs.map(d => {
      const m = d.data();
      return [m.question, [m.optionA, m.optionB, m.optionC, m.optionD], Number(m.correctIndex), m.explanation || ''];
    });
  } catch (err) {
    console.warn('Could not load MCQs from Firestore, showing sample questions instead.', err);
    return fallbackQs;
  }
}

function draw() {
  const q = qs[i], selected = answers[i], e = document.getElementById('quiz');
  if (!e) return;
  e.innerHTML = `<span class="tag">Question ${i + 1} of ${qs.length}</span><p class="question">${q[0]}</p><div class="options">${q[1].map((x, n) => { const isCorrect = n === q[2], isSelected = selected === n, state = selected === undefined ? '' : isCorrect ? 'correct' : isSelected ? 'incorrect' : '', mark = selected === undefined ? '' : isCorrect ? '<span class="answer-mark">✓</span>' : isSelected ? '<span class="answer-mark">✕</span>' : ''; return `<button class="option ${state} ${isSelected ? 'selected' : ''}" onclick="pick(${n})">${'ABCD'[n]}. ${x}${mark}</button>` }).join('')}</div>${selected === undefined ? '' : `<div class="answer-feedback"><strong>${selected === q[2] ? 'Correct!' : 'Correct answer shown.'}</strong> ${q[3]}</div>`}<div class="hero-actions"><button class="btn btn-outline" onclick="prev()" ${i === 0 ? 'disabled' : ''}>Previous</button><button class="btn" onclick="next()">${i === qs.length - 1 ? 'Submit & Show Result' : 'Next Question'}</button></div>`;
}
function pick(n) { answers[i] = n; draw() }
function prev() { if (i) i--; draw() }
function next() {
  if (i < qs.length - 1) { i++; draw() }
  else {
    const c = answers.reduce((s, a, n) => s + (a === qs[n][2]), 0), p = Math.round(c / qs.length * 100);
    document.getElementById('quiz').innerHTML = `<div class="result"><h2>${p >= 85 ? 'Excellent' : p >= 60 ? 'Good effort' : 'Keep practising'} — ${p}%</h2><p>Total Questions: ${qs.length} · Correct Answers: ${c} · Wrong Answers: ${qs.length - c}</p><button class="btn" onclick="i=0;answers=[];draw()">Try Again</button></div>`;
  }
}
window.pick = pick; window.prev = prev; window.next = next;

loadQuestions().then(loaded => { qs = loaded; draw(); });
