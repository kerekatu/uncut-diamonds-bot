import { Guild } from 'discord.js'
import { daysInMonth } from './date'

export function formatActivity(text: string, guild: Guild) {
  let newText = text

  if (text.includes('{userCount}')) {
    newText = newText.replace(/{userCount}/g, guild?.memberCount.toString())
  }

  return newText
}

export function formatDateMessages(
  text: string,
  date: { day: number; month: number; year: number }
) {
  let newText = text

  if (text.includes('{days}')) {
    newText = newText.replace(
      /{days}/,
      daysInMonth(date.month, date.year).toString()
    )
  } else if (text.includes('{day}')) {
    newText = newText.replace('/{day}/', date.day.toString())
  }

  return newText
}
