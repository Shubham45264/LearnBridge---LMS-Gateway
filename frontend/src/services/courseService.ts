import api from "./api";

export const courseService = {
  getPublished: () => api.get("/course/published"),
  search: (query: string) => api.get(`/course/search?query=${query}`),
  getCourse: (id: string) => api.get(`/course/c/${id}`),
  getLectures: (id: string) => api.get(`/course/c/${id}/lectures`),
  createCourse: (data: FormData) =>
    api.post("/course/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateCourse: (id: string, data: FormData) =>
    api.patch(`/course/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  publishCourse: (id: string, publish = true) => api.patch(`/course/${id}/publish?publish=${publish}`),
  addLecture: (courseId: string, data: FormData) =>
    api.post(`/course/${courseId}/lecture`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  getInstructorCourses: () => api.get("/course/instructor"),
};
