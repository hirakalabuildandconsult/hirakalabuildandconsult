import { db, firebaseReady } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const fallbackUpdates = [
  { dateLabel: '12 August 2026', location: 'Butwal, Nepal', title: 'Residential Building Construction - RCC Column Casting', description: 'Reinforcement inspection and column concrete casting completed by the Hirakala site team.', percent: 42, status: 'On schedule', category: 'RCC Works', imageUrl: 'images/luxury-house-modern-facade.jpg' },
  { dateLabel: '11 August 2026', location: 'Palpa, Nepal', title: 'Rural Access Road - Survey Control', description: 'Alignment verified using Total Station; cross-section survey data prepared for design review.', percent: 28, status: 'On schedule', category: 'Surveying', imageUrl: 'images/luxury-house-contemporary-villa.jpg' },
  { dateLabel: '10 August 2026', location: 'Bhairahawa, Nepal', title: 'Commercial Hub - Foundation Inspection', description: 'Excavation level and column grid checked before PCC placement.', percent: 18, status: 'Approved', category: 'Site Inspection', imageUrl: 'images/completed-residential-building.jpg' }
];

async function loadUpdates() {
  if (!firebaseReady) return fallbackUpdates;
  try {
    const snapshot = await getDocs(query(collection(db, 'progressUpdates'), orderBy('createdAt', 'desc')));
    return snapshot.empty ? fallbackUpdates : snapshot.docs.map(document => document.data());
  } catch (error) {
    console.warn('Could not load project updates; showing project samples instead.', error);
    return fallbackUpdates;
  }
}

function renderFilters(list) {
  const element = document.getElementById('progressFilters');
  if (!element) return;
  const locations = [...new Set(list.map(update => (update.location || '').split(',')[0].trim()).filter(Boolean))];
  element.innerHTML = ['All Projects', ...locations].map((name, index) => `<button class="filter ${index === 0 ? 'active' : ''}" data-value="${name}">${name}</button>`).join('');
}

function renderUpdates(list) {
  const element = document.getElementById('progressTimeline');
  if (!element) return;
  element.innerHTML = list.map(update => {
    const location = (update.location || '').split(',')[0].trim();
    const percent = Math.max(0, Math.min(100, Number(update.percent) || 0));
    const image = update.imageUrl || 'images/completed-residential-building.jpg';
    return `<article class="timeline-item timeline-card" data-category="All Projects ${location}"><img class="timeline-image" src="${image}" alt="${update.title || 'Project update'}"><div><span class="tag">${update.dateLabel || ''} · ${update.location || ''}</span><h3>${update.title || 'Project update'}</h3><p>${update.description || ''}</p><div class="progress-label"><span>${update.status || 'In progress'}</span><strong>${percent}%</strong></div><div class="progress-bar"><span style="width:${percent}%"></span></div><div class="meta">Category: ${update.category || 'Construction'}</div></div></article>`;
  }).join('');
}

loadUpdates().then(updates => { renderFilters(updates); renderUpdates(updates); });
