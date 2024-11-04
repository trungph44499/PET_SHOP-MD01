import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { faUserTie } from "@fortawesome/free-solid-svg-icons/faUserTie";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { myColor } from "../styles/color";
import {
  faBookOpen,
  faChevronLeft,
  faChevronRight,
  faComputer,
  faHippo,
  faPenFancy,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function NavigationPage({ child }) {
  const navigator = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = window.localStorage.getItem("@isAdmin");
    setIsAdmin(admin);
  }, []);

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
            Welcome {isAdmin == "true" ? "Admin" : "Staff"}
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
          {isAdmin == "true" && (
            <MenuItem
              style={{ textAlign: "start" }}
              icon={<FontAwesomeIcon icon={faComputer} />}
              onClick={() => navigator("/admin")}
            >
              Staff management
            </MenuItem>
          )}
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faUser} />}
            onClick={() => navigator("/user")}
          >
            User management
          </MenuItem>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faHippo} />}
            onClick={() => navigator("/product")}
          >
            Product management
          </MenuItem>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faBookOpen} />}
            onClick={() => navigator("/confirm-product")}
          >
            Pet Care
          </MenuItem>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faPenFancy} />}
            onClick={() => navigator("/payment")}
          >
           Payment
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
            User
          </p>
        </div>
        <Menu>
          <MenuItem
            style={{ textAlign: "start" }}
            icon={<FontAwesomeIcon icon={faSignOut} />}
            onClick={() => navigator("/", { replace: true })}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
      <div style={{ flex: 1 }}> {child}</div>
    </div>
  );
}
