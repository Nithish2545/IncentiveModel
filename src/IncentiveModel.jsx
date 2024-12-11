import React, { useEffect, useState } from "react";
import utility from "./Utility/utilityFunctions";
import { Avatar } from "@mui/material";

function IncentiveModel() {
  const [DateRange, setDateRange] = useState("This Week"); // Default value set to "This Week"
  const currentYear = new Date().getFullYear(); // Get the current year
  const [LoginCredentials, setLoginCredentials] = useState([]);
  const [TotalBookings, setTotalBookings] = useState(0);
  const [TotalRevenue, setRevenue] = useState(0);
  const [AvgBookingvalue, setAvgBookingvalue] = useState(0);
  const [groupedData, setgroupedData] = useState({});
  const [TopPerformer, setTopPerformer] = useState("");

  function getSalesPersonBookings(person) {
    return groupedData[person]?.bookings.length
      ? groupedData[person]?.bookings.length
      : 0;
  }
 
  useEffect(() => {
    async function getData() {
      setRevenue(await utility.getRevenue(DateRange));
      setTotalBookings(await utility.getTotalBookings(DateRange));
      setAvgBookingvalue(await utility.AvgBookingValue(DateRange));
      setLoginCredentials(await utility.fetchLoginCredentials(DateRange));
      setgroupedData(await utility.groupByPickupBookedBy(DateRange));
      setTopPerformer(await utility.TopPerformer(DateRange));
    }
    getData();
  }, [DateRange]);

  function FirtLetterCaps(name) {
    return name?.charAt(0).toUpperCase() + name?.slice(1);
  }

  function findIncentive(person) {
    return utility.IncentiveCalculator(getSalesPersonBookings(person));
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-50 min-h-screen">
      {/* Filter Options Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Filter Options
        </h1>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date Range Filter */}
            <div>
              <label
                htmlFor="date-range"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date Range
              </label>
              <select
                id="date-range"
                name="dateRange"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                value={DateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="Select range">Select range</option>
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
              </select>
            </div>
            {/* Month Filter */}
            {/* <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Month
              </label>
              <select
                id="month"
                name="month"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {utility?.months.map((month, index) => (
                  <option key={index} value={`${month} ${currentYear}`}>
                    {month} {currentYear}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Sales Overview Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Sales Overview
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-purple-800">
              Total Bookings
            </h2>
            <p className="text-2xl font-bold text-purple-600">
              {TotalBookings}
            </p>
          </div>
          {/* Total Revenue */}
          <div className="bg-green-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-green-800">
              Total Revenue
            </h2>
            <p className="text-2xl font-bold text-green-600">₹{TotalRevenue}</p>
          </div>
          {/* Average Booking Value */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-blue-800">
              Avg. Booking Value
            </h2>
            <p className="text-2xl font-bold text-blue-600">
              ₹{AvgBookingvalue}
            </p>
          </div>
          {/* Top Performer */}
          <div className="bg-red-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-red-800">Top Performer</h2>
            <p className="text-2xl font-bold text-red-600">
              {FirtLetterCaps(TopPerformer)}
            </p>
          </div>
        </div>
      </div>
      {/* Sales Team Performance Section */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Sales Team Performance
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LoginCredentials.map((d) => (
            <div
              key={d.name}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <Avatar alt={FirtLetterCaps(d.name)} src="" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {FirtLetterCaps(d.name)}
                  </p>
                  <p className="text-sm text-gray-500">{d.role}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weekly Bookings</p>
                <p className="text-lg font-semibold text-gray-800">
                  {getSalesPersonBookings(d.name)}
                </p>
              </div>
              <button
                className="bg-gray-100 p-3 rounded-md flex items-center gap-2 hover:bg-gray-200"
                onClick={() => utility.downloadCSV(d.name, DateRange)}
              >
                <img
                  className="w-5"
                  src="download-minimalistic.svg"
                  alt="Download icon"
                />
                <span className="text-sm font-medium text-gray-600">
                  Download Report
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Weekly Incentive Section */}
      <div className="bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Weekly Incentive (Saturday to Friday)
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white border-collapse border border-gray-300 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                  Name
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                  Bookings
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                  Incentive
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {LoginCredentials.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                    {String(getSalesPersonBookings(row.name)).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                    ₹{findIncentive(row.name)}
                  </td>
                  <td className="px-6 py-4 text-center border-b border-gray-300">
                    <button className="text-nowrap bg-purple-600 text-white px-6 py-2 rounded-lg text-base font-semibold hover:bg-purple-700 hover:shadow-md focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all duration-200">
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
