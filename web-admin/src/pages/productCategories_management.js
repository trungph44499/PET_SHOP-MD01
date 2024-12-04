import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/css.css"; // Đảm bảo có file CSS cho giao diện
import NavigationPage from "./navigation_page";

export default function ProductCategoriesManagement() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  
  const _image = useRef();
  const _name = useRef();

  // Lấy tất cả danh mục sản phẩm từ server
  async function getAllCategories() {
    try {
      const { status, data: { response } } = await axios.get(`${json_config[0].url_connect}/product-categories`);
      if (status === 200) {
        setData(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  // Thay đổi trạng thái Block
  const toggleStatus = async (item) => {
    const confirm = window.confirm(`Are you sure you want to ${item.status ? "block" : "unblock"} this category?`);
    if (confirm) {
      try {
        const { status, data } = await axios.post(`${json_config[0].url_connect}/product-categories/update-status`, {
          id: item._id,
          status: !item.status,
        });
        if (status === 200) {
          window.alert(data.response);
          await getAllCategories(); // Cập nhật lại danh sách
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
       <header className="header">
        <h1>Quản lý loại sản phẩm</h1>
      </header>
      {isUpdate && (
        <div className={`m-2 ${isUpdate ? "slide-in" : "slide-out"}`}>
          {/* Form cập nhật danh mục */}
          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Image
              </span>
              <input ref={_image} type="text" defaultValue={dataUpdate.img} />
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Name
              </span>
              <input ref={_name} type="text" defaultValue={dataUpdate.name} />
            </div>
          </div>
          <div className="d-flex flex-row mb-2">
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const { status, data: { response } } = await axios.post(
                    `${json_config[0].url_connect}/product-categories/update`,
                    {
                      id: dataUpdate._id,
                      image: _image.current.value,
                      name: _name.current.value,
                    }
                  );
                  if (status === 200) {
                    window.alert(response);
                    await getAllCategories();
                    setIsUpdate(false);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Update
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsUpdate(false)}
            >
              Quit
            </button>
          </div>
        </div>
      )}

      {isAdd && (
        <div className={`m-2 ${isAdd ? "slide-in" : "slide-out"}`}>
          {/* Form thêm mới danh mục */}
          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Image
              </span>
              <input ref={_image} type="text" />
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Name
              </span>
              <input ref={_name} type="text" />
            </div>
          </div>
          <div className="d-flex flex-row mb-2">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (
                  _image.current.value === "" ||
                  _name.current.value === ""
                ) {
                  window.alert("Input is empty");
                  return;
                }
                try {
                  const { status, data: { response } } = await axios.post(
                    `${json_config[0].url_connect}/product-categories/add`,
                    {
                      image: _image.current.value,
                      name: _name.current.value,
                    }
                  );
                  if (status === 200) {
                    window.alert(response);
                    await getAllCategories();
                    setIsAdd(false);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Add
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAdd(false)}
            >
              Quit
            </button>
          </div>
        </div>
      )}

      {/* Nút thêm danh mục mới */}
      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ borderRadius: 30, height: 50, width: 50 }}
          onClick={() => {
            setIsUpdate(false);
            setIsAdd(true);
          }}
        >
          <FontAwesomeIcon icon={faAdd} size="xl" />
        </button>
      </div>

      {/* Bảng danh mục sản phẩm */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
            <th scope="col">Block</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.img} height={50} width={50} alt={item.name} />
              </td>
              <td>{item.name}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsAdd(false);
                    setTimeout(() => {
                      setDataUpdate(item);
                      setIsUpdate(true);
                    }, 500);
                  }}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    const result = window.confirm(`Bạn có chắc chắn muốn xóa danh mục ${item.name}?`);
                    if (result) {
                      try {
                        const { status, data: { response } } = await axios.post(
                          `${json_config[0].url_connect}/product-categories/delete`,
                          { id: item._id }
                        );
                        if (status === 200) {
                          window.alert(response);
                          await getAllCategories();
                        }
                      } catch (error) {
                        console.log(error);
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
                  onClick={() => toggleStatus(item)}
                >
                  {item.status ? "Block" : "Unblock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
