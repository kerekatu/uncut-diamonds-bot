import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from '../config'
import * as commandModules from '../commands'
import { Command } from '../../typings'
import { SlashCommandBuilder } from '@discordjs/builders'

const handleCommands = async () => {
  const commands: SlashCommandBuilder[] = []

  for (const module of Object.values<Command>(commandModules as any)) {
    commands.push(module.data)
  }

  const rest = new REST({ version: '9' }).setToken(config.BOT_TOKEN)
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID),
      {
        body: commands,
      }
    )
    console.log('Komendy (/) zostały poprawnie załadowane!')
  } catch (error) {
    console.error(error)
  }
}

export default handleCommands
