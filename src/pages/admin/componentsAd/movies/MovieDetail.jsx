import React from "react";

const MovieDetail = ({ movie }) => {
  if (!movie) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "20px",
          color: "red",
        }}>
        Movie not found!
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        height: "100vh", // Đặt chiều cao cố định
        overflow: "hidden", // Thêm thanh cuộn khi nội dung vượt quá
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "1200px",
          overflow: "hidden",
        }}>
        <div style={{ flex: "1" }}>
          <img
            src={movie.imageUrl}
            alt={movie.name}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            flex: "2",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto", // Cho phép cuộn dọc nội dung
            maxHeight: "calc(100vh - 80px)", // Giới hạn chiều cao nội dung
          }}>
          <h2 style={{ marginBottom: "10px", fontSize: "24px", color: "#333" }}>
            {movie.name}
          </h2>
          <p>
            <strong>Original Name:</strong> {movie.originName}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {movie.description.replace(/&quot;/g, '"')}
          </p>
          <p>
            <strong>Category:</strong> {movie.categoryName}
          </p>
          <p>
            <strong>Country:</strong> {movie.countryName}
          </p>
          <p>
            <strong>Genres:</strong>
            <span
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
              }}>
              {movie.genres?.length > 0
                ? movie.genres.map((genre) => (
                    <span
                      key={genre.name}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#efefef",
                        borderRadius: "12px",
                        fontSize: "14px",
                      }}>
                      {genre.name}
                    </span>
                  ))
                : "N/A"}
            </span>
          </p>
          <p>
            <strong>Year:</strong> {movie.year}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: movie.status ? "green" : "red",
                fontWeight: "bold",
              }}>
              {movie.status ? "Active" : "Inactive"}
            </span>
          </p>
          <p>
            <strong>Duration:</strong> {movie.duration}
          </p>
          <p>
            <strong>Views:</strong> {movie.view}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
