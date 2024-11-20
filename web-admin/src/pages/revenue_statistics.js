import React, { useState, useContext, useCallback, useEffect } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/rev.css";
import { webSocketContext } from "../context/WebSocketContext";


export default function RevenueStatistics() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [data, setData] = useState([]);
  const websocket = useContext(webSocketContext);

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
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  

  return (
    <div className="container">
      <header className="header">
        <h1>Thống Kê</h1>
      </header>

      <div className="dropdown-section">
        <label htmlFor="category">Chọn danh mục: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Chó">Chó</option>
          <option value="Mèo">Mèo</option>
          <option value="Phụ kiện">Phụ kiện</option>
        </select>
      </div>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Doanh Thu Ngày</h3>
          <p>5,000,000 VNĐ</p>
        </div>
        <div className="stat-box">
          <h3>Doanh Thu Tháng</h3>
          <p>30,000,000 VNĐ</p>
        </div>
        <div className="stat-box">
          <h3>Doanh Thu Năm</h3>
          <p>360,000,000 VNĐ</p>
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
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.email}</td>
              <td>{item.location}</td>
              <td>{item.number}</td>
              <td>{item.products.map((e) => `${e.name}, `)}</td>
              <td>{convertStatus(item.status)}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
