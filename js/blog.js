import { db, firebaseReady } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Used until you add real posts in /admin.html, or if Firestore can't be reached.
const fallbackBlogs = [
  ['Seismic Design Considerations for Nepalese Homes', 'Structural Engineering', 'How thoughtful detailing, soil assessment and code-led design protect a home.', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80'],
  ['How to Read a BOQ Before You Build', 'Estimation & Costing', 'A practical checklist for clients planning a transparent construction budget.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'],
  ['Total Station Survey: From Field to Design', 'Surveying', 'Why accurate site control is the foundation of dependable project decisions.', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80']
];

async function loadBlogs() {
  if (!firebaseReady) return fallbackBlogs;
  try {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return fallbackBlogs;
    return snap.docs.map(d => {
      const b = d.data();
      return [b.title, b.category, b.excerpt, b.imageUrl, b.dateLabel || ''];
    });
  } catch (err) {
    console.warn('Could not load blog posts from Firestore, showing sample posts instead.', err);
    return fallbackBlogs;
  }
}

function renderBlogs(list, id = 'blogGrid') {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = list.map(b => `<article class="card"><img class="card-img" loading="lazy" src="${b[3]}" alt="${b[0]}"><div class="card-body"><span class="tag">${b[1]} · ${b[4] || '12 Aug 2026'}</span><h3>${b[0]}</h3><p>${b[2]}</p><p style="margin-top:14px"><a href="blog.html" class="tag">Read article →</a></p></div></article>`).join('');
}

loadBlogs().then(list => renderBlogs(list));
