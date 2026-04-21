const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'demo123',
    database: process.env.DB_NAME || 'controlcity',
});

function buildLoginResponse(rows, email) {
    if (rows.length === 0) return { sucesso: false };
    return {
        sucesso: true,
        user: {
            email,
            userType: rows[0].role,
            loginTime: new Date().toISOString(),
        },
    };
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT email, role FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        res.json(buildLoginResponse(result.rows, email));
    } catch (err) {
        res.status(500).json({ sucesso: false, error: 'Database error' });
    }
});

if (require.main === module) {
    app.listen(3000, () => console.log('Server running on port 3000'));
}

module.exports = { buildLoginResponse };
