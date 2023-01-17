import { Client, CommandInteraction, GuildMember } from 'discord.js'
import { t } from '../../utils/exports'

export default async function kickCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const member = interaction.options.getMember(t.kick.user_option)

  if (!member)
    return await interaction.reply({
      content: t.kick.wrong_user,
      ephemeral: true,
    })

  try {
    await (member as GuildMember).send(t.kick.dm)
  } catch (error) {
    return await interaction.reply({
      content: t.kick.failed_message,
      ephemeral: true,
    })
  }

  await (member as GuildMember).kick()

  return await interaction.reply({
    content: t.kick.success_message,
    ephemeral: true,
  })
}
