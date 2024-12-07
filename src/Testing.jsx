import { useState, useEffect } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const Testing = () => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Define the start and end dates for filtering
      const startDate = new Date("2024-12-10");
      const endDate = new Date("2024-12-13");

      // Convert the start and end dates to Firestore Timestamps
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      // Reference to the Firestore "Testing" collection
      const q = query(
        collection(db, "Testing"),
        where("pickupDatetime", ">=", startTimestamp),
        where("pickupDatetime", "<=", endTimestamp)
      );

      try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());

        console.log(data); // Log the filtered data
        setFilteredData(data); // Set the filtered data
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once when the component mounts

  return (
    <div>
      <h3>Filtered Data from Firestore</h3>
      <pre>{JSON.stringify(filteredData, null, 2)}</pre>
    </div>
  );
};

export default Testing;
