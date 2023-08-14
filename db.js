const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SkillTinder',
  password: 'Palma3178299771',
  port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;
