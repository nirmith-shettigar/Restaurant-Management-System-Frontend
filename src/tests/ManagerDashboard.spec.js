import { mount } from "@vue/test-utils";
import ManagerDashboard from "../views/dashboards/manager/ManagerDashboard.vue";
import { vi, describe, it, expect } from "vitest"

describe("Manager Dashboard", () => {
    it("renders dashboard title", () => {
        const wrapper = mount(ManagerDashboard, {
            global: {
                stubs: ["router-link", "router-view"]
            }
        })
        expect(wrapper.text()).toContain("Manager Dashboard")

    })
    it("contains navigation links", ()=>{
        const wrapper = mount(ManagerDashboard, {
            global: {
                stubs: ["router-link", "router-view"]
            }
        })
        const links = wrapper.findAllComponents({name:"router-link"})
        expect(links.length).toBeGreaterThan(0)
    })
    it("renders router-view", ()=>{
        const wrapper = mount(ManagerDashboard, {
            global: {
                stubs: ["router-link", "router-view"]
            }
        })
        expect(wrapper.findComponent({name:"router-view"}).exists()).toBe(true)
    })
})