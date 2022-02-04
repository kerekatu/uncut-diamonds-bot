import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from '@discordjs/builders'
import { CommandData } from '../../typings'
import { appendEmoji, convertTypeToMethod } from './helpers'

const createCommand = (data: CommandData) => {
  const command = new SlashCommandBuilder()
    .setName(data.name)
    .setDescription(appendEmoji(data.emoji || '💎', data.description))
    .setDefaultPermission(data?.defaultPermissions ?? true)

  if (data.subCommands) {
    for (const subCommand of data.subCommands) {
      command.addSubcommand((s) => {
        const newSubcommand = s
          .setName(subCommand.name)
          .setDescription(
            appendEmoji(data.emoji || '💎', subCommand.description)
          )

        if (subCommand.options) {
          for (const option of subCommand.options) {
            const methodType = convertTypeToMethod(option.type)

            if (!option.type || !methodType) {
              return newSubcommand
            }

            const addOption = (newSubcommand as any)[methodType](
              (o: SlashCommandSubcommandBuilder) =>
                o.setName(option.name).setDescription(option.description)
            )

            addOption()
          }
        }

        return newSubcommand
      })
    }
  }

  return command
}

export default createCommand
