import { Activities } from './../typings/index.d'
import {
  ClientOptions,
  ColorResolvable,
  GatewayIntentBits,
  HexColorString,
} from 'discord.js'
import dotenv from 'dotenv'
import { t } from './utils/exports'

dotenv.config()

const clientOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
}

const embedColor = (process.env.EMBED_COLOR as ColorResolvable) || '#00b2ff'

const ACTIVITIES = process.env.ACTIVITIES?.split(', ')
const ACTIVITY_TYPES = process.env.ACTIVITY_TYPES?.split(', ')

if (!ACTIVITIES || !ACTIVITY_TYPES) {
  throw new Error(t.global.missing_env + 'ACTIVITIES | ACTIVITY_TYPES')
}

const presenceData = {
  activities: ACTIVITIES.map((activity, i) => ({
    name: activity,
    type: ACTIVITY_TYPES[i] as unknown as keyof typeof Activities,
  })),
  interval: 1000 * 60 * 10,
}

const { APP_ID, GUILD_ID, BOT_TOKEN, UNBELIEVABOAT_TOKEN } = process.env

if (!APP_ID || !GUILD_ID || !BOT_TOKEN || !UNBELIEVABOAT_TOKEN) {
  throw new Error(
    t.global.missing_env + 'APP_ID | GUILD_ID | BOT_TOKEN | UNBELIEVABOAT_TOKEN'
  )
}

const config = {
  APP_ID,
  GUILD_ID,
  BOT_TOKEN,
  UNBELIEVABOAT_TOKEN,
}

export { clientOptions, embedColor, presenceData }

export default config
