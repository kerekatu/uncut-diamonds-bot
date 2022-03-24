import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from 'discord.js'
import fetch from 'isomorphic-fetch'
import { embedColor } from '../../config'
import { ShopItem } from '../../../typings'
import { addSpaceEveryCharacter } from '../../utils/helpers'
import createCommand from '../../utils/create-command'
import { COMMANDS } from '../../utils/constants'

// export const data = new SlashCommandBuilder()
//   .setName('pomoc')
//   .setDescription('💡 Wyświetla informacje na temat serwera')
//   .addStringOption((option) =>
//     option
//       .setName('kategoria')
//       .setDescription('Wybierz jedną z dostępnym kategorii')
//       .setRequired(true)
//       .setChoices([
//         ['strona', 'strona'],
//         ['sklep', 'sklep'],
//         ['dotacje', 'dotacje'],
//       ])
//   )

export const data = createCommand(COMMANDS.pomoc)

export async function execute(interaction: CommandInteraction) {
  if (interaction.options.getString('kategoria') === 'strona') {
    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Strona Internetowa')
      .setDescription(`https://uncutdiamonds.top`)

    return await interaction.reply({ embeds: [embed] })
  } else if (interaction.options.getString('kategoria') === 'sklep') {
    let currentPage = 1
    const itemsPerPage = 5
    const buttonPreviousId = 'previous'
    const buttonNextId = 'next'

    const response = await fetch('https://uncutdiamonds.top/api/shop')
    const shopItems: { status: string; data: ShopItem[]; error?: unknown } =
      await response.json()

    const numberOfItems = shopItems.data.filter(
      (a) => !a.data.title.includes('Test')
    ).length
    const numberOfPages = Math.ceil(numberOfItems / itemsPerPage)

    const previousButton = new MessageButton()
      .setCustomId(buttonPreviousId)
      .setLabel('Poprzednia')
      .setStyle('PRIMARY')

    const nextButton = new MessageButton()
      .setCustomId(buttonNextId)
      .setLabel('Następna')
      .setStyle('PRIMARY')

    const generateEmbed = async () => {
      const paginatedItems = shopItems.data
        .filter((a) => !a.data.title.includes('Test'))
        .sort((a, b) => a.data.price - b.data.price)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

      return new MessageEmbed()
        .setColor(embedColor)
        .setAuthor({
          name: 'LISTA PRZEDMIOTÓW • SKLEP',
          url: 'https://uncutdiamonds.top/shop',
          iconURL: 'https://i.imgur.com/N4kRVTt.png',
        })
        .setURL('https://uncutdiamonds.top/shop')
        .setDescription(
          'Przejdź do internetowego sklepu klikając [tutaj](https://uncutdiamonds.top/shop)'
        )
        .addField(
          '\u200b',
          `${paginatedItems
            .map(
              (item, index) =>
                `**${index + 1 + (currentPage - 1) * itemsPerPage}.** ${
                  item.data.title
                } • ${addSpaceEveryCharacter(
                  item.data.price
                )} <:uddiament:922146732060594207>\nZasoby: ${
                  item.data.stock === 'Infinite'
                    ? 'Nieograniczone'
                    : item.data.stock
                }${
                  item.data.author
                    ? ` • Wykonawca: <@${item.data.author.id}>`
                    : ''
                }\n\n`
            )
            .join(' ')}`
        )
        .setFooter({
          text: `Strona ${currentPage}/${numberOfPages} • ${numberOfItems} dostępnych przedmiotów`,
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
  } else if (interaction.options.getString('kategoria') === 'dotacje') {
    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle('Dotacje na serwer')
      .setDescription('https://tipply.pl/u/uncutdiamonds')

    return await interaction.reply({ embeds: [embed] })
  }
}
