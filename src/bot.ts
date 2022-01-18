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
    { activity: 'nawalony już jak ściana', type: 'LISTENING' },
    { activity: 'https://uncutdiamonds.top', type: 'WATCHING' },
    { activity: 'przywołuje demona hybrydę', type: 'STREAMING' },
    { activity: 'twitch.tv/tunczyczka', type: 'WATCHING' },
    { activity: '/alko', type: 'PLAYING' },
    { activity: `wraz z ${guild.memberCount} diamentami`, type: 'PLAYING' },
  ]

  client.user?.setActivity(list[0].activity, {
    type: list[0].type,
  })

  let index = 1
  setInterval(() => {
    if (index < list.length) index++
    if (index === list.length) index = 0

    client.user?.setActivity(list[index].activity, {
      type: list[index].type,
    })
  }, 1000 * 60 * 15)
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
