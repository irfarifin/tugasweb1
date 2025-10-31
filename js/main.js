// === DASHBOARD ===
(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw){
        // not logged in -> go to login
    window.location.href = 'index.html';
    return;
  }


  const user = JSON.parse(userRaw);
  const greetingEl = document.getElementById('greeting');
  const emailEl = document.getElementById('userEmail');

  // === GREETING OTOMATIS ===
  const hour = new Date().getHours();
  let greet = 'Selamat datang';
  let icon = '👋';
  if(hour>=4 && hour<11){greet='Selamat pagi';icon='🌅'}
  else if(hour>=11 && hour<15){greet='Selamat siang';icon='☀️'}
  else if(hour>=15 && hour<18){greet='Selamat sore';icon='🌇'}
  else {greet='Selamat malam';icon='🌙'}

  greetingEl.textContent = `${icon} ${greet}, ${user.name}`;
  emailEl.textContent = user.email;

  // === RINGKASAN ===
  document.getElementById('totalJenis').textContent = dataBahanAjar.length;
  document.getElementById('totalStok').textContent = dataBahanAjar.reduce((sum,b)=>sum+(Number(b.stok)||0),0);
  document.getElementById('totalDO').textContent = dataDO.length;

  // === LOGOUT POPUP ===
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogout = document.getElementById("confirmLogout");
  const cancelLogout = document.getElementById("cancelLogout");

  function showLogoutModal(){ logoutModal.classList.add("active"); }
  function hideLogoutModal(){ logoutModal.classList.remove("active"); }
  function doLogout(){
    sessionStorage.removeItem('sitta_user');
    window.location.href = 'index.html';
  }

  if(confirmLogout) confirmLogout.addEventListener('click', doLogout);
  if(cancelLogout) cancelLogout.addEventListener('click', hideLogoutModal);
  const logoutSidebar = document.getElementById('logoutSidebar');
  if(logoutSidebar) logoutSidebar.addEventListener('click', showLogoutModal);
})();


// === SIDEBAR TOGGLE ===
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.createElement("div");


overlay.className = "sidebar-overlay";
document.body.appendChild(overlay);

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
    overlay.classList.toggle("active");
  });


  overlay.addEventListener("click", () => {
    sidebar.classList.remove("sidebar-open");
    overlay.classList.remove("active");
  });
}


// === KONTEN DINAMIS: PESANAN BARU / NOMOR DO ===
(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw) return;

  const user = JSON.parse(userRaw);
  const role = user.role ? user.role.toLowerCase() : 'user';
  const container = document.getElementById('dynamicSection');

  
  container.innerHTML = '';

  // === ADMIN: tampilkan notifikasi pesanan masuk ===
  if(role === 'administrator'){
    container.innerHTML = `
      <section class="card highlight">
        <h3>Pesanan Masuk</h3>
        <div style="background:linear-gradient(90deg,#004aad,#007bff);color:white;border-radius:12px;padding:18px;text-align:center;margin-top:10px;box-shadow:0 4px 10px rgba(0,0,0,0.15)">
          <h2 style="margin:0;font-weight:700;">📦 Ada Pesanan Baru!</h2>
          <p style="margin:6px 0 0;">Harap segera diproses melalui menu <b>Riwayat Pemesanan</b>.</p>
        </div>
      </section>
    `;
    return;
  }

  // === USER: cek DO berdasarkan akun ===
  const allOrders = JSON.parse(localStorage.getItem('sitta_orders') || '[]');

  // Ambil pesanan milik user ini berdasarkan email
  const userOrders = allOrders.filter(o => o.nama === user.name || o.email === user.email);

  if(userOrders.length === 0){
    // Belum pernah pesan → tidak tampil apa-apa
    return;
  }

  // Ambil DO terakhir user ini
  const lastOrder = userOrders[userOrders.length - 1];
  const lastDO = lastOrder.nomorDO || lastOrder.no;

  // Tampilkan kartu DO terbaru
  container.innerHTML = `
    <section class="card highlight">
      <h3>Nomor DO Terbaru</h3>
      <div style="background:linear-gradient(90deg,#0055aa,#007bff);color:white;border-radius:12px;padding:20px;text-align:center;margin-top:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
        <p style="font-size:1rem;margin:0;">Nomor DO Anda:</p>
        <h2 style="margin:8px 0;color:#fff;">${lastDO}</h2>
        <p style="opacity:0.85;font-style:italic;">Terima kasih! Pesanan Anda telah berhasil dibuat 🎉</p>
      </div>
    </section>
  `;
})();
