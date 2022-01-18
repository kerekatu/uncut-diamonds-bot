import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  HexColorString,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from 'discord.js'
import fetch from 'isomorphic-fetch'
import { ShopItem } from '../../types'
import { CONSTANTS } from '../../utils/constants'
import { addSpaceEveryCharacter, daysInMonth } from '../../utils/helpers'

export const data = new SlashCommandBuilder()
  .setName('urodziny')
  .setDescription('💡 Wyświetla informacje na temat serwera')
  .addNumberOption((option) =>
    option
      .setName('dzień')
      .setDescription('Wybierz dzień miesiąca (1-31)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(31)
  )
  .addNumberOption((option) =>
    option
      .setName('miesiąc')
      .setDescription('Wybierz miesiąc w roku (1-12)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(12)
  )
  .addNumberOption((option) =>
    option
      .setName('rok')
      .setDescription('Wybierz rok')
      .setRequired(true)
      .setMinValue(1960)
  )

export async function execute(interaction: CommandInteraction) {
  const day = interaction.options.getNumber('dzień')
  const month = interaction.options.getNumber('miesiąc')
  const year = interaction.options.getNumber('rok')

  if (!day || !month || !year) {
    return await interaction.reply('Data nie została w pełni wybrana!')
  } else if (daysInMonth(month, year) < day) {
    return await interaction.reply(
      `Ten miesiąc ma ${daysInMonth(month, year)} dni, nie ${day}!`
    )
  } else if (
    year < 1960 ||
    year > new Date().getFullYear() ||
    month > 12 ||
    month < 0 ||
    day < 0 ||
    day > 31
  ) {
    return await interaction.reply('Błędna data!')
  }

  return await interaction.reply(
    `Twoja data to ${[day, month, year].join('.')}`
  )
}
