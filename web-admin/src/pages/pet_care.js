import React, { useContext, useEffect, useState } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/css.css";
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

  websocket.onmessage = function (result) {
    const data = JSON.parse(result.data);

    if (data.type == "pet-care") {
      getAllPetCare();
    }
  };
  function convertStatus(status) {
    var statusResult = "";
    switch (status) {
      case "reject":
        statusResult = "Đã từ chối";
        break;
      case "success":
        statusResult = "Đã xác nhận";
        break;
      case "pending":
        statusResult = "Chờ xác nhận";
        break;

      default:
        break;
    }
    return statusResult;
  }
  async function getAllPetCare() {
    try {
      const {
        status,
        data: { response },
      } = await axios.get(`${json_config[0].url_connect}/pet-care`);
      if (status == 200) {
        setData(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllPetCare();
  }, []);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Service</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Message</th>
            <th scope="col">Status</th>
            <th scope="col">Confirm</th>
            <th scope="col">Reject</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.email}</td>
              <td>{item.service}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.message}</td>
              <td>{convertStatus(item.status)}</td>
              <td>
                <button
                  disabled={
                    item.status == "reject" || item.status == "success"
                      ? true
                      : false
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
                          id: item._id,
                          email: item.email,
                          service: item.service,
                          status: "success",
                        }
                      );

                      if (status == 200) {
                        window.alert(response);
                        if (type) getAllPetCare();
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
                  disabled={
                    item.status == "reject" || item.status == "success"
                      ? true
                      : false
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
                          id: item._id,
                          email: item.email,
                          service: item.service,
                          status: "reject",
                        }
                      );

                      if (status == 200) {
                        window.alert(response);
                        if (type) getAllPetCare();
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
