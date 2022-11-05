import { FastifyInstance } from "fastify"
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

import { prisma } from "../lib/prisma"

export async function pollRoutes(fastify: FastifyInstance) {
	fastify.get('/polls/count', async () => {
		const count = await prisma.poll.count()

		return { count }
	})

	fastify.post('/polls', async (request, reply) => {
		const createPollBody = z.object({
			title: z.string()
		})
		const generate = new ShortUniqueId({ length: 6 })

		const { title } = createPollBody.parse(request.body)
		const code = String(generate()).toLocaleUpperCase()

		try {
			await request.jwtVerify()

			await prisma.poll.create({
				data: {
					title,
					code,
					ownerId: request.user.sub,

					participants: {
						create: {
							userId: request.user.sub
						}
					}
				}
			})
		} catch {
			await prisma.poll.create({
				data: {
					title,
					code
				}
			})
		}


		return reply.status(201).send({ code })
	})
}
