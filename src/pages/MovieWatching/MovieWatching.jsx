import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./MovieWatching.css";
import BackButton from "../../components/BackButton/BackButton";

const MovieWatching = () => {
  const location = useLocation();
  const [productData, setProductData] = useState(null);
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false); // State for modal
  const { movieData } = location.state || {};
  const navigate = useNavigate();

  const fetchMembershipStatus = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) return;

      const response = await fetch("https://localhost:7196/api/memberShips");
      const data = await response.json();

      console.log("Fetched Membership Data:", data); // Log to check the fetched data

      if (data.isSuccess) {
        const isUserMember = data.result.some(
          (member) => member.userId === userId
        );
        setIsMember(isUserMember);
        console.log("Is User Member:", isUserMember); // Log if the user is a member
      }
    } catch (error) {
      console.error("Error fetching membership status:", error);
    }
  };

  const fetchEpisodesDetails = async (episodeId) => {
    try {
      const response = await fetch(
        `https://localhost:7001/api/episodes/${episodeId}`
      );
      const data = await response.json();

      console.log("Fetched Episode Data:", data); // Log to check episode data

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
    console.log("Selected Episode:", episode); // Log to check the clicked episode

    // Check if episode is restricted and user is not a member
    if (episode.isFree === false && !isMember) {
      console.log("Episode is restricted and user is not a member."); // Log if episode is restricted
      // Show subscription modal
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
                  backgroundColor: "black", // Blank black screen initially
                }}
              />
            </div>

            <div className="anime__details__episodes">
              <div className="section-title">
                <h5>{movieData.movie.name} - Episodes</h5>
              </div>
              <div className="episode-list">
                {movieData.episodes.map((episode) => {
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
              <button onClick={() => setShowSubscriptionModal(false)}>
                Cancel
              </button>
              <button onClick={() => navigate("/membership")}>
                Subscribe Now
              </button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="row">
          <div className="col-lg-8">
            <div className="anime__details__review">
              <div className="section-title">
                <h5>Reviews</h5>
              </div>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div className="anime__review__item" key={index}>
                    <div className="anime__review__item__pic">
                      <img
                        src={`img/anime/review-${index + 1}.jpg`}
                        alt="Review"
                      />
                    </div>
                    <div className="anime__review__item__text">
                      <h6>
                        Reviewer Name - <span>{`${index + 1} Hour ago`}</span>
                      </h6>
                      <p>Your review comment here...</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Comment Form */}
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
    </section>
  );
};

export default MovieWatching;
