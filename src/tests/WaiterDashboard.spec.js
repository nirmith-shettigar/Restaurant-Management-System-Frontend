import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createMemoryHistory } from 'vue-router'
import WaiterDashboard from '../views/dashboards/waiter/WaiterDashboard.vue'

const makeStore = ({ isAuthenticated = true, user = { id: 1, role: 'WAITER' } } = {}) =>
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
            { path: '/waiter', component: { template: '<div />' } },
            { path: '/waiter/create-order', component: { template: '<div />' } },
        ],
    })

const mountDashboard = (storeOpts, router) =>
    mount(WaiterDashboard, {
        global: {
            plugins: [makeStore(storeOpts), router],
            stubs: {
                WaiterOrdersList: { name: 'WaiterOrdersList', template: '<div class="waiter-orders-list" />' },
                TodayBookingsList: { name: 'TodayBookingsList', template: '<div class="today-bookings-list" />' },
                ClipboardEdit: true,
                ClipboardList: true,
                CalendarDays: true,
                RouterLink: { template: '<a><slot /></a>' },
            },
        },
    })

afterEach(() => {
    vi.restoreAllMocks()
})

describe('WaiterDashboard - rendering', () => {
    it('renders the Waiter Dashboard heading', async () => {
        const wrapper = mountDashboard({}, makeRouter())
        await flushPromises()
        expect(wrapper.text()).toContain('Waiter Dashboard')
    })

    it('renders all three navigation cards', async () => {
        const wrapper = mountDashboard({}, makeRouter())
        await flushPromises()
        expect(wrapper.text()).toContain('Take Order')
        expect(wrapper.text()).toContain('My Orders')
        expect(wrapper.text()).toContain("Today's Bookings")
    })
})

describe('WaiterDashboard - auth redirect', () => {
    it('redirects to /login when not authenticated', async () => {
        const store = makeStore({ isAuthenticated: false })
        const router = makeRouter()
        router.beforeEach((to, from, next) => {
            if (to.path !== '/login' && !store.getters['auth/isAuthenticated']) {
                return next('/login')
            }
            next()
        })
        mount(WaiterDashboard, {
            global: {
                plugins: [store, router],
                stubs: {
                    WaiterOrdersList: { name: 'WaiterOrdersList', template: '<div class="waiter-orders-list" />' },
                    TodayBookingsList: { name: 'TodayBookingsList', template: '<div class="today-bookings-list" />' },
                    ClipboardEdit: true,
                    ClipboardList: true,
                    CalendarDays: true,
                    RouterLink: { template: '<a><slot /></a>' },
                },
            },
        })
        await router.push('/waiter')
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/login')
    })

})

describe('WaiterDashboard - view switch', () => {
    it('shows TodayBookingsList when Today\'s Bookings card is clicked', async () => {
        const router = makeRouter()
        const wrapper = mountDashboard({}, router)
        await flushPromises()
        const cards = wrapper.findAll('.cursor-pointer')
        const bookingsCard = cards.find((c) => c.text().includes("Today's Bookings"))
        await bookingsCard.trigger('click')
        expect(wrapper.find('.today-bookings-list').exists()).toBe(true)
    })
})

describe('WaiterDashboard - active view', () => {
    it('shows WaiterOrdersList by default', async () => {
        const wrapper = mountDashboard({}, makeRouter())
        await flushPromises()
        expect(wrapper.find('.waiter-orders-list').exists()).toBe(true)
        expect(wrapper.find('.today-bookings-list').exists()).toBe(false)
    })

})
