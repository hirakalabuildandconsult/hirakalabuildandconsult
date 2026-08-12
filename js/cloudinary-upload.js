// Uploads a File object to Cloudinary using an unsigned upload preset and
// resolves with the public HTTPS URL of the uploaded photo.
export async function uploadPhoto(file) {
  const cfg = window.HIRAKALA_CONFIG && window.HIRAKALA_CONFIG.cloudinary;
  if (!cfg || !cfg.cloudName || cfg.cloudName.startsWith("PASTE_")) {
    throw new Error("Cloudinary is not configured yet. Fill in js/firebase-config.js first.");
  }
  const url = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", cfg.uploadPreset);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Photo upload failed (${res.status}). ${detail}`);
  }
  const data = await res.json();
  return data.secure_url;
}
