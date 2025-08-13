import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import CreateAccountForm from "./pages/CreateAccountForm";
import UpgradeToSeller from "./pages/UpgradeToSeller";
import UserDashboard from "./pages/UserDashboard";

import Profile from "./pages/user dashboard/Profile";
import Favorites from "./pages/user dashboard/Favorites";
import Orders from "./pages/user dashboard/Orders";
import Payments from "./pages/user dashboard/Payments";
import AddProduct from "./pages/user dashboard/AddProduct";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          marginTop: "0px",
        }}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/account" element={<UserDashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="payments" element={<Payments />} />
          <Route path="add-product" element={<AddProduct />} />
        </Route>
        <Route path="/create-account" element={<CreateAccountForm/>}/>
        <Route path="/upgradeToSeller" element={<UpgradeToSeller />} />
      </Routes>
    </>
  );
}

export default App;
