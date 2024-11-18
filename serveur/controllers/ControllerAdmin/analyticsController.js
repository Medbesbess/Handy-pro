const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTotalUsers = async (req, res) => {
  // count all user with role "CUSTOMER"
  
  const customers = await prisma.user.count({
    where : {
      userType : "CUSTOMER"
    }
  });
  const serviceProviders = await prisma.serviceProvider.count()
  res.json({ customers , serviceProviders });
};
exports.  getBookingsByStatus = async (req, res) => {
  const pendingBookings = await prisma.booking.count({
    where: { status: 'PENDING' },
  });
  //count Confirmed booking status
  const confirmedBookings = await prisma.booking.count({
    where: { status: 'CONFIRMED' },
  });
  //count Cancelled booking status
  const cancelledBookings = await prisma.booking.count({
    where: { status: 'CANCELLED' },
  });
  //count Completed booking status
  const completedBookings = await prisma.booking.count({
    where: { status: 'COMPLETED' },
  });
  //count Rejected booking status
  const rejectedBookings = await prisma.booking.count({
    where: { status: 'REJECTED' },
  });
  //count Total bookings
  const totalBookings = await prisma.booking.count();
  res.json({
    totalBookings,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    rejectedBookings,
  });
};

exports.getServicesByCategory = async (req, res) => {
  const servicesByCategory = await prisma.category.findMany({
    include: {
      services: true,
    },
  });
  res.json(servicesByCategory);
};
exports.allCategories = async (req,res)=>{
  const categories = await prisma.category.findMany({
    include: {
      services: true,
    },
  });
  res.json(categories);
}

exports.getActiveServiceProviders = async (req, res) => {
  const activeProviders = await prisma.serviceProvider.count({
    where: { isAvailable: true },
  });
  res.json({ activeProviders });
};
exports.getTotalRevenue = async (req, res) => {
  const revenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'COMPLETED' },
  });
  const bookings = await prisma.booking.findMany({
    include: {
      user :{
        select :{
          email : true ,
        }
      } , 
      provider :{
        select :{
          email : true ,
        }
      } ,
      service: {
        select : {
          name : true
        }
      },
    },
  });
  res.json({ totalRevenue: revenue._sum.amount , bookings });
};
