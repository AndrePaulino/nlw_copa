import { FastifyInstance } from "fastify"
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

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

	fastify.post('/polls/:id/join', { onRequest: [authenticate] }, async (request, reply) => {
		const joinPollBody = z.object({
			code: z.string()
		})

		const { code } = joinPollBody.parse(request.body)

		const poll = await prisma.poll.findUnique({
			where: {
				code,
			},
			include: {
				participants: {
					where: {
						userId: request.user.sub
					}
				}
			}
		})

		if (!poll) {
			return reply.status(400).send({ message: "Bolão não encontrado." })
		}

		if (poll.participants.length > 0) {
			return reply.status(400).send({ message: "Você já participa deste bolão." })

		}

		if (!poll.ownerId) {
			await prisma.poll.update({
				where: {
					id: poll.id
				},
				data: {
					ownerId: request.user.sub
				}
			})
		}

		await prisma.participant.create({
			data: {
				pollId: poll.id,
				userId: request.user.sub,
			}
		})

		return reply.status(201).send()
	})

}
