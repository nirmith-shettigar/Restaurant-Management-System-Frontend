import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MenuItem from "../../components/menu/MenuItem.vue";

const mockItem = {
  id: 1,
  name: "Butter Chicken",
  description: "Creamy tomato-based chicken curry",
  price: 250,
  image: "https://example.com/butter-chicken.jpg",
};

describe("MenuItem.vue", () => {
  it("renders the item name", () => {
    const wrapper = mount(MenuItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain("Butter Chicken");
  });

  it("renders the item price with rupee symbol", () => {
    const wrapper = mount(MenuItem, { props: { item: mockItem } });
    expect(wrapper.text()).toContain("₹250");
  });
});
