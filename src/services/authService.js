import api from "./api";
import { isValidEmail, isValidPhoneNumber } from "../utils/validator";

export const register = async (userData) => {
  if (!userData.email || !userData.password || !userData.phone || userData.password.trim() === "") {
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
      role: userData.role,
    },
  });

  if (response.data.length > 0) {
    throw new Error("User already exists with this email");
  }

  response = await api.post("/users", {
    ...userData,
    role: userData.role,
  });

  return response;
};

export const login = async (credentials) => {
  if (!credentials.email || !credentials.password || !credentials.role || credentials.password.trim() === "") {
    throw new Error("All fields are required");
  }

  if (!isValidEmail(credentials.email)) {
    throw new Error("Please enter a valid email");
  }

  const response = await api.get("/users", {
    params: {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    },
  });

  if (response.data && response.data.length > 0) {
    const user = response.data[0];
    const { password, phone, ...safeUser } = user;

    return {
      user: safeUser,
      token: "dummy-token",
    };
  } else {
    throw new Error("Invalid credentials");
  }
};
