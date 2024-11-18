const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const salesController = {
  // Get all sales for a provider
  getProviderSales: async (req, res) => {
    try {
      const providerId = req.user.id;

      const sales = await prisma.booking.findMany({
        where: {
          providerId: providerId,
          status: "COMPLETED",
          payments: {
            some: {
              status: "COMPLETED"
            }
          }
        },
        include: {
          service: {
            select: {
              name: true,
            }
          },
          user: {
            select: {
              username: true,
              email: true,
            }
          },
          payments: {
            where: {
              status: "COMPLETED"
            },
            select: {
              amount: true,
              createdAt: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Calculate total balance
      const totalBalance = sales.reduce((sum, sale) => {
        return sum + parseFloat(sale.payments[0]?.amount || 0);
      }, 0);

      // Format the sales data
      const formattedSales = sales.map(sale => ({
        id: sale.id,
        service: {
          name: sale.service.name
        },
        user: {
          username: sale.user.username,
          email: sale.user.email
        },
        amount: parseFloat(sale.payments[0]?.amount || 0),
        createdAt: sale.createdAt
      }));

      res.json({
        sales: formattedSales,
        totalBalance: totalBalance
      });

    } catch (error) {
      console.error("Error fetching provider sales:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch sales data",
        error: error.message 
      });
    }
  },

  // Get single sale details
  getSaleDetails: async (req, res) => {
    try {
      const { saleId } = req.params;
      const providerId = req.user.id;

      const sale = await prisma.booking.findFirst({
        where: {
          id: saleId,
          providerId: providerId,
          status: "COMPLETED",
          payments: {
            some: {
              status: "COMPLETED"
            }
          }
        },
        include: {
          service: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            }
          },
          payments: {
            where: {
              status: "COMPLETED"
            }
          }
        }
      });

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found"
        });
      }

      res.json({
        success: true,
        sale
      });

    } catch (error) {
      console.error("Error fetching sale details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sale details",
        error: error.message
      });
    }
  },

  // Get sales statistics
  getSalesStats: async (req, res) => {
    try {
      const providerId = req.user.id;
      const { startDate, endDate } = req.query;

      const whereClause = {
        providerId: providerId,
        status: "COMPLETED",
        payments: {
          some: {
            status: "COMPLETED"
          }
        }
      };

      // Add date range if provided
      if (startDate && endDate) {
        whereClause.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      }

      const stats = await prisma.booking.aggregate({
        where: whereClause,
        _count: {
          id: true
        },
        _sum: {
          payments: {
            amount: true
          }
        }
      });

      res.json({
        success: true,
        statistics: {
          totalSales: stats._count.id,
          totalRevenue: stats._sum.payments?.amount || 0
        }
      });

    } catch (error) {
      console.error("Error fetching sales statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sales statistics",
        error: error.message
      });
    }
  }
};

module.exports = salesController;