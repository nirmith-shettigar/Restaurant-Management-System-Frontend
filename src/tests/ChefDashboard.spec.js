import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ChefDashboard from '../views/dashboards/chef/ChefDashboard.vue'
import * as orderService from '../services/orderService'

// ─── helpers ────────────────────────────────────────────────────────────────

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

const mountDashboard = () =>
  mount(ChefDashboard, {
    global: { plugins: [router] },
  })

/** Factory for a well-formed order object */
const makeOrder = (overrides = {}) => ({
  id: 1,
  tableId: 5,
  status: 'placed',
  time: new Date('2024-01-01T10:00:00').toISOString(),
  items: [{ name: 'Pasta', quantity: 2 }],
  ...overrides,
})

// ─── setup / teardown ───────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([])
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

// ─── rendering ──────────────────────────────────────────────────────────────

describe('ChefDashboard – rendering', () => {
  it('renders the Chef Dashboard heading', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Chef Dashboard')
  })

  it('renders all four stat card labels', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    const text = wrapper.text()
    expect(text).toContain('New Orders')
    expect(text).toContain('Preparing')
    expect(text).toContain('Ready to Serve')
    expect(text).toContain('Completed')
  })

  it('renders the Active Orders section heading', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Active Orders')
  })
})

// ─── loading state ──────────────────────────────────────────────────────────

describe('ChefDashboard – loading state', () => {
  it('shows the loading spinner before data arrives', () => {
    // Do NOT flush – inspect while promise is still pending
    vi.spyOn(orderService, 'getAllOrders').mockImplementation(
      () => new Promise(() => {}), // never resolves
    )
    const wrapper = mountDashboard()
    expect(wrapper.text()).toContain('Loading orders...')
  })

  it('hides the loading spinner after data has loaded', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).not.toContain('Loading orders...')
  })
})

// ─── stat card counts ───────────────────────────────────────────────────────

describe('ChefDashboard – stat card counts', () => {
  it('counts placed orders as New Orders', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed' }),
      makeOrder({ id: 2, status: 'placed' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('2') // newOrders
  })

  it('counts preparing orders', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'preparing' }),
      makeOrder({ id: 2, status: 'preparing' }),
      makeOrder({ id: 3, status: 'preparing' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[1].text()).toBe('3') // preparing
  })

  it('counts ready orders', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'ready' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[2].text()).toBe('1') // ready
  })

  it('counts served orders as Completed', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'served' }),
      makeOrder({ id: 2, status: 'served' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[3].text()).toBe('2') // completed
  })

  it('shows zero counts when there are no orders', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([])
    const wrapper = mountDashboard()
    await flushPromises()

    const statValues = wrapper.findAll('.stat-value')
    statValues.forEach(card => expect(card.text()).toBe('0'))
  })

  it('counts correctly with a mixed set of orders', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed' }),
      makeOrder({ id: 2, status: 'preparing' }),
      makeOrder({ id: 3, status: 'ready' }),
      makeOrder({ id: 4, status: 'served' }),
      makeOrder({ id: 5, status: 'placed' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()

    const statValues = wrapper.findAll('.stat-value')
    expect(statValues[0].text()).toBe('2') // placed
    expect(statValues[1].text()).toBe('1') // preparing
    expect(statValues[2].text()).toBe('1') // ready
    expect(statValues[3].text()).toBe('1') // served
  })
})

// ─── empty state ────────────────────────────────────────────────────────────

describe('ChefDashboard – empty state', () => {
  it('shows "No pending orders!" when all orders are served/ready', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'served' }),
      makeOrder({ id: 2, status: 'ready' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('No pending orders!')
  })

  it('shows "Kitchen is clear." sub-text in empty state', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Kitchen is clear.')
  })

  it('does not render any order cards in the empty state', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.findAll('.order-card').length).toBe(0)
  })
})

// ─── active / pending orders ─────────────────────────────────────────────────

