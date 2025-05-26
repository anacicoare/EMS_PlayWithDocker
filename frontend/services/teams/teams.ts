import axiosInstance from "../axiosInstance";

export const TeamsServices = {
    //Get project members
    getAllUsers: () => {
        return axiosInstance.get(`/profile/`);
    },
    getTeams: () => {
        return axiosInstance.get(`/teams/`);
    },
    getUserColleagues: () => {
        return axiosInstance.get(`/get_user_colleagues/`);
    },
    createTeam: (data: any) => {
        return axiosInstance.post(`/teams/`, data);
    },
    updateTeam: (data: any) => {
        return axiosInstance.put(`/teams/`, data);
    },
    getSpecificTeamDetails: (id: any) => {
        return axiosInstance.get(`/teams/${id}/`);
    },
}