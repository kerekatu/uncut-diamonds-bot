import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType } from 'discord-api-types'
import { Client, CommandInteraction } from 'discord.js'
import { COMMANDS } from '../../utils/constants'
import pytaniaCommand from './pytania'

const { pytania } = COMMANDS.admin.subCommands

export const data = new SlashCommandBuilder()
  .setDefaultPermission(false)
  .setName(COMMANDS.admin.name)
  .setDescription(COMMANDS.admin.description)
  .addSubcommand((subcommand) =>
    subcommand
      .setName(pytania.name)
      .setDescription(pytania.description)
      .addChannelOption((option) =>
        option
          .setName('kanał')
          .setDescription('Wybierz kanał')
          .setRequired(true)
          .addChannelType(ChannelType.GuildText)
      )
  )

export async function execute(interaction: CommandInteraction, client: Client) {
  if (interaction.options.getSubcommand() === pytania.name) {
    await pytaniaCommand(interaction, client)
  }
}
