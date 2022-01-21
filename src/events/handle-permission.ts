import { Guild } from 'discord.js'
import { COMMANDS } from '../utils/constants'

export default async function handlePermission(guild: Guild) {
  const commands = await guild.commands.fetch()

  commands.forEach(async (command) => {
    if (
      command.name === 'admin' &&
      command.options.find((option) => option.type === 'SUB_COMMAND')
    ) {
      const role = guild.roles.cache.find(
        (role) => role.name === COMMANDS.admin.permissionRole
      )
      if (!role)
        return console.error(
          'Rola nie znaleziona. Nie udało się ustawić permisji!'
        )
      await command.permissions.add({
        permissions: [
          {
            id: role.id,
            type: 'ROLE',
            permission: true,
          },
        ],
      })
    }
  })
}
