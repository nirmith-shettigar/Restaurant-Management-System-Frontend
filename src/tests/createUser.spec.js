import ManagerService from "../services/ManagerService"
import { describe, expect, it, vi } from "vitest"
import CreateUser from "../views/dashboards/manager/CreateUser.vue"
import { mount } from "@vue/test-utils"

vi.mock("../services/ManagerService", () => ({
    default: {
        addUser: vi.fn()
    }
}))
describe("Create User Component", () => {
    const mockRouter = {
        push: vi.fn()
    }
    it("renders form inputs", () => {
        const wrapper = mount(CreateUser, {
            global: {
                mocks: {
                    $router: mockRouter
                }
            }
        })
        expect(wrapper.find('input[placeholder="Name"]').exists()).toBe(true)
        expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
    })
    it("updates input values using v-model", async () => {
        const wrapper = mount(CreateUser, {
            global: { mocks: { $router: mockRouter } }
        })
        await wrapper.find('input[placeholder="Name"]').setValue("Geetha")
        expect(wrapper.vm.name).toEqual("Geetha")
    })
    it("calls addUser API on submit", async () => {
        ManagerService.addUser.mockResolvedValue({})
        const wrapper = mount(CreateUser, {
            global: { mocks: { $router: mockRouter } }
        })
        await wrapper.find('input[placeholder="Name"]').setValue("Geetha")
        await wrapper.find("form").trigger("submit.prevent")
        expect(ManagerService.addUser).toHaveBeenCalled()
    })
    it("redirects after succesful creation", async () => {
        vi.useFakeTimers()
        ManagerService.addUser.mockResolvedValue({})
        const wrapper = mount(CreateUser, {
            global: { mocks: { $router: mockRouter } }
        })
        await wrapper.find("form").trigger("submit.prevent")
        vi.runAllTimers()
        expect(mockRouter.push).toHaveBeenCalledWith("/manager/users")
    })
})