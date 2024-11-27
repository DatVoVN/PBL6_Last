import { useParams, useNavigate, Link } from "react-router-dom";
import "./MovieDetail.css";
import { useEffect, useState } from "react";
import TrailerModal from "../../components/TrailerModal/TrailerModal";
import BackButton from "../../components/BackButton/BackButton";
import Comments from "../../components/Comments/Comments";
const decodeHtmlEntities = (text) => {
  let textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};
const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://cineworld.io.vn:7001/api/movies/${id}`
      );
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

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (!productData || !productData.movie) {
    return <div>Loading movie details...</div>;
  }
  console.log(productData);

  const decodedDescription = decodeHtmlEntities(productData.movie.description);
  return (
    <div className="anime-details">
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
                    backgroundImage: `url(${productData.movie.imageUrl})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="content-right">
                <div className="anime__details__text">
                  <div className="anime__details__title">
                    <h3>{productData.movie.name}</h3>
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
                            <span>Genre:</span>{" "}
                            {productData.genres.map((item, index) => (
                              <span key={item.genreId}>
                                {item.name}
                                {index < productData.genres.length - 1
                                  ? ", "
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
                            {productData.movie.updatedDate}
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
                      <button
                        className="trailer-btn"
                        onClick={() => setShowTrailer(true)}>
                        <span>Trailer</span>
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
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <Comments movieId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
