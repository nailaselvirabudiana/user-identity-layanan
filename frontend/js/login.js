function renderLoginResult(result) {
  if (result.message) {
    return `<div class="error-box">❌ ${result.message}</div>`;
  }
  return `<div class="success-box"><div class="success-header">Login berhasil! Mengalihkan...</div></div>`;
}

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const emailEl = document.getElementById("loginEmail");
  const passwordEl = document.getElementById("loginPassword");
  const resultDiv = document.getElementById("loginResult");
  
  resultDiv.innerHTML = '<div class="loading">🔄 Memproses login...</div>';
  
  const result = await api("/auth/login", "POST", {
    email: emailEl.value,
    password: passwordEl.value
  });

  resultDiv.innerHTML = renderLoginResult(result);

  if (result.token) {
    setToken(result.token);
    setTimeout(() => {
      // Redirect based on role
      const { claims } = getSession();
      if (claims?.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        updateNav();
        setView("profile");
        // Auto-fill user ID based on logged in user
        if (claims?.user_id) {
          const profileUserId = document.getElementById("profileUserId");
          const updateUserId = document.getElementById("updateUserId");
          if (profileUserId) profileUserId.value = claims.user_id;
          if (updateUserId) updateUserId.value = claims.user_id;
        }
      }
    }, 800);
  }
});
