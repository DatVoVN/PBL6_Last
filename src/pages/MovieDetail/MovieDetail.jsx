import { useParams, useNavigate, Link } from "react-router-dom";
import "./MovieDetail.css";
import { useEffect, useState } from "react";
import TrailerModal from "../../components/TrailerModal/TrailerModal";
import BackButton from "../../components/BackButton/BackButton";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`https://localhost:7001/api/movies/${id}`);
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

  return (
    <div className="anime-details">
      <div className="back">
        <BackButton />
      </div>
      <div className="container">
        <div className="anime__details__content">
          <div className="row">
            <div className="col-md-3">
              <div
                className="anime__details__pic"
                style={{
                  backgroundImage: `url(${productData.movie.imageUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}></div>
            </div>
            <div className="col-md-9">
              <div className="anime__details__text">
                <div className="anime__details__title">
                  <h3>{productData.movie.name}</h3>
                </div>
                <p>{productData.movie.description}</p>
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
                            ? "Được xem"
                            : "Chưa được xem"}
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
                          <span>Last Updated:</span>{" "}
                          {productData.movie.updatedDate}
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
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <div className="anime__details__review">
                <div className="section-title">
                  <h5>Reviews</h5>
                </div>
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div className="anime__review__item" key={index}>
                      <div className="anime__review__item__pic">
                        <img src={`img/anime/review-${index + 1}.jpg`} alt="" />
                      </div>
                      <div className="anime__review__item__text">
                        <h6>
                          Reviewer Name - <span>Time Ago</span>
                        </h6>
                        <p>Your review comment here...</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="anime__details__form">
                <div className="section-title">
                  <h5>Your Comment</h5>
                </div>
                <form action="#">
                  <textarea placeholder="Your Comment"></textarea>
                  <button type="submit">
                    <i className="fa fa-location-arrow"></i> Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
