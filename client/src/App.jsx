import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Home from "./pages/Home";
import CreateAccountForm from "./pages/CreateAccountForm";
import UpgradeToSeller from "./pages/UpgradeToSeller";
import UserDashboard from "./pages/UserDashboard";
import ProductDetail from "./pages/ProductDetail";

import Profile from "./pages/user-dashboard/Profile";
import Favorites from "./pages/user-dashboard/Favorites";
import Cart from "./pages/user-dashboard/Cart";
import Orders from "./pages/user-dashboard/Orders";
import AddProduct from "./pages/user-dashboard/AddProduct";
import MyProducts from "./pages/user-dashboard/MyProducts";
import Chat from "./pages/user-dashboard/Chat";
import Notifications from "./pages/user-dashboard/Notifications";

import SearchPage from "./pages/SearchPage";
import SubCategories from "./pages/SubCategories";

import ProductFeatures from "./pages/user-dashboard/my-products/ProductFeatures";
import ProductImages from "./pages/user-dashboard/my-products/ProductImages";
import EditProduct from "./pages/user-dashboard/my-products/EditProduct";

import AddedToCartPopup from "./components/pop-ups/AddedToCartPopup";
import RemoveProductPopup from "./components/pop-ups/RemoveProductPopup";
import Payments from "./pages/user-dashboard/Payments";
import LoginForm from "./pages/LoginForm";
import AccountSetting from "./pages/user-dashboard/AccountSetting";

function App() {
  const [removeProductPopup, setRemoveProductPopup] = useState(false);
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

      {removeProductPopup && (
        <RemoveProductPopup
          onClose={() => setRemoveProductPopup(false)}
          product={selectedProduct}
          setReloadComponent={setReloadComponent}
          isRemoveCartItem={isRemoveCartItem}
        />
      )}

      {addToCartPopup && (
        <AddedToCartPopup
          onClose={() => setAddToCartPopup(false)}
          product={selectedProduct}
          // product={{ name: "Product X", price: 249.99 }}
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
                setRemoveProductPopup={setRemoveProductPopup}
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
                reloadComponent={reloadComponent}
                setReloadComponent={setReloadComponent}
                setAddToCartPopup={setAddToCartPopup}
                setSelectedProduct={setSelectedProduct}
                setRemoveProductPopup={setRemoveProductPopup}
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

          <Route path="payments" element={<Payments />} />

          <Route path="chats" element={<Chat />} />

          <Route path="chats/:chatID" element={<Chat />} />

          <Route path="add-product" element={<AddProduct />} />

          <Route path="setting" element={<AccountSetting />} />

          <Route
            path="my-products"
            element={
              <MyProducts
                setRemoveProductPopup={setRemoveProductPopup}
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
          path="/product/:id"
          element={
            <ProductDetail
              reloadComponent={reloadComponent}
              setReloadComponent={setReloadComponent}
              setAddToCartPopup={setAddToCartPopup}
              setSelectedProduct={setSelectedProduct}
              setRemoveProductPopup={setRemoveProductPopup}
            />
          }
        />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/upgrade-to-seller" element={<UpgradeToSeller />} />

        <Route
          path="/search"
          element={
            <SearchPage
              reloadComponent={reloadComponent}
              setReloadComponent={setReloadComponent}
              setAddToCartPopup={setAddToCartPopup}
              setSelectedProduct={setSelectedProduct}
              setRemoveProductPopup={setRemoveProductPopup}
            />
          }
        />

        <Route
          path="/search/:query"
          element={
            <SearchPage
              reloadComponent={reloadComponent}
              setReloadComponent={setReloadComponent}
              setAddToCartPopup={setAddToCartPopup}
              setSelectedProduct={setSelectedProduct}
              setRemoveProductPopup={setRemoveProductPopup}
            />
          }
        />

        <Route path="/category/:categoryId" element={<SubCategories />} />
      </Routes>
    </>
  );
}

export default App;
