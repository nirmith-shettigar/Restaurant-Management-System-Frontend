import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { describe, it, expect } from "vitest";

const FilterUser = defineComponent({
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  template: `<select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option value="">All Roles</option>
        <option value="chef">Chef</option>
        <option value="waiter">Waiter</option>
        <option value="customer">Customer</option>
    </select>`,
});

describe("Filter user component", () => {
  it("renders select options", () => {
    const wrapper = mount(FilterUser);
    expect(wrapper.find("select").exists()).toBe(true);
  });
  it("emits update when modelValue changed", async () => {
    const wrapper = mount(FilterUser, {
      props: {
        modelValue: "",
      },
    });
    await wrapper.find("select").setValue("chef");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["chef"]);
  });
});
