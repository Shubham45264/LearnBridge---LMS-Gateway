import api from "./api";

export const paymentService = {
  createStripeSession: (courseId: string) =>
    api.post("/purchase/checkout/create-checkout-session", { courseId }),
  enrollFree: (courseId: string) =>
    api.post("/purchase/enroll-free", { courseId }),
  getPurchasedCourses: () => api.get("/purchase"),
};
