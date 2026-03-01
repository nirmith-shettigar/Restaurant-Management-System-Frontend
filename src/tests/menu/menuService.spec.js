import { describe, it, expect, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import api from "../../services/api";
import { getMenuItems } from "../../services/menuService";

const mock = new MockAdapter(api);

afterEach(() => {
  mock.reset();
});

describe("menuService - getMenuItems", () => {
  it("returns all menu items on success", async () => {
    const items = [
      { id: 1, name: "Margherita Pizza", price: 12.99, category: "Pizza" },
      { id: 2, name: "Caesar Salad", price: 8.49, category: "Salad" },
      { id: 3, name: "Tiramisu", price: 5.99, category: "Dessert" },
    ];
    mock.onGet("/menuItems").reply(200, items);

    const result = await getMenuItems();

    expect(result).toEqual(items);
  });

  it("throws on a server error (500)", async () => {
    mock.onGet("/menuItems").reply(500);

    await expect(getMenuItems()).rejects.toThrow();
  });
});
