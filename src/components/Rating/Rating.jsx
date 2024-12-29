import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "./Rating.css";

const Rating = ({ currentRating = 0, movieId, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState(currentRating);
  const [ratingId, setRatingId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [message, setMessage] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const REACTION = import.meta.env.VITE_REACTION;

  const fetchCurrentRating = async () => {
    try {
      const authToken = Cookies.get("authToken");

      if (!authToken) {
        setMessage("You must be logged in to view ratings.");
        return;
      }

      const response = await fetch(
        `${REACTION}/api/ratings/GetRate/${movieId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.isSuccess && data.result) {
        setRating(data.result.ratingValue);
        setRatingId(data.result.id);
      } else {
        setRating(0); // No rating exists
        setRatingId(null);
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
      setMessage("An error occurred while fetching the rating.");
    }
  };

  const fetchAverageRating = async () => {
    try {
      const authToken = Cookies.get("authToken");

      const response = await fetch(
        `${REACTION}/api/ratings/GetAverageRating/${movieId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.isSuccess && data.result) {
        setAverageRating(data.result.averageRating);
        setRatingCount(data.result.ratingCount);
      } else {
        setMessage("Failed to fetch average rating.");
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
      setMessage("An error occurred while fetching average rating.");
    }
  };

  const handleMouseEnter = (value) => {
    if (isEditable) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable) {
      setHoveredRating(0);
    }
  };

  const handleClick = (value) => {
    if (isEditable) {
      setRating(value);
    }
  };

  const handleAddRating = async () => {
    try {
      const authToken = Cookies.get("authToken");
      const userId = Cookies.get("userId");

      if (!authToken || !userId) {
        setMessage("You must be logged in to add a rating.");
        return;
      }

      const response = await fetch(`${REACTION}/api/ratings/AddRate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          movieId: movieId,
          ratingValue: rating,
          userId: userId,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setMessage("Your rating has been added!");
        fetchCurrentRating();
        fetchAverageRating();
        setIsEditable(false);
        onRatingChange && onRatingChange(rating);
      } else {
        setMessage("Failed to add your rating. Please try again.");
      }
    } catch (error) {
      console.error("Error adding rating:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleUpdateRating = async () => {
    try {
      const authToken = Cookies.get("authToken");
      const userId = Cookies.get("userId");

      if (!authToken || !userId) {
        setMessage("You must be logged in to update your rating.");
        return;
      }

      const response = await fetch(`${REACTION}/api/ratings/UpdateRate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id: ratingId,
          movieId: movieId,
          ratingValue: rating,
          updatedAt: new Date().toISOString(),
          userId: userId,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setMessage("Your rating has been updated!");
        fetchCurrentRating();
        fetchAverageRating();
        setIsEditable(false);
        onRatingChange && onRatingChange(rating);
      } else {
        setMessage("Failed to update your rating. Please try again.");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const enableEditing = () => {
    setIsEditable(true);
    setMessage(
      ratingId
        ? "You can now update your rating."
        : "You can now add your rating."
    );
  };

  useEffect(() => {
    fetchCurrentRating();
    fetchAverageRating();
  }, [movieId]);

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let starClass = "star";

    if (hoveredRating >= i) {
      starClass = "star hovered";
    } else if (rating >= i) {
      starClass = "star filled";
    }

    stars.push(
      <span
        key={i}
        className={starClass}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}>
        ★
      </span>
    );
  }

  return (
    <div className="rating-container" style={{ display: "flex" }}>
      <h3 style={{ fontWeight: "bold", color: "white" }}>RATING</h3>
      <div></div>
      <div
        className="rating-text"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}>
        <div className="stars-container">{stars}</div>
        <div className="rating-summary">
          <span className="average-rating">
            {averageRating.toFixed(1)} ({ratingCount})
          </span>
        </div>
        <div className="rating-value">{hoveredRating || rating} / 5</div>
      </div>

      {!isEditable ? (
        <button onClick={enableEditing} className="edit-button">
          {ratingId ? "CHANGE RATE" : "RATE"}
        </button>
      ) : (
        <button
          onClick={ratingId ? handleUpdateRating : handleAddRating}
          className="rate-button">
          SUBMIT {ratingId ? "CHANGE" : "RATE"}
        </button>
      )}
      {message && <div className="rating-message">{message}</div>}
    </div>
  );
};

export default Rating;
