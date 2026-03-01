import { describe, expect, it, vi, beforeEach } from "vitest"
import CreateUser from "../../views/dashboards/manager/CreateUser.vue"
import { mount } from "@vue/test-utils"
import { register } from "../../services/authService"

vi.mock("../../services/authService", () => ({
    register: vi.fn()
}))

const mockPush = vi.fn()
vi.mock("vue-router", () => ({
    useRouter: () => ({
        push: mockPush
    })
}))

describe("Create User Component", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders form inputs", () => {
        const wrapper = mount(CreateUser)
        expect(wrapper.find('input[placeholder="Enter email address"]').exists()).toBe(true)
        expect(wrapper.find('input[placeholder="Enter password"]').exists()).toBe(true)
    })
    it("updates input values using v-model", async () => {
        const wrapper = mount(CreateUser)
        await wrapper.find('input[placeholder="Enter email address"]').setValue("test@example.com")
        expect(wrapper.vm.email).toEqual("test@example.com")
    })
    it("calls addUser API on submit", async () => {
        register.mockResolvedValue({})
        const wrapper = mount(CreateUser)
        await wrapper.find('input[placeholder="Enter email address"]').setValue("test@example.com")
        await wrapper.find("form").trigger("submit.prevent")
        expect(register).toHaveBeenCalled()
    })
    it("redirects after succesful creation", async () => {
        vi.useFakeTimers()
        register.mockResolvedValue({})
        const wrapper = mount(CreateUser)
        await wrapper.find("form").trigger("submit.prevent")
        await Promise.resolve()
        vi.runAllTimers()
        expect(mockPush).toHaveBeenCalledWith("/manager/users")
    })
})