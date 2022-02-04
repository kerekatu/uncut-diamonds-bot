// import { SlashCommandBuilder } from '@discordjs/builders'
// import { CommandInteraction } from 'discord.js'
// import { CommandData } from '../../../typings'
// import createCommand from '../../utils/create-command'

// const commandData: CommandData = {
//   name: 'event',
//   emoji: '🎫',
//   description: 'Wyświetla listę rozpoczętych eventów',
//   subCommands: [
//     {
//       name: 'start',
//       description: 'Zakłada i rozpoczyna nowy event',
//       options: [
//         {
//           name: 'nazwa',
//           description: 'Nazwij event',
//           type: 'STRING',
//         },
//       ],
//     },
//     {
//       name: 'stop',
//       description: 'Zakończa wybrany event',
//       options: [
//         {name: 'nazwa', description: 'Wybierz nazwę'}
//       ]
//     },
//     {
//       name: 'dołącz',
//       description: 'Zapisuje osobę do eventu',
//     },
//   ],
// }

// export const data = new SlashCommandBuilder()
//   .setName('event')
//   .setDescription('Wyświetla listę rozpoczętych eventów')
//   .addSubcommand((subcommand) =>
//     subcommand
//       .setName('start')
//       .setDescription('Zakłada i rozpoczyna nowy event')
//       .addStringOption((option) =>
//         option.setName('nazwa').setDescription('Nazwij event').setRequired(true)
//       )
//   )
//   .addSubcommand((subcommand) =>
//     subcommand
//       .setName('stop')
//       .setDescription('Zakończa wybrany event')
//       .addStringOption((option) =>
//         option.setName('nazwa').setDescription('Nazwa eventu').setRequired(true)
//       )
//   )
//   .addSubcommand((subcommand) =>
//     subcommand
//       .setName('dołącz')
//       .setDescription('Dołącz do eventu')
//       .addStringOption((option) =>
//         option.setName('nazwa').setDescription('Nazwa eventu').setRequired(true)
//       )
//   )
//   .addSubcommand((subcommand) =>
//     subcommand
//       .setName('lista')
//       .setDescription('Wyświetla listę aktualnych eventów')
//   )

// export async function execute(interaction: CommandInteraction) {
//   if (interaction.options.getSubcommand() === 'start') {

//   }

//   return await interaction.reply({
//     content: 'Coś poszło nie tak...',
//     ephemeral: true,
//   })
// }
