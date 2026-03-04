import api from "./api";

export const authService = {
  signup: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/user/signup", data),
  signin: (data: { email: string; password: string }) =>
    api.post("/user/signin", data),
  signout: () => api.post("/user/signout"),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: FormData) =>
    api.patch("/user/profile", data, { headers: { "Content-Type": "multipart/form-data" } }),
};
