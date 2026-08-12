import { auth, db, firebaseReady } from './firebase-init.js';
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { uploadPhoto } from './cloudinary-upload.js';

const cfg = window.HIRAKALA_CONFIG || {};
const adminEmail = cfg.adminEmail;

const $ = id => document.getElementById(id);

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `admin-status show ${type}`;
}
function hideStatus(el) {
  el.className = 'admin-status';
}

// ---------- Config guard ----------
if (!firebaseReady) {
  $('configWarning').style.display = 'block';
  $('configWarning').textContent =
    'Firebase is not configured yet. Open js/firebase-config.js and fill in your Firebase project details, then reload this page.';
} else {
  init();
}

function init() {
  onAuthStateChanged(auth, user => {
    if (user && user.email === adminEmail) {
      $('loginView').style.display = 'none';
      $('dashboardView').style.display = 'block';
      $('whoami').textContent = `Signed in as ${user.email}`;
      loadAllLists();
    } else if (user) {
      // Signed in, but not the configured admin account
      showStatus($('loginStatus'), `${user.email} is not the configured admin account.`, 'error');
      $('loginView').style.display = 'block';
      $('dashboardView').style.display = 'none';
      signOut(auth);
    } else {
      $('loginView').style.display = 'block';
      $('dashboardView').style.display = 'none';
    }
  });

  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    hideStatus($('loginStatus'));
    try {
      await signInWithEmailAndPassword(auth, $('loginEmail').value.trim(), $('loginPassword').value);
    } catch (err) {
      showStatus($('loginStatus'), describeAuthError(err), 'error');
    }
  });

  $('signOutBtn').addEventListener('click', () => signOut(auth));

  // Tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  wireProjects();
  wireGallery();
  wireBlogs();
  wireMcq();
  wireProgress();
}

function describeAuthError(err) {
  const code = err.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Incorrect email or password.';
  }
  return err.message || 'Sign-in failed.';
}

function loadAllLists() {
  refreshProjects();
  refreshGallery();
  refreshBlogs();
  refreshMcq();
  refreshProgress();
}

async function confirmDelete(label) {
  return window.confirm(`Delete "${label}"? This cannot be undone.`);
}

// ==================== PROJECTS ====================
let projectCurrentImage = '';

function wireProjects() {
  $('projectForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('globalStatus');
    const submitBtn = $('projectSubmitBtn');
    submitBtn.disabled = true;
    try {
      let imageUrl = projectCurrentImage;
      const file = $('projectPhoto').files[0];
      if (file) {
        showStatus(status, 'Uploading photo…', 'info');
        imageUrl = await uploadPhoto(file);
      }
      if (!imageUrl) throw new Error('Please choose a photo for this project.');

      const data = {
        title: $('projectTitle').value.trim(),
        location: $('projectLocation').value.trim(),
        category: $('projectCategory').value,
        status: $('projectStatus').value.trim(),
        description: $('projectDescription').value.trim(),
        imageUrl,
        link: $('projectLink').value.trim(),
        createdAt: serverTimestamp()
      };

      const editId = $('projectEditId').value;
      if (editId) {
        await updateDoc(doc(db, 'projects', editId), data);
        showStatus(status, 'Project updated.', 'ok');
      } else {
        await addDoc(collection(db, 'projects'), data);
        showStatus(status, 'Project added.', 'ok');
      }
      resetProjectForm();
      refreshProjects();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  $('projectCancelBtn').addEventListener('click', resetProjectForm);
}

function resetProjectForm() {
  $('projectForm').reset();
  $('projectEditId').value = '';
  $('projectSubmitBtn').textContent = 'Add project';
  $('projectCancelBtn').style.display = 'none';
  projectCurrentImage = '';
}

async function refreshProjects() {
  const listEl = $('projectAdminList');
  listEl.innerHTML = 'Loading…';
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--muted)">No projects added yet.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(docSnap => {
      const p = docSnap.data();
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      row.innerHTML = `<img src="${p.imageUrl}" alt=""><div class="info"><h4>${p.title}</h4><p>${p.location} · ${p.category} · ${p.status}</p></div><div class="actions"><button data-act="edit">Edit</button><button data-act="delete" class="danger">Delete</button></div>`;
      row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        $('projectEditId').value = docSnap.id;
        $('projectTitle').value = p.title;
        $('projectLocation').value = p.location;
        $('projectCategory').value = p.category;
        $('projectStatus').value = p.status;
        $('projectDescription').value = p.description;
        $('projectLink').value = p.link || '';
        projectCurrentImage = p.imageUrl;
        $('projectSubmitBtn').textContent = 'Save changes';
        $('projectCancelBtn').style.display = 'inline-flex';
        window.scrollTo({ top: $('projectForm').offsetTop - 100, behavior: 'smooth' });
      });
      row.querySelector('[data-act="delete"]').addEventListener('click', async () => {
        if (!(await confirmDelete(p.title))) return;
        await deleteDoc(doc(db, 'projects', docSnap.id));
        refreshProjects();
      });
      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color:#c63838">Could not load projects: ${err.message}</p>`;
  }
}

