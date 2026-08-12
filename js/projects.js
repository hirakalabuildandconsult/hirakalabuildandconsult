import { db, firebaseReady } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Used until you add real projects in /admin.html, or if Firestore can't be reached.
const fallbackProjects = [
  ['Completed Residential Building', 'Nepal', 'Residential', 'Completed', 'A completed residential building delivered with practical planning, sound construction and a clean modern finish. Hirakala Build & Consult turns your vision into a home built to last.', 'images/completed-residential-building.jpg', 'https://www.facebook.com/photo.php?fbid=122097535406457712&set=pb.61563731382817.-2207520000&type=3'],
  ['Butwal Residence', 'Butwal', 'Residential', '2026', 'Building planning, RCC design & supervision', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
  ['Siddhartha Commercial Hub', 'Bhairahawa', 'Commercial', '2025', 'Structural design, BOQ & project management', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
  ['Rural Access Road', 'Palpa', 'Roads', '2025', 'Survey, estimate & construction supervision', 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=800&q=80'],
  ['BIM Coordination Model', 'Kathmandu', 'BIM', '2026', 'Revit modelling & interdisciplinary coordination', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80']
];

async function loadProjects() {
  if (!firebaseReady) return fallbackProjects;
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackProjects;
    return snap.docs.map(d => {
      const p = d.data();
      return [p.title, p.location, p.category, p.status, p.description, p.imageUrl, p.link || ''];
    });
  } catch (err) {
    console.warn('Could not load projects from Firestore, showing sample projects instead.', err);
    return fallbackProjects;
  }
}

function renderProjects(list, id = 'projectsGrid') {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = list.map(p => `<article class="card" data-category="${p[2]}${p[3] === 'Completed' ? ' Completed' : ''}"><img class="card-img" loading="lazy" src="${p[5]}" alt="${p[0]} project in ${p[1]}"><div class="card-body"><span class="tag">${p[2]} · ${p[3]}</span><h3>${p[0]}</h3><p>${p[4]}</p><div class="meta" style="margin-top:13px">📍 ${p[1]} · ${p[6] ? `<a href="${p[6]}" target="_blank" rel="noopener noreferrer">View project photo ↗</a>` : '<a href="contact.html">Discuss project →</a>'}</div></div></article>`).join('');
}

loadProjects().then(list => renderProjects(list));
