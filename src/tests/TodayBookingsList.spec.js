import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TodayBookingsList from "../components/booking/TodayBookingsList.vue";
import * as bookingService from "../services/bookingService";
import * as userService from "../services/customerService";

vi.mock("../services/bookingService");
vi.mock("../services/customerService");

describe("TodayBookingsList.vue", () => {
    it("shows loading state initially", () => {
        bookingService.getTodayBookings.mockResolvedValue([]);
        const wrapper = mount(TodayBookingsList, {
            global: {
                stubs: { Mail: true, Phone: true, Clock: true, Users: true },
            },
        });
        expect(wrapper.text()).toContain("Loading bookings");
    });

    it("renders the heading", () => {
        bookingService.getTodayBookings.mockResolvedValue([]);
        const wrapper = mount(TodayBookingsList, {
            global: {
                stubs: { Mail: true, Phone: true, Clock: true, Users: true },
            },
        });
        expect(wrapper.text()).toContain("Today's Bookings");
    });

    it("shows empty state when there are no bookings today", async () => {
        bookingService.getTodayBookings.mockResolvedValue([]);
        userService.getUserById.mockResolvedValue({ id: 1, email: 'a@b.com', phone: '123' }); // customerService mock
        const { flushPromises } = await import('@vue/test-utils');
        const wrapper = mount(TodayBookingsList, {
            global: {
                stubs: { Mail: true, Phone: true, Clock: true, Users: true },
            },
        });
        await flushPromises();
        expect(wrapper.text()).toContain("No bookings for today");
    });
});
