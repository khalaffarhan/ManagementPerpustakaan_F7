const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Home Page - Menampilkan Dashboard
router.get('/', (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM buku) as total_buku,
            (SELECT COUNT(*) FROM mahasiswa) as total_mahasiswa,
            (SELECT COUNT(*) FROM transaksi_peminjaman WHERE status = 'dipinjam') as sedang_dipinjam,
            (SELECT COUNT(*) FROM transaksi_peminjaman WHERE status = 'dikembalikan') as sudah_kembali
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        
        const stats = results[0];
        res.render('index', { 
            title: 'Dashboard Perpustakaan',
            stats: stats 
        });
    });
});

// Halaman Daftar Buku
router.get('/buku', (req, res) => {
    db.query('SELECT * FROM buku ORDER BY judul', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('index', { 
            title: 'Daftar Buku',
            stats: null,
            buku: results 
        });
    });
});

// Halaman Daftar Mahasiswa
router.get('/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa ORDER BY nama_mahasiswa', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('index', { 
            title: 'Daftar Mahasiswa',
            stats: null,
            mahasiswa: results 
        });
    });
});

// Halaman Daftar Transaksi
router.get('/transaksi', (req, res) => {
    const query = `
        SELECT 
            t.id_transaksi,
            t.tanggal_pinjam,
            t.tanggal_jatuh_tempo,
            t.tanggal_kembali,
            t.status,
            m.nim,
            m.nama_mahasiswa,
            b.judul AS judul_buku,
            b.pengarang
        FROM transaksi_peminjaman t
        JOIN mahasiswa m ON t.id_mahasiswa = m.id_mahasiswa
        JOIN buku b ON t.id_buku = b.id_buku
        ORDER BY t.tanggal_pinjam DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('index', { 
            title: 'Daftar Transaksi',
            stats: null,
            transaksi: results 
        });
    });
});

module.exports = router;
