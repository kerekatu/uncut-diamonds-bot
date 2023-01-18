import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType, Client, CommandInteraction } from 'discord.js'
import pytaniaCommand from './questions'
import kickCommand from './kick'
import { t } from '../../utils/exports'
import logUsersCommand from './log-users'

const { questions, kick, ['log-users']: logUsers } = t.commands.admin
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
          .setName(t.options.user.name)
          .setDescription(t.options.channel.description)
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(logUsers.command_name)
      .setDescription(logUsers.command_description)
      .addRoleOption((option) =>
        option
          .setName(t.options.role.name)
          .setDescription(t.options.role.description)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName(t.options.includes.name)
          .setDescription(t.options.includes.description)
          .addChoices(
            {
              name: logUsers.choices.single.name,
              value: logUsers.choices.single.value,
            },
            {
              name: logUsers.choices.all.name,
              value: logUsers.choices.all.value,
            }
          )
          .setRequired(true)
      )
  )

export async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.isChatInputCommand()) return

  if (interaction.options.getSubcommand() === questions.command_name) {
    await pytaniaCommand(interaction, client)
  } else if (interaction.options.getSubcommand() === kick.command_name) {
    await kickCommand(interaction, client)
  } else if (interaction.options.getSubcommand() === logUsers.command_name) {
    await logUsersCommand(interaction, client)
  }
}
