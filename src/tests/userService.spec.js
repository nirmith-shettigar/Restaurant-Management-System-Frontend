import { describe, it, expect, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from '../services/api'
import { getUserById } from '../services/userService'

const mock = new MockAdapter(api)

afterEach(() => {
    mock.reset()
})

describe('userService – getUserById', () => {
    it('returns user data when the API call succeeds', async () => {
        const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            role: 'WAITER',
        }
        mock.onGet('/users/1').reply(200, mockUser)

        const result = await getUserById(1)

        expect(result).toEqual(mockUser)
    })

    it('throws when the user is not found (404)', async () => {
        mock.onGet('/users/99').reply(404)

        await expect(getUserById(99)).rejects.toThrow()
    })

    it('throws on a server error (500)', async () => {
        mock.onGet('/users/1').reply(500)

        await expect(getUserById(1)).rejects.toThrow()
    })
})
