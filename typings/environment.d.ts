declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      APP_ID: string
      GUILD_ID: string
      UNBELIEVABOAT_TOKEN: string
      DATABASE_URL: string
      EMBED_COLOR: string
      ALCO_COOLDOWN: number
      ACTIVITIES: string
      ACTIVITY_TYPES: string
    }
  }
}

export {}
