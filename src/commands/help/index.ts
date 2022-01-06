import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Replies with welcome message')

export async function execute(interaction: CommandInteraction) {
  return interaction.reply('Welcome')
}
