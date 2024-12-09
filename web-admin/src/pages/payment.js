import React, { useContext, useEffect, useState, useCallback } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/confirm.css";
import { webSocketContext } from "../context/WebSocketContext";

export default function Payment() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({});

  const websocket = useContext(webSocketContext);

  const userId = window.localStorage.getItem("@adminId");

  // Hàm chuyển đổi trạng thái sang ngôn ngữ dễ hiểu
  function convertStatus(status) {
    switch (status) {
      case "reject":
        return "Đơn hàng bị hủy";
      case "success":
        return "Đang chuẩn bị hàng";
      case "pending":
        return "Đang chờ xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "shipped":
        return "Giao hàng thành công";
      default:
        return "";
    }
  }

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
  }, []);

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
          <h2 className="confirm-texth2">Chi Tiết Đơn Hàng</h2>
          <div className="confirm-modal-body">
            <div className="confirm-transaction-pay">
              <p>
                <strong>ID hoá đơn:</strong> {transaction._id}
              </p>
              <p>
                <strong>Họ tên:</strong> {transaction.fullname}
              </p>
              <p>
                <strong>Email:</strong> {transaction.email}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {transaction.location}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {transaction.number}
              </p>
              <p>
                <strong>Phương thức vận chuyển:</strong> {transaction.ship}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {transaction.paymentMethod}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {Number(transaction.totalPrice).toLocaleString("vi-VN")} VNĐ
              </p>
              <p>
                <strong>Trạng thái:</strong> {convertStatus(transaction.status)}
              </p>
            </div>
            <div className="confirm-product-pay">
              <ul>
                {transaction.products.map((product, index) => (
                  <li key={index}>
                    <p>
                      <strong>Sản phẩm: </strong>
                    </p>
                    <img
                      src={product.image}
                      height={100}
                      width={100}
                      alt={product.name}
                    />
                    <p>
                      <strong>Tên sản phẩm: </strong>
                      {product.name}
                    </p>
                    <p>
                      <strong>Giá: </strong>
                      {Number(product.price).toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p>
                      <strong>Kích thước: </strong>
                      {product.size}
                    </p>
                    <p>
                      <strong>Số lượng: </strong>
                      {product.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p>
              <strong>Xác nhận</strong>
            </p>
            <table className="confirm-table">
              <thead>
                <tr>
                  <th scope="col">Xác nhận đơn hàng</th>
                  <th scope="col">Đang giao</th>
                  <th scope="col">Đã giao</th>
                  <th scope="col">Hủy đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr key={transaction._id}>
                  <td>
                    <button
                      disabled={
                        transaction.status === "reject" ||
                        transaction.status !== "pending"
                      }
                      onClick={async () => {
                        const resultCheck = window.confirm("Confirm payment?");
                        if (resultCheck) {
                          const {
                            status,
                            data: { response, type },
                          } = await axios.post(
                            `${json_config[0].url_connect}/pay/update`,
                            {
                              id: transaction._id,
                              email: transaction.email,
                              products: transaction.products,
                              status: "success",
                              idStaff: userId,
                              nameStaff: user.fullname,
                            }
                          );

                          if (status === 200) {
                            window.alert(response);
                            if (type) getAllPayment(); // Cập nhật dữ liệu khi thành công
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
                        transaction.status === "reject" ||
                        transaction.status === "pending" ||
                        transaction.status !== "success"
                      }
                      onClick={async () => {
                        const resultCheck = window.confirm("Confirm payment?");
                        if (resultCheck) {
                          const {
                            status,
                            data: { response, type },
                          } = await axios.post(
                            `${json_config[0].url_connect}/pay/update`,
                            {
                              id: transaction._id,
                              email: transaction.email,
                              products: transaction.products,
                              status: "shipping",
                              idStaff: userId,
                              nameStaff: user.fullname,
                            }
                          );

                          if (status === 200) {
                            window.alert(response);
                            if (type) getAllPayment(); // Cập nhật dữ liệu khi thành công
                            closeModal();
                          }
                        }
                      }}
                      className="confirm-btn btn-primary"
                    >
                      Giao hàng
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={
                        transaction.status === "reject" ||
                        transaction.status === "pending" ||
                        transaction.status !== "shipping"
                      }
                      onClick={async () => {
                        const resultCheck = window.confirm("Confirm payment?");
                        if (resultCheck) {
                          const {
                            status,
                            data: { response, type },
                          } = await axios.post(
                            `${json_config[0].url_connect}/pay/update`,
                            {
                              id: transaction._id,
                              email: transaction.email,
                              products: transaction.products,
                              status: "shipped",
                              idStaff: userId,
                              nameStaff: user.fullname,
                            }
                          );

                          if (status === 200) {
                            window.alert(response);
                            if (type) getAllPayment(); // Cập nhật dữ liệu khi thành công
                            closeModal();
                          }
                        }
                      }}
                      className="confirm-btn btn-primary"
                    >
                      Đã giao
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={
                        transaction.status === "reject" ||
                        transaction.status === "shipped" ||
                        transaction.status === "shipping"
                      }
                      onClick={async () => {
                        const resultCheck = window.confirm("Reject payment?");
                        if (resultCheck) {
                          const {
                            status,
                            data: { response, type },
                          } = await axios.post(
                            `${json_config[0].url_connect}/pay/update`,
                            {
                              id: transaction._id,
                              email: transaction.email,
                              products: transaction.products,
                              status: "reject",
                              idStaff: userId,
                              nameStaff: user.fullname,
                            }
                          );

                          if (status === 200) {
                            window.alert(response);
                            if (type) getAllPayment(); // Cập nhật dữ liệu khi thành công
                            closeModal();
                          }
                        }
                      }}
                      className="confirm-btn btn-secondary"
                    >
                      Hủy đơn
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

  // Lấy dữ liệu thanh toán
  const getAllPayment = useCallback(async () => {
    try {
      const { status, data } = await axios.get(
        `${json_config[0].url_connect}/pay`
      );
      if (status === 200) {
        setData(data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Thiết lập WebSocket và lắng nghe tin nhắn
  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (result) => {
        const data = JSON.parse(result.data);
        if (data.type === "payment") {
          getAllPayment(); // Gọi lại getAllPayment khi nhận được thông báo từ WebSocket
        }
      };
    }

    // Lấy dữ liệu thanh toán khi component mount
    getAllPayment();

    // Cleanup WebSocket khi component unmount
    return () => {
      if (websocket) {
        websocket.onmessage = null; // Hủy lắng nghe sự kiện message khi component unmount
      }
    };
  }, [websocket, getAllPayment]); // Chạy lại nếu websocket hoặc getAllPayment thay đổi

  return (
    <div className="confirm-container">
      <header className="confirm-header">
        <h1>Đơn hàng đã đặt</h1>
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
            <th scope="col">Tên người mua</th>
            <th scope="col">Địa chỉ</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Sản phẩm</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.fullname}</td>
              <td>{item.location}</td>
              <td>{item.number}</td>
              <td>{convertStatus(item.status)}</td>
              <td>
                <button
                  onClick={() => openModal(item)}
                  className="confirm-btn-detail"
                >
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
