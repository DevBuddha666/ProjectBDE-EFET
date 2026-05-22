const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { class: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(401).json({ message: 'Invalid access token' });
  }
};

module.exports = authMiddleware;
