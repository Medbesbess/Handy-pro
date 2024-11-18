import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const BookingRadialBar = () => {
  const [bookingData, setBookingData] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    confirmedBookings : 0,
    cancelledBookings : 0,
    rejectedBookings : 0
  });

  useEffect(() => {
    const fetchbookingData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/stats/bookings-by-status');
        console.log(response.data);
        
        // Ensure response contains the necessary fields
        const { totalBookings, pendingBookings, completedBookings ,confirmedBookings , cancelledBookings , rejectedBookings  } = response.data;
        
        setBookingData({
          totalBookings: totalBookings || 0,
          pendingBookings: pendingBookings || 0,
          completedBookings: completedBookings || 0,
          confirmedBookings: confirmedBookings || 0,
          cancelledBookings: cancelledBookings || 0,
          rejectedBookings: rejectedBookings || 0
        });
      } catch (error) {
        console.error("Error fetching course data", error);
      }
    };

    fetchbookingData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'radialBar',
    },
    title: {
      text: 'Booking Overview',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: () => bookingData.totalBookings // Display total courses
          }
        }
      }
    },
    labels: ['Pending', 'Completed' , 'Confirmed' , 'Cancelled' , 'Rejected'] // Labels for the data
  };

  const chartSeries = [
    Math.round((bookingData.pendingBookings*100)/bookingData.totalBookings),
    Math.round((bookingData.completedBookings*100)/bookingData.totalBookings),
    Math.round((bookingData.confirmedBookings*100)/bookingData.totalBookings),
    Math.round((bookingData.cancelledBookings*100)/bookingData.totalBookings),
    Math.round((bookingData.rejectedBookings*100)/bookingData.totalBookings)
  ];

  return (
    <div>
      {bookingData.totalBookings > 0 ? (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          height={225}
        />
      ) : (
        <p>Loading course data...</p>
      )}
    </div>
  );
};

export default BookingRadialBar;
