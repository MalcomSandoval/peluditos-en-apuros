const mysql = require('mysql2/promise');

async function create() {
  try {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '' });
    await connection.query('CREATE DATABASE IF NOT EXISTS peluditos;');
    console.log('Database peluditos created or already exists on Laragon MySQL.');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MySQL Laragon. Make sure Laragon MySQL is running:', error);
    process.exit(1);
  }
}
create();
