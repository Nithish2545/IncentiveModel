import React from "react";
import { format, addDays, startOfWeek, subWeeks } from "date-fns";
import FilterOptions from "./FilterOptions";

function IncentiveModel() {
  const currentYear = new Date().getFullYear(); // Get the current year
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]; // List of months

  const data = [
    { name: "John Doe", bookings: 24, incentive: "$200" },
    { name: "Jane Smith", bookings: 18, incentive: "$150" },
    { name: "Emily Davis", bookings: 30, incentive: "$250" },
    { name: "Michael Brown", bookings: 15, incentive: "$100" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Filter Options Section */}
      <FilterOptions/>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Sales Team Performance
        </h1>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 text-center">
          {/* Total Bookings */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">
              Total Bookings
            </h2>
            <p className="text-2xl font-bold text-purple-600">152</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">Total Revenue</h2>
            <p className="text-2xl font-bold text-green-600">$45,678</p>
          </div>

          {/* Average Booking Value */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">
              Avg. Booking Value
            </h2>
            <p className="text-2xl font-bold text-blue-600">$3020</p>
          </div>

          {/* Top Performer */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">Top Performer</h2>
            <p className="text-2xl font-bold text-red-600">John</p>
          </div>
        </div>
      </div>

      {/* Sales Team Performance Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Sales Team Performance
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src="Group.svg"
                  className="w-12 h-12 rounded-full"
                  alt=""
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Name</p>
                  <p className="text-sm text-gray-500">Sales Admin</p>
                  <p className="text-sm text-gray-500">Sales Associate</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weekly Bookings</p>
                <p className="text-lg font-semibold text-gray-800">24</p>
              </div>
              <button className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 hover:bg-gray-200">
                <img
                  className="w-5"
                  src="download-minimalistic-svgrepo-com 1.svg"
                  alt=""
                />
                <span className="text-sm font-medium text-gray-600">
                  Download Report
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Weekly Incentive (Saturday to Friday)
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Incentive
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {row.bookings}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {row.incentive}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IncentiveModel;
