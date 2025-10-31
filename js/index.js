/* === LOGIN PAGE SCRIPT === */

// Sinkronisasi email dan password ke data.js
(function(){
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(e){
    e.preventDefault();

    const em = document.getElementById('email').value.trim();
    const pw = document.getElementById('password').value;

    if(!em || !pw){ 
      alert('Isi email dan password.'); 
      return; 
    }

    // Tombol login
    const btn = loginForm.querySelector('button[type="submit"]');
    const oldText = btn.textContent;
    btn.textContent = 'Memeriksa...'; 
    btn.disabled = true;

    // Error time ketika akun tidak ada dalam data
    setTimeout(()=>{
      const user = accounts.find(a =>
        a.email.toLowerCase() === em.toLowerCase() && a.password === pw
      );

      if(!user){
        alert('Email atau password yang anda masukkan salah.');
        btn.textContent = oldText; 
        btn.disabled = false;
        return;
      }

      // ✅ simpan data lengkap user ke sessionStorage
      sessionStorage.setItem('sitta_user', JSON.stringify({
        email: user.email,
        name: user.nama,      // <-- pakai user.nama biar greeting tidak undefined
        role: user.role,
        lokasi: user.lokasi
      }));

      btn.textContent = 'Berhasil login...';
      setTimeout(() => window.location.href = 'dashboard.html', 800);
    }, 900);
  });

    // Lupa kata sandi dan registrasi popup
    document.getElementById("forgotBtn").onclick = () => {
      document.getElementById("forgotModal").style.display = "flex";
    };
    document.getElementById("registerBtn").onclick = () => {
      document.getElementById("registerModal").style.display = "flex";
    };

    // Tombol tutup modal
    const closeForgot = () => document.getElementById("forgotModal").style.display = "none";
    const closeRegister = () => document.getElementById("registerModal").style.display = "none";

    document.getElementById("closeForgot").onclick = closeForgot;
    document.getElementById("closeForgot2").onclick = closeForgot;
    document.getElementById("closeRegister").onclick = closeRegister;
    document.getElementById("closeRegister2").onclick = closeRegister;

    // Tutup modal bila klik area luar
    window.onclick = (event) => {
      if (event.target.classList.contains("modal")) event.target.style.display = "none";
    };
  // --- Lupa password (simulasi)
  document.getElementById('sendReset').addEventListener('click', ()=>{
    const em = document.getElementById('fpEmail').value;
    if(!em) return alert('Masukkan email untuk reset.');
    alert('Link reset password dikirim (simulasi) ke: ' + em);
    closeModal(modalForgot);
  });

  // --- Registrasi (simulasi)
  document.getElementById('doRegister').addEventListener('click', ()=>{
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    if(!name || !email) return alert('Lengkapi nama dan email.');
    alert('Pendaftaran berhasil (simulasi). Anda dapat login setelah diverifikasi.');
    closeModal(modalRegister);
  });

  // === Popup Alert Custom ===
function showPopup(title, message) {
  const overlay = document.getElementById('popupAlert');
  const titleEl = document.getElementById('popupTitle');
  const msgEl = document.getElementById('popupMessage');
  const closeBtn = document.getElementById('popupClose');

  if (!overlay || !titleEl || !msgEl) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  overlay.classList.add('active');

  closeBtn.onclick = () => overlay.classList.remove('active');
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  };
}
})();
