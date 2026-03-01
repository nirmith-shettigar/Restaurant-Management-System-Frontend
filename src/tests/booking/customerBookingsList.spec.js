import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import CustomerBookingsList from "../../components/booking/CustomerBookingsList.vue";

const mockBookings = [
  {
    id: 1,
    bookingTime: new Date(Date.now() + 86400000).toISOString(),
    numberOfPeople: 2,
    status: "CONFIRMED",
  },
  {
    id: 2,
    bookingTime: new Date(Date.now() + 172800000).toISOString(),
    numberOfPeople: 4,
    status: "CANCELLED",
  },
];

const mountComponent = (props = {}) =>
  mount(CustomerBookingsList, {
    props: {
      bookings: mockBookings,
      loading: false,
      ...props,
    },
    global: {
      stubs: {
        Hash: true,
        Calendar: true,
        Clock: true,
        Users: true,
        Edit2: true,
        Trash2: true,
        CalendarX: true,
        CancelBookingModal: true,
      },
    },
  });

describe("CustomerBookingsList.vue", () => {
  it("shows loading state when loading is true", () => {
    const wrapper = mountComponent({ loading: true, bookings: [] });
    expect(wrapper.text()).toContain("Loading bookings");
  });

  it("renders a card for each booking", () => {
    const wrapper = mountComponent();
    const cards = wrapper.findAll(".space-y-2");
    expect(cards.length).toBe(mockBookings.length);
  });

  it("emits 'edit' with booking when Edit button is clicked", async () => {
    const wrapper = mountComponent();
    const editBtn = wrapper.findAll("button").find((b) => b.text() === "Edit");
    await editBtn.trigger("click");
    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")[0][0]).toEqual(mockBookings[0]);
  });

  it("shows empty state when bookings array is empty", async () => {
    const { flushPromises } = await import("@vue/test-utils");
    const wrapper = mountComponent({ bookings: [], loading: false });
    await flushPromises();
    expect(wrapper.text()).toContain("No upcoming bookings");
  });
});
