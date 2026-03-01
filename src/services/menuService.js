import axiosInstance from "./api";

export const getMenuItems = async () => {
  const response = await axiosInstance.get("/menuItems");
  return response.data;
};
