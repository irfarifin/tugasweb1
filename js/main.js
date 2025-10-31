// Tampilan Dashboard

(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw){
    // not logged in -> go to login
    window.location.href = 'index.html';
    return;
  }

  // Ucapan greeting ke user
  const user = JSON.parse(userRaw);
  const greetingEl = document.getElementById('greeting');
  const emailEl = document.getElementById('userEmail');

  // Kustomisasi pagi, siang dan malam
  const hour = new Date().getHours();
  let greet = 'Selamat datang';
  let icon = '👋';
  if(hour>=4 && hour<11){greet='Selamat pagi';icon='🌅'}
  else if(hour>=11 && hour<15){greet='Selamat siang';icon='☀️'}
  else if(hour>=15 && hour<18){greet='Selamat sore';icon='🌇'}
  else {greet='Selamat malam';icon='🌙'}

  if(greetingEl) greetingEl.textContent = `${icon} ${greet}, ${user.name}`;
  if(emailEl) emailEl.textContent = user.email;

  // Ringkasan
  document.getElementById('totalJenis').textContent = dataBahanAjar.length;
  document.getElementById('totalStok').textContent = dataBahanAjar.reduce((s,b)=>s+(Number(b.stok)||0),0);
  document.getElementById('totalDO').textContent = dataDO.length;

  // Popup Logout
const logoutModal = document.getElementById("logoutModal");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");

function showLogoutModal() {
  logoutModal.classList.add("active");
}

function hideLogoutModal() {
  logoutModal.classList.remove("active");
}

function doLogout() {
  sessionStorage.removeItem('sitta_user');
  window.location.href = 'index.html';
}

// Tombol konfirmasi
if(confirmLogout) confirmLogout.addEventListener('click', doLogout);
if(cancelLogout) cancelLogout.addEventListener('click', hideLogoutModal);

// Tombol logout utama (sidebar)
['logoutBtn', 'logoutSidebar', 'logoutTop'].forEach(id => {
  const btn = document.getElementById(id);
  if(btn) btn.addEventListener('click', showLogoutModal);
});


})();

// === SIDEBAR RESPONSIVE TOGGLE ===
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.createElement("div");

// Buat overlay hitam transparan
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

// ==== Simulasi menampilkan nomor DO setelah pemesanan ====

// Cek apakah ada nomor DO terbaru tersimpan di localStorage
const doSection = document.getElementById('doSection');
const doNumber = document.getElementById('doNumber');
const savedDO = localStorage.getItem('lastDO');

if (savedDO) {
  doSection.style.display = 'block';
  doNumber.textContent = savedDO;
}

// Fungsi untuk membuat DO baru (misalnya setelah pemesanan)
function generateNewDO() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newDO = `#DO-${randomNum}`;
  localStorage.setItem('lastDO', newDO);

  // tampilkan di dashboard
  doNumber.textContent = newDO;
  doSection.style.display = 'block';

  // animasi cantik
  doSection.style.animation = 'fadeIn 0.6s ease';
}

// contoh trigger setelah pesanan dibuat
// kamu bisa panggil `generateNewDO()` dari file pemesanan.js setelah pesanan selesai.
