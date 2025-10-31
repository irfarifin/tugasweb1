(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw){ 
    // not logged in -> go to login
    window.location.href = 'index.html'; 
    return; 
  }

  const user = JSON.parse(userRaw);
  const form = document.getElementById('orderForm');
  const select = document.getElementById('namaBuku');

  // === Ambil data akun dari data.js ===
  // Mencocokkan email user login dengan data akun untuk ambil lokasi
  const currentAccount = (typeof accounts !== 'undefined')
    ? accounts.find(acc => acc.email === user.email)
    : null;
  const lokasiUser = currentAccount ? currentAccount.lokasi : 'Tidak diketahui';

  // === Ambil stok terkini dari localStorage (atau dataBahanAjar default) ===
  const stokData = JSON.parse(localStorage.getItem('sitta_stok')) || dataBahanAjar;

  // === Isi dropdown buku ===
  stokData.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.namaBarang;
    opt.textContent = `${b.namaBarang} (Stok: ${b.stok})`;
    select.appendChild(opt);
  });

  // === Saat submit pesanan ===
  form.addEventListener('submit', e => {
    e.preventDefault();

    const buku = select.value;
    const jumlah = Number(document.getElementById('jumlah').value);

    if(!buku || !jumlah){
      alert('⚠️ Lengkapi semua data pesanan!');
      return;
    }

    // Cek stok cukup atau tidak
    const selectedBook = stokData.find(b => b.namaBarang === buku);
    if(!selectedBook){
      alert('❌ Buku tidak ditemukan.');
      return;
    }
    if(selectedBook.stok < jumlah){
      alert(`⚠️ Stok tidak cukup! Stok tersedia: ${selectedBook.stok}`);
      return;
    }

    // Generate nomor DO unik
    const nomorDO = 'DO' + Date.now();
    const total = jumlah * 50000; // contoh harga buku

    // Buat data pesanan baru
    const newOrder = {
      nomorDO,
      nama: user.name,
      bahan: buku,
      jumlah,
      total,
      tanggal: new Date().toLocaleDateString('id-ID'),
      status: 'Menunggu Verifikasi',
      ekspedisi: 'JNE',
      paket: 'Reguler',
      lokasi: lokasiUser, // ← lokasi otomatis dari akun
      catatan: '',
      perjalanan: [
        {
          waktu: new Date().toLocaleString('id-ID'),
          keterangan: 'Pesanan diterima oleh sistem SITTA - menunggu verifikasi.'
        }
      ]
    };

    // Simpan ke localStorage
    const orders = JSON.parse(localStorage.getItem('sitta_orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('sitta_orders', JSON.stringify(orders));

    // Kurangi stok buku
    const updatedStok = stokData.map(item => {
      if(item.namaBarang === buku){
        return { ...item, stok: item.stok - jumlah };
      }
      return item;
    });
    localStorage.setItem('sitta_stok', JSON.stringify(updatedStok));

    // Simpan DO terakhir untuk tracking otomatis
    localStorage.setItem('sitta_last_do', nomorDO);
    localStorage.setItem('lastDO', `#${nomorDO}`);

    // === Tampilkan popup sukses ===
    showPopupSuccess(nomorDO);
  });

  // === Tombol kembali ===
  const backBtn = document.getElementById('backBtn');
  if(backBtn){
    backBtn.addEventListener('click', ()=>{
      window.location.href = 'stok.html';
    });
  }

  // === Fungsi popup sukses ===
  function showPopupSuccess(nomorDO) {
    const popup = document.createElement("div");
    popup.className = "popup-overlay active";
    popup.innerHTML = `
      <div class="popup-box">
        <h3>✅ Pemesanan Berhasil!</h3>
        <p>Nomor DO Anda:</p>
        <h2 style="margin:8px 0; color:#007bff">${nomorDO}</h2>
        <p>Lokasi Pengiriman: <b>${lokasiUser}</b></p>
        <p>Gunakan nomor ini untuk melacak pesanan Anda.</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:15px">
          <button id="closePopup">Tutup</button>
          <button id="goTracking" style="background:#28a745">Lihat Tracking</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Tutup popup
    document.getElementById("closePopup").addEventListener("click", () => {
      popup.classList.remove("active");
      setTimeout(() => popup.remove(), 200);
    });

    // Ke halaman tracking
    document.getElementById("goTracking").addEventListener("click", () => {
      window.location.href = `tracking.html?do=${nomorDO}`;
    });
  }

})();
