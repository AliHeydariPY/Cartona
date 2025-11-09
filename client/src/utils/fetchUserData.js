import api from "../api/api";
import { getDefaultStore } from "jotai";
import { userAtom } from "../atoms/userAtom";

const store = getDefaultStore();

export const fetchUserData = async () => {
  try {
    const res = await api.get("/user-api/users/");
    console.log(res)
    if (res.data && res.data.length > 0) {
      store.set(userAtom, res.data[0]);
      console.log("🚀 ~ fetchUserData ~ res.data[0]:", res.data[0])
    } else {
      store.set(userAtom, null);
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    store.set(userAtom, null);
  }
};
