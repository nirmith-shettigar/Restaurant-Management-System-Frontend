import { describe, it, expect } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '../../views/auth/Login.vue'
import store from '../../store'
import api from '../../services/api'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

const mountLogin = () =>
  mount(Login, {
    global: {
      plugins: [router, store],
      stubs: { 'router-link': { template: '<a><slot /></a>' } },
    },
  })

describe('Login.vue', () => {
  it('shows success message on valid credentials', async () => {
    const mock = new MockAdapter(api)
    mock.onGet('/users', {
      params: { email: 'test@test.com', password: '123456', role: 'CUSTOMER' },
    }).reply(200, [{ id: 1, email: 'test@test.com', role: 'CUSTOMER', password: '123456' }])

    const wrapper = mountLogin()
    await wrapper.find("input[type='email']").setValue('test@test.com')
    await wrapper.find("input[type='password']").setValue('123456')
    await wrapper.find('select').setValue('CUSTOMER')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Login successful')
    mock.restore()
  })

  it('shows error message on invalid credentials', async () => {
    const mock = new MockAdapter(api)
    mock.onGet('/users', {
      params: { email: 'wrong@test.com', password: 'wrongpass', role: 'CUSTOMER' },
    }).reply(200, [])

    const wrapper = mountLogin()
    await wrapper.find("input[type='email']").setValue('wrong@test.com')
    await wrapper.find("input[type='password']").setValue('wrongpass')
    await wrapper.find('select').setValue('CUSTOMER')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid credentials')
    mock.restore()
  })

  it('shows validation error when fields are empty', async () => {
    const wrapper = mountLogin()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('All fields are required')
  })
})