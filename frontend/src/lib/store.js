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
  isUpdating:false,
  buy_product: null,
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
  Myorder:[],
  trackingData:null,
  contact_transporter:null, 
  jobdata:null,
  activejobdata:[],
  Del_history:[],
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
      toast.success(res.data.message);
    } catch (error) {
      console.log(error)
    }
  },
  getproduct: async () => {
    try {
      const res = await api.get("/api/product/mine");
      const data = res.data.products;
      set({ userproduct: data })
      console.log(data);
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
  deleteProduct: async (product_id) => {
  try {
    const res = await api.delete("/api/product/delete", {
      data: { product_id }   // ← you forgot "data:" here
    });
    toast.success(res.data.message);

    // Instantly remove from UI (optional but smooth)
    set((state) => ({
      userproduct: state.userproduct.filter((p) => p._id !== product_id)
    }));
  } catch (error) {
    toast.error("Delete failed");
    console.log(error);
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
      console.log(res.data);
      set({Tracking_id:res.data.tracking_id});
    } catch (error) {
      console.log(error)
    }
  },
  updateProduct:async(data)=>{
    try {
      const res = await api.put("/api/product/edit",data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  },
  updateProfile:async(data)=>{
    try {
      set({isUpdating:true});
      const res = await api.put("/api/auth/profileupdate",data);
      toast.success(res.data.message);
    } catch (error) {
      set({isUpdating:false});
      console.log(error)
    }
    finally{
      set({isUpdating:false});
    }
  },
  setBuyProduct: (product) => set({ buy_product: product }),
  RemoveBuy:async()=>{
    try{
      set({buy_product:null});
      set({Tracking_id:null});
      set({trackingData:null})
    }
    catch(error){
      console.log(error)
    }
  },
  Checkorder:async(data)=>{
    try {
      const x = {id:data}
      const res = await api.post("/api/track/all",x)
      console.log(res.data.tracks);
      set({Myorder:res.data.tracks})
    } catch (error) {
      console.log(error);
    }
  },
  track_order:async(data)=>{
    const id = {id:data}
    try {
      set({trackingData:null});
      console.log(data)
      const res = await api.post("/api/track/track",id)
      console.log(res.data)
      set({trackingData:res.data})
    } catch (error) {
      console.log(error)
    }
  },
  findjob:async()=>{
    try {
      const res = await api.get("/api/transport/findjob");
      console.log(res.data.data);
      set({jobdata:res.data.data});
    } catch (error) {
      console.log(error)
    }
  },
  acceptjob:async(data)=>{
    try {
      const job = {tracking_id:data.tracking_id, pincode:data.reached}
      const res = await api.put("/api/transport/accept_transport",job);
      console.log(res.data);  
    } catch (error) {
      console.log(error)
      
    }
  },
  activejob:async()=>{
    try {
      const res = await api.get("/api/transport/active");
      console.log(res.data);
      set({activejobdata:res.data})
    } catch (error) {
      console.log(error)
    }
  },
  updatejob:async(data)=>{
    try {
      const res = await api.put("/api/transport/update",data);
      console.log(res.data);
    } catch (error) {
      console.log(error)  
    }
  },
  Delivered:async(data)=>{
    try {
      console.log(data)
      const res = await api.put("/api/transport/delivered",data);
      console.log(res.data);
    } catch (error) {
      console.log(error)
    }
  },
  Delivery_history:async()=>{
    try {
      const res = await api.get("/api/transport/history");
      console.log(res.data);
      set({Del_history:res.data});
    } catch (error) {
      console.log(error)
    }
  },
}));
