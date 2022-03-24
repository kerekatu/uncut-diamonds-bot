import { SlashCommandBuilder } from '@discordjs/builders'
import { ChannelType } from 'discord-api-types'
import { Client, CommandInteraction } from 'discord.js'
import { COMMANDS } from '../../utils/constants'
import eventCommand from './event'
import pytaniaCommand from './pytania'

const { pytania } = COMMANDS.admin.subCommands

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

export async function execute(interaction: CommandInteraction, client: Client) {
  if (interaction.options.getSubcommand() === pytania.name) {
    await pytaniaCommand(interaction, client)
  } else if (interaction.options.getSubcommandGroup() === 'event') {
    await eventCommand(interaction)
  }
}
