import { useState, useEffect } from "react";

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

    // Log the formatted dates for debugging
    console.log("Formatted Start Date:", formattedStartDate);
    console.log("Formatted End Date:", formattedEndDate);

    // Fetch data from the API based on the selected date range
    const fetchTopMovies = async () => {
      try {
        const response = await fetch(
          `https://cineworld.io.vn:7004/api/views/ViewStat?StatWith=Movie&TopMovies=1&From=${formattedStartDate}&To=${formattedEndDate}&PageNumber=1`
        );

        const result = await response.json();

        // Log the fetched data for debugging
        console.log("Fetched data:", result);

        if (result && result.result) {
          const newData = result.result.map((movie) => ({
            id: movie.movieInfor.movieId, // movieId dùng làm ID duy nhất
            name: movie.movieInfor.movieName, // Tên phim
            percentValues: movie.viewCount, // Lượt xem làm tỷ lệ phần trăm
            imageUrl: movie.movieInfor.imageUrl, // URL ảnh phim
          }));
          setData(newData); // Cập nhật dữ liệu
        } else {
          setData([]); // Xóa dữ liệu nếu không có kết quả
        }
      } catch (error) {
        console.error("Error fetching top movies:", error);
        setData([]); // Xử lý lỗi và xóa dữ liệu
      }
    };

    // Log the full URL for fetching data to ensure it's correct
    console.log(
      `Fetching data with URL: https://cineworld.io.vn:7004/api/views/ViewStat?StatWith=Movie&TopMovies=1&From=${formattedStartDate}&To=${formattedEndDate}&PageNumber=1`
    );

    fetchTopMovies();
  }, [validStartDate, validEndDate]); // Fetch data whenever the date range changes

  console.log("Data:", data); // Log the data to verify it's being set correctly

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Top 1 Most Viewed Movies</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar) => (
          <div className="progress-bar-item" key={progressbar.id}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{progressbar.name}</p>
              {/* <p className="bar-item-info-value">{progressbar.percentValues}</p> */}
            </div>
            {/* <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{
                  width: `${progressbar.percentValues / 10}%`, // Scale view count to percentage
                }}></div>
            </div> */}
            <div className="movie-image">
              <img
                style={{ width: "100%", height: "280px" }}
                src={progressbar.imageUrl}
                alt={progressbar.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;
