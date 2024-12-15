import React, { useContext, useEffect, useState, useCallback } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/confirm.css";
import { webSocketContext } from "../context/WebSocketContext";

export default function PetCare() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const websocket = useContext(webSocketContext);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const confirmed = response.filter((item) => item.status === "successPet").length;
        const pending = response.filter((item) => item.status === "pendingPet").length;

        setTotalConfirmed(confirmed);
        setTotalPending(pending);
        setData(response.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

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
              <p><strong>Số điện thoại:</strong> {transaction.phone}</p>
              <p><strong>Tên thú cưng:</strong> {transaction.namePet}</p>
              <p><strong>Trạng thái:</strong> {convertStatus(transaction.status)}</p>
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

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="confirm-container">
      <header className="confirm-header">
        <h1 style={{ fontWeight: "bold" }}>Xác nhận dịch vụ</h1>
      </header>

      <div className="confirm-summary" style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div className="confirm-summary-box" style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <p><strong>Tổng số dịch vụ đã xác nhận:</strong> {totalConfirmed}</p>
        </div>
        <div className="confirm-summary-box" style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <p><strong>Tổng số dịch vụ đang chờ xác nhận:</strong> {totalPending}</p>
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
        <span style={{ margin: "0 10px" }}>{currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
          &gt;
        </button>
      </div>
    </div>
  );
}
