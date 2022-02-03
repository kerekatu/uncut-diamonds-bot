import { Client } from 'discord.js'
import config, { clientOptions } from './config'
import * as commandModules from './commands'
import { Command } from './types'
import handleReadyEvent from './events/ready-event'

const commands: { [key: string]: Command } = Object(commandModules)

export const client = new Client(clientOptions)

client.once('ready', async () => {
  await handleReadyEvent(client)
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
