import { CommandInteraction } from 'discord.js'
import { formatDateMessages } from './replaceVar'
import { t } from './exports'

export function daysInMonth(month: number | null, year: number | null) {
  if (!month || !year) return 0

  return new Date(year, month, 0).getDate()
}

export async function validateDate(
  day: number | null,
  month: number | null,
  year: number | null,
  interaction: CommandInteraction
) {
  if (!day || !month || !year) {
    await interaction.reply(t.date.missing_date)

    return false
  } else if (daysInMonth(month, year) < day) {
    await interaction.reply(
      formatDateMessages(t.date.wrong_day_amount, { day, month, year })
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
    await interaction.reply(t.date.wrong_date)

    return false
  }

  return true
}

export function validateTime(hour: number | null, minute: number | null) {
  if (!hour?.toString() || !minute?.toString()) return false

  if (hour > 23 || hour < 0 || minute > 59 || minute < 0) return false

  return true
}