// ==================== GALLERY ====================
let galleryCurrentImage = '';

function wireGallery() {
  $('galleryForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('globalStatus');
    const submitBtn = $('gallerySubmitBtn');
    submitBtn.disabled = true;
    try {
      let imageUrl = galleryCurrentImage;
      const file = $('galleryPhoto').files[0];
      if (file) {
        showStatus(status, 'Uploading photo…', 'info');
        imageUrl = await uploadPhoto(file);
      }
      if (!imageUrl) throw new Error('Please choose a photo.');

      const data = {
        imageUrl,
        caption: $('galleryCaption').value.trim(),
        category: $('galleryCategory').value,
        createdAt: serverTimestamp()
      };

      const editId = $('galleryEditId').value;
      if (editId) {
        await updateDoc(doc(db, 'gallery', editId), data);
        showStatus(status, 'Photo updated.', 'ok');
      } else {
        await addDoc(collection(db, 'gallery'), data);
        showStatus(status, 'Photo added.', 'ok');
      }
      resetGalleryForm();
      refreshGallery();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  $('galleryCancelBtn').addEventListener('click', resetGalleryForm);
}

function resetGalleryForm() {
  $('galleryForm').reset();
  $('galleryEditId').value = '';
  $('gallerySubmitBtn').textContent = 'Add photo';
  $('galleryCancelBtn').style.display = 'none';
  galleryCurrentImage = '';
}

async function refreshGallery() {
  const listEl = $('galleryAdminList');
  listEl.innerHTML = 'Loading…';
  try {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--muted)">No photos added yet.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(docSnap => {
      const g = docSnap.data();
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      row.innerHTML = `<img src="${g.imageUrl}" alt=""><div class="info"><h4>${g.caption}</h4><p>${g.category}</p></div><div class="actions"><button data-act="edit">Edit</button><button data-act="delete" class="danger">Delete</button></div>`;
      row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        $('galleryEditId').value = docSnap.id;
        $('galleryCaption').value = g.caption;
        $('galleryCategory').value = g.category;
        galleryCurrentImage = g.imageUrl;
        $('gallerySubmitBtn').textContent = 'Save changes';
        $('galleryCancelBtn').style.display = 'inline-flex';
        window.scrollTo({ top: $('galleryForm').offsetTop - 100, behavior: 'smooth' });
      });
      row.querySelector('[data-act="delete"]').addEventListener('click', async () => {
        if (!(await confirmDelete(g.caption))) return;
        await deleteDoc(doc(db, 'gallery', docSnap.id));
        refreshGallery();
      });
      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color:#c63838">Could not load photos: ${err.message}</p>`;
  }
}

// ==================== BLOG ====================
let blogCurrentImage = '';

