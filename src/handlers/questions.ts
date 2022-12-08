import { PrismaClient, Questions } from '@prisma/client'
import { Client, MessageEmbed } from 'discord.js'
import schedule from 'node-schedule'
import { embedColor } from '../config'
import { COMMANDS } from '../utils/constants'

export const incrementQuestion = async (
  questions: Questions | null,
  client: Client
) => {
  if (!questions) return console.error('Błąd zapytania, lista pytań jest pusta')

  if (!Array.isArray(questions.questions))
    return console.error('Błąd zapytania, wartość musi być tablicą')

  const channel = await prisma.channels.findUnique({
    where: { commandName: COMMANDS.admin.subCommands.pytania.name },
  })

  if (!channel) return console.error('Błąd zapytania')

  const guildChannel = client.channels.cache.get(channel.channelId)

  if (!guildChannel || !guildChannel.isText())
    return console.error('Taki kanał nie istnieje')

  const embed = new MessageEmbed()
    .setColor(embedColor)
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

  await guildChannel.send({ embeds: [embed] })

  const updateQuestionIndex = await prisma.questions.update({
    where: {
      id: 2,
    },
    data: {
      currentIndex: !Array.isArray(questions.questions)
        ? [...Array(questions.questions)]?.length - 1
        : questions.questions?.length - 1 > questions.currentIndex
        ? questions.currentIndex + 1
        : 0,
    },
  })

  if (!updateQuestionIndex)
    return console.error('Nie udało się zaktualizować danych')
}

const prisma = new PrismaClient()

export default async function handleQuestions(client: Client) {
  const randomId = Math.floor(Math.random() * 100 + Date.now()).toString()

  // at 00:00 everyday
  const scheduleRule = new schedule.RecurrenceRule()
  scheduleRule.hour = 0
  scheduleRule.minute = 0
  scheduleRule.tz = 'CET'
  schedule.scheduleJob(randomId, scheduleRule, async () => {
    const questions = await prisma.questions.findFirst()
    await incrementQuestion(questions, client)
  })
}
