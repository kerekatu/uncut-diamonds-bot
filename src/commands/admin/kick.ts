import { Client, CommandInteraction, GuildMember } from 'discord.js'
import { t } from '../../utils/exports'

const { kick } = t.commands.admin

export default async function kickCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const member = interaction.options.getMember(kick.user_option)

  if (!member)
    return await interaction.reply({
      content: kick.wrong_user,
      ephemeral: true,
    })

  try {
    await (member as GuildMember).send(kick.dm)
  } catch (error) {
    return await interaction.reply({
      content: kick.failed_message,
      ephemeral: true,
    })
  }

  await (member as GuildMember).kick()

  return await interaction.reply({
    content: kick.success_message,
    ephemeral: true,
  })
}
