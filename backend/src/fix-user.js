const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function fixUser() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    console.log('Fixing user ID 2...');
    await db.run(
        "UPDATE users SET name = 'Naila Selvira', email = 'naila@mail.com' WHERE id = '2'"
    );
    
    const user = await db.get("SELECT * FROM users WHERE id = '2'");
    console.log('\nUser ID 2 after fix:');
    console.log(user);
    
    await db.close();
    console.log('\nDone!');
}

fixUser().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
