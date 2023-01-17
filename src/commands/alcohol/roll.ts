import { PrismaClient } from '@prisma/client'
import {
  CommandInteraction,
  EmbedBuilder,
  Message,
  MessageReaction,
  User,
} from 'discord.js'
import { embedColor } from '../../config'

const COMMAND_DELAY = +process.env.ALCO_COOLDOWN ?? 1000 * 60
const NUMBER_OF_ROLLS = 3

// current approach modifies the original array due to performance

let recentlyUsed: { userId: string; time?: number }[] = []
const recentlyLiked = new Set()

export default async function rollCommand(
  interaction: CommandInteraction,
  prisma: PrismaClient
) {
  const emoji = '❤️'
  const productsCount = await prisma.alcohols.count()
  const randomItem = await prisma.alcohols.findUnique({
    where: {
      id: Math.floor(Math.random() * productsCount),
    },
  })

  if (!randomItem)
    return await interaction.reply({ content: 'Coś poszło nie tak...' })

  const numberOfRollsUsed = recentlyUsed.filter(
    (uses) => uses.userId.indexOf(interaction.user.id) !== -1
  ).length

  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle(randomItem.title)
    .setImage(`${randomItem?.link ?? 'https://i.imgur.com/zR2tkVq.png'} `)
    .setFooter({ text: `🎲 ${2 - numberOfRollsUsed}` })

  if (numberOfRollsUsed >= NUMBER_OF_ROLLS) {
    const hasUser = recentlyUsed.find(
      (user) => user.userId === interaction.member?.user.id
    )

    interaction.reply(
      `Poczekaj ${Math.ceil(
        ((hasUser?.time as number) - new Date().getTime()) / 1000
      )} sek. przed następnym użyciem...`
    )

    setTimeout(() => {
      interaction.deleteReply()
    }, 5000)
  } else {
    if (randomItem.userId) {
      embed.addFields({
        name: `\u200b`,
        value: `Należy do <@${randomItem.userId}>`,
      })
      await interaction.reply({
        embeds: [embed],
      })
    } else {
      const message = (await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      })) as Message
      await message.react(emoji)

      const filter = (reaction: MessageReaction, user: User): boolean =>
        reaction.emoji.name === emoji &&
        user.id === message.interaction?.user.id

      const collector = message.createReactionCollector({
        filter,
        time: 1000 * 30,
        maxEmojis: 2,
        max: 1,
      })
      collector.on('collect', async () => {
        if (recentlyLiked.has(interaction.user.id)) {
          await interaction.followUp({
            content: `Możesz zgarnąć tylko jeden trunek co ${
              COMMAND_DELAY / 1000 / 60
            } minut!`,
            ephemeral: true,
          })
        } else {
          await prisma.alcohols.update({
            where: {
              id: randomItem.id,
            },
            data: {
              userId: interaction.user.id,
            },
          })
          await interaction.editReply({
            embeds: [
              embed.addFields({
                name: `\u200b`,
                value: `Należy do <@${interaction.user.id}>`,
              }),
            ],
          })

          recentlyLiked.add(interaction.user.id)
          setTimeout(() => {
            recentlyLiked.delete(interaction.user.id)
          }, COMMAND_DELAY)
        }
      })
    }

    const addToRecentlyUsed = () =>
      recentlyUsed.push({
        userId: interaction.user.id,
        time: new Date().getTime() + COMMAND_DELAY,
      })

    addToRecentlyUsed()

    if (numberOfRollsUsed < 1) {
      setTimeout(() => {
        for (const user of recentlyUsed) {
          if (user.userId === interaction.user.id) {
            recentlyUsed = recentlyUsed.filter(
              (user) => user.userId !== interaction.user.id
            )
          }
        }
      }, COMMAND_DELAY)
    }
  }
}
