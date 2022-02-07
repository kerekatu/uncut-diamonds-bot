import {
  ApplicationCommandOptionType,
  CommandInteraction,
  EmojiResolvable,
} from 'discord.js'

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

export async function validateDate(
  day: number | null,
  month: number | null,
  year: number | null,
  interaction: CommandInteraction
) {
  if (!day || !month || !year) {
    await interaction.reply('Data nie została w pełni wybrana!')

    return false
  } else if (daysInMonth(month, year) < day) {
    await interaction.reply(
      `Ten miesiąc ma ${daysInMonth(month, year)} dni, nie ${day}!`
    )

    return false
  } else if (
    year < 1960 ||
    year > new Date().getFullYear() ||
    month > 12 ||
    month < 0 ||
    day < 0 ||
    day > 31
  ) {
    await interaction.reply('Błędna data!')

    return false
  }

  return true
}

export function validateTime(hour: number | null, minute: number | null) {
  if (!hour?.toString() || !minute?.toString()) return false

  if (hour > 23 || hour < 0 || minute > 59 || minute < 0) return false

  return true
}
