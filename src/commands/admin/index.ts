import { SlashCommandBuilder } from '@discordjs/builders'
import { PrismaClient } from '@prisma/client'
import { ChannelType } from 'discord-api-types'
import { Client, CommandInteraction } from 'discord.js'
import handleQuestions from '../../handlers/questions'
import { COMMANDS } from '../../utils/constants'
import eventCommand from './event'
import pytaniaCommand from './pytania'

const { pytania, sugestie } = COMMANDS.admin.subCommands

export const data = new SlashCommandBuilder()
  .setDefaultPermission(false)
  .setName(COMMANDS.admin.name)
  .setDescription(COMMANDS.admin.description)
  .addSubcommand((subcommand) =>
    subcommand
      .setName(pytania.name)
      .setDescription(pytania.description)
      .addChannelOption((option) =>
        option
          .setName('kanał')
          .setDescription('Wybierz kanał')
          .setRequired(true)
          .addChannelType(ChannelType.GuildText)
      )
  )
  .addSubcommandGroup((subcommands) =>
    subcommands
      .setName('event')
      .setDescription('Zakłada i rozpoczyna nowy event')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('start')
          .setDescription('Zakłada i rozpoczyna nowy event')
          .addStringOption((option) =>
            option
              .setName('nazwa')
              .setDescription('Podaj nazwę eventu')
              .setRequired(true)
          )
          .addNumberOption((option) =>
            option
              .setName('dzień')
              .setDescription('Wybierz dzień miesiąca (1-31)')
              .setRequired(true)
              .setMinValue(1)
              .setMaxValue(31)
          )
          .addNumberOption((option) =>
            option
              .setName('miesiąc')
              .setDescription('Wybierz miesiąc w roku (1-12)')
              .setRequired(true)
              .setMinValue(1)
              .setMaxValue(12)
          )
          .addNumberOption((option) =>
            option
              .setName('godzina')
              .setDescription('Wybierz godzinę (0-23)')
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(23)
          )
          .addNumberOption((option) =>
            option
              .setName('minuta')
              .setDescription('Wybierz minutę (0-59)')
              .setRequired(true)
              .setMinValue(0)
              .setMaxValue(59)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('stop')
          .setDescription('Zakończa wybrany event')
          .addStringOption((option) =>
            option
              .setName('nazwa')
              .setDescription('Nazwa eventu')
              .setRequired(true)
          )
      )
  )
// .addSubcommand((subcommand) =>
//   subcommand
//     .setName(sugestie.name)
//     .setDescription(sugestie.description)
//     .addChannelOption((option) =>
//       option
//         .setName('kanał')
//         .setDescription('Wybierz kanał')
//         .setRequired(true)
//         .addChannelType(ChannelType.GuildText)
//     )
// )

export async function execute(interaction: CommandInteraction, client: Client) {
  if (interaction.options.getSubcommand() === pytania.name) {
    await pytaniaCommand(interaction, client)
  } else if (interaction.options.getSubcommandGroup() === 'event') {
    await eventCommand(interaction)
  }
  // else if (interaction.options.getSubcommand() === sugestie.name) {
  //   const channels = interaction.guild?.channels.cache
  //   const interactionChannelId = interaction.options?.getChannel('kanał')?.id

  //   if (
  //     !interactionChannelId ||
  //     !channels?.find((channel) => channel.id === interactionChannelId)
  //   ) {
  //     return await interaction.reply({
  //       content: 'Wybrany kanał nie istnieje!',
  //       ephemeral: true,
  //     })
  //   }

  //   const assignedChannel = await prisma.channels.upsert({
  //     where: {
  //       commandName: sugestie.name,
  //     },
  //     update: { channelId: interactionChannelId },
  //     create: {
  //       commandName: sugestie.name,
  //       channelId: interactionChannelId,
  //     },
  //   })

  //   if (!assignedChannel)
  //     return await interaction.reply({
  //       content: 'Nie udało się dodać danych do bazy!',
  //       ephemeral: true,
  //     })

  //   // client.on("message" , msg => {

  //   // })

  //   return await interaction.reply({
  //     content: 'Kanał do sugestii został pomyślnie ustawiony!',
  //     ephemeral: true,
  //   })
  // }

  // return await interaction.reply({
  //   content: 'Coś poszło nie tak...',
  //   ephemeral: true,
  // })
}
