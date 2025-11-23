import React, { useEffect } from "react";
import Intro from "./Homepage/Transporter";
import Vendor from "./Homepage/Vendor";
import Farmer from "./Homepage/Farmer";
import { useAuthStore } from "./lib/store";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loginpage from "./pages/Login";
import Signuppage from "./pages/Signup";
import ChatHome from "./pages/chat/Homepage";
import Profilepage from "./pages/Setting";
import AddProduct from "./pages/Addproduct";
import Inventory from "./pages/Inventory";
import ShipmentTracking from "./pages/Trackship";
import Orders from "./pages/Orders";
import TransporterJobs from "./pages/TransporterJobs";
import LocationUpdate from "./pages/Locationupdate";
import DeliveryHistory from "./pages/TransportDeliveryHistory";
import ActiveDelivery from "./pages/TransportActiveJob";
import BrowseProduct from "./pages/BrowseProduct";
import MyOrders from "./pages/VendorOrders";
import Demo from "./pages/Demo";
import Product from "./pages/Product";
import { Loader } from "lucide-react";
import Buyandpayment from "./pages/Buyandpayment";
import EditProduct from "./pages/EditProduct";
import About from "./pages/About";
const App = () => {
  const location = useLocation();
  const { checkAuth, AuthUser, Authtype, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [location]);

  if (isCheckingAuth && !AuthUser) {
    return (
      <div>
        <div className="flex h-screen items-center justify-center">
          <Loader className="size-8 text-gray-50 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            AuthUser ? (
              Authtype === "transporter" ? (
                <Intro />
              ) : Authtype === "vendor" ? (
                <Vendor />
              ) : Authtype === "farmer" ? (
                <Farmer />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={!AuthUser ? <Loginpage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!AuthUser ? <Signuppage /> : <Navigate to="/" />}
        />
        <Route
          path="/msg"
          element={AuthUser ? <ChatHome /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={AuthUser ? <Profilepage /> : <Navigate to="/" />}
        />
        <Route
          path="/addProduct"
          element={AuthUser ? <AddProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/editProduct/:id"
          element={AuthUser ? <EditProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/manage"
          element={AuthUser ? <Inventory /> : <Navigate to="/" />}
        />
        <Route
          path="/track"
          element={AuthUser ? <ShipmentTracking /> : <Navigate to="/" />}
        />
        <Route
          path="/Order"
          element={AuthUser ? <Orders /> : <Navigate to="/" />}
        />
        <Route
          path="/transport"
          element={AuthUser ? <TransporterJobs /> : <Navigate to="/" />}
        />
        <Route
          path="/delivery_update"
          element={AuthUser ? <LocationUpdate /> : <Navigate to="/" />}
        />
        <Route
          path="/delivery_history"
          element={AuthUser ? <DeliveryHistory /> : <Navigate to="/" />}
        />
        <Route
          path="/Active_delivery"
          element={AuthUser ? <ActiveDelivery /> : <Navigate to="/" />}
        />
        <Route
          path="/Product"
          element={AuthUser ? <BrowseProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/Active_delivery"
          element={AuthUser ? <ActiveDelivery /> : <Navigate to="/" />}
        />
        <Route
          path="/MyOrder"
          element={AuthUser ? <MyOrders /> : <Navigate to="/" />}
        />
        <Route
          path="/product/:product_id"
          element={AuthUser ? <Product /> : <Navigate to="/" />}
        />
        <Route
          path="/buy"
          element={AuthUser ? <Buyandpayment /> : <Navigate to="/" />}
        />
        <Route
          path="/About"
          element={AuthUser ? <About /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default App;
