import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType, Client, CommandInteraction } from 'discord.js'
import pytaniaCommand from './questions'
import kickCommand from './kick'
import { t } from '../../utils/exports'
import logUserCommand from './log-user'

const { questions, kick } = t.commands.admin
const { admin } = t.commands

export const data = new SlashCommandBuilder()
  .setDefaultMemberPermissions('0')
  .setName(admin.group_name)
  .setDescription(`${admin.group_emoji} ${admin.group_description}`)
  .addSubcommand((subcommand) =>
    subcommand
      .setName(questions.command_name)
      .setDescription(`${admin.group_emoji} ${questions.command_description}`)
      .addChannelOption((option) =>
        option
          .setName(t.options.channel.name)
          .setDescription(t.options.channel.description)
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(kick.command_name)
      .setDescription(kick.command_description)
      .addUserOption((option) =>
        option
          .setName(t.options.channel.name)
          .setDescription(t.options.channel.description)
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('log-user')
      .setDescription('Wysrywa listę użytkowników w danej roli')
      .addRoleOption((option) =>
        option.setName('rola').setDescription('Wybierz rolę').setRequired(true)
      )
  )

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.isChatInputCommand()) return

  if (interaction.options.getSubcommand() === questions.command_name) {
    await pytaniaCommand(interaction, client)
  } else if (interaction.options.getSubcommand() === kick.command_name) {
    await kickCommand(interaction, client)
  } else if (interaction.options.getSubcommand() === 'log-user') {
    await logUserCommand(interaction, client)
  }
}
