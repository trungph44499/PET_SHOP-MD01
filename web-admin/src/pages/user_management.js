import React, { useContext, useEffect, useRef, useState } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/css.css";
import { webSocketContext } from "../context/WebSocketContext";

export default function UserManagement() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const ws = useContext(webSocketContext);
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});

  const [isUpdate, setIsUdpdate] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const avatar = useRef();
  const fullname = useRef();
  const email = useRef();
  const password = useRef();

  async function getAllUser() {
    try {
      const { status, data } = await axios.post(
        `${json_config[0].url_connect}/users/getAllUser`
      );
      if (status == 200) {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div>
      {isUpdate && (
        <div className={`m-2 ${isUpdate ? "slide-in" : "slide-out"}`}>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Avatar
            </span>
            <input ref={avatar} type="text" defaultValue={dataUpdate.avatar} />
          </div>
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
          <div className="input-group">
            <span className="input-group-text" style={{ width: 100 }}>
              Email
            </span>
            <input
              ref={email}
              disabled
              type="text"
              defaultValue={dataUpdate.email}
            />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Password
            </span>
            <input ref={password} type="text" defaultValue={dataUpdate.pass} />
          </div>
          <div className="d-flex flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const {
                    status,
                    data: { response, type },
                  } = await axios.post(
                    `${json_config[0].url_connect}/users/update`,
                    {
                      avatar: avatar.current.value,
                      fullname: fullname.current.value,
                      email: email.current.value,
                      password: password.current.value,
                    }
                  );
                  if (status == 200) {
                    window.alert(response);
                    if (type) {
                      await getAllUser();
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
              Avatar
            </span>
            <input ref={avatar} type="text" />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Fullname
            </span>
            <input ref={fullname} type="text" />
          </div>
          <div className="input-group">
            <span className="input-group-text" style={{ width: 100 }}>
              Email
            </span>
            <input ref={email} type="text" />
          </div>
          <div className="input-group mb-2 mt-2">
            <span className="input-group-text" style={{ width: 100 }}>
              Password
            </span>
            <input ref={password} type="text" />
          </div>
          <div className="d-flex flex-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const {
                    status,
                    data: { response, type },
                  } = await axios.post(
                    `${json_config[0].url_connect}/users/register`,
                    {
                      name: fullname.current.value,
                      email: email.current.value,
                      pass: password.current.value,
                    }
                  );
                  if (status == 200) {
                    window.alert(response);
                    if (type) {
                      setIsAdd(false);
                      await getAllUser();
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
            <th scope="col">Avatar</th>
            <th scope="col">Fullname</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <th>
                <img src={item.avatar} height={50} width={50} />
              </th>
              <td>{item.fullname}</td>
              <td>{item.email}</td>
              <td>{item.pass}</td>
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
                        `${json_config[0].url_connect}/users/delete`,
                        {
                          email: item.email,
                        }
                      );
                      if (status == 200) {
                        window.alert(response);
                        if (type) {
                          await getAllUser();
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
