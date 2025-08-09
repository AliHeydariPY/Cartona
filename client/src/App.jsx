import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home";
import CreateAccountForm from "./pages/CreateAccountForm";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          marginTop: "40px",
        }}
        toastOptions={{
          duration: 4000,
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<CreateAccountForm />} />
      </Routes>
    </>
  );
}

export default App;
