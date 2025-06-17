require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrations() {
  try {
    // Baca file SQL
    const sqlFile = path.join(__dirname, 'migration.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Buat koneksi ke database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true // Penting untuk menjalankan multiple SQL statements
    });

    console.log('Connected to database. Running migrations...');
    
    // Jalankan SQL
    await connection.query(sql);
    
    console.log('Migrations completed successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();