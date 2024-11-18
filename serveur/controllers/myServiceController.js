const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fetchAllServices = async (req, res) => {
  try {
    const { categoryId, city, providerId } = req.query;

    const whereClause = {
      provider: {
        isActive: true,
      },
    };

    if (categoryId) whereClause.categoryId = parseInt(categoryId);
    if (city) whereClause.provider.city = city;
    if (providerId) whereClause.providerId = parseInt(providerId);

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            username: true,
            email: true,
            photoUrl: true,
            rating: true,
            isAvailable: true,
            city: true,
          },
        },
      },
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch services", details: error.message });
  }
};

const fetchServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            username: true,
            email: true,
            photoUrl: true,
            rating: true,
            isAvailable: true,
            city: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                photoUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        bookings: {
          where: { status: "CONFIRMED" },
          select: {
            id: true,
            bookingDate: true,
            status: true,
          },
          orderBy: { bookingDate: "asc" },
          take: 5,
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const averageRating = service.reviews.length
      ? service.reviews.reduce((acc, review) => acc + review.rating, 0) /
        service.reviews.length
      : 0;

    res.json({
      ...service,
      averageRating: parseFloat(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Error fetching service details:", error);
    res.status(500).json({
      error: "Failed to fetch service details",
      details: error.message,
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { serviceId, providerId, bookingDate, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!serviceId || !providerId || !bookingDate) {
      return res.status(400).json({
        error:
          "Missing required fields: serviceId, providerId, and bookingDate",
      });
    }

    const [parsedServiceId, parsedProviderId, parsedUserId] = [
      parseInt(serviceId),
      parseInt(providerId),
      parseInt(userId),
    ];

    if ([parsedServiceId, parsedProviderId, parsedUserId].some(isNaN)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const bookingDateTime = new Date(bookingDate);
    if (isNaN(bookingDateTime) || bookingDateTime < new Date()) {
      return res.status(400).json({ error: "Invalid or past booking date" });
    }

    const service = await prisma.service.findUnique({
      where: { id: parsedServiceId },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: parsedUserId,
        serviceId: parsedServiceId,
        providerId: parsedProviderId,
        bookingDate: bookingDateTime,
        notes: notes || null,
        status: "PENDING",
        totalPrice: service.price || 0,
      },
      include: {
        service: true,
        provider: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res
      .status(201)
      .json({ message: "Booking request sent successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ error: "Failed to create booking", details: error.message });
  }
};

module.exports = {
  fetchAllServices,
  fetchServiceDetails,
  createBooking,
};
