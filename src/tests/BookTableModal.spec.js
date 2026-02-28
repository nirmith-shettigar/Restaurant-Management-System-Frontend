import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import BookTableModal from "../components/booking/BookTableModal.vue";

const futureDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
};

describe("BookTableModal.vue", () => {
    it("does not render when isOpen is false", () => {
        const wrapper = mount(BookTableModal, { props: { isOpen: false } });
        expect(wrapper.find(".fixed").exists()).toBe(false);
    });

    it("renders the modal when isOpen is true", () => {
        const wrapper = mount(BookTableModal, { props: { isOpen: true } });
        expect(wrapper.find(".fixed").exists()).toBe(true);
    });

    it("shows 'Book a Table' when no booking prop", () => {
        const wrapper = mount(BookTableModal, {
            props: { isOpen: true, booking: null },
        });
        expect(wrapper.text()).toContain("Book a Table");
    });

    it("shows 'Edit Booking' when a booking prop is provided", () => {
        const booking = {
            id: 1,
            bookingTime: new Date(Date.now() + 86400000).toISOString(),
            numberOfPeople: 3,
        };
        const wrapper = mount(BookTableModal, {
            props: { isOpen: true, booking },
        });
        expect(wrapper.text()).toContain("Edit Booking");
    });

});
