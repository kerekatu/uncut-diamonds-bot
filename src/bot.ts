import { ChannelType, Client } from 'discord.js'
import config, { clientOptions } from './config'
import * as commandModules from './commands'
import { Command } from '../typings'
import initializeBot from './events/initialize'
import { logger, t } from './utils/exports'

const commands: Record<string, Command> = Object(commandModules)

export const client = new Client(clientOptions)

client.once('ready', async () => {
  await initializeBot(client)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  try {
    const { commandName } = interaction
    commands[commandName].execute(interaction, client)
  } catch (error) {
    logger.error(error)
    await interaction.reply({
      content: t.global.unknown_command,
      ephemeral: true,
    })
  }
})

client.on('messageCreate', (message) => {
  if (message.author.bot) return

  if (message.channel.type === ChannelType.DM) {
    logger.info(`${message.author.username}: ${message.content}`)
  }
})

client.login(config.BOT_TOKEN)
