import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { PrismaClient } from '@prisma/client'

import listCommand from './list'
import rollCommand from './roll'

const prisma = new PrismaClient()

export const data = new SlashCommandBuilder()
  .setName('alko')
  .setDescription('🍺 Gra w zbieranie trunków')
  .addUserOption((option) =>
    option.setName('gracz').setDescription('Wybierz gracza')
  )

export async function execute(interaction: CommandInteraction) {
  const userOption = interaction.options.getUser('gracz')

  if (userOption) {
    await listCommand(interaction, userOption)
  } else {
    await rollCommand(interaction, prisma)
  }
}
