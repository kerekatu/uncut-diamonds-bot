import { Client, CommandInteraction } from 'discord.js'
import config from '../../config'

export default async function logUserCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const option = interaction.options.get('rola')

  if (!option)
    return await interaction.reply({
      content: 'Podana rola nie istnieje',
      ephemeral: true,
    })

  let users: string[]

  try {
    const guild = client.guilds.cache.get(config.GUILD_ID)
    if (!guild) return

    users = guild.roles.cache
      .get(option.role?.id || '0')
      ?.members.filter((member) => member.roles.cache.size === 2)
      .map((member) => `@${member.user.tag}`) as string[]

    if (!users)
      return await interaction.reply({
        content: `Lista użytkowników z tą rolą jest pusta`,
        ephemeral: true,
      })
  } catch (error) {
    return await interaction.reply({
      content: 'Coś poszło nie tak...',
      ephemeral: true,
    })
  }

  return await interaction.reply({
    content: `${users?.join('\n')}`,
    ephemeral: true,
  })
}
