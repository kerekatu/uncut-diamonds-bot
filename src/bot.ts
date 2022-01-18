import { ActivitiesOptions, Client, Intents } from 'discord.js'
import config from './config'
import * as commandModules from './commands'
import { Command } from './types'
import { PrismaClient } from '@prisma/client'
import schedule from 'node-schedule'

const commands: { [key: string]: Command } = Object(commandModules)
const prisma = new PrismaClient()

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
})

client.once('ready', async () => {
  console.log('Discord bot initialized!')

  const birthdays = await prisma.birthdays.findMany()
  const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`)

  for (const birthday of birthdays) {
    const date = [...birthday.date.split('.')]
    schedule.scheduleJob(
      birthday.userId,
      { date: date[0], month: date[1] },
      async () => {
        const randomId = Math.floor(Math.random() * 100 + Date.now()).toString()
        const user = guild?.members.cache.get(birthday.userId)
        user?.roles.add('933011458864840774')

        schedule.scheduleJob(randomId, { minute: 59, hour: 23 }, () => {
          user?.roles.remove('933011458864840774')
          schedule.cancelJob(randomId)
        })
      }
    )
  }

  const list: { activity: string; type: ActivitiesOptions['type'] }[] = [
    { activity: 'nawalony już jak ściana', type: 'LISTENING' },
    { activity: 'https://uncutdiamonds.top', type: 'WATCHING' },
    { activity: 'przywołuje demona hybrydę', type: 'STREAMING' },
    { activity: 'twitch.tv/tunczyczka', type: 'WATCHING' },
    { activity: '/alko', type: 'PLAYING' },
    { activity: `wraz z ${guild?.memberCount} diamentami`, type: 'PLAYING' },
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
