import React from "react";
import { HiTrash } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function DeleteEpisode({ episodeId, onDeleteSuccess }) {
  const MOVIE = import.meta.env.VITE_MOVIE;
  const handleDeleteEpisode = async () => {
    // Lấy authToken từ cookies
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      toast.error("You need to log in to delete an episode.");
      return;
    }

    // Xác nhận việc xóa
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this episode?"
    );
    if (!confirmDelete) return;

    try {
      // Gửi request xóa tập phim
      const response = await axios.delete(
        `${MOVIE}/api/episodes?id=${episodeId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Kiểm tra phản hồi từ API
      if (response.status === 204) {
        toast.success("Episode deleted successfully!");
        console.log("Episode deleted successfully");

        // Gọi hàm callback onDeleteSuccess nếu có
        if (onDeleteSuccess) {
          onDeleteSuccess(episodeId); // Pass episodeId to handle further actions
        }
      } else {
        const errorMessage =
          response.data.Message || "Failed to delete episode.";
        toast.error(errorMessage);
        console.log("Failed to delete episode");
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      const errorMessage =
        error.response?.data?.Message || "Error occurred while deleting.";
      console.error("Error deleting episode:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <HiTrash
      size={20}
      style={{ cursor: "pointer", marginRight: "10px" }}
      onClick={handleDeleteEpisode} // Khi nhấn vào biểu tượng, gọi hàm handleDeleteEpisode
    />
  );
}

export default DeleteEpisode;
