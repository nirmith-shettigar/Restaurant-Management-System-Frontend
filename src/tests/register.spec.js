import { describe, it, expect, vi, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Register from '../views/auth/Register.vue'
import api from '../services/api'

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/login', component: { template: '<div />' } },
        { path: '/register', component: { template: '<div />' } },
    ],
})

const mountRegister = () =>
    mount(Register, {
        global: {
            plugins: [router],
            stubs: { 'router-link': { template: '<a><slot /></a>' } },
        },
    })

describe('Register.vue - rendering', () => {
    it('renders the registration form with all fields', () => {
        const wrapper = mountRegister()
        expect(wrapper.find("input[type='email']").exists()).toBe(true)
        expect(wrapper.find("input[type='tel']").exists()).toBe(true)
        expect(wrapper.find("input[type='password']").exists()).toBe(true)
        expect(wrapper.find('button[type="submit"], button').exists()).toBe(true)
    })

    it('renders the page heading', () => {
        const wrapper = mountRegister()
        expect(wrapper.text()).toContain('User Registration')
    })

    it('button shows "Register" by default (not loading)', () => {
        const wrapper = mountRegister()
        expect(wrapper.find('button').text()).toBe('Register')
    })

    it('does not show error or success messages on initial render', () => {
        const wrapper = mountRegister()
        expect(wrapper.find('.text-red-600').exists()).toBe(false)
        expect(wrapper.find('.text-green-600').exists()).toBe(false)
    })
})

describe('Register.vue – validation errors', () => {
    it('shows "All fields are required" when form is submitted empty', async () => {
        const wrapper = mountRegister()
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('All fields are required')
    })

    it('shows "All fields are required" when only email is filled', async () => {
        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('test@example.com')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('All fields are required')
    })

    it('shows invalid email error for a malformed email', async () => {
        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('invalidemail@')
        await wrapper.find("input[type='tel']").setValue('9876543210')
        await wrapper.find("input[type='password']").setValue('password123')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('Please enter a valid email')
    })

    it('shows invalid phone error for a short phone number', async () => {
        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('valid@example.com')
        await wrapper.find("input[type='tel']").setValue('12345')
        await wrapper.find("input[type='password']").setValue('password123')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('valid phone number')
    })
})

describe('Register.vue – successful registration', () => {
    it('shows success message when registration succeeds', async () => {
        const mock = new MockAdapter(api)
        mock.onGet('/users').reply(200, [])
        mock.onPost('/users').reply(201, {
            id: 1,
            email: 'newuser@example.com',
            phone: '9876543210',
            role: 'CUSTOMER',
        })

        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('newuser@example.com')
        await wrapper.find("input[type='tel']").setValue('9876543210')
        await wrapper.find("input[type='password']").setValue('SecurePass@1')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('Registration successful')
        mock.restore()
    })

    it('does not show error message on successful registration', async () => {
        const mock = new MockAdapter(api)
        mock.onGet('/users').reply(200, [])
        mock.onPost('/users').reply(201, {
            id: 2,
            email: 'another@example.com',
            phone: '9123456789',
            role: 'CUSTOMER',
        })

        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('another@example.com')
        await wrapper.find("input[type='tel']").setValue('9123456789')
        await wrapper.find("input[type='password']").setValue('Pass@1234')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.find('.text-red-600').exists()).toBe(false)
        mock.restore()
    })
})

describe('Register.vue - duplicate user', () => {
    it('shows error when a user with the same email already exists', async () => {
        const mock = new MockAdapter(api)
        mock.onGet('/users').reply(200, [
            { id: 5, email: 'existing@example.com', role: 'CUSTOMER' },
        ])

        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('existing@example.com')
        await wrapper.find("input[type='tel']").setValue('9876543210')
        await wrapper.find("input[type='password']").setValue('SecurePass@1')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('User already exists')
        mock.restore()
    })
})

describe('Register.vue - loading state', () => {
    it('disables the submit button while registering', async () => {
        const mock = new MockAdapter(api)
        mock.onGet('/users').reply(200, [])
        mock.onPost('/users').reply(201, { id: 3 })

        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('load@example.com')
        await wrapper.find("input[type='tel']").setValue('9000011112')
        await wrapper.find("input[type='password']").setValue('LoadTest@1')
        wrapper.find('form').trigger('submit.prevent')
        await Promise.resolve()
        expect(wrapper.find('button').attributes('disabled')).toBeDefined()
        await flushPromises()
        mock.restore()
    })

    it('button label changes to "Registering..." while loading', async () => {
        const mock = new MockAdapter(api)
        mock.onGet('/users').reply(200, [])
        mock.onPost('/users').reply(201, { id: 4 })

        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('btn@example.com')
        await wrapper.find("input[type='tel']").setValue('9111122223')
        await wrapper.find("input[type='password']").setValue('BtnTest@1')

        wrapper.find('form').trigger('submit.prevent')
        await Promise.resolve()

        expect(wrapper.find('button').text()).toBe('Registering...')
        await flushPromises()
        mock.restore()
    })
})

describe('Register.vue - API failure', () => {
    it('shows a fallback error message when the server returns 500', async () => {
        const mock = new MockAdapter(api)
        mock.onGet('/users').reply(200, [])
        mock.onPost('/users').reply(500)

        const wrapper = mountRegister()
        await wrapper.find("input[type='email']").setValue('fail@example.com')
        await wrapper.find("input[type='tel']").setValue('9888877776')
        await wrapper.find("input[type='password']").setValue('Fail@1234')
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()
        expect(wrapper.find('.text-red-600').exists()).toBe(true)
        mock.restore()
    })
})
