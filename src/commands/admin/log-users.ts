import { Client, CommandInteraction } from 'discord.js'
import config from '../../config'
import { t } from '../../utils/exports'

const { ['log-users']: logCommand } = t.commands.admin

export default async function logUsersCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const optionRole = interaction.options.get(t.options.role.name)
  const optionIncludes = interaction.options.get(t.options.includes.name)?.value

  if (!optionRole || !optionIncludes)
    return await interaction.reply({
      content: logCommand.wrong_role,
      ephemeral: true,
    })

  let users: string[] | undefined

  try {
    const guild = client.guilds.cache.get(config.GUILD_ID)
    if (!guild)
      return await interaction.reply({
        content: logCommand.wrong_server,
        ephemeral: true,
      })

    users = guild.roles.cache
      .get(optionRole.role?.id || '0')
      ?.members.filter((member) => {
        const singleRoleNum = 2

        if (optionIncludes === logCommand.choices.single.value) {
          return member.roles.cache.size === singleRoleNum
        }

        return
      })
      .map((member) => `@${member.user.tag}`)

    if (!users)
      return await interaction.reply({
        content: logCommand.empty_list,
        ephemeral: true,
      })
  } catch (error) {
    return await interaction.reply({
      content: logCommand.failed_message,
      ephemeral: true,
    })
  }

  return await interaction.reply({
    content: `${users?.join('\n')}`,
    ephemeral: true,
  })
}
