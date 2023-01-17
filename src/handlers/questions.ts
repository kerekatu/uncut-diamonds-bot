import { PrismaClient, Questions } from '@prisma/client'
import { ChannelType, Client, EmbedBuilder } from 'discord.js'
import schedule from 'node-schedule'
import { embedColor } from '../config'
import { COMMANDS } from '../utils/constants'
import { logger, t } from '../utils/exports'

export const incrementQuestion = async (
  questions: Questions | null,
  client: Client
) => {
  if (!questions) return logger.error(t.questions.empty_list)

  if (!Array.isArray(questions.questions))
    return logger.error(t.questions.not_array)

  const channel = await prisma.channels.findUnique({
    where: { commandName: COMMANDS.admin.subCommands.pytania.name },
  })

  if (!channel) return logger.error(t.questions.missing_channel)

  const guildChannel = client.channels.cache.get(channel.channelId)

  if (!guildChannel || guildChannel.type !== ChannelType.GuildText)
    return logger.error(t.questions.wrong_channel)

  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(
      `${t.questions.question_title} • ${questions.currentIndex + 1}/${
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

  if (!updateQuestionIndex) return logger.error(t.questions.unable_to_update)
}

const prisma = new PrismaClient()

export default async function handleQuestions(client: Client) {
  // will invoke at 00:00 everyday
  const scheduleRule = new schedule.RecurrenceRule()
  scheduleRule.hour = 0
  scheduleRule.minute = 0
  scheduleRule.tz = 'CET'

  // schedule new job
  schedule.scheduleJob('QUESTIONS_JOB', scheduleRule, async () => {
    const questions = await prisma.questions.findFirst()
    await incrementQuestion(questions, client)
  })
}
