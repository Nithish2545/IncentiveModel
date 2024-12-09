import React, { useEffect, useState } from "react";
import utility from "./Utility/utilityFunctions";
function IncentiveModel() {
  const [DateRange, setDateRange] = useState("This Week"); // Default value set to "This Week"
  const currentYear = new Date().getFullYear(); // Get the current year
  const [LoginCredentials, setLoginCredentials] = useState([]);
  const [TotalBookings, setTotalBookings] = useState(0);
  const [TotalRevenue, setRevenue] = useState(0);
  const [AvgBookingvalue, setAvgBookingvalue] = useState(0);
  const [groupedData, setgroupedData] = useState({});
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

  function getSalesPersonBookings(person) {
    return groupedData[person]?.bookings.length
      ? groupedData[person]?.bookings.length
      : 0;
    // console.log(groupedData[person]?.pickupBookedBy);
    // Object.keys(groupedData).forEach((person) => {
    // console.log(groupedData[person]?.bookings?.length);
    // });
  }

  useEffect(() => {
    async function getData() {
      setRevenue(await utility.getRevenue(DateRange));
      setTotalBookings(await utility.getTotalBookings(DateRange));
      setAvgBookingvalue(await utility.AvgBookingValue(DateRange));
      setLoginCredentials(await utility.fetchLoginCredentials(DateRange));
      setgroupedData(await utility.groupByPickupBookedBy(DateRange));
      // console.log(await utility.groupByPickupBookedBy(DateRange));
      // getSalesPersonBookings(
      //   "smitha",
      //   await utility.groupByPickupBookedBy(DateRange)
      // );
    }
    getData();
  }, [DateRange]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Filter Options Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Filter Options
        </h1>
        <form className="space-y-4">
          <div className="flex flex-wrap gap-6">
            {/* Date Range Filter */}
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="date-range"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date Range
              </label>
              <select
                id="date-range"
                name="dateRange"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                value={DateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="Select" range>
                  Select range
                </option>
                <option value="This Week">This Week</option>
                <option value="Last Week">Last Week</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>
            {/* Month Filter */}
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Month
              </label>
              <select
                id="month"
                name="month"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={`${month} ${currentYear}`}>
                    {month} {currentYear}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Range Picker */}
          {"Custom Range" === "Custom Range" && (
            <div className="flex gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start"
                  value={""}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end"
                  value={""}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Apply Filters Button */}
          <button
            type="submit"
            className="w-fit bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Apply Filters
          </button>
        </form>

        {/* Display the filtered data */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Filtered Data
          </h2>
          <ul></ul>
        </div>
      </div>
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
            <p className="text-2xl font-bold text-purple-600">
              {TotalBookings}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">Total Revenue</h2>
            <p className="text-2xl font-bold text-green-600">₹{TotalRevenue}</p>
          </div>

          {/* Average Booking Value */}
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">
              Avg. Booking Value
            </h2>
            <p className="text-2xl font-bold text-blue-600">
              ₹{AvgBookingvalue}
            </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LoginCredentials.map((d) => (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="Group.svg"
                  className="w-12 h-12 rounded-full"
                  alt=""
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {d.name.charAt(0).toUpperCase() + d.name.slice(1)}
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
              {LoginCredentials.map((row, index) => (
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
                    {/* {getSalesPersonBookings(row.name) <= 9
                      ? `0${getSalesPersonBookings(row.name)}`
                      : getSalesPersonBookings(row.name)} */}
                    {String(getSalesPersonBookings(row.name)).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {/* {row.incentive} */}
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