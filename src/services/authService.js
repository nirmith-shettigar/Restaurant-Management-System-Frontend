import api from "./api";
import { isValidEmail, isValidPhoneNumber } from '../utils/validator'

export const register = async (userData) => {
    try {
        if (!userData.email || !userData.password || !userData.phone) {
            throw new Error("All fields are required");
        }

        if (!isValidEmail(userData.email)) {
            throw new Error("Please enter a valid email");
        }

        if (!isValidPhoneNumber(userData.phone)) {
            throw new Error("Plese enter a valid phone number");
        }

        let response = await api.get("/users", {
            params: {
                email: userData.email,
                role: "CUSTOMER"
            }
        })

        if (response.data.length > 0) {
            throw new Error("User already exists with this email");
        }

        response = await api.post("/users", {
            ...userData,
            role: "CUSTOMER",
        });

        return response;
    } catch (error) {
        throw error;
    }
};