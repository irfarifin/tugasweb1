// Administrator
(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw){
    // belum login
    window.location.href = 'index.html';
    return;
  }

  const user = JSON.parse(userRaw);
  if(user.role.toLowerCase() !== 'administrator'){
    alert('Akses ditolak. Hanya admin yang dapat mengedit stok.');
    window.location.href = 'dashboard.html';
    return;
  }

  const container = document.getElementById('stockContainer');
  const backBtn = document.getElementById('backBtn');

  // Ambil data bahan ajar
  let bahanAjar = JSON.parse(localStorage.getItem('dataBahanAjar')) || dataBahanAjar;

  // Render card per buku
  const renderCards = () => {
    container.innerHTML = '';
    bahanAjar.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'stock-card';
      card.innerHTML = `
        <img src="${item.cover}" alt="${item.namaBarang}">
        <div class="stock-card-content">
          <h3>${item.namaBarang}</h3>
          <p>Kode: ${item.kodeBarang}</p>
          <p>Lokasi: ${item.kodeLokasi}</p>
          <p>Jenis: ${item.jenisBarang}</p>
          <p>Edisi: ${item.edisi}</p>
          <label>Stok:</label>
          <input type="number" min="0" value="${item.stok}" data-index="${index}" class="stok-input">
          <button class="update-btn" data-index="${index}">Perbarui</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Tambahkan event listener ke tombol update
    document.querySelectorAll('.update-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        const input = container.querySelector(`.stok-input[data-index="${idx}"]`);
        const newStok = Number(input.value);
        bahanAjar[idx].stok = newStok;
        localStorage.setItem('dataBahanAjar', JSON.stringify(bahanAjar));
        showSuccessModal();
      });
    });
  };

  renderCards();

  // Modal sukses update stok
  const showSuccessModal = () => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <h3>✅ Stok Berhasil Diperbarui</h3>
        <p>Perubahan stok telah disimpan.</p>
        <div class="modal-actions">
          <button id="okBtn" class="btn-confirm">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#okBtn').addEventListener('click', () => modal.remove());
  };

  // Tombol kembali
  backBtn.addEventListener('click', ()=>{
    window.location.href = 'dashboard.html';
  });

})();
