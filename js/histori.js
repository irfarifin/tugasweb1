// Tampilan Riwayat Pemesanan dari Data dummy + input user

(function () {
  const userRaw = sessionStorage.getItem("sitta_user");
  if (!userRaw) {
    // not logged in -> go to login
    window.location.href = "index.html";
    return;
  }

  const el = document.getElementById("timeline");
  if (!el) return;

  // Ambil data dari localStorage (pemesanan baru)
  const localOrders = JSON.parse(localStorage.getItem("sitta_orders") || "[]");

  // Ambil juga histori lama dari dataHistori (jika ada)
  const staticHistori = typeof dataHistori !== "undefined" ? dataHistori : [];

  // Gabungkan semuanya
  const allHistori = [...staticHistori, ...localOrders];

  if (allHistori.length === 0) {
    el.innerHTML = `<p>Tidak ada riwayat pemesanan.</p>`;
    return;
  }

  // Helper format angka
  function numberWithCommas(x) {
    return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Render setiap transaksi
  allHistori.reverse().forEach((trx) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    const dotClass = trx.status === "Selesai" ? "selesai" : "proses";

    // Cari lokasi berdasarkan nama barang (kalau ada di dataBahanAjar)
    let lokasi = "-";
    if (typeof dataBahanAjar !== "undefined") {
      const buku = dataBahanAjar.find((b) => b.namaBarang === trx.bahan);
      if (buku) lokasi = buku.kodeLokasi;
    }

    // Tambahkan Nomor DO (Bisa diklik untuk tracking)
    const nomorDO = trx.nomorDO
      ? `<p style="margin-top:6px;font-size:0.9rem;">
          <strong>Nomor DO:</strong> 
          <a href="tracking.html?do=${trx.nomorDO}" 
             style="color:#007bff;text-decoration:none;">
             ${trx.nomorDO}
          </a>
        </p>`
      : "";

    item.innerHTML = `
      <div class="timeline-dot ${dotClass}"></div>
      <div class="timeline-content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <small class="muted">${trx.tanggal}</small>
          <span class="status ${dotClass}" style="font-weight:700;padding:4px 8px;border-radius:8px">${trx.status}</span>
        </div>
        <h4>${trx.bahan || trx.namaBarang}</h4>
        <p class="muted">${trx.nama || "Pengguna"} • Jumlah: ${trx.jumlah}</p>
        <p style="margin-top:4px;font-size:0.85rem;color:#b0c4ff">Lokasi: ${lokasi}</p>
        <p style="margin-top:8px"><strong>Total: Rp ${numberWithCommas(trx.total || 0)}</strong></p>
        ${nomorDO}
      </div>
    `;
    el.appendChild(item);
  });
})();

// Tombol kembali
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
