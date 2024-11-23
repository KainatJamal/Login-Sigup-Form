const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',
  database: 'user_authentication',
  password: 'kainat123', 
  port: 5432,
});
module.exports = pool;
