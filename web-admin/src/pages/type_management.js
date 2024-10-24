import React, { useEffect, useRef, useState } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/css.css";

export default function TypeManagement() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});

  const [isUpdate, setIsUdpdate] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const _type = useRef();

  async function getAllType() {
    try {
      const { status, data } = await axios.get(
        `${json_config[0].url_connect}/type`
      );
      if (status == 200) {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllType();
  }, []);

  return (
    <div>
      {isUpdate && (
        <div className={`m-2 ${isUpdate ? "slide-in" : "slide-out"}`}>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Type
            </span>
            <input ref={_type} type="text" defaultValue={dataUpdate.fullname} />
          </div>

          <div className="d-flex flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (_type.current.value === "") {
                  window.alert("Inpur empty!");
                  return;
                }

                try {
                  const {
                    status,
                    data: { response, type },
                  } = await axios.post(
                    `${json_config[0].url_connect}/type/update`,
                    {
                      id: dataUpdate._id,
                      type: _type.current.value,
                    }
                  );
                  if (status == 200) {
                    window.alert(response);
                    if (type) {
                      await getAllType();
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Update
            </button>
            <div style={{ width: 5 }} />
            <button
              className="btn btn-secondary"
              onClick={() => setIsUdpdate(false)}
            >
              Quit
            </button>
          </div>
        </div>
      )}
      {isAdd && (
        <div className={`m-2 ${isAdd ? "slide-in" : "slide-out"}`}>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Type
            </span>
            <input ref={_type} type="text" />
          </div>

          <div className="d-flex flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (_type.current.value === "") {
                  window.alert("Inpur empty!");
                  return;
                }

                try {
                  const {
                    status,
                    data: { response, type },
                  } = await axios.post(
                    `${json_config[0].url_connect}/type/add`,
                    {
                      type: _type.current.value,
                    }
                  );
                  if (status == 200) {
                    window.alert(response);
                    if (type) {
                      setIsAdd(false);
                      await getAllType();
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add
            </button>
            <div style={{ width: 5 }} />
            <button
              className="btn btn-secondary"
              onClick={() => setIsAdd(false)}
            >
              Quit
            </button>
          </div>
        </div>
      )}
      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ borderRadius: 30, height: 50, width: 50 }}
          onClick={() => {
            setIsUdpdate(false);
            setIsAdd(true);
          }}
        >
          <FontAwesomeIcon icon={faAdd} size="xl" />
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Type</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.type}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    const result = window.confirm("Sure delete " + item.type);

                    if (result) {
                      const {
                        status,
                        data: { response, type },
                      } = await axios.post(
                        `${json_config[0].url_connect}/type/delete`,
                        {
                          id: item._id,
                        }
                      );
                      if (status == 200) {
                        window.alert(response);
                        if (type) {
                          await getAllType();
                        }
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
