import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login_page";
import UserManagement from "./pages/user_management";
import ProductManagement from "./pages/product_management";
import AdminManagement from "./pages/admin_page";
import WebSocketContext from "./context/WebSocketContext";
import PetCare from "./pages/pet_care";
import Payment from "./pages/payment";
import RevenueStatistics from "./pages/revenue_statistics";
import ProductCategories from "./pages/productCategories_management";
import ChatItemPage from "./pages/chat_item_page";

function App() {
  return (
    <div className="App">
      <WebSocketContext
        child={
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/user" element={<UserManagement />} />
              <Route path="/product" element={<ProductManagement />} />
              <Route path="/admin" element={<AdminManagement />} />
              <Route path="/confirm-product" element={<PetCare />} />
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/revenue-tatistics"
                element={<RevenueStatistics />}
              />
              <Route path="/category" element={<ProductCategories />} />
              <Route path="/chat-item/:email" element={<ChatItemPage />} />
            </Routes>
          </BrowserRouter>
        }
      />
    </div>
  );
}

export default App;
