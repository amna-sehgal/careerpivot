const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' })
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'dev_secret')
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { verifyToken }
