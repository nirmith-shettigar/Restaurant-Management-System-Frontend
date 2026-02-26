import axiosInstance from "./api";

export const getMenuItems = async () => {
  try {
    const response = await axiosInstance.get("/menuItems");
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};
