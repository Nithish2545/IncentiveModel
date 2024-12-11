import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { format, startOfWeek, addDays, subWeeks } from "date-fns";
import { db } from "../firebase";

function extractDate(dateString) {
  // Split the string at the '&' character and return the first part (the date)
  const datePart = dateString.split(" &")[0];
  return datePart;
}
function convertDateToTimestamp(dateString) {
  const result = extractDate(dateString);
  const [day, month, year] = result.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const seconds = Math.floor(date.getTime() / 1000);
  const nanoseconds = (date.getTime() % 1000) * 1e6;
  return {
    seconds,
    nanoseconds,
  };
}

console.log(
  "convertDateToTimestamp",
  convertDateToTimestamp("29-11-2024 &5 PM")
);

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

async function fetchData(DateRange) {
  try {
    let queryRef = collection(db, "pickup");

    // Get current date for date range
    const currentDate = new Date();

    // Get current week's range (Saturday to Friday)
    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn: 6 }); // Start on Saturday
    const currentWeekEnd = addDays(currentWeekStart, 6); // End on Friday

    // Get last week's range (Saturday to Friday)
    const lastWeekStart = subWeeks(currentWeekStart, 1);
    const lastWeekEnd = addDays(lastWeekStart, 6);
    // Format dates to "yyyy-MM-dd" format for comparison
    const formattedStartDate = Timestamp.fromDate(
      new Date(format(currentWeekStart, "yyyy-MM-dd"))
    );
    const formattedEndDate = Timestamp.fromDate(
      new Date(format(currentWeekEnd, "yyyy-MM-dd"))
    );

    const formattedLastWeekStart = Timestamp.fromDate(
      new Date(format(lastWeekStart, "yyyy-MM-dd"))
    );

    const formattedLastWeekEnd = Timestamp.fromDate(
      new Date(format(lastWeekEnd, "yyyy-MM-dd"))
    );

    // Conditional query based on selected DateRange
    if (DateRange === "This Week") {
      // console.log("formattedStartDate", currentWeekStart);
      queryRef = query(
        collection(db, "pickup"),
        where("status", "in", ["PAYMENT DONE", "SHIPMENT CONNECTED"])
      );
    } else if (DateRange === "Last Week") {
      queryRef = query(
        collection(db, "pickup"),
        where("status", "in", ["PAYMENT DONE", "SHIPMENT CONNECTED"])
      );
    }

    const querySnapshot = await getDocs(queryRef);
    const fetchedData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { ...data }; // Attach the parsed data
    });
    // Update the fetched data by converting pickupDatetime to Timestamp
    const updatedData = fetchedData.map((item) => ({
      ...item,
      pickupDatetime: convertDateToTimestamp(item.pickupDatetime),
    }));
    console.log("DateRange", DateRange, "updatedData", updatedData);

    // Filter based on the selected DateRange
    const filteredData = updatedData.filter((item) =>
      DateRange === "This Week"
        ? item.pickupDatetime.seconds >= formattedStartDate.seconds &&
          item.pickupDatetime.seconds <= formattedEndDate.seconds
        : item.pickupDatetime.seconds >= formattedLastWeekStart.seconds &&
          item.pickupDatetime.seconds <= formattedLastWeekEnd.seconds
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching pickup data:", error);
    return [];
  }
}

async function getRevenue(DateRange) {
  var Revenue = 0;
  await fetchData(DateRange).then((d) => {
    d?.map((value) => {
      Revenue += value.logisticCost;
    });
  });
  return Revenue.toFixed(2);
}

async function getTotalBookings(DateRange) {
  const FeatchedResult = await fetchData(DateRange);
  return FeatchedResult.length;
}

async function AvgBookingValue(DateRange) {
  const revenue = await getRevenue(DateRange);
  const totalBookings = await getTotalBookings(DateRange);
  const result = totalBookings === 0 ? 0 : revenue / totalBookings;
  return result.toFixed(2);
}

async function fetchLoginCredentials() {
  let collection_loginCre = collection(db, "LoginCredentials");
  const querySnapshot = await getDocs(collection_loginCre);
  const loginData = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID if needed
    ...doc.data(), // Spread the document fields
  }));
  const finalLoginCre = Object.entries(loginData[0])
    .filter(([email, details]) => {
      return details[3] === "CHENNAI";
    })
    .map(([email, details]) => ({
      email: details[1],
      name: details[0],
      role: details[2],
      location: details[3],
    }));
  return finalLoginCre;
}

const groupByPickupBookedBy = async (DateRange) => {
  const data = await fetchData(DateRange);
  const convertToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return data.reduce((result, item) => {
    const name = item.pickupBookedBy;

    // Add a new group for the name if it doesn't exist
    if (!result[name]) {
      result[name] = {
        pickupBookedBy: name,
        bookings: [],
      };
    }

    // Format the date and add the booking to the group
    result[name].bookings.push({
      ...item,
      pickupDatetime: convertToDate(item.pickupDatetime),
    });
    return result;
  }, {});
};

