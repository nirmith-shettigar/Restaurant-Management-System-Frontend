import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CancelBookingModal from "../../components/booking/CancelBookingModal.vue";

describe("CancelBookingModal.vue", () => {
    it("does not render content when isOpen is false", () => {
        const wrapper = mount(CancelBookingModal, {
            props: { isOpen: false },
        });
        expect(wrapper.find(".fixed").exists()).toBe(false);
    });

    it("renders the modal when isOpen is true", () => {
        const wrapper = mount(CancelBookingModal, {
            props: { isOpen: true },
        });
        expect(wrapper.find(".fixed").exists()).toBe(true);
    });

    it("emits 'confirm' when 'Yes, Cancel Booking' button is clicked", async () => {
        const wrapper = mount(CancelBookingModal, {
            props: { isOpen: true },
        });
        const buttons = wrapper.findAll("button");
        const confirmBtn = buttons.find((b) =>
            b.text().includes("Yes, Cancel Booking"),
        );
        await confirmBtn.trigger("click");
        expect(wrapper.emitted("confirm")).toBeTruthy();
        expect(wrapper.emitted("confirm")).toHaveLength(1);
    });

    it("emits 'close' when 'No, Keep It' button is clicked", async () => {
        const wrapper = mount(CancelBookingModal, {
            props: { isOpen: true },
        });
        const buttons = wrapper.findAll("button");
        const keepBtn = buttons.find((b) => b.text().includes("No, Keep It"));
        await keepBtn.trigger("click");
        expect(wrapper.emitted("close")).toBeTruthy();
    });
});
