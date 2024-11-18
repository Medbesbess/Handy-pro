const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            description: true,
            image: true,
            duration: true,
          },
        },
        provider: {
          select: {
            username: true,
            photoUrl: true,
            phoneNumber: true,
            rating: true,
          },
        },
        payments: {
          select: {
            amount: true,
            status: true,
            paymentMethod: true,
          },
        },
      },
      orderBy: {
        bookingDate: "desc",
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        provider: {
          select: {
            username: true,
            email: true,
            phoneNumber: true,
            photoUrl: true,
            rating: true,
            city: true,
          },
        },
        payments: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts for different booking statuses
    const bookingStats = await prisma.booking.groupBy({
      by: ["status"],
      where: {
        userId: userId,
      },
      _count: true,
    });

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
          },
        },
        provider: {
          select: {
            username: true,
          },
        },
      },
    });

    res.json({
      bookingStats,
      recentBookings,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};

module.exports = {
  getUserBookings,
  getBookingDetails,
  getDashboardSummary,
};
