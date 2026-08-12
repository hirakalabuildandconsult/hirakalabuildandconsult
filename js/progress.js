import { db, firebaseReady } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Used until you add real updates in /admin.html, or if Firestore can't be reached.
const fallbackUpdates = [
  { dateLabel: '12 August 2026', location: 'Butwal, Nepal', title: 'Residential Building Construction — RCC Column Casting', description: 'Reinforcement inspection and column concrete casting completed. Engineer/team: Hirakala site team.', percent: 42, status: 'On schedule', category: 'RCC Works' },
  { dateLabel: '11 August 2026', location: 'Palpa, Nepal', title: 'Rural Access Road — Survey Control', description: 'Alignment verified using Total Station; cross-section survey data prepared for design review.', percent: 28, status: 'On schedule', category: 'Surveying' },
  { dateLabel: '10 August 2026', location: 'Bhairahawa, Nepal', title: 'Commercial Hub — Foundation Inspection', description: 'Excavation level and column grid checked prior to PCC placement.', percent: 18, status: 'Approved', category: 'Site Inspection' }
];

async function loadUpdates() {
  if (!firebaseReady) return fallbackUpdates;
  try {
    const q = query(collection(db, 'progressUpdates'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackUpdates;
    return snap.docs.map(d => d.data());
  } catch (err) {
    console.warn('Could not load progress updates from Firestore, showing sample updates instead.', err);
    return fallbackUpdates;
  }
}

function renderFilters(list) {
  const el = document.getElementById('progressFilters');
  if (!el) return;
  const locations = [...new Set(list.map(u => (u.location || '').split(',')[0].trim()).filter(Boolean))];
  const values = ['All Projects', ...locations];
  el.innerHTML = values.map((v, i) => `<button class="filter ${i === 0 ? 'active' : ''}" data-value="${v}">${v}</button>`).join('');
}

function renderUpdates(list) {
  const el = document.getElementById('progressTimeline');
  if (!el) return;
  el.innerHTML = list.map(u => {
    const shortLocation = (u.location || '').split(',')[0].trim();
    return `<article class="timeline-item" data-category="All Projects ${shortLocation}"><span class="tag">${u.dateLabel} · ${u.location}</span><h3>${u.title}</h3><p>${u.description}</p><div class="progress-bar"><span style="width:${u.percent}%"></span></div><div class="meta">Progress status: ${u.status} · ${u.percent}% completed · Category: ${u.category || ''}</div></article>`;
  }).join('');
}

loadUpdates().then(list => { renderFilters(list); renderUpdates(list); });
