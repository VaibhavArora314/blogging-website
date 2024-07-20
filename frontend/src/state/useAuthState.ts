import axios from "axios";
import { create } from "zustand";
import { IUser } from "../utils/types";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  fetchUser: () => void;
  clear: () => void;
}

const getUserDetails = async (): Promise<IUser | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const { data } = await axios.get("/api/v1/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data?.user;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};

const useAuthState = create<AuthState>((set) => ({
  user: null,
  loading: true,
  fetchUser: async () => {
    const newUser = await getUserDetails();
    set({ user: newUser, loading: false });
  },
  clear: () => {
    set({user: null})
  }
}));

// useAuthState.getState().fetchUser();

export default useAuthState;
