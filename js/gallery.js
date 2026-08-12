import { db, firebaseReady } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Used until you add real photos in /admin.html, or if Firestore can't be reached.
const fallbackPhotos = [
  ['images/luxury-house-modern-facade.jpg', 'Luxury house design · Modern facade', 'Buildings'],
  ['images/luxury-house-contemporary-villa.jpg', 'Luxury house design · Contemporary villa', 'Buildings'],
  ['images/luxury-house-elegant-elevation.jpg', 'Luxury house design · Elegant elevation', 'Buildings'],
  ['images/luxury-house-premium-residence.png', 'Luxury house design · Premium residence', 'Buildings'],
  ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80', 'Construction · Site progress', 'Construction'],
  ['https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=900&q=80', 'Engineering · Design coordination', 'Surveying'],
  ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80', 'Team · Site supervision', 'Site Visits'],
  ['https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80', 'Buildings · Completed architecture', 'Buildings']
];

async function loadPhotos() {
  if (!firebaseReady) return fallbackPhotos;
  try {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackPhotos;
    return snap.docs.map(d => {
      const g = d.data();
      return [g.imageUrl, g.caption, g.category];
    });
  } catch (err) {
    console.warn('Could not load gallery photos from Firestore, showing sample photos instead.', err);
    return fallbackPhotos;
  }
}

function renderFilters(list) {
  const el = document.getElementById('galleryFilters');
  if (!el) return;
  const categories = ['All', ...new Set(list.map(p => p[2]).filter(Boolean))];
  el.innerHTML = categories.map((c, i) => `<button class="filter ${i === 0 ? 'active' : ''}" data-value="${c}">${c}</button>`).join('');
}

function renderPhotos(list) {
  const el = document.getElementById('galleryGrid');
  if (!el) return;
  el.innerHTML = list.map(p => `<figure data-category="${p[2] || ''}"><img loading="lazy" src="${p[0]}" alt="${p[1] || ''}"><figcaption>${p[1] || ''}</figcaption></figure>`).join('');
}

loadPhotos().then(list => { renderFilters(list); renderPhotos(list); });
