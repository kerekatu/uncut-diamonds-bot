import { SlashCommandBuilder } from '@discordjs/builders'
import { PrismaClient } from '@prisma/client'
import { ChannelType } from 'discord-api-types'
import { Client, CommandInteraction } from 'discord.js'
import handleQuestions from '../../handlers/questions'
import { COMMANDS } from '../../utils/constants'

const prisma = new PrismaClient()
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
  .addSubcommand((subcommand) =>
    subcommand
      .setName(sugestie.name)
      .setDescription(sugestie.description)
      .addChannelOption((option) =>
        option
          .setName('kanał')
          .setDescription('Wybierz kanał')
          .setRequired(true)
          .addChannelType(ChannelType.GuildText)
      )
  )

export async function execute(interaction: CommandInteraction, client: Client) {
  if (interaction.options.getSubcommand() === pytania.name) {
    const channels = interaction.guild?.channels.cache
    const interactionChannelId = interaction.options?.getChannel('kanał')?.id

    if (
      !interactionChannelId ||
      !channels?.find((channel) => channel.id === interactionChannelId)
    ) {
      return await interaction.reply({
        content: 'Wybrany kanał nie istnieje!',
        ephemeral: true,
      })
    }

    const assignedChannel = await prisma.channels.upsert({
      where: {
        commandName: pytania.name,
      },
      update: { channelId: interactionChannelId },
      create: {
        commandName: pytania.name,
        channelId: interactionChannelId,
      },
    })

    if (!assignedChannel)
      return await interaction.reply({
        content: 'Nie udało się dodać danych do bazy!',
        ephemeral: true,
      })

    await handleQuestions(client)

    return await interaction.reply({
      content: 'Kanał do pytań został pomyślnie ustawiony!',
      ephemeral: true,
    })
  } else if (interaction.options.getSubcommand() === sugestie.name) {
    const channels = interaction.guild?.channels.cache
    const interactionChannelId = interaction.options?.getChannel('kanał')?.id

    if (
      !interactionChannelId ||
      !channels?.find((channel) => channel.id === interactionChannelId)
    ) {
      return await interaction.reply({
        content: 'Wybrany kanał nie istnieje!',
        ephemeral: true,
      })
    }

    const assignedChannel = await prisma.channels.upsert({
      where: {
        commandName: sugestie.name,
      },
      update: { channelId: interactionChannelId },
      create: {
        commandName: sugestie.name,
        channelId: interactionChannelId,
      },
    })

    if (!assignedChannel)
      return await interaction.reply({
        content: 'Nie udało się dodać danych do bazy!',
        ephemeral: true,
      })

    // client.on("message" , msg => {

    // })

    return await interaction.reply({
      content: 'Kanał do sugestii został pomyślnie ustawiony!',
      ephemeral: true,
    })
  }

  return await interaction.reply({
    content: 'Coś poszło nie tak...',
    ephemeral: true,
  })
}
