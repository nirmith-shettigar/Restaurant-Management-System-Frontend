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
            throw new Error("Please enter a valid phone number");
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


export const login = async (credentials) => {
    try {
        if (!credentials.email || !credentials.password || !credentials.role) {
            throw new Error("All fields are required");
        }

        if (!isValidEmail(credentials.email)) {
            throw new Error("Please enter a valid email");
        }

        const response = await api.get("/users", {
            params: {
                email: credentials.email,
                password: credentials.password,
                role : credentials.role
            },
        });

        if (response.data && response.data.length > 0) {
            const user = response.data[0];
            const { password, number, ...safeUser } = user;
           
            return {
                user: safeUser,
                token: "dummy-token"
            };
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        throw error;
    }
};