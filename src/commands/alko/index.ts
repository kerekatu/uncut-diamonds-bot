import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CONSTANTS } from '../../utils/constants'

const example = [
  { title: 'Żubr Ciemnozłoty', link: 'upload/zubr_ciemnozloty.webp' },
  {
    title: 'Lubuskie Miodowe Jasne',
    link: 'upload/1ec8c4fa012b53cf06f4ae01f38a49de.webp',
  },
  { title: 'Paulaner Salvator', link: 'upload/paulaner_salvator.webp' },
  {
    title: 'Senojo Vilniaus Tamsusis Alus',
    link: 'upload/senojo_vilniaus_tamsusis.webp',
  },
  { title: 'Fullers Discovery', link: 'upload/discovery_straight.webp' },
  { title: 'La Trappe Dubbel', link: 'upload/la_trappe_dubbel.webp' },
  { title: 'Wojak Jasny Pełny 6%', link: 'upload/wojak.webp' },
]

export const data = new SlashCommandBuilder()
  .setName('alko')
  .setDescription('Gra w zbieranie trunków')

export async function execute(interaction: CommandInteraction) {
  const randomItem = example[Math.floor(Math.random() * example.length)]
  const embed = new MessageEmbed()
    .setColor(CONSTANTS.color)
    .setTitle(randomItem.title)
    .setImage(`${CONSTANTS.URL_BEERS}/${randomItem.link}`)
  await interaction.reply({
    embeds: [embed],
  })
}
