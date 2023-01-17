import { HexColorString } from 'discord.js'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      APP_ID: string
      GUILD_ID: string
      UNBELIEVABOAT_TOKEN: string
      DATABASE_URL: string
      EMBED_COLOR: HexColorString
      ALCO_COOLDOWN: number
      ACTIVITIES: string
      ACTIVITY_TYPES: string
      BIRTHDAY_ROLE_ID: string
    }
  }
}

export {}
