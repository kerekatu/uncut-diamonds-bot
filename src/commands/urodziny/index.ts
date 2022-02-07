import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, GuildMemberRoleManager } from 'discord.js'
import { validateDate } from '../../utils/helpers'
import schedule from 'node-schedule'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const data = new SlashCommandBuilder()
  .setName('urodziny')
  .setDescription('🎂 Dodaj swoje urodziny do kalendarza')
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

  const date = await validateDate(day, month, year, interaction)
  if (!date) return

  const birthdayExists = await prisma.birthdays.findUnique({
    where: { userId: interaction.member?.user.id },
  })

  if (birthdayExists)
    return await interaction.reply('Twoje urodziny są już ustawione!')

  const birthday = await prisma.birthdays.create({
    data: <Prisma.BirthdaysCreateInput>{
      date: `${day}.${month}.${year}`,
      userId: interaction.member?.user.id,
    },
  })

  if (birthday) {
    const date = [...birthday.date.split('.')]
    schedule.scheduleJob(
      birthday.userId,
      { date: date[0], month: Number(date[1]) - 1 },
      () => {
        const randomId = Math.floor(Math.random() * 100 + Date.now()).toString()
        const role = interaction.guild?.roles.cache.find(
          (role) => role.name === 'Urodziny'
        )

        if (!role) return

        const roles = <GuildMemberRoleManager>interaction.member?.roles
        roles.add(role)

        schedule.scheduleJob(randomId, { minute: 59, hour: 23 }, () => {
          roles.remove(role)
          schedule.cancelJob(randomId)
        })
      }
    )

    return await interaction.reply('Pomyślnie dodano urodziny!')
  }
}
