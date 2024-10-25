import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login_page";
import UserManagement from "./pages/user_management";
import ProductManagement from "./pages/product_management";
import AdminManagement from "./pages/admin_page";


function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user" element={<UserManagement />} />
          <Route path="/product" element={<ProductManagement />} />
          <Route path="/admin" element={<AdminManagement />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
