import axiosInstance from "../axiosInstance";

export const PaymentServices = {
    // Fetch all payments
    getPayments: () => {
        return axiosInstance.get(`/payments/`);
    },

    // Create a new payment
    createPayment: (data: any) => {
        return axiosInstance.post(`/payments/`, data);
    },
};
