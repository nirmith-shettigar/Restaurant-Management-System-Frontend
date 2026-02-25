import axiosInstance from "./api";

export default {
  addUser(user){
    return axiosInstance.post('/users', user)
  },

  getUsers(){
    return axiosInstance.get('/users')
  }
}