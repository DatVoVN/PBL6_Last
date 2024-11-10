import "./TrailerModal.css"; // For styling the modal

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;
  const embedUrl = trailerUrl.replace("watch?v=", "embed/");
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="video-container">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Trailer Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
