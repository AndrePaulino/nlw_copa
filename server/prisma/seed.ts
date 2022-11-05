import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

	const user = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@email.com',
			avatarUrl: 'https://github.com/identicons/avatarUrl?.png'
		}
	})


	const poll = await prisma.poll.create({
		data: {
			title: 'Example Poll',
			code: 'BOL123',
			ownerId: user.id,

			participants: {
				create: {
					userId: user.id
				}
			}
		}
	})

	await prisma.game.create({
		data: {
			date: '2022-11-20T14:30:00.114Z',
			firstTeamCountryCode: 'QA',
			secondTeamCountryCode: 'SN',
		}
	})

	await prisma.game.create({
		data: {
			date: '2022-11-22T12:00:00.114Z',
			firstTeamCountryCode: 'FR',
			secondTeamCountryCode: 'GB',
			guesses: {
				create: {
					firstTeamScore: 2,
					secondTeamScore: 2,
					participant: {
						connect: {
							userId_pollId: {
								userId: user.id,
								pollId: poll.id
							}
						}
					}
				}
			}
		}
	})

}

main()
