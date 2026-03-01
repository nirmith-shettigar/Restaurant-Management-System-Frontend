import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import CreateOrder from '../../views/dashboards/waiter/CreateOrder.vue'
import * as menuService from '../../services/menuService'
import * as orderService from '../../services/orderService'

const mockMenuItems = [
    { id: 1, name: 'Burger', price: 100, description: 'Juicy burger', image: '' },
    { id: 2, name: 'Fries', price: 50, description: 'Crispy fries', image: '' },
]

const makeStore = () =>
    createStore({
        modules: {
            auth: {
                namespaced: true,
                state: { user: { id: 7, email: 'waiter@test.com', role: 'WAITER' }, isAuthenticated: true },
                getters: {
                    currentUser: (s) => s.user,
                    isAuthenticated: (s) => s.isAuthenticated,
                    userRole: (s) => s.user?.role || null,
                },
            },
        },
    })

const makeRouter = () =>
    createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/waiter', component: { template: '<div />' } },
            { path: '/waiter/create-order', component: { template: '<div />' } },
        ],
    })

const mountCreateOrder = () =>
    mount(CreateOrder, {
        global: {
            plugins: [makeStore(), makeRouter()],
            stubs: { Plus: true, Minus: true },
        },
    })

beforeEach(() => {
    vi.spyOn(menuService, 'getMenuItems').mockResolvedValue(mockMenuItems)
    vi.spyOn(orderService, 'createOrder').mockResolvedValue({ id: 99 })
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe('CreateOrder - rendering', () => {
    it('renders the Create Order heading', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()
        expect(wrapper.text()).toContain('Create Order')
    })

})

describe('CreateOrder - table selection', () => {
    it('shows menu items after a table is selected', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()

        await wrapper.find('select').setValue('2')
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Burger')
        expect(wrapper.text()).toContain('Fries')
    })

})

describe('CreateOrder - quantity controls', () => {
    it('increaseQuantity adds an item to the order', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()

        wrapper.vm.increaseQuantity(1)
        expect(wrapper.vm.getQuantity(1)).toBe(1)
    })

    it('decreaseQuantity reduces the item count by 1', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()

        wrapper.vm.increaseQuantity(1)
        wrapper.vm.increaseQuantity(1)
        wrapper.vm.decreaseQuantity(1)
        expect(wrapper.vm.getQuantity(1)).toBe(1)
    })

})

describe('CreateOrder - computed totals', () => {
    it('calculates totalItems as the sum of all quantities', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()

        wrapper.vm.increaseQuantity(1)
        wrapper.vm.increaseQuantity(1)
        wrapper.vm.increaseQuantity(2)
        expect(wrapper.vm.totalItems).toBe(3)
    })

    it('calculates totalAmount based on item prices and quantities', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()

        wrapper.vm.increaseQuantity(1)
        wrapper.vm.increaseQuantity(2)
        expect(wrapper.vm.totalAmount).toBe(150)
    })

})

describe('CreateOrder - order submission', () => {
    it('calls createOrder with tableId, waiterId and items', async () => {
        const createSpy = vi.spyOn(orderService, 'createOrder').mockResolvedValue({ id: 1 })
        const wrapper = mountCreateOrder()
        await flushPromises()

        await wrapper.find('select').setValue('3')
        wrapper.vm.increaseQuantity(1)
        await wrapper.vm.submitOrder()
        await flushPromises()

        expect(createSpy).toHaveBeenCalledWith(
            expect.objectContaining({ tableId: 3, waiterId: 7 })
        )
    })

    it('resets all quantities and table selection after successful order', async () => {
        const wrapper = mountCreateOrder()
        await flushPromises()

        wrapper.vm.increaseQuantity(1)
        wrapper.vm.increaseQuantity(2)
        wrapper.vm.resetOrder()

        expect(wrapper.vm.totalItems).toBe(0)
        expect(Object.keys(wrapper.vm.quantities).length).toBe(0)
        expect(wrapper.vm.selectedTable).toBe('')
    })
})
