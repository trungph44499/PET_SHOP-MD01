import React, { useEffect, useRef, useState } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/css.css";
export default function AdminManagement() {
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
  const fullname = useRef();
  const username = useRef();
  const password = useRef();
  const status = useRef();
  async function getAllAdmin() {
    try {
      const { status, data } = await axios.post(
        `${json_config[0].url_connect}/admin`
      );
      if (status == 200) {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllAdmin();
  }, []);
  return (
    <div>
      {isUpdate && (
        <div className={`m-2 ${isUpdate ? "slide-in" : "slide-out"}`}>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Fullname
            </span>
            <input
              ref={fullname}
              type="text"
              defaultValue={dataUpdate.fullname}
            />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Username
            </span>
            <input
              ref={username}
              disabled
              type="text"
              defaultValue={dataUpdate.username}
            />
          </div>
          <div className="input-group">
            <span className="input-group-text" style={{ width: 100 }}>
              Password
            </span>
            <input
              ref={password}
              type="text"
              defaultValue={dataUpdate.password}
            />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Status
            </span>
            <input
              ref={status}
              disabled
              type="text"
              defaultValue={dataUpdate.status}
            />
          </div>
          <div className="d-flex flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (
                  fullname.current.value === "" ||
                  username.current.value === "" ||
                  password === ""
                ) {
                  window.alert("Inpur empty!");
                  return;
                }
                try {
                  const {
                    status,
                    data: { response, type },
                  } = await axios.post(
                    `${json_config[0].url_connect}/admin/update`,
                    {
                      fullname: fullname.current.value,
                      username: username.current.value,
                      password: password.current.value,
                    }
                  );
                  if (status == 200) {
                    window.alert(response);
                    if (type) {
                      await getAllAdmin();
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
              Fullname
            </span>
            <input ref={fullname} type="text" />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Username
            </span>
            <input ref={username} type="text" />
          </div>
          <div className="input-group mb-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Password
            </span>
            <input ref={password} type="text" />
          </div>
          <div className="d-flex flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (
                  fullname.current.value === "" ||
                  username.current.value === "" ||
                  password === ""
                ) {
                  window.alert("Inpur empty!");
                  return;
                }
                try {
                  const {
                    status,
                    data: { response, type },
                  } = await axios.post(
                    `${json_config[0].url_connect}/admin/add`,
                    {
                      fullname: fullname.current.value,
                      username: username.current.value,
                      password: password.current.value,
                    }
                  );
                  if (status == 200) {
                    window.alert(response);
                    if (type) {
                      setIsAdd(false);
                      await getAllAdmin();
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
            <th scope="col">Fullname</th>
            <th scope="col">Username</th>
            <th scope="col">Password</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
            <th scope="col">Block</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.fullname}</td>
              <td>{item.username}</td>
              <td>{item.password}</td>
              <td>{item.type == "admin" ? "Admin" : "Staff"}</td>
              <td>{item.status ? "Active" : "Blocked"}</td>
              <td>
                <button
                  onClick={() => {
                    setIsUdpdate(false);
                    setTimeout(() => {
                      setDataUpdate(item);
                      setIsAdd(false);
                      setIsUdpdate(true);
                    }, 500);
                  }}
                  className="btn btn-primary"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    const result = window.confirm(
                      "Sure delete " + item.fullname
                    );
                    if (result) {
                      const {
                        status,
                        data: { response, type },
                      } = await axios.post(
                        `${json_config[0].url_connect}/admin/delete`,
                        {
                          username: item.username,
                        }
                      );
                      if (status == 200) {
                        window.alert(response);
                        if (type) {
                          await getAllAdmin();
                        }
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    const confirm = window.confirm(
                      `Sure ${item.status ? "lock" : "open"} ${item.fullname}`
                    );
                    if (confirm) {
                      try {
                        const {
                          status,
                          data: { response, type },
                        } = await axios.post(
                          `${json_config[0].url_connect}/admin/update`,
                          {
                            username: item.username,
                            status: !item.status,
                          }
                        );
                        if (status == 200) {
                          window.alert(response);
                          if (type) {
                            await getAllAdmin();
                          }
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {item.status ? "Lock" : "Active"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}