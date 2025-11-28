import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAtom } from "jotai";

import { userAtom } from "./atoms/userAtom";
import { tokenAtom } from "./atoms/tokenAtom";
import { addToCartPopupAtom, selectedProductAtom } from "./atoms/popupAtom";

import AddedToCartPopup from "./components/pop-ups/AddedToCartPopup";
import AppRoutes from "./routes/AppRoutes";
import { fetchUserData } from "./utils/fetchUserData";

function App() {
  const [user] = useAtom(userAtom);
  const [accessToken] = useAtom(tokenAtom);

  const [addToCartPopup, setAddToCartPopup] = useAtom(addToCartPopupAtom);
  const [selectedProduct] = useAtom(selectedProductAtom);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetchUserData();
    }
  }, [accessToken]);

  return (
    <>
      <Toaster
        position="top-center"
        gutter={12}
        toastOptions={{ duration: 3000 }}
      />

      {addToCartPopup && (
        <AddedToCartPopup
          onClose={() => setAddToCartPopup(false)}
          product={selectedProduct}
        />
      )}

      <AppRoutes user={user} />
    </>
  );
}

export default App;
