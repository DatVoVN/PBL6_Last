import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddMovie.css";
import Cookies from "js-cookie";

const AddMovie = ({ onClose, fetchMovies }) => {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movieData, setMovieData] = useState({
    movieId: 0,
    categoryId: 0,
    countryId: 0,
    seriesId: null,
    name: "",
    slug: "",
    originName: "",
    episodeCurrent: 0,
    episodeTotal: 0,
    duration: "",
    description: "",
    imageUrl: "",
    trailer: "",
    year: 0,
    view: 0,
    showTimes: null,
    showTimesDetails: null,
    actors: "",
    isHot: false,
    status: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    genreIds: [],
  });
  const MOVIE = import.meta.env.VITE_MOVIE;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${MOVIE}/api/categories`);
        const data = await response.json();
        setCategories(data.result || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories!");
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${MOVIE}/api/countries`);
        const data = await response.json();
        setCountries(data.result || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to fetch countries!");
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch(`${MOVIE}/api/genres`);
        const data = await response.json();
        const formattedGenres = data.result.map((genre) => ({
          value: genre.genreId,
          label: genre.name,
        }));
        setGenres(formattedGenres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast.error("Failed to fetch genres!");
      }
    };

    fetchCategories();
    fetchCountries();
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenreChange = (selectedOptions) => {
    const genreIds = selectedOptions.map((option) => option.value);
    setMovieData((prev) => ({ ...prev, genreIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      console.error("Authorization token is missing");
      toast.error("Authorization token is missing!");
      return;
    }

    try {
      const response = await fetch(`${MOVIE}/api/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(movieData),
      });

      if (response.status === 201) {
        toast.success("Movie added successfully!");
        fetchMovies(1, "", "", "", "");
        // Đợi 1 giây trước khi đóng modal
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.error(
          `Error editing movie: ${errorResponse.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error(error.message || "Failed to add movie!");
    }
  };

  return (
    <div className="add-movie-modal">
      <ToastContainer autoClose={3000} />
      <div className="add-movie-form">
        <h2>Add New Movie</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Origin Name:
            <input
              type="text"
              name="originName"
              value={movieData.originName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category:
            <select
              name="categoryId"
              value={movieData.categoryId}
              onChange={handleChange}
              required>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Country:
            <select
              name="countryId"
              value={movieData.countryId}
              onChange={handleChange}
              required>
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Genres:
            <Select
              options={genres}
              isMulti
              onChange={handleGenreChange}
              placeholder="Select genres"
              className="genres-select"
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={movieData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Image:
            <input
              type="file"
              accept="image/*"
              disabled={movieData.imageUrl}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setMovieData((prev) => ({
                      ...prev,
                      imageUrl: reader.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <input
              type="url"
              name="imageUrl"
              placeholder="Or paste image URL"
              value={movieData.imageUrl}
              disabled={
                movieData.imageUrl && !movieData.imageUrl.startsWith("data:")
              }
              onChange={handleChange}
            />
          </label>

          {movieData.imageUrl && (
            <div className="image-preview" style={{ position: "relative" }}>
              <img
                src={movieData.imageUrl}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
              <button
                type="button"
                onClick={() =>
                  setMovieData((prev) => ({ ...prev, imageUrl: "" }))
                }
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  width: "50px",
                  height: "50px",
                }}>
                X
              </button>
            </div>
          )}

          <label>
            Trailer URL:
            <input
              type="url"
              name="trailer"
              value={movieData.trailer}
              onChange={handleChange}
            />
          </label>

          <label>
            Year:
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleChange}
              required
              min="1888"
              max={new Date().getFullYear() + 1}
            />
          </label>
          <label>
            View:
            <input
              type="number"
              name="view"
              value={movieData.view}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Episode Current:
            <input
              type="number"
              name="episodeCurrent"
              value={movieData.episodeCurrent}
              onChange={handleChange}
              required
              min="0"
            />
          </label>

          <label>
            Episode Total:
            <input
              type="number"
              name="episodeTotal"
              value={movieData.episodeTotal}
              onChange={handleChange}
              required
              min="0"
            />
          </label>

          <label>
            Duration (e.g., 2h 30m):
            <input
              type="text"
              name="duration"
              value={movieData.duration}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Actors:
            <input
              type="text"
              name="actors"
              value={movieData.actors}
              onChange={handleChange}
            />
          </label>

          <label>
            Is Hot:
            <input
              type="checkbox"
              name="isHot"
              checked={movieData.isHot}
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <button type="submit">Add Movie</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
