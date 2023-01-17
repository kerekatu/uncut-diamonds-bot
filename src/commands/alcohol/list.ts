import { PrismaClient } from '@prisma/client'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  MessageComponentInteraction,
  User,
} from 'discord.js'
import { embedColor } from '../../config'

const prisma = new PrismaClient()

export default async function listCommand(
  interaction: CommandInteraction,
  userOption: User
) {
  let currentPage = 1
  const itemsPerPage = 5
  const buttonPreviousId = 'previous'
  const buttonNextId = 'next'

  const productsCount = await prisma.alcohols.count({
    where: { userId: userOption.id },
  })
  const numberOfPages = Math.ceil(productsCount / itemsPerPage)

  const previousButton = new ButtonBuilder()
    .setCustomId(buttonPreviousId)
    .setLabel('Poprzednia')
    .setStyle(ButtonStyle.Primary)

  const nextButton = new ButtonBuilder()
    .setCustomId(buttonNextId)
    .setLabel('Następna')
    .setStyle(ButtonStyle.Primary)

  const generateEmbed = async () => {
    const products = await prisma.alcohols.findMany({
      skip: currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage,
      take: 5,
      where: {
        userId: userOption.id,
      },
    })

    return new EmbedBuilder()
      .setColor(embedColor)
      .setAuthor({
        name: `${userOption.username}`,
        iconURL: userOption.displayAvatarURL(),
      })
      .addFields({
        name: 'LISTA GRACZA • TRUNKI',
        value: `${
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
        }`,
      })
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
      new ActionRowBuilder<ButtonBuilder>().addComponents([
        previousButton.setDisabled(currentPage === 1),
        nextButton.setDisabled(currentPage === numberOfPages),
      ]),
    ],
  })

  const filter = (i: MessageComponentInteraction) =>
    interaction.user.id === i.user.id &&
    (i.customId === buttonNextId || i.customId === buttonPreviousId)

  const collector = interaction.channel?.createMessageComponentCollector({
    filter,
    componentType: ComponentType.Button,
    time: 1000 * 60,
  })

  collector?.on('collect', async (i) => {
    if (i.customId === buttonNextId) {
      if (currentPage < numberOfPages) currentPage++
      await i.update({
        embeds: [await generateEmbed()],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents([
            previousButton.setDisabled(currentPage === 1),
            nextButton.setDisabled(currentPage === numberOfPages),
          ]),
        ],
      })
    } else if (i.customId === buttonPreviousId) {
      if (currentPage > 1) currentPage--
      await i.update({
        embeds: [await generateEmbed()],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents([
            previousButton.setDisabled(currentPage === 1),
            nextButton.setDisabled(currentPage === numberOfPages),
          ]),
        ],
      })
    }
  })
}
