-- Database: library_db
-- Sistem Manajemen Buku Perpustakaan Kelompok F7

-- Tabel Buku
CREATE TABLE IF NOT EXISTS buku (
    id_buku INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) UNIQUE,
    stok INT DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
    id_mahasiswa INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama_mahasiswa VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    no_telepon VARCHAR(20),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel Transaksi Peminjaman
CREATE TABLE IF NOT EXISTS transaksi_peminjaman (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    id_mahasiswa INT NOT NULL,
    id_buku INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_jatuh_tempo DATE NOT NULL,
    tanggal_kembali DATE NULL,
    status ENUM('dipinjam', 'dikembalikan', 'terlambat') DEFAULT 'dipinjam',
    denda DECIMAL(10,2) DEFAULT 0.00,
    catatan TEXT,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mahasiswa) REFERENCES mahasiswa(id_mahasiswa) ON DELETE CASCADE,
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Data Dummy Buku
INSERT INTO buku (judul, pengarang, isbn, stok) VALUES
('Pemrograman Web dengan Node.js', 'Budi Santoso', '978-1234567890', 5),
('Database Management System', 'Ani Wijaya', '978-2345678901', 3),
('Teknologi Server dan Cloud Computing', 'Citra Dewi', '978-3456789012', 4),
('Algoritma dan Struktur Data', 'Dedi Kurniawan', '978-4567890123', 6),
('Jaringan Komputer', 'Eka Pratama', '978-5678901234', 2),
('Keamanan Sistem Informasi', 'Fajar Ramadhan', '978-6789012345', 5),
('Machine Learning untuk Pemula', 'Gina Sari', '978-7890123456', 3),
('Desain UI/UX Modern', 'Hadi Prasetyo', '978-8901234567', 4);

-- Insert Data Dummy Mahasiswa
INSERT INTO mahasiswa (nim, nama_mahasiswa, email, no_telepon) VALUES
('20240140276', 'M. Irgie Falssandi', 'irgie@student.ac.id', '081234567890'),
('20240140268', 'M. Mudhaffar Khalaf Farhan', 'mudhaffar@student.ac.id', '081234567891'),
('2024001', 'Ahmad Rizki', 'ahmad.rizki@student.ac.id', '081234567892'),
('2024002', 'Siti Nurhaliza', 'siti.nur@student.ac.id', '081234567893'),
('2024003', 'Budi Santoso', 'budi.santoso@student.ac.id', '081234567894'),
('2024004', 'Dewi Lestari', 'dewi.lestari@student.ac.id', '081234567895');

-- Insert Data Dummy Transaksi Peminjaman
INSERT INTO transaksi_peminjaman (id_mahasiswa, id_buku, tanggal_pinjam, tanggal_jatuh_tempo, status) VALUES
(1, 1, '2026-01-05', '2026-01-12', 'dipinjam'),
(2, 2, '2026-01-06', '2026-01-13', 'dipinjam'),
(3, 3, '2026-01-03', '2026-01-10', 'dipinjam'),
(4, 4, '2025-12-20', '2025-12-27', 'dikembalikan'),
(5, 5, '2025-12-25', '2026-01-01', 'dikembalikan');

-- Update transaksi yang sudah dikembalikan
UPDATE transaksi_peminjaman 
SET tanggal_kembali = '2025-12-26', status = 'dikembalikan' 
WHERE id_transaksi = 4;

UPDATE transaksi_peminjaman 
SET tanggal_kembali = '2026-01-02', status = 'dikembalikan', denda = 5000.00 
WHERE id_transaksi = 5;