function wireBlogs() {
  $('blogForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('globalStatus');
    const submitBtn = $('blogSubmitBtn');
    submitBtn.disabled = true;
    try {
      let imageUrl = blogCurrentImage;
      const file = $('blogPhoto').files[0];
      if (file) {
        showStatus(status, 'Uploading photo…', 'info');
        imageUrl = await uploadPhoto(file);
      }
      if (!imageUrl) throw new Error('Please choose a cover photo.');

      const data = {
        title: $('blogTitle').value.trim(),
        category: $('blogCategory').value.trim(),
        excerpt: $('blogExcerpt').value.trim(),
        imageUrl,
        dateLabel: $('blogDateLabel').value.trim(),
        createdAt: serverTimestamp()
      };

      const editId = $('blogEditId').value;
      if (editId) {
        await updateDoc(doc(db, 'blogs', editId), data);
        showStatus(status, 'Post updated.', 'ok');
      } else {
        await addDoc(collection(db, 'blogs'), data);
        showStatus(status, 'Post added.', 'ok');
      }
      resetBlogForm();
      refreshBlogs();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  $('blogCancelBtn').addEventListener('click', resetBlogForm);
}

function resetBlogForm() {
  $('blogForm').reset();
  $('blogEditId').value = '';
  $('blogSubmitBtn').textContent = 'Add post';
  $('blogCancelBtn').style.display = 'none';
  blogCurrentImage = '';
}

async function refreshBlogs() {
  const listEl = $('blogAdminList');
  listEl.innerHTML = 'Loading…';
  try {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--muted)">No posts added yet.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(docSnap => {
      const b = docSnap.data();
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      row.innerHTML = `<img src="${b.imageUrl}" alt=""><div class="info"><h4>${b.title}</h4><p>${b.category}</p></div><div class="actions"><button data-act="edit">Edit</button><button data-act="delete" class="danger">Delete</button></div>`;
      row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        $('blogEditId').value = docSnap.id;
        $('blogTitle').value = b.title;
        $('blogCategory').value = b.category;
        $('blogExcerpt').value = b.excerpt;
        $('blogDateLabel').value = b.dateLabel || '';
        blogCurrentImage = b.imageUrl;
        $('blogSubmitBtn').textContent = 'Save changes';
        $('blogCancelBtn').style.display = 'inline-flex';
        window.scrollTo({ top: $('blogForm').offsetTop - 100, behavior: 'smooth' });
      });
      row.querySelector('[data-act="delete"]').addEventListener('click', async () => {
        if (!(await confirmDelete(b.title))) return;
        await deleteDoc(doc(db, 'blogs', docSnap.id));
        refreshBlogs();
      });
      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color:#c63838">Could not load posts: ${err.message}</p>`;
  }
}

// ==================== MCQ ====================
function wireMcq() {
  $('mcqForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('globalStatus');
    const submitBtn = $('mcqSubmitBtn');
    submitBtn.disabled = true;
    try {
      const correctIndex = Number(document.querySelector('input[name="mcqCorrect"]:checked').value);
      const data = {
        question: $('mcqQuestion').value.trim(),
        optionA: $('mcqOptionA').value.trim(),
        optionB: $('mcqOptionB').value.trim(),
        optionC: $('mcqOptionC').value.trim(),
        optionD: $('mcqOptionD').value.trim(),
        correctIndex,
        explanation: $('mcqExplanation').value.trim(),
        createdAt: serverTimestamp()
      };

      const editId = $('mcqEditId').value;
      if (editId) {
        await updateDoc(doc(db, 'mcqQuestions', editId), data);
        showStatus(status, 'Question updated.', 'ok');
      } else {
        await addDoc(collection(db, 'mcqQuestions'), data);
        showStatus(status, 'Question added.', 'ok');
      }
      resetMcqForm();
      refreshMcq();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  $('mcqCancelBtn').addEventListener('click', resetMcqForm);
}

function resetMcqForm() {
  $('mcqForm').reset();
  $('mcqEditId').value = '';
  $('mcqSubmitBtn').textContent = 'Add question';
  $('mcqCancelBtn').style.display = 'none';
}

async function refreshMcq() {
  const listEl = $('mcqAdminList');
  listEl.innerHTML = 'Loading…';
  try {
    const q = query(collection(db, 'mcqQuestions'), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--muted)">No questions added yet.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(docSnap => {
      const m = docSnap.data();
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      row.innerHTML = `<div class="info"><h4>${m.question}</h4><p>Correct: ${'ABCD'[m.correctIndex]}</p></div><div class="actions"><button data-act="edit">Edit</button><button data-act="delete" class="danger">Delete</button></div>`;
      row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        $('mcqEditId').value = docSnap.id;
        $('mcqQuestion').value = m.question;
        $('mcqOptionA').value = m.optionA;
        $('mcqOptionB').value = m.optionB;
        $('mcqOptionC').value = m.optionC;
        $('mcqOptionD').value = m.optionD;
        $('mcqExplanation').value = m.explanation || '';
        document.querySelector(`input[name="mcqCorrect"][value="${m.correctIndex}"]`).checked = true;
        $('mcqSubmitBtn').textContent = 'Save changes';
        $('mcqCancelBtn').style.display = 'inline-flex';
        window.scrollTo({ top: $('mcqForm').offsetTop - 100, behavior: 'smooth' });
      });
      row.querySelector('[data-act="delete"]').addEventListener('click', async () => {
        if (!(await confirmDelete(m.question))) return;
        await deleteDoc(doc(db, 'mcqQuestions', docSnap.id));
        refreshMcq();
      });
      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color:#c63838">Could not load questions: ${err.message}</p>`;
  }
}

