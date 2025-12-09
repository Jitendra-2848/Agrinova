import { create } from "zustand";
import { api } from "./axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  // AUTH STATES
  isCheckingAuth: true,
  AuthUser: null,
  Authtype: null,
  isSignup: false,
  isLoginIn: false,
  isUpdating: false,
  isloggedout: false,

  // CHAT STATES
  currentChatuser: null,
  Chats: [],
  messageUser: [],
  conversations: [],
  activeOffers: [],
  acceptedOffers: [],

  // PRODUCT STATES
  product_data: null,
  userproduct: [],
  Allproduct: [],
  buy_product: null,

  // NEGOTIATION STATES
  negotiation_product: null,
  negotiated_deal: null,

  // ORDER / TRACKING STATES
  Tracking_id: null,
  trackingData: null,
  Myorder: [],
  orders_farmer: [],

  // TRANSPORT / JOB STATES
  jobdata: null,
  activejobdata: [],
  Del_history: [],
  transporter_income: null,
  overview_detail: [],

  // -----------------------------
  // AUTH METHODS
  // -----------------------------

  checkAuth: async () => {
    try {
      const res = await api.get("/api/auth/me");
      set({ Authtype: res.data.user.role });
      set({ AuthUser: res.data.user });
    } catch (error) {
      console.log(error);
      set({ AuthUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (data) => {
    set({ isSignup: true });
    try {
      const res = await api.post("/api/auth/register", data);
      set({ Authtype: res.data.user.role });
      set({ AuthUser: res.data.user });
      toast.success("Successfully Account Created!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSignup: false });
    }
  },

  login: async (data) => {
    set({ isLoginIn: true });
    try {
      const res = await api.post("/api/auth/login", data);
      set({ AuthUser: res.data.user });
      set({ Authtype: res.data.user.role });
      toast.success("Successfully Logged in!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoginIn: false });
    }
  },

  logout: async () => {
    set({ isloggedout: true });
    try {
      await api.post("/api/auth/logout");
      set({ AuthUser: null, Authtype: null });
      toast.success("Logout successfully");
    } catch (error) {
      console.log(error);
    } finally {
      set({ isloggedout: false });
    }
  },

  // -----------------------------
  // CHAT METHODS
  // -----------------------------

  getmsg: async (odId) => {
    try {
      const res = await api.post("/api/message/get", { odId });
      set({
        Chats: res.data.messages || [],
        activeOffers: res.data.activeOffers || [],
        acceptedOffers: res.data.acceptedOffers || [],
      });
      return res.data;
    } catch (error) {
      console.error("getmsg error:", error);
      set({ Chats: [], activeOffers: [], acceptedOffers: [] });
      return { messages: [], activeOffers: [], acceptedOffers: [] };
    }
  },

  sendmsg: async (data) => {
    try {
      const res = await api.post("/api/message/send", data);
      set((state) => ({
        Chats: [...state.Chats, res.data],
      }));
      return res.data;
    } catch (error) {
      console.error("sendmsg error:", error);
      toast.error("Failed to send message");
      throw error;
    }
  },

  sendOffer: async (data) => {
    try {
      const res = await api.post("/api/message/offer", data);
      set((state) => ({
        Chats: [...state.Chats, res.data.message],
        activeOffers: [...state.activeOffers, res.data.offer],
      }));
      return res.data;
    } catch (error) {
      console.error("sendOffer error:", error);
      toast.error(error?.response?.data?.message || "Failed to send offer");
      throw error;
    }
  },

  respondToOffer: async (data) => {
    try {
      const res = await api.post("/api/message/offer/respond", data);

      if (data.action === "accept") {
        set((state) => ({
          Chats: [...state.Chats, res.data.message],
          activeOffers: state.activeOffers.filter(
            (offer) => offer.offerId !== data.offerId
          ),
          acceptedOffers: [...state.acceptedOffers, res.data.offer],
        }));
      } else {
        set((state) => ({
          Chats: [...state.Chats, res.data.message],
          activeOffers: state.activeOffers.map((offer) =>
            offer.offerId === data.offerId ? res.data.offer : offer
          ),
        }));
      }

      return res.data;
    } catch (error) {
      console.error("respondToOffer error:", error);
      toast.error("Failed to respond to offer");
      throw error;
    }
  },

  getpeople: async () => {
    try {
      const res = await api.get("/api/message/users");
      set({ messageUser: res.data || [] });
      return res.data;
    } catch (error) {
      console.error("getpeople error:", error);
      set({ messageUser: [] });
      return [];
    }
  },

  getConversations: async (role) => {
    try {
      const res = await api.post("/api/message/conversations", { role });
      set({ conversations: res.data || [] });
      return res.data;
    } catch (error) {
      console.error("getConversations error:", error);
      set({ conversations: [] });
      return [];
    }
  },

  Allchatdel: async (odId) => {
    try {
      await api.post("/api/message/delete", { odId });
      set({ Chats: [], activeOffers: [], acceptedOffers: [] });
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Allchatdel error:", error);
      toast.error("Failed to delete chat");
    }
  },

  setCurrentChatUser: (user) => set({ currentChatuser: user }),

  clearCurrentChat: () => {
    set({
      currentChatuser: null,
      Chats: [],
      activeOffers: [],
      acceptedOffers: [],
    });
  },

  // Start chat with a specific user (for navigation from product page)
  startChatWithUser: async (userId) => {
    try {
      const res = await api.get(`/api/auth/user/${userId}`);
      const user = res.data.user || res.data;
      if (!user || !user._id) {
        console.error("Invalid user data received:", user);
        throw new Error("User not found");
      }
      set({ currentChatuser: user });
      await get().getmsg(userId);
      return user;
    } catch (error) {
      console.error("startChatWithUser error:", error);
      throw error;
    }
  },
  getProductsByFarmer: async (farmerId) => {
    try {
      const res = await api.get(`/api/product/farmer/${farmerId}`);
      return res.data.products || [];
    } catch (error) {
      console.error("getProductsByFarmer error:", error);
      return [];
    }
  },

  addMessage: (message) => {
    set((state) => ({
      Chats: [...state.Chats, message],
    }));
  },

  updateOffer: (updatedOffer) => {
    if (updatedOffer.status === "accepted") {
      set((state) => ({
        activeOffers: state.activeOffers.filter(
          (o) => o.offerId !== updatedOffer.offerId
        ),
        acceptedOffers: [...state.acceptedOffers, updatedOffer],
      }));
    } else {
      set((state) => ({
        activeOffers: state.activeOffers.map((o) =>
          o.offerId === updatedOffer.offerId ? updatedOffer : o
        ),
      }));
    }
  },

  addOffer: (offer) => {
    set((state) => ({
      activeOffers: [...state.activeOffers, offer],
    }));
  },

  // -----------------------------
  // NEGOTIATION METHODS
  // -----------------------------

  setNegotiationProduct: (product) => set({ negotiation_product: product }),

  clearNegotiationProduct: () => set({ negotiation_product: null }),

  setNegotiatedDeal: (price, quantity, product) => {
    set({
      negotiated_deal: {
        negotiatedPrice: price,
        quantity: quantity,
        product: product
      }
    });
  },

  clearNegotiatedDeal: () => set({ negotiated_deal: null }),
  AddProduct: async (data) => {
    const id = toast.loading("Adding...");
    try {
      const res = await api.post("/api/product/add", data);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
      toast.error(error.response.data.message);
    } finally {
      toast.dismiss(id);
    }
  },


  getproduct: async () => {
    try {
      const res = await api.get("/api/product/mine");
      set({ userproduct: res.data.products });
    } catch (error) {
      console.log(error);
    }
  },

  selectedproduct: async (id) => {
    try {
      const res = await api.get(`/api/product/${id}`);
      set({ product_data: res.data.products });
    } catch (error) {
      console.log(error);
    }
  },

  deleteProduct: async (product_id) => {
    try {
      const res = await api.delete("/api/product/delete", {
        data: { product_id },
      });
      toast.success(res.data.message);

      set((state) => ({
        userproduct: state.userproduct.filter((p) => p._id !== product_id),
      }));
    } catch (error) {
      toast.error("Delete failed");
      console.log(error);
    }
  },

  GetAllProduct: async () => {
    try {
      const res = await api.get("/api/product/all");
      set({ Allproduct: res.data.products });
    } catch (error) {
      console.log(error);
    }
  },

  updateProduct: async (data) => {
    try {
      await api.put("/api/product/edit", data);
    } catch (error) {
      console.log(error);
    }
  },
  updateprofile: async (data) => {
    try {
      await api.put("/api/auth/profileupdate", data);
    } catch (error) {
      console.log(error);
    }
  },
  // -----------------------------
  // ORDER / PAYMENT
  // -----------------------------

  Buy: async (data) => {
    try {
      const res = await api.post("/api/shop/payment", data);
      set({ Tracking_id: res.data.tracking_id });
      // Clear negotiation after successful purchase
      set({ negotiated_deal: null, negotiation_product: null });
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      throw error;
    }
  },

  setBuyProduct: (product) => set({ buy_product: product }),

  RemoveBuy: () => set({
    buy_product: null,
    Tracking_id: null,
    trackingData: null,
    negotiated_deal: null,
    negotiation_product: null,
  }),

  Checkorder: async (data) => {
    try {
      const res = await api.post("/api/track/all", { id: data });
      set({ Myorder: res.data.tracks });
    } catch (error) {
      console.log(error);
    }
  },

  track_order: async (id) => {
    try {
      set({ trackingData: null });
      const res = await api.post("/api/track/track", { id });
      set({ trackingData: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  // -----------------------------
  // TRANSPORT / JOB METHODS
  // -----------------------------

  findjob: async () => {
    try {
      const res = await api.get("/api/transport/findjob");
      set({ jobdata: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  acceptjob: async (data) => {
    try {
      const job = {
        tracking_id: data.tracking_id,
        pincode: data.reached,
        earning: data.charge,
        distance: data?.products?.[0]?.distance,
      };
      await api.put("/api/transport/accept_transport", job);
    } catch (error) {
      console.log(error);
    }
  },

  activejob: async () => {
    try {
      const res = await api.get("/api/transport/active");
      set({ activejobdata: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  updatejob: async (data) => {
    try {
      await api.put("/api/transport/update", data);
    } catch (error) {
      console.log(error);
    }
  },

  Delivered: async (data) => {
    try {
      await api.put("/api/transport/delivered", data);
    } catch (error) {
      console.log(error);
    }
  },

  Delivery_history: async () => {
    try {
      const res = await api.get("/api/transport/history");
      const data = res.data.data;

      const totalCharge = data.reduce((sum, x) => sum + (x.charge || 0), 0);

      set({
        transporter_income: totalCharge,
        Del_history: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  user_detail: async () => {
    try {
      const type = get().Authtype;
      const res = await api.get(`/api/user_detail/${type}`);
      set({ overview_detail: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  vieworder: async () => {
    try {
      const res = await api.get("/api/track/view");
      set({ orders_farmer: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },
}));