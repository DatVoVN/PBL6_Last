import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Comments.css";

function Comments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [replies, setReplies] = useState({});
  const [visibleChildComments, setVisibleChildComments] = useState({});
  const [commentsToShow, setCommentsToShow] = useState(10);
  const [replyingTo, setReplyingTo] = useState(null);
  const REACTION = import.meta.env.VITE_REACTION;

  // Fetch comments when the component mounts or movieId changes
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${REACTION}/api/comments?movieId=${movieId}&PageNumber=1&PageSize=25`
      );

      const { result } = response.data;

      if (result && Array.isArray(result.records)) {
        const sortedComments = result.records.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } else {
        setError("Invalid data format received from the API.");
      }
    } catch (err) {
      setError("Failed to load comments. Please try again later.");
      console.error(
        "Error fetching comments:",
        err.response?.data || err.message
      );
    }
  };

  // Submit a new comment or reply
  const handleCommentSubmit = async (e, parentId = null) => {
    e.preventDefault();

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
      commentParentId: parentId,
      userId,
      userName,
      movieId,
      commentContent: parentId ? replies[parentId] : commentContent,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${REACTION}/api/comments`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Update state after comment submission
      if (parentId) {
        setReplies((prevReplies) => {
          const updatedReplies = { ...prevReplies };
          delete updatedReplies[parentId];
          return updatedReplies;
        });
      } else {
        setCommentContent("");
      }

      setReplyingTo(null);

      // After posting the comment, fetch the updated comments
      fetchComments();
    } catch (error) {
      console.error(
        "Error posting comment:",
        error.response?.data || error.message
      );
      alert("Failed to post comment. Please try again.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const toggleChildComments = (commentId) => {
    setVisibleChildComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const loadMoreComments = () => {
    setCommentsToShow((prev) => prev + 5);
  };

  const renderComments = (commentsList, parentId = null) => {
    const childComments = commentsList.filter(
      (comment) => comment.commentParentId === parentId
    );

    if (childComments.length === 0) {
      return null;
    }

    return childComments.map((comment) => {
      const isChildComment = parentId !== null;

      return (
        <div
          key={comment.commentId}
          style={{ marginLeft: isChildComment ? "20px" : "0" }}>
          <div className="anime__review__item">
            <div className="anime__review__item__pic">
              <img
                style={{ borderRadius: "50%" }}
                src={comment.avatar || `/public/img/avatar.jpg`}
                alt="Review"
              />
            </div>
            <div className="anime__review__item__text">
              <h6>
                {comment.fullName} -{" "}
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </h6>
              <p>{comment.commentContent}</p>

              {parentId === null && childComments.length > 0 && (
                <button onClick={() => toggleChildComments(comment.commentId)}>
                  {visibleChildComments[comment.commentId]
                    ? "Hide Replies"
                    : "Show Replies"}
                </button>
              )}

              {parentId === null && (
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment.commentId
                        ? null
                        : comment.commentId
                    )
                  }>
                  {replyingTo === comment.commentId ? "Cancel Reply" : "Reply"}
                </button>
              )}
            </div>
          </div>

          {replyingTo === comment.commentId && (
            <form
              className="form_area"
              onSubmit={(e) => handleCommentSubmit(e, comment.commentId)}>
              <textarea
                className="text_area"
                placeholder="Your Reply"
                value={replies[comment.commentId] || ""}
                onChange={(e) =>
                  setReplies((prevReplies) => ({
                    ...prevReplies,
                    [comment.commentId]: e.target.value,
                  }))
                }
                required
              />
              <button type="submit">Reply</button>
            </form>
          )}

          {visibleChildComments[comment.commentId] &&
            renderComments(commentsList, comment.commentId)}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="section-title">
        <h5 style={{ marginTop: "20px", marginBottom: "20px" }}>Reviews</h5>
        {comments.length === 0 ? (
          <p>No comments available!</p>
        ) : (
          renderComments(comments.slice(0, commentsToShow))
        )}
        {comments.length > commentsToShow && (
          <button onClick={loadMoreComments} className="load-more-btn">
            Load More
          </button>
        )}
        <div className="anime__details__form" style={{ marginRight: "20px" }}>
          <div className="section-title">
            <h5 style={{ marginTop: "20px", marginBottom: "10px" }}>
              Your Comment
            </h5>
          </div>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              style={{ color: "black" }}
              placeholder="Your Comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
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
