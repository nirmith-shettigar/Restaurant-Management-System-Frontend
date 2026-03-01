import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import BookTableModal from "../../components/booking/BookTableModal.vue";

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

  it("shows error message when a past date/time is submitted", async () => {
    const wrapper = mount(BookTableModal, { props: { isOpen: true } });
    await wrapper.find('input[type="date"]').setValue("2020-01-01");
    await wrapper.find('input[type="time"]').setValue("10:00");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("cannot be in the past");
  });

  it("emits 'submit' with bookingTime when a future date/time is submitted", async () => {
    const wrapper = mount(BookTableModal, { props: { isOpen: true } });
    await wrapper.find('input[type="date"]').setValue("2030-06-15");
    await wrapper.find('input[type="time"]').setValue("18:00");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")[0][0]).toHaveProperty("bookingTime");
  });

  it("emits 'close' when Cancel button is clicked", async () => {
    const wrapper = mount(BookTableModal, { props: { isOpen: true } });
    const cancelBtn = wrapper
      .findAll("button")
      .find((b) => b.text() === "Cancel");
    await cancelBtn.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
