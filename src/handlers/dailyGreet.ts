import schedule from 'node-schedule'
import { ChannelType, Client, Guild } from 'discord.js'
import { logger, t } from '../utils/exports'

export const postMessage = async (client: Client, guild: Guild) => {
  const channelId = process.env.DAILY_GREET_CHANNEL_ID

  if (!channelId)
    return logger.error(t.global.missing_env + 'DAILY_GREET_CHANNEL_ID')

  const guildChannel = client.channels.cache.get(channelId)

  if (!guildChannel || guildChannel.type !== ChannelType.GuildText)
    return logger.error(t.global.unknown_channel)

  const usersRes = await guild.members.fetch()

  if (!usersRes) return logger.error(t.handlers.dailyGreet.users_error)

  const userNames = usersRes.map((user) => {
    if (!user.user.bot) {
      return user.user.id
    }
  })

  const randomMessage = Math.floor(
    Math.random() * t.handlers.dailyGreet.messages.length
  )
  const randomUser = `<@${
    userNames[Math.floor(Math.random() * userNames.length)]
  }>`

  await guildChannel.send({
    content:
      t.handlers.dailyGreet.messages[randomMessage] +
      ` ${randomUser} ${t.handlers.dailyGreet.emoji}`,
  })
}

export default async function handleDailyGreet(client: Client, guild: Guild) {
  // will invoke at 16:00 everyday
  const scheduleRule = new schedule.RecurrenceRule()
  scheduleRule.hour = 20
  scheduleRule.minute = 55

  scheduleRule.tz = 'CET'

  // schedule new job
  schedule.scheduleJob('DAILY_GREET_JOB', scheduleRule, async () => {
    await postMessage(client, guild)
  })
}