async function TopPerformer(DateRange) {
  const data = await groupByPickupBookedBy(DateRange);
  let topPerformer = { name: null, totalCost: 0, totalBookings: 0 };
  for (const person in data) {
    const bookings = data[person].bookings;
    const totalCost = bookings.reduce(
      (sum, booking) => sum + (booking.logisticCost || 0),
      0
    );
    const totalBookings = bookings.length;
    if (totalCost > topPerformer.totalCost) {
      topPerformer = { name: person, totalCost, totalBookings };
    }
  }
  return topPerformer.name ? topPerformer.name : "N/A";
}

function IncentiveCalculator(BookingCount) {
  if (BookingCount < 3) {
    return 0;
  } else if (BookingCount === 3) {
    return BookingCount * 50;
  } else if (BookingCount >= 4 && BookingCount <= 5) {
    return 3 * 60;
  } else if (BookingCount >= 6 && BookingCount <= 7) {
    return 3 * 75;
  }
}

// Transform data into the required format
const transformData = async (DateRange) => {
  const data = await fetchData(DateRange);
  // Convert Firebase timestamp to dd-mm-yyyy format
  const convertToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return Object.values(
    data.reduce((result, item) => {
      const formattedDate = convertToDate(item.pickupDatetime);
      const name = item.pickupBookedBy;
      const key = `${name}_${formattedDate}`;

      // Ensure the name exists in the dataset
      if (!result[name]) {
        result[name] = { name, [key]: { name_date: key, bookings: [] } };
      }

      // Ensure the date key exists under the name
      if (!result[name][key]) {
        result[name][key] = { name_date: key, bookings: [] };
      }

      // Push the booking into the relevant date key
      result[name][key].bookings.push({
        ...item,
        pickupDatetime: formattedDate,
      });

      return result;
    }, {})
  );
};

const downloadCSV = async (person, DateRange) => {
  var dataset = await transformData(DateRange);

  // Filter dataset for the specified person
  dataset = [dataset.find((entry) => entry.name === person)];
  if (dataset[0] == null) {
    return alert("Data not found!");
  }

  // Define CSV headers
  const headers = [
    // Personal Details
    "name",
    "name_date",
    "awbNumber",
    "consigneename",
    "consigneephonenumber",
    "consignorname",
    "consignorphonenumber",

    // Pickup Information
    "pickupBookedBy",
    "pickupDatetime",
    "packageConnectedDataTime",
    "pickUpPersonName",
    "pickuparea",
    "pincode",
    "rtoIfAny",

    // Package Details
    "actualNoOfPackages",
    "actualWeight",
    "weightapx",
    "postPickupWeight",
    "discountCost",
    "costKg",
    "logisticCost",

    // Destination and Status
    "destination",
    "service",
    "status",

    // Vendor Details
    "vendorAwbnumber",
    "vendorName",
    "franchise",

    // Other Details
    "PaymentComfirmedDate",
  ];

  const rows = [];

  dataset.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (Array.isArray(entry[key]?.bookings)) {
        const groupRows = entry[key].bookings.map((booking, index) => {
          const row = headers.reduce((acc, header) => {
            acc[header] = booking[header] || entry[header] || ""; // Use booking data, fallback to entry data, or blank
            return acc;
          }, {});

          if (index === 0) {
            row.name = entry.name; // Include `name` only for the first row
            row.name_date = key; // Include `name_date` only for the first row
          } else {
            row.name = ""; // Blank for subsequent rows
            row.name_date = ""; // Blank for subsequent rows
          }

          return row;
        });
        rows.push(...groupRows, {}); // Add blank row after group
      }
    });
  });

  // Create CSV content
  const csvContent =
    headers.join(",") +
    "\n" +
    rows
      .map((row) =>
        headers
          .map((header) => (row[header] !== undefined ? row[header] : ""))
          .join(",")
      )
      .join("\n");

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${person}_dataset.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

function getSalesPersonBookings(person) {
  return groupedData[person]?.bookings.length
    ? groupedData[person]?.bookings.length
    : 0;
}

export default {
  getRevenue: getRevenue,
  getTotalBookings: getTotalBookings,
  AvgBookingValue: AvgBookingValue,
  fetchLoginCredentials: fetchLoginCredentials,
  groupByPickupBookedBy: groupByPickupBookedBy,
  TopPerformer: TopPerformer,
  months: months,
  IncentiveCalculator: IncentiveCalculator,
  transformData: transformData,
  downloadCSV: downloadCSV,
  getSalesPersonBookings: getSalesPersonBookings,
};
