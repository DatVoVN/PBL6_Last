import AreaBarChart from "./AreaBarChart";
import AreaProgressChart from "./AreaProgressChart";

const AreaCharts = ({ startDate, endDate }) => {
  return (
    <section className="content-area-charts">
      <AreaBarChart />
      {/* Pass the startDate and endDate as props to AreaProgressChart */}
      <AreaProgressChart startDate={startDate} endDate={endDate} />
    </section>
  );
};

export default AreaCharts;
