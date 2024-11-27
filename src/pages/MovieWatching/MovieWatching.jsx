import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./MovieWatching.css";
import BackButton from "../../components/BackButton/BackButton";
import Comments from "../../components/Comments/Comments";

const MovieWatching = () => {
  const location = useLocation();
  const [productData, setProductData] = useState(null);
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { movieData } = location.state || {};
  const navigate = useNavigate();

  const fetchMembershipStatus = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) return;

      const response = await fetch(
        "https://cineworld.io.vn:7002/api/memberShips"
      );
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

  const fetchEpisodesDetails = async (episodeId) => {
    try {
      const response = await fetch(
        `https://cineworld.io.vn:7001/api/episodes/${episodeId}`
      );
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

  const handleEpisodeClick = (episode) => {
    if (episode.isFree === false && !isMember) {
      setShowSubscriptionModal(true);
    } else {
      fetchEpisodesDetails(episode.episodeId);
      setSelectedEpisode(episode.episodeId);
    }
  };

  useEffect(() => {
    fetchMembershipStatus();
  }, []);

  if (!movieData) {
    return <div>Loading...</div>;
  }
  console.log("movieData", movieData);

  return (
    <section className="anime-details spad">
      <div className="back">
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
                          color: isSelected ? "red" : "inherit",
                        }}>
                        {episode.isFree === false && !isMember && (
                          <span
                            className="crown-icon"
                            style={{
                              position: "absolute",
                              top: "-10px",
                              left: "10px",
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
                lassName="button1"
                style={{ paddingLeft: "5px" }}
                onClick={() => navigate("/membership")}>
                Subscribe Now
              </button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="row">
          <div className="col-lg-8">
            <Comments movieId={movieData.movie.movieId} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieWatching;
