(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw){
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(userRaw);
  const menuContainer = document.getElementById('menuContainer');
  if(!menuContainer) return;

  // Bersihkan menu lama
  menuContainer.innerHTML = '';

  // === MENU ADMIN ===
  const adminMenu = [
    { icon: '🏠', label: 'Dashboard', link: 'dashboard.html' },
    { icon: '🛠️', label: 'Edit Stok', link: 'edit-stok.html' },
    { icon: '🧾', label: 'Riwayat Pemesanan', link: 'histori.html' }
  ];

  // === MENU NON-ADMIN ===
  const userMenu = [
    { icon: '🏠', label: 'Dashboard', link: 'dashboard.html' },
    { icon: '📦', label: 'Daftar Bahan Ajar', link: 'stok.html' },
    { icon: '🚚', label: 'Tracking DO', link: 'tracking.html' }
  ];

  // Pilih menu berdasarkan role
  const menus = (user.role.toLowerCase() === 'administrator') ? adminMenu : userMenu;

  // Render menu
  menus.forEach(item => {
    const a = document.createElement('a');
    a.href = item.link;
    a.innerHTML = `<span class="icon">${item.icon}</span><span class="label">${item.label}</span>`;
    if(window.location.pathname.includes(item.link)) a.classList.add('active');
    menuContainer.appendChild(a);
  });

  // === Logout Modal ===
  const logoutBtn = document.getElementById('logoutSidebar');
  const logoutModal = document.getElementById('logoutModal');
  const cancelLogout = document.getElementById('cancelLogout');
  const confirmLogout = document.getElementById('confirmLogout');

  if(logoutBtn){
    logoutBtn.addEventListener('click', () => logoutModal.style.display = 'flex');
  }
  if(cancelLogout){
    cancelLogout.addEventListener('click', () => logoutModal.style.display = 'none');
  }
  if(confirmLogout){
    confirmLogout.addEventListener('click', () => {
      sessionStorage.removeItem('sitta_user');
      window.location.href = 'login.html';
    });
  }

})();
