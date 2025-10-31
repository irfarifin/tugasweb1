(function() {
  const userRaw = sessionStorage.getItem('sitta_user');
  if (!userRaw) { 
    window.location.href = 'index.html'; 
    return; 
  }

  const user = JSON.parse(userRaw);
  const container = document.getElementById('stockContainer');

  // Ambil dataBahanAjar dari file data.js
  const books = dataBahanAjar.map(item => ({
    judul: item.namaBarang,
    jenisBarang: item.jenisBarang,
    stok: item.stok,
    gambar: item.cover,
    kodeBarang: item.kodeBarang,
    kodeLokasi: item.kodeLokasi,
    edisi: item.edisi
  }));

  function renderBooks() {
    container.innerHTML = '';
    books.forEach(item => {
      const card = document.createElement('div');
      card.className = 'stock-card';
      card.innerHTML = `
        <img src="${item.gambar}" alt="${item.judul}">
        <div class="stock-card-content">
          <h3>${item.judul}</h3>
          <p>Jenis: ${item.jenisBarang}</p>
          <p>Kode Barang: ${item.kodeBarang}</p>
          <p>Kode Lokasi: ${item.kodeLokasi}</p>
          <p>Edisi: ${item.edisi}</p>
          <p>Stok: ${item.stok}</p>
          <button class="action-btn pesan-btn" data-judul="${item.judul}" data-lokasi="${item.kodeLokasi}" data-edisi="${item.edisi}" ${item.stok <= 0 ? 'disabled' : ''}>
            ${item.stok > 0 ? 'Pesan Sekarang' : 'Stok Habis'}
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    // Tambahkan event listener ke tombol pesan
    document.querySelectorAll('.pesan-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const judul = e.target.dataset.judul;
        const lokasi = e.target.dataset.lokasi;
        const edisi = e.target.dataset.edisi;

        // Simpan data buku yang akan dipesan ke sessionStorage
        sessionStorage.setItem('selected_book', JSON.stringify({
          judul, lokasi, edisi, user: user.name
        }));

        // Arahkan ke halaman pemesanan
        window.location.href = 'pemesanan.html';
      });
    });
  }

  renderBooks();
})();

// Tombol kembali
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
