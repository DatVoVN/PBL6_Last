import { useState, useEffect } from "react";
import Cookies from "js-cookie";
const AreaProgressChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  // Ensure startDate and endDate have valid values
  const validStartDate =
    startDate && !isNaN(new Date(startDate)) ? new Date(startDate) : null;
  const validEndDate =
    endDate && !isNaN(new Date(endDate)) ? new Date(endDate) : null;

  useEffect(() => {
    if (!validStartDate || !validEndDate) {
      console.error("Invalid dates provided");
      return;
    }

    // Format the dates to the correct string format (ISO 8601)
    const formattedStartDate = validStartDate.toISOString();
    const formattedEndDate = validEndDate.toISOString();
    const authToken = Cookies.get("authToken");
    // Fetch data from the API based on the selected date range
    const fetchTopMovies = async () => {
      try {
        const response = await fetch(
          `https://cineworld.io.vn:7004/api/views/ViewStat?StatWith=Movie&TopMovies=5&From=${formattedStartDate}&To=${formattedEndDate}&PageNumber=1`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json", // Add any other necessary headers
            },
          }
        );

        const result = await response.json();

        if (result && result.result) {
          const newData = result.result.map((movie) => ({
            id: movie.movieInfor.movieId,
            name: movie.movieInfor.movieName,
            percentValues: movie.viewCount,
            imageUrl: movie.movieInfor.imageUrl,
          }));
          setData(newData);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      }
    };
    console.log(data);

    fetchTopMovies();
  }, [validStartDate, validEndDate]);
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Top 5 Most Viewed Movies</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar) => (
          <div className="progress-bar-item" key={progressbar.id}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{progressbar.name}</p>
              <p className="bar-item-info-value">{progressbar.percentValues}</p>
            </div>
            <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{
                  width: `100%`,
                }}></div>
            </div>
            {/* <div className="movie-image">
              <img
                style={{ width: "100%", height: "280px" }}
                src={progressbar.imageUrl}
                alt={progressbar.name}
              />
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;
