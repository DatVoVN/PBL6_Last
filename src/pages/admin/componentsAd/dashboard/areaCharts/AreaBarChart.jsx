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
// Giữ nguyên dữ liệu cho các tháng từ 1 đến tháng 11
const fakeData = [
  { month: "Jan", csiRenew: 2000 },
  { month: "Feb", csiRenew: 2200 },
  { month: "Mar", csiRenew: 1212 },
  { month: "April", csiRenew: 2030 },
  { month: "May", csiRenew: 3121 },
  { month: "Jun", csiRenew: 5434 },
  { month: "Jul", csiRenew: 3211 },
  { month: "Aug", csiRenew: 3212 },
  { month: "Sep", csiRenew: 1212 },
  { month: "Oct", csiRenew: 1212 },
  { month: "Nov", csiRenew: 2431 },
];

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState(fakeData); // Dữ liệu cho tháng 1 đến tháng 11
  const [isLoading, setIsLoading] = useState(true);
  const [isDecemberFetched, setIsDecemberFetched] = useState(false); // Flag to track if December data has been fetched

  // Fetch dữ liệu từ API cho tháng 12
  useEffect(() => {
    const fetchDecemberData = async () => {
      if (isDecemberFetched) return; // If December data is already fetched, don't fetch again

      try {
        const response = await fetch(
          `${MEMBERSHIP}/api/receipts/ReceiptStat?From=2024-12-01T00%3A00%3A00&To=2024-12-31T23%3A59%3A59`
        );
        const result = await response.json();
        if (result.isSuccess && result.result.receiptStat) {
          const decemberData = result.result.receiptStat.reduce(
            (total, item) => {
              return total + item.total;
            },
            0
          );

          // Cập nhật dữ liệu tháng 12 chỉ nếu chưa có
          setData((prevData) => {
            const decemberExists = prevData.some(
              (item) => item.month === "Dec"
            );
            if (!decemberExists) {
              return [
                ...prevData,
                {
                  month: "Dec",
                  csiRenew: decemberData,
                },
              ];
            }
            return prevData;
          });
        }
      } catch (error) {
        console.error("Error fetching December data", error);
      } finally {
        setIsLoading(false);
        setIsDecemberFetched(true); // Set flag to true once data is fetched
      }
    };

    fetchDecemberData();
  }, [isDecemberFetched]); // Only run effect when `isDecemberFetched` changes

  // Calculate the total revenue for all months
  const totalRevenue = data.reduce((total, item) => total + item.csiRenew, 0);

  const formatTooltipValue = (value) => {
    return `${value}`; // Không thêm 'k' cho tháng 12
  };

  const formatYAxisLabel = (value) => {
    return `${value}`; // Không thêm 'k' cho YAxis
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

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
