import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

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

import ProductFeatures from "./pages/user-dashboard/my-products/ProductFeatures";
import ProductImages from "./pages/user-dashboard/my-products/ProductImages";
import EditProduct from "./pages/user-dashboard/my-products/EditProduct";

import ProductDetail from "./pages/ProductDetail";

import AddedToCartPopup from "./components/pop-ups/AddedToCartPopup";
import RemoveFromCartPopup from "./components/pop-ups/RemoveFromCartPopup";

function App() {
  const [removeFromCartPopup, setRremoveFromCartPopup] = useState(false);
  const [addToCartPopup, setAddToCartPopup] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isRemoveCartItem, setIsRemoveCartItem] = useState(true);
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
          setReloadComponent={setReloadComponent}
          isRemoveCartItem={isRemoveCartItem}
        />
      )}

      {addToCartPopup && (
        <AddedToCartPopup
          onClose={() => setAddToCartPopup(false)}
          // product={selectedProduct}
          product={{ name: "Product X", price: 249.99 }}
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
                reloadComponent={reloadComponent}
                setIsRemoveCartItem={setIsRemoveCartItem}
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

          <Route
            path="my-products"
            element={
              <MyProducts
                setRremoveFromCartPopup={setRremoveFromCartPopup}
                setSelectedProduct={setSelectedProduct}
                reloadComponent={reloadComponent}
                setIsRemoveCartItem={setIsRemoveCartItem}
              />
            }
          />
          <Route
            path="my-products/features/:id"
            element={
              <ProductFeatures
                reloadComponent={reloadComponent}
                setReloadComponent={setReloadComponent}
              />
            }
          />
          <Route
            path="my-products/images/:id"
            element={
              <ProductImages
                reloadComponent={reloadComponent}
                setReloadComponent={setReloadComponent}
              />
            }
          />
          <Route path="my-products/edit/:id" element={<EditProduct />} />
        </Route>
        <Route
          path="/products/:id"
          element={
            <ProductDetail
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
