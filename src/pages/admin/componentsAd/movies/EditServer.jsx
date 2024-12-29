import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

const EditServerModal = ({ episodeId, serverId, onClose }) => {
  const [serverData, setServerData] = useState({
    serverId: serverId || 0,
    episodeId: episodeId || 0,
    name: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken = Cookies.get("authToken");
  const MOVIE = import.meta.env.VITE_MOVIE;
  const fetchServerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${MOVIE}/api/servers/${serverId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { isSuccess, result } = response.data;
      if (isSuccess) {
        setServerData(result);
      } else {
        setError("Failed to fetch server details.");
      }
    } catch (err) {
      setError("An error occurred while fetching server details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${MOVIE}/api/servers`, serverData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 204) {
        toast.success("Server updated successfully!");
        onClose();
      } else {
        setError("Failed to update server.");
      }
    } catch (err) {
      setError("An error occurred while updating the server.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServerDetails();
  }, [serverId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-server-modal">
      <ToastContainer autoClose={2000} />
      <div className="modal-content">
        <h3>Edit Server</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Server Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={serverData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Server Link</label>
            <input
              type="text"
              id="link"
              name="link"
              value={serverData.link}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              Save Changes
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServerModal;
