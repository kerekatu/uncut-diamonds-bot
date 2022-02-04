import { ApplicationCommandOptionType, EmojiResolvable } from 'discord.js'

export function addSpaceEveryCharacter(string: string | number) {
  if (!string) return

  return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function daysInMonth(month: number | null, year: number | null) {
  if (!month || !year) return 0

  return new Date(year, month, 0).getDate()
}

export function appendEmoji(emoji: EmojiResolvable, text: string) {
  return `${emoji} ${text}`
}

export function convertTypeToMethod(
  type: ApplicationCommandOptionType
): string | null {
  if (type === 'STRING') return 'addStringOption'
  else if (type === 'BOOLEAN') return 'addBooleanOption'
  else if (type === 'INTEGER') return 'addIntegerOption'
  else if (type === 'USER') return 'addUserOption'
  else if (type === 'CHANNEL') return 'addChannelOption'
  else if (type === 'MENTIONABLE') return 'addMentionableOption'
  else if (type === 'ROLE') return 'addRoleOption'
  else if (type === 'NUMBER') return 'addNumberOption'
  else if (type === 'SUB_COMMAND') return 'addSubcommand'
  else if (type === 'SUB_COMMAND_GROUP') return 'addSubcommandGroup'

  return null
}
