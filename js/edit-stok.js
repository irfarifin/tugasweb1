(function () {
  const userRaw = sessionStorage.getItem("sitta_user");
  if (!userRaw) {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(userRaw);
  if (user.role.toLowerCase() !== "administrator") {
    alert("Akses ditolak. Hanya admin yang dapat mengedit stok.");
    window.location.href = "dashboard.html";
    return;
  }

  const container = document.getElementById("stockContainer");
  const storedData = JSON.parse(localStorage.getItem("sitta_stok"));
  const books = (storedData || dataBahanAjar || []).map((item) => ({
    namaBarang: item.namaBarang || item.judul,
    kodeBarang: item.kodeBarang || item.kode,
    kodeLokasi: item.kodeLokasi || "-",
    jenisBarang: item.jenisBarang || "Buku",
    edisi: item.edisi || "1",
    stok: item.stok || 0,
    cover: item.cover || item.gambar || "https://via.placeholder.com/150",
  }));

  // === Render stok ===
  function renderBooks() {
    container.innerHTML = "";
    books.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "stock-card";
      card.innerHTML = `
        <img src="${item.cover}" alt="${item.namaBarang}">
        <div class="stock-card-content">
          <h3>${item.namaBarang}</h3>
          <p>Kode Barang: ${item.kodeBarang}</p>
          <p>Lokasi: ${item.kodeLokasi}</p>
          <p>Edisi: ${item.edisi}</p>
          <p>Jenis: ${item.jenisBarang}</p>
          <p>Stok Saat Ini: <strong>${item.stok}</strong></p>
          <input type="number" min="0" value="${item.stok}" data-index="${index}" class="stok-input">
          <button class="update-btn" data-index="${index}">💾 Simpan</button>
        </div>
      `;
      container.appendChild(card);
    });

    document.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        const newVal = document.querySelector(`.stok-input[data-index="${idx}"]`).value;
        books[idx].stok = Number(newVal);
        localStorage.setItem("sitta_stok", JSON.stringify(books));
        showModal("✅ Stok Berhasil Diperbarui", "Perubahan telah disimpan ke sistem.");
      });
    });
  }

  renderBooks();

  // === Tombol kembali ===
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  // === Modal umum ===
  function showModal(title, message) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="modal-actions">
          <button id="okBtn" class="btn-confirm">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#okBtn").addEventListener("click", () => modal.remove());
  }

  // === FAB Tambah Buku ===
  const fabButton = document.getElementById("fabButton");
  const addBookModal = document.getElementById("addBookModal");
  const cancelAdd = document.getElementById("cancelAdd");
  const addBookForm = document.getElementById("addBookForm");

  fabButton.addEventListener("click", () => {
    addBookModal.classList.add("active");
  });

  cancelAdd.addEventListener("click", () => {
    addBookModal.classList.remove("active");
  });

  addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newBook = {
      namaBarang: document.getElementById("judulBuku").value,
      kodeBarang: document.getElementById("kodeBarang").value,
      kodeLokasi: document.getElementById("kodeLokasi").value,
      jenisBarang: document.getElementById("jenisBarang").value,
      edisi: document.getElementById("edisi").value,
      stok: Number(document.getElementById("stok").value),
      cover:
        document.getElementById("cover").value ||
        "https://via.placeholder.com/300x400?text=Cover+Buku",
    };

    const stored = JSON.parse(localStorage.getItem("sitta_stok")) || [];
    stored.push(newBook);
    localStorage.setItem("sitta_stok", JSON.stringify(stored));

    addBookModal.classList.remove("active");
    addBookForm.reset();
    renderBooks();
    showModal("✅ Buku Berhasil Ditambahkan", "Data buku baru telah tersimpan.");
  });
  
})();
