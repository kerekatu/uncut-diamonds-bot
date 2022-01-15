import { Client } from 'discord.js'
import config from './config'
import * as commandModules from './commands'
import { Command } from './types'

const commands: { [key: string]: Command } = Object(commandModules)

export const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
})

client.once('ready', () => {
  console.log('Discord bot initialized!')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  try {
    const { commandName } = interaction
    commands[commandName].execute(interaction, client)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'Wystąpił błąd przy wykonywaniu komendy!',
      ephemeral: true,
    })
  }
})

client.login(config.BOT_TOKEN)
