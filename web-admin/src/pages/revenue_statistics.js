import React, { useState, useContext, useCallback, useEffect } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/rev.css";
import { webSocketContext } from "../context/WebSocketContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RevenueStatistics() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const websocket = useContext(webSocketContext);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeRangeRevenue, setTimeRangeRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isFilterByRange, setIsFilterByRange] = useState(false);

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

  const calculateRevenueInRange = (transactions, start, end) => {
    if (!start || !end) return 0;

    const filteredTransactions = transactions
      .filter((item) => item.status === "shipped")
      .filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return transactionDate >= start && transactionDate <= end;
      });

    return filteredTransactions.reduce(
      (acc, item) => acc + Number(item.totalPrice),
      0
    );
  };

  // Hàm đếm số đơn hàng trong khoảng thời gian
  const calculateOrdersInRange = (transactions, start, end) => {
    if (!start || !end) return 0;

    const filteredTransactions = transactions
      // .filter((item) => item.status === "shipped")
      .filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return transactionDate >= start && transactionDate <= end;
      });

    return filteredTransactions.length;
  };

  const calculateTotalRevenue = (transactions) => {
    const total = transactions
      .filter((item) => item.status === "shipped")
      .reduce((acc, item) => acc + Number(item.totalPrice), 0);
    return total;
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  const getAllPayment = useCallback(async () => {
    try {
      const { status, data } = await axios.get(
        `${json_config[0].url_connect}/pay`
      );
      if (status === 200) {
        setData(data);
        const total = calculateTotalRevenue(data);
        setTotalRevenue(total);

        const rangeRevenue = calculateRevenueInRange(data, startDate, endDate);
        setTimeRangeRevenue(rangeRevenue);

        // Tính số đơn hàng trong khoảng thời gian
        const ordersCount = calculateOrdersInRange(data, startDate, endDate);
        // console.log("Số đơn hàng trong khoảng thời gian:", ordersCount);
        setOrderCount(ordersCount);
      }
    } catch (error) {
      console.log(error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (result) => {
        const data = JSON.parse(result.data);
        if (data.type === "payment") {
          getAllPayment();
        }
      };
    }

    getAllPayment();

    return () => {
      if (websocket) {
        websocket.onmessage = null;
      }
    };
  }, [websocket, getAllPayment]);

  const filteredData = isFilterByRange
    ? data.filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
    : data;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function TransactionModal({ transaction, onClose }) {
    if (!transaction) return null;

    const handleClose = (e) => {
      if (e.target.className === "thongke-modal") {
        onClose();
      }
    };

    return (
      <div className="thongke-modal" onClick={handleClose}>
        <div className="thongke-modal-content">
          {/* <button onClick={onClose} className="thongke-modal-close-btn">×</button> */}
          <h2>Chi Tiết Giao Dịch</h2>
          <div className="thongke-modal-body">
            <div className="thongke-transaction-pay">
              <p>
                <strong>ID nhân viên:</strong>{" "}
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
            <div className="thongke-product-pay">
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
        </div>
      </div>
    );
  }

  return (
    <div className="thongke-container">
      <header className="thongke-header">
        <h1 style={{ fontWeight: "bold" }}>Thống Kê Doanh Thu</h1>
      </header>

      <div>
        {isModalOpen && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={closeModal}
          />
        )}
      </div>

      <div className="thongke-stats-section">
        <div className="thongke-stat-box-date">
          <h3>Doanh Thu Trong Khoảng Thời Gian</h3>
          <div className="thongke-calendar-section">
            <label>Bắt đầu: </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="thongke-date-picker"
            />
            <label>Kết thúc: </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="thongke-date-picker"
            />
            <button
              className="thongke-filter-btn"
              onClick={() => setIsFilterByRange(!isFilterByRange)}
            >
              {isFilterByRange ? "Tắt" : "Lọc"}
            </button>
          </div>
        </div>
        <div className="thongke-stat-box">
          <h3>Tổng Doanh Thu</h3>
          <p>{Number(totalRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>
        <div className="thongke-stat-box">
          <h3>Doanh Thu</h3>
          <p>{Number(timeRangeRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>
        <div className="thongke-stat-box">
          <h3>Đơn hàng</h3>
          <p>{Number(orderCount).toLocaleString("vi-VN")} Đơn</p>
        </div>
      </div>

      <div className="thongke-transactions-section">
        <h2>Danh Sách Giao Dịch</h2>
        <table className="thongke-table">
          <thead>
            <tr>
              <th scope="col">Tên người mua</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Ngày đặt hàng</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.fullname}</td>
                  <td>{item.location}</td>
                  <td>{item.number}</td>
                  <td>{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                  <td>{convertStatus(item.status)}</td>
                  <td>{Number(item.totalPrice).toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    <button
                      onClick={() => openModal(item)}
                      className="thongke-btn-detail"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  Danh sách trống
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="thongke-pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          {"<"}
        </button>
        <span>{currentPage}</span>
        <button
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
