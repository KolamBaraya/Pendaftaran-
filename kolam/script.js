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
        
        // Tampilkan data yang sudah terdaftar
        displayData();
        
        // Logout
        logoutBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        
        // Fungsi untuk menampilkan data di tabel dengan tombol hapus
        function displayData() {
            const data = getData();
            tabelBody.innerHTML = '';
            
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.nama}</td>
                    <td><button class="btn-delete" data-index="${index}">Hapus</button></td>
                `;
                tabelBody.appendChild(row);
            });
            
            // Tambahkan event listener untuk tombol hapus
            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                        deleteData(index);
                        displayData();
                    }
                });
            });
        }
        
        // Fungsi untuk menghapus data
        function deleteData(index) {
            const data = getData();
            data.splice(index, 1);
            saveData(data);
        }
    });
}