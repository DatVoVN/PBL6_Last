import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "./EditMovie.css";
import Select from "react-select";

const EditMovie = ({ movieToEdit, onClose, fetchMovies }) => {
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
    actors: null,
    isHot: true,
    status: true,
    createdDate: "",
    updatedDate: "",
    genreIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const MOVIE = import.meta.env.VITE_MOVIE;
  useEffect(() => {
    if (movieToEdit) {
      setMovieData({
        ...movieToEdit.movie,
        categoryId: movieToEdit.category?.categoryId,
        countryId: movieToEdit.country?.countryId,
        genreIds: movieToEdit.genres?.map((genre) => genre.genreId) || [],
      });
    }
  }, [movieToEdit]);
  console.log("Movie Data", movieData);
  console.log("Movie Edit", movieToEdit);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${MOVIE}/api/categories`);
        const data = await response.json();
        if (response.ok) {
          setCategories(data.result);
        } else {
          toast.error("Failed to fetch categories.");
        }
      } catch (error) {
        toast.error("Error fetching categories: " + error.message);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${MOVIE}/api/countries`);
        const data = await response.json();
        if (response.ok) {
          setCountries(data.result);
        } else {
          toast.error("Failed to fetch countries.");
        }
      } catch (error) {
        toast.error("Error fetching countries: " + error.message);
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
        toast.error("Failed to fetch genres: " + error.message);
      }
    };

    fetchCategories();
    fetchCountries();
    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "episodeCurrent" || name === "episodeTotal"
          ? parseInt(value)
          : value,
    }));
  };

  const handleGenreChange = (selectedOptions) => {
    setMovieData((prev) => ({
      ...prev,
      genreIds: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const selectedGenres = movieData.genreIds.map((id) => {
    const genre = genres.find((g) => g.value === id);
    return genre || { value: id, label: `Unknown (${id})` }; // Nếu không tìm thấy, tạo label mặc định
  });
  console.log(genres);
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setMovieData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveChanges = async () => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const updatedMovieData = { ...movieData, genreIds: movieData.genreIds };
    console.log("Data being sent to update movie:", updatedMovieData);

    try {
      const response = await fetch(`${MOVIE}/api/movies`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedMovieData),
      });

      // Kiểm tra phản hồi từ API
      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          `Error editing movie: ${errorResponse.message || "Unknown error"}`
        );
        return;
      }

      // Nếu cập nhật thành công
      toast.success("Movie updated successfully!");
      fetchMovies(); // Làm mới danh sách phim
      onClose(); // Đóng modal
    } catch (error) {
      // Bắt lỗi nếu có
      toast.error(`Error editing movie: ${error.message}`);
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.categoryId === movieData.categoryId
  );
  const selectedCountry = countries.find(
    (country) => country.countryId === movieData.countryId
  );
  console.log(movieToEdit);

  return (
    <div className="modal1">
      <div className="modal-content1">
        <h3>Edit Movie</h3>
        <form>
          <div className="form-group">
            <label>Movie Name</label>
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleInputChange}
              placeholder="Enter movie name"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="categoryId"
              value={movieData.categoryId}
              onChange={handleInputChange}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Country</label>
            <select
              name="countryId"
              value={movieData.countryId}
              onChange={handleInputChange}>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={movieData.slug}
              onChange={handleInputChange}
              placeholder="Enter movie slug"
            />
          </div>
          <div className="form-group">
            <label>View</label>
            <input
              type="number"
              name="view"
              value={movieData.view}
              onChange={handleInputChange}
              placeholder="Enter View"
            />
          </div>
          <div className="form-group">
            <label>Actors</label>
            <input
              type="text"
              name="actors"
              value={movieData.actors}
              onChange={handleInputChange}
              placeholder="Enter actors"
            />
          </div>
          <div className="form-group">
            <label>Episode Current</label>
            <input
              type="number"
              name="episodeCurrent"
              value={movieData.episodeCurrent}
              onChange={handleInputChange}
              placeholder="Enter current episode"
            />
          </div>

          <div className="form-group">
            <label>Episode Total</label>
            <input
              type="number"
              name="episodeTotal"
              value={movieData.episodeTotal}
              onChange={handleInputChange}
              placeholder="Enter total episodes"
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={movieData.duration}
              onChange={handleInputChange}
              placeholder="Enter duration"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={movieData.description}
              onChange={handleInputChange}
              placeholder="Enter movie description"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={movieData.imageUrl}
              onChange={handleInputChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label>Trailer URL</label>
            <input
              type="text"
              name="trailer"
              value={movieData.trailer}
              onChange={handleInputChange}
              placeholder="Enter trailer URL"
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleInputChange}
              placeholder="Enter release year"
            />
          </div>

          <div className="form-group">
            <label>Is Hot</label>
            <input
              type="checkbox"
              name="isHot"
              checked={movieData.isHot}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <input
              type="checkbox"
              name="status"
              checked={movieData.status}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="form-group">
            <label>Genres</label>
            <Select
              options={genres}
              isMulti
              value={selectedGenres}
              onChange={handleGenreChange}
              placeholder="Select genres"
              className="genres-select"
            />
          </div>

          <div className="form-group">
            <button type="button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </form>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EditMovie;
