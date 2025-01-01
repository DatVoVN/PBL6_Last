import { useState, useEffect } from "react";
import { HiEye, HiFire, HiPencilAlt, HiTrash } from "react-icons/hi";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MovieDetail from "./MovieDetail";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";
import { FaFilter } from "react-icons/fa";

const TABLE_HEADS = [
  "Movie ID",
  "Name",
  "Category",
  "Country",
  "Status",
  "Action",
];
const MOVIES_PER_PAGE = 6;

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
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQueryCa, setSearchQueryCa] = useState("");
  const [searchQueryCountry, setSearchQueryCountry] = useState("");
  const [filter, setFilter] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // Gọi API để lấy danh sách categories
  useEffect(() => {
    fetch(
      "https://cineworld.io.vn:7001/api/categories?PageNumber=1&PageSize=1000"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          setCategories(data.result);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);
  useEffect(() => {
    fetch(
      "https://cineworld.io.vn:7001/api/countries?PageNumber=1&PageSize=2000"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.isSuccess && data.result) {
          setCountries(data.result);
        } else {
          console.error("Failed to fetch countries:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  const MOVIE = import.meta.env.VITE_MOVIE;
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    if (name === "Categories") {
      setSearchQueryCa(value);
    } else if (name === "Countries") {
      setSearchQueryCountry(value);
    }
  };
  const fetchMovies = async (
    currentPage,
    queryCa = "",
    queryCountry = "",
    orderBy,
    queryName = ""
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?Name=${queryName}&CategoryId=${queryCa}&CountryId=${queryCountry}&PageNumber=${currentPage}&PageSize=${MOVIES_PER_PAGE}&OrderBy=${orderBy}`
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
      toast.error("Authorization token is missing.");
      return;
    }
    try {
      const response = await fetch(
        `https://cineworld.io.vn:7001/api/movies?id=${movieToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 204) {
        toast.success("Movie deleted successfully.");

        fetchMovies(1, "", "", "", ""); // Refresh the movies list
        setIsDeleteModalOpen(false); // Close the delete modal
      } else {
        const errorText = await response.text();
        console.error("Error deleting movie:", errorText);
        toast.error("Failed to delete movie.");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie.");
    }
  };

  useEffect(() => {
    fetchMovies(
      currentPage,
      searchQueryCa,
      searchQueryCountry,
      filter,
      searchQuery
    );
  }, [currentPage, searchQueryCa, searchQueryCountry, filter, searchQuery]);

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
  const handleSearchClick = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    fetchMovies(1, searchQueryCa, searchQueryCountry, filter, searchQuery);
  };
  const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);
  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="content-area-table">
      <ToastContainer autoClose={2000} />
      <div className="data-table-info">
        <h4
          className="data-table-title"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "30px",
            color: "#1fc3f9",
            background: "linear-gradient(to right, #00ffe8, #db8e00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}>
          MOVIES
        </h4>

        <div className="buttons-container">
          <button
            className="add-category-btn"
            style={{ color: "white" }}
            onClick={() => setIsAddModalOpen(true)}>
            Add Movie
          </button>
          <div className="filter-container">
            <button
              className="filter-btn"
              onClick={toggleFilter}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                width: "100px",
                border: "none",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "10px",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}>
              <FaFilter size={20} style={{ marginRight: "8px" }} /> Filter
            </button>

            {isFilterVisible && (
              <div className="filter-dropdown">
                <select
                  className="filter-select"
                  value={filter}
                  onChange={handleFilterChange}>
                  <option value="">Default</option>
                  <option value="-Name">Name Descending</option>
                  <option value="Name">Name Ascending</option>
                  <option value="-Year">Year Descending</option>
                  <option value="Year">Year Ascending</option>
                  <option value="-View">View Descending</option>
                  <option value="View">View Ascending</option>
                </select>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              alignItems: "center",
              marginLeft: "50px",
            }}>
            <input
              type="text"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
              placeholder="Search by Name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              onClick={handleSearchClick}>
              Search
            </button>
            <select
              name="Countries"
              className="search-input"
              value={searchQueryCountry}
              onChange={handleSearchChange}>
              <option value="">Select a Country</option>
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.name}
                </option>
              ))}
            </select>
            <select
              name="Categories"
              className="search-input"
              value={searchQueryCa}
              onChange={handleSearchChange}>
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                        movie.movie.status ? "status-active" : "status-inactive"
                      }`}>
                      {movie.movie.status ? "Active" : "Inactive"}
                    </td>
                    <td className="dt-cell-action">
                      <HiEye
                        size={20}
                        style={{ marginRight: "10px" }}
                        onClick={() => handleViewMovie(movie.movie.movieId)}
                      />
                      <HiPencilAlt
                        size={20}
                        style={{ marginRight: "10px", color: "gold" }}
                        onClick={() => {
                          setMovieToEdit(movie);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <HiTrash
                        size={20}
                        style={{ marginRight: "10px", color: "red" }}
                        onClick={() => {
                          setMovieToDelete(movie.movie.movieId);
                          setIsDeleteModalOpen(true);
                        }}
                      />
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
            <span
              style={{
                color: "red",
              }}>{`Page ${currentPage} of ${totalPages}`}</span>
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
        <div className="modal">
          <div className="modal-content">
            <h4>Are you sure you want to delete this movie?</h4>
            <button
              onClick={() => {
                deleteMovie();
              }}
              style={{ backgroundColor: "red" }}>
              Yes
            </button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

      {isViewModalOpen && movieToView && (
        <div
          className="modal1"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}>
          <div
            className="modal-content2"
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              width: "80%",
            }}>
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
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => setIsViewModalOpen(false)}
              aria-label="Close modal">
              ×
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
