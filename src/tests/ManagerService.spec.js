import { describe, it, expect, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from '../services/api'
import ManagerService from '../services/ManagerService'

const mock = new MockAdapter(api)

afterEach(() => {
    mock.reset()
})

describe('ManagerService - addUser', () => {
    const newUser = {
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '9876543210',
        role: 'WAITER',
        password: 'secret123',
    }

    it('returns the created user on success', async () => {
        const saved = { id: 1, ...newUser }
        mock.onPost('/users').reply(201, saved)

        const response = await ManagerService.addUser(newUser)

        expect(response.data).toEqual(saved)
    })

    it('throws on a server error (500)', async () => {
        mock.onPost('/users').reply(500)

        await expect(ManagerService.addUser(newUser)).rejects.toThrow()
    })
})

describe('ManagerService - getUsers', () => {
    it('returns all users on success', async () => {
        const users = [
            { id: 1, name: 'Alice', role: 'WAITER' },
            { id: 2, name: 'Bob', role: 'CHEF' },
            { id: 3, name: 'Carol', role: 'MANAGER' },
        ]
        mock.onGet('/users').reply(200, users)

        const response = await ManagerService.getUsers()

        expect(response.data).toEqual(users)
    })

})
