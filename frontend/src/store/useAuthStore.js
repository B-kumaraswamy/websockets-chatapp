import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth store", error.response?.data.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup store", error.response?.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data?.message);
      console.log("Error in logout store", error.response?.data.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      toast.success("Logged in successfully");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data.message);
      console.log("Error in login store", error.response?.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      // throw new Error("Force failure after request");
      set({ authUser: response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(
        "Error in update profile store",
        error.response?.data.message,
      );
      startTransition(() => {
        setOptimisticImg(authUser?.profilePic); // reset to old one
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    console.log("connecting socket");
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    set({ socket });
    socket.connect();

    socket.on("getOnlineUsers", (onlineUsers) => {
      set({ onlineUsers });
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
