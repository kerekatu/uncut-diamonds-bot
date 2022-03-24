import { SlashCommandBuilder } from '@discordjs/builders'
import { PrismaClient } from '@prisma/client'
import { CommandInteraction } from 'discord.js'

const prisma = new PrismaClient()

export const data = new SlashCommandBuilder()
  .setName('event')
  .setDescription('Wyświetla listę rozpoczętych eventów')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('dołącz')
      .setDescription('Dołącz do eventu')
      .addStringOption((option) =>
        option.setName('nazwa').setDescription('Nazwa eventu').setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('lista')
      .setDescription('Wyświetla listę aktualnych eventów')
  )

export async function execute(interaction: CommandInteraction) {
  if (interaction.options.getSubcommand() === 'dołącz') {
    const nameOption = interaction.options.getString('nazwa')

    if (!nameOption) {
      return await interaction.reply({
        content: 'Nazwa eventu nie została wybrana!',
        ephemeral: true,
      })
    }

    if (!interaction.member?.user.id || !interaction.member?.user.username)
      return await interaction.reply({
        content: 'Nie odnaleziono twojego konta!',
        ephemeral: true,
      })

    try {
      const eventExists = await prisma.events.findUnique({
        where: { name: nameOption },
      })

      if (eventExists && eventExists.finished === false) {
        const userOnEventExists = await prisma.eventUsers.findFirst({
          where: {
            userId: interaction.member.user.id,
            event: {
              name: nameOption,
            },
          },
          include: {
            event: true,
          },
        })

        if (userOnEventExists)
          return await interaction.reply({
            content: 'Twoje konto jest już zapisane do eventu!',
            ephemeral: true,
          })
      } else {
        return await interaction.reply({
          content: 'Event o tej nazwie nie istnieje lub został zakończony!',
          ephemeral: true,
        })
      }
    } catch (error) {
      console.error(error)
      return await interaction.reply({
        content: 'Coś poszło nie tak...',
        ephemeral: true,
      })
    }

    try {
      await prisma.eventUsers.create({
        data: {
          userId: interaction.member.user.id,
          name: interaction.member.user.username,
          event: {
            connect: { name: nameOption },
          },
        },
      })

      return await interaction.reply('Pomyślnie dołączono Cię do eventu!')
    } catch (error) {
      console.log(error)
      return await interaction.reply({
        content: 'Coś poszło nie tak...',
        ephemeral: true,
      })
    }
  }
}
