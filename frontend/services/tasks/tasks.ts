import axiosInstance from "../axiosInstance";

export const TasksServices = {
    getTasks: () => {
        return axiosInstance.get(`/tasks/`);
    },
    createTask: (data: any) => {
        return axiosInstance.post(`/tasks/`, data);
    },
    getSpecificTaskDetails: (id: any) => {
        return axiosInstance.get(`/tasks/${id}/`);
    },
    deleteTask: (id: any) => {
        return axiosInstance.delete(`/tasks/${id}/`);
    },
    updateTask: (id: any, data: any) => {
        return axiosInstance.put(`/tasks/${id}/`, data);
    }
}