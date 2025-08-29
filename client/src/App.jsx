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
import Orders from "./pages/user-dashboard/Orders";
import Payments from "./pages/user-dashboard/Payments";
import AddProduct from "./pages/user-dashboard/AddProduct";
import MyProducts from "./pages/user-dashboard/MyProducts";
import ChatLayout from "./pages/user-dashboard/chats/ChatLayout";
import ProductDetail from "./pages/ProductDetail";

import SearchPage from "./pages/SearchPage";
import SubCategory from "./pages/SubCategory";

import ProductFeatures from "./pages/user-dashboard/my-products/ProductFeatures";
import ProductImages from "./pages/user-dashboard/my-products/ProductImages";
import EditProduct from "./pages/user-dashboard/my-products/EditProduct";

import AddedToCartPopup from "./components/pop-ups/AddedToCartPopup";
import RemoveFromCartPopup from "./components/pop-ups/RemoveFromCartPopup";
import Notifications from "./pages/user-dashboard/Notifications";

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
                setReloadComponent={setReloadComponent}
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
          <Route path="notifications" element={<Notifications />} />


          <Route
            path="orders"
            element={
              <Orders
                reloadComponent={reloadComponent}
                setReloadComponent={setReloadComponent}
              />
            }
          />

          <Route path="chats" element={<ChatLayout />} />

          <Route path="chats/:chatID" element={<ChatLayout />} />

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

        <Route
          path="/search/:query"
          element={
            <SearchPage
              reloadComponent={reloadComponent}
              setReloadComponent={setReloadComponent}
              setAddToCartPopup={setAddToCartPopup}
              setSelectedProduct={setSelectedProduct}
              setRremoveFromCartPopup={setRremoveFromCartPopup}
            />
          }
        />
        <Route
          path="/search/category/:query"
          element={
            <SearchPage
              reloadComponent={reloadComponent}
              setReloadComponent={setReloadComponent}
              setAddToCartPopup={setAddToCartPopup}
              setSelectedProduct={setSelectedProduct}
              setRremoveFromCartPopup={setRremoveFromCartPopup}
            />
          }
        />
        <Route path="/category/:categoryId" element={<SubCategory />} />
      </Routes>
    </>
  );
}

export default App;
