// Data pendaftaran disimpan di localStorage
const STORAGE_KEY = 'dataPendaftaranKolam';

// Fungsi untuk mendapatkan data dari localStorage
function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan data ke localStorage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Halaman Login
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        const btnTamu = document.getElementById('btn-tamu');
        const btnAdmin = document.getElementById('btn-admin');
        const adminLogin = document.getElementById('admin-login');
        const adminForm = document.getElementById('admin-form');
        const errorMsg = document.getElementById('error-msg');
        
        // Redirect ke halaman tamu
        btnTamu.addEventListener('click', function() {
            window.location.href = 'pendaftaran.html';
        });
        
        // Tampilkan form login admin
        btnAdmin.addEventListener('click', function() {
            adminLogin.classList.remove('hidden');
        });
        
        // Validasi login admin
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            
            if (password === 'kolamBaraya') {
                window.location.href = 'admin.html';
            } else {
                errorMsg.classList.remove('hidden');
            }
        });
    });
}

// Halaman Pendaftaran Tamu
if (window.location.pathname.endsWith('pendaftaran.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('form-pendaftaran');
        const tabelBody = document.getElementById('tabel-body');
        const logoutBtn = document.getElementById('logout');
        
        // Tampilkan data yang sudah terdaftar
        displayData();
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil nilai dari form
            const data = {
                nama: document.getElementById('nama').value,
            };
            
            // Simpan data
            const existingData = getData();
            existingData.push(data);
            saveData(existingData);
            
            // Reset form
            form.reset();
            
            // Tampilkan data terbaru
            displayData();
            
            // Tampilkan pesan sukses
            alert('Pendaftaran berhasil!');
        });
        
        // Logout
        logoutBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        
        // Fungsi untuk menampilkan data di tabel
        function displayData() {
            const data = getData();
            tabelBody.innerHTML = '';
            
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.nama}</td>
                `;
                tabelBody.appendChild(row);
            });
        }
    });
}

// Halaman Admin
if (window.location.pathname.endsWith('admin.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const tabelBody = document.getElementById('tabel-body');
        const logoutBtn = document.getElementById('logout');
        const hapusSemuaBtn = document.getElementById('hapus-semua');
        const modalHapusSemua = document.getElementById('modal-hapus-semua');
        const confirmHapusSemua = document.getElementById('confirm-hapus-semua');
        const cancelHapusSemua = document.getElementById('cancel-hapus-semua');
        const confirmDeleteCheckbox = document.getElementById('confirm-delete');
        const totalDataElement = document.getElementById('total-data');
        const jumlahDataHapusElement = document.getElementById('jumlah-data-hapus');

        // Tampilkan data yang sudah terdaftar
        displayData();

        // Logout
        logoutBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                window.location.href = 'index.html';
            }
        });

        // Tombol Hapus Semua
        hapusSemuaBtn.addEventListener('click', function() {
            const data = getData();
            if (data.length === 0) {
                showNotification('Tidak ada data untuk dihapus!', 'warning');
                return;
            }
            showDeleteConfirmationModal(data.length);
        });

        // Konfirmasi Hapus Semua
        confirmHapusSemua.addEventListener('click', function() {
            hapusSemuaData();
            modalHapusSemua.classList.add('hidden');
            showNotification('Semua data berhasil dihapus!', 'success');
        });

        // Batal Hapus Semua
        cancelHapusSemua.addEventListener('click', function() {
            closeModal();
        });

        // Checkbox konfirmasi
        confirmDeleteCheckbox.addEventListener('change', function() {
            confirmHapusSemua.disabled = !this.checked;
        });

        // Tutup modal ketika klik di luar
        modalHapusSemua.addEventListener('click', function(e) {
            if (e.target === modalHapusSemua) {
                closeModal();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modalHapusSemua.classList.contains('hidden')) {
                closeModal();
            }
        });

        // Fungsi untuk menampilkan modal konfirmasi hapus
        function showDeleteConfirmationModal(dataCount) {
            jumlahDataHapusElement.textContent = dataCount;
            confirmDeleteCheckbox.checked = false;
            confirmHapusSemua.disabled = true;
            modalHapusSemua.classList.remove('hidden');
        }

        // Fungsi untuk menutup modal
        function closeModal() {
            modalHapusSemua.classList.add('hidden');
            confirmDeleteCheckbox.checked = false;
            confirmHapusSemua.disabled = true;
        }

        // Fungsi untuk menampilkan data di tabel dengan tombol hapus
        function displayData() {
            const data = getData();
            tabelBody.innerHTML = '';
            totalDataElement.textContent = data.length;

            if (data.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `
                    <td colspan="16" class="empty-state">
                        <p>📝 Belum ada data pendaftaran</p>
                        <small>Data akan muncul di sini setelah tamu melakukan pendaftaran</small>
                    </td>
                `;
                tabelBody.appendChild(emptyRow);
                
                // Nonaktifkan tombol hapus semua
                hapusSemuaBtn.disabled = true;
                hapusSemuaBtn.innerHTML = '🗑️ Hapus Semua Data';
                return;
            }

            // Aktifkan tombol hapus semua
            hapusSemuaBtn.disabled = false;
            hapusSemuaBtn.innerHTML = `🗑️ Hapus Semua Data (${data.length})`;

            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><strong>${escapeHtml(item.nama)}</strong></td>
                    <td>
                        <button class="btn-delete" data-index="${index}" title="Hapus data ini">
                            ❌ Hapus
                        </button>
                    </td>
                `;
                tabelBody.appendChild(row);
            });

            // Tambahkan event listener untuk tombol hapus individual
            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    const data = getData();
                    const item = data[index];
                    
                    if (confirm(`Apakah Anda yakin ingin menghapus data ${item.nama}?`)) {
                        deleteData(index);
                        displayData();
                        showNotification(`Data ${item.nama} berhasil dihapus!`, 'success');
                    }
                });
            });
        }

        // Fungsi untuk menghapus data individual
        function deleteData(index) {
            const data = getData();
            data.splice(index, 1);
            saveData(data);
        }

        // Fungsi untuk menghapus semua data
        function hapusSemuaData() {
            saveData([]); // Simpan array kosong
            displayData(); // Refresh tampilan
        }

        // Fungsi untuk format tanggal
        function formatTanggal(tanggalString) {
            if (!tanggalString) return '-';
            try {
                const tanggal = new Date(tanggalString);
                return tanggal.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } catch (e) {
                return tanggalString;
            }
        }

        // Fungsi untuk escape HTML (keamanan)
        function escapeHtml(unsafe) {
            if (unsafe === null || unsafe === undefined) return '';
            return unsafe
                .toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // Fungsi untuk menampilkan notifikasi
        function showNotification(message, type = 'info') {
            // Hapus notifikasi sebelumnya
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">×</button>
            `;

            // Tambahkan styles untuk notifikasi
            const style = document.createElement('style');
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 1001;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { background: linear-gradient(135deg, #27ae60, #229954); }
                .notification-warning { background: linear-gradient(135deg, #f39c12, #e67e22); }
                .notification-error { background: linear-gradient(135deg, #e74c3c, #c0392b); }
                .notification-info { background: linear-gradient(135deg, #3498db, #2980b9); }
                .notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            if (!document.querySelector('#notification-styles')) {
                style.id = 'notification-styles';
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto remove setelah 5 detik
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
    });
}
