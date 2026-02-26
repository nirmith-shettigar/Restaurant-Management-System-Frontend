import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createStore } from 'vuex'
import WaiterDashboard from '../views/dashboards/waiter/WaiterDashboard.vue'
import * as orderService from '../services/orderService'

vi.mock('lucide-vue-next', () => ({
    ClipboardEdit: { template: '<span class="icon-clipboard-edit" />' },
    ClipboardList: { template: '<span class="icon-clipboard-list" />' },
    CalendarDays: { template: '<span class="icon-calendar-days" />' },
}))

const createTestRouter = () =>
    createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', component: { template: '<div>Home</div>' } },
            { path: '/login', component: { template: '<div>Login</div>' } },
            { path: '/waiter', component: { template: '<div>Waiter</div>' } },
            { path: '/waiter/create-order', component: { template: '<div>Create Order</div>' } },
            { path: '/waiter/bookings', component: { template: '<div>Bookings</div>' } },
        ],
    })

const createTestStore = ({ isAuthenticated = true, role = 'WAITER', userId = 1 } = {}) =>
    createStore({
        modules: {
            auth: {
                namespaced: true,
                getters: {
                    isAuthenticated: () => isAuthenticated,
                    userRole: () => (isAuthenticated ? role : null),
                    currentUser: () => (isAuthenticated ? { id: userId, role } : null),
                },
            },
        },
    })

const mountDashboard = (storeOpts = {}, router = null) => {
    const testRouter = router ?? createTestRouter()
    const testStore = createTestStore(storeOpts)
    return {
        wrapper: mount(WaiterDashboard, {
            global: {
                plugins: [testRouter, testStore],
                stubs: {
                    WaiterOrdersList: { template: '<div class="waiter-orders-stub">WaiterOrdersList</div>' },
                },
            },
        }),
        router: testRouter,
        store: testStore,
    }
}

beforeEach(() => {
    vi.spyOn(orderService, 'getOrdersByWaiterId').mockResolvedValue([])
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe('WaiterDashboard – rendering', () => {
    it('renders the main heading', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('h1').text()).toBe('Waiter Dashboard')
    })

    it('renders the subtitle', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('Manage orders and bookings')
    })

    it('renders the Take Order card title', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('Take Order')
    })

    it('renders the Take Order card description', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('Create new order')
    })

    it('renders the My Orders card title', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('My Orders')
    })

    it('renders the My Orders card description', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('View your orders')
    })

    it("renders the Today's Bookings card title", async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain("Today's Bookings")
    })

    it("renders the Today's Bookings card description", async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.text()).toContain('View reservations')
    })

    it('renders exactly three navigation cards', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        const cards = wrapper.findAll('a')
        expect(cards.length).toBe(3)
    })

    it('renders the WaiterOrdersList component', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.waiter-orders-stub').exists()).toBe(true)
    })
})

describe('WaiterDashboard – navigation links', () => {
    it('Take Order card links to /waiter/create-order', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        const links = wrapper.findAll('a')
        const takeOrderLink = links.find(l => l.text().includes('Take Order'))
        expect(takeOrderLink?.attributes('href')).toBe('/waiter/create-order')
    })

    it('My Orders card links to /waiter', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        const links = wrapper.findAll('a')
        const myOrdersLink = links.find(l => l.text().includes('My Orders'))
        expect(myOrdersLink?.attributes('href')).toBe('/waiter')
    })

    it("Today's Bookings card links to /waiter/bookings", async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        const links = wrapper.findAll('a')
        const bookingsLink = links.find(l => l.text().includes("Today's Bookings"))
        expect(bookingsLink?.attributes('href')).toBe('/waiter/bookings')
    })
})

describe('WaiterDashboard – icon containers', () => {
    it('renders the blue icon container for Take Order', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.bg-blue-100').exists()).toBe(true)
    })

    it('renders the green icon container for My Orders', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.bg-green-100').exists()).toBe(true)
    })

    it('renders the purple icon container for Bookings', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.bg-purple-100').exists()).toBe(true)
    })

    it('renders the ClipboardEdit icon', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.icon-clipboard-edit').exists()).toBe(true)
    })

    it('renders the ClipboardList icon', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.icon-clipboard-list').exists()).toBe(true)
    })

    it('renders the CalendarDays icon', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.icon-calendar-days').exists()).toBe(true)
    })
})

describe('WaiterDashboard – auth guard (not authenticated)', () => {
    it('redirects to /login when user is not authenticated', async () => {
        const router = createTestRouter()
        await router.push('/waiter')
        const { } = mountDashboard({ isAuthenticated: false }, router)
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/login')
    })

    it('does not stay on /waiter when user is not authenticated', async () => {
        const router = createTestRouter()
        await router.push('/waiter')
        mountDashboard({ isAuthenticated: false }, router)
        await flushPromises()
        expect(router.currentRoute.value.path).not.toBe('/waiter')
    })
})

describe('WaiterDashboard – auth guard (wrong role)', () => {
    it('redirects to / when authenticated user has CUSTOMER role', async () => {
        const router = createTestRouter()
        await router.push('/waiter')
        mountDashboard({ isAuthenticated: true, role: 'CUSTOMER' }, router)
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/')
    })

    it('redirects to / when authenticated user has MANAGER role', async () => {
        const router = createTestRouter()
        await router.push('/waiter')
        mountDashboard({ isAuthenticated: true, role: 'MANAGER' }, router)
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/')
    })

    it('redirects to / when authenticated user has CHEF role', async () => {
        const router = createTestRouter()
        await router.push('/waiter')
        mountDashboard({ isAuthenticated: true, role: 'CHEF' }, router)
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/')
    })
})

describe('WaiterDashboard – auth guard (authorised waiter)', () => {
    it('stays on the current route when user is an authenticated WAITER', async () => {
        const router = createTestRouter()
        await router.push('/waiter')
        mountDashboard({ isAuthenticated: true, role: 'WAITER' }, router)
        await flushPromises()
        expect(router.currentRoute.value.path).toBe('/waiter')
    })

    it('renders the dashboard content for an authenticated WAITER', async () => {
        const { wrapper } = mountDashboard({ isAuthenticated: true, role: 'WAITER' })
        await flushPromises()
        expect(wrapper.find('h1').text()).toBe('Waiter Dashboard')
    })
})

describe('WaiterDashboard – layout', () => {
    it('wraps the page in a min-h-screen container', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('uses a 3-column grid for the nav cards', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        expect(wrapper.find('.md\\:grid-cols-3').exists()).toBe(true)
    })

    it('WaiterOrdersList is rendered after the nav cards', async () => {
        const { wrapper } = mountDashboard()
        await flushPromises()
        const text = wrapper.text()
        const lastCardIdx = text.lastIndexOf("Today's Bookings")
        const ordersListIdx = text.indexOf('WaiterOrdersList')
        expect(ordersListIdx).toBeGreaterThan(lastCardIdx)
    })
})