describe('ChefDashboard – active orders list', () => {
  it('renders an order card for each placed/preparing order', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed' }),
      makeOrder({ id: 2, status: 'preparing' }),
      makeOrder({ id: 3, status: 'served' }), // should be excluded
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.findAll('.order-card').length).toBe(2)
  })

  it('excludes ready and served orders from the active orders list', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'ready' }),
      makeOrder({ id: 2, status: 'served' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.findAll('.order-card').length).toBe(0)
  })

  it('displays the correct order id on each card', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 42, status: 'placed' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Order #42')
  })

  it('displays the table id chip on each card', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, tableId: 9, status: 'placed' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Table 9')
  })

  it('renders item name and quantity chips', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({
        id: 1,
        status: 'placed',
        items: [
          { name: 'Burger', quantity: 2 },
          { name: 'Fries', quantity: 1 },
        ],
      }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Burger')
    expect(wrapper.text()).toContain('×2')
    expect(wrapper.text()).toContain('Fries')
    expect(wrapper.text()).toContain('×1')
  })

  it('shows "No items" when an order has an empty items array', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed', items: [] }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('No items')
  })

  it('shows "No items" when order.items is undefined', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed', items: undefined }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('No items')
  })

  it('badge-count reflects the number of pending orders', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed' }),
      makeOrder({ id: 2, status: 'preparing' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.find('.badge-count').text()).toBe('2')
  })
})

// ─── order sorting ───────────────────────────────────────────────────────────

describe('ChefDashboard – order sorting', () => {
  it('sorts active orders oldest-first by time', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 3, status: 'placed', time: new Date('2024-01-01T12:00:00').toISOString() }),
      makeOrder({ id: 1, status: 'placed', time: new Date('2024-01-01T08:00:00').toISOString() }),
      makeOrder({ id: 2, status: 'placed', time: new Date('2024-01-01T10:00:00').toISOString() }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()

    const cards = wrapper.findAll('.order-card')
    expect(cards[0].text()).toContain('Order #1')
    expect(cards[1].text()).toContain('Order #2')
    expect(cards[2].text()).toContain('Order #3')
  })
})

// ─── status badge classes ────────────────────────────────────────────────────

describe('ChefDashboard – status badge classes', () => {
  it('applies status-placed class to a placed order badge', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.find('.status-placed').exists()).toBe(true)
  })

  it('applies status-preparing class to a preparing order badge', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'preparing' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.find('.status-preparing').exists()).toBe(true)
  })

  it('capitalises the status text in the badge', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([
      makeOrder({ id: 1, status: 'placed' }),
    ])
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.find('.badge').text()).toBe('Placed')
  })
})

// ─── polling / auto-refresh ──────────────────────────────────────────────────

describe('ChefDashboard – polling', () => {
  it('calls getAllOrders once on mount', async () => {
    const spy = vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([])
    mountDashboard()
    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('calls getAllOrders again after 30 seconds (polling interval)', async () => {
    const spy = vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([])
    mountDashboard()
    await flushPromises()

    vi.advanceTimersByTime(30000)
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('polls multiple times at the 30s interval', async () => {
    const spy = vi.spyOn(orderService, 'getAllOrders').mockResolvedValue([])
    mountDashboard()
    await flushPromises()

    vi.advanceTimersByTime(90000) // 3 × 30s
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(4) // 1 on mount + 3 polls
  })
})

// ─── error handling ──────────────────────────────────────────────────────────

describe('ChefDashboard – error handling', () => {
  it('stops loading when getAllOrders rejects', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockRejectedValue(new Error('Network error'))
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).not.toContain('Loading orders...')
  })

  it('shows empty-state (not a crash) when getAllOrders rejects', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockRejectedValue(new Error('Network error'))
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('keeps orders list empty after an API failure', async () => {
    vi.spyOn(orderService, 'getAllOrders').mockRejectedValue(new Error('Network error'))
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.findAll('.order-card').length).toBe(0)
  })
})
