import { incrementQuestion } from './../../handlers/questions'
import { PrismaClient } from '@prisma/client'
import { Client, CommandInteraction } from 'discord.js'
import handleQuestions from '../../handlers/questions'

const prisma = new PrismaClient()

export default async function pytaniaCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const channels = interaction.guild?.channels.cache
  const interactionChannelId = interaction.options?.getChannel('kanał')?.id

  if (
    !interactionChannelId ||
    !channels?.find((channel) => channel.id === interactionChannelId)
  ) {
    return await interaction.reply({
      content: 'Wybrany kanał nie istnieje!',
      ephemeral: true,
    })
  }

  const assignedChannel = await prisma.channels.upsert({
    where: {
      commandName: 'pytania',
    },
    update: { channelId: interactionChannelId },
    create: {
      commandName: 'pytania',
      channelId: interactionChannelId,
    },
  })

  if (!assignedChannel)
    return await interaction.reply({
      content: 'Nie udało się dodać danych do bazy!',
      ephemeral: true,
    })

  const questions = await prisma.questions.findFirst()

  await incrementQuestion(questions, client)
  await handleQuestions(client)

  return await interaction.reply({
    content: 'Kanał do pytań został pomyślnie ustawiony!',
    ephemeral: true,
  })
}
