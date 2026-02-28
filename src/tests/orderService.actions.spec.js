import { getAllOrders, getOrdersByWaiterId, updateOrderStatus } from "../services/orderService"
import { describe, it, expect, vi } from "vitest"
import axiosInstance from "../services/api"

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn()
    }
}))

describe("testing order services", () => {
    it("get all orders return all orders", async () => {
        const mockOrder = [{
            "tableId": 3,
            "time": "2026-02-24T12:15:00Z",
            "items": [
                {
                    "name": "Burger",
                    "quantity": 2
                },
                {
                    "name": "Fries",
                    "quantity": 1
                },
                {
                    "name": "Cola",
                    "quantity": 2
                }
            ],
            "status": "placed"
        }]
        axiosInstance.get.mockResolvedValue({
            data: mockOrder
        })
        const response = await getAllOrders()
        expect(response).toEqual(mockOrder)
    })

    it("get order by waiter id", async () => {
        const mockOrderByWaiterId = [
            {
                "id": "order_001",
                "waiterId": 1,
                "tableId": 3,
                "time": "2026-02-24T12:15:00Z",
                "items": [
                    {
                        "name": "Burger",
                        "quantity": 2
                    },
                    {
                        "name": "Fries",
                        "quantity": 1
                    },
                    {
                        "name": "Cola",
                        "quantity": 2
                    }
                ],
                "status": "placed"
            },
            {
                "id": "076c",
                "waiterId": 1,
                "tableId": 5,
                "status": "placed",
                "time": "2026-02-24T12:15:00Z",
                "items": [
                    {
                        "name": "Pav Bhaji",
                        "quantity": 2
                    },
                    {
                        "name": "Burger",
                        "quantity": 5
                    }
                ]
            }
        ]
        axiosInstance.get.mockResolvedValue({
            data: mockOrderByWaiterId
        })
        const response = await getOrdersByWaiterId(1)
        expect(response.length).toBe(2)
    })

    it("update order status by id", async () => {
        const mockResponse = {
            "id": "order_001",
            "waiterId": 1,
            "tableId": 3,
            "time": "2026-02-24T12:15:00Z",
            "items": [
                {
                    "name": "Burger",
                    "quantity": 2
                },
                {
                    "name": "Fries",
                    "quantity": 1
                },
                {
                    "name": "Cola",
                    "quantity": 2
                }
            ],
            "status": "served"
        }
        axiosInstance.patch.mockResolvedValue({
            data: mockResponse
        })
        const response = await updateOrderStatus("order_001", "served")
        expect(response).toEqual(mockResponse)
    })

})


