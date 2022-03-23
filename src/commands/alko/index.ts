import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { PrismaClient } from '@prisma/client'

import listCommand from './lista'
import rollCommand from './losuj'

const prisma = new PrismaClient()

export const data = new SlashCommandBuilder()
  .setName('alko')
  .setDescription('🍺 Gra w zbieranie trunków')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('lista')
      .setDescription('Zobacz listę własnych trunków lub innych graczy')
      .addUserOption((option) =>
        option
          .setName('gracz')
          .setDescription('Wybierz gracza')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('losuj').setDescription('Losuj trunek')
  )

export async function execute(interaction: CommandInteraction) {
  if (interaction.options.getSubcommand() === 'lista') {
    await listCommand(interaction)
  } else if (interaction.options.getSubcommand() === 'losuj') {
    await rollCommand(interaction, prisma)
  }
}
