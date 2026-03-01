import { describe, it, expect } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { mount, flushPromises } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import Register from "../../views/auth/Register.vue";
import api from "../../services/api";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { template: "<div />" } },
    { path: "/login", component: { template: "<div />" } },
    { path: "/register", component: { template: "<div />" } },
  ],
});

const mountRegister = () =>
  mount(Register, {
    global: {
      plugins: [router],
      stubs: { "router-link": { template: "<a><slot /></a>" } },
    },
  });

describe("Register.vue - rendering", () => {
  it("renders the registration form with all fields", () => {
    const wrapper = mountRegister();
    expect(wrapper.find("input[type='email']").exists()).toBe(true);
    expect(wrapper.find("input[type='tel']").exists()).toBe(true);
    expect(wrapper.find("input[type='password']").exists()).toBe(true);
    expect(wrapper.find('button[type="submit"], button').exists()).toBe(true);
  });
});

describe("Register.vue – validation errors", () => {
  it('shows "All fields are required" when form is submitted empty', async () => {
    const wrapper = mountRegister();
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("All fields are required");
  });
});

describe("Register.vue – successful registration", () => {
  it("shows success message when registration succeeds", async () => {
    const mock = new MockAdapter(api);
    mock.onGet("/users").reply(200, []);
    mock.onPost("/users").reply(201, {
      id: 1,
      email: "newuser@example.com",
      phone: "9876543210",
      role: "CUSTOMER",
    });

    const wrapper = mountRegister();
    await wrapper.find("input[type='email']").setValue("newuser@example.com");
    await wrapper.find("input[type='tel']").setValue("9876543210");
    await wrapper.find("input[type='password']").setValue("SecurePass@1");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Registration successful");
    mock.restore();
  });
});
