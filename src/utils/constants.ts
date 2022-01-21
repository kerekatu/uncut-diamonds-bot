import { HexColorString, Intents } from 'discord.js'

export const CONSTANTS = {
  prefix: 'k!',
  color: <HexColorString>'00b2ff',
  IMAGE_URLS: {
    alco: 'https://sklep-domwhisky.pl',
    beer: 'https://ocen-piwo.pl',
  },
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
}

export const COMMANDS = {
  admin: {
    name: 'admin',
    description: '🧰 Komendy administracyjne',
    permissionRole: 'Keramzyt',
    subCommands: {
      pytania: {
        name: 'pytania',
        description: '🧰 Ustawia kanał do pytań dnia',
      },
    },
  },
  alko: {
    name: 'alko',
    description: '🍺 Gra w zbieranie trunków',
    permissions: '',
    options: [],
  },
  info: {
    name: 'info',
    description: '🎂 Dodaj swoje urodziny do kalendarza',
    permissions: '',
    options: [],
  },
  urodziny: {
    name: 'urodziny',
    description: '💡 Wyświetla informacje na temat serwera',
    permissions: '',
    options: [],
  },
}

export const ERROR_REPLIES = {}
