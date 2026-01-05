requireAuth();

function renderRegisterResult(user, isError = false) {
  if (isError || !user || user.message) {
    return `<div class="error-box">❌ ${user?.message || 'Registrasi gagal'}</div>`;
  }

  return `
    <div class="success-box">
      <div class="success-header">Karyawan berhasil didaftarkan!</div>
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <div class="profile-title">
            <h3>${user.name || 'N/A'}</h3>
            <span class="role-badge ${user.role}">${user.role === 'admin' ? 'Admin HR' : 'Karyawan'}</span>
          </div>
        </div>
        <div class="profile-body">
          <div class="profile-row">
            <span class="profile-label">User ID</span>
            <span class="profile-value">${user.id || 'N/A'}</span>
          </div>
          <div class="profile-row">
            <span class="profile-label">Nama Lengkap</span>
            <span class="profile-value">${user.name || 'N/A'}</span>
          </div>
          <div class="profile-row">
            <span class="profile-label">Email</span>
            <span class="profile-value">${user.email || 'N/A'}</span>
          </div>
          <div class="profile-row">
            <span class="profile-label">Role</span>
            <span class="profile-value">${user.role === 'admin' ? 'Admin HR' : 'Employee (Karyawan)'}</span>
          </div>
          <div class="profile-row">
            <span class="profile-label">Password Default</span>
            <span class="profile-value"><code>12345</code></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

document.getElementById("regForm").addEventListener("submit", async e => {
  e.preventDefault();
  const idEl = document.getElementById("regId");
  const nameEl = document.getElementById("regName");
  const emailEl = document.getElementById("regEmail");
  const roleEl = document.getElementById("regRole");
  const resultDiv = document.getElementById("registerResult");
  
  resultDiv.innerHTML = '<div class="loading">Mendaftarkan karyawan...</div>';
  
  const result = await api("/users", "POST", {
    id: idEl.value,
    name: nameEl.value,
    email: emailEl.value,
    role: roleEl.value
  });
  
  resultDiv.innerHTML = renderRegisterResult(result, !!result.message);
  
  // Clear form if success
  if (!result.message) {
    idEl.value = '';
    nameEl.value = '';
    emailEl.value = '';
    roleEl.value = 'employee';
  }
});
