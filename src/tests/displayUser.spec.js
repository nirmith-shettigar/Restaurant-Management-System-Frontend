import { flushPromises, mount } from "@vue/test-utils";
import DisplayUser from "../views/dashboards/manager/DisplayUser.vue";
import ManagerService from "../services/ManagerService";
import { vi, describe, it, expect } from "vitest"

vi.mock("../services/ManagerService", () => ({
    default: {
        getUsers: vi.fn()
    }
}))
const mockUsers = [
    { id: 1, name: "A", email: "a@test.com", phone: "111", role: "chef" },
    { id: 2, name: "B", email: "b@test.com", phone: "222", role: "waiter" }
]
describe("Display Users List", () => {
    it("loads users on mounted", async () => {
        ManagerService.getUsers.mockResolvedValue({
            data: mockUsers
        })
        const wrapper = mount(DisplayUser)
        await Promise.resolve()
        expect(wrapper.vm.users.length).toBe(2)
    })
    it("renders users in table", async () => {
        ManagerService.getUsers.mockResolvedValue({
            data: mockUsers
        })
        const wrapper = mount(DisplayUser)
        await flushPromises()
        expect(wrapper.text()).toContain("A")
        expect(wrapper.text()).toContain("B")
    })
    it("filters users by role", async () => {
        ManagerService.getUsers.mockResolvedValue({
            data: mockUsers
        })
        const wrapper = mount(DisplayUser)
        await Promise.resolve()
        wrapper.vm.selectedRole = "chef"
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.filterUsers.length).toBe(1)
        expect(wrapper.vm.filterUsers[0].role).toBe("chef")
    })
})