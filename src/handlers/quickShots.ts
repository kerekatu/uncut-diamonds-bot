import { QuickShotsObj } from './../../typings/index.d'
import schedule from 'node-schedule'
import { PrismaClient, QuickShots } from '@prisma/client'
import { ChannelType, Client, EmbedBuilder } from 'discord.js'
import { logger, t } from '../utils/exports'
import { embedColor } from '../config'

export const incrementQuickShot = async (
  quickShots: QuickShots | null,
  client: Client
) => {
  if (!quickShots) return logger.error(t.handlers.quickShots.empty_list)

  if (!Array.isArray(quickShots.quickShots))
    return logger.error(t.handlers.quickShots.not_array)

  const channel = await prisma.channels.findUnique({
    where: { commandName: t.commands.admin.quickShots.command_name },
  })

  if (!channel) return logger.error(t.handlers.quickShots.missing_channel)

  const guildChannel = client.channels.cache.get(channel.channelId)

  if (!guildChannel || guildChannel.type !== ChannelType.GuildText)
    return logger.error(t.handlers.quickShots.wrong_channel)

  const index =
    quickShots.quickShots.length > quickShots.currentIndex
      ? quickShots.currentIndex
      : 0

  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(
      `${t.handlers.quickShots.embed_title} • ${quickShots.currentIndex + 1}/${
        quickShots.quickShots.length + 1
      }`
    )
    .setDescription(
      `${
        (quickShots.quickShots as unknown as QuickShotsObj[])[index]?.first
      } czy ${
        (quickShots.quickShots as unknown as QuickShotsObj[])[index]?.second
      }?
      `
    )

  const message = await guildChannel.send({ embeds: [embed] })
  await message.react(t.handlers.quickShots.reactions.first)
  await message.react(t.handlers.quickShots.reactions.second)

  const updateQuickShotIndex = await prisma.quickShots.update({
    where: {
      id: 2,
    },
    data: {
      currentIndex: !Array.isArray(quickShots.quickShots)
        ? [...Array(quickShots.quickShots)]?.length - 1
        : quickShots.quickShots?.length - 1 > quickShots.currentIndex
        ? quickShots.currentIndex + 1
        : 0,
    },
  })

  if (!updateQuickShotIndex)
    return logger.error(t.handlers.quickShots.update_error)
}

const prisma = new PrismaClient()

export default async function handleQuickShots(client: Client) {
  // will invoke at 9:00 everyday
  const scheduleRule = new schedule.RecurrenceRule()
  scheduleRule.hour = 9
  scheduleRule.minute = 0
  scheduleRule.tz = 'CET'

  // schedule new job
  schedule.scheduleJob('QUICK_SHOTS_JOB', scheduleRule, async () => {
    const quickShots = await prisma.quickShots.findFirst()
    await incrementQuickShot(quickShots, client)
  })
}
