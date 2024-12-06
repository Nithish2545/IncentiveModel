import React from "react";

function IncentiveModel() {
  return (
    <div className="flex flex-col">
      <div className="bg-red p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Filter Options
        </h1>
        <form className="">
          <div className="flex gap-10">
            {/* Date Range Filter */}
            <div className="mb-4">
              <label
                htmlFor="date-range"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date Range
              </label>
              <select
                id="date-range"
                name="dateRange"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="This Week (Sat, May 20 - Fri, May 26, 2025)">
                  This Week (Sat, May 20 - Fri, May 26, 2025)
                </option>
                <option value="Last Week">Last Week</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>

            {/* Month Filter */}
            <div className="mb-4">
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <select
                id="month"
                name="month"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="February">February</option>
                <option value="June">June</option>
                <option value="July">July</option>
              </select>
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            type="submit"
            className="w-fit flex bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Apply Filters
          </button>
        </form>
      </div>

      <div>
        <h1>Sales Team Performance</h1>
        <div className="flex justify-between">
          <div className="bg-gray-100 w-fit p-4">
            <div className="flex">
              <img src="Group.svg" className="w-10" alt="" />
              <div>
                <p>Name</p>
                <role>Sales admin</role>
                <role>Sales associate</role>
              </div>
            </div>
            <div>
              <p>Weekly Bookings</p>
              <number>24</number>
            </div>
            <button className="bg-gray-200  p-2 rounded-sm flex gap-2">
              <img
                className="w-4"
                src="download-minimalistic-svgrepo-com 1.svg"
                alt=""
              />
              <p className="text-xs">Download Report</p>
            </button>
          </div>
          <div className="bg-gray-100 w-fit p-4">
            <div className="flex">
              <img src="Group.svg" className="w-10" alt="" />
              <div>
                <p>Name</p>
                <role>Sales admin</role>
                <role>Sales associate</role>
              </div>
            </div>
            <div>
              <p>Weekly Bookings</p>
              <number>24</number>
            </div>
            <button className="bg-gray-200  p-2 rounded-sm flex gap-2">
              <img
                className="w-4"
                src="download-minimalistic-svgrepo-com 1.svg"
                alt=""
              />
              <p className="text-xs">Download Report</p>
            </button>
          </div>
          <div className="bg-gray-100 w-fit p-4">
            <div className="flex">
              <img src="Group.svg" className="w-10" alt="" />
              <div>
                <p>Name</p>
                <role>Sales admin</role>
                <role>Sales associate</role>
              </div>
            </div>
            <div>
              <p>Weekly Bookings</p>
              <number>24</number>
            </div>
            <button className="bg-gray-200  p-2 rounded-sm flex gap-2">
              <img
                className="w-4"
                src="download-minimalistic-svgrepo-com 1.svg"
                alt=""
              />
              <p className="text-xs">Download Report</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncentiveModel;