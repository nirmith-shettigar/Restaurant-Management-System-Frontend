import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import CustomerDashboard from '../views/dashboards/customer/CustomerDashboard.vue'
import * as bookingService from '../services/bookingService'

const CustomerBookingsListStub = {
    name: 'CustomerBookingsList',
    props: ['bookings', 'loading'],
    emits: ['edit', 'cancel'],
    template: '<div class="customer-bookings-list" />',
}

const BookTableModalStub = {
    name: 'BookTableModal',
    props: ['isOpen', 'booking'],
    emits: ['close', 'submit'],
    template: '<div class="book-table-modal" />',
}

const makeStore = ({ isAuthenticated = true, user = { id: 42, email: 'customer@test.com', role: 'CUSTOMER' } } = {}) =>
    createStore({
        modules: {
            auth: {
                namespaced: true,
                state: { user: isAuthenticated ? user : null, isAuthenticated },
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
            { path: '/', component: { template: '<div />' } },
            { path: '/login', component: { template: '<div />' } },
            { path: '/customer', component: { template: '<div />' } },
            { path: '/customer/menu', component: { template: '<div />' } },
        ],
    })

const mountDashboard = (storeOpts, router) =>
    mount(CustomerDashboard, {
        global: {
            plugins: [makeStore(storeOpts), router],
            stubs: {
                CustomerBookingsList: CustomerBookingsListStub,
                BookTableModal: BookTableModalStub,
                CalendarPlus: true,
                UtensilsCrossed: true,
                RouterLink: true,
            },
        },
    })

beforeEach(() => {
    vi.spyOn(bookingService, 'getUpcomingBookingsByCustomerId').mockResolvedValue([])
    vi.spyOn(bookingService, 'createBooking').mockResolvedValue({})
    vi.spyOn(bookingService, 'updateBooking').mockResolvedValue({})
    vi.spyOn(bookingService, 'cancelBooking').mockResolvedValue({})
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe('CustomerDashboard - rendering', () => {
    it('renders the Customer Dashboard heading', async () => {
        const wrapper = mountDashboard({}, makeRouter())
        await flushPromises()
        expect(wrapper.text()).toContain('Customer Dashboard')
    })
})

describe('CustomerDashboard - auth redirect', () => {
    it('redirects to /login when not authenticated', async () => {
        const router = makeRouter()
        const push = vi.spyOn(router, 'push')
        mountDashboard({ isAuthenticated: false }, router)
        await flushPromises()
        expect(push).toHaveBeenCalledWith('/login')
    })
})

describe('CustomerDashboard - loadBookings', () => {
    it('passes loaded bookings to the list component', async () => {
        const bookings = [{ id: 1, bookingTime: new Date(Date.now() + 3600000).toISOString(), status: 'CONFIRMED' }]
        vi.spyOn(bookingService, 'getUpcomingBookingsByCustomerId').mockResolvedValue(bookings)

        const wrapper = mountDashboard({}, makeRouter())
        await flushPromises()

        const list = wrapper.findComponent(CustomerBookingsListStub)
        expect(list.props('bookings')).toEqual(bookings)
        expect(list.props('loading')).toBe(false)
    })
})

describe('CustomerDashboard - booking submission', () => {
    it('calls createBooking with customerId when submitting a new booking', async () => {
        const createSpy = vi.spyOn(bookingService, 'createBooking').mockResolvedValue({})
        const wrapper = mountDashboard({}, makeRouter())
        await flushPromises()

        const bookingData = { tableId: 2, bookingTime: '2026-03-01T18:00:00' }
        await wrapper.findComponent(BookTableModalStub).vm.$emit('submit', bookingData)
        await flushPromises()

        expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ tableId: 2, customerId: 42 }))
    })

})
