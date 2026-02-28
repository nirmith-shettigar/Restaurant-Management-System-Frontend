import { describe, it, expect } from "vitest"
import MockAdapter from "axios-mock-adapter"
import axiosInstance from "../services/api.js"
import { register } from "../services/authService.js"

const mock = new MockAdapter(axiosInstance)
describe("Auth service apis", () => {
    it("Get User API", async () => {
        const mockUser = {
            "name": "Geetha",
            "email": "bhumireddybsaigeetha@gmail.com",
            "phone": "9014580108",
            "password": "Reddygeetha@2004",
        }
        mock.onGet("/users").reply(200, mockUser)
        const response = await axiosInstance.get("/users")
        expect(response.data).toEqual(mockUser)
    })

    it("Post User API", async () => {
        const mockUser = {
            "name": "Geetha",
            "email": "bhumireddybsaigeetha@gmail.com",
            "phone": "9014580108",
            "password": "Reddygeetha@2004",
            "role": "waiter"
        }
        mock.onPost("/users").reply(201, mockUser)
        const response = await axiosInstance.post("/users")
        expect(response.data).toEqual(mockUser)
    })
})

describe("invalid registration cases", () => {
    it.skip("all blank feilds return exception", async () => {
        await expect(register({
            email: '',
            password: '',
            phone: ''
        })).rejects.toThrow("All fields are required")
    })

})