requireAuth();

function renderUpdateResult(user, isError = false) {
  if (isError || !user || user.message) {
    return `<div class="error-box">❌ ${user?.message || 'Update gagal'}</div>`;
  }

  return `
    <div class="success-box">
      <div class="success-header">Profil berhasil diupdate!</div>
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
        </div>
      </div>
    </div>
  `;
}

document.getElementById("updateForm").addEventListener("submit", async e => {
  e.preventDefault();
  const userIdEl = document.getElementById("updateUserId");
  const nameEl = document.getElementById("updateName");
  const emailEl = document.getElementById("updateEmail");
  const resultDiv = document.getElementById("updateResult");
  
  console.log('Form submitted!');
  console.log('User ID:', userIdEl.value);
  console.log('Name:', nameEl.value);
  console.log('Email:', emailEl.value);
  
  // Validate: employee can only update their own profile
  const { claims } = getSession();
  const isAdmin = claims?.role === 'admin';
  
  console.log('Is Admin:', isAdmin);
  console.log('Claims:', claims);
  
  if (!isAdmin && userIdEl.value !== claims?.user_id) {
    resultDiv.innerHTML = '<div class="error-box">❌ Anda hanya dapat mengupdate profil Anda sendiri!</div>';
    return;
  }
  
  const body = {};
  if (nameEl.value) body.name = nameEl.value;
  if (emailEl.value) body.email = emailEl.value;
  
  console.log('Request body:', body);
  
  if (Object.keys(body).length === 0) {
    resultDiv.innerHTML = '<div class="error-box">❌ Masukkan minimal satu field untuk diupdate (nama atau email)</div>';
    return;
  }

  resultDiv.innerHTML = '<div class="loading">🔄 Mengupdate profil...</div>';

  console.log('Sending PATCH request to:', `/users/${userIdEl.value}`);
  
  try {
    const result = await api(`/users/${userIdEl.value}`, "PATCH", body);
    console.log('API Response:', result);
    resultDiv.innerHTML = renderUpdateResult(result, !!result.message);
    
    // Clear form if success
    if (!result.message) {
      nameEl.value = '';
      emailEl.value = '';
    }
  } catch (error) {
    console.error('API Error:', error);
    resultDiv.innerHTML = `<div class="error-box">❌ Error: ${error.message}</div>`;
  }
});
