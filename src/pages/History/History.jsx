import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./History.css";
import Spinner from "../../components/Spinner/Spinner";

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const REACTION = import.meta.env.VITE_REACTION;
  const API_ENDPOINT = `${REACTION}/api/watch_histories/GetWatchHistories`;
  const DELETE_ENDPOINT = "https://cineworld.io.vn:7003/api/watch_histories";

  // Function to fetch watch history
  const fetchWatchHistories = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("authToken");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_ENDPOINT}?PageNumber=${page}&PageSize=3`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.isSuccess) {
        setHistoryData(data.result.records || []);
        setTotalPages(data.result.totalPages); // Set the total number of pages
      } else {
        throw new Error(data.message || "Failed to fetch watch history.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchWatchHistories(page);
  };

  // Function to handle deletion of all watch history
  const handleDeleteHistory = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(DELETE_ENDPOINT, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete watch history.");
      }

      // If deletion is successful, clear the history data
      setHistoryData([]);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deletion of individual watch history item
  const handleDeleteHistoryItem = async (watchHistoryId) => {
    const token = Cookies.get("authToken");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${DELETE_ENDPOINT}/${watchHistoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete watch history item.");
      }

      // If deletion is successful, remove the item from the history data
      setHistoryData((prevData) =>
        prevData.filter((history) => history.id !== watchHistoryId)
      );
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchHistories(currentPage);
  }, [currentPage]);

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ height: "100vh", color: "#020270" }}>
      <div className="history-container">
        <div className="history-header">
          <h2>Lịch sử xem</h2>
          <button onClick={handleDeleteHistory}>Xóa tất cả lịch sử xem</button>
        </div>
        {historyData.length === 0 ? (
          <p>Bạn chưa xem phim nào gần đây.</p>
        ) : (
          <ul className="history-list">
            {historyData.map((history) => (
              <li key={history.id} className="history-info">
                <img
                  src={history.movieImageUrl}
                  alt={history.movieName}
                  className="history-image"
                />
                <div className="history-details">
                  <h3>{history.movieName}</h3>
                  <p>
                    Tập: <span>{history.episodeName}</span>
                  </p>
                  <p>
                    Lần xem gần nhất:{" "}
                    {new Date(history.lastWatched).toLocaleString("vi-VN")}
                  </p>
                  <a href={`/detail-watching/${history.movieId}`}>
                    Xem tiếp phim
                  </a>
                  <button
                    style={{ marginLeft: "30px", color: "red" }}
                    onClick={() => handleDeleteHistoryItem(history.id)}
                    className="delete-history-btn">
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination controls */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default History;
