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
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyRevenue, setDailyRevenue] = useState(0);

  const calculateDailyRevenue = (transactions, date) => {
    if (!date) return 0;

    const filteredTransactions = transactions
      .filter((item) => item.status === "success")
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

  const calculateMonthlyRevenue = (transactions, month) => {
    if (month === null) return 0;

    const year = new Date().getFullYear();
    const filteredTransactions = transactions
      .filter((item) => item.status === "success")
      .filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
      });

    return filteredTransactions.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const calculateYearlyRevenue = (transactions, year) => {
    const filteredTransactions = transactions
      .filter((item) => item.status === "success")
      .filter((item) => {
        const transactionDate = new Date(item.createdAt);
        return transactionDate.getFullYear() === year;
      });

    return filteredTransactions.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  function convertStatus(status) {
    switch (status) {
      case "reject":
        return "Đã từ chối";
      case "success":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      default:
        return "";
    }
  }

  const getAllPayment = useCallback(async () => {
    try {
      const { status, data } = await axios.get(`${json_config[0].url_connect}/pay`);
      if (status === 200) {
        setData(data);
        const total = calculateTotalRevenue(data);
        setTotalRevenue(total);
        const monthlyTotal = calculateMonthlyRevenue(data, selectedMonth);
        setMonthlyRevenue(monthlyTotal);

        const yearlyTotal = calculateYearlyRevenue(data, selectedYear);
        setYearlyRevenue(yearlyTotal);

        const dailyTotal = calculateDailyRevenue(data, selectedDate);
        setDailyRevenue(dailyTotal);
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedMonth, selectedYear, selectedDate]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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

    return (
      <div className="modal">
        <div className="modal-content">
          <button onClick={onClose} className="modal-close-btn">×</button>
          <h2>Chi Tiết Giao Dịch</h2>
          <div>
            <p><strong>ID:</strong> {transaction._id}</p>
            <p><strong>Fullname:</strong> {transaction.fullname}</p>
            <p><strong>Email:</strong> {transaction.email}</p>
            <p><strong>Location:</strong> {transaction.location}</p>
            <p><strong>Phone:</strong> {transaction.number}</p>
            <p><strong>Ship:</strong> {transaction.ship}</p>
            <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
            <p><strong>Total Price:</strong> {Number(transaction.totalPrice).toLocaleString("vi-VN")} VNĐ</p>
            <p><strong>Status:</strong> {convertStatus(transaction.status)}</p>
            <h3>Products:</h3>
            <ul>
              {transaction.products.map((product, index) => (
                <li key={index}>
                  {product.name} - {Number(product.price).toLocaleString("vi-VN")} VNĐ
                </li>
              ))}
            </ul>
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
          <h3>Doanh Thu Theo Ngày</h3>
          <div className="calendar-section">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
          </div>
          <p>{Number(dailyRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>

        <div className="stat-box">
          <h3>Doanh Thu Tháng</h3>
          <div className="dropdown-section">
            <label htmlFor="month">Chọn tháng: </label>
            <select
              id="month"
              value={selectedMonth !== null ? selectedMonth : ""}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option value="">Chọn tháng</option>
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  Tháng {index + 1}
                </option>
              ))}
            </select>
          </div>
          <p>{Number(monthlyRevenue).toLocaleString("vi-VN")} VNĐ</p>
        </div>
        <div className="stat-box">
          <h3>Doanh Thu Năm</h3>
          <div className="dropdown-section">
            <label htmlFor="year">Chọn năm: </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 11 }, (_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </option>
              ))}
            </select>
          </div>
          <p>{Number(yearlyRevenue).toLocaleString("vi-VN")} VNĐ</p>
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
              <th scope="col">Status</th>
              <th scope="col">Total amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item._id}>
                <td>{item.email}</td>
                <td>{item.location}</td>
                <td>{item.number}</td>
                <td>{item.products.map((e) => `${e.name}, `)}</td>
                <td>{convertStatus(item.status)}</td>
                <td>{Number(item.totalPrice).toLocaleString("vi-VN")} VNĐ</td>

                <td>
                  <button onClick={() => openModal(item)} className="btn-detail">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
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
