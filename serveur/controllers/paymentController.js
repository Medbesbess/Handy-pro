// payment controller
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    console.log('Payment initiation started:', { bookingId, userId });

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId
      },
      include: {
        service: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Convert price to millimes (dinars * 1000)
    const amountInMillimes = Math.round(parseFloat(booking.totalPrice) * 1000);

    const paymentData = {
      app_token: "0320e063-c371-4bec-b418-27ae12d2e663",
      app_secret: "bc234f95-7b5d-40ef-9598-66c07b557b11",
      amount: String(amountInMillimes),
      accept_card: "true",
      session_timeout_secs: "1200",
      success_link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/bookings/${bookingId}?payment=success`,
      fail_link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/bookings/${bookingId}?payment=failed`,
      developer_tracking_id: `booking_${bookingId}_${Date.now()}_${userId}_payment`
    };

    console.log('Sending request to Flouci:', paymentData);

    const response = await fetch("https://developers.flouci.com/api/generate_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log('Flouci response:', result);

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: parseInt(bookingId),
        amount: booking.totalPrice,
        status: "PENDING",
        paymentMethod: "ONLINE",
        transactionId: result.result.payment_id
      }
    });

    return res.json(result);

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { payment_id } = req.body;
    const userId = req.user.id;

    console.log('Verifying payment:', { bookingId, payment_id, userId });

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const verifyResponse = await fetch(`https://developers.flouci.com/api/verify_payment/${payment_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apppublic": "0320e063-c371-4bec-b418-27ae12d2e663",
        "appsecret": "bc234f95-7b5d-40ef-9598-66c07b557b11"
      }
    });

    const verifyResult = await verifyResponse.json();
    console.log('Verification result:', verifyResult);

    if (verifyResult.success) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: parseInt(bookingId) },
          data: { status: "COMPLETED" }
        }),
        prisma.payment.updateMany({
          where: { 
            bookingId: parseInt(bookingId),
            transactionId: payment_id
          },
          data: { status: "COMPLETED" }
        })
      ]);

      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Get payment history
    const payments = await prisma.payment.findMany({
      where: {
        bookingId: parseInt(bookingId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  getPaymentHistory
};