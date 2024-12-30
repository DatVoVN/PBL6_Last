import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./MovieWatching.css";
import BackButton from "../../components/BackButton/BackButton";
import Comments from "../../components/Comments/Comments";
import Rating from "../../components/Rating/Rating";
import TopViewProduct from "../../components/TopViewProduct/TopViewProduct";
import Spinner from "../../components/Spinner/Spinner";

const MovieWatching = () => {
  const location = useLocation();
  const [productData, setProductData] = useState(null);
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { movieData } = location.state || {};
  const navigate = useNavigate();
  const [topViewedMovies, setTopViewedMovies] = useState([]);
  const MEMBERSHIP = import.meta.env.VITE_MEMBERSHIP;
  const MOVIE = import.meta.env.VITE_MOVIE;
  const REACTION = import.meta.env.VITE_REACTION;
  // Fetch membership status for the current user
  const fetchMembershipStatus = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) return;

      const response = await fetch(`${MEMBERSHIP}/api/memberShips`);
      const data = await response.json();

      if (data.isSuccess) {
        const isUserMember = data.result.some(
          (member) => member.userId === userId
        );
        setIsMember(isUserMember);
      }
    } catch (error) {
      console.error("Error fetching membership status:", error);
    }
  };

  // Fetch episode details
  const fetchEpisodesDetails = async (episodeId) => {
    try {
      const response = await fetch(`${MOVIE}/api/episodes/${episodeId}`);
      const data = await response.json();

      if (data.isSuccess) {
        setProductData(data.result);
        setSelectedEpisodeUrl(data.result?.servers[0].link);
      } else {
        console.error("Failed to fetch episode details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching episode details:", error);
    }
  };

  // Save watch history silently
  const saveWatchHistory = async (episode) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      setMessage("You must be logged in to view ratings.");
      return;
    }
    try {
      const watchedDuration = "00:00:00";
      const lastWatched = new Date().toISOString();

      const body = JSON.stringify({
        id: 0,
        movieId: movieData.movie.movieId,
        movieName: movieData.movie.name,
        movieImageUrl: movieData.movie.imageUrl,
        episodeName: episode.name,
        episodeId: episode.episodeId,
        watchedDuration,
        lastWatched,
      });

      console.log("Request body for saveWatchHistory:", body);

      const response = await fetch(`${REACTION}/api/watch_histories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body,
      });

      if (!response.ok) {
        console.error("Failed to save watch history:", response.statusText);
      } else {
        const data = await response.json();
        console.log("Watch history saved successfully:", data);
      }
    } catch (error) {
      console.error("Error saving watch history:", error);
    }
  };

  // Handle click on an episode
  const handleEpisodeClick = (episode) => {
    if (episode.isFree === false && !isMember) {
      setShowSubscriptionModal(true);
    } else {
      saveWatchHistory(episode); // Save watch history
      fetchEpisodesDetails(episode.episodeId); // Fetch episode details
      setSelectedEpisode(episode.episodeId);
    }
  };
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
  // Automatically select the newest episode when movie data is loaded
  useEffect(() => {
    const fetchData = async () => {
      await fetchMembershipStatus();

      if (movieData) {
        // Get the newest episode based on episode number
        const newestEpisode = movieData.episodes
          .slice()
          .sort((a, b) => b.episodeNumber - a.episodeNumber)[0];

        if (newestEpisode) {
          // Check if the episode is free or not and if the user is a member
          if (newestEpisode.isFree === false && !isMember) {
            setShowSubscriptionModal(true);
          } else {
            setShowSubscriptionModal(false);
            fetchEpisodesDetails(newestEpisode.episodeId); // Fetch episode details
            setSelectedEpisode(newestEpisode.episodeId);

            // Save the newest episode to watch history
            saveWatchHistory(newestEpisode);
          }
        }
      }
    };

    fetchData();
    fetchMovies();
  }, [movieData, isMember]);

  if (!movieData) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const handleRatingChange = (newRating) => {
    console.log("New Rating:", newRating);
  };
  useEffect(() => {
    const movieId = movieData?.movie?.movieId; // Ví dụ lấy từ movieData
    const episodeId = selectedEpisode; // Ví dụ lấy từ selectedEpisode
    if (movieId && episodeId) {
      const timer = setTimeout(() => {
        console.log("MovieId:", movieId);
        console.log("EpisodeId:", episodeId);
        fetch(
          `https://cineworld.io.vn:7004/api/views?MovieId=${movieId}&EpisodeId=${episodeId}`,
          {
            method: "POST", // Đặt phương thức là POST
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MovieId: movieId,
              EpisodeId: episodeId,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
          })
          .catch((error) => {
            console.error("Error fetching views:", error);
          });
      }, 300000);

      return () => clearTimeout(timer);
    }
  }, [movieData, selectedEpisode]);

  return (
    <section className="anime-details spad" style={{ height: "1800px" }}>
      <div className="back" style={{ marginBottom: "20px" }}>
        <BackButton />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="anime__video__player">
              <iframe
                id="player"
                src={selectedEpisodeUrl || ""}
                title="Anime Video Player"
                allowFullScreen
                style={{
                  width: "90%",
                  height: "70vh",
                  minWidth: "800px",
                  minHeight: "450px",
                  margin: "0 auto",
                  display: "block",
                  border: "none",
                  backgroundColor: "black",
                }}
              />
            </div>

            <div className="anime__details__episodes">
              <div className="section-title">
                <h5>{movieData.movie.name} - Episodes</h5>
              </div>
              <div className="episode-list">
                {movieData.episodes
                  .slice()
                  .sort((a, b) => a.episodeNumber - b.episodeNumber)
                  .map((episode) => {
                    const isSelected = selectedEpisode === episode.episodeId;

                    return (
                      <a
                        href="#"
                        key={episode.episodeId}
                        className="episode-link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEpisodeClick(episode);
                        }}
                        style={{
                          position: "relative",
                          color: isSelected ? "red" : "white",
                        }}>
                        {episode.isFree === false && (
                          <span
                            className="crown-icon"
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "40px",
                            }}>
                            👑
                          </span>
                        )}
                        Ep {String(episode.episodeNumber).padStart(2, "0")}
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <Rating
          currentRating={movieData.movie.rating}
          movieId={movieData.movie.movieId}
          onRatingChange={handleRatingChange}
        />
        {showSubscriptionModal && (
          <div className="subscription-modal">
            <div className="modal-content">
              <h3>To watch this episode, you need to be a member.</h3>
              <p>Do you want to subscribe and become a member?</p>
              <button
                className="button1"
                style={{ marginBottom: "20px" }}
                onClick={() => setShowSubscriptionModal(false)}>
                Cancel
              </button>
              <button
                className="button1"
                style={{ paddingLeft: "5px" }}
                onClick={() => navigate("/membership")}>
                Subscribe Now
              </button>
            </div>
          </div>
        )}
        <div className="row" style={{ position: "relative" }}>
          <div className="col-lg-8">
            <Comments movieId={movieData.movie.movieId} />
          </div>
          <div
            className="col-lg-3 custom-sidebar"
            style={{ paddingRight: "-10px" }}>
            <div
              className="product__sidebar"
              style={{
                position: "absolute",
                top: "0",
                width: "30%",
                marginBottom: "50px",
              }}>
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
    </section>
  );
};

export default MovieWatching;
