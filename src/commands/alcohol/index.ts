import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { PrismaClient } from '@prisma/client'

import listCommand from './list'
import rollCommand from './roll'
import { t } from '../../utils/exports'

const prisma = new PrismaClient()

const { alco } = t.commands

export const data = new SlashCommandBuilder()
  .setName(alco.command_name)
  .setDescription(`${alco.command_emoji} ${alco.command_description}`)
  .addUserOption((option) =>
    option
      .setName(t.options.user.name)
      .setDescription(t.options.user.description)
  )

export async function execute(interaction: CommandInteraction) {
  const userOption = interaction.options.getUser(t.options.user.name)

  if (userOption) {
    await listCommand(interaction, userOption)
  } else {
    await rollCommand(interaction, prisma)
  }
}
