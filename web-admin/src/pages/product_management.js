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
  const _price = useRef();
  const _origin = useRef();
  const _quantity = useRef();
  const _status = useRef();
  const _type = useRef();
  const _description = useRef();
  const _weight = useRef();  // Thêm ref cho trường weight
  const _sex = useRef();  // Thêm ref cho trường sex

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
      _price.current.value === "" ||
      _origin.current.value === "" ||
      _quantity.current.value === "" ||
      _status.current.value === "" ||
      _type.current.value === "" ||
      _description.current.value === "" ||
      _weight.current.value === "" ||
      _sex.current.value === ""
    ) {
      return "Vui lòng điền đầy đủ thông tin!";
    }

    if (parseFloat(_price.current.value) <= 0) {
      return "Giá sản phẩm phải lớn hơn 0!";
    }

    if (parseInt(_quantity.current.value) < 0) {
      return "Số lượng sản phẩm không thể nhỏ hơn 0!";
    }

    const validSexValues = ["Male", "Female", "Unisex"];
    if (!validSexValues.includes(_sex.current.value)) {
      return "Giới tính phải là Male, Female hoặc Unisex!";
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

    try {
      const { status, data: { response, type } } = await axios.post(
        `${json_config[0].url_connect}/products/add`,
        {
          image: _image.current.value,
          name: _name.current.value,
          price: _price.current.value,
          origin: _origin.current.value,
          quantity: _quantity.current.value,
          status: _status.current.value,
          type: _type.current.value,
          description: _description.current.value,
          weight: _weight.current.value,
          sex: _sex.current.value,
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

    try {
      const { status, data: { response, type } } = await axios.post(
        `${json_config[0].url_connect}/products/update`,
        {
          id: dataUpdate._id,
          image: _image.current.value,
          name: _name.current.value,
          price: _price.current.value,
          origin: _origin.current.value,
          quantity: _quantity.current.value,
          status: _status.current.value,
          type: _type.current.value,
          description: _description.current.value,
          weight: _weight.current.value,
          sex: _sex.current.value,
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
    <div>
      {/* Dropdown lọc loại sản phẩm */}
      <div className="filter">
      <header className="header">
        <h1>Quản lý sản phẩm</h1>
      </header>
        <select
          className="form-select"
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
        <div className={`m-2 ${isUpdate ? "slide-in" : "slide-out"}`}>
          {/* Form cập nhật sản phẩm */}
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
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Price
              </span>
              <input ref={_price} type="number" defaultValue={dataUpdate.price} />
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Age
              </span>
              <input ref={_origin} type="text" defaultValue={dataUpdate.origin} />
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Quantity
              </span>
              <input ref={_quantity} type="number" defaultValue={dataUpdate.quantity} />
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Status
              </span>
              <select ref={_status} defaultValue={dataUpdate.status}>
                <option value="New">New</option>
                <option value="Old">Old</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
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
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Description
              </span>
              <input ref={_description} type="text" defaultValue={dataUpdate.description} />
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Weight
              </span>
              <input ref={_weight} type="text" defaultValue={dataUpdate.weight} />
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Sex
              </span>
              <select ref={_sex} defaultValue={dataUpdate.sex}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <button className="btn btn-primary" onClick={handleUpdateProduct}>
              Update
            </button>
            <div style={{ width: 5 }} />
            <button className="btn btn-secondary" onClick={() => setIsUdpdate(false)}>
              Quit
            </button>
          </div>
        </div>
      )}

      {isAdd && (
        <div className={`m-2 ${isAdd ? "slide-in" : "slide-out"}`}>
          {/* Form thêm mới sản phẩm */}
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
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Price
              </span>
              <input ref={_price} type="number" />
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Age
              </span>
              <input ref={_origin} type="text" />
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Quantity
              </span>
              <input ref={_quantity} type="number" />
            </div>
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Status
              </span>
              <select ref={_status}>
                <option value="New">New</option>
                <option value="Old">Old</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
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
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Description
              </span>
              <input ref={_description} type="text" />
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Weight
              </span>
              <input ref={_weight} type="text" />
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <div className="input-group">
              <span className="input-group-text" style={{ width: 100 }}>
                Sex
              </span>
              <select ref={_sex}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-row mb-2">
            <button className="btn btn-primary" onClick={handleAddProduct}>
              Add
            </button>
            <div style={{ width: 5 }} />
            <button className="btn btn-secondary" onClick={() => setIsAdd(false)}>
              Quit
            </button>
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
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Age</th>
            <th scope="col">Quantity</th>
            <th scope="col">Status</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Weight</th>
            <th scope="col">Sex</th>
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
              <td>{item.price}</td>
              <td>{item.origin}</td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
              <td>{item.type ? item.type.name : "Unknown"}</td>
              <td>{item.description}</td>
              <td>{item.weight}</td>
              <td>{item.sex}</td>
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
                  className="btn btn-primary"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
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
