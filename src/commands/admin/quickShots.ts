import { PrismaClient } from '@prisma/client'
import { Client, CommandInteraction } from 'discord.js'
import { t } from '../../utils/exports'
import handleQuickShots, { incrementQuickShot } from '../../handlers/quickShots'

const prisma = new PrismaClient()

export default async function quickShotsCommand(
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
      commandName: t.commands.admin.quickShots.command_name,
    },
    update: { channelId: interactionChannelId },
    create: {
      commandName: t.commands.admin.quickShots.command_name,
      channelId: interactionChannelId,
    },
  })

  if (!assignedChannel)
    return await interaction.reply({
      content: t.commands.admin.quickShots.update_error,
      ephemeral: true,
    })

  const quickShots = await prisma.quickShots.findFirst()

  await incrementQuickShot(quickShots, client)
  await handleQuickShots(client)

  return await interaction.reply({
    content: t.commands.admin.quickShots.success_message,
    ephemeral: true,
  })
}
