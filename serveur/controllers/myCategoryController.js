const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fetch all categories with their services
const fetchCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        services: {
          include: {
            provider: {
              select: {
                id: true,
                username: true,
                email: true,
                photoUrl: true,
                rating: true,
                city: true,
              },
            },
          },
        },
      },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Fetch all providers with pagination
const fetchProvidersByFilters = async (req, res) => {
  try {
    const { categoryId, city, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construct the where clause for filtering
    const where = {
      provider: {
        isActive: true,
      },
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    if (city) {
      where.provider.city = city;
    }

    // Get total count for pagination
    const totalCount = await prisma.service.count({ where });

    // Fetch services with pagination
    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            username: true,
            email: true,
            photoUrl: true,
            rating: true,
            city: true,
          },
        },
        category: true,
      },
      skip,
      take: parseInt(limit),
    });

    res.json({
      services,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};

const fetchAvailableCities = async (req, res) => {
  try {
    const providers = await prisma.serviceProvider.findMany({
      select: {
        city: true,
      },
      distinct: ["city"],
      where: {
        isActive: true,
      },
    });

    const cities = providers.map((provider) => provider.city);
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

module.exports = {
  fetchCategories,
  fetchAvailableCities,
  fetchProvidersByFilters,
};
