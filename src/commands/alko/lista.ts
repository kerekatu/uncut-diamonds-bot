import { PrismaClient } from '@prisma/client'
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
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
        userId: userOption.id,
      },
    })

    return new MessageEmbed()
      .setColor(embedColor)
      .setAuthor({
        name: `${userOption.username}`,
        iconURL: userOption.displayAvatarURL(),
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
}
