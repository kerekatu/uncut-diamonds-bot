import dotenv from 'dotenv'
dotenv.config()

const { APP_ID, GUILD_ID, BOT_TOKEN } = process.env

if (!APP_ID || !GUILD_ID || !BOT_TOKEN) {
  throw new Error('Missing environment variables')
}

const config: Record<string, string> = {
  APP_ID,
  GUILD_ID,
  BOT_TOKEN,
}

export default config
