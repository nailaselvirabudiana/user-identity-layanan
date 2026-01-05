const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

// Fungsi untuk inisialisasi database
async function initDB() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // 1. Buat table jika belum ada
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            role TEXT,
            status TEXT,
            password TEXT
        )
    `);

    // 2. Cek apakah database masih kosong
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');

    if (userCount.count === 0) {
        console.log("Database kosong, menambahkan 35 user awal...");
        
        const stmt = await db.prepare(
            `INSERT INTO users (id, name, email, role, status, password) 
             VALUES (?, ?, ?, ?, ?, ?)`
        );

        for (const user of seedUsers) {
            await stmt.run(user);
        }

        await stmt.finalize();
        console.log("Seeding 35 user.");
    }
}

// Jalankan inisialisasi
initDB().catch(err => {
    console.error("Gagal inisialisasi database:", err);
});

const listUsers = async () => {
    return await db.all('SELECT id, name, email, role, status FROM users');
};

const createUser = async (userData) => {
    const { id, name, email, role, status, password } = userData;
    await db.run(
        'INSERT INTO users (id, name, email, role, status, password) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, email, role, status, password]
    );
    return userData;
};

const getUserById = async (id) => {
    return await db.get('SELECT id, name, email, role, status FROM users WHERE id = ?', [id]);
};

const getUserByEmail = async (email) => {
    return await db.get('SELECT id, name, email, role, status FROM users WHERE email = ?', [email]);
};

const getUserRawByEmail = async (email) => {
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
};

const updateUser = async (id, updateData) => {
    const { name, email } = updateData;
    
    console.log('updateUser called:', { id, updateData, name, email });
    
    // Build dynamic UPDATE query only for fields that are provided
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
    }
    if (email !== undefined) {
        updates.push('email = ?');
        values.push(email);
    }
    
    if (updates.length === 0) {
        console.log('No fields to update');
        return getUserById(id); // No fields to update
    }
    
    values.push(id); // Add id for WHERE clause
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    console.log('SQL Query:', query);
    console.log('SQL Values:', values);
    
    await db.run(query, values);
    
    const result = await getUserById(id);
    console.log('Updated user:', result);
    
    return result;
};

const updateUserStatus = async (id, status) => {
    await db.run('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return getUserById(id);
};

module.exports = {
    listUsers,
    createUser,
    getUserById,
    getUserByEmail,
    getUserRawByEmail,
    updateUser,
    updateUserStatus
};

const seedUsers = [
    ['1', 'Super Admin', 'admin@mail.com', 'admin', 'active', 'admin123'],
    ['2', 'Naila Selvira', 'naila@mail.com', 'employee', 'active', 'user123'],
    ['3', 'Budi Santoso', 'budi@mail.com', 'employee', 'active', 'user123'],
    ['4', 'Siti Aminah', 'siti@mail.com', 'employee', 'inactive', 'user123'],
    ['5', 'Andi Wijaya', 'andi@mail.com', 'employee', 'active', 'user123'],
    ['6', 'Rina Permata', 'rina@mail.com', 'employee', 'resigned', 'user123'],
    ['7', 'Dedi Kurniawan', 'dedi@mail.com', 'employee', 'active', 'user123'],
    ['8', 'Eka Saputra', 'eka@mail.com', 'employee', 'active', 'user123'],
    ['9', 'Maya Sari', 'maya@mail.com', 'employee', 'inactive', 'user123'],
    ['10', 'Rizky Pratama', 'rizky@mail.com', 'employee', 'active', 'user123'],
    ['11', 'Lestari Putri', 'lestari@mail.com', 'employee', 'active', 'user123'],
    ['12', 'Fajar Ramadhan', 'fajar@mail.com', 'employee', 'resigned', 'user123'],
    ['13', 'Hendra Kusuma', 'hendra@mail.com', 'employee', 'active', 'user123'],
    ['14', 'Dewi Lestari', 'dewi@mail.com', 'employee', 'active', 'user123'],
    ['15', 'Agus Setiawan', 'agus@mail.com', 'employee', 'inactive', 'user123'],
    ['16', 'Fitri Handayani', 'fitri@mail.com', 'employee', 'active', 'user123'],
    ['17', 'Bambang Utomo', 'bambang@mail.com', 'employee', 'active', 'user123'],
    ['18', 'Indah Permatasari', 'indah@mail.com', 'employee', 'active', 'user123'],
    ['19', 'Rahmat Hidayat', 'rahmat@mail.com', 'employee', 'resigned', 'user123'],
    ['20', 'Siska Amelia', 'siska@mail.com', 'employee', 'active', 'user123'],
    ['21', 'Adi Nugroho', 'adi@mail.com', 'employee', 'active', 'user123'],
    ['22', 'Yuli Anti', 'yuli@mail.com', 'employee', 'inactive', 'user123'],
    ['23', 'Taufik Hidayat', 'taufik@mail.com', 'employee', 'active', 'user123'],
    ['24', 'Ratna Sari', 'ratna@mail.com', 'employee', 'active', 'user123'],
    ['25', 'Doni Damara', 'doni@mail.com', 'employee', 'active', 'user123'],
    ['26', 'Linda Wahyuni', 'linda@mail.com', 'employee', 'active', 'user123'],
    ['27', 'Gunawan Susanto', 'gunawan@mail.com', 'employee', 'resigned', 'user123'],
    ['28', 'Hani Fatimah', 'hani@mail.com', 'employee', 'active', 'user123'],
    ['29', 'Irfan Bachdim', 'irfan@mail.com', 'employee', 'active', 'user123'],
    ['30', 'Joko Widodo', 'joko@mail.com', 'employee', 'active', 'user123'],
    ['31', 'Kartika Putri', 'kartika@mail.com', 'employee', 'active', 'user123'],
    ['32', 'Lukman Hakim', 'lukman@mail.com', 'employee', 'inactive', 'user123'],
    ['33', 'Nina Zatulini', 'nina@mail.com', 'employee', 'active', 'user123'],
    ['34', 'Oki Setiana', 'oki@mail.com', 'employee', 'active', 'user123'],
    ['35', 'Panji Petualang', 'panji@mail.com', 'employee', 'active', 'user123']
];