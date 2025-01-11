
import React, { useState, useEffect } from "react";
// Old version: everything put from the front side
const FinancialTable = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    startYear: "0000",
    endYear: new Date().getFullYear().toString(),
    minRevenue: 0,
    maxRevenue: Infinity,
    minNetIncome: 0,
    maxNetIncome: Infinity,
  });
  const [initialValues, setInitialValues] = useState({
    startYear: true,
    endYear: true,
    minRevenue: true,
    maxRevenue: true,
    minNetIncome: true,
    maxNetIncome: true,
  });
  const [sortedBy, setSortedBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchFinancialData();
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the resize listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchFinancialData = async () => {
    // currently using free api key, noted if the key expired, then there will be error
    yourApiKey= ""; 
    const response = await fetch("https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey="+yourApiKey);
    const result = await response.json();    const result = await response.json();
    setData(result);
  };

  const handleSort = (column) => {
    const order = sortedBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortedBy(column);
    setSortOrder(order);
  };

  const filterData = () => {
    return data
      .filter((row) => {
        const year = parseInt(row.date.split("-")[0]);
        return (
          year >= parseInt(filters.startYear) &&
          year <= parseInt(filters.endYear) &&
          row.revenue >= filters.minRevenue &&
          row.revenue <= filters.maxRevenue &&
          row.netIncome >= filters.minNetIncome &&
          row.netIncome <= filters.maxNetIncome
        );
      })
      .sort((a, b) => {
        const columnA = a[sortedBy];
        const columnB = b[sortedBy];
        const multiplier = sortOrder === "asc" ? 1 : -1;

        if (columnA < columnB) return -1 * multiplier;
        if (columnA > columnB) return 1 * multiplier;
        return 0;
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      setInitialValues((prevValues) => ({
        ...prevValues,
        [name]: value === "" || value === undefined ? true : false, // If value is empty, revert to initial
      }));
      let newValue;

      // Set default values based on field name
      if (value === "") {
        if (name === "startYear") {
          newValue = "0000";
        }
        else if (name === "endYear") newValue = new Date().getFullYear().toString();
        else if (name === "minRevenue" || name === "minNetIncome") newValue = 0;
        else if (name === "maxRevenue" || name === "maxNetIncome") newValue = Infinity;
      } else {
        newValue = value;
      }
      return { ...prevFilters, [name]: newValue };
    });
  };

  const formatNumber = (number) => {
    if (typeof number !== 'number') return number;


    // If screen width is large (e.g., 1024px or larger), show the full number
    if (screenWidth >= 1024) {
      return number.toLocaleString(); // Formats number with commas
    }

    // Otherwise, show abbreviated values (K, M, B)
    if (number >= 1e9) {
      return (number / 1e9).toFixed(1) + 'B'; // For billion
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(1) + 'M'; // For million
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(1) + 'K'; // For thousand
    } else {
      return number; // For values below 1,000
    }
  };

  return (
    <div className="container mx-auto p-4 app-container">
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">Start Year:</label>
          <input
            type="number"
            name="startYear"
            value={initialValues.startYear && filters.startYear === "0000" ? "" : filters.startYear}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">End Year:</label>
          <input
            type="number"
            name="endYear"
            value={initialValues.endYear && filters.endYear === new Date().getFullYear().toString() ? "" : filters.endYear}
            onChange={handleChange}
            className="border-2 border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">Revenue Range:</label>
          <input
            type="number"
            name="minRevenue"
            value={initialValues.minRevenue && filters.minRevenue === 0 ? "" : filters.minRevenue}
            onChange={handleChange}
            placeholder="Min"
            className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-lg"
          />
          <input
            type="number"
            name="maxRevenue"
            value={initialValues.maxRevenue && filters.maxRevenue === Infinity ? "" : filters.maxRevenue}
            onChange={handleChange}
            placeholder="Max"
            className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 text-xs sm:text-sm md:text-lg"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">Net Income Range:</label>
          <input
            type="number"
            name="minNetIncome"
            value={initialValues.minNetIncome && filters.minNetIncome === 0 ? "" : filters.minNetIncome}
            onChange={handleChange}
            placeholder="Min"
            className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-lg"
          />
          <input
            type="number"
            name="maxNetIncome"
            value={initialValues.maxNetIncome && filters.maxNetIncome === Infinity ? "" : filters.maxNetIncome}
            onChange={handleChange}
            placeholder="Max"
            className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 text-xs sm:text-sm md:text-lg"
          />
        </div>
      </div>

      <div className="container mx-auto p-4">
        <table className="w-full border-collapse border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg table-fixed">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th
                className="border-2 p-3 cursor-pointer hover:bg-blue-200 transition-all text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words"
                onClick={() => handleSort("date")}
              >
                Date
              </th>
              <th
                className="border-2 p-3 cursor-pointer hover:bg-blue-200 transition-all text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words"
                onClick={() => handleSort("revenue")}
              >
                Revenue
              </th>
              <th
                className="border-2 p-3 cursor-pointer hover:bg-blue-200 transition-all text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words"
                onClick={() => handleSort("netIncome")}
              >
                Net Income
              </th>
              <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">
                Gross Profit
              </th>
              <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[100px] max-w-[150px] break-words">
                EPS
              </th>
              <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">
                Operating Income
              </th>
            </tr>
          </thead>
          <tbody>
            {filterData().length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="border-2 p-3 text-center text-gray-500"
                  style={{ height: '60px' }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              filterData().map((row, index) => (
                <tr
                  key={row.date}
                  className={`border-2 border-black p-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <td className="border-2 p-3 break-words text-[clamp(0.75rem,_2vw,_1.5rem)]">{row.date}</td>
                  <td className="border-2 p-3 break-words text-[clamp(0.75rem,_2vw,_1.5rem)]">{formatNumber(row.revenue)}</td>
                  <td className="border-2 p-3 break-words text-[clamp(0.75rem,_2vw,_1.5rem)]">{formatNumber(row.netIncome)}</td>
                  <td className="border-2 p-3 break-words text-[clamp(0.75rem,_2vw,_1.5rem)]">{formatNumber(row.grossProfit)}</td>
                  <td className="border-2 p-3 break-words text-[clamp(0.75rem,_2vw,_1.5rem)]">{row.eps}</td>
                  <td className="border-2 p-3 break-words text-[clamp(0.75rem,_2vw,_1.5rem)]">{formatNumber(row.operatingIncome)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>



      {/* Explanation/Legend below the table */}
      <div className="mt-4 text-xs sm:text-sm md:text-base text-gray-600">
        <p><strong>Legend:</strong></p>
        <ul>
          <li><strong>K</strong> = Thousand (e.g., 1K = 1,000)</li>
          <li><strong>M</strong> = Million (e.g., 1M = 1,000,000)</li>
          <li><strong>B</strong> = Billion (e.g., 1B = 1,000,000,000)</li>
        </ul>
      </div>
    </div>




  );
};

export default FinancialTable;


// version for seperation for frontEnd and backend

// const FinancialTable = () => {
//   const [data, setData] = useState([]);
//   const [filters, setFilters] = useState({
//     startYear: "0000",
//     endYear: new Date().getFullYear().toString(),
//     minRevenue: 0,
//     maxRevenue: Infinity,
//     minNetIncome: 0,
//     maxNetIncome: Infinity,
//   });
//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     fetchFinancialData();
//     const handleResize = () => {
//       setScreenWidth(window.innerWidth);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup the resize listener when the component is unmounted
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [filters]);  // Re-fetch data when filters change

//   const fetchFinancialData = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/financial-data?start_year=${filters.startYear}&end_year=${filters.endYear}&min_revenue=${filters.minRevenue}&max_revenue=${filters.maxRevenue}&min_net_income=${filters.minNetIncome}&max_net_income=${filters.maxNetIncome}&sort_by=date&sort_order=asc`  // The sort params are now sent in the query to the server
//       );
//       console.log(        `http://localhost:8000/api/financial-data?start_date=${filters.startYear}&end_date=${filters.endYear}&min_revenue=${filters.minRevenue}&max_revenue=${filters.maxRevenue}&min_net_income=${filters.minNetIncome}&max_net_income=${filters.maxNetIncome}&sort_by=date&sort_order=asc`  // The sort params are now sent in the query to the server
//       )
//       const result = await response.json();
//       if (Array.isArray(result)) {
//         setData(result); // Set data only if it's an array
//       } else {
//         console.error("Invalid data format:", result);
//         setData([]); // Default to empty array in case of error
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       setData([]); // Default to empty array in case of fetch error
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const formatNumber = (number) => {
//     if (typeof number !== 'number') return number;

//     if (screenWidth >= 1024) {
//       return number.toLocaleString(); // Formats number with commas
//     }

//     if (number >= 1e9) {
//       return (number / 1e9).toFixed(1) + 'B'; // For billion
//     } else if (number >= 1e6) {
//       return (number / 1e6).toFixed(1) + 'M'; // For million
//     } else if (number >= 1e3) {
//       return (number / 1e3).toFixed(1) + 'K'; // For thousand
//     } else {
//       return number; // For values below 1,000
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 app-container">
//       {/* Input fields */}
//       <div className="mb-6">
//         <div className="flex flex-wrap items-center">
//           <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">Start Year:</label>
//           <input
//             type="number"
//             name="startYear"
//             value={filters.startYear}
//             onChange={handleChange}
//             className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-lg"
//           />
//         </div>
//       </div>
//       <div className="mb-6">
//         <div className="flex flex-wrap items-center">
//           <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">End Year:</label>
//           <input
//             type="number"
//             name="endYear"
//             value={filters.endYear}
//             onChange={handleChange}
//             className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-lg"
//           />
//         </div>
//       </div>
//       <div className="mb-6">
//         <div className="flex flex-wrap items-center">
//           <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">Revenue Range:</label>
//           <input
//             type="number"
//             name="minRevenue"
//             value={filters.minRevenue}
//             onChange={handleChange}
//             placeholder="Min"
//             className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-lg"
//           />
//           <input
//             type="number"
//             name="maxRevenue"
//             value={filters.maxRevenue}
//             onChange={handleChange}
//             placeholder="Max"
//             className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 text-xs sm:text-sm md:text-lg"
//           />
//         </div>
//       </div>
//       <div className="mb-6">
//         <div className="flex flex-wrap items-center">
//           <label className="ml-4 mr-2 text-xs sm:text-sm md:text-lg">Net Income Range:</label>
//           <input
//             type="number"
//             name="minNetIncome"
//             value={filters.minNetIncome}
//             onChange={handleChange}
//             placeholder="Min"
//             className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-lg"
//           />
//           <input
//             type="number"
//             name="maxNetIncome"
//             value={filters.maxNetIncome}
//             onChange={handleChange}
//             placeholder="Max"
//             className="border-2 border-gray-300 p-2 sm:p-3 md:p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 text-xs sm:text-sm md:text-lg"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="container mx-auto p-4">
//         <table className="w-full border-collapse border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg table-fixed">
//           <thead className="bg-blue-100 text-left">
//             <tr>
//               <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">Date</th>
//               <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">Revenue</th>
//               <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">Net Income</th>
//               <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">Gross Profit</th>
//               <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[100px] max-w-[150px] break-words">EPS</th>
//               <th className="border-2 p-3 text-[clamp(0.75rem,_2vw,_1.5rem)] min-w-[150px] max-w-[200px] break-words">Operating Income</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="border-2 p-3 text-center text-gray-500"
//                   style={{ height: '60px' }}
//                 >
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               data.map((row, index) => (
//                 <tr
//                   key={row.date}
//                   className={`border-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
//                 >
//                   <td className="border-2 p-3">{row.date}</td>
//                   <td className="border-2 p-3">{formatNumber(row.revenue)}</td>
//                   <td className="border-2 p-3">{formatNumber(row.netIncome)}</td>
//                   <td className="border-2 p-3">{formatNumber(row.grossProfit)}</td>
//                   <td className="border-2 p-3">{row.eps}</td>
//                   <td className="border-2 p-3">{formatNumber(row.operatingIncome)}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Explanation/Legend below the table */}
//       <div className="mt-4 text-xs sm:text-sm md:text-base text-gray-600">
//         <p><strong>Legend:</strong></p>
//         <ul>
//           <li><strong>K</strong> = Thousand (e.g., 1K = 1,000)</li>
//           <li><strong>M</strong> = Million (e.g., 1M = 1,000,000)</li>
//           <li><strong>B</strong> = Billion (e.g., 1B = 1,000,000,000)</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default FinancialTable;
