import { create } from "zustand";
import { api } from "./axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  isCheckingAuth: true,
  xyz: 32,
  AuthUser: null,
  Authtype: null,
  userdata: 1,
  isSignup: false,
  isLoginIn: false,
  currentChatuser: { username: "Jitendra", _id: "sgdhhs" },
  Chats: [
    { sender: '6910474e3e2255e439068de5', text: 'ok', image: null, _id: '6910b0dd7621918180284c80', createdAt: '2025-11-09T15:18:53.592Z' },
    { sender: '6910474e3e2255e439068de5', text: 'nice ', image: null, _id: '6910b0f27621918180284cab', createdAt: '2025-11-09T15:19:14.968Z' },
    { sender: '6910474e3e2255e439068de5', text: 'i am happy now ', image: null, _id: '6910b0f87621918180284cb1', createdAt: '2025-11-09T15:19:20.672Z' },
  ],
  messageUser: [{ _id: '690f7debafeddef52a13f95c', username: 'jitendra', email: 'pagalu@gmail.com', password: '$2b$10$ktEFiJPx4iNPAnSpDaxqAuUKMRlkre7bS1GjOOhqcuRglBSOJolu.', profile_pic: '' },
  { _id: '690f7debafeddef52a13f95c', username: 'jitendra', email: 'pagalu@gmail.com', password: '$2b$10$ktEFiJPx4iNPAnSpDaxqAuUKMRlkre7bS1GjOOhqcuRglBSOJolu.', profile_pic: '' },
  ],
  product_data: null,
  currentChatuser: null,
  Chats: [],
  userproduct: [],
  Allproduct: [],
  Tracking_id:null,
  checkAuth: async () => {
    try {
      const res = await api.get("/api/auth/me");
      set({ Authtype: res.data.user.role })
      set({ AuthUser: res.data.user });
    } catch (error) {
      console.log(error)
      set({ AuthUser: null });
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  register: async (data) => {
    set({ isSignup: true });
    try {
      console.log(data)
      const res = await api.post("/api/auth/register", data);
      set({ Authtype: res.data.user.role })
      toast.success("Successfully Account Created!");
      set({ AuthUser: res.data.user });
    } catch (error) {
      toast.error(error || "something went wrong");
    } finally {
      set({ isSignup: false });
    }
  },

  login: async (data) => {
    set({ isLoginIn: true });
    try {
      console.log(data)
      const res = await api.post("/api/auth/login", data);
      toast.success("Successfully Logged in!");
      set({ AuthUser: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoginIn: false });
    }
  },
  logout: async () => {
    set({ isloggedout: true });
    try {
      await api.post("/api/auth/logout");
      toast.success("Logout successfully");
      set({ AuthUser: null });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isloggedout: false });
    }
  },
  getmsg: async (id) => {
    try {
      // const response = await api.get(`/message/getmsg/${id}`);
      // const user = await api.get(`/user/${id}`)
      // console.log(user.data._id)
      // console.log(response.data.messages)
      // set({ Chats: response.data.messages, currentChatuser: user.data });
      console.log(id);
    } catch (error) {
      console.log(error);
    }
  },

  getpeople: async () => {
    try {
      // const response = await api.get("/message/users");
      // set({ messageUser: [] });
    } catch (error) {
      console.log(error);
    }
  },

  sendmsg: async (data) => {
    try {
      // const response = await api.post(`/message/send/${data.id}`, {
      //   text: data.text,
      //   image: data.image,
      // });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  },
  Allchatdel: async (id) => {
    try {
      // const response = await api.post(`/message/delchat/${id}`);
      const response = true;
      if (response.ok) {
        set({ Chats: [] });
      }
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  },
  AddProduct: async (data) => {
    try {
      console.log(data);
      const res = await api.post("/api/product/add", data);
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
  },
  getproduct: async () => {
    try {
      const res = await api.get("/api/product/mine");
      const data = res.data.products;
      set({ userproduct: data })
    } catch (error) {
      console.log(error)
    }
  },
  selectedproduct: async (data) => {
    try {
      const res = await api.get(`/api/product/${data}`);
      const product_data = res.data.products;
      console.log(product_data);
      set({ product_data: product_data })
    } catch (error) {
      console.log(error)
    }
  },
  GetAllProduct: async () => {
    try {
      const res = await api.get("/api/product/all");
      const data = res.data.products;
      set({ Allproduct: data })
      console.log(res.data.products)
    } catch (error) {
      console.log(error)
    }
  },
  Buy:async(data)=>{
    try {
      console.log(data);
      const res = await api.post("/api/shop/payment",data)
      // console.log(res.data.tracking_id);
      set({Tracking_id:res.data.tracking_id});
    } catch (error) {
      console.log(error)
    }
  },

}));
