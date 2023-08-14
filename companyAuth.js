const pool = require('./db');
const bcrypt = require('bcrypt');

async function companyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).send('No autorizado');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  try {
    const query = 'SELECT * FROM public."Companies" WHERE "Email" = $1;';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).send('No autorizado');
    }

    const storedPassword = result.rows[0].Password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).send('No autorizado');
    }

    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(500).send('Error de autenticación');
  }
}

module.exports = companyAuth;
