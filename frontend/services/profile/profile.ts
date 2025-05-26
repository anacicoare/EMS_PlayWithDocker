import axiosInstance from "../axiosInstance";

export const ProfileServices = {
    //Get project members
    callApiGetUserData: (email: any) => {
        return axiosInstance.get(`/profile/profile/`);
    },
    getAllUsers: () => {
        return axiosInstance.get(`/all_users/`);
    },
    callApiUpdateProfilePicture: (formData: FormData) => {
        return axiosInstance.post('/upload_profile_pic/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Remove the boundary as axios will set it automatically
            },
        });
    }
}