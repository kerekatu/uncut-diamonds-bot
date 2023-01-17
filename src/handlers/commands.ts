import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from '../config'
import * as commandModules from '../commands'
import { Command } from '../../typings'
import { SlashCommandBuilder } from '@discordjs/builders'
import { logger, t } from '../utils/exports'

const handleCommands = async () => {
  let commands: SlashCommandBuilder[] = []

  for (const module of Object.values<Command>(commandModules as any)) {
    commands = [...commands, module.data]
  }

  const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN)
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID),
      {
        body: commands,
      }
    )
    logger.info(t.global.commands_initialized)
  } catch (error) {
    logger.error(error)
  }
}

export default handleCommands
