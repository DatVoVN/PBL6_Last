import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./Favorites.css"; // Import the CSS file
import Pagination from "../../components/Pagination/Pagination";
import { Link } from "react-router-dom";
import { CiHeart, CiTrash } from "react-icons/ci";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal"; // Import the modal
import Spinner from "../../components/Spinner/Spinner";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [movieToDelete, setMovieToDelete] = useState(null); // State for the movie to delete
  const REACTION = import.meta.env.VITE_REACTION;

  const fetchFavorites = async (pageNumber = 1) => {
    const token = Cookies.get("authToken");
    const url = `${REACTION}/api/favorites/GetUserFavorites?PageNumber=${pageNumber}&PageSize=25`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.isSuccess) {
        setFavorites(data.result.records || []);
        setTotalPages(data.result.totalPages);
      } else {
        throw new Error(data.message || "Failed to fetch favorites");
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = (movieId) => {
    setMovieToDelete(movieId);
    setShowModal(true); // Show the modal when trying to delete a movie
  };

  const confirmDelete = async () => {
    const token = Cookies.get("authToken");
    const url = `${REACTION}/api/favorites`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId: movieToDelete }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete favorite");
      }

      const result = await response.json();
      if (result.isSuccess) {
        alert("Movie removed from favorites!");
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.movieId !== movieToDelete)
        );
      } else {
        throw new Error(result.message || "Failed to delete favorite");
      }
    } catch (err) {
      console.error("Error deleting favorite:", err);
      alert("An error occurred while removing the movie from favorites.");
    } finally {
      setShowModal(false); // Close the modal after the action
    }
  };

  const cancelDelete = () => {
    setShowModal(false); // Close the modal without doing anything
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchFavorites(pageNumber);
  };

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="countrypage" style={{ marginBottom: "20px" }}>
      <h5
        style={{
          color: "white",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          fontSize: "30px",
        }}>
        <CiHeart style={{ marginRight: "10px", fontSize: "30px" }} />
        MY FAVORITE
      </h5>

      <div className="movies-list">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div
              className="product__item1"
              key={movie.movieId}
              style={{
                width: "280px",
                height: "350px",
                marginBottom: "30px",
              }}>
              <div
                className="product__item__pic"
                style={{
                  backgroundImage: `url(${
                    movie?.movieImageUrl || "img/trending/trend-1.jpg"
                  })`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "top center",
                  backgroundSize: "cover",
                }}></div>
              <div
                className="product__item__text"
                style={{ color: "white", backgroundColor: "brown" }}>
                <h5>
                  <Link to={`/detail-watching/${movie.movieId}`}>
                    {movie.movieName || "Default Movie Name"}
                  </Link>
                </h5>
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    marginTop: "10px",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteFavorite(movie.movieId)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "18px",
              height: "500px",
            }}>
            No favorite movies yet.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal for confirmation */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to remove this movie from your favorites?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default Favorites;
