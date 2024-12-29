import { MdOutlineMenu } from "react-icons/md";
import "./AreaTop.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../../contextAd/SidebarContext";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays, startOfMonth, endOfMonth } from "date-fns"; // Updated to import required date functions
import { DateRange } from "react-date-range";
import AreaCharts from "../areaCharts/AreaCharts"; // Import AreaCharts component

const AreaTop = () => {
  const { openSidebar } = useContext(SidebarContext);

  // Set startDate to the 1st day of the current month and endDate to the 30th or last day of the month
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [state, setState] = useState([
    {
      startDate: currentMonthStart,
      endDate: currentMonthEnd,
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);

  const handleInputClick = () => {
    setShowDatePicker(true);
  };

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}>
          <MdOutlineMenu size={24} />
        </button>
      </div>
      <div className="area-top-r">
        <div
          style={{ marginTop: "10px" }}
          ref={dateRangeRef}
          className={`date-range-wrapper ${
            !showDatePicker ? "hide-date-range" : ""
          }`}
          onClick={handleInputClick}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            showMonthAndYearPickers={false}
          />
        </div>
      </div>
      {/* Pass state[0].startDate and state[0].endDate to AreaCharts */}
      <AreaCharts startDate={state[0].startDate} endDate={state[0].endDate} />
    </section>
  );
};

export default AreaTop;
