import { Client } from 'discord.js'
import handleBirthdays from '../handlers/birthdays'
import handleQuestions from '../handlers/questions'
import handleCommands from '../handlers/commands'
import handleActivities from '../handlers/activities'

const handleReadyEvent = async (client: Client) => {
  console.log('Bot został zainicjalizowany!')

  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)
  const user = client?.user

  if (!guild || !user) return console.error('Podany serwer nie istnieje!')

  handleActivities(guild, user)
  await handleBirthdays(guild)
  await handleCommands()
  await handleQuestions(client)
}

export default handleReadyEvent
