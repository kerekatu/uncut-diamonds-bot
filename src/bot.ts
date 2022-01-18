import { ActivitiesOptions, Client } from 'discord.js'
import config from './config'
import * as commandModules from './commands'
import { Command } from './types'

const commands: { [key: string]: Command } = Object(commandModules)

export const client = new Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'DIRECT_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
  ],
})

client.once('ready', async () => {
  console.log('Discord bot initialized!')

  const guild = await client.guilds.fetch(`${process.env.GUILD_ID}`)

  const list: { activity: string; type: ActivitiesOptions['type'] }[] = [
    { activity: 'zabawa kuleczkami bucza', type: 'PLAYING' },
    { activity: 'najebany już jak ściana', type: 'LISTENING' },
    { activity: 'przywołuje demona hybrydę', type: 'STREAMING' },
    { activity: '/alko', type: 'PLAYING' },
    { activity: `wraz z ${guild.memberCount} diamentami`, type: 'PLAYING' },
  ]
  client.user?.setActivity(list[1].activity, {
    type: list[1].type,
  })
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  try {
    const { commandName } = interaction
    commands[commandName].execute(interaction, client)
  } catch (error) {
    console.log(error)
    await interaction.reply({
      content: 'Wystąpił błąd przy wykonywaniu komendy!',
      ephemeral: true,
    })
  }
})

client.login(config.BOT_TOKEN)
