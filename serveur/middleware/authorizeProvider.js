// middleware/authorizeProvider.js

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authorizeProvider = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
       

    // Check if provider exists
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: decoded.id },
    });

    if (!provider) {
      return res.status(401).json({
        success: false,
        message: "Provider not found",
      });
    }

        // Add provider to request
        req.provider = provider;
        req.providerId = provider.id;
       

        next();

    } catch (error) {
       
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = authorizeProvider;
