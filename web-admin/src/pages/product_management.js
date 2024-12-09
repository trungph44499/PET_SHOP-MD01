import React, { useEffect, useRef, useState } from "react";
import NavigationPage from "./navigation_page";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/css.css";

export default function ProductManagement() {
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
  const [selectedType, setSelectedType] = useState("");
  const [categories, setCategories] = useState([]);

  const _image = useRef();
  const _name = useRef();
  const _status = useRef();
  const _type = useRef();
  const _description = useRef();
  const _size = useRef(); // Thêm size vào đây
  const _animals = useRef(); // Thêm animals vào đây
  const _sizePrice = useRef(null);
  const _sizeQuantity = useRef(null);

  async function getAllProduct() {
    try {
      const { status, data: { response } } = await axios.get(`${json_config[0].url_connect}/products`);
      if (status === 200) {
        setData(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getCategories() {
    try {
      const { status, data: { response } } = await axios.get(`${json_config[0].url_connect}/product-categories`);
      if (status === 200) {
        setCategories(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllProduct();
    getCategories();
  }, []);

  const filteredData = selectedType
    ? data.filter((item) => item.type._id === selectedType)
    : data;

  // Hàm kiểm tra dữ liệu hợp lệ
  const validateProductData = () => {
    if (
      _image.current.value === "" ||
      _name.current.value === "" ||
      _status.current.value === "" ||
      _type.current.value === "" ||
      _description.current.value === "" ||
      _size.current.value === "" || // Kiểm tra size
      _animals.current.value === "" // Kiểm tra animals
    ) {
      return "Vui lòng điền đầy đủ thông tin!";
    }

    return null;
  };
  // Hàm xử lý thêm sản phẩm
  const handleAddProduct = async () => {
    const errorMessage = validateProductData();
    if (errorMessage) {
      window.alert(errorMessage);
      return;
    }
    // Chuyển đổi các giá trị size, price và quantity thành mảng đối tượng
    // Kiểm tra nếu giá trị tồn tại trước khi xử lý
    const sizeArray = _size.current.value && _size.current.value.trim() !== ""
      ? _size.current.value.split(',').map((size, index) => ({
        sizeName: size.trim(), // Tránh trường hợp size là null hoặc undefined
        price: _sizePrice.current.value && _sizePrice.current.value.split(',')[index]
          ? parseFloat(_sizePrice.current.value.split(',')[index].trim())
          : 0,  // Giá trị mặc định là 0 nếu không có giá trị
        quantity: _sizeQuantity.current.value && _sizeQuantity.current.value.split(',')[index]
          ? parseInt(_sizeQuantity.current.value.split(',')[index].trim())
          : 0  // Số lượng mặc định là 0 nếu không có giá trị
      }))
      : [];
    try {
      const { status, data: { response, type } } = await axios.post(
        `${json_config[0].url_connect}/products/add`,
        {
          image: _image.current.value,
          name: _name.current.value,
          status: _status.current.value,
          type: _type.current.value,
          description: _description.current.value,
          size: sizeArray, // Cập nhật mảng size
          animals: _animals.current.value, // Thêm animals
        }
      );

      if (status === 200) {
        window.alert(response);
        if (type) {
          await getAllProduct();
          setIsAdd(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Hàm xử lý cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    const errorMessage = validateProductData();
    if (errorMessage) {
      window.alert(errorMessage);
      return;
    }
    // Chuyển đổi các giá trị size, price và quantity thành mảng đối tượng
    // Kiểm tra nếu giá trị tồn tại trước khi xử lý
    const sizeArray = _size.current.value && _size.current.value.trim() !== ""
      ? _size.current.value.split(',').map((size, index) => ({
        sizeName: size.trim(), // Tránh trường hợp size là null hoặc undefined
        price: _sizePrice.current.value && _sizePrice.current.value.split(',')[index]
          ? parseFloat(_sizePrice.current.value.split(',')[index].trim())
          : 0,  // Giá trị mặc định là 0 nếu không có giá trị
        quantity: _sizeQuantity.current.value && _sizeQuantity.current.value.split(',')[index]
          ? parseInt(_sizeQuantity.current.value.split(',')[index].trim())
          : 0  // Số lượng mặc định là 0 nếu không có giá trị
      }))
      : [];

    try {
      const { status, data: { response, type } } = await axios.post(
        `${json_config[0].url_connect}/products/update`,
        {
          id: dataUpdate._id,
          image: _image.current.value,
          name: _name.current.value,
          status: _status.current.value,
          type: _type.current.value,
          description: _description.current.value,
          size: sizeArray, // Gửi mảng size
          animals: _animals.current.value, // Thêm animals
        }
      );

      if (status === 200) {
        window.alert(response);
        if (type) {
          await getAllProduct();
          setIsUdpdate(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Hàm xử lý xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    const result = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (result) {
      try {
        const { status, data: { response, type } } = await axios.post(
          `${json_config[0].url_connect}/products/delete`,
          { id: productId }
        );
        if (status === 200) {
          window.alert(response);
          if (type) {
            await getAllProduct();
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="item-container">
      {/* Dropdown lọc loại sản phẩm */}
      <header className="item-header">
        <h1>Quản lý sản phẩm</h1>
      </header>
      <div className="item-filter">
        <select
          className="item-form-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      {isUpdate && (
        <div className="item-modal-update">
          <div className="item-modal-content">
            {/* Form cập nhật sản phẩm */}
            <div className="item-flex-row">
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Category
                </span>
                <select ref={_type} defaultValue={dataUpdate.type ? dataUpdate.type._id : ""}>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Image
                </span>
                <input ref={_image} type="text" defaultValue={dataUpdate.img} />
              </div>
            </div>
            <div className="item-flex-row">
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Name
                </span>
                <input ref={_name} type="text" defaultValue={dataUpdate.name} />
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Status
                </span>
                <select ref={_status} defaultValue={dataUpdate.status}>
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                </select>
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Animals
                </span>
                <select ref={_animals} defaultValue={dataUpdate.animals}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>

                </select>
              </div>
            </div>
            <div className="item-flex-row">

              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Description
                </span>
                <textarea
                  ref={_description}
                  rows={4}
                  defaultValue={dataUpdate.description}
                  className="item-form-control"
                  placeholder="Nhập thông tin sản phẩm ở đây..."
                />
              </div>
            </div>
            <div className="item-flex-row">
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Size
                </span>
                <input
                  ref={_size}
                  type="text"
                  placeholder="Ví dụ: M,L,XL"
                  defaultValue={dataUpdate.size ? dataUpdate.size.map(item => item.sizeName).join(', ') : ''}
                />
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Price
                </span>
                <input
                  ref={_sizePrice}  // Dùng useRef ở đây
                  type="text"
                  placeholder="Ví dụ: 10000,12000,15000"
                  defaultValue={dataUpdate.size ? dataUpdate.size.map(item => item.price).join(', ') : ''}
                />
              </div>

              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Quantity
                </span>
                <input
                  ref={_sizeQuantity}  // Dùng useRef ở đây
                  type="text"
                  placeholder="Ví dụ: 10,12,15"
                  defaultValue={dataUpdate.size ? dataUpdate.size.map(item => item.quantity).join(', ') : ''}
                />
              </div>

            </div>

            <div className="item-flex-row-btn">
              <button className="btn btn-primary" onClick={handleUpdateProduct}>
                Update
              </button>
              <div style={{ width: 5 }} />
              <button className="item-btn-secondary" onClick={() => setIsUdpdate(false)}>
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
      {isAdd && (
        <div className="item-modal-add">
          <div className="item-modal-content">
            {/* Form thêm mới sản phẩm */}
            <div className="item-flex-row">
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Category
                </span>
                <select ref={_type}>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Image
                </span>
                <input ref={_image} type="text" />
              </div>

            </div>
            <div className="item-flex-row">
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Name
                </span>
                <input ref={_name} type="text" />
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Status
                </span>
                <select ref={_status}>
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                </select>
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Animals
                </span>
                <select ref={_animals} defaultValue={dataUpdate.animals}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>

                </select>
              </div>
            </div>
            <div className="item-flex-row">

              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Description
                </span>
                <textarea
                  ref={_description}
                  rows={4}
                  className="item-form-control"
                  placeholder="Nhập thông tin sản phẩm ở đây..."
                />
              </div>
            </div>
            <div className="item-flex-row">
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Size
                </span>
                <input
                  ref={_size}
                  type="text"
                  placeholder="Ví dụ: M,L,XL"
                  defaultValue={dataUpdate.size ? dataUpdate.size.map(item => item.sizeName).join(', ') : ''}
                />
              </div>
              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Price
                </span>
                <input
                  ref={_sizePrice}  // Dùng useRef ở đây
                  type="text"
                  placeholder="Ví dụ: 10000,12000,15000"
                  defaultValue={dataUpdate.size ? dataUpdate.size.map(item => item.price).join(', ') : ''}
                />
              </div>

              <div className="item-input-group">
                <span className="item-input-group-text" style={{ width: 100 }}>
                  Quantity
                </span>
                <input
                  ref={_sizeQuantity}  // Dùng useRef ở đây
                  type="text"
                  placeholder="Ví dụ: 10,12,15"
                  defaultValue={dataUpdate.size ? dataUpdate.size.map(item => item.quantity).join(', ') : ''}
                />
              </div>
            </div>
            <div className="item-flex-row-btn">
              <button className="item-btn-primary" onClick={handleAddProduct}>
                Add
              </button>
              <div style={{ width: 5 }} />
              <button className="item-btn-secondary" onClick={() => setIsAdd(false)}>
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Nút thêm sản phẩm */}
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
      {/* Bảng sản phẩm đã lọc */}
      <table className="item-table">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Size</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Animals</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>
                <img
                  src={item.img}
                  height={50}
                  width={50}
                  alt={item.name || "Hình ảnh sản phẩm"}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.status}</td>
              <td>{item.type ? item.type.name : "Unknown"}</td>
              <td>{item.description}</td>
              <td>
                {item.size ? item.size.map(s => s.sizeName).join(', ') : ''}
              </td>
              <td>
                {item.size ? item.size.map(s => s.price).join(', ') : ''}
              </td>
              <td>
                {item.size ? item.size.map(s => s.quantity).join(', ') : ''}
              </td>
              {/* Hiển thị mảng size như chuỗi ngăn cách bởi dấu phẩy */}
              <td>{item.animals}</td>
              <td>
                <button
                  onClick={async () => {
                    setIsUdpdate(false);
                    setTimeout(() => {
                      setDataUpdate(item);
                      setIsAdd(false);
                      setIsUdpdate(true);
                    }, 500);
                  }}
                  className="item-btn-primary"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="item-btn-secondary"
                  onClick={() => handleDeleteProduct(item._id)}
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
