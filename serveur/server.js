const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const authorizeProvider = require("./middleware/authorizeProvider");
require("dotenv").config();

// Initialize Express app
const app = express();

// Serve static files
app.use("/uploads", express.static("uploads"));

// Create HTTP server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const conversationRoutes = require("./routes/conversations");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const myCategoryRoutes = require("./routes/myCategoryRoutes");
const myServiceRoutes = require("./routes/myServiceRoutes");
const providerRoutes = require("./routes/bookingprovider");
const dashboardRouter = require("./routes/dashboardRoutes");
const servicedRoutes = require("./routes/postDetailRoutes");
const serviceProviderRouter = require("./routes/providerRoutes");
const userRoutesAdmin = require("./routes/routesAdmin/userRoutes");
const serviceRoutesAdmin = require("./routes/routesAdmin/serviceRoutes");
const analyticsRoutesAdmuin = require("./routes/routesAdmin/analyticsRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // Add this line
const salesRoutes = require("./routes/salesRoutes");
// Initialize Prisma
const prisma = new PrismaClient();

// Routes
app.use("/api/conversations", conversationRoutes);
app.use("/api/user", userRouter); // Adjust to match expected API path
app.use("/service", authorizeProvider, serviceRouter);
app.use("/api/my-categories", myCategoryRoutes);
app.use("/api/my-services", myServiceRoutes);
app.use("/service-provider", serviceProviderRouter);
app.use("/provider", authorizeProvider, providerRoutes);
app.use("/serviceDetail", authorizeProvider, servicedRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/users", userRoutesAdmin);
app.use("/services", serviceRoutesAdmin);
app.use("/stats", analyticsRoutesAdmuin);
app.use("/api", paymentRoutes); // Add this line
app.use("/api/provider", salesRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinConversation", (conversationId) => {
    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    socket.join(conversationId);
    console.log(`A user joined conversation: ${conversationId}`);
  });

  socket.on("sendMessage", async (message) => {
    try {
      const savedMessage = await prisma.message.create({
        data: {
          conversationId: message.conversationId,
          sender: message.sender,
          content: message.content,
          createdAt: new Date(message.createdAt),
        },
      });

      io.to(message.conversationId).emit("newMessage", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("messageError", { message: "Failed to save message" });
    }
  });

  socket.on("messagesRead", (data) => {
    io.emit("messagesRead", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});