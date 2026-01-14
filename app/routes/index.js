const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ==================== DASHBOARD ====================
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
        res.render('index', { 
            title: 'Dashboard Perpustakaan',
            stats: results[0],
            page: 'dashboard'
        });
    });
});

// ==================== BUKU CRUD ====================

// READ - Daftar Buku
router.get('/buku', (req, res) => {
    db.query('SELECT * FROM buku ORDER BY judul', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('index', { 
            title: 'Daftar Buku',
            page: 'buku',
            buku: results 
        });
    });
});

// CREATE - Tambah Buku
router.post('/buku/add', (req, res) => {
    const { judul, pengarang, isbn, stok } = req.body;
    const query = 'INSERT INTO buku (judul, pengarang, isbn, stok) VALUES (?, ?, ?, ?)';
    
    db.query(query, [judul, pengarang, isbn || null, stok || 0], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/buku');
    });
});

// UPDATE - Edit Buku
router.post('/buku/edit/:id', (req, res) => {
    const { judul, pengarang, isbn, stok } = req.body;
    const query = 'UPDATE buku SET judul = ?, pengarang = ?, isbn = ?, stok = ? WHERE id_buku = ?';
    
    db.query(query, [judul, pengarang, isbn || null, stok, req.params.id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/buku');
    });
});

// DELETE - Hapus Buku
router.get('/buku/delete/:id', (req, res) => {
    db.query('DELETE FROM buku WHERE id_buku = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/buku');
    });
});

// ==================== MAHASISWA CRUD ====================

// READ - Daftar Mahasiswa
router.get('/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa ORDER BY nama_mahasiswa', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('index', { 
            title: 'Daftar Mahasiswa',
            page: 'mahasiswa',
            mahasiswa: results 
        });
    });
});

// CREATE - Tambah Mahasiswa
router.post('/mahasiswa/add', (req, res) => {
    const { nim, nama_mahasiswa, email, no_telepon } = req.body;
    const query = 'INSERT INTO mahasiswa (nim, nama_mahasiswa, email, no_telepon) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nim, nama_mahasiswa, email || null, no_telepon || null], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/mahasiswa');
    });
});

// UPDATE - Edit Mahasiswa
router.post('/mahasiswa/edit/:id', (req, res) => {
    const { nim, nama_mahasiswa, email, no_telepon } = req.body;
    const query = 'UPDATE mahasiswa SET nim = ?, nama_mahasiswa = ?, email = ?, no_telepon = ? WHERE id_mahasiswa = ?';
    
    db.query(query, [nim, nama_mahasiswa, email || null, no_telepon || null, req.params.id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/mahasiswa');
    });
});

// DELETE - Hapus Mahasiswa
router.get('/mahasiswa/delete/:id', (req, res) => {
    db.query('DELETE FROM mahasiswa WHERE id_mahasiswa = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.redirect('/mahasiswa');
    });
});

// ==================== TRANSAKSI CRUD ====================

// READ - Daftar Transaksi
router.get('/transaksi', (req, res) => {
    const query = `
        SELECT 
            t.id_transaksi,
            t.id_mahasiswa,
            t.id_buku,
            t.tanggal_pinjam,
            t.tanggal_jatuh_tempo,
            t.tanggal_kembali,
            t.status,
            t.denda,
            m.nim,
            m.nama_mahasiswa,
            b.judul AS judul_buku,
            b.pengarang
        FROM transaksi_peminjaman t
        JOIN mahasiswa m ON t.id_mahasiswa = m.id_mahasiswa
        JOIN buku b ON t.id_buku = b.id_buku
        ORDER BY t.tanggal_pinjam DESC
    `;
    
    // Get data for form dropdowns
    db.query('SELECT * FROM mahasiswa ORDER BY nama_mahasiswa', (err, mahasiswa) => {
        db.query('SELECT * FROM buku WHERE stok > 0 ORDER BY judul', (err2, buku) => {
            db.query(query, (err3, transaksi) => {
                if (err || err2 || err3) {
                    console.error('Database error:', err || err2 || err3);
                    return res.status(500).send('Database error');
                }
                res.render('index', { 
                    title: 'Daftar Transaksi',
                    page: 'transaksi',
                    transaksi: transaksi,
                    mahasiswa: mahasiswa,
                    buku: buku
                });
            });
        });
    });
});

// CREATE - Tambah Transaksi
router.post('/transaksi/add', (req, res) => {
    const { id_mahasiswa, id_buku, tanggal_pinjam, tanggal_jatuh_tempo } = req.body;
    const query = 'INSERT INTO transaksi_peminjaman (id_mahasiswa, id_buku, tanggal_pinjam, tanggal_jatuh_tempo, status) VALUES (?, ?, ?, ?, "dipinjam")';
    
    db.query(query, [id_mahasiswa, id_buku, tanggal_pinjam, tanggal_jatuh_tempo], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        // Kurangi stok buku
        db.query('UPDATE buku SET stok = stok - 1 WHERE id_buku = ?', [id_buku]);
        res.redirect('/transaksi');
    });
});

// UPDATE - Edit Transaksi
router.post('/transaksi/edit/:id', (req, res) => {
    const { tanggal_pinjam, tanggal_jatuh_tempo, tanggal_kembali, status, denda } = req.body;
    
    // Get old data
    db.query('SELECT id_buku, status as old_status FROM transaksi_peminjaman WHERE id_transaksi = ?', [req.params.id], (err, oldData) => {
        const query = 'UPDATE transaksi_peminjaman SET tanggal_pinjam = ?, tanggal_jatuh_tempo = ?, tanggal_kembali = ?, status = ?, denda = ? WHERE id_transaksi = ?';
        
        db.query(query, [tanggal_pinjam, tanggal_jatuh_tempo, tanggal_kembali || null, status, denda || 0, req.params.id], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }
            
            // Update stok jika status berubah
            if (oldData && oldData[0] && oldData[0].old_status === 'dipinjam' && status === 'dikembalikan') {
                db.query('UPDATE buku SET stok = stok + 1 WHERE id_buku = ?', [oldData[0].id_buku]);
            }
            
            res.redirect('/transaksi');
        });
    });
});

// DELETE - Hapus Transaksi
router.get('/transaksi/delete/:id', (req, res) => {
    // Get data before delete
    db.query('SELECT id_buku, status FROM transaksi_peminjaman WHERE id_transaksi = ?', [req.params.id], (err, data) => {
        db.query('DELETE FROM transaksi_peminjaman WHERE id_transaksi = ?', [req.params.id], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }
            
            // Kembalikan stok jika masih dipinjam
            if (data && data[0] && data[0].status === 'dipinjam') {
                db.query('UPDATE buku SET stok = stok + 1 WHERE id_buku = ?', [data[0].id_buku]);
            }
            
            res.redirect('/transaksi');
        });
    });
});

module.exports = router;
