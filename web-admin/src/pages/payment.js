import React, { useContext, useEffect, useState, useCallback } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/css.css";
import { webSocketContext } from "../context/WebSocketContext";

export default function Payment() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const websocket = useContext(webSocketContext);

  // Hàm chuyển đổi trạng thái sang ngôn ngữ dễ hiểu
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

  // Lấy dữ liệu thanh toán
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

  // Thiết lập WebSocket và lắng nghe tin nhắn
  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (result) => {
        const data = JSON.parse(result.data);
        if (data.type === "payment") {
          getAllPayment();  // Gọi lại getAllPayment khi nhận được thông báo từ WebSocket
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
  }, [websocket, getAllPayment]);  // Chạy lại nếu websocket hoặc getAllPayment thay đổi

  return (
    <div>
       <header className="header">
        <h1>Xác nhận thanh toán</h1>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Location</th>
            <th scope="col">Phone</th>
            <th scope="col">Product</th>
            <th scope="col">Status</th>
            <th scope="col">Confirm</th>
            <th scope="col">Reject</th>
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

              <td>
                <button
                  disabled={item.status === "reject" || item.status === "success"}
                  onClick={async () => {
                    const resultCheck = window.confirm("Confirm payment?");
                    if (resultCheck) {
                      const { status, data: { response, type } } = await axios.post(
                        `${json_config[0].url_connect}/pay/update`,
                        {
                          id: item._id,
                          email: item.email,
                          products: item.products,
                          status: "success",
                        }
                      );

                      if (status === 200) {
                        window.alert(response);
                        if (type) getAllPayment(); // Cập nhật dữ liệu khi thành công
                      }
                    }
                  }}
                  className="btn btn-primary"
                >
                  Confirm
                </button>
              </td>
              <td>
                <button
                  disabled={item.status === "reject" || item.status === "success"}
                  onClick={async () => {
                    const resultCheck = window.confirm("Reject payment?");
                    if (resultCheck) {
                      const { status, data: { response, type } } = await axios.post(
                        `${json_config[0].url_connect}/pay/update`,
                        {
                          id: item._id,
                          email: item.email,
                          products: item.products,
                          status: "reject",
                        }
                      );

                      if (status === 200) {
                        window.alert(response);
                        if (type) getAllPayment(); // Cập nhật dữ liệu khi thành công
                      }
                    }
                  }}
                  className="btn btn-secondary"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
