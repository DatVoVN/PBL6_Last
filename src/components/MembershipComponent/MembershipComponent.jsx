import React, { useState } from "react";
import { HiFire } from "react-icons/hi";
import axios from "axios";
import Cookies from "js-cookie";

const MembershipComponent = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [firstSubscriptionDate, setFirstSubscriptionDate] = useState("");
  const [renewalStartDate, setRenewalStartDate] = useState("");
  const [memberType, setMemberType] = useState("Consecutive Member");
  const [loading, setLoading] = useState(false);
  const [membershipData, setMembershipData] = useState(null);

  const handleCheckMembership = async () => {
    try {
      const response = await axios.get(
        `https://cineworld.io.vn:7002/api/memberships/${user.email}`
      );
      if (response.status === 200 && response.data.result) {
        const data = response.data.result;
        setMembershipData(data);
        setExpirationDate(data.expirationDate);
        setFirstSubscriptionDate(data.firstSubscriptionDate);
        setRenewalStartDate(data.renewalStartDate);
        setMemberType(data.memberType);
        setShowModal(true); // Show modal for updating membership
      }
    } catch (error) {
      // Log error response in case of failure
      console.error(
        "Error when checking membership:",
        error.response || error.message
      );
      if (error.response) {
        setMembershipData(null); // Make sure it's set to null to indicate new membership
        setShowModal(true); // Show modal for creating new membership
        console.log("Error response data:", error.response.data); // Log the response data
        console.log("Error status:", error.response.status); // Log the status code
        console.log("Error message:", error.response.statusText); // Log the error message
      }
    }
  };

  // Hàm tạo thành viên mới
  const handleCreateMembership = async () => {
    setLoading(true);
    try {
      const body = {
        memberShipId: 0,
        userId: user.id,
        userEmail: user.email,
        memberType: memberType,
        firstSubscriptionDate:
          firstSubscriptionDate || new Date().toISOString(),
        renewalStartDate: renewalStartDate || new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString(),
        expirationDate: expirationDate || new Date().toISOString(),
      };

      const authToken = Cookies.get("authToken");

      const response = await axios.post(
        "https://cineworld.io.vn:7002/api/memberships",
        body,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        alert("Đăng ký thành viên thành công!");
        setShowModal(false);
      } else {
        console.log("Unexpected status code:", response.status); // Log unexpected status codes
        alert("Đăng ký thất bại!");
      }
    } catch (error) {
      // Log the error details if an exception occurs
      console.error("Error occurred while creating membership:", error);

      if (error.response) {
        // If the error is a response error, log the full response
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // If the error is due to no response, log the request
        console.error("Error request:", error.request);
      } else {
        // General error if no specific details are available
        console.error("Error message:", error.message);
      }

      alert("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật thông tin thành viên
  const handleUpdateMembership = async () => {
    setLoading(true);
    try {
      const body = {
        memberShipId: membershipData.memberShipId,
        userId: membershipData.userId,
        userEmail: membershipData.userEmail,
        memberType: memberType,
        firstSubscriptionDate: firstSubscriptionDate,
        renewalStartDate: renewalStartDate,
        lastUpdatedDate: new Date().toISOString(),
        expirationDate: expirationDate,
      };

      const authToken = Cookies.get("authToken");

      const response = await axios.put(
        "https://cineworld.io.vn:7002/api/memberships",
        body,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Gửi token trong header
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Cập nhật thành viên thành công!");
        setShowModal(false); // Đóng modal
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thành viên:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HiFire
        size={20}
        style={{ marginRight: "10px", cursor: "pointer" }}
        onClick={handleCheckMembership}
      />

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}>
            <h2>
              {membershipData ? "Cập nhật Membership" : "Đăng ký Membership"}
            </h2>
            {!membershipData && (
              <>
                <label>
                  Loại thành viên:
                  <select
                    value={memberType}
                    onChange={(e) => setMemberType(e.target.value)}>
                    <option value="Consecutive Member">
                      Consecutive Member
                    </option>
                    <option value="Lifetime Member">Lifetime Member</option>
                  </select>
                </label>

                <label>
                  Ngày đăng ký:
                  <input
                    type="datetime-local"
                    value={firstSubscriptionDate}
                    onChange={(e) => setFirstSubscriptionDate(e.target.value)}
                  />
                </label>

                <label>
                  Ngày bắt đầu gia hạn:
                  <input
                    type="datetime-local"
                    value={renewalStartDate}
                    onChange={(e) => setRenewalStartDate(e.target.value)}
                  />
                </label>
              </>
            )}
            <label>
              Ngày hết hạn:
              <input
                type="datetime-local"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </label>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#ccc",
                }}>
                Hủy
              </button>
              <button
                onClick={
                  membershipData
                    ? handleUpdateMembership
                    : handleCreateMembership
                }
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: loading ? "#ccc" : "#4CAF50",
                  color: "white",
                }}>
                {loading
                  ? "Đang xử lý..."
                  : membershipData
                  ? "Cập nhật"
                  : "Đăng ký"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipComponent;
