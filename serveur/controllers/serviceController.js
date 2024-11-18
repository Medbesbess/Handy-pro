const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const createService = async (req, res) => {
  try {
    const providerId = req.provider.id; 
    
    const {
      name,
      description,
      price,
      duration,
      categoryId,
      image,
    } = req.body;


    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ error: "All fields are required" });
    }

   
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categoryId: parseInt(categoryId),
        providerId: providerId, 
        image: image || "",
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Failed to create service" });
  }
};

const getServicesByProvider = async (req, res) => {
  try {
    const providerId = req.provider.id; 
    
    const services = await prisma.service.findMany({
      where: {
        providerId: providerId,
      },
      include: {
        category: true,
      },
    });
    
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

module.exports = {
  createService,
  getServicesByProvider,
  getCategories,
};
