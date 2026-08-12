// Shared Firebase setup. Every module that needs the database imports from
// here, so the app is only initialized once per page load.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const cfg = window.HIRAKALA_CONFIG && window.HIRAKALA_CONFIG.firebase;
const isConfigured = cfg && cfg.apiKey && !cfg.apiKey.startsWith("PASTE_");

export const firebaseReady = !!isConfigured;
export const app = isConfigured ? initializeApp(cfg) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
