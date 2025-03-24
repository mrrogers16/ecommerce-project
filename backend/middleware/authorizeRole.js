function authorizeRole(requiredRole) {
    // We return a middleware function here
    return (req, res, next) => {
        // The `req.user` object is populated by the authenticateToken middleware
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized. No user found.' });
        }

        // If the user’s role does not match the required role, block them
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        // Role matches? Move on to the next middleware or route handler
        next();
    };
}

module.exports = authorizeRole;

