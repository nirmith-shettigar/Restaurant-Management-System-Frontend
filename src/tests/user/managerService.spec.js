import { describe, it, expect, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from '../../services/api'
import { getUsers } from '../../services/managerService'

const mock = new MockAdapter(api)

afterEach(() => {
    mock.reset()
})

describe('ManagerService - getUsers', () => {
    it('returns all users on success', async () => {
        const allUsers = [
            { id: 1, name: 'Alice', role: 'WAITER' },
            { id: 2, name: 'Bob', role: 'CHEF' },
            { id: 3, name: 'Carol', role: 'MANAGER' },
        ]
        const expectedUsers = allUsers.filter(u => u.role !== 'MANAGER')
        mock.onGet('/users').reply(200, allUsers)

        const response = await getUsers()

        expect(response).toEqual(expectedUsers)
    })
})
