import { PrismaClient } from '@prisma/client'
import { Guild } from 'discord.js'
import schedule from 'node-schedule'
import { logger, t } from '../utils/exports'
import { randomId } from '../utils/helpers'

const prisma = new PrismaClient()

export default async function handleBirthdays(guild: Guild) {
  const roleId = process.env.BIRTHDAY_ROLE_ID

  if (!roleId) return logger.error(t.global.missing_env + 'BIRTHDAY_ROLE_ID')

  const birthdays = await prisma.birthdays.findMany()

  if (!birthdays) return logger.error(t.handlers.birthdays.empty_list)

  for (const birthday of birthdays) {
    const date = [...birthday.date.split('.')]
    schedule.scheduleJob(
      birthday.userId,
      { date: date[0], month: Number(date[1]) - 1 },
      async () => {
        const id = randomId()
        const user = guild.members.cache.get(birthday.userId)
        const role = guild.roles.cache.find((role) => role.id === roleId)
        if (!role || !user?.roles) return logger.error(t.global.missing_role)

        user.roles.add(role)

        schedule.scheduleJob(id, { minute: 59, hour: 23 }, () => {
          user.roles.remove(role)
          schedule.cancelJob(id)
        })
      }
    )
  }
}
