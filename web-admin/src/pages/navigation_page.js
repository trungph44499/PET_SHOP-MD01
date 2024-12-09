import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { myColor } from "../styles/color";
import {
  faChevronLeft,
  faChevronRight,
  faComputer,
  faSignOut,
  faDog,
  faMoneyBill,
  faHand,
  faProjectDiagram,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function NavigationPage({ child }) {
  const navigator = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = window.localStorage.getItem("@isAdmin");
    setIsAdmin(admin);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      position: "top", // Chỉnh vị trí xuất hiện của hộp thoại
    }).then((result) => {
      if (result.isConfirmed) {
        // Xóa thông tin đăng nhập và chuyển hướng
        window.localStorage.removeItem("@isAdmin");
        navigator("/", { replace: true });
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <Sidebar collapsed={collapsed}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 100,
          }}
        >
          <FontAwesomeIcon
            icon={faUserTie}
            size="lg"
            style={{ marginLeft: 32 }}
            color={myColor.backgroundcolor}
          />
          <p
            style={{
              color: myColor.backgroundcolor,
              fontSize: 20,
              fontWeight: "bold",
              width: collapsed ? 0 : 200,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: 15,
            }}
          >
            Welcome {isAdmin === "true" ? "Admin" : "Staff"}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 30,
          }}
        >
          <p
            style={{
              textAlign: "start",
              paddingLeft: "10px",
              fontSize: 11,
              fontWeight: "600",
              opacity: 0.5,
              height: 0,
            }}
          >
            Manager
          </p>
          {collapsed ? (
            <button
              style={{
                borderRadius: 20,
                paddingTop: 2,
                border: 0,
              }}
              onClick={() => {
                setCollapsed(false);
              }}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                color={myColor.backgroundcolor}
              />
            </button>
          ) : (
            <button
              style={{
                borderRadius: 20,
                paddingTop: 2,
                border: 0,
              }}
              onClick={() => {
                setCollapsed(true);
              }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                color={myColor.backgroundcolor}
              />
            </button>
          )}
        </div>
        <Menu>
          {isAdmin === "true" && (
            <MenuItem
              style={{ textAlign: "start" }}
              icon={<FontAwesomeIcon icon={faComputer} />}
              onClick={() => navigator("/admin")}
            >
              Quản lý nhân viên
            </MenuItem>
          )}
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faUser} />}
            onClick={() => navigator("/user")}
          >
            Quản lý tài khoản người dùng
          </MenuItem>
          {isAdmin === "true" && (
            <MenuItem
              style={{ textAlign: "start" }}
              icon={<FontAwesomeIcon icon={faStore} />}
              onClick={() => navigator("/revenue-tatistics")}
            >
              Thống kê doanh thu
            </MenuItem>
          )}
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faProjectDiagram} />}
            onClick={() => navigator("/category")}
          >
            Quản lý loại sản phẩm
          </MenuItem>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faDog} />}
            onClick={() => navigator("/product")}
          >
            Quản lý sản phẩm
          </MenuItem>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faHand} />}
            onClick={() => navigator("/confirm-product")}
          >
            Dịch vụ đã đặt
          </MenuItem>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faMoneyBill} />}
            onClick={() => navigator("/payment")}
          >
            Đơn hàng đã đặt
          </MenuItem>
        </Menu>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 30,
          }}
        >
          <p
            style={{
              textAlign: "start",
              paddingLeft: "10px",
              fontSize: 11,
              fontWeight: "600",
              opacity: 0.5,
              height: 0,
            }}
          >
            Logout
          </p>
        </div>
        <Menu>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faSignOut} />}
            onClick={handleLogout}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
      </Sidebar>
      <div style={{ flex: 1 }}> {child}</div>
    </div>
  );
}
