import { Prisma, PrismaClient } from '@prisma/client'
import { Client, MessageEmbed } from 'discord.js'
import schedule from 'node-schedule'
import { COMMANDS, CONSTANTS } from '../utils/constants'

const prisma = new PrismaClient()

export default async function initQuestions(client: Client) {
  const questions = await prisma.questions.findFirst()

  if (!questions || !Array.isArray(questions.questions))
    return console.error('Błąd zapytania')

  const randomId = Math.floor(Math.random() * 100 + Date.now()).toString()
  const channel = await prisma.channels.findUnique({
    where: { commandName: COMMANDS.admin.subCommands.pytania.name },
  })

  if (!channel) return console.error('Błąd zapytania')

  const guildChannel = client.channels.cache.get(channel.channelId)

  if (!guildChannel || !guildChannel.isText())
    return console.error('Taki kanał nie istnieje')

  const embed = new MessageEmbed()
    .setColor(CONSTANTS.color)
    .setTitle(
      `📖 PYTANIE DNIA • ${questions.currentIndex + 1}/${
        questions.questions.length + 1
      }`
    )
    .setDescription(
      `${
        questions.questions[
          questions.questions.length > questions.currentIndex
            ? questions.currentIndex
            : 0
        ]
      }`
    )

  // at 00:00 everyday
  schedule.scheduleJob(randomId, '0 0 * * *', async () => {
    await guildChannel.send({ embeds: [embed] })

    const updateQuestionIndex = await prisma.questions.update({
      where: {
        id: 2,
      },
      data: {
        currentIndex:
          (<Prisma.JsonArray>questions.questions)?.length - 1 >
          questions.currentIndex
            ? questions.currentIndex + 1
            : 0,
      },
    })

    if (!updateQuestionIndex)
      return console.error('Nie udało się zaktualizować danych')
  })
}
