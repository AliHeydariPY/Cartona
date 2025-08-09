import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateAccountForm from "./pages/CreateAccountForm";

function App() {
  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/"  element={<Home/>}/>
        <Route path="/account" element={<CreateAccountForm />} />
      </Routes>
    </>
  );
}

export default App;
