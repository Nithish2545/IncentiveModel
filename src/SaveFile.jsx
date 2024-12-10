// Sample data for transformation
const data = [
  {
    pickuparea: "adayar",
    pickupDatetime: { seconds: 1728374400 }, // Timestamp for 08-10-2024
    awbNumber: 9000,
    status: "RUN SHEET",
    pickupBookedBy: "nithish",
    logisticCost: 30000,
    actualNoOfPackages: 1,
    content: "contentcontentcontentcontent",
  },
  {
    pickuparea: "adayar",
    pickupDatetime: { seconds: 1728374400 }, // Timestamp for 08-10-2024
    awbNumber: 7000,
    status: "RUN SHEET",
    pickupBookedBy: "nithish",
    logisticCost: 90000,
    actualNoOfPackages: 2,
    content: "contentcontentcontentcontent",
  },
  {
    pickuparea: "adayar",
    pickupDatetime: { seconds: 1728374400 }, // Timestamp for 08-10-2024
    awbNumber: 9000,
    status: "RUN SHEET",
    pickupBookedBy: "sana",
    logisticCost: 30000,
    actualNoOfPackages: 1,
    content: "contentcontentcontentcontent",
  },
];

// Convert Firebase timestamp to dd-mm-yyyy format
const convertToDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Transform data into the required format
const transformData = () => {
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

// Transform the data
const dataset = transformData();

// Output the transformed data
console.log(JSON.stringify(dataset, null, 2));
