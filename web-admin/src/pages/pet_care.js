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
        setData(response.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // Kiểm tra xem WebSocket đã được khởi tạo chưa
    if (websocket) {
      // Lắng nghe sự kiện message từ WebSocket
      websocket.onmessage = function (result) {
        const data = JSON.parse(result.data);

        if (data.type === "pet-care") {
          getAllPetCare();
        }
      };
    }

    // Gọi hàm lấy dữ liệu khi component mount
    getAllPetCare();

    // Clean up WebSocket khi component unmount
    return () => {
      if (websocket) {
        websocket.onmessage = null; // Hủy lắng nghe sự kiện message khi component unmount
      }
    };
  }, [websocket, getAllPetCare]); // Chạy khi websocket hoặc getAllPetCare thay đổi

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

  return (
    <div className="confirm-container">
      <header className="confirm-header">
        <h1>Xác nhận dịch vụ</h1>
      </header>
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
            {/* <th scope="col">Chờ xác nhận</th>
            <th scope="col">Đã hủy</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
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
    </div>
  );
}
