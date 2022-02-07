import { PrismaClient } from '@prisma/client'
import { CommandInteraction } from 'discord.js'
import { validateDate, validateTime } from '../../utils/helpers'

const prisma = new PrismaClient()

export default async function eventCommand(interaction: CommandInteraction) {
  const nameOption = interaction.options.getString('nazwa')

  if (!nameOption || typeof nameOption !== 'string') {
    return await interaction.reply({
      content: 'Nazwa dla eventu nie została wybrana!',
      ephemeral: true,
    })
  }

  if (interaction.options.getSubcommand() === 'start') {
    const day = interaction.options.getNumber('dzień')
    const month = interaction.options.getNumber('miesiąc')
    const hour = interaction.options.getNumber('godzina')
    const minute = interaction.options.getNumber('minuta')

    const date = await validateDate(
      day,
      month,
      new Date().getFullYear(),
      interaction
    )
    if (!date) return

    if (!validateTime(hour, minute)) {
      return await interaction.reply({
        content: 'Wybrany czas jest błędny (godzina i minuta)',
        ephemeral: true,
      })
    }

    const eventExists = await prisma.events.findUnique({
      where: { name: nameOption },
    })

    if (eventExists && eventExists.finished === false) {
      return await interaction.reply({
        content: 'Event z tą nazwą już istnieje!',
        ephemeral: true,
      })
    }

    try {
      const checkMonth = <number>month > new Date().getMonth()
      const event = await prisma.events.create({
        data: {
          name: nameOption,
          date: new Date(
            Date.UTC(
              checkMonth
                ? new Date().getFullYear()
                : new Date().getFullYear() + 1,
              <number>month - 1,
              <number>day,
              <number>hour,
              <number>minute
            )
          ),
        },
      })

      return await interaction.reply(
        `Pomyślnie utworzono event "${event.name}"`
      )
    } catch (error) {
      return await interaction.reply({
        content: 'Coś poszło nie tak...',
        ephemeral: true,
      })
    }
  } else if (interaction.options.getSubcommand() === 'stop') {
    // try {
    //   const bets = prisma.bets.findMany({})
    // } catch (error) {
    // }
  }

  return await interaction.reply({
    content: 'Komenda została wywołana bez żadnych opcji...',
    ephemeral: true,
  })
}
