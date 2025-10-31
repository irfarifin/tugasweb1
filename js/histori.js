/* === HISTORI PAGE SCRIPT (Sinkron dengan data.js) === */
(function () {
  const userRaw = sessionStorage.getItem("sitta_user");
  if (!userRaw) {
    window.location.href = "index.html";
    return;
  }

  const el = document.getElementById("timeline");
  if (!el) return;

  // Ambil data histori dari data.js
  const staticHistori = typeof dataHistori !== "undefined" ? dataHistori : [];
  const dataDOs = typeof dataDO !== "undefined" ? dataDO : {};

  // Ambil juga riwayat lokal (pesanan baru user)
  const localOrders = JSON.parse(localStorage.getItem("sitta_orders") || "[]");

  // Gabungkan semua data
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

    // Cek apakah pesanan ini punya data DO (sinkronisasi)
    const doData =
      trx.nomorDO && dataDOs[trx.nomorDO]
        ? dataDOs[trx.nomorDO]
        : Object.values(dataDOs).find((d) => d.nama === trx.nama) || null;

    // Gunakan status DO jika tersedia, selain itu fallback ke trx.status
    const status = doData?.status || trx.status || "Proses";
    const nomorDO = doData?.nomorDO || trx.nomorDO || "-";
    const ekspedisi = doData?.ekspedisi || "-";
    const tanggalKirim = doData?.tanggalKirim || trx.tanggal || "-";

    const dotClass =
      status.toLowerCase().includes("selesai") ? "selesai" :
      status.toLowerCase().includes("perjalanan") ? "dalam-perjalanan" :
      "proses";

    // Cari lokasi (jika tersedia)
    let lokasi = "-";
    if (typeof dataBahanAjar !== "undefined") {
      const buku = dataBahanAjar.find((b) => b.namaBarang === trx.bahan);
      if (buku) lokasi = buku.kodeLokasi;
    }

    // Template konten timeline
    item.innerHTML = `
      <div class="timeline-dot ${dotClass}"></div>
      <div class="timeline-content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <small class="muted">${tanggalKirim}</small>
          <span class="status ${dotClass}" style="font-weight:700;padding:4px 8px;border-radius:8px">${status}</span>
        </div>
        <h4>${trx.bahan || trx.namaBarang}</h4>
        <p class="muted">${trx.nama || "Pengguna"} • Jumlah: ${trx.jumlah}</p>
        <p style="margin-top:4px;font-size:0.85rem;color:#b0c4ff">Lokasi: ${lokasi}</p>
        <p><small>Ekspedisi: ${ekspedisi}</small></p>
        <p style="margin-top:8px"><strong>Total: Rp ${numberWithCommas(trx.total || 0)}</strong></p>
        ${
          nomorDO !== "-"
            ? `<p style="margin-top:6px;font-size:0.9rem;">
                <strong>Nomor DO:</strong> 
                <a href="tracking.html?do=${nomorDO}" style="color:#007bff;text-decoration:none;">
                  ${nomorDO}
                </a>
              </p>`
            : ""
        }
      </div>
    `;
    el.appendChild(item);
  });
})();

// Tombol kembali
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
