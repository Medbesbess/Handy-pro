import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const UsersRoleChart = () => {
  const [rolesData, setRolesData] = useState({
    customers: 0,
    serviceProviders: 0
  });

  useEffect(() => {
    const fetchRolesData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/stats/total-users');
        console.log(response.data);
        
        const { customers, serviceProviders } = response.data;
        
        setRolesData({
          customers: customers || 0,
          serviceProviders: serviceProviders || 0
        });
      } catch (error) {
        console.error("Error fetching roles data", error);
      }
    };

    fetchRolesData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'pie', // Set to pie for pie chart
    },
    labels: ['customers', 'serviceProviders'], // Labels for the slices
    colors: ['#008FFB', '#00E396'], // Colors for the slices
    title: {
      text: 'customers vs serviceProviders',
      align: 'center',
      style: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#263238'

      }
    },
    dataLabels: {
      enabled: true, // Show numbers on the slices
      formatter: (val, opts) => {
        // Show absolute numbers instead of percentages
        const index = opts.seriesIndex;
        return [rolesData.customers, rolesData.serviceProviders][index];
      }
    },
  };

  const chartSeries = [
    rolesData.customers,
    rolesData.serviceProviders
  ];

  return (
    <div>
      {(rolesData.customers && rolesData.serviceProviders ) &&<Chart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={225}
        
      />}
    </div>
  );
};

export default UsersRoleChart;
