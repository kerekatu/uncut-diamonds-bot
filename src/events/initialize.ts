import { Client } from 'discord.js'
import handleBirthdays from '../handlers/birthdays'
import handleQuestions from '../handlers/questions'
import handleCommands from '../handlers/commands'
import handleActivities from '../handlers/activities'
import { logger, t } from '../utils/exports'
import config from '../config'

const initializeBot = async (client: Client) => {
  logger.info(t.global.bot_initialized)

  const guild = client.guilds.cache.get(config.GUILD_ID)
  const user = client?.user

  if (!guild || !user) return logger.error(t.global.unknown_server)

  handleActivities(guild, user)
  await handleBirthdays(guild)
  await handleQuestions(client)
  await handleCommands()
}

export default initializeBot
