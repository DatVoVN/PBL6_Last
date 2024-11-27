import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function Comments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Get userId, userName, and authToken from cookies using js-cookie
    const userId = Cookies.get("userId");
    const userName = Cookies.get("fullName");
    const authToken = Cookies.get("authToken");

    if (!userId || !userName || !authToken) {
      alert(
        "User information or authentication token is missing. Please log in."
      );
      return;
    }

    const data = {
      commentId: 0,
      commentParentId: 0,
      userId,
      userName,
      movieId,
      commentContent,
      createdAt: new Date().toISOString(),
    };

    console.log("Comment data being sent:", data);

    try {
      const response = await axios.post(
        "https://cineworld.io.vn:7003/api/comment",
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCommentContent("");

      // Immediately add the new comment to the top of the list
      setComments((prevComments) => {
        // Add new comment to the front of the existing comments list
        const newComments = [data, ...prevComments];

        // Sort comments by createdAt in descending order to ensure new comments are at the top
        return newComments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch comments from the API when the component mounts
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://cineworld.io.vn:7003/api/comment/GetCommentByFilm/${movieId}`
        );

        console.log("API Response:", response.data);

        if (Array.isArray(response.data.result)) {
          // Sort the comments by 'createdAt' in descending order to show newest comments first
          const sortedComments = response.data.result.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setComments(sortedComments.slice(0, 7)); // Load only first 7 comments
        } else {
          setError("Invalid data format received from the API.");
        }
      } catch (err) {
        setError("Failed to load comments. Please try again later.");
        console.error(err);
      }
    };

    fetchComments();
  }, [movieId]);

  return (
    <div>
      <div className="section-title">
        <h5 style={{ marginTop: "20px" }}>Reviews</h5>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {comments.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            comments.map((comment, index) => (
              <div className="anime__review__item" key={index}>
                <div className="anime__review__item__pic">
                  <img
                    style={{ borderRadius: "50%" }}
                    src={comment.avatarUrl || `/public/img/avatar.jpg`}
                    alt="Review"
                  />
                </div>
                <div className="anime__review__item__text">
                  <h6>
                    {comment.userName} -{" "}
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </h6>
                  <p>{comment.commentContent}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment form */}
        <div className="anime__details__form">
          <div className="section-title">
            <h5 style={{ marginTop: "20px", marginBottom: "10px" }}>
              Your Comment
            </h5>
          </div>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Your Comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required></textarea>
            <button type="submit">
              <i className="fa fa-location-arrow"></i> Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comments;
