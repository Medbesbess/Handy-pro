import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const TopCategoriesChart = () => {
  const [categoriesData, setCategoriesData] = useState({
    categories: [],
    servicesCount: []
  });

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/stats/services-by-category');
        console.log(response.data);

        const categories = response.data.map(item => item.name); // Get category names
        const servicesCount = response.data.map(item => item.services.length);      // Get course counts

        setCategoriesData({ categories, servicesCount });
      } catch (error) {
        console.error("Error fetching top categories data", error);
      }
    };

    fetchCategoriesData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: categoriesData.categories, // Categories for X-axis
    },
    plotOptions: {
      bar: {
        horizontal: false,   // Set to false for vertical bars
        columnWidth: '50%',
        distributed: true,   // Gives each bar a unique color
      }
    },
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26A69A', '#D10CE8', '#E8D610', '#1DD6E8'], // 10 colors for bars
    dataLabels: {
      enabled: true,
      formatter: (val) => val,  // Show exact course counts
    },
    title: {
      text: 'Top Categories by Service',
      align: 'center',
      style: {
        fontSize: '20px'
      }
    },
  };

  const chartSeries = [
    {
      name: 'Courses Count',
      data: categoriesData.servicesCount
    }
  ];

  return (
    <div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={450}
        
      />
    </div>
  );
};

export default TopCategoriesChart;
