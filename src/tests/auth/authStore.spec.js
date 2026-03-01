import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createStore } from 'vuex'
import authModule from '../../store/modules/auth'

const makeStore = () =>
    createStore({
        modules: {
            auth: {
                ...authModule,
                state: () => ({ ...authModule.state }),
            },
        },
    })

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
})

describe('auth store – getters', () => {
    it('isAuthenticated returns false initially', () => {
        const store = makeStore()
        expect(store.getters['auth/isAuthenticated']).toBe(false)
    })
})

describe('auth store - login action', () => {
    it('sets user and token in state', async () => {
        const store = makeStore()
        const user = { id: 5, email: 'waiter@test.com', role: 'WAITER' }
        await store.dispatch('auth/login', { user, token: 'jwt-token' })

        expect(store.getters['auth/currentUser']).toEqual(user)
        expect(store.getters['auth/token']).toBe('jwt-token')
        expect(store.getters['auth/isAuthenticated']).toBe(true)
    })
})

describe('auth store - logout action', () => {
    it('clears user, token and isAuthenticated from state', async () => {
        const store = makeStore()
        await store.dispatch('auth/login', { user: { id: 1, role: 'CHEF' }, token: 'tok' })
        await store.dispatch('auth/logout')

        expect(store.getters['auth/currentUser']).toBeNull()
        expect(store.getters['auth/token']).toBeNull()
        expect(store.getters['auth/isAuthenticated']).toBe(false)
    })
})

describe('auth store - initializeAuth action', () => {
    it('restores user and token from localStorage', async () => {
        const user = { id: 10, role: 'CUSTOMER' }
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', 'restored-token')

        const store = makeStore()
        await store.dispatch('auth/initializeAuth')

        expect(store.getters['auth/currentUser']).toEqual(user)
        expect(store.getters['auth/token']).toBe('restored-token')
        expect(store.getters['auth/isAuthenticated']).toBe(true)
    })
})

describe('auth store - updateUser action', () => {
    it('merges new fields onto the current user', async () => {
        const store = makeStore()
        await store.dispatch('auth/login', { user: { id: 1, email: 'old@test.com', role: 'WAITER' }, token: 'tok' })
        await store.dispatch('auth/updateUser', { email: 'new@test.com' })

        expect(store.getters['auth/currentUser'].email).toBe('new@test.com')
        expect(store.getters['auth/currentUser'].role).toBe('WAITER')
    })
})

describe('auth store - userRole getter', () => {
    it('returns the role of the logged-in user', async () => {
        const store = makeStore()
        await store.dispatch('auth/login', { user: { id: 3, role: 'CHEF' }, token: 'cheftok' })
        expect(store.getters['auth/userRole']).toBe('CHEF')
    })
})

describe('auth store - initializeAuth with corrupt data', () => {
    it('keeps isAuthenticated false when localStorage has invalid JSON', async () => {
        localStorage.setItem('user', 'not-valid-json')
        localStorage.setItem('token', 'tok')
        const store = makeStore()
        await store.dispatch('auth/initializeAuth')
        expect(store.getters['auth/isAuthenticated']).toBe(false)
    })
})