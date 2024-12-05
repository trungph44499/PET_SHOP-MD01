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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [isFilterByDate, setIsFilterByDate] = useState(false);

  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");

  function convertStatus(status) {
    switch (status) {
      case "reject":
        return "Đã từ chối";
      case "success":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "shipping":
        return "Đang giao";
      case "shipped":
        return "Đã giao";
      default:
        return "";
    }
  }

  const calculateRevenueInRange = (transactions, start, end) => {
    if (!start || !end) return 0;

    const filteredTransactions = transactions
      .filter((item) => item.status === "success")
      .filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return transactionDate >= start && transactionDate <= end;
      });

    return filteredTransactions.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const calculateMonthlyRevenue = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((item) => {
      const transactionDate = new Date(item.createdAt);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear &&
        item.status === "success"
      );
    });

    return monthlyTransactions.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const calculateDailyRevenue = (transactions, date) => {
    if (!date) return 0;

    const filteredTransactions = transactions
      .filter((item) => item.status === "shipping")
      .filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return (
          transactionDate.toDateString() === date.toDateString()
        );
      });

    return filteredTransactions.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const calculateTotalRevenue = (transactions) => {
    const total = transactions
      .filter((item) => item.status === "success")
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
      const { status, data } = await axios.get(`${json_config[0].url_connect}/pay`);
      if (status === 200) {
        setData(data);
        const total = calculateTotalRevenue(data);
        setTotalRevenue(total);

        const rangeRevenue = calculateRevenueInRange(data, startDate, endDate);
        setTimeRangeRevenue(rangeRevenue);

        const dailyTotal = calculateDailyRevenue(data, selectedDate);
        setDailyRevenue(dailyTotal);

        const monthlyTotal = calculateMonthlyRevenue(data);
        setMonthlyRevenue(monthlyTotal);

        const now = new Date();
        setCurrentMonth(`${now.getMonth() + 1}/${now.getFullYear()}`);
      }
    } catch (error) {
      console.log(error);
    }
  }, [startDate, endDate, selectedDate]);



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

  const filteredData = isFilterByDate
    ? data.filter((item) => {
      const transactionDate = new Date(item.createdAt);
      return transactionDate.toDateString() === selectedDate.toDateString();
    })
    : data;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
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
      if (e.target.className === "modal") {
        onClose();
      }
    };

    return (
      <div className="modal" onClick={handleClose}>
        <div className="modal-content">
          <h2 className="texth2">Chi Tiết Giao Dịch</h2>
          <div className="modal-body">
            <div className="transaction-info">
              <p><strong>ID:</strong> {transaction._id}</p>
              <p><strong>Fullname:</strong> {transaction.fullname}</p>
              <p><strong>Email:</strong> {transaction.email}</p>
              <p><strong>Location:</strong> {transaction.location}</p>
              <p><strong>Phone:</strong> {transaction.number}</p>
              <p><strong>Ship:</strong> {transaction.ship}</p>
              <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
              <p><strong>Total Price:</strong> {Number(transaction.totalPrice).toLocaleString("vi-VN")} VNĐ</p>
              <p><strong>Status:</strong> {convertStatus(transaction.status)}</p>
            </div>
            <div className="product-info">
              <ul>
                {transaction.products.map((product, index) => (
                  <li key={index}>
                    <p><strong>Tên sản phẩm: </strong>{product.name}</p>
                    <p><strong>Giá: </strong>{Number(product.price).toLocaleString("vi-VN")} VNĐ</p>
                    <p><strong>Kích thước: </strong>{product.size}</p>
                    <p><strong>Số lượng: </strong>{product.quantity}</p>
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
    <div className="container">
      <header className="header">
        <h1>Thống Kê</h1>
      </header>

      <div>
        {isModalOpen && (
          <TransactionModal
            transaction={selectedTransaction}
            onClose={closeModal}
          />
        )}
      </div>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Tổng Doanh Thu</h3>
          <p>{Number(totalRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>

        <div className="stat-box">
          <h3>Doanh Thu Trong Khoảng Thời Gian</h3>
          <div className="calendar-section">
            <label>Bắt đầu: </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
            <label>Kết thúc: </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
          </div>
          <p>{Number(timeRangeRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>

        <div className="stat-box">
          <h3>
            Doanh Thu Hàng Tháng
            <span style={{ fontSize: "0.8em", fontWeight: "normal" }}>
              (Tháng {currentMonth})
            </span>
          </h3>
          <p>{Number(monthlyRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>

      </div>
      

      <div className="transactions-section">
        <h2>Danh Sách Giao Dịch</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Location</th>
              <th scope="col">Phone</th>
              <th scope="col">Product</th>
              <th scope="col">Order Date</th>
              <th scope="col">Status</th>
              <th scope="col">Total amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.email}</td>
                  <td>{item.location}</td>
                  <td>{item.number}</td>
                  <td>{item.products.map((e) => `${e.name}, `)}</td>
                  <td>{new Date(item.createdAt).toLocaleString("vi-VN")}</td>
                  <td>{convertStatus(item.status)}</td>
                  <td>{Number(item.totalPrice).toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    <button onClick={() => openModal(item)} className="btn-detail">
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                  Danh sách trống
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          {"<"}
        </button>
        <span>{currentPage}</span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
          {">"}
        </button>
      </div>
    </div>
  );
}
