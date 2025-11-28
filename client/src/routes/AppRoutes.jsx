import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import CreateAccountForm from "../pages/CreateAccountForm";
import UpgradeToSeller from "../pages/UpgradeToSeller";
import UserDashboard from "../pages/UserDashboard";
import ProductDetail from "../pages/ProductDetail";
import About from "../pages/About";
import Team from "../pages/Team";
import SearchPage from "../pages/SearchPage";
import SubCategories from "../pages/SubCategories";
import CollectionPage from "../pages/CollectionPage";

import Profile from "../pages/user-dashboard/Profile";
import Favorites from "../pages/user-dashboard/Favorites";
import Cart from "../pages/user-dashboard/Cart";
import Orders from "../pages/user-dashboard/Orders";
import AddProduct from "../pages/user-dashboard/AddProduct";
import MyProducts from "../pages/user-dashboard/MyProducts";
import Chat from "../pages/user-dashboard/Chat";
import Notifications from "../pages/user-dashboard/Notifications";

import ProductFeatures from "../pages/user-dashboard/my-products/ProductFeatures";
import ProductImages from "../pages/user-dashboard/my-products/ProductImages";
import EditProduct from "../pages/user-dashboard/my-products/EditProduct";

import Payments from "../pages/user-dashboard/Payments";
import LoginForm from "../pages/LoginForm";
import AccountSetting from "../pages/user-dashboard/AccountSetting";

import ChangePassword from "../pages/user-dashboard/account-setting/ChangePassword";
import ChangeUsername from "../pages/user-dashboard/account-setting/ChangeUsername";
import StoreSetting from "../pages/user-dashboard/account-setting/StoreSetting";

export default function AppRoutes({ user }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/account" element={<UserDashboard user={user} />}>
        <Route path="profile" element={<Profile />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payments />} />
        <Route path="chats" element={<Chat />} />
        <Route path="chats/:chatID" element={<Chat />} />

        <Route path="add-product" element={<AddProduct />} />

        <Route path="setting" element={<AccountSetting />} />
        <Route path="setting/change-password" element={<ChangePassword />} />
        <Route path="setting/change-username" element={<ChangeUsername />} />
        <Route path="setting/store-setting" element={<StoreSetting />} />

        <Route path="my-products" element={<MyProducts />} />
        <Route path="my-products/features/:id" element={<ProductFeatures />} />
        <Route path="my-products/images/:id" element={<ProductImages />} />
        <Route path="my-products/edit/:id" element={<EditProduct />} />
      </Route>

      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/create-account" element={<CreateAccountForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/upgrade-to-seller" element={<UpgradeToSeller />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search/:query" element={<SearchPage />} />
      <Route path="/category/:categoryId" element={<SubCategories />} />
      <Route path="/team" element={<Team />} />
      <Route path="/about" element={<About />} />
      <Route path="/collection/:id" element={<CollectionPage />} />
    </Routes>
  );
}
