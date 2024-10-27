import React, { useEffect, useState } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import "./css/css.css";

export default function ConfirmProduct() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  async function getAllConfirmProduct() {
    try {
      const { status, data } = await axios.get(
        `${json_config[0].url_connect}/notification`
      );
      if (status == 200) {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllConfirmProduct();
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          
        }}
      >
        sendddd
      </button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Tittle</th>
            <th scope="col">Content</th>
            <th scope="col">Status</th>
            <th scope="col">Confirm</th>
            <th scope="col">Reject</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.emailUser}</td>
              <td>{item.status ? "Confirmed" : "Rejected"}</td>
              <td>{item.date}</td>
              <td>{item.product.map((p) => p.name + " ,")}</td>

              <td>
                <button onClick={() => {}} className="btn btn-primary">
                  Confirm
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    const result = window.confirm("Sure delete ");
                  }}
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
