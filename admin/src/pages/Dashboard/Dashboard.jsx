import React from "react";
import TopCategoriesChart from "../../components/TopCategoriesChart";
import UserRoleChart from "../../components/UserRoleChart";
import Layout from "../Layout/Layout";
import BookingRadialBar from "../../components/BookingRadialBar";
import OverviewServices from "../../components/OverviewServices";
const Dashboard = () => {
  return (
    <div>
      <Layout>
        <div className="flex w-full flex-wrap  p-4  gap-x-5 ">
          <div className="card w-full lg:w-[73%] p-4 shadow-lg border  border-gray-200">
            <div className="card-body w-full">
              <TopCategoriesChart />
            </div>
          </div>
          <div className="grid w-full lg:w-[25%] grid-auto  lg:grid-cols-1 gap-x-5 ">
            <div className="card p-4 shadow-lg border border-gray-200">
              <div className="card-body ">
                <BookingRadialBar />
              </div>
            </div>
            <div className="card p-4 shadow-lg border border-gray-200">
              <div className="card-body grid  gap-x-5 ">
                <UserRoleChart />
              </div>
            </div>
          </div>
        </div>
        <OverviewServices/>
      </Layout>
    </div>
  );
};

export default Dashboard;
