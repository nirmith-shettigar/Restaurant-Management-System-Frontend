import { describe, it, expect, vi } from "vitest"
import axiosInstance from "../services/api.js"
import { register } from "../services/authService.js"


vi.mock("../services/api.js", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}))

describe("Auth service apis", () => {
    it("Get User API", async () => {
        const mockUser = {
            "name": "Geetha",
            "email": "bhumireddybsaigeetha@gmail.com",
            "phone": "9014580108",
            "password": "Reddygeetha@2004",
        }
        axiosInstance.get.mockResolvedValue({
            data: mockUser
        })
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
        axiosInstance.post.mockResolvedValue({
            data: mockUser
        })
        const response = await axiosInstance.post("/users")
        expect(response.data).toEqual(mockUser)
    })
})

describe("invalid registration cases", () => {
    it("all blank feilds return exception", async () => {
        await expect(register({
            email: '',
            password: '',
            phone: ''
        })).rejects.toThrow("All fields are required")
    })

    it("invalid email should return exception", async () => {
        await expect(register({
            email: 'geetha@hhweurhw',
            password: 'dfdf',
            phone: '9014580108'
        })).rejects.toThrow("Please enter a valid email")
    })

    it("invalid phone number returns exception", async () => {
        await expect(register({
            email: 'geetha@gmail.com',
            password: 'dfdf',
            phone: '901458'
        })).rejects.toThrow("Plese enter a valid phone number")
    })

    it("throws error if user exists already", async () => {
        axiosInstance.get.mockResolvedValue({
            data: [{ email: "geethabhumireddy51@gmail.com" }]
        })

        await expect(register({
            email: "geethabhumireddy51@gmail.com",
            password: 'dfdf',
            phone: '9014580108'
        })).rejects.toThrow("User already exists with this email")
    })

})