// ==================== PROGRESS ====================
function wireProgress() {
  $('progressForm').addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('globalStatus');
    const submitBtn = $('progressSubmitBtn');
    submitBtn.disabled = true;
    try {
      const data = {
        dateLabel: $('progressDate').value.trim(),
        location: $('progressLocation').value.trim(),
        title: $('progressTitle').value.trim(),
        description: $('progressDescription').value.trim(),
        percent: Number($('progressPercent').value),
        status: $('progressStatus').value,
        category: $('progressCategory').value.trim(),
        createdAt: serverTimestamp()
      };

      const editId = $('progressEditId').value;
      if (editId) {
        await updateDoc(doc(db, 'progressUpdates', editId), data);
        showStatus(status, 'Update saved.', 'ok');
      } else {
        await addDoc(collection(db, 'progressUpdates'), data);
        showStatus(status, 'Update added.', 'ok');
      }
      resetProgressForm();
      refreshProgress();
    } catch (err) {
      showStatus(status, err.message || 'Something went wrong.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  $('progressCancelBtn').addEventListener('click', resetProgressForm);
}

function resetProgressForm() {
  $('progressForm').reset();
  $('progressEditId').value = '';
  $('progressSubmitBtn').textContent = 'Add update';
  $('progressCancelBtn').style.display = 'none';
}

async function refreshProgress() {
  const listEl = $('progressAdminList');
  listEl.innerHTML = 'Loading…';
  try {
    const q = query(collection(db, 'progressUpdates'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) { listEl.innerHTML = '<p style="color:var(--muted)">No updates added yet.</p>'; return; }
    listEl.innerHTML = '';
    snap.forEach(docSnap => {
      const u = docSnap.data();
      const row = document.createElement('div');
      row.className = 'admin-list-item';
      row.innerHTML = `<div class="info"><h4>${u.title}</h4><p>${u.dateLabel} · ${u.location} · ${u.percent}%</p></div><div class="actions"><button data-act="edit">Edit</button><button data-act="delete" class="danger">Delete</button></div>`;
      row.querySelector('[data-act="edit"]').addEventListener('click', () => {
        $('progressEditId').value = docSnap.id;
        $('progressDate').value = u.dateLabel;
        $('progressLocation').value = u.location;
        $('progressTitle').value = u.title;
        $('progressDescription').value = u.description;
        $('progressPercent').value = u.percent;
        $('progressStatus').value = u.status;
        $('progressCategory').value = u.category || '';
        $('progressSubmitBtn').textContent = 'Save changes';
        $('progressCancelBtn').style.display = 'inline-flex';
        window.scrollTo({ top: $('progressForm').offsetTop - 100, behavior: 'smooth' });
      });
      row.querySelector('[data-act="delete"]').addEventListener('click', async () => {
        if (!(await confirmDelete(u.title))) return;
        await deleteDoc(doc(db, 'progressUpdates', docSnap.id));
        refreshProgress();
      });
      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = `<p style="color:#c63838">Could not load updates: ${err.message}</p>`;
  }
}
