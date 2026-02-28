import { mount } from "@vue/test-utils";
import FilterUser from "../views/dashboards/manager/FilterUser.vue";
import {describe, it, expect} from "vitest"

describe("Filter user component", ()=>{
    it("renders select options", ()=>{
        const wrapper = mount(FilterUser)
        expect(wrapper.find("select").exists()).toBe(true)
    })
    it("emits update when modelValue changed", async()=>{
        const wrapper = mount(FilterUser, {
            props:{
                modelValue:""
            }
        })
        await wrapper.find("select").setValue("chef")
        expect(wrapper.emitted("update:modelValue")[0]).toEqual(["chef"])
    })
})
