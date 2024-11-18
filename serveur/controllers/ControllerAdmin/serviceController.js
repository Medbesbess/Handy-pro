const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllServices = async (req, res) => {
  // fetch all service and include the name of the category of each service and the provider email of that service

  try {
    const services = await prisma.service.findMany({
      include : {
        category : true,
        provider : true,
      }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' });
  }
};

// Add other service-related controller functions here