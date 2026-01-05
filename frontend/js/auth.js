const API_BASE = "https://api.queenifyofficial.site/api";

function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // Decode base64 safely without eval-like patterns
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT parse error:', e);
    return null;
  }
}

function getSession() {
  const token = getToken();
  const claims = parseJwt(token);
  return { token, claims };
}

function setView(view) {
  const views = document.querySelectorAll("[data-view]");
  views.forEach(v => {
    const isActive = v.getAttribute("data-view") === view;
    v.style.display = isActive ? "block" : "none";
  });

  if (location.hash !== `#${view}`) {
    location.hash = `#${view}`;
  }
  
  // Update dynamic content based on view and role
  if (view === "update") {
    const { claims } = getSession();
    const isAdmin = claims?.role === 'admin';
    const subtitle = document.getElementById('updateSubtitle');
    const userIdInput = document.getElementById('updateUserId');
    
    if (subtitle && userIdInput) {
      if (isAdmin) {
        subtitle.textContent = 'Admin dapat mengupdate profil semua karyawan';
        userIdInput.removeAttribute('readonly');
      } else {
        subtitle.textContent = 'Anda hanya dapat mengupdate profil Anda sendiri';
        userIdInput.setAttribute('readonly', 'readonly');
        if (claims?.user_id) {
          userIdInput.value = claims.user_id;
        }
      }
    }
  } else if (view === "profile") {
    const { claims } = getSession();
    const subtitle = document.getElementById('profileSubtitle');
    const isAdmin = claims?.role === 'admin';
    
    if (subtitle) {
      if (isAdmin) {
        subtitle.textContent = 'Admin dapat melihat profil semua karyawan';
      } else {
        subtitle.textContent = 'Lihat profil Anda';
      }
    }
  }
}

function updateNav() {
  const { token, claims } = getSession();
  const isAuthed = Boolean(token);
  const isAdmin = claims?.role === "admin";

  document.querySelectorAll("[data-requires-auth]").forEach(el => {
    el.style.display = isAuthed ? "inline" : "none";
  });
  document.querySelectorAll("[data-requires-admin]").forEach(el => {
    el.style.display = isAuthed && isAdmin ? "inline" : "none";
  });

  document.querySelectorAll("[data-nav='login']").forEach(el => {
    el.style.display = isAuthed ? "none" : "inline";
  });
}

function bootSpa() {
  const { token, claims } = getSession();

  const hashView = (location.hash || "").replace("#", "");
  const initialView = hashView || (token ? "profile" : "login");

  updateNav();
  setView(initialView);

  if (token && claims?.user_id) {
    const profileUserId = document.getElementById("profileUserId");
    const updateUserId = document.getElementById("updateUserId");
    if (profileUserId && !profileUserId.value) profileUserId.value = claims.user_id;
    if (updateUserId && !updateUserId.value) updateUserId.value = claims.user_id;
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = 'index.html#login';
}

async function api(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function requireAuth() {
  if (!getToken()) {
    alert("Please login first");
    updateNav();
    setView("login");
    return false;
  }
  return true;
}

function quickLogin(email, password) {
  document.getElementById("loginEmail").value = email;
  document.getElementById("loginPassword").value = password;
  document.getElementById("loginForm").dispatchEvent(new Event("submit"));
}

window.addEventListener("hashchange", () => {
  const view = (location.hash || "").replace("#", "");
  if (view) setView(view);
});

window.addEventListener("DOMContentLoaded", bootSpa);
