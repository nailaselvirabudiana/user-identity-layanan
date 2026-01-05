const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function checkDB() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('\n=== ALL USERS IN DATABASE ===\n');
    const users = await db.all('SELECT * FROM users');
    
    users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Status: ${user.status}`);
        console.log(`Password: ${user.password}`);
        console.log('---');
    });
    
    console.log(`\nTotal users: ${users.length}\n`);
    
    await db.close();
}

checkDB().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
