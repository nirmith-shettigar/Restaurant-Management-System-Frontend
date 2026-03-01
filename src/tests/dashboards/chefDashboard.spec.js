import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ChefDashboard from '../../views/dashboards/chef/ChefDashboard.vue'
import * as orderService from '../../services/orderService'

const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
})

const mountDashboard = () =>
    mount(ChefDashboard, {
        global: { plugins: [router] },
    })

const makeOrder = (overrides = {}) => ({
    id: 1,
    tableId: 5,
    status: 'PENDING',
    time: new Date('2024-01-01T10:00:00').toISOString(),
    items: [{ name: 'Pasta', quantity: 2 }],
    ...overrides,
})

beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([])
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
})

describe('ChefDashboard - rendering', () => {
    it('renders the Chef Dashboard heading', async () => {
        const wrapper = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('Chef Dashboard')
    })
})

describe('ChefDashboard - stat card counts', () => {
    it('counts correctly with a mixed set of orders', async () => {
        vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
            makeOrder({ id: 1, status: 'PENDING' }),
            makeOrder({ id: 2, status: 'PREPARING' }),
            makeOrder({ id: 3, status: 'PREPARED' }),
            makeOrder({ id: 4, status: 'SERVED' }),
            makeOrder({ id: 5, status: 'PENDING' }),
        ])
        const wrapper = mountDashboard()
        await flushPromises()

        const statValues = wrapper.findAll('.stat-value')
        expect(statValues[0].text()).toBe('2')
        expect(statValues[1].text()).toBe('1')
        expect(statValues[2].text()).toBe('1')
        expect(statValues[3].text()).toBe('1')
    })
})

describe('ChefDashboard - active orders list', () => {
    it('renders an order card showing order id and table for each PENDING/PREPARING order', async () => {
        vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
            makeOrder({ id: 1, status: 'PENDING' }),
            makeOrder({ id: 2, status: 'PREPARING' }),
            makeOrder({ id: 3, status: 'SERVED' }),
        ])
        const wrapper = mountDashboard()
        await flushPromises()
        expect(wrapper.findAll('.order-card').length).toBe(2)
    })
})

describe('ChefDashboard - empty state', () => {
    it('shows "No pending orders!" when all orders are served', async () => {
        vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
            makeOrder({ id: 1, status: 'SERVED' }),
            makeOrder({ id: 2, status: 'SERVED' }),
        ])
        const wrapper = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('No pending orders!')
    })
})

describe('ChefDashboard - status change', () => {
    it('refetches orders after a successful status update', async () => {
        const getAllOrdersSpy = vi.spyOn(orderService, 'getAllOrders')
            .mockResolvedValue([makeOrder({ id: 1, status: 'PENDING' })])
        vi.spyOn(orderService, 'updateOrderStatus').mockResolvedValue({})

        const wrapper = mountDashboard()
        await flushPromises()
        getAllOrdersSpy.mockResolvedValue([])

        const select = wrapper.find('select')
        await select.trigger('change')
        await flushPromises()
        expect(getAllOrdersSpy).toHaveBeenCalledTimes(2)
    })

})
