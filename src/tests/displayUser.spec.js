import { flushPromises, mount } from "@vue/test-utils";
import DisplayUser from "../views/dashboards/manager/DisplayUser.vue";
import { vi, describe, it, expect } from "vitest"

vi.mock("../services/ManagerService", () => ({
    getUsers: vi.fn()
}))

vi.mock("vue-sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
    Toaster: { template: "<div />" }
}))

import { getUsers } from "../services/ManagerService"

const mockUsers = [
    { id: 1, name: "A", email: "a@test.com", phone: "111", role: "chef" },
    { id: 2, name: "B", email: "b@test.com", phone: "222", role: "waiter" }
]
describe("Display Users List", () => {
    it("loads users on mounted", async () => {
        getUsers.mockResolvedValue(mockUsers)
        const wrapper = mount(DisplayUser)
        await Promise.resolve()
        expect(wrapper.vm.users.length).toBe(2)
    })
    it("renders users in table", async () => {
        getUsers.mockResolvedValue(mockUsers)
        const wrapper = mount(DisplayUser)
        await flushPromises()
        expect(wrapper.text()).toContain("a@test.com".split("@")[0])
        expect(wrapper.text()).toContain("b@test.com".split("@")[0])
    })
    it("filters users by role", async () => {
        getUsers.mockResolvedValue(mockUsers)
        const wrapper = mount(DisplayUser)
        await Promise.resolve()
        wrapper.vm.selectedRole = "chef"
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.filterUsers.length).toBe(1)
        expect(wrapper.vm.filterUsers[0].role).toBe("chef")
    })
})