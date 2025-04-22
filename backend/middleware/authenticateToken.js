const jwt = require('jsonwebtoken');

// Pull in the same fallback you use in your login route
const JWT_SECRET = process.env.JWT_SECRET || 'default‑fallback‑secret';

function authenticateToken(req, res, next)
{
    const authHeader = req.headers['authorization'];
    const token      = authHeader && authHeader.split(' ')[1];

    if (!token)
    {
        return res
            .status(401)
            .json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) =>
    {
        if (err)
        {
            console.error('JWT verification failed:', err);
            return res
                .status(403)
                .json({ error: 'Invalid token.' });
        }

        // user payload now contains id, email, role
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
