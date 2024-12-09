import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/category.css"; // Đảm bảo có file CSS cho giao diện
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
  const [isAdd, setIsAdd] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
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

  const toggleStatus = async (item) => {
    const confirm = window.confirm(`Are you sure you want to ${item.status ? "block" : "unblock"} this category?`);
    if (confirm) {
      try {
        const { status, data } = await axios.post(`${json_config[0].url_connect}/product-categories/update-status`, {
          id: item._id,
          status: !item.status,  // Thay đổi trạng thái
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
  

  // Cập nhật danh mục sản phẩm
  const handleSubmit = async () => {
    if (_image.current.value === "" || _name.current.value === "") {
      window.alert("Vui lòng nhập đầy đủ dữ liệu");
      return;
    }

    const url = isUpdate
      ? `${json_config[0].url_connect}/product-categories/update`
      : `${json_config[0].url_connect}/product-categories/add`;

    const payload = {
      id: isUpdate ? dataUpdate._id : undefined,
      image: _image.current.value,
      name: _name.current.value,
    };

    try {
      const { status, data: { response } } = await axios.post(url, payload);
      if (status === 200) {
        window.alert(response);
        await getAllCategories();
        setIsAdd(false);
        setIsUpdate(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Cập nhật form khi nhấn nút Update
  const openUpdateModal = (item) => {
    setDataUpdate(item);
    setIsUpdate(true);
    setIsAdd(false);
  };

  // Thêm mới danh mục
  const openAddModal = () => {
    setIsAdd(true);
    setIsUpdate(false);
  };

  return (
    <div className="product-container">
      <header className="product-header">
        <h1>Quản lý loại sản phẩm</h1>
      </header>
      {/* Modal Thêm/Cập nhật danh mục */}
      {(isAdd || isUpdate) && (
        <div className="product-modal">
          <div className="product-modal-content">
            <span className="product-close" onClick={() => { setIsAdd(false); setIsUpdate(false); }}>&times;</span>
            <h2>{isUpdate ? "Cập nhật" : "Thêm mới"} danh mục</h2>
            <div className="product-input-group">
              <span className="product-input-group-text" style={{ width: 100 }}>Image</span>
              <input ref={_image} type="text" defaultValue={isUpdate ? dataUpdate.img : ""} />
            </div>
            <div className="product-input-group">
              <span className="product-input-group-text" style={{ width: 100 }}>Name</span>
              <input ref={_name} type="text" defaultValue={isUpdate ? dataUpdate.name : ""} />
            </div>
            <div className="product-modal-footer">
              <button className="product-btn-primary" onClick={handleSubmit}>
                {isUpdate ? "Cập nhật" : "Thêm mới"}
              </button>
              <button className="product-btn-secondary" onClick={() => { setIsAdd(false); setIsUpdate(false); }}>
                Hủy 
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút thêm danh mục mới */}
      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ borderRadius: 30, height: 50, width: 50 }}
          onClick={openAddModal}
        >
          <FontAwesomeIcon icon={faAdd} size="xl" />
        </button>
      </div>

      {/* Bảng danh mục sản phẩm */}
      <table className="product-table">
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
                  className="product-btn-primary"
                  onClick={() => openUpdateModal(item)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="product-btn-secondary"
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
                  className="product-btn-success"
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
