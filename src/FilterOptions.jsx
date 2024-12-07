import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, subWeeks, parse } from "date-fns"; // Ensure parse is imported from date-fns correctly
// Import necessary functions
import { db } from "./firebase"; // Import your Firebase configuration (ensure you have the Firebase SDK initialized)
import { collection, query, where, getDocs } from "firebase/firestore";

function FilterOptions() {
  const [DateRange, setDateRange] = useState("");
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

  useEffect(() => {
    async function fetchData() {
      try {
        let queryRef = collection(db, "Testing");

        // Get current date for date range
        const currentDate = new Date();

        // Get current week's range (Saturday to Friday)
        const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 6 }); // Start on Saturday
        const currentWeekEnd = addDays(currentWeekStart, 6); // End on Friday

        // Get last week's range (Saturday to Friday)
        const lastWeekStart = subWeeks(currentWeekStart, 1);
        const lastWeekEnd = addDays(lastWeekStart, 6);

        // Format dates to "yyyy-MM-dd" format for comparison
        const formattedStartDate = format(currentWeekStart, "dd-MM-yyyy");
        const formattedEndDate = format(currentWeekEnd, "dd-MM-yyyy");

        const formattedLastWeekStart = format(lastWeekStart, "dd-MM-yyyy");
        const formattedLastWeekEnd = format(lastWeekEnd, "dd-MM-yyyy");

        // Conditional query based on selected DateRange
        if (DateRange === "This Week") {
          console.log("formattedStartDate:", formattedStartDate);
          console.log("formattedEndDate:", formattedEndDate);

          // Firestore query (but note: we will handle date comparison manually later)
          queryRef = query(
            collection(db, "Testing"),
            where("pickupDatetime", ">=", formattedStartDate),
            where("pickupDatetime", "<=", formattedEndDate)
          );
        } else if (DateRange === "Last Week") {
          console.log("formattedLastWeekStart:", formattedLastWeekStart);
          console.log("formattedLastWeekEnd:", formattedLastWeekEnd);

          // Firestore query for last week
          queryRef = query(
            collection(db, "Testing"),
            where("pickupDatetime", ">=", formattedLastWeekStart),
            where("pickupDatetime", "<=", formattedLastWeekEnd)
          );
        }

        const querySnapshot = await getDocs(queryRef);
        const fetchedData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const pickupDatetime = data?.pickupDatetime;

          // Parse and convert pickupDatetime to Date object
          let pickupDate = null;

          // Check if pickupDatetime is a string and try to parse it
          if (typeof pickupDatetime === "string") {
            // Parse the pickupDatetime string to Date object in the format "dd-MM-yyyy"
            pickupDate = parse(pickupDatetime, "dd-MM-yyyy", new Date());
          } else {
            console.error("pickupDatetime is not a string:", pickupDatetime);
          }

          // Manually compare if the pickupDate is within the range
          const isInRange =
            pickupDate >= lastWeekStart && pickupDate <= lastWeekEnd;

          return { ...data, pickupDate, isInRange }; // Attach the parsed date and in-range check
        });

        // Filter out records that are not in range
        const filteredData = fetchedData.filter((item) => item.isInRange);
        console.log(filteredData);
      } catch (error) {
        console.error("Error fetching pickup data: ", error);
      }
    }

    fetchData();
  }, [DateRange]); // Re-run the effect when DateRange changes
  return (
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
              <option value={`Select range`}>Select range</option>
              <option value={`This Week`}>This Week</option>
              <option value={`Last Week`}>Last Week</option>
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
  );
}

export default FilterOptions;
