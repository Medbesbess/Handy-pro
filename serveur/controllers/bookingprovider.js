// bookingprovider controller
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getrequests = async (req, res) => {
  try {
    
    const providerId = req.provider.id;

    const bookingspending = await prisma.booking.findMany({
      where: {
        status: "PENDING",
        providerId: providerId,
      },
      include: {
        user: true,
        service: true,
      },
    });

    const bookingsaccepted = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        providerId: providerId,
      },
      include: {
        user: true,
        service: true,
      },
    });

    res.status(200).send({ bookingspending, bookingsaccepted });
  } catch (err) {
    console.error("Error getting requests:", err);
    res.status(500).send({ error: "Failed to get requests" });
  }
};

const getHistory = async (req, res) => {
  try {
    const providerId = req.provider.id;

    const bookings = await prisma.booking.findMany({
      where: {
        providerId: providerId,
        status: {
          in: ["CONFIRMED", "CANCELLED", "REJECTED", "COMPLETED"],
        },
      },
      include: {
        user: true,
        service: true,
      },
    });

    res.status(200).send(bookings);
  } catch (err) {
    console.error("Error getting history:", err);
    res.status(500).send({ error: "Failed to get booking history" });
  }
};

const accept = async (req, res) => {
  try {
    const { requestId } = req.body;
    const providerId = req.provider.id;

    const updatedBooking = await prisma.booking.update({
      where: {
        id: requestId,
        providerId: providerId,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    if (!updatedBooking) {
      return res.status(404).send({ error: "Booking not found" });
    }

    res.status(200).send({
      success: true,
      message: "Booking accepted successfully",
      booking: updatedBooking
    });
  } catch (err) {
    console.error("Error accepting booking:", err);
    res.status(500).send({ error: "Failed to accept booking" });
  }
};

const reject = async (req, res) => {
  try {
    const { requestId } = req.body;
    const providerId = req.provider.id;

    const updatedBooking = await prisma.booking.update({
      where: {
        id: requestId,
        providerId: providerId,
      },
      data: {
        status: "REJECTED",
      },
    });

    if (!updatedBooking) {
      return res.status(404).send({ error: "Booking not found" });
    }

    res.status(200).send({
      success: true,
      message: "Booking rejected successfully",
      booking: updatedBooking
    });
  } catch (err) {
    console.error("Error rejecting booking:", err);
    res.status(500).send({ error: "Failed to reject booking" });
  }
};

module.exports = {
  getrequests,
  getHistory,
  accept,
  reject,
};