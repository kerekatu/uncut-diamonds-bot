import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  MessageReaction,
  User,
} from 'discord.js'
import { CONSTANTS } from '../../utils/constants'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const recentlyUsed = new Set()

export const data = new SlashCommandBuilder()
  .setName('alko')
  .setDescription('🍺 Gra w zbieranie trunków')
  .addUserOption((option) =>
    option.setName('gracz').setDescription('Wybierz gracza')
  )

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser('gracz')

  if (user) {
    let currentPage = 1
    const itemsPerPage = 5
    const buttonPreviousId = 'previous'
    const buttonNextId = 'next'

    const productsCount = await prisma.alcohols.count({
      where: { userId: user.id },
    })
    const numberOfPages = Math.ceil(productsCount / itemsPerPage)

    const previousButton = new MessageButton()
      .setCustomId(buttonPreviousId)
      .setLabel('Poprzednia')
      .setStyle('PRIMARY')

    const nextButton = new MessageButton()
      .setCustomId(buttonNextId)
      .setLabel('Następna')
      .setStyle('PRIMARY')

    const generateEmbed = async () => {
      const products = await prisma.alcohols.findMany({
        skip: currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage,
        take: 5,
        where: {
          userId: user.id,
        },
      })

      return new MessageEmbed()
        .setColor(CONSTANTS.color)
        .setAuthor({
          name: `${user.username}`,
          iconURL: user.displayAvatarURL(),
        })
        .addField(
          'LISTA GRACZA • TRUNKI',
          `${
            products
              ? products
                  .map(
                    (item, index) =>
                      `**${index + 1 + (currentPage - 1) * itemsPerPage}.** ${
                        item.title
                      }\n`
                  )
                  .join(' ')
              : 'Twoja lista jest pusta'
          }`
        )
        .setFooter({
          text: `Strona ${currentPage}/${numberOfPages} • ${
            productsCount === 1
              ? productsCount + ' trunek'
              : productsCount + ' trunków'
          }`,
        })
    }

    await interaction.reply({
      embeds: [await generateEmbed()],
      components: [
        new MessageActionRow({
          components: [
            previousButton.setDisabled(currentPage === 1),
            nextButton.setDisabled(currentPage === numberOfPages),
          ],
        }),
      ],
    })

    const filter = (i: MessageComponentInteraction) =>
      interaction.user.id === i.user.id &&
      (i.customId === buttonNextId || i.customId === buttonPreviousId)

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      componentType: 'BUTTON',
      time: 1000 * 60,
    })

    collector?.on('collect', async (i) => {
      if (i.customId === buttonNextId) {
        if (currentPage < numberOfPages) currentPage++
        await i.update({
          embeds: [await generateEmbed()],
          components: [
            new MessageActionRow({
              components: [
                previousButton.setDisabled(currentPage === 1),
                nextButton.setDisabled(currentPage === numberOfPages),
              ],
            }),
          ],
        })
      } else if (i.customId === buttonPreviousId) {
        if (currentPage > 1) currentPage--
        await i.update({
          embeds: [await generateEmbed()],
          components: [
            new MessageActionRow({
              components: [
                previousButton.setDisabled(currentPage === 1),
                nextButton.setDisabled(currentPage === numberOfPages),
              ],
            }),
          ],
        })
      }
    })
  } else {
    const emoji = '❤️'
    const productsCount = await prisma.alcohols.count()
    const randomItem = await prisma.alcohols.findUnique({
      where: {
        id: Math.floor(Math.random() * productsCount),
      },
    })

    if (!randomItem)
      return await interaction.reply({ content: 'Coś poszło nie tak...' })

    const embed = new MessageEmbed()
      .setColor(CONSTANTS.color)
      .setTitle(randomItem.title)
      .setImage(
        `${
          randomItem?.link
            ? randomItem.link.includes('upload/')
              ? CONSTANTS.IMAGE_URLS.beer + '/' + randomItem.link
              : CONSTANTS.IMAGE_URLS.alco + '/' + randomItem.link
            : 'https://i.imgur.com/zR2tkVq.png'
        } `
      )

    if (recentlyUsed.has(interaction.member?.user.id)) {
      interaction.reply('Poczekaj minutę przed następnym użyciem...')
    } else {
      if (randomItem.userId) {
        embed.addField(`\u200b`, `Należy do <@${randomItem.userId}>`)
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
          time: 1000 * 15,
          maxEmojis: 2,
          max: 1,
        })
        collector.on('collect', async (i) => {
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
              embed.addField(`\u200b`, `Należy do <@${interaction.user.id}>`),
            ],
          })
        })
      }

      recentlyUsed.add(interaction.user.id)
      setTimeout(() => {
        recentlyUsed.delete(interaction.user.id)
      }, 60000)
    }
  }
}
