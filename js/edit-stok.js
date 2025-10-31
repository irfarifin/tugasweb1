(function(){
  const userRaw = sessionStorage.getItem('sitta_user');
  if(!userRaw){
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(userRaw);
  if(user.role.toLowerCase() !== 'administrator'){
    alert('Akses ditolak. Hanya admin yang dapat mengedit stok.');
    window.location.href = 'dashboard.html';
    return;
  }

  const tableBody = document.querySelector('#stokTable tbody');
  const saveBtn = document.getElementById('saveChanges');
  const backBtn = document.getElementById('backBtn');

  // Ambil data bahan ajar dari localStorage jika ada perubahan sebelumnya
  let bahanAjar = JSON.parse(localStorage.getItem('dataBahanAjar')) || dataBahanAjar;

  // Tampilkan data ke tabel
  const renderTable = () => {
    tableBody.innerHTML = '';
    bahanAjar.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.namaBarang}</td>
        <td>${item.kode || '-'}</td>
        <td>${item.stok}</td>
        <td><input type="number" min="0" value="${item.stok}" data-index="${index}" class="stokInput"></td>
      `;
      tableBody.appendChild(tr);
    });
  };

  renderTable();

  // Simpan perubahan stok
  saveBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.stokInput');
    inputs.forEach(input => {
      const idx = input.dataset.index;
      bahanAjar[idx].stok = Number(input.value);
    });

    localStorage.setItem('dataBahanAjar', JSON.stringify(bahanAjar));

    // Popup sukses
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <h3>✅ Stok Berhasil Diperbarui</h3>
        <p>Perubahan telah disimpan ke sistem.</p>
        <div class="modal-actions">
          <button id="okBtn" class="btn-confirm">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    modal.querySelector('#okBtn').addEventListener('click', () => modal.remove());
  });

  // Tombol kembali
  backBtn.addEventListener('click', ()=>{
    window.location.href = 'dashboard.html';
  });

})();
