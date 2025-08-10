import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home";
import CreateAccountForm from "./pages/CreateAccountForm";
import UpgradeToSeller from "./pages/UpgradeToSeller";
import UserDashboard from "./pages/UserDashboard";

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
          duration: 60000,
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account/profile" element={<UserDashboard />} />
        <Route path="/account/profile/upgradeToSeller" element={<UpgradeToSeller />} />

      </Routes>
    </>
  );
}

export default App;
