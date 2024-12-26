import { useState, useEffect } from "react";
import { HiEye, HiFire, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MovieDetail from "./MovieDetail";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";

const TABLE_HEADS = [
  "Movie ID",
  "Name",
  "Category",
  "Country",
  "Status",
  "Action",
];
const MOVIES_PER_PAGE = 8;

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ name: "", status: true });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [movieToView, setMovieToView] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?PageNumber=${currentPage}&PageSize=${MOVIES_PER_PAGE}`
      );
      const data = await response.json();
      setMovies(data.result || []);
      setTotalMovies(data.pagination.totalItems || 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies!");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMovie = async () => {
    if (!movieToDelete) return;
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }
    try {
      const response = await fetch(`${MOVIE}/api/movies/${movieToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error deleting movie:", errorText);
        toast.error("Failed to delete movie.");
        return;
      }

      toast.success("Movie deleted successfully.");
      fetchMovies();
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie.");
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, "");
  }, [currentPage]);

  const handleViewMovie = async (movieId) => {
    try {
      const response = await fetch(`${MOVIE}/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      setMovieToView(data.result);
      setIsViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch movie details");
    }
  };

  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="content-area-table">
      <ToastContainer autoClose={2000} />
      <div className="data-table-info">
        <h4 className="data-table-title">MOVIES</h4>
        <button
          className="add-category-btn"
          style={{ color: "white" }}
          onClick={() => setIsAddModalOpen(true)}>
          Add Movie
        </button>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="data-table-diagram">
          <table>
            <thead>
              <tr>
                {TABLE_HEADS.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie.movie.movieId}>
                    <td>{movie.movie.movieId}</td>
                    <td>{movie.movie.name}</td>
                    <td>{movie.category.name}</td>
                    <td>{movie.country.name}</td>
                    <td
                      className={`status-cell ${
                        movie.status ? "status-active" : "status-inactive"
                      }`}>
                      {movie.status ? "Active" : "Inactive"}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewMovie(movie.movie.movieId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          setMovieToEdit(movie);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          setMovieToDelete(movie.movie.movieId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                      <HiFire size={20} style={{ marginRight: "10px" }} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEADS.length}>No movies found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}>
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal1">
          <div className="modal-content1">
            <h4>Are you sure you want to delete this movie?</h4>
            <button
              onClick={() => {
                deleteMovie();
              }}
              style={{ marginRight: "10px" }}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

      {isViewModalOpen && movieToView && (
        <div className="modal1">
          <div className="modal-content2">
            <MovieDetail
              movie={{
                ...movieToView.movie,
                categoryId: movieToView.category?.categoryId,
                categoryName: movieToView.category?.name,
                countryId: movieToView.country?.countryId,
                countryName: movieToView.country?.name,
                genres: movieToView.genres || [],
                episodes: movieToView.episodes || [],
              }}
            />
            <button
              className="close-button"
              onClick={() => setIsViewModalOpen(false)}
              aria-label="Close modal">
              Close
            </button>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <AddMovie
          onClose={() => setIsAddModalOpen(false)}
          fetchMovies={fetchMovies}
        />
      )}
      {isEditModalOpen && movieToEdit && (
        <EditMovie
          movieToEdit={movieToEdit}
          onClose={() => setIsEditModalOpen(false)}
          fetchMovies={fetchMovies}
        />
      )}
    </section>
  );
};

export default Movies;
