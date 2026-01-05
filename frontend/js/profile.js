requireAuth();

function renderProfile(user) {
  if (!user || user.message) {
    return `<div class="error-box">❌ ${user?.message || 'Profil tidak ditemukan'}</div>`;
  }

  return `
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
          <span class="profile-label">Status</span>
          <span class="profile-value">
            <span class="status-badge ${user.status}">
              ${user.status === 'active' ? '✅ Aktif' : user.status === 'inactive' ? '⏸️ Non-aktif' : '🚫 Resign'}
            </span>
          </span>
        </div>
        ${user.createdAt ? `
        <div class="profile-row">
          <span class="profile-label">Terdaftar Sejak</span>
          <span class="profile-value">${new Date(user.createdAt).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>` : ''}
      </div>
    </div>
  `;
}

document.getElementById("getForm").addEventListener("submit", async e => {
  e.preventDefault();
  const userIdEl = document.getElementById("profileUserId");
  const resultDiv = document.getElementById("profileResult");
  
  resultDiv.innerHTML = '<div class="loading">🔄 Memuat profil...</div>';
  
  const result = await api(`/users/${userIdEl.value}`, "GET");
  resultDiv.innerHTML = renderProfile(result);
});
