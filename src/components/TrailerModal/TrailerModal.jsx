import "./TrailerModal.css"; // For styling the modal

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;
  const embedUrl = trailerUrl.replace("watch?v=", "embed/");
  return (
    <div className="modal-overlay">
      <button className="close-btn2" onClick={onClose}>
        &times;
      </button>
      <div className="modal-content2">
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
