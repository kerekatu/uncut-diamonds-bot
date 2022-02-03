import { Client } from 'discord.js'
import initBirthdays from './init-birthdays'
import initActivityList from './activity-list'
import initQuestions from './init-questions'
import handlePermission from './handle-permission'
import loadCommands from '../load-commands'

const handleReadyEvent = async (client: Client) => {
  console.log('Bot został zainicjalizowany!')

  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)
  const user = client?.user

  if (!guild || !user) return console.error('Podany serwer nie istnieje!')

  initActivityList(guild, user)
  await handlePermission(guild)
  await initBirthdays(guild)
  await loadCommands()
  await initQuestions(client)
}

export default handleReadyEvent
