import { Client } from 'discord.js'
import config from './config'
import * as commandModules from './commands'
import { Command } from './types'
import initBirthdays from './events/init-birthdays'
import { CONSTANTS } from './utils/constants'
import initActivityList from './events/activity-list'
import initQuestions from './events/init-questions'
import handlePermission from './events/handle-permission'

const commands: { [key: string]: Command } = Object(commandModules)

export const client = new Client({
  intents: CONSTANTS.intents,
})

client.once('ready', async () => {
  console.log('Bot został zainicjalizowany!')

  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)
  const user = client?.user

  if (!guild || !user) return console.error('Podany serwer nie istnieje!')

  await handlePermission(guild)
  await initBirthdays(guild)
  await initQuestions(client)
  await initActivityList(guild, user)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  try {
    const { commandName } = interaction
    commands[commandName].execute(interaction, client)
  } catch (error) {
    console.log(error)
    await interaction.reply({
      content: 'Wystąpił błąd przy wykonywaniu komendy!',
      ephemeral: true,
    })
  }
})

client.login(config.BOT_TOKEN)
