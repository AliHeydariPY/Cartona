import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import CreateAccountForm from "./pages/CreateAccountForm";
import UpgradeToSeller from "./pages/UpgradeToSeller";
import UserDashboard from "./pages/UserDashboard";

import Profile from "./pages/user-dashboard/Profile";
import Favorites from "./pages/user-dashboard/Favorites";
import Cart from "./pages/user-dashboard/Cart";
import Payments from "./pages/user-dashboard/Payments";
import AddProduct from "./pages/user-dashboard/AddProduct";
import MyProducts from "./pages/user-dashboard/MyProducts";

import ProductDetail from "./pages/ProductDetail";

import AddedToCartPopup from "./components/pop-ups/AddedToCartPopup";
import RemoveFromCartPopup from "./components/pop-ups/RemoveFromCartPopup";
import AnswerQuestionPopup from "./components/pop-ups/AnswerQuestionPopup";

import { useState } from "react";

function App() {
  const [removeFromCartPopup, setRremoveFromCartPopup] = useState(false);
  const [addToCartPopup, setAddToCartPopup] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [removeInDOM, setRemoveInDOM] = useState(null);

  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [question, setQuestion] = useState("");

  const [reloadComponent, setReloadComponent] = useState(false);

  return (
    <>
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

      {removeFromCartPopup && (
        <RemoveFromCartPopup
          onClose={() => setRremoveFromCartPopup(false)}
          product={selectedProduct}
          setRemoveInDOM={setRemoveInDOM}
          setReloadComponent={setReloadComponent}
        />
      )}

      {addToCartPopup && (
        <AddedToCartPopup
          onClose={() => setAddToCartPopup(false)}
          // product={selectedProduct}
          product={{ name: "Product X", price: 249.99 }}
        />
      )}

      {showAnswerPopup && (
        <AnswerQuestionPopup
          onClose={() => setShowAnswerPopup(false)}
          question={question}
          reloadComponent={reloadComponent}
          setReloadComponent={setReloadComponent}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/account" element={<UserDashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route
            path="cart"
            element={
              <Cart
                setRremoveFromCartPopup={setRremoveFromCartPopup}
                setSelectedProduct={setSelectedProduct}
                removeInDOM={removeInDOM}
                setRemoveInDOM={setRemoveInDOM}
              />
            }
          />
          <Route
            path="favorites"
            element={
              <Favorites
                setAddToCartPopup={setAddToCartPopup}
                setSelectedProduct={setSelectedProduct}
              />
            }
          />
          <Route path="payments" element={<Payments />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="my-products" element={<MyProducts />} />
        </Route>
        <Route
          path="/products/:id"
          element={
            <ProductDetail
              setShowAnswerPopup={setShowAnswerPopup}
              setQuestion={setQuestion}
              reloadComponent={reloadComponent}
              setReloadComponent={setReloadComponent}
              setAddToCartPopup={setAddToCartPopup}
              setSelectedProduct={setSelectedProduct}
              setRremoveFromCartPopup={setRremoveFromCartPopup}
            />
          }
        />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/upgradeToSeller" element={<UpgradeToSeller />} />
      </Routes>
    </>
  );
}

export default App;
