import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from './config'
import * as commandModules from './commands'
import { Command } from './types'
import { SlashCommandBuilder } from '@discordjs/builders'

const commands: SlashCommandBuilder[] = []

for (const module of Object.values<Command>(commandModules as any)) {
  commands.push(module.data)
}

const rest = new REST({ version: '9' }).setToken(config.BOT_TOKEN)

rest
  .put(Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID), {
    body: commands,
  })
  .then(() => console.log('Commands deployed successfully'))
  .catch((err) => console.error(err))
