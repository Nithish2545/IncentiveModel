import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { format, startOfWeek, addDays, subWeeks } from "date-fns";
import { db } from "../firebase";

async function fetchData(DateRange) {
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
      // console.log(
      //   "formattedStartDate:",
      //   format(currentWeekStart, "yyyy-MM-dd")
      // );
      // console.log("formattedEndDate:", format(currentWeekEnd, "yyyy-MM-dd"));
      // Firestore query (but note: we will handle date comparison manually later)
      queryRef = query(
        collection(db, "Testing"),
        where("pickupDatetime", ">=", formattedStartDate),
        where("pickupDatetime", "<=", formattedEndDate)
      );
    } else if (DateRange === "Last Week") {
      // console.log(
      //   "formattedLastWeekStart:",
      //   format(lastWeekStart, "yyyy-MM-dd")
      // );
      // console.log("formattedLastWeekEnd:", format(lastWeekEnd, "yyyy-MM-dd"));
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
      return { ...data }; // Attach the parsed date and in-range check
    });
    return fetchedData;
  } catch (error) {
    return "Error fetching pickup data: ", error;
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
  const result =
    (await getRevenue(DateRange)) / (await getTotalBookings(DateRange));
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

export default {
  getRevenue: getRevenue,
  getTotalBookings: getTotalBookings,
  AvgBookingValue: AvgBookingValue,
  fetchLoginCredentials: fetchLoginCredentials,
  groupByPickupBookedBy: groupByPickupBookedBy,
};