import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../contextAd/ThemeContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaCharts.scss";
const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;

// Array representing the months as numbers (1 = January, 12 = December)
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]); // Start with an empty data array
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025); // Default year

  // Fetch data for each month of the selected year
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const fetchedData = await Promise.all(
          months.map(async (month) => {
            const response = await fetch(
              `${MEMBERSHIP}/api/receipts/ReceiptStat?From=${selectedYear}-${month
                .toString()
                .padStart(2, "0")}-01T00%3A00%3A00&To=${selectedYear}-${month
                .toString()
                .padStart(2, "0")}-31T23%3A59%3A59`
            );
            const result = await response.json();

            if (result.isSuccess && result.result.receiptStat) {
              const monthlyData = result.result.receiptStat.reduce(
                (total, item) => total + item.total,
                0
              );
              return { month, csiRenew: monthlyData }; // Return the data for the month
            }
            return { month, csiRenew: 0 }; // If no data, return 0
          })
        );

        setData(fetchedData); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching monthly data", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchMonthlyData();
  }, [selectedYear]); // Fetch data whenever selectedYear changes

  // Calculate the total revenue for all months
  const totalRevenue = data.reduce((total, item) => total + item.csiRenew, 0);

  const formatTooltipValue = (value) => `${value}`;
  const formatYAxisLabel = (value) => `${value}`;
  const formatLegendValue = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Revenue Receipt</h5>
        <div className="chart-info-data">
          <div className="info-data-value">{totalRevenue.toFixed(1)}</div>
          <div className="info-data-text">
            <FaArrowUpLong />
          </div>
        </div>
      </div>

      {/* Year Selector */}
      <div className="year-selector">
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}>
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
              tickFormatter={(month) => {
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "April",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                return monthNames[month - 1]; // Convert number to month name
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="csiRenew"
              fill="#475be8"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
