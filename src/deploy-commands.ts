import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from './config'
import { SlashCommandBuilder } from '@discordjs/builders'
import * as commandModules from './commands'

type Command = {
  data: SlashCommandBuilder
}

const commands = []

for (const module of Object.values<Command>(commandModules)) {
  commands.push(module.data)
}

const rest = new REST({ version: '9' }).setToken(config.BOT_TOKEN)

rest
  .put(Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID), {
    body: commands,
  })
  .then(() => console.log('Successful'))
  .catch((err) => console.error(err))
