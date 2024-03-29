import { incrementQuestion } from '../../handlers/questions'
import { PrismaClient } from '@prisma/client'
import { Client, CommandInteraction } from 'discord.js'
import handleQuestions from '../../handlers/questions'
import { t } from '../../utils/exports'

const prisma = new PrismaClient()

export default async function questionsCommand(
  interaction: CommandInteraction,
  client: Client
) {
  const channels = interaction.guild?.channels.cache
  const interactionChannelId = interaction.options?.get(t.options.channel.name)
    ?.channel?.id

  if (
    !interactionChannelId ||
    !channels?.find((channel) => channel.id === interactionChannelId)
  ) {
    return await interaction.reply({
      content: t.global.unknown_channel,
      ephemeral: true,
    })
  }

  const assignedChannel = await prisma.channels.upsert({
    where: {
      commandName: t.commands.admin.questions.command_name,
    },
    update: { channelId: interactionChannelId },
    create: {
      commandName: t.commands.admin.questions.command_name,
      channelId: interactionChannelId,
    },
  })

  if (!assignedChannel)
    return await interaction.reply({
      content: t.commands.admin.questions.update_error,
      ephemeral: true,
    })

  const questions = await prisma.questions.findFirst()

  await incrementQuestion(questions, client)
  await handleQuestions(client)

  return await interaction.reply({
    content: t.commands.admin.questions.success_message,
    ephemeral: true,
  })
}
