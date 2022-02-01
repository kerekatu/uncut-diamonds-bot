import { PrismaClient } from '@prisma/client'
import { Guild } from 'discord.js'
import schedule from 'node-schedule'

const prisma = new PrismaClient()

export default async function initBirthdays(guild: Guild) {
  const birthdays = await prisma.birthdays.findMany()

  if (!birthdays) return console.error('Błąd zapytania')

  for (const birthday of birthdays) {
    const date = [...birthday.date.split('.')]
    schedule.scheduleJob(
      birthday.userId,
      { date: date[0], month: Number(date[1]) - 1 },
      async () => {
        const randomId = Math.floor(Math.random() * 100 + Date.now()).toString()
        const user = guild.members.cache.get(birthday.userId)
        const role = guild.roles.cache.find((role) => role.name === 'Urodziny')
        if (!role || !user?.roles) return console.error('Role nie istnieją')

        user.roles.add(role)

        schedule.scheduleJob(randomId, { minute: 59, hour: 23 }, () => {
          user.roles.remove(role)
          schedule.cancelJob(randomId)
        })
      }
    )
  }
}
