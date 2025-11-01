// === AUTO LOAD DO ===
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const doParam = urlParams.get("do");

  if (doParam) {
    const input = document.getElementById("doInput");
    input.value = doParam;
    document.getElementById("doSearch").click();
  }
});
document.getElementById("doSearch").addEventListener("click", () => {
  const input = document.getElementById("doInput").value.trim();
  const resultBox = document.getElementById("trackingResult");
  resultBox.innerHTML = "";

  if (!input) {
    resultBox.innerHTML = "<p>⚠️ Masukkan nomor DO terlebih dahulu.</p>";
    return;
  }

  // --- Ambil data dari dua sumber ---
  const localOrders = JSON.parse(localStorage.getItem("sitta_orders") || "[]");
  const localOrder = localOrders.find(o => o.nomorDO === input);
  const data = dataDO[input] || localOrder;

  if (!data) {
    resultBox.innerHTML = `<p>❌ Nomor DO <strong>${input}</strong> tidak ditemukan.</p>`;
    return;
  }

  // --- Format total jika perlu ---
  const numberWithCommas = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // --- Tampilkan data ---
  let html = `
    <h4>📦 Nomor DO: ${data.nomorDO}</h4>
    <p><strong>Nama:</strong> ${data.nama || "Pengguna"}</p>
    <p><strong>Bahan Ajar:</strong> ${data.bahan || "-"}</p>
    <p><strong>Jumlah:</strong> ${data.jumlah || "-"}</p>
    <p><strong>Status:</strong> ${data.status || "Menunggu Verifikasi"}</p>
    <p><strong>Tanggal Pemesanan:</strong> ${data.tanggal || "-"}</p>
    <p><strong>Ekspedisi:</strong> ${data.ekspedisi || "-"}</p>
    <p><strong>Paket:</strong> ${data.paket || "-"}</p>
    <p><strong>Total:</strong> Rp ${numberWithCommas(data.total || 0)}</p>
  `;

  // --- Tampilkan riwayat perjalanan jika ada ---
  if (data.perjalanan && data.perjalanan.length > 0) {
    html += `<h4>🧭 Riwayat Perjalanan:</h4><div class="perjalanan">`;
    data.perjalanan.forEach(step => {
      html += `
        <div class="perjalanan-item">
          <strong>${step.waktu}</strong>
          <p>${step.keterangan}</p>
        </div>
      `;
    });
    html += `</div>`;
  } else {
    html += `<p><em>Belum ada riwayat pengiriman.</em></p>`;
  }

  resultBox.innerHTML = html;
});

// Tombol kembali
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});
