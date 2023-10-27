import { Elysia } from '../../src'

import { describe, expect, it } from 'bun:test'
import { req, delay } from '../utils'

describe('On Request', () => {
	it('inject headers to response', async () => {
		const app = new Elysia()
			.onRequest(({ set }) => {
				set.headers['Access-Control-Allow-Origin'] = '*'
			})
			.get('/', () => 'hi')

		const res = await app.handle(req('/'))

		expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
	})

	it('handle async', async () => {
		const app = new Elysia()
			.onRequest(async ({ set }) => {
				await delay(5)
				set.headers.name = 'llama'
			})
			.get('/', () => 'hi')

		const res = await app.handle(req('/'))

		expect(res.headers.get('name')).toBe('llama')
	})
})