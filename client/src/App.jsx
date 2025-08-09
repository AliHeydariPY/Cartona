import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CreateAccountForm from "./pages/CreateAccountForm";

function App() {
  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/"  element={<Navbar/>}/>
        <Route path="/account" element={<CreateAccountForm />} />
      </Routes>
    </>
  );
}

export default App;
