import { useParams, useNavigate, Link } from "react-router-dom";
import "./MovieDetail.css";
import { useEffect, useState } from "react";
import TrailerModal from "../../components/TrailerModal/TrailerModal";
import BackButton from "../../components/BackButton/BackButton";
import Comments from "../../components/Comments/Comments";
import Cookies from "js-cookie";
import Spinner from "../../components/Spinner/Spinner";
import Rating from "../../components/Rating/Rating";
import TopViewProduct from "../../components/TopViewProduct/TopViewProduct";

const decodeHtmlEntities = (text) => {
  let textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

const MOVIE = import.meta.env.VITE_MOVIE;
const REACTION = import.meta.env.VITE_REACTION;
const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchMovieDetails = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`${MOVIE}/api/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.isSuccess) {
        setProductData(data.result);
      } else {
        console.error("Failed to fetch movie details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  const handleRatingChange = (newRating) => {
    console.log("New Rating:", newRating);
    // You can send the new rating to the server or update the state if necessary
  };
  const fetchFavoriteStatus = async () => {
    const token = Cookies.get("authToken");
    const url = `${REACTION}/api/favorites/${id}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.isSuccess) {
        setIsFavorite(result.result);
      } else {
        console.error("Failed to fetch favorite status:", result.message);
      }
    } catch (error) {
      console.error("Error fetching favorite status:", error);
    }
  };
  const [topViewedMovies, setTopViewedMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${MOVIE}/api/movies?OrderBy=-View&PageNumber=1&PageSize=3`
      );
      const data = await response.json();
      if (data.isSuccess) {
        setTopViewedMovies(data.result);
      } else {
        console.error("Failed to fetch movies:", data.message);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  useEffect(() => {
    fetchMovieDetails();
    fetchFavoriteStatus();
    fetchMovies();
  }, [id]);

  const toggleFavorite = async () => {
    const userId = Cookies.get("userId");
    const movieId = id;
    const token = Cookies.get("authToken");

    const action = isFavorite ? "unfavorite" : "favorite";
    const confirmMessage = `Do you want to ${action} this movie?`;

    const userConfirmed = window.confirm(confirmMessage);

    if (!userConfirmed) return;

    const url = `${REACTION}/api/favorites`;

    try {
      const response = await fetch(url, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, movieId }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsFavorite(!isFavorite);
        alert(`Movie ${action}d successfully!`);
      } else {
        console.error(`Failed to ${action}:`, result.message);
        alert(`Failed to ${action} the movie. Please try again.`);
      }
    } catch (error) {
      console.error(`Error while ${action}ing:`, error);
      alert(`An error occurred while trying to ${action} the movie.`);
    }
  };

  if (!productData || !productData.movie) {
    return <Spinner />;
  }

  const decodedDescription = decodeHtmlEntities(productData.movie.description);

  return (
    <div className="anime-details" style={{ height: "1800px" }}>
      <div className="back">
        <BackButton />
      </div>
      <div className="container">
        <div className="anime__details__content">
          <div className="row">
            <div className="col-md-4">
              <div className="content-left">
                <div
                  className="anime__details__pic"
                  style={{
                    marginTop: "10px",
                    backgroundImage: `url(${productData.movie.imageUrl})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "auto",
                    height: "400px",
                  }}
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="content-right">
                <div className="anime__details__text">
                  <div className="anime__details__title">
                    <h3>
                      {productData.movie.name} ({productData.movie.originName})
                    </h3>
                  </div>

                  <p>{decodedDescription}</p>
                  <div className="anime__details__widget">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <ul>
                          <li>
                            <span>Date aired:</span> {productData.movie.year}
                          </li>
                          <li>
                            <span>Status:</span>
                            {productData.movie.status
                              ? "Có sẵn"
                              : "Không có sẵn"}
                          </li>
                          <li>
                            <span>Genre:</span>
                            {productData.genres.map((item, index) => (
                              <span
                                className="span1"
                                style={{ color: "white", width: "auto" }}
                                key={item.genreId}>
                                {item.name}
                                {index < productData.genres.length - 1
                                  ? ","
                                  : ""}
                              </span>
                            ))}
                          </li>
                          <li>
                            <span>Country:</span> {productData.country?.name}
                          </li>
                        </ul>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <ul>
                          <li>
                            <span>Last Updated:</span>
                            {new Date(
                              productData.movie.updatedDate
                            ).toLocaleDateString()}
                          </li>
                          <li>
                            <span>Category:</span>
                            {productData.category.name}
                          </li>
                          <li>
                            <span>EpisodeTotal:</span>
                            {productData.movie.episodeTotal}
                          </li>
                          <li>
                            <span>Duration:</span>
                            {productData.movie.duration}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="anime__details__btn">
                      <Link
                        to={`/movie-watching/${id}`}
                        state={{ movieData: productData }}
                        className="watch-btn">
                        <span>Watch Now</span>
                      </Link>
                      {productData.movie.trailer && (
                        <button
                          className="trailer-btn"
                          onClick={() => setShowTrailer(true)}>
                          <span>Trailer</span>
                        </button>
                      )}

                      <button
                        className={`favorite-btn ${isFavorite ? "active" : ""}`}
                        onClick={toggleFavorite}>
                        <span>{isFavorite ? "Unfavorite" : "Favorite"}</span>
                      </button>
                      {showTrailer && (
                        <TrailerModal
                          trailerUrl={productData.movie.trailer}
                          onClose={() => setShowTrailer(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Rating Section */}
          <div className="rating-section">
            <Rating
              currentRating={productData.movie.rating}
              movieId={productData.movie.movieId}
              onRatingChange={handleRatingChange}
            />
          </div>
          <div className="row" style={{ position: "relative" }}>
            <div className="col-lg-9 col-md-8 fixed-left" s>
              <Comments movieId={id} />
            </div>
            <div
              className="col-lg-3 custom-sidebar"
              style={{ paddingRight: "-10px" }}>
              <div
                className="product__sidebar"
                style={{ position: "absolute", top: "0", width: "30%" }}>
                <div className="product__sidebar__view1">
                  <div className="section-title">
                    <h5>Top Views</h5>
                  </div>
                  <TopViewProduct movies={topViewedMovies} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
