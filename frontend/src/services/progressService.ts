import api from "./api";

export const progressService = {
  getCourseProgress: (courseId: string) => api.get(`/progress/${courseId}`),
  markLectureComplete: (courseId: string, lectureId: string) =>
    api.patch(`/progress/${courseId}/lectures/${lectureId}`),
};
