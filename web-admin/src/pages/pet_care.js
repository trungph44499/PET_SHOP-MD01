import React, { useContext, useEffect, useState, useCallback } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/confirm.css";
import { webSocketContext } from "../context/WebSocketContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PetCare() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const itemsPerPage = 10;
  const websocket = useContext(webSocketContext);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = window.localStorage.getItem("@adminId");

  const convertStatus = (status) => {
    let statusResult = "";
    switch (status) {
      case "rejectPet":
        statusResult = "Đã từ chối";
        break;
      case "successPet":
        statusResult = "Đã xác nhận";
        break;
      case "pendingPet":
        statusResult = "Chờ xác nhận";
        break;
      default:
        break;
    }
    return statusResult;
  };

  const getAllPetCare = useCallback(async () => {
    try {
      const {
        status,
        data: { response },
      } = await axios.get(`${json_config[0].url_connect}/pet-care`);
      if (status === 200) {
        // const confirmed = response.filter((item) => item.status === "successPet").length;
        // const pending = response.filter((item) => item.status === "pendingPet").length;

        // setTotalConfirmed(confirmed);
        // setTotalPending(pending);
        setData(response.reverse());
        setFilteredData(response);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const getAdminById = async (id) => {
      try {
        const response = await axios.get(
          `${json_config[0].url_connect}/admin/${id}`
        );
        if (response.data.response) {
          setUser(response.data.response);
        } else {
          console.log(response.data.response); // In ra thông báo lỗi nếu không tìm thấy admin
        }
      } catch (error) {
        console.error("Error fetching admin by ID:", error); // In lỗi nếu có
      }
    };
    getAdminById(userId);
  }, [userId]);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = function (result) {
        const data = JSON.parse(result.data);

        if (data.type === "pet-care") {
          getAllPetCare();
        }
      };
    }

    getAllPetCare();

    return () => {
      if (websocket) {
        websocket.onmessage = null;
      }
    };
  }, [websocket, getAllPetCare]);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  function TransactionModal({ transaction, onClose }) {
    if (!transaction) return null;

    const handleClose = (e) => {
      if (e.target.className === "confirm-modal") {
        onClose();
      }
    };

    return (
      <div className="confirm-modal" onClick={handleClose}>
        <div className="confirm-modal-content">
          <h2 className="confirm-texth2">Chi Tiết Dịch Vụ</h2>
          <div className="confirm-modal-body">
            <div className="confirm-transaction-pay">
              <p><strong>ID dịch vụ:</strong> {transaction._id}</p>
              <p><strong>Dịch vụ:</strong> {transaction.service}</p>
              <p><strong>Họ tên:</strong> {transaction.name}</p>
              <p><strong>Email:</strong> {transaction.email}</p>
              <p><strong>Địa chỉ:</strong> {transaction.message}</p>
              <p><strong>Thời Gian Đặt:</strong> {new Date(transaction.createdAt).toLocaleString("vi-VN")}</p>
              <p><strong>Số điện thoại:</strong> {transaction.phone}</p>
              <p><strong>Tên thú cưng:</strong> {transaction.namePet}</p>
              <p><strong>Trạng thái:</strong> {convertStatus(transaction.status)}</p>
              <p>
                <strong>ID người xác nhận:</strong>{" "}
                {transaction.idStaff
                  ? transaction.idStaff
                  : "Chưa có người xác nhận"}
              </p>
              <p>
                <strong>Người xác nhận:</strong>{" "}
                {transaction.nameStaff
                  ? transaction.nameStaff
                  : "Chưa có người xác nhận"}
              </p>
            </div>
          </div>
          <div>
            <p><strong>Xác nhận</strong></p>
            <table className="confirm-table">
              <thead>
                <tr>
                  <th scope="col">Chờ xác nhận</th>
                  <th scope="col">Đã hủy</th>
                </tr>
              </thead>
              <tbody>
                <tr key={transaction._id}>
                  <td>
                    <button
                      disabled={
                        transaction.status === "rejectPet" || transaction.status === "successPet"
                      }
                      onClick={async function () {
                        const resultCheck = window.confirm("Confirm payment?");
                        if (resultCheck) {
                          const {
                            status,
                            data: { response, type },
                          } = await axios.post(
                            `${json_config[0].url_connect}/pet-care/update`,
                            {
                              id: transaction._id,
                              email: transaction.email,
                              service: transaction.service,
                              status: "successPet",
                              idStaff: userId,
                              nameStaff: user.fullname,
                            }
                          );

                          if (status === 200) {
                            window.alert(response);
                            if (type) getAllPetCare();
                            closeModal();
                          }
                        }
                      }}
                      className="confirm-btn btn-primary"
                    >
                      Xác nhận
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={
                        transaction.status === "rejectPet" || transaction.status === "successPet"
                      }
                      onClick={async function () {
                        const resultCheck = window.confirm("Reject payment?");
                        if (resultCheck) {
                          const {
                            status,
                            data: { response, type },
                          } = await axios.post(
                            `${json_config[0].url_connect}/pet-care/update`,
                            {
                              id: transaction._id,
                              email: transaction.email,
                              service: transaction.service,
                              status: "rejectPet",
                              idStaff: userId,
                              nameStaff: user.fullname,
                            }
                          );

                          if (status === 200) {
                            window.alert(response);
                            if (type) getAllPetCare();
                            closeModal();
                          }
                        }
                      }}
                      className="confirm-btn btn-secondary"
                    >
                      Hủy dịch vụ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const filterByDateAndStatus = (startDate, endDate, status) => {
    if (!startDate || !endDate) {
      return [];
    }

    // Lọc theo ngày
    const filteredByDate = data.filter((item) => {
      const transactionDate = new Date(item.createdAt); // Chuyển đổi createdAt thành đối tượng Date
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Lọc theo trạng thái
    const filteredByStatus = filteredByDate.filter((item) => item.status === status);

    return filteredByStatus;
  };

  const filterByDate = () => {
    if (!startDate || !endDate) {
      return;
    }

    const filtered = data.filter((item) => {
      const transactionDate = new Date(item.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const filteredConfirmed = filterByDateAndStatus(startDate, endDate, "successPet");
    const filteredPending = filterByDateAndStatus(startDate, endDate, "pendingPet");

    setTotalConfirmed(filteredConfirmed.length);
    setTotalPending(filteredPending.length);
    setFilteredData([...filteredConfirmed, ...filteredPending]); // Hiển thị tất cả dịch vụ đã xác nhận và đang chờ

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const refreshFilters = () => {
    setTotalConfirmed(0);
    setTotalPending(0);
    setStartDate(null);
    setEndDate(null);
    setFilteredData(data);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="confirm-container">
      <header className="confirm-header">
        <h1 style={{ fontWeight: "bold" }}>Xác nhận dịch vụ</h1>
      </header>

      <div className="confirm-summary" style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div className="confirm-filter-container">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Ngày bắt đầu"
            dateFormat="dd/MM/yyyy"
            className="confirm-date-picker"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Ngày kết thúc"
            dateFormat="dd/MM/yyyy"
            className="confirm-date-picker"
          />
          <button onClick={filterByDate} className="confirm-btn btn-primary">Lọc</button>
          <button onClick={refreshFilters} className="confirm-btn btn-secondary">Làm mới</button>
        </div>
        <div className="confirm-summary-box">
          <p><strong>Số dịch vụ đã xác nhận:</strong></p>
          <p><strong>{totalConfirmed}</strong></p>
        </div>
        <div className="confirm-summary-box">
          <p><strong>Số dịch vụ đang chờ xác nhận:</strong></p>
          <p><strong>{totalPending}</strong></p>
        </div>
      </div>

      <div>
        {isModalOpen && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={closeModal}
          />
        )}
      </div>

      <table className="confirm-table">
        <thead>
          <tr>
            <th scope="col">Tên người dùng</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Địa chỉ</th>
            <th scope="col">Ngày đặt</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Dịch vụ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.message}</td>
              <td>{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
              <td>{convertStatus(item.status)}</td>
              <td>
                <button onClick={() => openModal(item)} className="confirm-btn-detail">
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">
          &lt;
        </button>
        <span style={{ margin: "0 10px" }}>Trang {currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
          &gt;
        </button>
      </div>
    </div>
  );
}
