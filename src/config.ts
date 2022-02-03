import {
  ActivityType,
  ClientOptions,
  HexColorString,
  Intents,
} from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

export const clientOptions: ClientOptions = {
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  retryLimit: 3,
}

export const embedColor =
  <HexColorString>(process.env.EMBED_COLOR as string) || '#00b2ff'

export const presenceData = {
  activities: (JSON.parse(process.env.ACTIVITIES || '[]') as string[]).map(
    (activity, i) => ({
      name: activity,
      type: ((JSON.parse(process.env.ACTIVITY_TYPES || '[]') as string[])[
        i
      ].toUpperCase() || 'PLAYING') as Exclude<ActivityType, 'CUSTOM'>,
    })
  ),
  interval: 1000 * 60 * 10,
}

const { APP_ID, GUILD_ID, BOT_TOKEN } = process.env

if (!APP_ID || !GUILD_ID || !BOT_TOKEN) {
  throw new Error('Missing environment variables')
}

const config = {
  APP_ID,
  GUILD_ID,
  BOT_TOKEN,
}

export default config
