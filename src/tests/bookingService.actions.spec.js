import { describe, it, expect, vi } from "vitest";
import axiosInstance from "../services/api";
import { getTodayBookings, getUpcomingBookingsByCustomerId, createBooking, updateBooking, cancelBooking } from "../services/bookingService.js"

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn()
    }
}))

describe("testing booking service", () => {
    it("get today bookings return todays bookings", async () => {
        const mockData = [
            {
                "id": "booking_001",
                "customerId": "customer_101",
                "numberOfPeople": 50,
                "bookingTime": "2026-02-24T18:00:00Z",
                "status": "booked"
            },
            {
                "id": "booking_002",
                "customerId": "customer_205",
                "numberOfPeople": 5,
                "bookingTime": "2026-02-24T18:30:00Z",
                "status": "booked"
            },
            {
                "id": "booking_003",
                "customerId": "customer_118",
                "numberOfPeople": 3,
                "bookingTime": "2026-02-24T19:15:00Z",
                "status": "booked"
            },
            {
                "id": "booking_004",
                "customerId": "customer_342",
                "numberOfPeople": 1,
                "bookingTime": "2026-02-24T20:00:00Z",
                "status": "booked"
            },
            {
                "id": "0d4b",
                "customerId": "cust123",
                "numberOfPeople": 10,
                "bookingTime": "2026-02-24T18:00:00Z",
                "status": "booked"
            }
        ]
        const getTodayBookingsFromData = (bookings) => {
            const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

            return bookings.filter((booking) => {
                if (!booking.bookingTime) return false; // skip if missing

                const bookingDate = new Date(booking.bookingTime).toISOString().split("T")[0];
                return bookingDate === today;
            });
        };
        const mockBookingResponse = getTodayBookingsFromData(mockData)
        axiosInstance.get.mockResolvedValue({
            data: mockBookingResponse
        })
        const response = await getTodayBookings()
        expect(response).toEqual(mockBookingResponse)
    })

    it("get all bookings by customer id", async () => {
        const mockData = [
            {
                "id": "booking_001",
                "customerId": "customer_101",
                "numberOfPeople": 50,
                "time": "2026-02-24T18:00:00Z",
                "status": "booked"
            }
        ]
        const now = new Date();
        const mockResponse = mockData.filter((booking) => {
            const bookingDate = new Date(booking.bookingTime);
            return bookingDate >= now && booking.status !== "CANCELLED";
        });
        axiosInstance.get.mockResolvedValue({
            data: mockResponse
        })
        const response = await getUpcomingBookingsByCustomerId("customer_101")
        expect(response).toEqual(mockResponse)
    })

    it("create booking", async () => {
        const mockData = {
            "id": "e872",
            "customerId": "customer_101",
            "numberOfPeople": 25,
            "time": "2026-02-24T18:00:00Z"
        }
        axiosInstance.post.mockResolvedValue({
            data: mockData
        })
        const response = await createBooking(mockData)
        expect(response).toEqual(mockData)
    })

    it("update booking return updated booking", async () => {
        const mockResponse = {
            "id": "e872",
            "customerId": "customer_101",
            "numberOfPeople": 20,
            "time": "2026-02-24T18:00:00Z"
        }
        axiosInstance.patch.mockResolvedValue({
            data: mockResponse
        })
        const response = await updateBooking("e872", {
            "customerId": "customer_101",
            "numberOfPeople": 20,
            "time": "2026-02-24T18:00:00Z"
        })
        expect(response).toEqual(mockResponse)
    })

    it("cancel booking", async () => {
        const mockData = {
            "id": "booking_002",
            "customerId": "customer_205",
            "numberOfPeople": 5,
            "time": "2026-02-24T18:30:00Z",
            "status": "booked"
        }

        axiosInstance.delete.mockResolvedValue({
            data: mockData
        })
        const response = await cancelBooking("booking_002")
        expect(response).toEqual(mockData)
    })
})